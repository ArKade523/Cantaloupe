import React, { useState, useRef, useEffect } from 'react';

interface ResizableInputProps {
    value: string;
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const ResizableInput: React.FC<ResizableInputProps> = ({ value, onChange }) => {
    const [inputWidth, setInputWidth] = useState(1); // Default width to prevent 0-width issues
    const spanRef = useRef<HTMLSpanElement>(null); // Reference to hidden span for calculating width

    useEffect(() => {
        if (spanRef.current) {
            const width = spanRef.current.offsetWidth; // Get width of the hidden span
            setInputWidth(width + 2); // Add a small buffer to avoid cutting off text
        }
    }, [value]); // Recalculate width whenever the value changes

    return (
        <div style={{ display: 'inline-block', position: 'relative', margin: 0, padding: 0 }}>
            {/* Hidden span to calculate text width */}
            <span
                ref={spanRef}
                style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    visibility: 'hidden',
                    whiteSpace: 'pre', // Keep spaces intact
                    fontFamily: 'inherit',
                    fontSize: 'inherit',
                    fontWeight: 'inherit',
                }}
            >
                {value || ' '} {/* Ensures span has content to calculate width */}
            </span>

            {/* Actual input element */}
            <input
                type="text"
                value={value}
                onChange={onChange}
                style={{
                    width: `${inputWidth}px`, // Set input width to calculated width
                    boxSizing: 'content-box', // Ensure padding and border do not affect width
                    fontFamily: 'inherit',
                    fontSize: 'inherit',
                }}
            />
        </div>
    );
};

export default ResizableInput;
