import * as fs from 'fs';
import * as path from 'path';
import { Message } from 'src/types/Message';
import Signal from 'src/types/Signal';

class DBCParser {
  private messages: Map<number, Message> = new Map();

  constructor(private dbcFilePath: string) {}

  public parse(): void {
    const data = fs.readFileSync(this.dbcFilePath, 'utf-8');
    const lines = data.split(/\r?\n/);

    let currentMessage: Message | null = null;
    let numSignals = 0;

    for (let line of lines) {
      line = line.trim();

      // Skip empty lines and comments
      if (line === '' || line.startsWith('//') || line.startsWith('CM_') || line.startsWith('BA_')) {
        continue;
      }

      if (line.startsWith('BO_')) {
        // Message definition
        const messageMatch = line.match(/^BO\_ (\d+) (\w+) *: (\d+) (\w+)/);
        if (messageMatch) {
          const arb_id = parseInt(messageMatch[1]);
          const name = messageMatch[2];
          const size = parseInt(messageMatch[3]);
          const transmitter = messageMatch[4];
          currentMessage = {
            arb_id,
            name,
            size,
            transmitter,
            signals: [],
          };
          this.messages.set(arb_id, currentMessage);
          numSignals = 0;
        }
      } else if (line.startsWith('SG_') && currentMessage) {
        // Signal definition
        const signalMatch = line.match(
          /^SG\_ (\w+)(?: (\w+))? *: (\d+)\|(\d+)@([01])([+-]) *\(([0-9\.\-eE]+),([0-9\.\-eE]+)\) *\[([0-9\.\-eE]+)\|([0-9\.\-eE]+)\] *"([^"]*)" *(.*)/
        );

        if (signalMatch) {
          const name = signalMatch[1];
          const multiplexerIndicator = signalMatch[2] || null;
          const bitOffset = parseInt(signalMatch[3]);
          const length = parseInt(signalMatch[4]);
          const byteOrder = signalMatch[5] === '0' ? 'Motorola' : 'Intel';
          const signed = signalMatch[6] === '-';
          const scale = parseFloat(signalMatch[7]);
          const offset = parseFloat(signalMatch[8]);
          const minimum = parseFloat(signalMatch[9]);
          const maximum = parseFloat(signalMatch[10]);
          const unit = signalMatch[11];
          const receivers = signalMatch[12].split(',').map((r) => r.trim()).filter((r) => r !== '');

          const signal: Signal = {
            name,
            multiplexerIndicator,
            multiplexorId: multiplexerIndicator ? currentMessage?.signals.find((s) => s.name === multiplexerIndicator)?.internId : null,
            multiplexorValue: multiplexerIndicator ? parseInt(multiplexerIndicator.slice(1)) : null,
            bitOffset,
            length,
            byteOrder,
            signed,
            scale,
            offset,
            minimum,
            maximum,
            unit,
            receivers,
            internId: numSignals++,
          };

          currentMessage.signals.push(signal);
        }
      }
    }
  }

  public getMessages(): Message[] {
    return Array.from(this.messages.values());
  }
}

export default DBCParser;

// Usage example
// const dbcFilePath = path.join(__dirname, 'your_file.dbc');
// const parser = new DBCParser(dbcFilePath);
// parser.parse();
// const messages = parser.getMessages();

// console.log(JSON.stringify(messages, null, 2));
