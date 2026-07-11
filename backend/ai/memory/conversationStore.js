import crypto from "crypto";
import redisClient from "../../redis/redisClient.js";

const TTL = Number(process.env.AI_CONVERSATION_TTL || 86400);

function getKey(conversationId) {
  return `conversation:${conversationId}`;
}

// Create a new conversation
export async function createConversation() {
  const id = crypto.randomUUID();

  // Create an empty list by pushing a temporary marker
  await redisClient.rPush(getKey(id), "__INIT__");
  await redisClient.lPop(getKey(id));

  await redisClient.expire(getKey(id), TTL);

  return id;
}

// Check existence
export async function hasConversation(conversationId) {
  return (await redisClient.exists(getKey(conversationId))) === 1;
}

// Load conversation
export async function getConversation(conversationId) {
  const rows = await redisClient.lRange(getKey(conversationId), 0, -1);

  return rows.map((row) => JSON.parse(row));
}

// Save conversation
export async function saveConversation(conversationId, messages) {
  const key = getKey(conversationId);

  // Replace existing list
  await redisClient.del(key);

  if (messages.length) {
    await redisClient.rPush(
      key,
      messages.map((m) => JSON.stringify(m))
    );
  }

  await redisClient.expire(key, TTL);
}

// Delete conversation
export async function deleteConversation(conversationId) {
  await redisClient.del(getKey(conversationId));
}

// Debug
export async function getConversationCount() {
  return (await redisClient.keys("conversation:*")).length;
}