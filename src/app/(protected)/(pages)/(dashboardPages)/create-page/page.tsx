import React, { Suspense } from 'react'
import CreatePageSkeleton from './_components/CreatePage/CreatePageSkeleton'
import RenderPage from './_components/RenderPage'
import { onAuthenticateUser } from '@/actions/user'
import { redirect } from 'next/navigation'
type Props = {}

const page = async (props: Props) => {
  const checkUser=await onAuthenticateUser()
  if(!checkUser.user){
    redirect('/sign-in');
  }
  return (
    <main className="w-full h-full pt-6">
      <Suspense fallback={<CreatePageSkeleton />}>
        <RenderPage/>
      </Suspense>
    </main>
  )
}

export default page