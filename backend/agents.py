from langchain_community.retrievers import ArxivRetriever
from langchain_community.tools import DuckDuckGoSearchRun
from langchain_core.documents import Document
from langchain_google_genai import ChatGoogleGenerativeAI, GoogleGenerativeAIEmbeddings
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser
from langchain_community.vectorstores import SupabaseVectorStore
from database import get_supabase_client
import os
from dotenv import load_dotenv

load_dotenv()

# Initialize Gemini LLM
if not os.environ.get("GOOGLE_API_KEY"):
    print("WARNING: GOOGLE_API_KEY not found in .env")

llm = ChatGoogleGenerativeAI(model="gemini-pro", temperature=0)

# Initialize Embeddings
embeddings = GoogleGenerativeAIEmbeddings(model="models/embedding-001")

def retrieve_documents(topic: str) -> list[Document]:
    """
    Retrieves documents from ArXiv and Web Search.
    """
    docs = []
    
    # 1. ArXiv Retrieval
    try:
        print(f"Searching ArXiv for: {topic}")
        arxiv_retriever = ArxivRetriever(load_max_docs=3)
        arxiv_docs = arxiv_retriever.invoke(topic)
        docs.extend(arxiv_docs)
    except Exception as e:
        print(f"ArXiv Error: {e}")

    # 2. Web Search
    try:
        print(f"Searching Web for: {topic}")
        search = DuckDuckGoSearchRun()
        web_results = search.invoke(f"research paper {topic}")
        docs.append(Document(page_content=web_results, metadata={"source": "DuckDuckGo"}))
    except Exception as e:
        print(f"Web Search Error: {e}")

    # 3. Store in Supabase
    try:
        supabase = get_supabase_client()
        vector_store = SupabaseVectorStore(
            client=supabase,
            embedding=embeddings,
            table_name="documents",
            query_name="match_documents"
        )
        vector_store.add_documents(docs)
        print(f"Stored {len(docs)} documents in Supabase.")
    except Exception as e:
        print(f"Supabase Storage Error: {e}")
        
    return docs

def summarize_documents(docs: list[Document]) -> str:
    """
    Summarizes a list of documents using Gemini.
    """
    if not docs:
        return "No documents found to summarize."
        
    # Truncate content specifically for Gemini's context window (though it's large)
    combined_text = "\n\n".join([f"Source: {d.metadata.get('source', 'Unknown')}\nContent: {d.page_content[:4000]}" for d in docs])
    
    prompt = ChatPromptTemplate.from_template(
        """You are an expert research assistant. 
        Analyze the following text which contains content from multiple research documents on the topic.
        
        Provide a structured summary including:
        1. Key Findings
        2. Methodologies mentioned
        3. Consensus vs. Disagreements
        
        Text:
        {text}
        """
    )
    
    chain = prompt | llm | StrOutputParser()
    return chain.invoke({"text": combined_text})

def extract_knowledge_graph(docs: list[Document]) -> dict:
    """
    Extracts a Knowledge Graph (nodes and edges) from documents using Gemini.
    """
    if not docs:
        return {"nodes": [], "links": []}
    
    # Combined text for KG extraction
    combined_text = "\n\n".join([f"{d.page_content[:2000]}" for d in docs])

    prompt = ChatPromptTemplate.from_template(
        """You are an expert at extracting knowledge graphs.
        Analyze the following text and extract key entities and their relationships.
        
        Return the result EXACTLY as a JSON object with the following structure:
        {{
            "nodes": [
                {{"id": "Entity Name", "group": "Type (e.g., Concept, Person, Technology)"}}
            ],
            "links": [
                {{"source": "Entity Name", "target": "Entity Name", "value": "Relationship description"}}
            ]
        }}
        
        Do not add any markdown formatting (like ```json). Just return the raw JSON string.
        Limit to the top 15 most important entities and relationships.
        
        Text:
        {text}
        """
    )
    
    chain = prompt | llm | StrOutputParser()
    try:
        result_str = chain.invoke({"text": combined_text})
        # Clean up if Gemini wraps in markdown
        result_str = result_str.strip().replace("```json", "").replace("```", "")
        import json
        return json.loads(result_str)
    except Exception as e:
        print(f"KG Extraction Error: {e}")
        return {"nodes": [], "links": []}
