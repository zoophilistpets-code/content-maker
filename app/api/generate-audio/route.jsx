import { storage } from "@/configs/FirebaseConfig";
import textToSpeech from "@google-cloud/text-to-speech"
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { NextResponse } from "next/server";

const client = new textToSpeech.TextToSpeechClient({
	apiKey: process.env.GOOGLE_TTS_API_KEY,
})

export async function POST(req) {
	try {
		const { text, id } = await req.json();

		const storageRef = ref(storage, `files/${id}.mp3`)

		const request = {
			input: {text: text},
			voice: {languageCode: 'en-US', ssmlGender: 'FEMALE'},
			audioConfig: { audioEncoding: 'MP3' },
		};

		// Peforms text to speech request
		const [response] = await client.synthesizeSpeech(request);

		// Save the audio file to firebase storage
		const audioBuffer = Buffer.from(response.audioContent, 'binary');
		await uploadBytes(storageRef, audioBuffer, {contentType: "audio/mp3"})

		const audioURL = await getDownloadURL(storageRef);

		return NextResponse.json({ result: audioURL })
	} catch (error) {
		return NextResponse.json({ 'Error:': error })
	}
}