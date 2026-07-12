import settings from "../settings.js";
import { getProvider } from "../registry/providerRegistry.js";

export default class ProviderExecutor {

  async chat(history, context) {

    const provider = getProvider(settings.provider);

    return provider.chat(history, context);

  }

}