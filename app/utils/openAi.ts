import { OpenAIClient, AzureKeyCredential } from "@azure/openai";

let clientInstance: OpenAIClient;

export const getOpenAIClient = () => {
  if (!clientInstance) {
    clientInstance = new OpenAIClient(
      process.env.NEXT_PUBLIC_OPENAI_API_BASE!,
      new AzureKeyCredential(process.env.NEXT_PUBLIC_OPENAI_API_KEY!)
    );
  }
  return clientInstance;
};
