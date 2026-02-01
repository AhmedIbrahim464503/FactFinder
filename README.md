# FactFinder (Automated Research Explorer)

FactFinder is an AI-powered research assistant that automates document retrieval, processing, and knowledge extraction.

## Features
- **Automated Retrieval**: Fetches relevant papers/articles from ArXiv and the Web.
- **Deep Analysis**: Uses LangChain agents to summarize and extract key insights.
- **Knowledge Graph**: Visualizes relationships between entities.
- **Interactive UI**: Modern React interface for exploring results.

## Prerequisites
- Python 3.9+
- Node.js 16+
- OpenAI API Key

## Setup

1. **Clone the repository**
   ```bash
   git clone <repo-url>
   cd FactFinder
   ```

2. **Backend Setup**
   ```bash
   # Create virtual environment
    python -m venv venv
    
    # Activate (Windows)
    .\venv\Scripts\activate
    
    # Install dependencies
    pip install -r backend/requirements.txt
   ```
   
   **Environment Variables**:
   Create a `.env` file in `backend/` with:
   ```
   OPENAI_API_KEY=sk-...
   ```

3. **Frontend Setup**
   ```bash
   cd frontend
   npm install
   ```

## Running the Application

1. **Start Backend**
   ```bash
   # From root directory
   .\venv\Scripts\uvicorn backend.main:app --reload
   ```
   Backend runs on `http://localhost:8000`

2. **Start Frontend**
   ```bash
   cd frontend
   npm run dev
   ```
   Frontend runs on `http://localhost:5173`

## Usage
1. Open the frontend URL.
2. Enter a research topic (e.g., "Generative AI in Medicine").
3. View the summary, extracted data, and knowledge graph.

