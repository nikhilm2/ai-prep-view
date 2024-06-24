"use client"
import { db } from '@/utils/db'
import { UserAnswer } from '@/utils/schema'
import { eq } from 'drizzle-orm'
import React, { useEffect, useState } from 'react'
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
  } from "@/components/ui/collapsible"
import { ChevronsUpDownIcon, HomeIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
  

const Feedback = ({params}) => {
    const router = useRouter()
    const [feedbackList,setFeedbackList] = useState([])
    useEffect(()=>{
        GetFeedback()
    },[])
    const GetFeedback = async () => {
        const result = await db.select()
        .from(UserAnswer)
        .where(eq(UserAnswer.mockIdRef,params.interviewId))
        .orderBy(UserAnswer.id)

        console.log(result)
        setFeedbackList(result)
    }
  return (
    <div>
        <h3 className='text-3xl font-bold text-green-400 '>Congratulations</h3>
      <h2 className='text-2xl font-bold'>Here is your interview Feedback </h2>

        <h2 className='text-primary text-lg my-3'>Your overall interview rating is: 7/10</h2>
        <h2 className='text-sm text-gray-500'>Find below the interview questions with answers</h2>
        {feedbackList && feedbackList.map((item,index)=>(
            <Collapsible key={index} className='mt-7'>
            <CollapsibleTrigger className=' flex w-full gap-10 text-center justify-between items-center  p-2 bg-secondary rounded-lg my-2'>{item.question} <ChevronsUpDownIcon/></CollapsibleTrigger>
            <CollapsibleContent >
             <div >
             { <h2 className={item.rating<5?`text-red-500`:`text-green-500`}><strong>Rating:</strong>{item.rating}</h2>} 
             <h2 className='p-2 my-2 border rounded-lg bg-red-100 text-sm '><strong>Your Answer:</strong>{item.userAns}</h2>
             <h2 className='p-2 my-2 border rounded-lg bg-blue-200 text-sm '><strong>Feedback:</strong>{item.feedback}</h2>
             <h2 className='p-2 my-2 border rounded-lg bg-green-200 text-sm '><strong>Correct Answer:</strong>{item.correctAnswer}</h2>
             </div>
            </CollapsibleContent>
          </Collapsible>
          
        ))}

        <Button className="gap-2 flex items-center justify-center " onClick={()=>router.replace('/dashboard')}> <HomeIcon/> Home</Button>
    </div>
  )
}

export default Feedback