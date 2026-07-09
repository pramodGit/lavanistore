# 🤖 Lavani AI Assistant

## Architecture

```text
React Chat UI
      │
      ▼
Node AI Gateway
      │
      ▼
Gemini 2.5 Flash
      │
      ├── Tool Registry
      │      ├── getOrder()
      │      ├── searchProducts()
      │      ├── trackShipment()
      │      ├── getCustomer()
      │      ├── createReturn()
      │      └── recommendProducts()
      │
      ├── RAG (Knowledge Base)
      │      ├── FAQs
      │      ├── Return Policy
      │      ├── Shipping Policy
      │      └── Product Manuals
      │
      └── MySQL Database
```

## AI Strategy

- **Tool Calling** → Retrieves live business data (Orders, Customers, Products, etc.).
- **RAG** → Retrieves business knowledge from documents such as FAQs, policies, and manuals.
- **Gemini 2.5 Flash** → Performs reasoning, tool selection, and natural language generation.
- **MySQL** → Source of truth for transactional data.

> Combining **Tool Calling**, **RAG**, and a capable LLM such as **Gemini 2.5 Flash** significantly reduces hallucinations compared to relying on the language model alone.

---

## Current AI Tools

- ✅ `getOrder()`
- 🚧 `searchProducts()`
- 🚧 `trackShipment()`
- 🚧 `getCustomer()`
- 🚧 `createReturn()`
- 🚧 `recommendProducts()`

---

## Roadmap

- [x] Gemini Integration
- [x] AI Chat Endpoint
- [x] Tool Registry
- [x] getOrder Tool
- [x] React Chat UI
- [x] Conversation History
- [ ] Persistent Conversation Memory
- [ ] Product Search Tool
- [ ] Customer Tool
- [ ] Shipment Tracking Tool
- [ ] RAG Integration
- [ ] Multi-Agent Support