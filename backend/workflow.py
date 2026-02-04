from langgraph.graph import StateGraph, END
from typing import TypedDict, List
from langchain_core.documents import Document
import agents 

class ResearchState(TypedDict):
    topic: str
    documents: List[Document]
    summary: str
    graph_data: dict
    
def retrieve_docs(state: ResearchState):
    # This is a generator-compatible step, but in the graph node it just returns state update
    print(f"Retrieving docs for: {state['topic']}")
    docs = agents.retrieve_documents(state['topic'])
    return {"documents": docs}

def process_docs(state: ResearchState):
    print("Processing docs (Summary + KG)...")
    summary = agents.summarize_documents(state['documents'])
    graph_data = agents.extract_knowledge_graph(state['documents'])
    return {"summary": summary, "graph_data": graph_data}


# Graph Definition
workflow = StateGraph(ResearchState)

workflow.add_node("retrieve", retrieve_docs)
workflow.add_node("process", process_docs)

workflow.set_entry_point("retrieve")
workflow.add_edge("retrieve", "process")
workflow.add_edge("process", END)

research_workflow = workflow.compile()
