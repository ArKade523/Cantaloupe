import React, { useState, useEffect } from 'react'
import { Message, MessageWrapper } from '../../types/Message'
import Signal from '../../types/Signal'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'
import MessageItem from './MessageItem';

const initialMessages: Message[] = [
    { name: 'Message 1', multiplexed: false, arb_id: 123, signals: [
        { name: 'Signal 1', start_bit: 0, size: 8, endianess: 'big', is_signed: false, factor: 1, offset: 0, min: 0, max: 255 },
        { name: 'Signal 2', start_bit: 8, size: 8, endianess: 'big', is_signed: false, factor: 1, offset: 0, min: 0, max: 255 },
    ] },
    { name: 'Message 2', multiplexed: true, arb_id: 456, signals: [] },
    { name: 'Message 3', multiplexed: true, arb_id: 0, signals: [] },
    { name: 'Message 4', multiplexed: true, arb_id: 1, signals: [] },
    { name: 'Message 5', multiplexed: true, arb_id: 2, signals: [] },
    { name: 'Message 6', multiplexed: true, arb_id: 3, signals: [] },
];

function DBCEditor() {
    const [messageWrappers, setMessageWrappers] = useState<MessageWrapper[]>(
        initialMessages.map(message => {
            return {
                message,
                toggled: false,
                selected: false
            } as MessageWrapper
        })
    )

    const [selectedMessages, setSelectedMessages] = useState<number[]>([]);
    const [lastSelectedIndex, setLastSelectedIndex] = useState<number | null>(null);
    const [clipboard, setClipboard] = useState<MessageWrapper[]>([]);

    const setMessageWrapper = (index: number, newMessageWrapper: MessageWrapper) => {
        setMessageWrappers(prevWrappers =>
            prevWrappers.map((wrapper, i) => (i === index ? newMessageWrapper : wrapper))
        );
    }

    const handleOnDragEnd = (result: { destination: { index: number; }; source: { index: number; }; }) => {
        if (!result.destination) return;

        const updatedMessages = Array.from(messageWrappers)
        const [reorderedMessage] = updatedMessages.splice(result.source.index, 1)
        updatedMessages.splice(result.destination.index, 0, reorderedMessage)

        setMessageWrappers(updatedMessages)
    }

    const handleSelect = (index: number, event: React.MouseEvent) => {
        setMessageWrappers((prevWrappers) => {
            let newWrappers = [...prevWrappers];

            if (event.metaKey || event.ctrlKey) {
                newWrappers[index].selected = !newWrappers[index].selected;
            } else if (event.shiftKey && lastSelectedIndex !== null) {
                // Select range
                const range = [lastSelectedIndex, index].sort((a, b) => a - b);
                for (let i = range[0]; i <= range[1]; i++) {
                    newWrappers[i].selected = true;
                }
            } else {
                newWrappers = newWrappers.map((wrapper, i) => ({
                    ...wrapper,
                    selected: i === index,
                }));
            }

            setLastSelectedIndex(index);
            return newWrappers;
        });
    };

    useEffect(() => {
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [selectedMessages, clipboard]);

    const handleKeyDown = (event: KeyboardEvent) => {
        if ((event.metaKey || event.ctrlKey) && event.key === 'c') {
            // Copy selected messages
            const copiedMessages = selectedMessages.map(i => messageWrappers[i]);
            setClipboard(copiedMessages);
        } else if ((event.metaKey || event.ctrlKey) && event.key === 'v') {
            // Paste messages
            setMessageWrappers(prev => [...prev, ...clipboard]);
        } else if ((event.metaKey || event.ctrlKey) && event.key === 'a') {
            // Select all messages
            setMessageWrappers(prev => prev.map(wrapper => ({ ...wrapper, selected: true })));
        } else if (event.key === 'Escape') {
            // Deselect all messages
            setMessageWrappers(prev => prev.map(wrapper => ({ ...wrapper, selected: false })));
        }
    };

    return (
        <div className="inner-application">
            <div className="message-list">
                <div className="message-table-label">
                    <h3>Name</h3>
                    <h3>Multiplex Status</h3>
                    <h3>Arbitration ID</h3>
                </div>
                <DragDropContext onDragEnd={handleOnDragEnd}>
                    <Droppable droppableId="messages">
                        {(provided, snapshot) => (
                            <div ref={provided.innerRef} {...provided.droppableProps}>
                                {messageWrappers.map((messageWrapper, index) => (
                                    <Draggable key={index} draggableId={`${index}`} index={index}>
                                        {(provided) => (
                                            <div
                                                ref={provided.innerRef}
                                                {...provided.draggableProps}
                                                {...provided.dragHandleProps}
                                                onClick={(e) => handleSelect(index, e)}
                                            >
                                                <MessageItem 
                                                    key={messageWrapper.message.arb_id}
                                                    messageWrapper={messageWrapper}
                                                    setMessageWrapper={(newMessageWrapper) => setMessageWrapper(index, newMessageWrapper)}
                                                />
                                            </div>
                                        )}
                                    </Draggable>
                                ))}
                                {provided.placeholder}
                            </div>
                        )}
                    </Droppable>
                </DragDropContext>
            </div>
        </div>
    )
}

export default DBCEditor;
