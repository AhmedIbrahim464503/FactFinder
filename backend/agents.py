from langchain_community.retrievers import ArxivRetriever
from langchain_community.tools import DuckDuckGoSearchRun
from langchain_community.utilities import DuckDuckGoSearchAPIWrapper
from langchain_core.documents import Document
from langchain_openai import ChatOpenAI
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser
import os
from dotenv import load_dotenv

load_dotenv()

# Initialize LLM
llm = ChatOpenAI(model="gpt-4o", temperature=0)

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

    # 2. Web Search (DuckDuckGo) -> In a real app, we'd scrape the URLs. 
    # For now, we'll take the snippets as mini-docs.
    try:
        print(f"Searching Web for: {topic}")
        search = DuckDuckGoSearchRun()
        web_results = search.invoke(f"research paper {topic}")
        # Create a document from the web result
        docs.append(Document(page_content=web_results, metadata={"source": "StartPage/DuckDuckGo"}))
    except Exception as e:
        print(f"Web Search Error: {e}")
        
    return docs

def summarize_documents(docs: list[Document]) -> str:
    """
    Summarizes a list of documents using an LLM chain.
    """
    if not docs:
        return "No documents found to summarize."
        
    # Simple map-reduce or concat strategy
    # For speed, we will concat document content (truncated) and ask for a summary.
    
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
