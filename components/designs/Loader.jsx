import React from 'react'

import { AlertDialog, AlertDialogContent, AlertDialogTitle } from "@/components/ui/alert-dialog"
import Image from 'next/image';

function Loader({ loading }) {
	return (
		<AlertDialog open={loading}>
			<AlertDialogContent>
				<AlertDialogTitle></AlertDialogTitle>
				<div className='flex flex-col items-center my-10 justify-center'>
					<Image src={'/progress.gif'} alt='Loader' height={120} width={120} />
					<h2 className='text-xl mt-5'>Generating your content along with video!</h2>
					<h4 className='text-md mt-2'>Please don't refresh the page or Go back</h4>
				</div>
			</AlertDialogContent>
		</AlertDialog>
	);
}

export default Loader