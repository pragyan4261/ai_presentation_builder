
import { Theme } from '@/lib/type'
import { useParams, useRouter } from 'next/navigation'
import { useSlideStore } from '@/store/useSlideStore'
import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Loader2, Wand2 } from 'lucide-react'
import { toast } from 'sonner'
import { generateLayouts } from '@/actions/chatgpt'
import { ScrollArea } from '@radix-ui/react-scroll-area'
import { motion } from 'framer-motion'
import { themes } from '@/lib/constants'

type Props = {
  selectedTheme: Theme
  themes: Theme[]
  onThemeSelect: (theme: Theme) => void
}

const ThemePicker = ({onThemeSelect, selectedTheme}: Props) => {
  const router = useRouter();
  const {project, setSlides, currentTheme} = useSlideStore();
  const [loading, setLoading] = useState(false);
  const params = useParams();

  const handleGenerateLayouts = async () => {
    setLoading(true);
    if(!selectedTheme) {
      toast.error('Error', {
        description: 'Please select a theme',
      })
      return
    }
    if(project?.id === ''){
      toast.error('Error', {
        description: 'Please create a project',
      })
      router.push('/create-page')
      return 
    }
    try{
      const res=await generateLayouts(
        params.presentationId as string,currentTheme.name
      )
      if(res.status !== 200 && !res?.data){
        throw new Error('Failed to generate layouts')
      }
       toast.success('Success', {
        description: 'Layouts generated successfully',
      })
      router.push(`/presentation/${project?.id}`)
      setSlides(res.data)
    }
    catch(error){
      toast.error('Error', {
        description: 'Failed to generate layouts',
      })
    }
    finally{
      setLoading(false)
    }
  }

  return (
    <div
      className='w-[400px] overflow-hidden sticky top-0 h-screen flex flex-col'
      style={{
        backgroundColor: selectedTheme.sidebarColor || selectedTheme.backgroundColor,
        borderLeft: `1px solid ${selectedTheme.accentColor}20`,
      }}
    >
      <div className='p-8 space-y-6 flex-shrink-0'>
        <div className='space-y-2'>
          <h2
            className='text-3xl font-bold tracking-tight'
            style={{
              color: selectedTheme.accentColor
            }}>
            Select a Theme
          </h2>
          <p className='text-sm'>
            Choose a theme to get started with your presentation or generate a custom theme
          </p>
        </div>
        <Button 
        style={{
          backgroundColor: selectedTheme.accentColor,
          color: selectedTheme.backgroundColor
        }}
        className='w-full h-12 text-lg font-medium shadow-lg hover:shadow-xl transition-all duration-300' 
        onClick={handleGenerateLayouts}
        >
          {loading? (<Loader2 className='animate-spin mr-2 h-5 w-5' />) : (<Wand2 className='mr-2 h-5 w-5' />)}
          {loading? (<p className='animate-pulse'>Generating...</p>) : ('Generate Theme')}
        </Button>
      </div>
      <ScrollArea className="flex-grow px-8 pb-8">
        <div className="grid grid-cols-1 gap-4">
          {
            themes.map((theme)=> (
              <motion.div
               key={theme.name}
               whileHover={{ scale: 1.02 }}
               whileTap={{scale: 0.98 }}>
                <Button 
                  onClick={()=>{
                  onThemeSelect(theme)
                }}
                className="flex flex-col items-center justify-start p-6 w-full h-auto"
                style={{
                  fontFamily: theme.fontFamily,
                  color: theme.fontColor,
                  background: theme.
                  gradientBackground || theme.backgroundColor,
                }}
                >
                  <div className="w-full flex items-center justify-between">
                    <span className="text-xl font-bold">{theme.name}</span>
                    <div className="w-3 h-3 rounded-full"
                    style={{
                      backgroundColor:theme.accentColor }}
                      />
                  </div>
                  <div className="space-y-1 w-full">
                  <div className="text-2xl font-bold"
                  style={{color:theme.accentColor}}
                  >
                    Title
                 </div>
                 <div className="text-base opacity-80">
                  Body &{' '}
                  <span style={{ color: theme.accentColor }}>link</span>
                 </div>
                  </div>
                </Button>
               </motion.div>
            ))
          }
        </div>
      </ScrollArea>
    </div>
  )
}

export default ThemePicker

