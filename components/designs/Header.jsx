"use client"

import React, { useContext, useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'

import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"

import { UserDetailContext } from '@/app/_context/UserDetailContext';

import { Button } from '@/components/ui/button'
import { ShimmerDiv } from 'shimmer-effects-react'
import { ModeToggle } from './ThemeToggle'
import { Plus } from 'lucide-react'

function AppNavbar() {

	const { userDetail, setUserDetail } = useContext(UserDetailContext);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		if (userDetail?.credits != null) {
			setLoading(false);
		}
	}, [userDetail])

	return (
		<header className="bg-sidebar flex h-16 shrink-0 items-center justify-between gap-2 px-4">
			<div className='flex items-center gap-2'>
				<SidebarTrigger className="-ml-1" />
				<Separator orientation="vertical" className="mr-2 data-[orientation=vertical]:h-4" />
			</div>

			<div className='flex gap-3 items-center justify-end'>
				{
					loading ? (
						<ShimmerDiv mode="light" height={30} width={30} rounded={50} loading={loading} />
					) :
						<div className='flex gap-2 items-center'>
							<Image src={'/coin.png'} width={25} height={25} alt='credits' />
							<h2>{userDetail?.credits}</h2>
						</div>
				}
				<Link href={'/dashboard/create'}>
					<Button><Plus /> Create</Button>
				</Link>

				<ModeToggle />
			</div>
		</header>

	)
}

export default AppNavbar