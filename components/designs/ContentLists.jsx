import React, { useState } from 'react'

import { Thumbnail } from '@remotion/player'
import RemotionVideo from '@/components/create/RemotionVideo'
import ContentDialog from '@/components/designs/ContentDialog'

function ContentLists({ videoList }) {

  const [openPlayerDialog, setOpenPlayerDialog] = useState(false);
  const [videoId, setVideoId] = useState();

  return (
    <div className="mt-4 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-10">
      {
        videoList?.map((video, index) => (
          <div className='cursor-pointer hover:scale-105 transition-all'
            key={index}
            onClick={() => { setOpenPlayerDialog(Date.now()); setVideoId(video?.id) }}
          >
            <Thumbnail
              component={RemotionVideo}
              compositionWidth={240}
              compositionHeight={390}
              frameToDisplay={30}
              durationInFrames={40}
              fps={30}
              style={{ borderRadius: 15 }}
              inputProps={{ ...video, setDurationInFrame: (v) => { } }}
            />
          </div>
        ))
      }

      <ContentDialog playVideo={openPlayerDialog} videoId={videoId} />
    </div>
  )
}

export default ContentLists