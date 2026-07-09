/* A robust AI assistant */

React Chat
      │
      ▼
Node AI Gateway
      │
      ├── Gemini 2.5 Flash
      │
      ├── Tool Registry
      │      ├── getOrder()
      │      ├── searchProducts()
      │      ├── trackShipment()
      │      ├── getCustomer()
      │      ├── createReturn()
      │      └── recommendProducts()
      │
      ├── RAG
      │      ├── FAQs
      │      ├── Return Policy
      │      ├── Shipping Policy
      │      └── Product Manuals
      │
      └── MySQL

// ** tool calling for live data, RAG for business knowledge, and a capable model like Gemini—is typically much more effective at reducing hallucinations than relying on the model alone. ** //