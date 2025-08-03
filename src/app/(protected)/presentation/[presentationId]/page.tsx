'use client'
import { getProjectById } from '@/actions/projects';
import { themes } from '@/lib/constants';
import { useSlidStore } from '@/store/useSlideStore';
import { tracingChannel } from 'diagnostics_channel';
import { Loader2 } from 'lucide-react';
import { useTheme } from 'next-themes';
import { redirect, useParams } from 'next/navigation';
import React, { useEffect } from 'react'
import { set } from 'react-hook-form';
import { toast } from 'sonner';
import { DndProvider } from 'react-dnd';
const page = () => {

    //WIP create the presentation view page
    const {setSlides, setProject, currentTheme, setCurrentTheme} = useSlidStore();

    const params = useParams();
    const {setTheme} = useTheme();

    const[isLoading, setIsLoading] = React.useState(true);

    useEffect(() => {
        (async()=>{
            try {
                const res = await getProjectById(params.presentationId as string);
                if(res.status !== 200 || !res.data){
                    toast.error("Error", {
                        description: res.error || "Failed to fetch project data."
                    })
                    redirect('/dashboard');
                }
                const findTheme = themes.find((theme) => 
                    theme.name === res.data.themeName
                )
                setCurrentTheme(findTheme || themes[0]);
                setTheme(findTheme?.type === 'dark' ? 'dark' : 'light');
                setProject(res.data);
                setSlides(JSON.parse(JSON.stringify(res.data.slides)));
                //DID SOME SETTING HERE TO MATCH THE REQUIRED THEME. THERE IS HUGE PROBLEM WITH THEME NOT BEING SET CORRECTLY
                //IN CONSTANT.TS AND EVERYWHERE ELSE. NEED TO FIX THIS LATER
            } catch (error) {
                toast.error("Error", {
                    description: "Failed to fetch project data."
                })
                redirect('/dashboard');
            }
            finally {
                setIsLoading(false);
            }
        })()
    }, [])

    if(isLoading){
        return (
            <div className="flex items-center justify-center h-screen">
                <Loader2 className="animate-spin w-8 h-8 text-primary"/>
            </div>
        )
    }
    return <div>
        
    </div>
//   return <DndProvider
    
//   >

//   </DndProvider>
}

export default page