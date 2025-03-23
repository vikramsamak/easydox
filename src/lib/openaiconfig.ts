import OpenAI from 'openai';
import { config as loadEnv } from 'dotenv';
loadEnv();

const apiKey = process.env.OPEN_ROUTER_API_KEY as string;

export const openai = new OpenAI({
  baseURL: 'https://openrouter.ai/api/v1',
  apiKey: apiKey,
  defaultHeaders: {
    'HTTP-Referer': 'https://github.com/vikramsamak/easydox',
    'X-Title': 'Easydox',
  },
});
