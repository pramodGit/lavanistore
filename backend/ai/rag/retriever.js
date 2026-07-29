import fs from "fs/promises";
import path from "path";

import VectorStore from "./vectorStore.js";
import LocalEmbeddingProvider from "./embedding/providers/LocalEmbeddingProvider.js";

const DATA_DIR = path.join(
  process.cwd(),
  "ai",
  "rag",
  "data"
);


export default class Retriever {

  constructor() {

    this.provider = new LocalEmbeddingProvider();

    this.vectorStore = new VectorStore();

  }

  async load() {

    this.vectorStore.load(

      path.join(DATA_DIR, "index.faiss")

    );

    const json = await fs.readFile(

      path.join(DATA_DIR, "metadata.json"),

      "utf8"

    );

    this.metadata = JSON.parse(json);

  }

  async search(question, k = 5) {

    const vectors =
      await this.provider.embed(question);

    const queryVector = vectors[0];

    const result =
      this.vectorStore.search(

        queryVector,

        k

      );

    return result.labels.map((index, i) => ({
      ...this.metadata[index],
      score: result.distances[i],
    }));

  }

}