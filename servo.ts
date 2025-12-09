//% color="#ff6800" icon="\uf085" weight=15
namespace servo360 {

    export enum ServoDirection {
        //% block="clockwise"
        Clockwise = 0,
        //% block="anti-clockwise"
        AntiClockwise = 1
    }

    /**
     * Rotate a 360° servo
     */
    //% block="servo pin %pin rotate %direction at %power \\%" 
    //% pin.shadow="pins.analogPin"
    //% power.shadow="math_number" power.defl=50 power.min=0 power.max=100
    export function servoWritePin(pin: AnalogPin, direction: ServoDirection, power: number): void {
        let pulse = 1500
        if (direction === ServoDirection.Clockwise) {
            pulse = 1500 + Math.map(power, 0, 100, 0, 500)
        } else {
            pulse = 1500 - Math.map(power, 0, 100, 0, 500)
        }
        pins.servoSetPulse(pin, pulse)
    }

    /**
     * move the car left, right, forward or backwards
     * @param direction type of movement to make
     * @param speed how fast to make movement
     */
    //% block="servo pin $pin rotate $direction $speed \\% speed"
    //% speed.min=0 speed.max=100
    export function run(direction: ServoDirection, speed: number) {
        // logic here
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
