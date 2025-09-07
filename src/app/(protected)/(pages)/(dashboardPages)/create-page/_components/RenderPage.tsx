'use client'
import React from 'react'
import { useRouter } from 'next/navigation'
import {motion, AnimatePresence} from 'framer-motion'
import page from '../page'
import usePromptStore from '@/store/usePromptStore'
import CreatePage from './CreatePage/CreatePage'
import { set } from 'react-hook-form'
import CreativeAi from './GenerateAI/CreativeAi'
import ScratchPage from './Scratch/ScratchPage'

const RenderPage = () => {
    const router = useRouter();
    const {page,setPage} = usePromptStore();

    const handleBack = () => {
        setPage('create');
    }

    const handleSelectOption=(option:string)=>{
        if(option === "template"){
            router.push('/templates')
        }else if(option === 'create-scratch'){
            setPage('create-scratch')
        }
        else{
            setPage('creative-ai')
        }
    }
    const renderStep = () =>{
        switch (page) {
            case 'create':
                return <CreatePage onSelectOption={handleSelectOption} />
            case 'creative-ai':
                return <CreativeAi onBack={handleBack}/>
            case 'create-scratch':
                return <ScratchPage onBack={handleBack}/>
            default:
                return null 
    }}

  return <AnimatePresence mode='wait'>
    <motion.div
    key={page}
        initial={{opacity:0, x:20}}
        animate={{opacity:1, x:0}}
        exit={{opacity:0, x:-20}}
        transition={{duration:0.3}}
    >
        {renderStep()}
    </motion.div>
  </AnimatePresence>
}

export default RenderPage