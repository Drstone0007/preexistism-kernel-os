// Z-AI wrapper that works on both local and Vercel environments
// Falls back to direct API calls if config file isn't available

interface ZAIConfig {
  baseUrl: string
  apiKey: string
  chatId?: string
  userId?: string
  token?: string
}

interface ChatMessage {
  role: 'system' | 'user' | 'assistant'
  content: string
}

interface ChatCompletionResponse {
  choices: Array<{
    message: {
      content: string
    }
  }>
}

// Get config from environment variables (for Vercel) or return null
function getConfigFromEnv(): ZAIConfig | null {
  const baseUrl = process.env.Z_AI_BASE_URL
  const apiKey = process.env.Z_AI_API_KEY
  
  if (!baseUrl || !apiKey) {
    return null
  }
  
  return {
    baseUrl,
    apiKey,
    chatId: process.env.Z_AI_CHAT_ID,
    userId: process.env.Z_AI_USER_ID,
    token: process.env.Z_AI_TOKEN,
  }
}

// Create a chat completion using direct fetch
export async function createChatCompletion(
  messages: ChatMessage[],
  config: ZAIConfig
): Promise<string> {
  const { baseUrl, chatId, userId, apiKey, token } = config
  const url = `${baseUrl}/chat/completions`
  
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${apiKey}`,
    'X-Z-AI-From': 'Z',
  }
  
  if (chatId) {
    headers['X-Chat-Id'] = chatId
  }
  if (userId) {
    headers['X-User-Id'] = userId
  }
  if (token) {
    headers['X-Token'] = token
  }
  
  const response = await fetch(url, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      messages,
      thinking: { type: 'disabled' },
    }),
  })
  
  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(`API request failed: ${response.status} - ${errorText}`)
  }
  
  const data = await response.json() as ChatCompletionResponse
  return data.choices[0]?.message?.content || ''
}

// Main function to get Z-AI working across environments
export async function getZAIConfig(): Promise<ZAIConfig> {
  // First try environment variables (for Vercel)
  const envConfig = getConfigFromEnv()
  if (envConfig) {
    return envConfig
  }
  
  // Fall back to SDK for local development
  const ZAI = (await import('z-ai-web-dev-sdk')).default
  const zai = await ZAI.create()
  return zai.config as ZAIConfig
}
