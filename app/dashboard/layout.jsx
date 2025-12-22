"use client"

import React, { useState } from 'react'

import Header from '@/components/designs/Header'
import SideNav from '@/components/designs/SideNav'

import { VideoDataContext } from '@/app/_context/VideoDataContext'

function DashboardLayout({ children }) {

	const [videoData, setVideoData] = useState([]);

	return (
		<VideoDataContext.Provider value={{ videoData, setVideoData }}>
			<div>
				<div className='hidden md:block h-screen bg-white fixed mt-16.25 w-64'>
					<SideNav />
				</div>
				<div>
					<Header />
					<div className="md:ml-64 p-8">

						{children}
					</div>
				</div>
			</div>
		</VideoDataContext.Provider>
	)
}

export default DashboardLayout