// backend/ai/retry/retryExecutor.js

import RetryPolicy from "./retryPolicy.js";

export default class RetryExecutor {

  async execute(fn, retries = 3) {

    let lastError;

    const startedAt = Date.now();

    for (let attempt = 1; attempt <= retries; attempt++) {

      try {

        const result = await fn();

        return {
          result,
          retry: {
            success: true,
            attempts: attempt,
            duration: Date.now() - startedAt,
          },
        };

      } catch (err) {

        lastError = err;

        if (
          attempt === retries ||
          !RetryPolicy.shouldRetry(err)
        ) {
          throw err;
        }

        await new Promise(resolve =>
          setTimeout(resolve, attempt * 1000)
        );

      }

    }

    throw lastError;

  }

}