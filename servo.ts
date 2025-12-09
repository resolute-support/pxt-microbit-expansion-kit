//% color="#ff6800" icon="\uf085" weight=15
namespace servo360 {

    export enum ServoDirection {
        //% block="clockwise"
        Clockwise = 1,
        //% block="anti-clockwise"
        AntiClockwise = 0
    }

    /**
    * Rotate a 360° servo
    */
    //% block="servo pin $pin rotate $direction at $speed \\% power"
    //% speed.min=0 speed.max=100
    export function servoWritePin(pin:AnalogPin, direction: ServoDirection, speed: number) {
        let pulse = 1500
        if (direction === ServoDirection.Clockwise) {
            pulse = 1500 - Math.map(speed, 0, 100, 0, 1000)
        } else {
            pulse = 1500 + Math.map(speed, 0, 100, 0, 1000)
        }
        pins.servoSetPulse(pin, pulse)
    }

    /**
     * Stop a 360° servo
     */
    //% block="stop servo on pin %pin"
    //% pin.shadow="pins.analogPin"
    export function stopServo(pin: AnalogPin): void {
        pins.servoSetPulse(pin, 1500)
    }
}
