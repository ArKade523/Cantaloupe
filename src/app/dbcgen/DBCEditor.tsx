import React, { useState, useEffect } from 'react'
import { Message, toggleMessage } from '../../types/Message'
import Signal from '../../types/Signal'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'
import MessageItem from './MessageItem';

function DBCEditor() {
  const [messages, setMessages] = useState<Message[]>([]);

  const handleOnDragEnd = (result: { destination: { index: number; }; source: { index: number; }; }) => {
    if (!result.destination) return;

    const updatedMessages = Array.from(messages)
    const [reorderedMessage] = updatedMessages.splice(result.source.index, 1)
    updatedMessages.splice(result.destination.index, 0, reorderedMessage)

    setMessages(updatedMessages)
  }

  useEffect(() => {
    const newMessage1: Message = {
        name: "test",
        multiplexed: false,
        arb_id: 1,
        signals: [
            {
                name: "test_signal",
                start_bit: 0,
                size: 8,
                endianess: "big",
                is_signed: false,
                factor: 1,
                offset: 0,
                min: 0,
                max: 255
            },
            {
                name: "test_signal2",
                start_bit: 8,
                size: 8,
                endianess: "big",
                is_signed: false,
                factor: 1,
                offset: 0,
                min: 0,
                max: 255
            }
        ],
        toggled: false
    }

    const newMessage2: Message = {
        name: "test2",
        multiplexed: true,
        arb_id: 2,
        signals: [],
        toggled: false
    }

    setMessages([...messages, newMessage1, newMessage2])
  }, [])

  const handleToggle = (id: number) => {
        setMessages(messages.map((msg) =>
            msg.arb_id === id ? toggleMessage(msg) : msg
        ));
  };

  return (
    <div className="inner-application">
      <h1 className="pane-header">DBC Editor</h1>
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
                        {messages.map((message, index) => (
                            <Draggable key={index} draggableId={`${index}`} index={index}>
                                {(provided) => (
                                    <div
                                        ref={provided.innerRef}
                                        {...provided.draggableProps}
                                        {...provided.dragHandleProps}
                                    >
                                        <MessageItem message={message} onToggle={handleToggle} />
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
