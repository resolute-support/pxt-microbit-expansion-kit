enum FanDirection {
    Clockwise = 0,
    AntiClockwise = 1
}

//% color="#ff6800" icon="\uf1aa" weight=15
namespace fanMotor {

    let pinA: AnalogPin = undefined
    let pinB: AnalogPin = undefined

    // Attach fan pins
    //% block="attach Fan module to pins A %APIN | B %BPIN"
    //% APIN.shadow="pins.pwmPin"
    //% BPIN.shadow="pins.pwmPin"
    //% weight=100
    export function attachSensor(APIN: AnalogPin, BPIN: AnalogPin) {
        pinA = APIN
        pinB = BPIN
    }

    // Set fan direction & power
    //% block="set Fan %direction | power %power"
    //% power.min=0 power.max=100
    //% weight=100
    export function setFan(direction: FanDirection, power: number) {
        if (pinA === undefined || pinB === undefined) return

        let pwmValue = Math.max(0, Math.min(255, 255 - Math.round(power * 255 / 100)))

        if (direction == 0) {
            // Clockwise
            pins.analogWritePin(pinA, 0)
            pins.analogWritePin(pinB, pwmValue)
        } else {
            // Anti-Clockwise
            pins.analogWritePin(pinA, pwmValue)
            pins.analogWritePin(pinB, 0)
        }
    }

    // Stop fan
    //% block="stop Fan"
    //% weight=100
    export function stopFan() {
        if (pinA === undefined || pinB === undefined) return
        pins.analogWritePin(pinA, 0)
        pins.analogWritePin(pinB, 0)
    }
}
