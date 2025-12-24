"use client"
import React, { useEffect, useState } from 'react'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { db } from '@/configs/db';
import { VideoData } from '@/configs/schema';
import { eq } from 'drizzle-orm';
import { useUser } from '@clerk/nextjs';
import EmptyState from '@/components/designs/EmptyState';
import Link from 'next/link';
import ContentLists from '@/components/designs/ContentLists';
import { ContentShimmer } from '@/components/designs/ContentShimmer';

function Dashboard() {
  const [videoList, setVideoList] = useState([]);
  const [loading, setLoading] = useState(true); // ✅ New Loading State
  const { user } = useUser();

  const GetContentList = async () => {
    setLoading(true); // Start loading
    try {
      const result = await db.select().from(VideoData)
        .where(eq(VideoData?.createdBy, user?.primaryEmailAddress?.emailAddress));

      setVideoList(result);
    } catch (error) {
      console.error("Fetch Error:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (user) {
      GetContentList();
    }
  }, [user]);

  return (
    <div className='px-2'>

      {/* Logic Tree: Loading -> Empty -> List */}
      {loading ? (
        <ContentShimmer />
      ) : videoList?.length === 0 ? (
        <EmptyState />
      ) : (
        <ContentLists videoList={videoList} />
      )}
    </div>
  )
}

export default Dashboard;