# AI Agent Backend

## Current Architecture (v7)

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
          ┌────────────────┼────────────────┐
          │                │                │
          ▼                ▼                ▼
      Planner        Tool Executor     Context
          │                │
          └────────────────┘
                   │
                   ▼
        GeminiProvider / OpenAIProvider
                   │
                   ▼
                LLM Provider


## Responsibilities

| Component         | Responsibility                           |
| ----------------- | ---------------------------------------- |
| AI Controller     | Receives AI requests                     |
| Chat Service      | Manages conversation flow                |
| AI Service        | Orchestrates AI pipeline                 |
| Provider Executor | Selects AI provider                      |
| Agent Executor    | Controls the reasoning loop              |
| Planner           | Decides whether to answer or call a tool |
| Tool Executor     | Executes backend tools                   |
| Context           | Holds business/session state             |
| Provider          | Talks to Gemini/OpenAI only              |


## Implemented Features

Provider Abstraction
Conversation Memory
Session Context
Planner
Tool Registry
Tool Executor
Agent Executor
Multi-turn Conversations
Function Calling
Central Error Handling

## Upcoming Features

Reflection

The agent reviews its own answer before returning it.

Retry Policy

Automatically retries failed AI or tool executions.

Workflow Engine

Executes predefined multi-step business processes.

Human Approval

Pauses execution until user/admin approval is received.

Multi-Agent

Multiple specialized AI agents collaborate.

MCP (Model Context Protocol)

Connects the agent to external tools using a standard protocol.

RAG (Retrieval-Augmented Generation)

Retrieves relevant knowledge before generating responses.

Long-Term Memory

Stores important information across conversations.