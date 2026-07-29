import RAGService from "./RAGService.js";

const rag = new RAGService();

await rag.initialize();

const result = await rag.ask(

    "What is the return policy?"

);

console.log(result);