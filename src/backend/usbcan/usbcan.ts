import koffi from 'koffi'
import usbcan from '../innomaker-can-mac-driver-demo'
import * as readline from 'readline';

const bufferCallback = koffi.proto('int bufferCallback(unsigned char*)')
const myBufferCallback = koffi.register((data: any) => {
    if (data.length >= 24) {
        const echoId = data.readUInt32LE(0);
        const canId = data.readUInt32LE(4);
        const canDlc = data.readUInt8(8);
        const channel = data.readUInt8(9);
        const flags = data.readUInt8(10);
        const reserved = data.readUInt8(11);
        const dataBytes = data.slice(12, 12 + canDlc);
        const timestampUs = data.readUInt32LE(20);
    
        console.log(`Received CAN frame:
            echoId: ${echoId},
            canId: 0x${canId.toString(16)},
            canDlc: ${canDlc},
            channel: ${channel},
            data: ${dataBytes.toString('hex')},
            timestamp: ${timestampUs} us
        `);
    } else {
        console.log('Received data of unexpected length:', data.length);
    }
}, koffi.pointer(bufferCallback));

const lib = koffi.load('/Users/kadeangell/Code/sandbox/cantaloupe-frontend/src/backend/innomaker-can-mac-driver-demo/build/Release/usbcan.node')

const scanDevices = lib.func('int scan_devices()')
const getDeviceId = lib.func('int get_device_id(int)')
const openDevice = lib.func('int open_device(int)')
const sendCanFrame = lib.func('int send_can_frame(int, unsigned char*, int)')
const startReceiving = lib.func('start_receiving', 'int', [koffi.pointer(bufferCallback)])
const stopReceiving = lib.func('int stop_receiving()')
const resetDevice = lib.func('int reset_device()')
const closeDevice = lib.func('int close_device()')

export {
    scanDevices,
    getDeviceId,
    openDevice,
    sendCanFrame,
    startReceiving,
    stopReceiving,
    resetDevice,
    closeDevice
}

const deviceCount = scanDevices()
console.log(`Found ${deviceCount} device(s).`);

if (deviceCount === 0) {
    console.log('No devices found. Exiting.');
    process.exit(0);
}

for (let i = 0; i < deviceCount; i++) {
    const deviceId = getDeviceId(i);
    console.log(typeof deviceId);
  console.log(`${i}: Device ID ${deviceId}`);
}

// Ask the user to choose a device
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function sendCanFrameFromTS() {
    const canId = 0x123; // Example CAN ID
    const frameData = Buffer.from([0x01, 0x02, 0x03, 0x04, 0x00, 0x00, 0x00, 0x00]); // Example data (8 bytes)
    const sendResult = sendCanFrame(canId, frameData, 8);

    if (sendResult === 0) {
        console.log(`Sent CAN frame with ID 0x${canId.toString(16)}:`, frameData);
    } else {
        console.log('Failed to send CAN frame.');
    }
}

// Handle shutdown (Ctrl+C)
const handleExit = () => {
    console.log('Stopping reception...');
    stopReceiving();
    console.log('Resetting device...');
    resetDevice(); // Call the new reset function
    console.log('Closing device...');
    closeDevice();
    console.log('Device closed. Exiting.');
    process.exit(0);
};

rl.question('Enter device index to open: ', (answer) => {
    const deviceIndex = parseInt(answer);
    if (isNaN(deviceIndex) || deviceIndex < 0 || deviceIndex >= deviceCount) {
        console.log('Invalid device index.');
        rl.close();
        return;
    }

    // Open the device
    const result = openDevice(deviceIndex);
    if (result !== 0) {
        console.log('Failed to open device.');
        rl.close();
        return;
    }

    console.log(`Device ${deviceIndex} opened successfully.`);

    // Send CAN frame every 5 seconds (5000 milliseconds)
    setInterval(sendCanFrameFromTS, 5000);

    // Start receiving data
    startReceiving(myBufferCallback);

    process.on('SIGINT', handleExit); // Handle Ctrl+C
    process.on('SIGTERM', handleExit); // Handle other termination signals
});