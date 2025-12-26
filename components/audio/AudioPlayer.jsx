import { useEffect, useRef } from 'react'

export default function AudioPlayer({ audioUrl, mimeType }) {
	const audioPlayer = useRef(null)
	const audioSource = useRef(null)

	useEffect(() => {
		if (audioPlayer.current && audioSource.current) {
			audioSource.current.src = audioUrl
			audioPlayer.current.load()
		}
	}, [audioUrl])

	return (
		<div className='w-full'>
			<audio ref={audioPlayer} controls className='h-14 w-full rounded-lg'>
				<source ref={audioSource} type={mimeType} key={audioUrl}/>
			</audio>
		</div>
	)
}