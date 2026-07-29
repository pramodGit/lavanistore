import LocalEmbeddingProvider
  from "./LocalEmbeddingProvider.js";

const provider = new LocalEmbeddingProvider();

const result = await provider.echo(
  "Hello from Node"
);

console.log(result);

const vectors = await provider.embed([

  "Return Policy",

  "Shipping Policy",

  "Protein Powder",

]);

console.log("Vectors:", vectors.length);

console.log("Dimensions:", vectors[0].length);

