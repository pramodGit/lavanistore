# 🤖 Lavani AI Assistant

An Agentic AI-powered customer support assistant built for the **Lavani Wellness** e-commerce platform.

The assistant combines **Tool Calling**, **Retrieval-Augmented Generation (RAG)**, and **Google Gemini 2.5 Flash** to answer customer queries using both **live business data** and **enterprise knowledge**, while minimizing hallucinations.

---

# 🏗️ Architecture

```text
                        React Chat UI
                              │
                              ▼
                      Node.js AI Gateway
                              │
                              ▼
                     Agentic AI Pipeline
                              │
        ┌───────────────┬───────────────┬───────────────┐
        │               │               │
        ▼               ▼               ▼
     Planner      Tool Executor     Reflection
        │               │               │
        └───────────────┴───────────────┘
                              │
                              ▼
                     Gemini 2.5 Flash
                              │
        ┌─────────────────────┴─────────────────────┐
        │                                           │
        ▼                                           ▼
 Tool Registry                               Knowledge Service
        │                                           │
        │                                    Vector Knowledge Source
        │                                           │
        │                                    Retriever (FAISS)
        │                                           │
        ▼                                           ▼
 Live Business Data                         Business Documents
 (MySQL APIs)                          (FAQ, Policies, Manuals)
```

---

# 🚀 AI Features

- ✅ Agentic AI Pipeline
- ✅ Planner-based reasoning
- ✅ Tool Calling
- ✅ Reflection Stage
- ✅ Retrieval-Augmented Generation (RAG)
- ✅ FAISS Vector Search
- ✅ Conversation History
- ✅ Automatic Knowledge Synchronization
- ✅ Live Retriever Reload
- ✅ Production-ready PM2 Cluster deployment

---

# 🧠 AI Strategy

### Tool Calling

Retrieves **live transactional data** from business systems.

Examples:

- Orders
- Customers
- Products
- Shipments
- Returns

---

### Retrieval-Augmented Generation (RAG)

Retrieves contextual business knowledge from documents such as:

- FAQs
- Shipping Policy
- Return Policy
- Product Manuals

The retrieved context is injected into the prompt before sending it to Gemini.

---

### Gemini 2.5 Flash

Gemini is responsible for:

- Understanding user intent
- Planning tool usage
- Reasoning over retrieved information
- Generating natural language responses

---

### Hallucination Mitigation

The assistant reduces hallucinations by grounding responses using:

- Live business data through Tool Calling
- Business documents through RAG
- Enterprise prompts
- Reflection stage before final response generation

---

# 📚 Knowledge Synchronization

Business knowledge updates automatically.

Whenever a document is:

- Added
- Modified
- Deleted

the system automatically:

```
Watch Document Changes
        │
        ▼
KnowledgeWatcher
        │
        ▼
KnowledgeSyncService
        │
        ▼
Rebuild FAISS Index
        │
        ▼
Regenerate Metadata
        │
        ▼
Reload Retriever
        │
        ▼
Latest Knowledge Available
```

No manual indexing.

No backend restart.

No PM2 restart.

---

# 🛠️ Current AI Tools

| Tool | Status |
|------|--------|
| getOrder() | ✅ |
| searchProducts() | 🚧 |
| getCustomer() | 🚧 |
| trackShipment() | 🚧 |
| createReturn() | 🚧 |
| recommendProducts() | 🚧 |

---

# 💻 Technology Stack

## Frontend

- React
- TypeScript
- Vite
- CSS

## Backend

- Node.js
- Express.js

## AI

- Google Gemini 2.5 Flash
- Agentic AI
- Tool Calling
- Retrieval-Augmented Generation (RAG)
- FAISS Vector Search
- Hugging Face Sentence Transformers

## Database

- MySQL
- Redis

## Infrastructure

- PM2 Cluster Mode
- Nginx
- Ubuntu Server

---

# 📌 Current Roadmap

## Core AI

- [x] Gemini Integration
- [x] AI Chat Endpoint
- [x] Conversation History
- [x] Agentic AI Pipeline
- [x] Planner
- [x] Tool Executor
- [x] Reflection Stage

---

## Knowledge Base

- [x] RAG Integration
- [x] FAISS Vector Search
- [x] Automatic Knowledge Synchronization
- [x] Live Retriever Reload

---

## Business Tools

- [x] Order Lookup
- [ ] Product Search
- [ ] Shipment Tracking
- [ ] Customer Lookup
- [ ] Return Management
- [ ] Product Recommendation

---

## Future Enhancements

- [ ] Persistent Conversation Memory
- [ ] Multi-step Agent Execution
- [ ] Multi-Agent Collaboration
- [ ] MCP (Model Context Protocol)
- [ ] Hybrid Search (Vector + Keyword)
- [ ] Observability & AI Metrics

---

# 🌐 Live Project

**Lavani Wellness**

https://lavanistore.in

---

# 🎯 Design Goals

- Production-ready architecture
- Modular AI components
- Extensible Tool Registry
- Pluggable Knowledge Sources
- Minimal hallucinations
- Automatic knowledge synchronization
- Scalable deployment using PM2 Cluster

---

> **The assistant combines Tool Calling for live business data, Retrieval-Augmented Generation (RAG) for enterprise knowledge, and Gemini 2.5 Flash for planning and response generation, enabling accurate, grounded, and production-ready AI interactions.**
