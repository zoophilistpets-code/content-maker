import { Button } from '../ui/button'
import { UserButton } from '@clerk/nextjs'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

function Header() {
	return (
		<div className='p-3 px-5 flex items-center justify-between shadow-md'>
			<div className='flex gap-3 items-center'>
				<Image src={"https://flowbite.com/docs/images/logo.svg"} width={30} height={30} alt='Logo' />
				<h2 className='font-bold text-xl'>AI Content Maker</h2>
			</div>

			<div className='flex gap-3 items-center'>
				<Link href={'/dashboard'}><Button>Dashboard</Button></Link>
				<UserButton />
			</div>
		</div>
	)
}

export default Header