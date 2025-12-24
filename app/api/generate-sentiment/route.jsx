import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const apiKey = process.env.GOOGLE_GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

const config = {
	temperature: 0.7,
	topP: 0.95,
	topK: 64,
	maxOutputTokens: 1000,
	responseMimeType: "application/json",
};

const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash", generationConfig: config });

export async function POST(req) {
	try {
		const { prompt } = await req.json();

		if (!prompt) {
			return NextResponse.json({ error: "Prompt is required" }, { status: 400 });
		}

		const textPrompt = `
			Based on this input: "${prompt}", generate social media metadata.
			Return JSON:
			{
				"hashtags": "string (space separated)",
				"sentiment": "positive | neutral | negative",
				"engagementScore": number (0-100),
				"reachPrediction": "string (e.g. 500-1000)"
			}
		`;

		const result = await model.generateContent(textPrompt);
		const parsedData = JSON.parse(result.response.text());

		return NextResponse.json(parsedData)
	} catch (error) {
		console.error("Sentiment Analysis Error:", error);
		return NextResponse.json(
			{ success: false, error: error.message },
			{ status: 500 }
		);
	}
}