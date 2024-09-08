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
];

function DBCEditor() {
    const [messageWrappers, setMessageWrappers] = useState<MessageWrapper[]>(
        initialMessages.map(message => {
            return {
                message,
                toggled: false
            } as MessageWrapper
        })
    )

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

    return (
        <div className="inner-application">
            <div className="pane-header">
                <h1 className="pane-header">DBC Editor</h1>
                <hr />
            </div>
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
