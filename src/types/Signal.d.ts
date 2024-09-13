type Signal = {
    multiplexor: boolean,
    multiplexed: boolean,
    signed: boolean,
    intern_id: number,
    name: string,
    length: number,
    bit_offset: number,
    offset: number,
    max_value: number,
    scale: number,
    multiplexor_id: number | null,
    multiplexor_value: number | null
}

// interface Signal {
//     name: string;
//     multiplexerIndicator: string | null;
//     startBit: number;
//     length: number;
//     byteOrder: 'Motorola' | 'Intel';
//     valueType: 'signed' | 'unsigned';
//     factor: number;
//     offset: number;
//     minimum: number;
//     maximum: number;
//     unit: string;
//     receivers: string[];
// }
  
export default Signal;