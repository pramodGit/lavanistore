# Knowledge Synchronization

## Overview

The Knowledge Synchronization module automatically keeps the RAG knowledge base up to date whenever knowledge documents change.

No manual indexing or backend restart is required.

---

## Flow

Document Updated

↓

KnowledgeWatcher

↓

KnowledgeSyncService

↓

IndexBuilder

↓

FAISS Index + Metadata

↓

Retriever.reload()

↓

Latest knowledge available to AI

---

## Components

### KnowledgeWatcher

Monitors:

backend/ai/documents/

using chokidar.

Triggers synchronization when a file is:

- Added
- Modified
- Deleted

Debounce is used to avoid multiple rebuilds during rapid file saves.

---

### KnowledgeSyncService

Coordinates synchronization.

Responsibilities:

- Prevent concurrent indexing using static lock
- Rebuild vector index
- Reload shared retriever
- Log synchronization status

---

### IndexBuilder

Performs:

- Load documents
- Chunk documents
- Generate embeddings
- Build FAISS index
- Save metadata

Output:

ai/rag/data/index.faiss

ai/rag/data/metadata.json

---

### Retriever Registry

Provides a single shared Retriever instance across the application.

This ensures that after reload(), all future searches use the latest index immediately.

---

## Startup

KnowledgeWatcher starts only in the Primary Cluster process.

Workers never watch files.

This prevents duplicate indexing.

---

## Benefits

- Automatic synchronization
- No manual build
- No PM2 restart
- No backend restart
- Production ready