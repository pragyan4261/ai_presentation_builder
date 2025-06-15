'use client';
import { useRouter } from 'next/navigation';
import { useSlidStore } from '@/store/useSlideStore';
import React, { use } from 'react'
import { motion } from 'framer-motion';
import { containerVariants, itemVariants } from '@/lib/constants';
import { ChevronLeft, RotateCcw } from 'lucide-react';
import useScratchStore from '@/store/useStartScratchStore';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectValue } from '@/components/ui/select';
import { SelectTrigger } from '@radix-ui/react-select';
import { Input } from '@/components/ui/input';
import CardList from '../Common/CardList';
import { OutlineCard } from '@/lib/type';
import { v4 as uuidv4 } from 'uuid';
import { toast } from 'sonner';
import { createProject } from '@/actions/projects';
type Props = {
    onBack: () => void;
}

const ScratchPage = ({onBack}:Props) => {

    const router = useRouter();

    const {setSlides,setProject} = useSlidStore();
    const [editText, setEditText] = React.useState('');
    const [editingCard, setEditingCard] = React.useState<string | null>(null);
    const [selectedCard, setSelectedCard] = React.useState<string | null>(null);
    const {outlines,resetOutlines, addMultipleOutlines,addOutline} = useScratchStore()
    const handleBack = () => {
        resetOutlines();
        onBack();   
    }

    const resetCards = ()=>{
        setEditText('');
        resetOutlines();
    }

    const handleAddCard = () => {
        const newCard:OutlineCard = {
            id: uuidv4(),
            title:editText || 'New Card',
            order: outlines.length + 1,
        }
        setEditText('');
        addOutline(newCard);
    }

    const handleGenerate = async() => {
        if(outlines.length === 0){
            toast.error('Error', {
                description: 'Please add at least one card before generating the presentation.'
            });
            return
        }

        const res = await createProject(outlines?.[0]?.title, outlines);
        if(res.status !== 200){
            toast.error('Error', {
                description: res.error || 'Something went wrong. Please try again.'
            });
            return
        }
        if(res.data){
            setProject(res.data);
            resetOutlines();
            toast.success('Project created successfully!', {
                description: 'You can now add slides to your project.'
            });
            router.push(`/presentation/${res.data.id}/select-theme`);
        }
        else{
            toast.error('Error', {
                description: 'Failed to create project. Please try again.'
            });

        }
    }

  return <motion.div 
    className='space-y-6 w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8'
    variants={containerVariants}
    initial="hidden"
    animate="visible"

  >

    <Button 
        onClick={handleBack}
        variant="outline"
        className='mb-4'
    >

        <ChevronLeft 
        className='mr-2 h-4 w-4'

    /> Back

    </Button>
    <h1 className='text-2xl sm:text-3xl font-bold text-primary text-center'>
        Generate From Scratch 
    </h1>
    <motion.div className='bg-primary/10 p-4 rounded-xl'
        variants={itemVariants}
        //USED CONTAINER VARIANTS INSTEAD OF ITEM VARIANTS COME BACK HERE
    >
        <div className='flex flex-col sm:flex-row justify-between
        gap-3 items-center rounded-xl'>
            
            <Input value={editText}
            onChange={(e)=>setEditText(e.target.value)}
            placeholder='Enter Prompt and add to the cards..'
            className='text-base sm:text-xl border-0
            focus-visible: ring-0 shadow-none p-0 bg-transparent flex-grow'/>
            
            <div
            className='flex items-center
            gap-3'
            >
`                <Select
                value={outlines.length > 0 ? outlines.length.toString(): '0'}>
                    <SelectTrigger className='w-fit gap-2 font-semibold shadow-xl'>
                        <SelectValue placeholder='Select the number of cards'/>
                    </SelectTrigger>
                    <SelectContent className='w-fit'>
                        {outlines.length === 0?(
                            <SelectItem value = '0'
                            className='font-semibold'>
                                No Cards
                            </SelectItem>
                        ):
                        Array.from({ length: outlines.length }, (_, i) => i + 1)
                            .map((num) => (
                                <SelectItem key={num} value={num.toString()} 
                                className='font-semibold'>
                                    {num} {num === 1 ? 'Card' : 'Cards'}
                                </SelectItem>
                            ))
                        }
                    </SelectContent>
                </Select>
                <Button
                    variant='destructive'
                    onClick={resetCards}
                    size="icon"
                    className='h-8 w-8 p-0 bg-red-500 hover:bg-red-600'
                    aria-label='Reset Cards'
                >
                    <RotateCcw className='h-4 w-4 text-white' />
                </Button>
            </div>
        </div>
    </motion.div>
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
        <Button
        onClick={handleAddCard}
        variant='secondary'
        className='w-full bg-primary-10'
        >

        </Button>

        {outlines.length > 0 && 
            <Button
            className='w-full'
            onClick={handleGenerate}>
                Generate PPT
            </Button>
        }
  </motion.div>
}

export default ScratchPage
