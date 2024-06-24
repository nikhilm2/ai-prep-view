"use client"
import { db } from '@/utils/db'
import { useUser } from '@clerk/nextjs'
import { MockInterview } from '@/utils/schema'

import { desc, eq } from 'drizzle-orm'
import React, { useEffect, useState } from 'react'
import InterviewItemCard from './InterviewItemCard'

function InterviewList() {
    const [interviewList,setInterviewList] = useState([])
    const {user} = useUser()
    useEffect(()=> {
        user && GetInterviewLists()
    },[user])
   
    const GetInterviewLists = async() => {
        const result = await db.select().from(MockInterview)
        .where(eq(MockInterview.createdBy,user?.primaryEmailAddress.emailAddress))
        .orderBy(desc(MockInterview.id))

        console.log(result)
        setInterviewList(result)
    }
  return (
    <div >
        <h2 className='font-bold text-xl'>Previous Mock Interview</h2>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
            {interviewList&&interviewList.map((interview,index)=>(
                <InterviewItemCard interview={interview} key={index}/>
            ))}
        </div>
    </div>
  )
}

export default InterviewList