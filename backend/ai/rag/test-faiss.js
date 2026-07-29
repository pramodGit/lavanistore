import faiss from "faiss-node";

// console.log('faiss loaded successfully ', faiss);

const { IndexFlatL2 } = faiss;

const dimension = 384;

const index = new IndexFlatL2(dimension);

console.log(index.ntotal());