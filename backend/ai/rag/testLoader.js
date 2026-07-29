import { loadDocuments } from "./documentLoader.js";
import { chunkDocuments } from "./chunker.js";
import { embedChunks } from "./embedding/embeddingService.js";

async function test() {

  const documents = await loadDocuments();

  console.log(JSON.stringify(documents, null, 2));

  const chunks = chunkDocuments(documents);
  
  console.log(chunks);

  const embedded = await embedChunks(chunks);
  
  console.log(embedded[0]);

}

test();