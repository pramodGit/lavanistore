import Retriever
from "./retriever.js";

const retriever =
new Retriever();

await retriever.load();

const results =
await retriever.search(

"How do I return a product?"

);

console.log(results);