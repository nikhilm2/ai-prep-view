"use client"
import { Button } from '@/components/ui/button'
import { db } from '@/utils/db'
import { MockInterview } from '@/utils/schema.js'
import { eq } from 'drizzle-orm'
import { Lightbulb, WebcamIcon } from 'lucide-react'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import Webcam from "react-webcam";

const Interview = ({params}) => {
   
    const [interviewData,setInterviewData] = useState([])
    const [webCamEnable,setWebcamEnable] = useState(false)
    useEffect(()=>{
        console.log(params.interviewId)
        GetInterviewDetails()
    },[])

    const GetInterviewDetails= async()=>{
       try {
        const result = await db.select().from(MockInterview)
        .where(eq(MockInterview.mockId,params.interviewId))
        console.log(result);
        if (result && result.length > 0) {
            console.log(result[0])
            setInterviewData(result[0]);
        } 
        else {
            console.warn('No interview data found for the given interview ID.');
        }
       } catch (error) {
        console.error('Error fetching interview details:', error);
       }
       

      
    }
  return (
    <div className='my-10'>
        <h2 className='text-2xl font-bold'>Let's get Started</h2>
       {
        interviewData ?(
            <div className='grid grid-cols-1 md:grid-cols-2 gap-5 '>
            <div className='flex flex-col my-5 gap-5'>
                <div className='flex flex-col p-5 rounded-lg border gap-5'>
                <div className='flex flex-col items-center my-5'>
                <h2 className='text-lg'><strong>Job Role/Job Position: </strong>{interviewData.jobPosition}</h2>
                <h2 className='text-lg' ><strong>Job Description: </strong>{interviewData.jobDesc}</h2>
                <h2 className='text-lg'><strong>Years of Experience: </strong>{interviewData.jobExperience}</h2>
            </div>
            <div className='p-5 border roundded-lg border-yellow-300 bg-yellow-200'>
                <h2 className='font-bold'><Lightbulb/><strong>Information</strong></h2>
                <h2 className='text-yellow-700'>{process.env.NEXT_PUBLIC_INFORMATION}</h2>
            </div>
            </div>
               
            </div>
            <div >
            { webCamEnable? <Webcam style={{width:300,height:300}} onUserMedia={()=> setWebcamEnable(true)} mirrored={true} onUserMediaError={()=>setWebcamEnable(false)}/>:
                <><WebcamIcon className='h-72 w-full p-20 my-10 bg-secondary rounded-lg border'/>
                <Button className="w-full"  variant="ghost" onClick={()=>setWebcamEnable(true)}>Enable Web Cam and Microphone</Button>
                </>
    }        <div className='my-5 flex justify-end items-center'>
               <Link href={`/dashboard/interview/${params.interviewId}/start`}>
               <Button>Start Interview</Button>
               </Link>
                
            </div>
    
            </div>
            
            
            </div>
        ):(
            <p>Loading Interview Details...</p>
        )
       }
       
        
    </div>
  )
}

export default Interview