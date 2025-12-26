'use client'

import { useState } from 'react'

import { Button } from '@/components/ui/button'
import AudioPlayer from '@/components/audio/AudioPlayer'
import { AudioRecorderDialog } from '@/components/audio/AudioRecorderDialog'
import { Trash, Wand2 } from 'lucide-react'
import axios from 'axios'

// Converted Enum to a constant object
export const AudioSource = {
	URL: 'URL',
	FILE: 'FILE',
	RECORDING: 'RECORDING'
}

export default function AudioManager({ setTranscript, setLoading }) {
	const [audioData, setAudioData] = useState()
	const [rawBlob, setRawBlob] = useState(null) // Keep the original blob for uploading


	const resetAudio = () => {
		setAudioData(undefined)
		setRawBlob(null)
	}

	const setAudioFromRecording = async (data) => {
		resetAudio()
		setRawBlob(data) // Store the blob for the API call

		const blobUrl = URL.createObjectURL(data)

		// Set the state immediately with the mimeType from the blob (data.type)
		setAudioData({
			url: blobUrl,
			source: AudioSource.RECORDING,
			mimeType: data.type
		});

		const fileReader = new FileReader()

		fileReader.onloadend = async () => {
			try {
				// Use the default sample rate of the user's hardware first
				const audioCTX = new (window.AudioContext || window.webkitAudioContext)()
				const arrayBuffer = fileReader.result
				const decoded = await audioCTX.decodeAudioData(arrayBuffer)

				setAudioData(prev => ({ ...prev, buffer: decoded }));

				// setAudioData({
				// 	buffer: decoded,
				// 	url: blobUrl,
				// 	source: AudioSource.RECORDING,
				// 	mimeType: data.type
				// })
			} catch (error) {
				console.error("Decoding failed:", error)
				// Fallback: set audio data even if decoding fails so the player still works
				setAudioData({
					url: blobUrl,
					source: AudioSource.RECORDING,
					mimeType: data.type
				})
			}
		}

		fileReader.readAsArrayBuffer(data)
	}

	const handleTranscription = async () => {
		if (!rawBlob) return;

		try {
			setLoading(true);

			// 1. Send file to our internal API
			const formData = new FormData();
			formData.append('file', rawBlob, 'recording.wav');

			const initResponse = await axios.post('/api/generate-text', formData);
			const transcriptId = initResponse.data.id;

			// 2. Poll our internal API for status
			const pollInterval = setInterval(async () => {
				try {
					// Hitting your local API route with the ID
					const statusResponse = await axios.get(`/api/generate-text?id=${transcriptId}`);

					const { status, text } = statusResponse.data;

					console.log("Current Status:", status);

					if (status === "completed") {
						clearInterval(pollInterval);
						setTranscript(text); // This sets the text in your textarea
						resetAudio();
						setLoading(false);
					} else if (status === "error") {
						clearInterval(pollInterval);
						alert("Transcription failed");
						setLoading(false);
					}
					// If status is 'queued' or 'processing', the interval continues...
				} catch (pollError) {
					console.error("Polling error:", pollError);
					clearInterval(pollInterval);
					setLoading(false);
				}
			}, 3000);

		} catch (error) {
			console.error("Frontend Error:", error);
			setLoading(false);
		}
	};

	return (
		<section className='w-full rounded-lg border p-6 shadow-md'>
			<div className='flex h-full flex-col items-start gap-6'>

				<div className='flex w-full items-center justify-between'>

					<h2>Speak on your way and the content will be generated!</h2>

					<div className='flex items-center justify-end gap-4'>
						{
							!audioData && (
								<AudioRecorderDialog
									onLoad={data => {
										setAudioFromRecording(data)
									}}
								/>
							)
						}
						{
							audioData && (
								<div className="gap-2">
									<Button onClick={handleTranscription}>
										<Wand2 size={16} /> Transcribe
									</Button>
									<Button variant='outline' onClick={resetAudio}>
										<Trash /> Reset
									</Button>
								</div>
							)
						}
					</div>
				</div>

				{audioData && (
					<AudioPlayer
						audioUrl={audioData.url}
						mimeType={audioData.mimeType}
					/>
				)}
			</div>
		</section>
	)
}