import { NextResponse } from "next/server";
import OpenAI from "openai";

const systemPrompt = `
You are a customer support agent for a company that provides [insert product/service here]. Your role is to assist customers with inquiries, troubleshooting issues, and guiding them through the use of the company's products/services. You should maintain a friendly, professional tone, be empathetic to the customer's concerns, and aim to resolve their issues efficiently. Always greet the customer and acknowledge their concern.
Provide clear, step-by-step instructions for troubleshooting.
Offer additional assistance or escalate the issue if needed.
Maintain a positive and patient tone throughout the conversation.
Ensure responses are tailored to the customer’s specific situation, avoiding generic replies.
`;

const { GoogleGenerativeAI } = require("@google/generative-ai");
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
});

async function startChat(history) {
  return model.startChat({
    history: history,
    generationConfig: {
      maxOutputTokens: 8000,
    },
  });
}

export async function POST(req) {
  const history = await req.json();
  const userMsg = history[history.length - 1];

  try {
    //const userMsg = await req.json()
    const chat = await startChat(history);
    const result = await chat.sendMessage(userMsg.parts[0].text);
    const response = await result.response;
    const output = response.text();
    return NextResponse.json(output);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ text: "error, check console" });
  }
}
