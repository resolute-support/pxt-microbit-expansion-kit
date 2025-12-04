//% color="#ff6800" icon="\uf021" weight=15
namespace servo360 {

    enum Direction {
        Clockwise = 0,
        AntiClockwise = 1
    }

    //% block="servo pin %pin rotate %direction at %power"
    //% pin.shadow="pins.analogPin"
    //% power.min=0 power.max=100
    export function servoWritePin(pin: AnalogPin, direction: Direction, power: number): void {
        let pulse = 1500
        if (direction === Direction.Clockwise) {
            pulse = 1500 + Math.map(power, 0, 100, 0, 500)
        } else {
            pulse = 1500 - Math.map(power, 0, 100, 0, 500)
        }
        pins.servoSetPulse(pin, pulse)
    }

}
