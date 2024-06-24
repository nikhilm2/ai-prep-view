"use client"
import React, { useState } from 'react'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "@/components/ui/dialog"
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { chatSession } from '@/utils/GeminiAIModel.js'
import { LoaderCircle } from 'lucide-react'
import { MockInterview } from '@/utils/schema'
import { db } from '@/utils/db'
import {v4 as uuidv4} from 'uuid'
import { useUser } from '@clerk/nextjs'
import moment from 'moment'
import { useRouter } from 'next/navigation'
  

const AddNewInterview = () => {
    const [openDialog,setOpenDialog] = useState(false)
    const [jobPosition,setJobPosition] = useState()
    const [jobDesc,setJobDesc] = useState()
    const [jobExperience,setJobExperience] = useState()
    const [loading,setLoading] = useState(false)
    const [jsonResponse,setJsonResponse] = useState([])
    const {user} = useUser()
    const router = useRouter()

    const onSubmit= async (e)=>{
      setLoading(true)
      e.preventDefault()
      console.log(jobPosition,jobDesc,jobExperience)
      const InputPrompt = "Job Position: "+jobPosition+", job description: "+jobDesc+", years of experience: "+jobExperience+". Depending on the information, give me "+process.env.NEXT_PUBLIC_INTERVIEW_COUNT+" interview question with answered in JSON format. Give restrictly only two fields: question and answer in JSON."
      const result = await chatSession.sendMessage(InputPrompt)
      const MockJsonResp = (result.response.text()).replace('```json','').replace('```','')
      console.log(JSON.parse(MockJsonResp))
      setJsonResponse(MockJsonResp)
      if(MockJsonResp){
        const resp = await db.insert(MockInterview)
        .values({
          mockId: uuidv4(),
          jsonMockResp:MockJsonResp,
          jobPosition:jobPosition,
          jobDesc:jobDesc,
          jobExperience:jobExperience,
          createdBy:user?.primaryEmailAddress.emailAddress,
          createdAt: moment().format('DD-MM-YYYY')
        }).returning({mockId:MockInterview.mockId})

        console.log("Interview Id:",resp)
        if(resp){
          setOpenDialog(false);
          router.push(`/dashboard/interview/${+resp[0]?.mockId}`)
        }
      }
     else {
      console.log("Error")
     }

      setLoading(false)
      
    }

  
  return (
    <div >
        <div className='p-10 border rounded-lg bg-secondary hover:scale-105 hover:shadow-md cursor-pointer transition-all'
    onClick={()=>setOpenDialog(true)}>
        
        <h2 className='text-lg'>+ Add New</h2></div>
        <Dialog open={openDialog}>
  
  <DialogContent>
    <DialogHeader>
      <DialogTitle className="text-2xl">Tell us more about your Job Interview</DialogTitle>
      <DialogDescription>
        <form onSubmit={onSubmit}>
       <div>
       
        <h2>Add Details about your Job Position/Role and years of experience</h2>
        <div className='mt-7 my-2'>
            <label>Job Role/Job Position</label>
            <Input placeholder="Ex. Full Stack Developer" onChange={(e)=>setJobPosition(e.target.value)} required/>
        </div>
        <div className='mt-7 my-2'>
            <label>Job Description/Tech Stack</label>
            <Textarea placeholder="Ex. MERN" onChange={(e)=>setJobDesc(e.target.value)} required/>
        </div>
        <div className='mt-7 my-2'>
            <label>Job Experience</label>
            <Input placeholder="Ex: 5" type="number" onChange={(e)=>setJobExperience(e.target.value)} required/>
        </div>
       </div>
        <div className='flex gap-5 justify-end'>
            <Button type="button" variant="destructive" onClick={()=>setOpenDialog(false)}>
                Cancel
            </Button>
            <Button type="submit" disabled={loading}>{loading?<><LoaderCircle className='animate-spin mx-2'/>Generating from AI</>:'Start Interview'}</Button>
        </div>
        </form>
      </DialogDescription>
    </DialogHeader>
  </DialogContent>
</Dialog>

        </div>
  )
}

export default AddNewInterview