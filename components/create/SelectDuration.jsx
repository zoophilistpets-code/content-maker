"use client"

import React, { useState } from 'react'

import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select"

function SelectDuration({ onUserSelect }) {

	const [selectedOption, setSelectedOption] = useState();

	return (
		<div className='mt-5'>
			<h2 className='font-bold text-xl text-primary'>Video Duration</h2>
			<p className='text-gray-500'>Choose a duration for your video</p>

			<Select onValueChange={(v) => {
				setSelectedOption(v)
				v != 'Custom Prompt' && onUserSelect('duration', v)
			}}>
				<SelectTrigger className="w-full mt-4 p-6 text-md">
					<SelectValue placeholder="Content Category" />
				</SelectTrigger>
				<SelectContent>
					<SelectItem value='30 Seconds'>30 Seconds</SelectItem>
				</SelectContent>
			</Select>
		</div>
	)
}

export default SelectDuration