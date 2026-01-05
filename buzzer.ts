//% color="#ff6800" icon="\uF001" weight=15
namespace Sound {

    let audioPin: DigitalPin = null; 

    /**
     * Disable Microbit Buzzer and attach External Buzzer to a pin
     */
    //% block="attach buzzer to pin %pin"
    //% pin.shadow="pins.DigitalPin"
    //% weight=100
    export function setAudioPin(pin: DigitalPin): void {
        audioPin = pin
        music.setBuiltInSpeakerEnabled(false)
        pins.setAudioPin(pin)
    }
}