type SignalConfig = {
    multiplexerIndicator: string | null
    signed: boolean
    internId: number
    name: string
    length: number
    bitOffset: number
    byteOrder: 'Motorola' | 'Intel'
    offset: number
    scale: number
    unit: string
    receivers: string[]
    multiplexorId: number | null
    multiplexorValue: number | null
}

class Signal {
    multiplexerIndicator: string | null
    signed: boolean
    internId: number
    name: string
    length: number
    bitOffset: number
    byteOrder: 'Motorola' | 'Intel'
    offset: number
    scale: number
    unit: string
    receivers: string[]
    multiplexorId: number | null
    multiplexorValue: number | null

    constructor({
        name,
        bitOffset,
        length,
        internId,
        signed,
        scale,
        offset,
        multiplexerIndicator = null,
        multiplexorId = null,
        multiplexorValue = null,
        unit = '',
        receivers = [],
        byteOrder = 'Motorola',
    }: SignalConfig) {
        this.multiplexerIndicator = multiplexerIndicator
        this.signed = signed
        this.internId = internId
        this.name = name
        this.length = length
        this.bitOffset = bitOffset
        this.byteOrder = byteOrder
        this.offset = offset
        this.scale = scale
        this.unit = unit
        this.receivers = receivers
        this.multiplexorId = multiplexorId
        this.multiplexorValue = multiplexorValue
    }

    get maximum(): number {
        return this.scale * (Math.pow(2, this.length) - 1) + this.offset
    }

    get minimum(): number {
        return this.signed ? -(Math.pow(2, this.length - 1)) * this.scale + this.offset : this.offset
    }
}

export default Signal;