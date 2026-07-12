# AI Agent Backend Architecture

Version: v7

Status: Stable Foundation

---

# High Level Architecture

```text
                    Client
                       │
                       ▼
                AI Controller
                       │
                       ▼
                 Chat Service
                       │
                       ▼
                  AI Service
                       │
                       ▼
             Provider Executor
                       │
                       ▼
               Agent Executor
      ┌──────────────┼──────────────┐
      │              │              │
      ▼              ▼              ▼
   Planner     Tool Executor     Context
      │              │
      └──────────────┘
              │
              ▼
 GeminiProvider / OpenAIProvider
              │
              ▼
        External AI Provider
```

---

# Request Flow

```text
User

↓

Controller

↓

ChatService

↓

Load Conversation

↓

AIService

↓

ProviderExecutor

↓

AgentExecutor

↓

Planner

↓

Need Tool ?

├── No
│     ↓
│   Return Answer
│
└── Yes
      ↓
ToolExecutor
      ↓
Business Service
      ↓
Planner
      ↓
Provider
      ↓
Final Answer
```

---

# Folder Structure

```text
backend/

ai/

├── agents/
│     agentExecutor.js
│
├── context/
│     contextManager.js
│     contextFormatter.js
│
├── executors/
│     providerExecutor.js
│     toolExecutor.js
│
├── memory/
│     conversationStore.js
│     memoryManager.js
│
├── planner/
│     planner.js
│     plan.js
│
├── prompts/
│
├── providers/
│     AIProvider.js
│     GeminiProvider.js
│     OpenAIProvider.js
│
├── registry/
│     providerRegistry.js
│     toolRegistry.js
│
├── tools/
│
├── AIService.js
│
└── chatService.js
```

---

# Responsibilities

## Controller

Receives HTTP requests.

---

## Chat Service

Maintains conversation.

Loads and saves history.

---

## AI Service

Coordinates the AI pipeline.

---

## Provider Executor

Selects the configured AI provider.

---

## Agent Executor

Runs the complete reasoning loop.

Responsible for:

- planning
- tool execution
- retries
- workflow
- completion

---

## Planner

Decides whether AI should:

- answer
- execute tool

---

## Tool Executor

Executes backend tools.

Examples:

- getOrder
- createOrder
- refundOrder

---

## Context

Maintains application state.

Examples:

- customerId
- permissions
- language
- session

---

## Provider

Responsible only for communicating with the LLM.

No business logic.

---

# Current Features

✅ Provider Abstraction

✅ Tool Registry

✅ Tool Calling

✅ Planner

✅ Conversation Memory

✅ Session Context

✅ Agent Executor

✅ Multi-turn Conversation

✅ Error Handling

---

# Future Roadmap

## Reflection

The agent evaluates its own answer before responding.

---

## Retry Policy

Automatically retries failed AI or tool operations.

---

## Workflow Engine

Executes predefined business workflows.

---

## Human Approval

Pauses execution until user approval is received.

---

## Multi-Agent

Multiple AI agents collaborate to solve complex tasks.

---

## MCP

Connects the AI agent to external systems using the Model Context Protocol.

---

## RAG

Retrieves relevant documents before generating a response.

---

## Long-Term Memory

Stores persistent knowledge across conversations.

---

# Design Principles

- Single Responsibility
- Provider Independent
- Extensible
- Testable
- Stateless Providers
- Tool Driven
- Context Aware
- Production Ready

---

# Current Status

## Architecture Stable

                           Client
                              │
                              ▼
                      AI Controller
                              │
                              ▼
                      Chat Service
                              │
                              ▼
                        AI Service
                              │
                              ▼
                    Provider Executor
                              │
                              ▼
                      Agent Executor
      ┌────────────────────────┼────────────────────────┐
      │                        │                        │
      ▼                        ▼                        ▼
   Planner              Tool Executor              Context
      │                        │
      └────────────────────────┘
               │
               ▼
      GeminiProvider / OpenAIProvider
               │
               ▼
            LLM Provider

### Future work will only add capabilities.