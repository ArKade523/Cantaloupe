import * as fs from 'fs';
import * as path from 'path';
import { Message } from 'src/types/Message';

class DBCGenerator {
  constructor(private messages: Message[]) {}

  public generate(): string {
    let dbcContent = '';

    // Add version (optional)
    dbcContent += `VERSION ""\n\n`;

    // Add required new symbols section
    dbcContent += `NS_ :\n`;
    dbcContent += `\tNS_DESC_\n\tCM_\n\tBA_DEF_\n\tBA_\n\tVAL_\n\tCAT_DEF_\n\tCAT_\n\tFILTER\n`;
    dbcContent += `\tBA_DEF_DEF_\n\tEV_DATA_\n\tENVVAR_DATA_\n\tSGTYPE_\n\tSGTYPE_VAL_\n`;
    dbcContent += `\tBA_DEF_SGTYPE_\n\tBA_SGTYPE_\n\tSIG_TYPE_REF_\n\tVAL_TABLE_\n\tSIG_GROUP_\n`;
    dbcContent += `\tSIG_VALTYPE_\n\tSIGTYPE_VALTYPE_\n\tBO_TX_BU_\n\tBA_DEF_REL_\n\tBA_REL_\n`;
    dbcContent += `\tBA_DEF_DEF_REL_\n\tBU_SG_REL_\n\tBU_EV_REL_\n\tBU_BO_REL_\n\tSG_MUL_VAL_\n\n`;

    // Add bit timing (optional)
    dbcContent += `BS_:\n\n`;

    // Define nodes (assumed from transmitters and receivers)
    const nodes = new Set<string>();
    for (const message of this.messages) {
      nodes.add(message.transmitter);
      for (const signal of message.signals) {
        signal.receivers.forEach((receiver) => nodes.add(receiver));
      }
    }
    dbcContent += `BU_: ${Array.from(nodes).join(' ')}\n\n`;

    // Add messages and signals
    for (const message of this.messages) {
      dbcContent += `BO_ ${message.arb_id} ${message.name}: ${message.size} ${message.transmitter}\n`;

      for (const signal of message.signals) {
        const multiplex = signal.multiplexerIndicator ? ` ${signal.multiplexerIndicator}` : '';
        const byteOrder = signal.byteOrder === 'Motorola' ? '0' : '1';
        const valueType = signal.signed ? '-' : '+';
        const receivers = signal.receivers.length > 0 ? signal.receivers.join(',') : 'Vector__XXX';

        dbcContent += ` SG_ ${signal.name}${multiplex} : ${signal.bitOffset}|${signal.length}@${byteOrder}${valueType} `;
        dbcContent += `(${signal.scale},${signal.offset}) [${signal.minimum}|${signal.maximum}] "${signal.unit}" ${receivers}\n`;
      }
      dbcContent += '\n';
    }

    return dbcContent;
  }

  public writeToFile(outputPath: string): void {
    const content = this.generate();
    fs.writeFileSync(outputPath, content, 'utf-8');
  }
}

export default DBCGenerator;
// Usage example
// const messages: Message[] = [
//   {
//     id: 200,
//     name: 'ExampleMessage',
//     size: 8,
//     transmitter: 'Vector__XXX',
//     signals: [
//       {
//         name: 'ExampleSignal1',
//         multiplexerIndicator: null,
//         bitOffset: 0,
//         length: 8,
//         byteOrder: 'Intel',
//         signed: false,
//         scale: 1,
//         offset: 0,
//         minimum: 0,
//         maximum: 255,
//         unit: 'units',
//         receivers: ['Receiver1', 'Receiver2'],
//         multiplexorId: null,
//         multiplexorValue: null,
//       },
//       {
//         name: 'ExampleSignal2',
//         multiplexerIndicator: 'm0',
//         startBit: 8,
//         length: 8,
//         byteOrder: 'Intel',
//         valueType: 'signed',
//         factor: 0.1,
//         offset: 0,
//         minimum: 0,
//         maximum: 25.5,
//         unit: 'units',
//         receivers: ['Receiver3'],
//       },
//     ],
//   },
// ];

// // Generate DBC content
// const generator = new DBCGenerator(messages);
// const dbcContent = generator.generate();

// // Optionally write to file
// const outputPath = path.join(__dirname, 'output.dbc');
// generator.writeToFile(outputPath);

// console.log('DBC file generated successfully.');
