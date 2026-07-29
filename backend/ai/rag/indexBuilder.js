import fs from "fs/promises";
import path from "path";

import { loadDocuments } from "./documentLoader.js";
import { chunkDocuments } from "./chunker.js";
import { embedChunks } from "./embedding/embeddingService.js";

import VectorStore from "./vectorStore.js";

const DATA_DIR = path.join(
  process.cwd(),
  "ai",
  "rag",
  "data"
);

export async function buildIndex() {

  console.log("Loading documents...");

  const documents = await loadDocuments();

  console.log(`Documents: ${documents.length}`);

  //-------------------------------------------------

  console.log("Chunking documents...");

  const chunks = chunkDocuments(documents);

  console.log(`Chunks: ${chunks.length}`);

  //-------------------------------------------------

  console.log("Generating embeddings...");

  const embeddedChunks =
    await embedChunks(chunks);

  console.log(`Embeddings: ${embeddedChunks.length}`);

  //-------------------------------------------------

  const vectorStore = new VectorStore();

  vectorStore.add(

    embeddedChunks.map(

      chunk => chunk.vector

    )

  );

  //-------------------------------------------------

  await fs.mkdir(DATA_DIR, {

    recursive: true,

  });

  vectorStore.save(

    path.join(DATA_DIR, "index.faiss")

  );

  //-------------------------------------------------

  const metadata = embeddedChunks.map(

    ({ vector, ...chunk }, index) => ({

      index,

      ...chunk,

    })

  );

  await fs.writeFile(

    path.join(DATA_DIR, "metadata.json"),

    JSON.stringify(metadata, null, 2)

  );

  //-------------------------------------------------

  console.log("Index Saved");

  console.log(

    `Vectors Stored: ${vectorStore.size()}`

  );

}