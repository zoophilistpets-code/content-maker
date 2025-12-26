// import { NextResponse } from 'next/server';
// import { renderMedia, selectComposition } from '@remotion/renderer';
// import path from 'path';
// import fs from 'fs';

// export async function POST(req) {
// 	try {
// 		const body = await req.json();
// 		const { videoId, durationInFrame, ...inputProps } = body;

// 		// 1. Define where the bundled video logic is
// 		// Note: In a real production app, you would bundle this 
// 		// or use an AWS Lambda function.
// 		const entry = path.resolve('remotion/index.js');

// 		// 2. Select the composition (Match your RemotionVideo component ID)
// 		const compositionId = 'RemotionVideo';

// 		const composition = await selectComposition({
// 			entry,
// 			id: compositionId,
// 			inputProps,
// 		});

// 		// 3. Define the output path
// 		const outputLocation = `public/renders/${videoId}.mp4`;

// 		// Ensure directory exists
// 		const dir = path.dirname(outputLocation);
// 		if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

// 		// 4. Start the Render process
// 		await renderMedia({
// 			composition,
// 			serveUrl: entry,
// 			codec: 'h264',
// 			outputLocation,
// 			inputProps,
// 		});

// 		// 5. Return the URL for the frontend to download
// 		const downloadUrl = `/renders/${videoId}.mp4`;
// 		return NextResponse.json({ downloadUrl });

// 	} catch (error) {
// 		console.error("Render Error:", error);
// 		return NextResponse.json({ error: error.message }, { status: 500 });
// 	}
// }