# AI Agent Backend Architecture

Version: v9

Status: Stable Workflow Engine

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
                Agent Pipeline
                       │
                       ▼
              Pipeline Executor
                       │
                Stage Registry
                       │
      ┌────────┬────────┬────────┬────────┬────────┐
      ▼        ▼        ▼        ▼        ▼
 Generate  Planner   Tool   Reflection  Finish
      ▲        │
      └────────┘
    (Workflow Loop)
                       │
                       ▼
          GeminiProvider / OpenAIProvider
                       │
                       ▼
               External AI Provider
```

---

# Frontend Architecture

User

↓

Floating AI Widget

↓

Chat Window

↓

ChatBot

├── ChatHeader
├── ChatBody
├── ChatMessage
├── TypingIndicator
└── ChatInput

↓

useChat()

↓

AI API

↓

Backend /api/ai/chat

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

AgentPipeline

↓

PipelineExecutor

↓

Generate Stage

↓

Planner Stage

↓

Need Tool?

├── Yes
│      ↓
│   Tool Stage
│      ↓
│   Generate Stage
│
└── No
       ↓
Reflection Stage

↓

Finish Stage

↓

Save Conversation

↓

Return Response
```

---

# Folder Structure

```text

frontend/

src/

ai/

├── api/
│     aiApi.ts
│
├── hooks/
│     useChat.ts
│
├── components/
│     AIChatWidget.tsx
│     FloatingButton.tsx
│     ChatWindow.tsx
│     ChatBot.tsx
│     ChatHeader.tsx
│     ChatBody.tsx
│     ChatMessage.tsx
│     ChatInput.tsx
│     TypingIndicator.tsx
│
├── styles/
│     chat-widget.css
│
└── types/
      chat.ts


backend/

ai/

├── agents/
│     agentExecutor.js
│
├── context/
│     contextFormatter.js
│     contextManager.js
│
├── executors/
│     providerExecutor.js
│     toolExecutor.js
│
├── memory/
│     conversationStore.js
│     memoryManager.js
│
├── pipeline/
│     agentPipeline.js
│     pipelineExecutor.js
│     pipelineState.js
│     pipelineStage.js
│     stageRegistry.js
│
│     stages/
│         generateStage.js
│         plannerStage.js
│         toolStage.js
│         reflectionStage.js
│         finishStage.js
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
├── reflection/
│     reflectionExecutor.js
│     reflectionPrompt.js
│
├── registry/
│     providerRegistry.js
│     toolRegistry.js
│
├── retry/
│     retryExecutor.js
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

Maintains conversations.

Loads and saves conversation history.

---

## AI Service

Coordinates the AI workflow.

Formats context before execution.

---

## Provider Executor

Selects the configured AI provider.

---

## Agent Pipeline

Coordinates the complete AI workflow.

Responsible for:

- workflow execution
- pipeline state
- provider interaction
- final response

---

## Pipeline Executor

Executes workflow stages.

Supports:

- configurable stages
- branching
- looping
- extensibility

---

## Stage Registry

Registers all available workflow stages.

Examples:

- Generate
- Planner
- Tool
- Reflection
- Finish

---

## Pipeline State

Carries execution state across stages.

Stores:

- history
- context
- response
- plan
- tool result
- retry info
- final reply

---

## Generate Stage

Communicates with the configured LLM.

Supports retry policy.

---

## Planner Stage

Determines whether the model should:

- answer
- call a tool

---

## Tool Stage

Executes backend business tools.

Examples:

- getOrder
- createOrder
- refundOrder

---

## Reflection Stage

Improves response readability.

Does not contain business logic.

---

## Finish Stage

Marks workflow completion.

Returns the final response.

---

## Context

Maintains application state.

Examples:

- current customer
- current order
- permissions
- session data

---

## Provider

Responsible only for communicating with the LLM.

No business logic.

---

# Current Features

✅ Embedded Website AI Widget

✅ Floating Chat Launcher

✅ Conversation Persistence

✅ Markdown Rendering

✅ Modular React Components

✅ React Performance Optimizations

✅ New Chat Support

✅ Provider Abstraction

✅ Provider Registry

✅ Workflow Engine

✅ Pipeline Executor

✅ Stage Registry

✅ Pipeline State

✅ Planner

✅ Tool Registry

✅ Tool Calling

✅ Retry Executor

✅ Reflection Stage

✅ Conversation Memory

✅ Session Context

✅ Multi-turn Conversation

✅ Dependency Injection

✅ Error Handling

---

# Future Roadmap

## OpenAI Provider

Support multiple AI providers.

---

## Anthropic Provider

Claude integration.

---

## Streaming Responses

Server Sent Events / WebSockets.

---

## Parallel Tool Execution

Execute multiple tools simultaneously.

---

## Human Approval Stage

Pause workflow until approval.

---

## RAG Stage

Retrieve knowledge before generation.

---

## MCP Integration

Connect external systems using Model Context Protocol.

---

## Long-Term Memory

Persistent memory across conversations.

---

## Observability

Tracing, metrics and workflow visualization.

---

## Multi-Agent Collaboration

Multiple AI agents working together.

---

# Design Principles

- Single Responsibility
- Provider Independent
- Workflow Driven
- Stage Based Execution
- Dependency Injection
- Extensible
- Testable
- Stateless Providers
- Tool Driven
- Context Aware
- Production Ready

---

# Current Status

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
                Agent Pipeline
                       │
                       ▼
              Pipeline Executor
                       │
                Stage Registry
                       │
      ┌────────┬────────┬────────┬────────┬────────┐
      ▼        ▼        ▼        ▼        ▼
 Generate  Planner   Tool   Reflection  Finish
      ▲        │
      └────────┘
    (Workflow Loop)
                       │
                       ▼
          GeminiProvider / OpenAIProvider
                       │
                       ▼
                 External AI Provider
```

---

# Current Status

**Architecture Stable**

The core backend architecture is complete.

Future versions will focus on adding capabilities rather than changing the core architecture.

Examples:

- Additional AI providers
- Streaming responses
- RAG
- MCP
- Human approval
- Multi-agent workflows
- Long-term memory
- Observability