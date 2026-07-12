export default class KnowledgeService {

  constructor() {

    this.sources = [];

  }

  register(source) {

    this.sources.push(source);

  }

  async search(query, options = {}) {

    const results = [];

    for (const source of this.sources) {

      const data = await source.search(
        query,
        options
      );

      if (Array.isArray(data)) {
        results.push(...data);
      }

    }

    return results;

  }

}