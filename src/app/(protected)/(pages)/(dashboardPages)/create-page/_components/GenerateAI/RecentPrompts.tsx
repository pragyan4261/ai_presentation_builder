'use client'

import usePromptStore from "@/store/usePromptStore"
import React, { use } from "react"
import { motion } from "framer-motion"
import { containerVariants, itemVariants, timeAgo } from "@/lib/constants"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import useCreativeAiStore from "@/store/useCreativeAiStore"
import { toast } from "sonner"
type Props = {}


const RecentPrompts = (props: Props) => {

  const {prompts,setPage} = usePromptStore();
  const {addMultipleOutlines , setCurrentAiPrompt} = useCreativeAiStore()

  const handleEdit = (id: string) => {
    const prompt = prompts.find((prompt) => prompt.id === id);
    if (prompt) {
      setPage('creative-ai');
      addMultipleOutlines(prompt?.outlines)
      setCurrentAiPrompt(prompt?.title);
      // You can add any additional logic here if needed
    }

    else{
        toast.error('Error', {
            description: 'Prompt not found',
        })
    }
  }

  return <motion.div
  variants={containerVariants}
  className="space-y-4 !mt-20">
    <motion.h2 variants = {itemVariants}
    className="text-2xl font-semibold text-center">
        Recent Prompts
    </motion.h2>
    <motion.div variants={containerVariants}
    className="space-y-2 w-full lg:max-w-[80%] mx-auto">
        {prompts.map((prompt,i)=>(
            <motion.div key={i}
            variants={itemVariants}>
                <Card className="p-4 flex flex-col gap-y-2 cursor-pointer hover:bg-vivid-gradient transition-all duration-300 ease-in-out">
                    <div className="max-w-[70%]">
                        <h3 className="font-semibold text-xl line-clamp-1">
                            {prompt?.title}
                        </h3>
                        <p className="font-semibold text-sm text-muted-foreground">
                            {timeAgo(prompt?.createdAt?.toString())}
                        </p>
                    </div>
                    <div className="flex items-center gap-4">
                        <span className="text-sm text-vivid">
                            Creative AI
                        </span>
                        <Button
                        variant="outline"
                        className="rounded-xl bg-primary-20 dark:hover:bg-gray-700 hover:bg-gray-200"
                        onClick={()=>handleEdit(prompt?.id)}
                        >
                            Use Prompt
                        </Button>
                    </div>
                </Card>
            </motion.div>
        ))}
    </motion.div>
  </motion.div>
}

export default RecentPrompts