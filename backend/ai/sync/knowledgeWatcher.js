import chokidar from "chokidar";

import KnowledgeSyncService from "./knowledgeSyncService.js";

export default class KnowledgeWatcher {

  constructor(path) {

    this.path = path;

    this.syncService = new KnowledgeSyncService();

    this.timer = null;

  }

  scheduleSync() {

    clearTimeout(this.timer);

    this.timer = setTimeout(async () => {

      try {

        await this.syncService.sync();

      } catch (err) {

        console.error(err);

      }

    }, 2000);

  }

  start() {

    const watcher = chokidar.watch(this.path, {
      ignoreInitial: true,
    });

    watcher

      .on("add", (file) => {

        console.log("📄 Added:", file);

        this.scheduleSync();

      })

      .on("change", (file) => {

        console.log("✏️ Changed:", file);

        this.scheduleSync();

      })

      .on("unlink", (file) => {

        console.log("🗑️ Deleted:", file);

        this.scheduleSync();

      });

    console.log("👀 Knowledge watcher started");

  }

}