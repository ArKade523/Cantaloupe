import React, { useState, useEffect, useRef } from 'react'
import { Message, MessageWrapper } from '../../types/Message'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'
import MessageItem from './MessageItem';
import Toggle from '../components/Toggle';
import { faPen, faStop } from '@fortawesome/free-solid-svg-icons';
import Signal from '../../types/Signal';

const initialMessages: Message[] = [
    { name: 'Message 1', arb_id: 123, size: 32, transmitter: "None", signals: [
        new Signal({ name: "Sig 1", bitOffset: 0, length: 8, internId: 0, 
                    signed: false, scale: 1, offset: 0, multiplexorId: null, 
                    multiplexorValue: null, multiplexerIndicator: null, unit: '',
                    receivers: [], byteOrder: 'Motorola' }),
        new Signal({ name: "Sig 2", bitOffset: 8, length: 8, internId: 0, 
                    signed: false, scale: 1, offset: 0, multiplexorId: null, 
                    multiplexorValue: null, multiplexerIndicator: null, unit: '',
                    receivers: [], byteOrder: 'Motorola' }),
        new Signal({ name: "Sig 3", bitOffset: 16, length: 8, internId: 0, 
                    signed: false, scale: 1, offset: 0, multiplexorId: null, 
                    multiplexorValue: null, multiplexerIndicator: null, unit: '',
                    receivers: [], byteOrder: 'Motorola' }),
                ] },
    { name: 'Message 2', arb_id: 456, size: 32, transmitter: "None", signals: [
        new Signal({ name: "Sig 1", bitOffset: 0, length: 8, internId: 0, 
                    signed: false, scale: 1, offset: 0, multiplexorId: null, 
                    multiplexorValue: null, multiplexerIndicator: null, unit: '',
                    receivers: [], byteOrder: 'Motorola' }),
        new Signal({ name: "Sig 2", bitOffset: 8, length: 8, internId: 0, 
                    signed: false, scale: 1, offset: 0, multiplexorId: null, 
                    multiplexorValue: null, multiplexerIndicator: null, unit: '',
                    receivers: [], byteOrder: 'Motorola' }),
        new Signal({ name: "Sig 3", bitOffset: 16, length: 8, internId: 0, 
                    signed: false, scale: 1, offset: 0, multiplexorId: null, 
                    multiplexorValue: null, multiplexerIndicator: null, unit: '',
                    receivers: [], byteOrder: 'Motorola' }),
    ] },
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
    const [toggleEdit, setToggleEdit] = useState<boolean>(false);

    const messageWrappersRef = useRef(messageWrappers);
    const messageListRef = useRef<HTMLDivElement>(null);

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
        if (messageListRef.current && 
            !messageListRef.current.contains(event.target as Node)) {
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
        } else if (event.key === 'Escape') {
            // Deselect all messages
            handleDeselectAll();
        }
    };

    useEffect(() => {
        messageWrappersRef.current = messageWrappers;
    }, [messageWrappers]);

    useEffect(() => {
        window.addEventListener('keydown', handleKeyDown);

        // Attach click listener to the container
        document.addEventListener('click', handleContainerClick);
        return () => { window.removeEventListener('keydown', handleKeyDown);
            document.removeEventListener('click', handleContainerClick);
        }
    }, []);

    return (
        <div className="inner-application">
            <div className="toolbar">
                <div className="tool-section">
                    <Toggle onToggle={() => {setToggleEdit(!toggleEdit)}} 
                        isToggled={toggleEdit} 
                        onSVG={faPen} 
                        offSVG={faPen} 
                        color="#485"
                        fontSize="2rem"
                    />
                    <div className="tool-section-subgroup">
                        <Toggle onToggle={() => {setToggleEdit(!toggleEdit)}} 
                            isToggled={toggleEdit} 
                            onSVG={faPen} 
                            offSVG={faStop} 
                            color={toggleEdit ? 'green' : 'red'}
                        />
                        <Toggle onToggle={() => {setToggleEdit(!toggleEdit)}} 
                            isToggled={toggleEdit} 
                            onSVG={faPen} 
                            offSVG={faStop} 
                            color={toggleEdit ? 'green' : 'red'}
                        />
                        <Toggle onToggle={() => {setToggleEdit(!toggleEdit)}} 
                            isToggled={toggleEdit} 
                            onSVG={faPen} 
                            offSVG={faStop} 
                            color={toggleEdit ? 'green' : 'red'}
                        />
                        <Toggle onToggle={() => {setToggleEdit(!toggleEdit)}} 
                            isToggled={toggleEdit} 
                            onSVG={faPen} 
                            offSVG={faStop} 
                            color={toggleEdit ? 'green' : 'red'}
                        />
                    </div>
                </div>
                <div className="divider"></div>
                <div className="tool-section">
                    <button onClick={handleDeselectAll}>Deselect All</button>
                </div>
            </div>
            <div className="table">
                <div className="table-header table-row">
                    <h3>Name</h3>
                    <h3>Multiplex Status</h3>
                    <h3>Arbitration ID</h3>
                </div>
                <DragDropContext onDragEnd={handleOnDragEnd}>
                    <Droppable droppableId="messages">
                        {(provided, _) => (
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
                                                    toggleEdit={toggleEdit}
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
