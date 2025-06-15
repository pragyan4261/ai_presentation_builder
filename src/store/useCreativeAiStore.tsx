import { OutlineCard } from '@/lib/type';
import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';


type CreativeAiStore = {

    outlines: OutlineCard[] | [];
    setCurrentAiPrompt: (prompt: string) => void;
    addMultipleOutlines: (outlines: OutlineCard[]) => void;
    addOutline: (outline: OutlineCard) => void;
    currentAiPrompt: string;
    resetOutlines:()=> void;
};

const useCreativeAiStore = create<CreativeAiStore>()(
    persist(
        
    (set)=>({
        currentAiPrompt: '',
        setCurrentAiPrompt: (prompt: string) => {
            set({ currentAiPrompt: prompt });
        },
        outlines: [],
        
        addOutline: (outline: OutlineCard) => {
            set((state) => ({
                outlines: [outline,...state.outlines]
            }));
        },
        addMultipleOutlines: (outlines: OutlineCard[]) => {
            set(() => ({
                outlines: [...outlines]
            }));
        },
        resetOutlines:()=>{
            set({outlines: []});
        }
    }),{
        name: 'creative-ai',
    })
)

export default useCreativeAiStore;