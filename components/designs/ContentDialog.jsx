"use client"

import React, { useEffect, useState } from 'react'

import { Player } from '@remotion/player'
import RemotionVideo from '@/components/create/RemotionVideo'
import { db } from '@/configs/db'
import { VideoData } from '@/configs/schema'
import { eq } from 'drizzle-orm'

import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog"
import { Button } from '@/components/ui/button'

function ContentDialog({ playVideo, videoId }) {

	const [openDialog, setOpenDialog] = useState(true);
	const [videoData, setVideoData] = useState();

	const [durationInFrame, setDurationInFrame] = useState(120);

	const GetVideoData = async () => {
		const result = await db.select().from(VideoData).where(eq(VideoData.id, videoId));

		if (result && result.length > 0) {
			const data = result[0];
			setVideoData(data);

			// ✅ Calculate duration HERE, not inside the Remotion component
			// This prevents the "Cannot update a component while rendering" error
			if (data.captions) {
				const lastCaption = data.captions[data.captions.length - 1];
				const totalFrames = (lastCaption.end / 1000) * 30; // Assuming 30fps
				setDurationInFrame(Math.ceil(totalFrames));
			}
		}
	}

	useEffect(() => {
		setOpenDialog(!openDialog)
		if (videoId) GetVideoData();
	}, [playVideo, videoId])

	return (
		<div>
			<Dialog open={openDialog}>
				<DialogContent className="flex flex-col items-center">
					<DialogHeader>
						<DialogTitle className={'text-xl font-bold my-5'}>
							Your content is ready to rock the media!
						</DialogTitle>
					</DialogHeader>

					{/* ✅ FIX: Player is now OUTSIDE of DialogDescription to avoid <p> nesting errors */}
					<div className="flex flex-col items-center">
						{videoData ? (
							<Player
								component={RemotionVideo}
								durationInFrames={durationInFrame}
								compositionWidth={300}
								compositionHeight={450}
								fps={30}
								controls={true}
								inputProps={{
									...videoData,
									durationInFrame: durationInFrame
								}}
							/>
						) : (
							<div className="h-112.5 w-75 bg-gray-200 animate-pulse flex items-center justify-center rounded-lg">
								Loading Assets...
							</div>
						)}

						<div className='flex gap-4 mt-6'>
							<Button variant='outline' onClick={() => setOpenDialog(false)}>Cancel</Button>
							<Button>Export</Button>
						</div>
					</div>

				</DialogContent>
			</Dialog>
		</div>
	)
}

export default ContentDialog

// 	< DialogDescription >

// 	{/* Video Player */ }
// {/* ✅ Only render the player if videoData exists */ }
// {
// 	videoData ? (
// 		<Player
// 			component={RemotionVideo}
// 			durationInFrames={Number(durationInFrame.toFixed(0))}
// 			compositionWidth={300}
// 			compositionHeight={450}
// 			fps={30}
// 			controls={true}
// 			inputProps={{
// 				...videoData,
// 				setDurationInFrame: (value) => setDurationInFrame(value)
// 			}}
// 		/>
// 	) : (
// 		<div className="h-112.5 w-75 bg-gray-200 animate-pulse flex items-center justify-center">
// 			Loading Video...
// 		</div>
// 	)
// }

// {/* Other Meta Data of Content */ }

// <div className='flex items-end mt-6'>
// 	<Button variant='outline'>Cancel</Button>
// 	<Button>Export</Button>
// </div>
// 					</DialogDescription >