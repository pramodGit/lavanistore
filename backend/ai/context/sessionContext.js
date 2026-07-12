import redisClient from "../../redis/redisClient.js";

const PREFIX = "ai:context:";

export async function getSessionContext(conversationId) {

  const data = await redisClient.get(PREFIX + conversationId);

  return data
    ? JSON.parse(data)
    : {
        currentOrder: null,
        currentCustomer: null,
        currentProduct: null,
        currentIntent: null,
      };

}

export async function saveSessionContext(conversationId, context) {

  await redisClient.set(
    PREFIX + conversationId,
    JSON.stringify(context),
    {
      EX: 60 * 60, // 1 hour
    }
  );

}

export async function deleteSessionContext(conversationId) {

  await redisClient.del(PREFIX + conversationId);

}