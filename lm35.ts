//% color="#ff6800" icon="\uf2c9" weight=15 block="Temp Sensor"
namespace lm35 {

    let sensorPin: AnalogPin = undefined

    /**
     * Attach LM35 temperature sensor to a pin
     */
    //% block="attach LM35 sensor to pin P0"
    export function attachSensor(): void {
        sensorPin = AnalogPin.P0
    }

    /**
     * Read temperature from LM35 in °C
     */
    //% block="read LM35 temperature"
    export function readTemperature(): number {
        if (sensorPin === undefined) return 0
        let analogValue = pins.analogReadPin(sensorPin)
        // LM35 outputs 10mV per °C, ADC is 3.3V / 1023
        let voltage = analogValue * 3.3 / 1023
        let temperature = voltage * 100 // °C
        return Math.round(temperature)
    }
}
