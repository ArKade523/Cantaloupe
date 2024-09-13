import React from "react"
import Signal from "src/types/Signal"

function SignalItem ({ signal }: { signal: Signal }) {

    return (
        <>
            <div className="signal-item">
                <span>{signal.name}</span>
                <span>{signal.bit_offset}</span>
                <span>{signal.length}</span>
                <span>{signal.scale}</span>
                <span>{signal.max_value}</span>
            </div>
        </>
    )

}

export default SignalItem