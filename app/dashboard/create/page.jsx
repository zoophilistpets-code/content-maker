"use client"

import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react'
import toast from 'react-hot-toast';
import { v4 as uuidv4 } from 'uuid';

import { VideoDataContext } from '@/app/_context/VideoDataContext';
import { db } from '@/configs/db';
import { VideoData } from '@/configs/schema';
import { useUser } from '@clerk/nextjs';

import SelectDuration from '@/components/create/SelectDuration';
import SelectStyle from '@/components/create/SelectStyle';
import SelectTopic from '@/components/create/SelectTopic'
import { Button } from '@/components/ui/button';
import Loader from '@/components/designs/Loader';

function Create() {

  const [formData, setFormData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [script, setScript] = useState();
  const [audioURL, setAudioURL] = useState();
  const [captions, setCaptions] = useState();
  const [imageList, setImageList] = useState();

  const { videoData, setVideoData } = useContext(VideoDataContext);

  const { user } = useUser()

  const onHandleInputChange = (fieldName, fieldValue) => {
    setFormData(prev => ({
      ...prev,
      [fieldName]: fieldValue
    }))
  }

  // Get Video Script
  const GenerateVideoScript = async () => {
    try {
      setLoading(true);

      const prompt = `Write a script to generate 30 seconds video on topic: ${formData.topic} along with AI image prompt in ${formData.imageStyle} format for each scene and give me result in JSON format with imagePrompt and ContentText as field, No Plain text`

      const resp = await axios.post('/api/generate-script', { prompt: prompt });
      console.log(resp.data.result)

      if (resp.data.result) {
        setVideoData(prev => ({ ...prev, 'VideoScript': resp.data.result }))
        setScript(resp.data.result)
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
      setAudioURL(resp.data.result)
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
      setCaptions(resp?.data?.result);
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
      setImageList(images);
    }
    setLoading(false);
  };

  // Save all the generations to Database
  const storeVideoData = async (videoData) => {
    setLoading(true);

    const result = await db.insert(VideoData).values({
      script: videoData?.VideoScript,
      audioURL: videoData?.AudioFileURL,
      captions: videoData?.AudioCaption,
      imageList: videoData?.ImageList,
      createdBy: user?.primaryEmailAddress.emailAddress,
    }).returning({ id: VideoData?.id });

    console.log(result);

    setLoading(false);
  }

  useEffect(() => {
    if (Object.keys(videoData).length == 4) {
      storeVideoData(videoData);
      console.log(videoData);
    }
  }, [videoData])

  return (
    <div className='md:px-8'>
      <h2 className="font-bold text-3xl text-primary text-center">
        Generate a New Content
      </h2>

      <div className='mt-2 shadow-md p-8'>

        <SelectTopic onUserSelect={onHandleInputChange} />

        <SelectStyle onUserSelect={onHandleInputChange} />

        <SelectDuration onUserSelect={onHandleInputChange} />

        <div className='mt-10 flex items-center gap-5 justify-end'>
          <Button variant='outline'>Reset</Button>
          <Button onClick={GenerateVideoScript}>Generate</Button>
        </div>

      </div>

      <Loader loading={loading} />

    </div>
  )
}

export default Create