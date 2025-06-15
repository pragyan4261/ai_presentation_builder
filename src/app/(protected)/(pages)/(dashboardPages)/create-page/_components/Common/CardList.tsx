import { OutlineCard } from '@/lib/type'
import React from 'react'
import {motion,AnimatePresence} from 'framer-motion'
import { set } from 'react-hook-form'
import Card from './Card'
import { on } from 'events'
import AddCardButton from './AddCardButton'

type Props = {
    outlines: OutlineCard[]
    editingCard: string | null
    editingCardId: string | null
    selectedCard:string|null
    editText: string
    addOutline?: (card:OutlineCard) => void
    onEditChange: (value:string) => void
    onCardSelect: (id:string) => void
    onCardDoubleClick: (id:string, title:string) => void
    setEditText: (value:string) => void
    setEditingCard: (id:string | null) => void
    setSelectedCard: (id:string | null) => void
    addMultipleOutlines?: (cards: OutlineCard[]) => void
}

const CardList = ({outlines,editingCard,editText,addOutline,onEditChange,onCardSelect,onCardDoubleClick,setEditText,setEditingCard,setSelectedCard,selectedCard,addMultipleOutlines}:Props) => {
    const [draggetItem, setDraggedItem] = React.useState<OutlineCard | null>(null);
    const [dragOverIndex, setDragOverIndex] = React.useState<number | null>(null);
    const dragOffsetY = React.useRef<number>(0);
    
    const onDragOver = (e: React.DragEvent,
        index:number
    ) =>{
        e.preventDefault();
        if(!draggetItem)    return;

        const rect = e.currentTarget.getBoundingClientRect();
        const y = e.clientY-rect.top
        const threshold = rect.height/2;

        if(y<threshold){
            setDragOverIndex(index);
        }else{
            setDragOverIndex(index+1);
        }

    }

    const onDrop = (e:React.DragEvent)=>{
        e.preventDefault();
        if(!draggetItem || dragOverIndex === null) return;

        const updatedCards = [...outlines];
        const draggedIndex = updatedCards.findIndex(card => card.id === draggetItem.id);
        if(draggedIndex === -1 || draggedIndex === dragOverIndex) return;

        const[removedCard] = updatedCards.splice(draggedIndex, 1);
        updatedCards.splice(dragOverIndex>draggedIndex ? dragOverIndex - 1 : dragOverIndex, 0, removedCard);
        
        if (addMultipleOutlines) {
            addMultipleOutlines(
                updatedCards.map((card, index) => ({ ...card, order: index + 1 }))
            );
        }
        setDraggedItem(null);
        setDragOverIndex(null);
        
        
    }

    const onAddCard = (index?: number) => {
        const newCard: OutlineCard = {
            id: Math.random().toString(36).substring(2, 9),
            title: 'New Card',
            order: index !== undefined ? index + 1 : outlines.length + 1,
        };

        const updatedCards = 
        index !== undefined
            ?[
                ...outlines.slice(0, index+1),
                newCard,
                ...outlines.slice(index+1).map((card, i) => ({ ...card, order: i + 1 }))
            
            ]:[...outlines, newCard];
            if (addMultipleOutlines) {
                addMultipleOutlines(updatedCards);
            }
            setEditText('');
    }

    const onCardUpdate = (id:string, newTitle:string) => {
        if (addMultipleOutlines) {
            addMultipleOutlines(
                outlines.map((card)=>
                card.id === id ? {...card, title: newTitle} : card)
            );
        }

        setEditingCard(null);
        setSelectedCard(null);
        setEditText('');
    }

    const onCardDelete = (id:string) => {
        if (addMultipleOutlines) {
            addMultipleOutlines(
                outlines.filter((card) => card.id !== id)
                .map((card, index) => ({ ...card, order: index + 1 }))
            );
        }
    }

    const onDragStart = (e: React.DragEvent, card: OutlineCard) => {
        setDraggedItem(card);
        e.dataTransfer.effectAllowed = 'move';
        const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
        dragOffsetY.current = e.clientY - rect.top;
        const draggedEl = e.currentTarget.cloneNode(true) as HTMLElement;
        draggedEl.style.position = 'absolute';
        draggedEl.style.top = '-1000px'
        draggedEl.style.opacity = '0.8'
        draggedEl.style.width = `${(e.currentTarget as HTMLElement).offsetWidth}px`;
        document.body.appendChild(draggedEl);
        e.dataTransfer.setDragImage(draggedEl,0, dragOffsetY.current);
        setTimeout(() => {
            setDragOverIndex(outlines.findIndex(c => c.id === card.id));
            document.body.removeChild(draggedEl);
        }, 0);

    }

    const onDragEnd = () => {
        setDraggedItem(null);
        setDragOverIndex(null);
    }


    const getDragOverStyles = (cardIndex:number) => {
        if(dragOverIndex === null || draggetItem === null) return {};
        if(cardIndex === dragOverIndex){
            return {
                borderTop: '2px solid #4f46e5',
                marginTop: '0.5rem',
                transition: 'margin 0.2s cubic-bezier(0.25, 0.1, 0.25, 1)',
            };


        }
        else if (cardIndex === dragOverIndex - 1) {
            return {
                borderBottom: '2px solid #4f46e5',
                marginBottom: '0.5rem',
                transition: 'margin 0.2s cubic-bezier(0.25, 0.1, 0.25, 1)',
            };
            
        }
        return {};
    }


    return <motion.div className='space-y-2 -my-2'
  layout
  onDragOver={(e)=>{
    e.preventDefault();
    if(outlines.length === 0 || e.clientY>e.currentTarget.getBoundingClientRect().bottom-20){
        onDragOver(e, outlines.length);
    }
  }}
  onDrop={(e)=>{
    e.preventDefault();
    onDrop(e);
  }}
  >
    <AnimatePresence>
        {outlines.map((card, index) => <React.Fragment key={card.id}>
            <Card onDragOver={(e)=> onDragOver(e,index)}
                card={card}
                isEditing = {editingCard === card.id}
                isSelected = {selectedCard === card.id}
                editText={editText}
                onEditChange={onEditChange}
                onEditBlur={()=> onCardUpdate(card.id,editText)}
                onEditKeyDown={(e)=>{
                    if(e.key === 'Enter'){
                        onCardUpdate(card.id,editText);
                    }
                }}
                onCardClick={()=>onCardSelect(card.id)}
                onCardDoubleClick={()=>onCardDoubleClick(card.id, card.title)}
                onDeleteClick={()=> onCardDelete(card.id)}
                dragHandlers={{
                    onDragStart: (e)=> onDragStart(e,card),
                    onDragEnd: onDragEnd
                }}
                dragOverStyles={getDragOverStyles(index)}
                />
                <AddCardButton 
                onAddCard={()=>onAddCard(index)}
                
                />
        </React.Fragment>)}
    </AnimatePresence>
  </motion.div>
}

export default CardList