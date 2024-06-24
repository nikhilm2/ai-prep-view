"use client"
import { Lightbulb, Volume2 } from 'lucide-react'
import React, { useEffect } from 'react'

const QuestionsSection = ({mockInterviewQuestion,activeQuestionIndex}) => {

 useEffect(()=>{
  textToSpeech()
 },[])
 const textToSpeech=(text)=>{
  if('speechSynthesis' in window){
    const speech = new SpeechSynthesisUtterance(text)
    window.speechSynthesis.speak(speech)
  } else {
    alert("Sorry, Your Browser doesn't supported Text-to-Speech.")
  }
 }
  return mockInterviewQuestion && (
    <div className='p-5 border rounded-lg'>
        <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5'>
            {mockInterviewQuestion && mockInterviewQuestion.questions.map((question,index)=>(
               
                     <h2 key={index} className={`p-2 bg-secondary rounded-full text-xs md:text-sm text-center cursor-pointer ${activeQuestionIndex==index && 'bg-blue-500 text-white'}` }>Questions #{index+1}</h2>
               
               
            ))}
        </div>
        <h2 className='my-5 text-sm md:text-lg'>{mockInterviewQuestion.questions[activeQuestionIndex]?.question}</h2>
            <Volume2 className='cursor-pointer' onClick={()=>textToSpeech(mockInterviewQuestion.questions[activeQuestionIndex]?.question)}/>
        <div className='border rounded-lg p-5  bg-blue-100 mt-20'>
            <h2 className='flex gap-2 items-center text-primary'>
                <Lightbulb/>
                <strong>Note:</strong>
            </h2>
            <h2 className='text-sm text-primary my-2'>{process.env.NEXT_PUBLIC_QUESTION_NOTE}</h2>
        </div>
    </div>
  )
}

export default QuestionsSection