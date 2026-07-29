import VectorStore from "./vectorStore.js";

import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const indexPath = path.join(
  __dirname,
  "data",
  "index.faiss"
);

const store = new VectorStore();

const vectors = [

  new Array(384).fill(0.1),

  new Array(384).fill(0.2),

  new Array(384).fill(0.3),

];

store.add(vectors);

console.log("Total vectors:", store.size());

store.save(indexPath);

console.log("Index Saved");