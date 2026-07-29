// backend/ai/rag/embedding/LocalEmbeddingProvider.js

import axios from "axios";

export default class LocalEmbeddingProvider {

  constructor() {
    this.baseURL = "http://127.0.0.1:8000";
  }

  async echo(text) {

    const response = await axios.post(
      `${this.baseURL}/echo`,
      {
        text,
      }
    );

    return response.data;

  }

  async embed(input) {

    const texts = Array.isArray(input)
        ? input
        : [input];

    const response = await axios.post(

        `${this.baseURL}/api/embeddings`,

        { texts }

    );

    return response.data.vectors;

    }

}