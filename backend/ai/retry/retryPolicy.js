// backend/ai/retry/retryPolicy.js

export default class RetryPolicy {

  static shouldRetry(error) {

    if (!error) {
      return false;
    }

    if (error.status === 429) {
      return true;
    }

    if (error.status >= 500) {
      return true;
    }

    return false;

  }

}