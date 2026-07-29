from fastapi import FastAPI
from pydantic import BaseModel
from sentence_transformers import SentenceTransformer

app = FastAPI()

print("Loading embedding model...")

model = SentenceTransformer(
    "all-MiniLM-L6-v2"
)

print("Embedding model loaded.")

class EchoRequest(BaseModel):
    text: str

class EmbeddingRequest(BaseModel):
    texts: list[str]

@app.get("/health")
def health():
    return {
        "status": "ok"
    }

@app.post("/api/embeddings")
def embeddings(request: EmbeddingRequest):

    vectors = model.encode(
        request.texts,
        convert_to_numpy=True
    ).tolist()

    print(f"Embedded {len(vectors)} texts")
    print(f"Dimensions: {len(vectors[0])}")

    return {
        "vectors": vectors
    }

@app.post("/echo")
def echo(data: EchoRequest):
    return {
        "message": data.text
    }