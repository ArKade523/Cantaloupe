import React, { useState } from "react";
import Message from "src/types/Message";
import SignalItem from "./SignalItem";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';

function MessageItem({ message }: { message: Message }) {
    const [isExpanded, setIsExpanded] = useState(false);

    return (
        <div className="message-item">
            <div className="message-details">
                <FontAwesomeIcon
                    icon={faChevronDown}
                    onClick={() => setIsExpanded(!isExpanded)}
                    className={`arrow-icon ${isExpanded ? 'flip-up' : 'flip-down'}`}
                />
                <h2 id="message-name">{message.name}</h2>
                <p>{message.multiplexed ? "Multiplexed" : "Not Multiplexed"}</p>
                <p>{message.arb_id}</p>
            </div>
            {isExpanded && (
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