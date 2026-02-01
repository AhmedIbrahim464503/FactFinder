from langgraph.graph import StateGraph, END
from typing import TypedDict, List
from langchain_core.documents import Document
import agents 

class ResearchState(TypedDict):
    topic: str
    documents: List[Document]
    summary: str
    
def retrieve_docs(state: ResearchState):
    print(f"Retrieving docs for: {state['topic']}")
    docs = agents.retrieve_documents(state['topic'])
    return {"documents": docs}

def process_docs(state: ResearchState):
    print("Processing docs...")
    summary = agents.summarize_documents(state['documents'])
    # Simple KG extraction (mockup for now, could use GLINER or LLM)
    return {"summary": summary}


# Graph Definition
workflow = StateGraph(ResearchState)

workflow.add_node("retrieve", retrieve_docs)
workflow.add_node("process", process_docs)

workflow.set_entry_point("retrieve")
workflow.add_edge("retrieve", "process")
workflow.add_edge("process", END)

research_workflow = workflow.compile()
