import OpenAI from 'openai';
import { config as LoadEnvVars } from 'dotenv';

LoadEnvVars();

export const openai = new OpenAI({
  baseURL: 'https://openrouter.ai/api/v1',
  apiKey: process.env.OPEN_ROUTER_API_KEY as string,
});
