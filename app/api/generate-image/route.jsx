import { storage } from "@/configs/FirebaseConfig";
import axios from "axios";
import { getDownloadURL, ref, uploadString } from "firebase/storage";
import { NextResponse } from "next/server";

export async function POSTT(req) {

	try {

		const { prompt } = await req.json();

		const replicate = new Replicate({ auth: process.env.REPLICATE_API_KEY })

		const input = {
			prompt: prompt,
			aspect_ratio: "9:16"
		};

		const output = await replicate.run("google/imagen-4", { input });

		const base64Image = "data:/image/png;base64," + await ConvertImage(output[0]);
		const fileName = 'files/' + Date.now() + ".png";
		const storageRef = ref(storage, fileName);

		await uploadString(storageRef, base64Image, 'data_url');

		const downloadUrl = await getDownloadURL(storageRef);
		console.log(downloadUrl);

		return NextResponse.json({ "result": downloadUrl })
	} catch (error) {
		return NextResponse.json({ 'Error:': error })
	}
}

export async function POST(req) {
	try {
		const { prompt } = await req.json();

		// 1. Prepare ClipDrop Request
		const formData = new FormData();
		formData.append("prompt", prompt);

		const response = await fetch("https://clipdrop-api.co/text-to-image/v1", {
			method: "POST",
			headers: {
				"x-api-key": process.env.IMAGE_API_KEY,
			},
			body: formData,
		});

		if (!response.ok) {
			const errorData = await response.json();
			throw new Error(errorData.error || "ClipDrop API failed");
		}

		// 2. Process Binary Image Data
		const arrayBuffer = await response.arrayBuffer();
		const buffer = Buffer.from(arrayBuffer);
		const base64Image = `data:image/png;base64,${buffer.toString("base64")}`;

		// 3. Upload to Firebase Storage
		const fileName = `files/${Date.now()}.png`;
		const storageRef = ref(storage, fileName);

		// uploadString is best for base64 data_url format
		await uploadString(storageRef, base64Image, "data_url");
		const downloadURL = await getDownloadURL(storageRef);

		return NextResponse.json({ result: downloadURL });
	} catch (error) {
		console.error("Image Generation Error:", error);
		return NextResponse.json({ error: error.message }, { status: 500 });
	}
}