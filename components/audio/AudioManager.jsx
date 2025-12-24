'use client'

import axios from 'axios'
import { useCallback, useEffect, useState } from 'react'

import { Button } from '@/components/ui/button'
import AudioPlayer from '@/components/audio/audio-player'
import { AudioRecorderDialog } from '@/components/audio/AudioRecorderDialog'

import { Loader } from 'lucide-react'

// Converted Enum to a constant object
export const AudioSource = {
	URL: 'URL',
	FILE: 'FILE',
	RECORDING: 'RECORDING'
}

export default function AudioManager({ transcriber }) {
	const [audioData, setAudioData] = useState(undefined)
	const [url, setUrl] = useState(undefined)

	const onUrlChange = (url) => {
		transcriber.onInputChange()
		setAudioData(undefined)
		setUrl(url)
	}

	const resetAudio = () => {
		transcriber.onInputChange()
		setAudioData(undefined)
		setUrl(undefined)
	}

	const setAudioFromRecording = async (data) => {
		resetAudio()

		const blobUrl = URL.createObjectURL(data)
		const fileReader = new FileReader()

		fileReader.onloadend = async () => {
			const audioCTX = new AudioContext({ sampleRate: 16000 })
			const arrayBuffer = fileReader.result
			const decoded = await audioCTX.decodeAudioData(arrayBuffer)

			setAudioData({
				buffer: decoded,
				url: blobUrl,
				source: AudioSource.RECORDING,
				mimeType: data.type
			})
		}

		fileReader.readAsArrayBuffer(data)
	}

	const downloadAudioFromUrl = useCallback(
		async (url, requestAbortController) => {
			if (url) {
				try {
					setAudioData(undefined)

					const { data, headers } = await axios.get(url, {
						signal: requestAbortController.signal,
						responseType: 'arraybuffer'
					})

					let mimeType = headers['content-type']
					if (!mimeType || mimeType === 'audio/wave') {
						mimeType = 'audio/wav'
					}

					const audioCTX = new AudioContext({ sampleRate: 16000 })
					const blobUrl = URL.createObjectURL(
						new Blob([data], { type: 'audio/*' })
					)

					const decoded = await audioCTX.decodeAudioData(data)

					setAudioData({
						buffer: decoded,
						url: blobUrl,
						source: AudioSource.URL,
						mimeType: mimeType
					})
				} catch (error) {
					console.log('Request failed or aborted', error)
				}
			}
		},
		[]
	)

	useEffect(() => {
		if (url) {
			const requestAbortController = new AbortController()
			downloadAudioFromUrl(url, requestAbortController)
			return () => {
				requestAbortController.abort()
			}
		}
	}, [downloadAudioFromUrl, url])

	return (
		<section className='w-full max-w-2xl rounded-lg border p-6 shadow-md'>
			<div className='flex h-full flex-col items-start gap-6'>
				<div className='flex w-full items-center justify-between'>
					<UrlDialog onUrlChange={onUrlChange} />

					<AudioRecorderDialog
						onLoad={data => {
							transcriber.onInputChange()
							setAudioFromRecording(data)
						}}
					/>
				</div>

				{audioData && (
					<>
						<AudioPlayer
							audioUrl={audioData.url}
							mimeType={audioData.mimeType}
						/>

						<div className='mt-auto flex w-full items-center justify-between'>
							<Button onClick={() => transcriber.start(audioData.buffer)}>
								{transcriber.isModelLoading ? (
									<>
										<Loader className='animate-spin' />
										<span>Loading model</span>
									</>
								) : transcriber.isProcessing ? (
									<>
										<Loader className='animate-spin' />
										<span>Transcribing</span>
									</>
								) : (
									<span>Transcribe</span>
								)}
							</Button>

							<Button variant='outline' onClick={resetAudio}>
								Reset
							</Button>
						</div>
					</>
				)}
			</div>
		</section>
	)
}