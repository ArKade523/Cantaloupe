import Signal from './Signal'

export type Message = {
    multiplexed: boolean,
    arb_id: number,
    signals: Signal[],
    name: string,
    toggled: boolean,
};

export function toggleMessage(message: Message) {
    return { ...message, toggled: !message.toggled }
}