import React from 'react'
import Link from 'next/link'

import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'

function EmptyState() {
  return (
	<div className='p-5 py-24 flex items-center flex-col mt-10 border-2 border-dotted'>
		<h2 className='mb-4'>You don't have any content created yet!</h2>
		<Link href={'/dashboard/create'}>
          <Button><Plus /> Create New</Button>
        </Link>
	</div>
  )
}

export default EmptyState