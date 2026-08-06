"""
================================================================================
PACK COMPLET UNIFIÉ : SERVEUR MCP - ISLAM AGENT ÉPISTÉMIQUE (RAG LOCAL & CHROMADB)
================================================================================
Ce fichier unique contient l'intégralité du code pour votre serveur MCP :
- Chargeur de données : Coran (JSON), Hadiths, Tafsir
- Transcripteur Multimédia : Fichiers Audio (.mp3, .wav) et Vidéo (.mp4, .mkv) via Whisper
- Base de données Vectorielle : ChromaDB local avec embeddings HuggingFace
- Moteur RAG & LangChain : Recherche sémantique et préparation des contextes
- API du Protocole MCP : Endpoints POST /mcp et GET pour vos agents IA
================================================================================
INSTALLATION DES DÉPENDANCES (1 seule commande) :
pip install fastapi uvicorn langchain langchain-chroma chromadb sentence-transformers openai-whisper ffmpeg-python pydantic
================================================================================
EXÉCUTION DU SERVEUR :
python mcp_server_full.py
================================================================================
"""

import os
import json
import whisper
from typing import List, Dict, Any, Optional
from pydantic import BaseModel
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from langchain_core.documents import Document
from langchain_chroma import Chroma
from langchain_community.embeddings import HuggingFaceEmbeddings

# ==============================================================================
# 1. INITIALISATION DU SERVEUR FASTAPI & CONFIGURATION CORS
# ==============================================================================
app = FastAPI(
    title="Serveur MCP - Islam Agent Épistémique",
    description="Serveur MCP RAG Local unifié pour Coran, Hadiths, Tafsir et Multimédia",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ==============================================================================
# 2. VECTORSTORE CHROMADB & EMBEDDINGS LOCAUX
# ==============================================================================
print("🔒 Chargement du modèle d'embedding local HuggingFace (all-MiniLM-L6-v2)...")
embeddings = HuggingFaceEmbeddings(model_name="all-MiniLM-L6-v2")

CHROMA_DIR = "./chroma_db_mcp"
vector_store = Chroma(
    collection_name="islamic_mcp_knowledge_base",
    embedding_function=embeddings,
    persist_directory=CHROMA_DIR
)

# Modèle Whisper local pour transcription Audio/Vidéo
whisper_model = None

def get_whisper():
    global whisper_model
    if whisper_model is None:
        print("🎙️ Chargement du modèle Whisper local...")
        whisper_model = whisper.load_model("base")
    return whisper_model

# ==============================================================================
# 3. FONCTIONS D'INGESTION MULTIMÉDIA ET DONNÉES (JSON, AUDIO, VIDÉO)
# ==============================================================================

def ingest_quran_json(json_path: str) -> int:
    """ Charge et vectorise le fichier Coran / Hadiths / Tafsir JSON """
    if not os.path.exists(json_path):
        print(f"⚠️ Fichier {json_path} introuvable.")
        return 0
    
    with open(json_path, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    surahs = data.get("sourates", data.get("surahs", []))
    docs = []
    
    for item in surahs:
        s_id = item.get("id")
        nom = item.get("nom", item.get("transliteration", ""))
        trad = item.get("traduction", item.get("translation", ""))
        v_count = item.get("versets", item.get("total_verses", 0))
        t_type = item.get("type", "meccan")
        
        content = f"Sourate n°{s_id}: {nom} ({trad}). Type: {t_type}. Nombre de versets: {v_count}."
        
        doc = Document(
            page_content=content,
            metadata={
                "source": "quran_json",
                "surah_id": s_id,
                "surah_name": nom,
                "type": t_type,
                "content_type": "text/quran"
            }
        )
        docs.append(doc)
    
    if docs:
        vector_store.add_documents(docs)
        print(f"✅ {len(docs)} sourates intégrées dans ChromaDB.")
    return len(docs)


def ingest_audio_video_media(media_path: str, media_type: str = "audio") -> int:
    """ Transcrit et vectorise des fichiers .mp3, .wav, .mp4, .mkv """
    if not os.path.exists(media_path):
        print(f"⚠️ Fichier média {media_path} introuvable.")
        return 0
    
    model = get_whisper()
    print(f"🎙️ Transcription du média {media_type}: {media_path}...")
    result = model.transcribe(media_path, language="fr")
    
    docs = []
    for seg in result.get("segments", []):
        start_m, start_s = divmod(int(seg["start"]), 60)
        end_m, end_s = divmod(int(seg["end"]), 60)
        time_code = f"{start_m:02d}:{start_s:02d} - {end_m:02d}:{end_s:02d}"
        
        doc = Document(
            page_content=f"[{time_code}] {seg['text'].strip()}",
            metadata={
                "source": os.path.basename(media_path),
                "media_type": media_type,
                "time_code": time_code,
                "start_seconds": seg["start"],
                "content_type": f"{media_type}/transcript"
            }
        )
        docs.append(doc)
    
    if docs:
        vector_store.add_documents(docs)
        print(f"✅ {len(docs)} segments {media_type} vectorisés dans ChromaDB.")
    return len(docs)

# ==============================================================================
# 4. SCHÉMA DU PROTOCOLE MCP (REQUEST / PARAMS)
# ==============================================================================

class MCPParams(BaseModel):
    query: Optional[str] = ""
    max_results: Optional[int] = 10
    id: Optional[int] = None
    sourate: Optional[int] = None
    verset: Optional[int] = None

class MCPRequest(BaseModel):
    tool: str
    params: Optional[MCPParams] = MCPParams()

# ==============================================================================
# 5. ROUTES D'API DU SERVEUR MCP
# ==============================================================================

@app.get("/")
def read_root():
    return {
        "name": "Serveur MCP - Islam Agent Épistémique",
        "version": "1.0.0",
        "status": "online",
        "vector_store": "ChromaDB (Local)",
        "endpoints": {
            "mcp_interface": "POST /mcp",
            "quran_search": "GET /quran/search?q=...",
            "health_check": "GET /health"
        }
    }

@app.get("/health")
def health_check():
    return {"status": "ok", "service": "mcp-server"}

@app.post("/mcp")
def execute_mcp_tool(req: MCPRequest):
    """ Interface d'exécution unifiée pour le Protocole MCP """
    tool = req.tool
    params = req.params or MCPParams()
    
    results = []
    source = ""
    
    # Recherche vectorielle sémantique dans ChromaDB
    if tool in ["search_quran", "search_hadiths", "search_tafsir", "search_all"]:
        q = params.query or ""
        limit = params.max_results or 10
        
        docs = vector_store.similarity_search(q, k=limit)
        for doc in docs:
            results.append({
                "content": doc.page_content,
                "metadata": doc.metadata
            })
        source = "ChromaDB_VectorStore"
    
    elif tool == "get_sourate":
        s_id = params.id or 1
        docs = vector_store.similarity_search(f"Sourate n°{s_id}:", k=5)
        results = [{"content": d.page_content, "metadata": d.metadata} for d in docs]
        source = "ChromaDB_Surah_Index"

    else:
        raise HTTPException(status_code=400, detail=f"Outil MCP non reconnu : '{tool}'")

    return {
        "tool": tool,
        "source": source,
        "query": params.query or "",
        "count": len(results),
        "results": results
    }

@app.get("/quran/search")
def search_direct(q: str = "", limit: int = 10):
    docs = vector_store.similarity_search(q, k=limit)
    return {
        "query": q,
        "count": len(docs),
        "results": [{"content": d.page_content, "metadata": d.metadata} for d in docs]
    }

# ==============================================================================
# 6. DÉMARRAGE DU SERVEUR MCP
# ==============================================================================
if __name__ == "__main__":
    import uvicorn
    print("=" * 60)
    print("🕌 SERVEUR MCP ISLAM AGENT ÉPISTÉMIQUE - PACK UNIFIÉ")
    print("=" * 60)
    print("🌐 Lancement du serveur sur http://0.0.0.0:8000 ...")
    uvicorn.run(app, host="0.0.0.0", port=8000)
