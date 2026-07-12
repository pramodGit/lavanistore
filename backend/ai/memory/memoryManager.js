import {
  getConversation,
  saveConversation,
} from "./conversationStore.js";

export default class MemoryManager {

  async load(conversationId) {

    return getConversation(conversationId);

  }

  async save(conversationId, history) {

    await saveConversation(
      conversationId,
      history
    );

  }

  async clear(conversationId) {

    await saveConversation(
      conversationId,
      []
    );

  }

}