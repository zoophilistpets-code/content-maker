"use client"

import React, { useState } from 'react'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from '@/components/ui/textarea';

function SelectTopic({ onUserSelect }) {

  const SelectOptions = ['Custom Prompt', 'Random AI Story', 'Scary Story', 'Historical Facts', 'Bed Time Story', 'Motivational', 'Fun Facts',]

  const [selectedOption, setSelectedOption] = useState();

  return (
    <div>
      <h2 className='font-bold text-xl text-primary'>Content Category</h2>
      <p className='text-gray-500'>Choose a category for your content</p>

      <Select onValueChange={(v) => {
        setSelectedOption(v)
        v != 'Custom Prompt' && onUserSelect('topic', v)
      }}>
        <SelectTrigger className="w-full mt-4 p-6 text-md">
          <SelectValue placeholder="Content Category" />
        </SelectTrigger>
        <SelectContent>
          {
            SelectOptions.map((item, index) => (
              <SelectItem value={item} key={index}>{item}</SelectItem>
            ))
          }
        </SelectContent>
      </Select>

      {
        selectedOption == 'Custom Prompt' &&
        <Textarea
          className="mt-3"
          onChange={(e) => onUserSelect('topic', e.target.value)}
          placeholder="Write your own prompt to generate the content"
        />
      }

    </div>
  )
}

export default SelectTopic