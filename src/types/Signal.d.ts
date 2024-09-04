export default type Signal = {
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
  multiplexor_id: number,
  multiplexor_value: number
}
