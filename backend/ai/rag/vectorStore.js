import faiss from "faiss-node";

const { IndexFlatL2, Index } = faiss;


import fs from "fs";

export default class VectorStore {

  constructor(dimension = 384) {

    this.dimension = dimension;
    this.index = new IndexFlatL2(dimension);

  }

  add(vectors) {

    // this.index.add(vectors);
    for (const vector of vectors) {
        this.index.add(vector);
    }

  }

  search(vector, k = 5) {

    return this.index.search(vector, k);

  }

  save(path) {

    this.index.write(path);

  }

  load(path) {
    this.index = Index.read(path);
  }

  size() {

    return this.index.ntotal();

  }

}