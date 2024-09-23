import React from "react"
import Signal from "src/types/Signal"

function SignalItem ({ signal }: { signal: Signal }) {

    return (
        <>
            <div className="signal-item">
                <span>{signal.name}</span>
                <span>{signal.bitOffset}</span>
                <span>{signal.length}</span>
                <span>{signal.scale}</span>
                <span>{signal.maximum}</span>
            </div>
        </>
    )

}

export default SignalItem