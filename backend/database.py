import os
from supabase import create_client, Client
from dotenv import load_dotenv

load_dotenv()

url: str = os.environ.get("SUPABASE_URL")
key: str = os.environ.get("SUPABASE_KEY")

if not url or not key:
    raise ValueError("SUPABASE_URL and SUPABASE_KEY must be set in .env")

supabase: Client = create_client(url, key)

def get_supabase_client():
    return supabase

def save_research_history(topic: str, summary: str, graph_data: dict):
    try:
        data = {
            "topic": topic,
            "summary": summary,
            "graph_data": graph_data
        }
        supabase.table("search_history").insert(data).execute()
    except Exception as e:
        print(f"Error saving history: {e}")

def get_research_history():
    try:
        response = supabase.table("search_history").select("*").order("created_at", desc=True).limit(10).execute()
        return response.data
    except Exception as e:
        print(f"Error fetching history: {e}")
        return []
