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
	DialogTitle,
} from "@/components/ui/dialog"
import { Button } from '@/components/ui/button'
import MetaDataGrid from './MetaDataGrid'
import { Loader2 } from 'lucide-react'

function ContentDialog({ playVideo, videoId }) {

	const [openDialog, setOpenDialog] = useState(true);
	const [videoData, setVideoData] = useState();

	const [loading, setLoading] = useState(false);
	const [isExporting, setIsExporting] = useState(false);

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

	const handleExport = async () => {
		setIsExporting(true);
		try {
			const response = await fetch('/api/render-video', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					videoId: videoId,
					durationInFrame: durationInFrame,
					...videoData // This sends captions, images, audio, etc.
				}),
			});

			const result = await response.json();

			if (result.downloadUrl) {
				// Trigger browser download
				const link = document.createElement('a');
				link.href = result.downloadUrl;
				link.setAttribute('download', `video-${videoId}.mp4`);
				document.body.appendChild(link);
				link.click();
				link.remove();
			} else {
				alert("Render failed: " + result.error);
			}
		} catch (error) {
			console.error("Export Error:", error);
		} finally {
			setIsExporting(false);
		}
	};

	useEffect(() => {
		setOpenDialog(!openDialog)
		if (videoId) GetVideoData();
	}, [playVideo, videoId])

	return (
		<div>
			<Dialog open={openDialog}>
				<DialogContent className="flex flex-col items-center max-w-5xl! w-[95vw] h-[90vh]">

					<DialogTitle></DialogTitle>

					<div className="flex items-center gap-10 mt-1">
						{/* Player */}
						<div>
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
						</div>

						{/* Sentiment Analysis */}
						{videoData && (
							<div>
								<MetaDataGrid videoData={videoData} />
								<Button variant='outline' className={'w-full mt-2'} onClick={() => setOpenDialog(false)}>Close</Button>
								<div className='flex gap-4 mt-4'>
									
									{/* <Button onClick={handleExport} className="bg-primary hover:bg-primary/90">
										{loading ? <Loader2 className="animate-spin" /> : "Export MP4"}
									</Button> */}
								</div>
							</div>
						)
						}
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