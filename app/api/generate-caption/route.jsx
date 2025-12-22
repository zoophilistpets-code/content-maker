import { AssemblyAI } from "assemblyai";
import { NextResponse } from "next/server";

export async function POST(req) {

	try {
		const { audioUrl } = await req.json()

		const client = new AssemblyAI({ apiKey: process.env.ASSEMBLY_CAPTION_API_KEY });

		const data = { audio: audioUrl }

		const transcript = await client.transcripts.transcribe(data)

		return NextResponse.json({ "result": transcript.words })
	} catch (error) {
		return NextResponse.json({ 'Error:': error })
	}

}