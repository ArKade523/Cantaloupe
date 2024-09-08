import Signal from './Signal'

export type Message = {
    multiplexed: boolean,
    arb_id: number,
    signals: Signal[],
    name: string,
};

export type MessageWrapper = {
    message: Message;
    toggled: boolean;
}
