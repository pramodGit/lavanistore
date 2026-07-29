import LocalEmbeddingProvider from "./providers/LocalEmbeddingProvider.js";

const provider = new LocalEmbeddingProvider();

export async function embedChunks(chunks) {

  const texts = chunks.map(chunk => chunk.text);

  const vectors = await provider.embed(texts);

  return chunks.map((chunk, index) => ({

    ...chunk,

    vector: vectors[index],

  }));

}