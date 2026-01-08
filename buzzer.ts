//% color="#ff6800" icon="\uF001" weight=15
namespace Sound {

    /**
     * Attach an external buzzer (micro:bit v1 / v1.5).
     * Redirects audio from Pin 0 to the selected pin.
     */
    //% block="attach buzzer to pin %pin"
    //% pin.shadow="pins.DigitalPin"
    //% group="micro:bit (V1 / V1.5)"
    //% weight=100
    export function setAudioPinV1(pin: DigitalPin): void {
        pins.setAudioPin(pin);
    }

    /**
     * Attach an external buzzer and disable the built-in speaker (micro:bit v2).
     */
    //% block="attach buzzer to pin %pin"
    //% pin.shadow="pins.DigitalPin"
    //% group="micro:bit (V2)"
    //% weight=90
    //% v2_only=true
    export function setAudioPinV2(pin: DigitalPin): void {
        music.setBuiltInSpeakerEnabled(false);
        pins.setAudioPin(pin);
    }
}
