import React, { useState, useEffect, useRef } from 'react'
import { Message, MessageWrapper } from '../../types/Message'
// import Signal from '../../types/Signal'
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

    const [lastSelectedIndex, setLastSelectedIndex] = useState<number | null>(null);

    const messageWrappersRef = useRef(messageWrappers);
    const messageListRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        messageWrappersRef.current = messageWrappers;
      }, [messageWrappers]);

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

    const handleDeselectAll = () => {
        setMessageWrappers(prevWrappers =>
            prevWrappers.map(wrapper => ({
                ...wrapper,
                selected: false,
            }))
        );
        setLastSelectedIndex(null); // Clear the last selected index
    };

    const handleContainerClick = (event: MouseEvent) => {
        // If the click target is outside the message list, deselect all
        if (messageListRef.current && !messageListRef.current.contains(event.target as Node)) {
            handleDeselectAll();
        }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
        if ((event.metaKey || event.ctrlKey) && event.key === 'c') {
            // Copy selected messages

            const copiedMessages = messageWrappersRef.current.filter(wrapper => wrapper.selected);
            const serializedMessages = JSON.stringify(copiedMessages); // Serialize to a string
            window.electronClipboard.writeText(serializedMessages); // Use Electron clipboard API
        } else if ((event.metaKey || event.ctrlKey) && event.key === 'v') {
            // Paste messages
            const clipboardData = window.electronClipboard.readText(); // Read from Electron clipboard
            if (clipboardData) {
                try {
                    const pastedMessages = JSON.parse(clipboardData); // Deserialize the pasted messages
                    setMessageWrappers(prev => 
                        [...prev, ...pastedMessages.map((wrapper: MessageWrapper) => 
                            ({ ...wrapper, selected: false })
                        )]
                    );
                } catch (error) {
                    console.error('Failed to parse clipboard data:', error);
                }
            }
        }
    };

    useEffect(() => {
        window.addEventListener('keydown', handleKeyDown);

        // Attach click listener to the container
        document.addEventListener('click', handleContainerClick);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            document.removeEventListener('click', handleContainerClick);
        }
    }, []);

    return (
        <div className="inner-application">
            <div className="message-list">
                <div className="message-table-label">
                    <th>Name</th>
                    <th>Multiplex Status</th>
                    <th>Arbitration ID</th>
                </div>
                <DragDropContext onDragEnd={handleOnDragEnd}>
                    <Droppable droppableId="messages">
                        {(provided, snapshot) => (
                            <div ref={(el) => {
                                    messageListRef.current = el;
                                    provided.innerRef(el)
                                }} 
                                {...provided.droppableProps}
                            >
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
                                                    setMessageWrapper={
                                                        (newMessageWrapper) => setMessageWrapper(index, newMessageWrapper)
                                                    }
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
