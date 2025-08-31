"use client";
import { JsonValue } from "@/generated/prisma/runtime/library";
import { itemVariants, themes, timeAgo } from "@/lib/constants";
import { useSlideStore } from "@/store/useSlideStore";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import AlertDialogBox from "../alert-dialog";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { deleteProject, recoverProject } from "@/actions/projects";
import CreatePage from "@/app/(protected)/(pages)/(dashboardPages)/create-page/_components/CreatePage/CreatePage";
import RenderPage from "@/app/(protected)/(pages)/(dashboardPages)/create-page/_components/RenderPage";
import ThumbnailPreview from "./thumbnail-preview";

type Props = {
  projectId: string;
  title: string;
  createdAt: string;
  isDeleted?: boolean;
  slideData: JsonValue;
  themeName: string;
};

const ProjectCard = ({
  createdAt,
  projectId,
  slideData,
  title,
  isDeleted,
  themeName,
}: Props) => {
  const { setSlides } = useSlideStore();
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const router = useRouter();
  // const handleNavigation = () => {
  //   setSlides(structuredClone(slideData as any));
  //   router.push(`/presentation/${projectId}`);
  // };
  const handleRecover = async () => {
    setLoading(true)
    if(!projectId){
      setLoading(false)
      toast.error('Error', {description: 'Project not found'})
      return 
    }
    try {
      const res = await recoverProject(projectId)
      if(res.status!==200){
        toast.error('Error', {description: res.error || 'Something went wrong'})
        return
      }
      setOpen(false)
      router.refresh()
      toast.success('Success', {description: 'Project recovered successfully'})
    } catch (error) {
      toast.error('Error', {description: 'Something went wrong. PLease contact support'})
    }
  }
  const handleDelete = async () => {
        setLoading(true)
    if(!projectId){
      setLoading(false)
      toast.error('Error', {description: 'Project not found'})
      return 
    }
    try {
      const res = await deleteProject(projectId)
      if(res.status!==200){
        toast.error('Error', {description: res.error || 'Failed to delete the project'})
        return
      }
      setOpen(false)
      router.refresh()
      toast.success('Success', {description: 'Project deleted successfully'})
    } catch (error) {
      toast.error('Error', {description: 'Something went wrong. PLease contact support'})
    }
  }
  return (
    <motion.div
      className={`group w-full flex flex-col gap-y-3 rounded-xl p-3 transition-colors ${
        !isDeleted && "hover:bg-muted/50"
      }`}
      variants={itemVariants}
    >
      <div
        className="relative aspect-[16/10] overflow-hidden rounded-lg cursor-pointer"
        // onClick={handleNavigation}
      >
        {/* TTHIS LINE HERE BROOOOOOOOO */}
        <RenderPage/>
        {/* <ThumbnailPreview theme={themes} slide={(Array.isArray(slideData) && slideData.length > 0 ? slideData[0] : slideData) as any} /> */}
      </div>
      <div className="w-full">
        <div className="space-y-1">
          <h3 className="font-semibold text-base text-primary line-clamp-1">
            {title} This is the title that i want to see
          </h3>
          <div className="flex w-full justify-between items-center gap-2">
            <p
              className="text-sm text-muted-foreground"
              suppressHydrationWarning
            >
              {timeAgo(createdAt)}
            </p>
            {isDeleted ? (
              <AlertDialogBox
                onClick={handleRecover}
                open={open}
                loading={loading}
                handleOpen={()=>setOpen(!open)}
                className="bg-green-500 text-white dark:bg-green-600 dark:hover:bg-green-700"
                description="This will recover your project and restore your data"
              >
                <Button 
                size="sm"
                variant="ghost"
                className="bg-background-80 dark:hover:bg-background-90"
                disabled={loading}
                >
                  Recover
                </Button>
              </AlertDialogBox>
           ) : (
              <AlertDialogBox
                onClick={handleDelete}
                open={open}
                loading={loading}
                handleOpen={()=>setOpen(!open)}
                className="bg-red-500 text-white dark:bg-red-600 dark:hover:bg-red-700"
                description="This will delete your project and send to trash"
              >
                <Button 
                size="sm"
                variant="ghost"
                className="bg-background-80 dark:hover:bg-background-90"
                disabled={loading}
                >
                  Recover
                </Button>
              </AlertDialogBox>
            )} 
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ProjectCard;
