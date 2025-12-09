//% color="#ff6800" icon="\uf085" weight=15
namespace servo360 {

    export enum Direction {
        //% block="clockwise"
        Clockwise = 0,
        //% block="anti-clockwise"
        AntiClockwise = 1
    }

    //% block="servo pin %pin rotate %Direction at $power \\%"
    //% pin.shadow="pins.analogPin"
    //% power.shadow="number"
    //% power.min=0 power.max=100
    //% power.defl=50
    export function servoWritePin(pin: AnalogPin, direction: Direction, power: number): void {
        let pulse = 1500
        if (direction === Direction.Clockwise) {
            pulse = 1500 + Math.map(power, 0, 100, 0, 500)
        } else {
            pulse = 1500 - Math.map(power, 0, 100, 0, 500)
        }
        pins.servoSetPulse(pin, pulse)
    }

    //% block="stop servo on pin %pin"
    //% pin.shadow="pins.analogPin"
    export function stopServo(pin: AnalogPin): void {
        pins.servoSetPulse(pin, 1500)
    }
}