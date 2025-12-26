import { NextResponse } from 'next/server';
import axios from 'axios';

const API_KEY = process.env.ASSEMBLY_CAPTION_API_KEY;

// This handles the initial upload (POST)
export async function POST(req) {
	try {
		const formData = await req.formData();
		const file = formData.get('file');

		if (!file) return NextResponse.json({ error: "No file" }, { status: 400 });

		const arrayBuffer = await file.arrayBuffer();
		const buffer = Buffer.from(arrayBuffer);

		// 1. Upload to AssemblyAI
		const uploadResponse = await axios.post("https://api.assemblyai.com/v2/upload", buffer, {
			headers: {
				authorization: API_KEY,
				"content-type": "application/octet-stream",
			},
		});

		// 2. Start Transcription
		const transcriptResponse = await axios.post("https://api.assemblyai.com/v2/transcript",
			{ audio_url: uploadResponse.data.upload_url },
			{ headers: { authorization: API_KEY, "content-type": "application/json" } }
		);

		return NextResponse.json({ id: transcriptResponse.data.id });
	} catch (error) {
		console.error("POST Error:", error.response?.data || error.message);
		return NextResponse.json({ error: "Upload failed" }, { status: 500 });
	}
}

// THIS IS THE MISSING PART: This handles the polling (GET)
export async function GET(req) {
	try {
		const { searchParams } = new URL(req.url);
		const id = searchParams.get('id');

		if (!id) return NextResponse.json({ error: "Missing ID" }, { status: 400 });

		const response = await axios.get(`https://api.assemblyai.com/v2/transcript/${id}`, {
			headers: { authorization: API_KEY }
		});

		// Return the full AssemblyAI response (includes status and text)
		return NextResponse.json(response.data);
	} catch (error) {
		console.error("GET Error:", error.response?.data || error.message);
		return NextResponse.json({ error: "Polling failed" }, { status: 500 });
	}
}