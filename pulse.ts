const PULSE_EVENT_ID = 9001

//% color="#ff6800" icon="\uf21e" weight=15
namespace pulse {
    let startTime:any = null;
    let lastTime:any = null;
    let currentTime:any = null;
    let elapsedTime:any = null;

    let heartDeltaValue = 0;
    let prevHeartValue = 0;
    let pulseCount = 0

    let bpmFiltered = 0;
    let bpm = 0

    let sensorPin: AnalogPin = undefined

    // Minimum interval between beats to prevent double counting (ms)
    const minBeatInterval = 300

    // Run high-speed heartbeat loop in background
    control.inBackground(function () {
        while (true) { 
            // Check if sensor pin is attached
            if (sensorPin == undefined) {
                return
            }
            updateTime()

            // Read sensor
            let sensorValue = pins.analogReadPin(sensorPin)

            // Simple delta detection
            heartDeltaValue = (sensorValue  - prevHeartValue) / 2
            if (heartDeltaValue < 1) {
                heartDeltaValue = 0
            } else {
                heartDeltaValue = 1
                calculateRunningBpm()
                control.raiseEvent(PULSE_EVENT_ID, 1)
            }
            prevHeartValue = sensorValue

            if (elapsedTime >= 5) {
                let tempBpm = pulseCount * 12
                bpmFiltered = (bpmFiltered*0.7 +tempBpm*0.3)
                bpm = Math.round(bpmFiltered)
                startTime = currentTime
                pulseCount = 0
            }
            basic.pause(10);
        }
    })

    function calculateRunningBpm() {
        if ((control.millis() - lastTime) > 250) {
            pulseCount += 1
            lastTime = control.millis()
        }
    }

    function updateTime() {
        currentTime = control.millis()
        elapsedTime = (currentTime - startTime)/1000
    }

    /**
    * Attaches the heartbeat sensor to a pin
    * @param pin the pin the pulse sensor is connected to
    */
    //% block="attach Pulse Sensor to %pin"
    //% pin.shadow="pins.analogPin"
    //% weight=100
    export function attachSensor(pin: AnalogPin) {
        let startTime = control.millis();
        let lastTime = 0;
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

    /**
    * Do something whenever a pulse is detected
    */
    //% block="on pulse detected"
    //% draggableParameters="reporter"
    //% weight=85
    export function onPulseDetected(handler: () => void) {
        control.onEvent(PULSE_EVENT_ID, 1, handler)
    }
}
