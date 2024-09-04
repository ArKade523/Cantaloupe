import React from "react"
import Signal from "src/types/Signal"

function SignalItem ({ signal }: { signal: Signal }) {

    return (
        <>
            <div className="signal-item">
                <h3>{signal.name}</h3>
                <p>{signal.start_bit}</p>
                <p>{signal.size}</p>
                <p>{signal.endianess}</p>
                <p>{signal.is_signed ? "Signed" : "Unsigned"}</p>
                <p>{signal.factor}</p>
                <p>{signal.offset}</p>
                <p>{signal.min}</p>
                <p>{signal.max}</p>
            </div>
        </>
    )

}

export default SignalItem