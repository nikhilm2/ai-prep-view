"use client"
import QuestionsSection from '@/app/dashboard/_components/QuestionsSection'
import RecordAnswerSection from '@/app/dashboard/_components/RecordAnswerSection'
import { Button } from '@/components/ui/button'
import { db } from '@/utils/db'
import { MockInterview } from '@/utils/schema'
import { eq } from 'drizzle-orm'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'

const StartInterview = ({params}) => {
    const [interviewData,setInterviewData] = useState()
    const [mockInterviewQuestion, setMockInterviewQuestion] = useState()
    const [activeQuestionIndex,setActiveQuestionIndex] = useState(0)
    useEffect(()=>{
        GetInterviewDetails()
    },[])

    const GetInterviewDetails= async()=>{
        try {
            const result = await db.select().from(MockInterview)
            .where(eq(MockInterview.mockId,params.interviewId))
           
                const jsonMockResp = JSON.parse(result[0].jsonMockResp);
                console.log(jsonMockResp);
                setMockInterviewQuestion(jsonMockResp);
                // if (Array.isArray(jsonMockResp)) {
                //     setMockInterviewQuestion(jsonMockResp);
                // } else {
                //     console.warn('jsonMockResp is not an array. Converting to an array:', jsonMockResp);
                //     setMockInterviewQuestion(jsonMockResp ? [jsonMockResp] : []);
                // }
                setInterviewData(result[0]);
            
           
        } catch (error) {
            console.error('Error fetching interview details:', error);
        }
        
        
     
    }
  return (
    <div>
        <div className='grid grid-cols-1 md:grid-cols-2'>
            { <QuestionsSection mockInterviewQuestion={mockInterviewQuestion} activeQuestionIndex={activeQuestionIndex}/>}
            <RecordAnswerSection mockInterviewQuestion={mockInterviewQuestion} activeQuestionIndex={activeQuestionIndex} interviewData={interviewData}/>
        </div>
        <div className='flex justify-end items-center gap-6'>
            {activeQuestionIndex>0&&<Button variant="outline" onClick={()=>setActiveQuestionIndex(activeQuestionIndex-1)}>
                Previous Question </Button>}
               {activeQuestionIndex!=mockInterviewQuestion?.questions.length-1 && <Button onClick={()=>setActiveQuestionIndex(activeQuestionIndex+1)} >Next Question</Button>}
                {activeQuestionIndex==mockInterviewQuestion?.questions.length-1 &&<Link href={`/dashboard/interview/${interviewData?.mockId}/feedback`}><Button variant="destructive">End Interview</Button></Link>}
        </div>
    </div>
  )
}

export default StartInterview