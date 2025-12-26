'use client'

import { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Mic, Square, Play, Pause } from 'lucide-react'

export function AudioRecorder({ onRecordingComplete }) {
	const [isRecording, setIsRecording] = useState(false)
	const [isPaused, setIsPaused] = useState(false)
	const [recordingTime, setRecordingTime] = useState(0)

	const recorder = useRef(null)
	const streamRef = useRef(null)
	const timerRef = useRef(null)
	const silenceTimeoutRef = useRef(null)
	const mediaRecorderRef = useRef(null)
	const audioChunksRef = useRef([])

	const connectToServer = async () => {
		if (typeof window !== "undefined" && typeof navigator !== "undefined") {
			try {
				// Dynamically import RecordRTC only when needed
				const RecordRTC = (await import('recordrtc')).default;

				const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
				streamRef.current = stream

				recorder.current = new RecordRTC(stream, {
					type: 'audio',
					mimeType: 'audio/webm;codecs=pcm',
					recorderType: RecordRTC.StereoAudioRecorder,
					timeSlice: 250,
					desiredSampRate: 16000,
					numberOfAudioChannels: 1,
					bufferSize: 4096,
					audioBitsPerSecond: 128000,
					ondataavailable: async (blob) => {
						// Reset the silence detection timer on audio input
						if (silenceTimeoutRef.current) clearTimeout(silenceTimeoutRef.current);

						// Restart the silence detection timer
						silenceTimeoutRef.current = setTimeout(() => {
							console.log('User stopped talking');
							stopRecording(); // Automatically stop when silence is detected
						}, 2000);
					}
				})

				recorder.current.startRecording()
				setIsRecording(true)
				setIsPaused(false)
				setRecordingTime(0)

				timerRef.current = setInterval(() => {
					setRecordingTime((prev) => prev + 1)
				}, 1000)
			} catch (err) {
				console.error("Microphone access error:", err)
			}
		}
	}

	// Start recording function
	const startRecording = async () => {
		try {
			// Request microphone access
			const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
			streamRef.current = stream

			// Create media recorder
			const mediaRecorder = new MediaRecorder(stream)
			mediaRecorderRef.current = mediaRecorder
			audioChunksRef.current = []

			mediaRecorder.ondataavailable = (event) => {
				console.log("Chunk received size:", event.data.size);
				if (event.data.size > 0) {
					audioChunksRef.current.push(event.data)
					console.log(event);
				}
			}

			mediaRecorder.onstop = () => {
				const mimeType = mediaRecorderRef.current.mimeType;
				const audioBlob = new Blob(audioChunksRef.current, {
					// type: 'audio/wav'
					type: mimeType
				})
				onRecordingComplete(audioBlob)
				console.log("Recorded Blob:", audioBlob);
			}

			// Start recording
			mediaRecorder.start()
			setIsRecording(true)
			setIsPaused(false)
			setRecordingTime(0)

			// Start timer
			timerRef.current = setInterval(() => {
				setRecordingTime((prev) => prev + 1)
			}, 1000)
		} catch (error) {
			console.error('Error accessing microphone:', error)
		}
	}

	const pauseRecording = () => {
		if (recorder.current && isRecording) {
			if (isPaused) {
				recorder.current.resumeRecording()
				setIsPaused(false)
				timerRef.current = setInterval(() => {
					setRecordingTime((prev) => prev + 1)
				}, 1000)
			} else {
				recorder.current.pauseRecording()
				setIsPaused(true)
				if (timerRef.current) clearInterval(timerRef.current)
			}
		}
	}

	const stopRecording = () => {
		if (recorder.current && isRecording) {
			recorder.current.stopRecording(() => {
				const blob = recorder.current.getBlob()
				onRecordingComplete(blob)

				// Cleanup
				if (streamRef.current) {
					streamRef.current.getTracks().forEach(track => track.stop())
				}
				if (timerRef.current) clearInterval(timerRef.current)
				if (silenceTimeoutRef.current) clearTimeout(silenceTimeoutRef.current)

				setIsRecording(false)
				setIsPaused(false)
			})
		}
	}

	// Format time function
	const formatTime = (seconds) => {
		const mins = Math.floor(seconds / 60)
		const secs = seconds % 60
		return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
	}

	// Cleanup on unmount
	useEffect(() => {
		return () => {
			if (timerRef.current) clearInterval(timerRef.current)
			if (silenceTimeoutRef.current) clearTimeout(silenceTimeoutRef.current)
		}
	}, [])

	return (
		<div className='flex w-full flex-col items-center space-y-2'>
			<div className='flex w-full items-center justify-center'>
				<div className='font-mono text-lg mt-3'>{formatTime(recordingTime)}</div>
				{isRecording && !isPaused && (
					<div className='ml-3 h-3 w-3 animate-pulse rounded-full bg-red-500' />
				)}
			</div>

			<div className='flex space-x-4 mt-1'>
				{!isRecording ? (
					<Button onClick={connectToServer} size='icon' variant='default'>
						<Mic className='h-5 w-5' />
					</Button>
				) : (
					<>
						<Button onClick={pauseRecording} size='icon' variant='outline'>
							{isPaused ? (
								<Play className='h-5 w-5' />
							) : (
								<Pause className='h-5 w-5' />
							)}
						</Button>

						<Button onClick={stopRecording} size='icon' variant='destructive'>
							<Square className='h-5 w-5' />
						</Button>
					</>
				)}
			</div>

			{isRecording && (
				<div className='text-muted-foreground text-sm'>
					{isPaused ? 'Recording paused' : 'Recording...'}
				</div>
			)}
		</div>
	)
}