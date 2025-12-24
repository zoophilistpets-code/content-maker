import React from 'react'

import { AbsoluteFill, Html5Audio, Img, interpolate, Sequence, useCurrentFrame, useVideoConfig } from 'remotion'

function RemotionVideo({ script, imageList, captions, audioURL, durationInFrame }) {

	const { fps } = useVideoConfig();
	const frame = useCurrentFrame();

	// Safety check: If data is missing, render nothing to avoid crashes
	if (!captions || !imageList || !audioURL) {
		return <AbsoluteFill className='bg-black' />;
	}

	const totalDuration = (captions && captions.length > 0)
		? (captions[captions.length - 1]?.end / 1000) * fps
		: 120;

	const getCurrentCaptions = () => {
		const currentTime = frame / 30 * 1000 // convert frame number to milliseconds
		const currentCaption = captions.find((word) => currentTime >= word.start && currentTime <= word.end)
		return currentCaption ? currentCaption?.text : '';
	}

	return (
		<AbsoluteFill className='bg-black'>
			{
				imageList?.map((item, index) => {

					// Logic: Divide total frames by number of images
					const durationPerImage = totalDuration / imageList.length;
					const startTime = index * durationPerImage;
					const duration = Math.ceil(durationPerImage);

					const scale = (index) => interpolate(
						frame,
						[startTime, startTime + duration / 2, startTime + duration],
						index % 2 == 0 ? [1, 1.4, 1] : [1.4, 1, 1.4],
						{ extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
					)

					return (

						<Sequence key={index} from={startTime} durationInFrames={duration}>

							<AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
								<Img src={item} style={{
									width: '100%',
									height: '100%',
									objectFit: 'cover',
									transform: `scale(${scale(index)})`
								}} />
								<AbsoluteFill style={{
									color: 'white',
									justifyContent: 'center',
									top: undefined,
									bottom: 50,
									height: 150,
									textAlign: 'center',
									width: '100%',
									textShadow: '0px 0px 10px rgba(0,0,0,1)' // Makes captions readable
								}}
								>
									<h2 className='text-2xl'>{getCurrentCaptions()}</h2>
								</AbsoluteFill>
							</AbsoluteFill>
						</Sequence>
					)
				})
			}

			{/* ✅ Only render if src is valid */}
			{audioURL && <Html5Audio src={audioURL} />}
		</AbsoluteFill>
	)
}

export default RemotionVideo