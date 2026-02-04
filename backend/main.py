from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import asyncio
from dotenv import load_dotenv
from workflow import research_workflow

load_dotenv()

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ResearchRequest(BaseModel):
    topic: str

@app.get("/")
def read_root():
    return {"status": "FactBinder Backend Running"}

from fastapi.responses import StreamingResponse
import json

@app.post("/research")
async def start_research(request: ResearchRequest):
    async def event_stream():
        # Stream events from LangGraph
        async for event in research_workflow.astream({"topic": request.topic}):
            # Each event is a dictionary of the state update
            # e.g. {'retrieve': {'documents': [...]}} or {'process': {'summary': ..., 'graph_data': ...}}
            
            for node_name, state_update in event.items():
                data = {
                    "node": node_name,
                    "update": {k: str(v) if k == 'documents' else v for k, v in state_update.items()}
                }
                # Sanitize documents for network (too large to send full objects sometimes, but here we send all)
                # Actually, specialized handling:
                if node_name == "retrieve":
                     yield f"data: {json.dumps({'type': 'status', 'message': 'Documents Retrieved'})}\n\n"
                     yield f"data: {json.dumps({'type': 'documents', 'data': [d.dict() for d in state_update['documents']]})}\n\n"
                
                elif node_name == "process":
                     yield f"data: {json.dumps({'type': 'status', 'message': 'Processing Complete'})}\n\n"
                     yield f"data: {json.dumps({'type': 'result', 'summary': state_update['summary'], 'graph_data': state_update.get('graph_data')})}\n\n"
                     
                     # Save to history
                     from database import save_research_history
                     save_research_history(request.topic, state_update['summary'], state_update.get('graph_data'))

        yield f"data: {json.dumps({'type': 'complete'})}\n\n"

    return StreamingResponse(event_stream(), media_type="text/event-stream")

@app.get("/history")
def read_history():
    from database import get_research_history
    return get_research_history()

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
