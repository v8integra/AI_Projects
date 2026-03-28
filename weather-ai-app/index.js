import OpenAI from "openai"
import { getCurrentWeather, getLocation } from "./tools"

export const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
    dangerouslyAllowBrowser: true
})

const weather = await getCurrentWeather()
const location = await getLocation()

const response = await openai.chat.completions.create({
  model: 'gpt-4',
  messages: [
    {
      role: 'user',
      content: 'Give me a list of activity ideas based on my current location of ${location} and weather of ${weather}.'
    }
  ]
})

console.log(response.choice[0].message.content)
