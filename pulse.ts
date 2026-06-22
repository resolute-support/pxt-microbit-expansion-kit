let PULSE_EVENT_ID = 9001

//% color="#ff6800" icon="\uf21e" weight=15
namespace pulse {

    let lastBeatTime = 0
    let firstBeat = true
    let beatLockout = false

    let lastBeatDetectedTime = 0

    let bpm = 0
    let bpmFiltered = 0

    let ibi = 0
    let ibiHistory: number[] = []
    const IBI_HISTORY_SIZE = 10

    let sensorPin: AnalogPin = undefined
    let prevValue = 0

    let baseline = 0
    let peak = 0
    let threshold = 0

    const minBeatInterval = 700
    const maxBeatInterval = 1500

    control.inBackground(function () {

        while (true) {

            if (sensorPin == undefined) {
                basic.pause(50)
                continue
            }

            let value = pins.analogReadPin(sensorPin)
            let now = control.millis()

            // Detect finger re-inserted and re-initialise detector
            if (bpm == 0 && Math.abs(value - baseline) > 40) {
                hardReset(value)
            }

            baseline = baseline * 0.95 + value * 0.05

            let signal = value - baseline
            peak = Math.max(peak * 0.98, signal)

            threshold = baseline + peak * 0.3   // 🔧 lowered

            // Peak detection
            if (
                !beatLockout &&
                Math.abs(prevValue - baseline) > peak * 0.75 &&
                Math.abs(prevValue) > Math.abs(value)
            ) {

                let delta = now - lastBeatTime

                if (delta > minBeatInterval && delta < maxBeatInterval) {

                    beatLockout = true

                    if (firstBeat) {
                        firstBeat = false
                        lastBeatTime = now
                    } else {
                        ibi = delta
                        lastBeatTime = now

                        ibiHistory.push(ibi)
                        if (ibiHistory.length > IBI_HISTORY_SIZE) {
                            ibiHistory.shift()
                        }

                        let sorted = ibiHistory.slice()
                        sorted.sort()
                        let mid = Math.idiv(sorted.length, 2)
                        let medianIbi = sorted[mid]

                        let instantBpm = 60000 / medianIbi

                        instantBpm *= 0.82

                        bpmFiltered = bpmFiltered == 0
                            ? instantBpm
                            : bpmFiltered * 0.6 + instantBpm * 0.4

                        bpm = Math.round(bpmFiltered)
                        lastBeatDetectedTime = now
                        control.raiseEvent(PULSE_EVENT_ID, 1)
                    }
                }
            }

            if (value < baseline + peak * 0.1) {
                beatLockout = false
            }

            prevValue = value
            updateTimeout()
            basic.pause(10)
        }
    })

    function hardReset(value: number) {
        baseline = value
        peak = 0
        threshold = value
        prevValue = value

        bpm = 0
        bpmFiltered = 0
        ibi = 0
        ibiHistory = []

        firstBeat = true
        beatLockout = false
        lastBeatTime = control.millis()
        lastBeatDetectedTime = control.millis()

        serial.writeLine("hard resetting")
    }

    function updateTimeout() {
        if (control.millis() - lastBeatDetectedTime > 3000) {
            bpm = 0
        }
    }

    /**
    * Attaches the heartbeat sensor to a pin
    * @param pin the pin the pulse sensor is connected to
    */
    //% block="attach Pulse Sensor to %pin"
    //% pin.shadow="pins.analogPin"
    //% weight=100
    export function attachSensor(pin: AnalogPin) {
        sensorPin = pin

        let v = pins.analogReadPin(pin)
        prevValue = v
        baseline = v
        peak = 0

        lastBeatTime = control.millis()
        bpm = 0
        bpmFiltered = 0
        ibi = 0
        ibiHistory = []
        firstBeat = true
        beatLockout = false
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