import IndexBuilder from "../rag/indexBuilder.js";
import { debug, info, error } from "../../utils/logger.js";
import retriever from "../rag/retrieverRegistry.js";

export default class KnowledgeSyncService {

  static isSyncing = false;

  constructor() {

    this.indexBuilder = new IndexBuilder();

  }

  async sync() {

    if (KnowledgeSyncService.isSyncing) {

      info("⏳ Knowledge sync already in progress...");

      return;

    }

    KnowledgeSyncService.isSyncing = true;

    try {

      info("🔄 Rebuilding knowledge index...");

      await this.indexBuilder.build();

      info("✅ Index rebuilt");

      await retriever.reload();

      info("✅ Retriever reloaded");

      info("✅ Knowledge sync completed.");

    } catch (err) {

      error("❌ Knowledge sync failed:", err);

    } finally {

      KnowledgeSyncService.isSyncing = false;

    }

  }

}