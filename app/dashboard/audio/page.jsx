'use client'

import axios from 'axios'
import { useContext, useEffect, useState } from 'react'
import toast from 'react-hot-toast';
import { v4 as uuidv4 } from 'uuid';

import { useUser } from '@clerk/nextjs'
import { VideoDataContext } from '@/app/_context/VideoDataContext'
import { UserDetailContext } from '@/app/_context/UserDetailContext'
import { db } from '@/configs/db';
import { eq } from 'drizzle-orm';
import { Users, VideoData } from '@/configs/schema';

import AudioManager from '@/components/audio/AudioManager'
import Loader from '@/components/designs/Loader'
import ContentDialog from '@/components/designs/ContentDialog'

function Audio() {
  const [loading, setLoading] = useState(false);
  const [transcript, setTranscript] = useState("");

  const { videoData, setVideoData } = useContext(VideoDataContext);
  const { userDetail, setUserDetail } = useContext(UserDetailContext);
  const [playVideo, setPlayVideo] = useState(false);
  const [videoId, setVideoId] = useState();

  const { user } = useUser()

  // Get Video Script
  const GenerateVideoScript = async () => {
    try {
      setLoading(true);

      const prompt = `Write a script to generate 30 seconds video on topic: ${transcript} along with AI image prompt in realstic format for each scene and give me result in JSON format with imagePrompt and ContentText as field, No Plain text`

      const resp = await axios.post('/api/generate-script', { prompt: prompt });
      console.log(resp.data.result)

      if (resp.data.result) {
        setVideoData(prev => ({ ...prev, 'VideoScript': resp.data.result }))
        await GenerateAudioFile(resp.data.result)
      } else {
        console.log("There was a problem in generating the script, Try again later")
        setLoading(false);
      }
    } catch (error) {
      console.error("Generation error:", error.toString());
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  // Generate Audio File and Store to Firebase
  const GenerateAudioFile = async (scriptData) => {
    setLoading(true);

    var script = '';
    const id = uuidv4()
    scriptData.forEach(item => {
      script = script + item.contentText + ''
    });

    const resp = await axios.post('/api/generate-audio', { text: script, id: id });
    console.log(resp.data.result);

    if (resp.data.result) {
      setVideoData(prev => ({ ...prev, 'AudioFileURL': resp.data.result }))
      await GenerateCaption(resp.data.result, scriptData)
    } else {
      console.log("There was a problem in generating the Audio File, Try again later")
      setLoading(false);
    }

    setLoading(false);
  }

  // Generate Captions from audio file
  const GenerateCaption = async (fileUrl, scriptData) => {
    setLoading(true);

    console.log(fileUrl);

    const resp = await axios.post('/api/generate-caption', { audioUrl: fileUrl });
    console.log(resp.data.result)

    if (resp.data.result) {
      setVideoData(prev => ({ ...prev, 'AudioCaption': resp.data.result }))
      await GenerateImage(scriptData)
    } else {
      console.log("There was a problem in generating the captions, Try again later")
      setLoading(false);
    }

    setLoading(false);
  }

  // Generate Images from Prompt
  const GenerateImage = async (scriptData) => {
    setLoading(true)

    let images = [];
    for (const element in scriptData) {
      try {
        const resp = await axios.post('/api/generate-image', { prompt: element.imagePrompt });
        console.log(resp.data.result);

        if (resp.data.result) {
          images.push(resp.data.result)
        } else {
          console.log("There was a problem in generating the images, Try again later")
          setLoading(false);
        }
      } catch (error) {
        console.log('Error' + error);
      }
    }
    if (images.length > 0) {
      setVideoData(prev => ({ ...prev, 'ImageList': images }))
      await GenerateSentiment(scriptData);
    }
    setLoading(false);
  };

  // Generate the Sentiment analysis
  const GenerateSentiment = async (scriptData) => {
    setLoading(true);

    const script = scriptData.map(item => item.contentText).join(' ');

    const resp = await axios.post('/api/generate-sentiment', { prompt: script });
    console.log("Analysis Result:", resp.data);

    if (resp.data && resp.data.sentiment) {
      setVideoData(prev => ({
        ...prev,
        'Sentiment': resp.data.sentiment,
        'Hashtags': resp.data.hashtags,
        'Score': resp.data.engagementScore,
        'Reach': resp.data.reachPrediction
      }));
    } else {
      console.log("There was a problem in generating Sentiment analysis, Try again later")
      setLoading(false);
    }

    setLoading(false);
  }

  // Save all the generations to Database
  const storeVideoData = async (videoData) => {
    setLoading(true);

    const result = await db.insert(VideoData).values({
      script: videoData?.VideoScript,
      audioURL: videoData?.AudioFileURL,
      captions: videoData?.AudioCaption,
      imageList: videoData?.ImageList,
      hashtags: videoData?.Hashtags,
      sentiment: videoData?.Sentiment,
      score: videoData?.Score,
      reach: videoData?.Reach,
      createdBy: user?.primaryEmailAddress.emailAddress,
    }).returning({ id: VideoData?.id });

    if (result) {
      await UpdateUserCredits()
      toast.success("Content got generated successfully!")
      setVideoId(result[0]?.id);
      setPlayVideo(true);
      console.log(result);
    } else {
      console.log("There was some issue in storing your content")
    }

    setLoading(false);
  }

  // Update user data after each generation
  const UpdateUserCredits = async () => {
    const res = await db.update(Users).set({
      credits: userDetail?.credits - 10
    }).where(eq(Users?.email, user?.primaryEmailAddress?.emailAddress));
    if (res) {
      setUserDetail(prev => ({ ...prev, "credits": userDetail?.credits - 10 }))
      setVideoData({});
    }
  }

  // Trigger video generation or other tasks when transcript is received
  useEffect(() => {
    if (transcript) {
      console.log("Transcript received in Page.jsx:", transcript);
      if (userDetail?.credits > 0) GenerateVideoScript();
      else toast.error("Please upgrade your account to generate more content")
    }
  }, [transcript]);

  useEffect(() => {
    if (Object.keys(videoData).length == 8) {
      storeVideoData(videoData);
      console.log(videoData);
    }
  }, [videoData])

  return (
    <div className='md:px-6'>
      <h2 className="font-bold text-3xl text-primary text-center">Whisper</h2>

      <div className='mt-4 p-4'>
        {/* Pass loading and transcript setters to AudioManager */}
        <AudioManager
          setTranscript={setTranscript}
          setLoading={setLoading}
        />
      </div>

      <Loader loading={loading} />
      <ContentDialog playVideo={playVideo} videoId={videoId} />
    </div>
  )
}

export default Audio