'use client'
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react'
import { motion } from 'framer-motion';
import { containerVariants, itemVariants } from '@/lib/constants';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ListOrdered, Loader2, RotateCcw, Tractor } from 'lucide-react';
import { Input } from '@/components/ui/input';
import useCreativeAiStore from '@/store/useCreativeAiStore';
//  import { } from '@radix-ui/react-select';

import {Select,SelectContent,SelectValue,SelectItem, SelectTrigger } from '@/components/ui/select';
import { set } from 'react-hook-form';
import CardList from '../Common/CardList';
import usePromptStore from '@/store/usePromptStore';
import RecentPrompts from './RecentPrompts';
import { toast } from 'sonner';
import { generateCreativePrompt } from '@/actions/chatgpt';
import { OutlineCard } from '@/lib/type';
import { v4 as uuid } from 'uuid';
import { title } from 'process';

import { createProject } from '@/actions/projects';
import { useSlideStore } from '@/store/useSlideStore';

type Props = {
    onBack: () => void;
}

const CreativeAi = ({onBack}: Props) => {
    const {setProject} = useSlideStore();
    const {currentAiPrompt,setCurrentAiPrompt, outlines, addOutline, addMultipleOutlines} = useCreativeAiStore()
    const [noOfCards, setNoOfCards] = React.useState(0);
    const [editingCard, setEditingCard] = React.useState<string | null>(null);
    const [isGenerating, setIsGenerating] = React.useState(false);
    const [editText, setEditText] = React.useState('');
    const [selectedCard, setSelectedCard] = React.useState<string | null>(null);
    
    const{prompts, addPrompt} = usePromptStore();
    
    const router = useRouter();
    const handleBack = () => {
        onBack();
        // router.back();
    }

    const resetCards = () => {
        setEditingCard(null);
        setSelectedCard(null);
        setEditText('');
        setCurrentAiPrompt(''); 
        // resetOutlines();
    }

    const generateOutline = async ()=>{
        if(currentAiPrompt === ""){
            toast.error("Error", {
                description: "Please enter a prompt to generate outlines."
            })
            return 
        }
        setIsGenerating(true);
        const res = await generateCreativePrompt(currentAiPrompt);
        if(res.status === 200 && res?.data?.outline){
            const cardsData: OutlineCard[] = [];
            res.data?.outline?.map((outline:string,idx:number)=>{
                const newCard = {
                    id: uuid(),
                    title: outline,
                    order: idx + 1,
                }
                cardsData.push(newCard);
            })
            addMultipleOutlines(cardsData);
            setNoOfCards(cardsData.length);
            toast.success("Outlines generated successfully!", {
                description: `Generated ${cardsData.length} outlines.`,
            });
        }
        else {
            toast.error("Error", {
                description: "Failed to generate outlines. Please try again."
            });
        }
        setIsGenerating(false);
        //WIP use openAI and complete this function
    }

    const handleGenerate = async ()=>{
        setIsGenerating(true);
        if(outlines.length === 0){
            toast.error("Error", {
                description: "Please generate outlines first."
            });
            setIsGenerating(false);
            return;
        }
        try {
            const res = await createProject(currentAiPrompt, outlines.slice(0, noOfCards))
            if(res.status!== 200 || !res.data || !res.data.id){
                toast.error("Error", {
                    description: "Failed to create project. Please try again."
                });
                setIsGenerating(false);
                return;
            }
            //I SENSE SOMETHING WRONG HERE VIDEO 5:52:50
            router.push(`/presentation/${res.data.id}/select-theme`);
            setProject(res.data);
            addPrompt({
                id: uuid(),
                title: currentAiPrompt || outlines?.[0]?.title,
                outlines: outlines,
                createdAt: new Date(),
            })

            toast.success("Project created successfully!", {
                description: "You can now select a theme for your presentation."
            });
            setCurrentAiPrompt('');
            resetOutlines();
        } catch (error) {
            console.error("Error creating project:", error);
            toast.error("Error", {
                description: "Failed to create project. Please try again."
            });
        }
        finally {
            setIsGenerating(false);
        }
    }

    useEffect(() => {
        setNoOfCards(outlines.length);
        
    }, [outlines.length]);

  return <motion.div
    className='space-y-6 w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8'
    variants={containerVariants}
    initial="hidden"
    animate="visible"
  >   
    <Button onClick = {handleBack}
    variant="outline"
    className='mb-4'>
        <ChevronLeft className='mr-2 h-4 w-4'/>Back
    </Button>
    <motion.div variants={itemVariants}
    className='text-center space-y-2'>
        <h1 className='text-4xl font-bold text-primary'>
            Generate with <span className='text-vivid'>Creative AI</span>
            <p className='text-secondary'>What would like to create today?</p>
        </h1>
    </motion.div>
    <motion.div className='bg-primary/10 p-4 rounded-xl'
    variants={itemVariants}>
        <div className='flex flex-col sm:flex-row justify-between gap-3 items-center rounded-xl'>
            <Input placeholder='Enter Prompt and add to the cards...' 
            className='text-base sm:text-xl border-0 focus-visible:ring-0 shadow-none p-0 bg-transparent flex-grow'
            required
            value={currentAiPrompt}
            onChange={(e)=>setCurrentAiPrompt(e.target.value)}/>
            <div className='flex items-center gap-3'>
                <Select value={noOfCards.toString()} onValueChange={(value) => setNoOfCards(parseInt(value))}
                   >
                        <SelectTrigger className='w-fit gap-2 font-semibold shadow-xl'>
                            <SelectValue placeholder='Select the number of cards'/>
                        </SelectTrigger>
                
                <SelectContent
                className='w-fit'>
                    {outlines.length === 0  ?(
                        <SelectItem
                        className='font-semibold'
                        value='0'>
                            No Item
                        </SelectItem>
                    ):(
                        Array.from({ length: outlines.length }, (_, i) => i+1)
                            
                    ).map((num)=><SelectItem key={num} value={num.toString()} 
                    className='font-semibold'>
                        {num} { num === 1? 'Card' : 'Cards'}
                    </SelectItem>)} 
                </SelectContent>
                </Select>
                <Button
                variant='destructive'
                onClick={resetCards}
                size="icon"
                aria-label = "Reset Cards">
                    <RotateCcw className='h-4 w-4'/>
                </Button>
            </div>
        </div>
    </motion.div>
    <div className='w-full flex justify-center items-center'>
        <Button className='font-medium text-lg flex gap-2 items-center'
        onClick={generateOutline}
        disabled={isGenerating}
        >
            {isGenerating ? (
                <>
                    <Loader2 className='h-4 w-4 animate-spin' />
                </>
            ):('generate outlines')} 
            
        </Button>
    </div>
    <CardList 
          outlines={outlines}
          addOutline={addOutline}
          addMultipleOutlines={addMultipleOutlines}
          editingCard={editingCard}
          editText={editText}
          selectedCard={selectedCard}
          onEditChange={setEditText}
          setEditText={setEditText}
          onCardSelect={setSelectedCard}
          setSelectedCard={setSelectedCard}
          setEditingCard={setEditingCard}
          onCardDoubleClick={(id, title) => {
              setEditingCard(id);
              setEditText(title);
          } } editingCardId={null}          
        />
        {outlines.length>0 && <Button
        className='w-full'
        onClick={handleGenerate}
        disabled ={isGenerating}>
            {isGenerating ? (
                <>
                    <Loader2 className='mr-2 animate-spin' />
                    Generating...
                </>
            ) : (
                'Generate'
            )}
            </Button>
        
            }
            {prompts.length > 0 && <RecentPrompts/>}
  </motion.div>
}

export default CreativeAi

function resetOutlines() {
    throw new Error('Function not implemented.');
}

