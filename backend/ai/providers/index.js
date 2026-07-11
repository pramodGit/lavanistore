import GeminiProvider from "./GeminiProvider.js";

const provider = new GeminiProvider();

export default provider;

// Later this will become:

// switch(process.env.AI_PROVIDER){
//    case "openai":
//    case "claude":
// }