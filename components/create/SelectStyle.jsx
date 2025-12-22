"use client"

import Image from 'next/image';
import React, { useState } from 'react'

function SelectStyle({ onUserSelect }) {

	const StyleOptions = [
		{
			name: 'Realstic',
			image: '/real.png',
		},
		{
			name: 'Cartoon',
			image: '/cartoon.png',
		},
		{
			name: 'Comic',
			image: '/comic.png',
		},
		{
			name: 'Watercolor',
			image: '/watercolor.png',
		},
		{
			name: 'GTA',
			image: '/gta.png',
		},
	];

	const [selectedStyle, setSelectedStyle] = useState();

	return (
		<div className='mt-5'>
			<h2 className='font-bold text-xl text-primary'>Video Style</h2>
			<p className='text-gray-500'>Choose a image style for your video</p>

			<div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-5 mt-3'>
				{
					StyleOptions.map((item, index) => (
						<div key={index} className={`relative rounded-xl hover:scale-105 transition-all cursor-pointer ${selectedStyle == item.name && 'border-4 border-primary'}`}>
							<Image
								src={item.image}
								alt='Image'
								width={250} height={50}
								className='h-38 object-cover rounded-lg w-full'
								onClick={() => {
									setSelectedStyle(item.name)
									onUserSelect('imageStyle', item.name)
								}}
							/>
							<h2 className='absolute p-1 text-center rounded-b-lg text-white bg-black bottom-0 w-full'>
								{item.name}
							</h2>
						</div>
					))
				}
			</div>

		</div>
	)
}

export default SelectStyle