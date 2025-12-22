import { SignUp } from '@clerk/nextjs'
import Image from 'next/image'

export default function Page() {
  return (
    <div className='grid grid-cols-1 md:grid-cols-2'>
      <div>
        <Image src={'/login.png'} alt='Login' width={600} height={50} className='h-screen object-fit-contain hidden lg:block' />
      </div>

      <div className='flex justify-center items-center h-screen'>
        <SignUp />
      </div>
    </div>
  )
}