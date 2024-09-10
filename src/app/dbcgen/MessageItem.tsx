import React, { useState } from "react";
import { Message, MessageWrapper } from "src/types/Message";
import SignalItem from "./SignalItem";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons';
import ResizableInput from "../components/ResizableInput";

function MessageItem(
    { 
        messageWrapper,
        setMessageWrapper
    }: { 
        messageWrapper: MessageWrapper 
        setMessageWrapper: (newMessageWrapper: MessageWrapper) => void
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
                <FontAwesomeIcon
                    icon={faChevronDown}
                    onClick={handleToggle}
                    className={`arrow-icon ${messageWrapper.toggled ? 'flip-up' : 'flip-down'}`}
                />
                <div id="message-name">
                    <ResizableInput value={messageWrapper.message.name}
                        onChange={e => 
                        setMessageWrapper({ 
                            message: { ...messageWrapper.message, name: e.target.value }, 
                            toggled: messageWrapper.toggled,
                            selected: messageWrapper.selected 
                        })
                    } />
                </div>
                <div>{messageWrapper.message.multiplexed ? "Multiplexed" : "Not Multiplexed"}</div>
                <div>
                    <ResizableInput value={messageWrapper.message.arb_id.toString()}
                        onChange={e => 
                        setMessageWrapper({ 
                            message: { ...messageWrapper.message, arb_id: parseInt(e.target.value) }, // TODO: Add validation, error handling
                            toggled: messageWrapper.toggled,
                            selected: messageWrapper.selected
                        }) 
                    } />
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