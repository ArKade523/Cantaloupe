import React, { useState } from "react";
import { Message } from "src/types/Message";
import SignalItem from "./SignalItem";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons';

function MessageItem({ message, onToggle }: { message: Message, onToggle: (message_arb_id: number) => void }) {
    return (
        <div className="message-item">
            <div className="message-details">
                <FontAwesomeIcon
                    icon={faChevronDown}
                    onClick={ () => onToggle(message.arb_id) }
                    className={`arrow-icon ${message.toggled ? 'flip-up' : 'flip-down'}`}
                />
                <h2 id="message-name">{message.name}</h2>
                <p>{message.multiplexed ? "Multiplexed" : "Not Multiplexed"}</p>
                <p>{message.arb_id}</p>
            </div>
            {message.toggled && (
                <div className="signals-container">
                    {message.signals.map((signal, index) => (
                        <SignalItem key={index} signal={signal} />
                    ))}
                </div>    
            )}
        </div>
    );
}

export default MessageItem;