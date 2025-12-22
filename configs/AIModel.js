const { GoogleGenerativeAI } = require("@google/generative-ai");

const apiKey = process.env.GOOGLE_GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

const generationConfig = {
	temperature: 1,
	topP: 0.95,
	topK: 64,
	maxOutputTokens: 8192,
	responseMimeType: "application/json",
};

export const chatSession = model.startChat({
	generationConfig,
	history: [
		{
			role: "user",
			parts: [
				{ text: "Write a script to generate 30 seconds video on topic: Interesting historical story along with Al image prompt in Realistic format for each scene and give me result in JSON format with imagePrompt and ContentText as field, No Plain text" },
			],
		},
		{
			role: "model",
			parts: [
				{ text: "```json\n[\n  {\n    \"imagePrompt\": \"A cinematic, realistic wide shot of World War II American soldiers standing in a misty European forest in 1944. They are surrounded by vintage military equipment. The lighting is moody and historical, captured on 35mm film, hyper-realistic textures.\",\n    \"contentText\": \"During World War II, the U.S. Army deployed a secret unit that fought not with bullets, but with illusions: The Ghost Army.\"\n  },\n  {\n    \"imagePrompt\": \"A hyper-realistic close-up of a soldier's hands connecting a pump to a rubber M4 Sherman tank. You can see the fabric texture and creases in the inflatable material. In the background, other soldiers are lifting a surprisingly light 'tank' in a grassy field.\",\n    \"contentText\": \"They were artists and engineers armed with high-decibel speakers and giant inflatable rubber tanks.\"\n  },\n  {\n    \"imagePrompt\": \"A realistic aerial drone-style shot looking down at a field filled with dozens of tanks and trucks. The lighting is early morning sun. It looks like a massive military encampment, but subtle details reveal the vehicles are hollow and lightweight. 8k resolution, cinematic color grading.\",\n    \"contentText\": \"From a distance, their 'phantom divisions' looked like a massive invasion force, terrifying the enemy scouts.\"\n  },\n  {\n    \"imagePrompt\": \"A realistic medium shot of large, vintage 1940s armored trucks equipped with massive, industrial-sized loudspeakers. Dust is kicking up from the vibration. The setting is a dark, rainy night on a muddy road in France. Cinematic lighting.\",\n    \"contentText\": \"They used massive speakers to blast recordings of troop movements that could be heard 15 miles away.\"\n  },\n  {\n    \"imagePrompt\": \"A realistic shot of German officers looking through binoculars from a distance at the 'ghost' camp, looking worried. The foreground shows blurred foliage, the background shows the silhouettes of the inflatable army under a dramatic sunset.\",\n    \"contentText\": \"This clever deception diverted thousands of German troops, saving an estimated thirty-thousand Allied lives.\"\n  },\n  {\n    \"imagePrompt\": \"A realistic, emotional close-up portrait of an elderly WWII veteran in a modern setting, holding a faded black-and-white photograph of an inflatable tank. Soft natural light through a window, high detail, 8k, bokeh background.\",\n    \"contentText\": \"The Ghost Army's mission remained a top-secret for decades—a story of how creativity won the war.\"\n  }\n]\n```" },
			],
		},
	],
});