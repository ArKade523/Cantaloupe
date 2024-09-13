import Signal from './Signal'

export interface Message {
    arb_id: number;
    name: string;
    size: number;
    transmitter: string;
    signals: Signal[];
}

export type MessageWrapper = {
    message: Message;
    toggled: boolean;
    selected: boolean;
}
