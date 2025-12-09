//% color="#ff6800" icon="\uf25a" weight=15 block="Knock Sensor"
namespace knockSensor {

    let sensorPin: DigitalPin = undefined
    let knocked = false

    /**
     * Attach knock sensor to a digital pin
     */
    //% block="attach knock sensor to pin %pin"
    //% pin.shadow="pins.digitalPin"
    export function attachSensor(pin: DigitalPin): void {
        sensorPin = pin
        pins.setPull(sensorPin, PinPullMode.PullUp)
        pins.onPulsed(sensorPin, PulseValue.Low, function () {
            knocked = true
            control.raiseEvent(9002, 1) // fire "knock detected" event
            basic.pause(100)
            knocked = false
        })
    }

    /**
     * Returns whether a knock was detected
     */
    //% block="knock detected?"
    export function isKnocked(): boolean {
        return knocked
    }

    /**
     * Event block: do something when a knock is detected
     */
    //% block="on knock detected"
    //% draggableParameters="reporter"
    export function onKnockDetected(handler: () => void): void {
        control.onEvent(9002, 1, handler)
    }

}
