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

@app.post("/research")
async def start_research(request: ResearchRequest):
    # This is a placeholder for triggering the LangGraph workflow
    # In a real scenario, we might want to return a job ID and stream results
    # For now, we'll await the result (might be slow) or just return structure
    
    result = await research_workflow.ainvoke({"topic": request.topic})
    return result

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
