//% color="#ff6800" icon="\uf0e7" weight=15 block="Voltage Sensor"
namespace VoltageSensor {

    let sensorPin: AnalogPin = undefined

    /**
     * Attach Voltage sensor to a pin
     */
    //% block="attach Voltage sensor to pin %pin"
    //% pin.shadow="pins.analogPin"
    //% weight=100
    export function attachSensor(pin: AnalogPin): void {
        sensorPin = pin
    }

    /**
     * Read voltage from sensor
     */
    //% block="read Voltage"
    export function readVoltage(): number {
        if (sensorPin === undefined) return 0
        let reading = pins.analogReadPin(AnalogPin.P0)
        let voltage = reading * (16.5/1023)
        return voltage
    }
}
