"use client"
import { Button } from '@/components/ui/button'
import { SidebarGroup, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar'
import { Project } from '@/generated/prisma'
import { JsonValue } from '@/generated/prisma/runtime/library'
import {toast} from 'sonner'
import React from 'react'
import { useRouter } from 'next/navigation'
import { useSlideStore } from '@/store/useSlideStore'

type Props = {
    recentProjects: Project[]
}

const RecentOpen = ({recentProjects}: Props) => {
    const router = useRouter()
    const {setSlides} = useSlideStore()
    const handleClick = (projectId: string, slides: JsonValue)=> {
        if(!projectId || !slides){
            toast.error('Project not found', {
                description: 'Please try again',
            })
            return
        }
        setSlides(JSON.parse(JSON.stringify(slides)))
        router.push(`/presentation/${projectId}`)
    }
  return recentProjects.length > 0 ? (
    <SidebarGroup>
        <SidebarGroupLabel>Recently Opened</SidebarGroupLabel>
        <SidebarMenu>
            {recentProjects.length > 0 ? recentProjects.map((item)=>(<SidebarMenuItem key={item.id}>
                <SidebarMenuButton asChild tooltip={item.title} className={`hover:bg-primary-80`}>
                    <Button variant={'link'} className={`text-xs items-center justify-start`} onClick={()=>handleClick(item.id, item.slides)}>
                        <span>{item.title}</span>
                    </Button>
                </SidebarMenuButton>
            </SidebarMenuItem>)) :('')}
        </SidebarMenu>
    </SidebarGroup>
  ) :'' 
}

export default RecentOpen