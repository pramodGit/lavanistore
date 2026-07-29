// backend/ai/rag/embedding/embeddingProvider.js

import LocalEmbeddingProvider from "./providers/LocalEmbeddingProvider.js";

const provider = new LocalEmbeddingProvider();

export async function createEmbedding(text) {

  const vectors = await provider.embed(text);

  return vectors[0];

}