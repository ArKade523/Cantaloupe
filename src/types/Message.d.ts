import Signal from './Signal.d.ts'

type Message = {
  multiplexed: boolean,
  arb_id: number,
  signals: Signal[],
  name: string
};

export default Message;