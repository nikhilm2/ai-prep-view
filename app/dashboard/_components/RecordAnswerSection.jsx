"use client"
import Webcam  from 'react-webcam'
import Image from 'next/image'
import React, { useEffect, useState } from 'react'


import { Button } from '@/components/ui/button'
import useSpeechToText from 'react-hook-speech-to-text';
import { Mic, StopCircle } from 'lucide-react'

import { chatSession } from '@/utils/GeminiAIModel'

import { UserAnswer } from '@/utils/schema'
import { useUser } from '@clerk/nextjs'
import moment from 'moment'
import { db } from '@/utils/db'




const RecordAnswerSection = ({mockInterviewQuestion,activeQuestionIndex,interviewData}) => {
  const [userAnswer,setUserAnswer] = useState('')
  const {user} = useUser()
  const [loading,setLoading]= useState(false)
  const {
    error,
    interimResult,
    isRecording,
    results,
    startSpeechToText,
    stopSpeechToText,
    setResults
  } = useSpeechToText({
    continuous: true,
    useLegacyResults: false
  });

  useEffect(()=> {
    results.map((result)=>(
      setUserAnswer(prevAns=>prevAns+result?.transcript)
    ))
  },[results])

  useEffect(()=>{
    if(!isRecording && userAnswer.length>10){
        UpdateUserAnswer()
    }
  },[userAnswer])

  const StartStopRecording = async () =>{

    if(isRecording){
        
      stopSpeechToText()
      if(userAnswer?.length<10){
        setLoading(false)
       
        return;
      }
      
    }
    else {
      startSpeechToText()
    }

  }

  const UpdateUserAnswer = async ()=> {
    console.log(userAnswer)
    setLoading(true)
    
    const feedbackPrompt = "Question:"+mockInterviewQuestion.questions[activeQuestionIndex]?.question + "User Answer:"+ userAnswer + ",Depends on question and the user answer for fiven interview question " + "please give us rating for answer and feedback as area of improvement if any" +
      "in just 3 to 5lines to improve it in JSON format with rating field and feedback field"

      const result = await chatSession.sendMessage(feedbackPrompt)

      const mockJsonResp = (result.response.text()).replace('```json','').replace('```','')
      console.log(mockJsonResp)
      const JsonFeedbackResp = JSON.parse(mockJsonResp)

      const resp = await db.insert(UserAnswer)
      .values({
        mockIdRef: interviewData.mockId,
        question: mockInterviewQuestion.questions[activeQuestionIndex]?.question,
        correctAnswer:mockInterviewQuestion.questions[activeQuestionIndex]?.answer,
        userAns: userAnswer,
        feedback:JsonFeedbackResp?.feedback,
        rating: JsonFeedbackResp?.rating,
        userEmail: user?.primaryEmailAddress.emailAddress,
        createdAt: moment().format('DD-MM-YYYY')
      })

     console.log(resp)
      
    setUserAnswer('')
      setLoading(false)

  }
  return (
   <div className='flex flex-col items-center justify-center'>
     <div className='flex flex-col justify-center items-center bg-black rounded-lg gap-10 '>
        <Image alt='webcam' width={150} height={150} src={"/webcam.svg"} className='absolute'/>
        <Webcam style={{
            height:300,
            width:'100%',
            zIndex:10,
            
        }}/>
       </div>
       <div className='flex my-10 gap-5 justify-center items-center'>
       <Button disabled={loading}  variant="outline" onClick={StartStopRecording}>
        {isRecording?  <h2 className='text-red-500 flex items-center justify-center animate-pulse gap-2'> <StopCircle/> Stop Recording...</h2>: <h2 className='flex items-center justify-center gap-2'><Mic/> Record Answer</h2> }
         </Button>
      <Button onClick={()=>console.log(userAnswer)}>Show User Answer</Button>
       </div>
   </div>
  )
}

export default RecordAnswerSection