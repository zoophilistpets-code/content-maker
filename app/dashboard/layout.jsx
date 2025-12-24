"use client"

import React, { useEffect, useState } from 'react'

import { VideoDataContext } from '@/app/_context/VideoDataContext'
import { UserDetailContext } from '@/app/_context/UserDetailContext'
import { db } from '@/configs/db'
import { Users } from '@/configs/schema'
import { eq } from 'drizzle-orm'
import { useUser } from '@clerk/nextjs'

import { AppSidebar } from '@/components/designs/Sidebar'

import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import AppNavbar from '@/components/designs/Header'

function DashboardLayout({ children }) {

	const [videoData, setVideoData] = useState([]);
	const [userDetail, setUserDetail] = useState([]);

	const { user } = useUser();

	const getUserDetail = async () => {
		const res = await db.select().from(Users)
			.where(eq(Users.email, user?.primaryEmailAddress?.emailAddress));
		setUserDetail(res[0]);
	}

	useEffect(() => {
		user && getUserDetail();
	}, [user])

	return (
		<UserDetailContext.Provider value={{ userDetail, setUserDetail }}>
			<VideoDataContext.Provider value={{ videoData, setVideoData }}>
				<SidebarProvider>
					<AppSidebar />
					<SidebarInset>
						<AppNavbar />
						<div className='p-4'>{children}</div>
					</SidebarInset>
				</SidebarProvider>
			</VideoDataContext.Provider>
		</UserDetailContext.Provider>
	)
}

export default DashboardLayout