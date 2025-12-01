//% color="#ff6800" icon="\uf21e" weight=15
namespace pulse {
    let sensorPin: AnalogPin = undefined
    let prevHeartValue = 0
    let heartDeltaValue = 0

    let lastBeatTime = 0
    let bpm = 0

    // Minimum interval between beats to prevent double counting (ms)
    const minBeatInterval = 300

    // Run high-speed heartbeat loop in background
    control.inBackground(function () {
        while (true) { 
            // Check if sensor pin is attached
            if (sensorPin == undefined) {
                return
            }

            // Read sensor
            let sensorValue = pins.analogReadPin(sensorPin)

            // Simple delta detection
            heartDeltaValue = (sensorValue  - prevHeartValue) / 2
            if (heartDeltaValue < 1) {
                heartDeltaValue = 0
            } else {
                heartDeltaValue = 1
            }
            prevHeartValue = sensorValue

            // ----- BPM Logic -----
            if (heartDeltaValue == 1) {
                let now = input.runningTime()  // current time in ms
                if (lastBeatTime > 0 && (now - lastBeatTime) > minBeatInterval) {
                    let interval = now - lastBeatTime  // time between beats
                    bpm = Math.round(60000 / interval) // convert to BPM
                }
                lastBeatTime = now
            }
            basic.pause(100);
        }
    })

    /**
    * Attaches the heartbeat sensor to a pin
    * @param pin the pin the pulse sensor is connected to
    */
    //% block="attach Pulse Sensor to %pin"
    //% pin.shadow="pins.analogPin"
    //% weight=100
    export function attachSensor(pin: AnalogPin) {
        sensorPin = pin
    }


    /**
     * Returns the current BPM measured by the heartbeat sensor.
     */
    //% block="get heartbeat BPM"
    //% blockId="expansionPack_getBPM"
    //% weight=100
    export function getBPM(): number {
        return bpm
    }
}
