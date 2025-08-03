
import { Theme } from '@/lib/type'
import { useParams, useRouter } from 'next/navigation'
import { useSlidStore } from '@/store/useSlideStore'
import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Loader2, Wand2 } from 'lucide-react'
import { toast } from 'sonner'

type Props = {
  selectedTheme: Theme
  themes: Theme[]
  onThemeSelect: (theme: Theme) => void
}

const ThemePicker = ({onThemeSelect, selectedTheme}: Props) => {
  const router = useRouter();
  const {project, setSlides, currentTheme} = useSlidStore();
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

    }
    catch(error){
      
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
    </div>
  )
}

export default ThemePicker

