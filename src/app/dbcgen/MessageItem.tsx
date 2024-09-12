import React from "react";
import { MessageWrapper } from "src/types/Message";
import SignalItem from "./SignalItem";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';
import ResizableInput from "../components/ResizableInput";

function MessageItem({ 
        messageWrapper,
        setMessageWrapper,
        toggleEdit
    } : { 
        messageWrapper: MessageWrapper,
        setMessageWrapper: (newMessageWrapper: MessageWrapper) => void,
        toggleEdit: boolean
    }) {

    const handleToggle = () => {
        setMessageWrapper({ 
            message: messageWrapper.message, 
            toggled: !messageWrapper.toggled,
            selected: messageWrapper.selected 
        });
    }

    return (
        <div className={`message-item ${messageWrapper.selected ? 'selected' : ''}`}>
            <div className="message-details">
                {messageWrapper.message.signals.length > 0 ? (
                    <FontAwesomeIcon 
                        icon={faChevronDown} 
                        onClick={handleToggle} 
                        className={`arrow-icon ${messageWrapper.toggled ? 'flip-up' : 'flip-down'}`} 
                    />
                ) : (
                    <FontAwesomeIcon 
                        icon={faChevronDown} 
                        className="arrow-icon" 
                        color="#aaa"
                    />
                )}
                <div id="message-name">
                    {toggleEdit ? (
                        <ResizableInput value={messageWrapper.message.name}
                            onChange={e => 
                            setMessageWrapper({ 
                                message: { ...messageWrapper.message, name: e.target.value }, 
                                toggled: messageWrapper.toggled,
                                selected: messageWrapper.selected 
                            })
                        } />
                    ) : (
                        <span>{messageWrapper.message.name}</span>
                    )}
                </div>
                <div>{messageWrapper.message.multiplexed ? "Multiplexed" : "Not Multiplexed"}</div>
                <div>
                    {toggleEdit ? (
                        <ResizableInput value={messageWrapper.message.arb_id.toString()}
                            onChange={e => 
                            setMessageWrapper({ 
                                message: { ...messageWrapper.message, arb_id: parseInt(e.target.value) }, 
                                toggled: messageWrapper.toggled,
                                selected: messageWrapper.selected 
                            })
                        } />
                    ) : (
                        <span>{messageWrapper.message.arb_id}</span>
                    )}
                </div>
            </div>
            {messageWrapper.toggled && (
                <div className="signals-container">
                    {messageWrapper.message.signals.map((signal, index) => (
                        <SignalItem key={index} signal={signal} />
                    ))}
                </div>    
            )}
        </div>
    );
}

export default MessageItem;
