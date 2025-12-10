//% color="#ff6800" icon="\uf1fb" weight=15
namespace Colour {
    class tcs3472 {
        is_setup: boolean
        addr: number
        leds: DigitalPin

        constructor(addr: number) {
            this.is_setup = false
            this.addr = addr
        }

        setup(): void {
            if (this.is_setup) return
            this.is_setup = true
            smbus.writeByte(this.addr, 0x80, 0x03)
            smbus.writeByte(this.addr, 0x81, 0x2b)
        }

        setIntegrationTime(time: number): void {
            this.setup()
            time = Math.clamp(0, 255, time * 10 / 24)
            smbus.writeByte(this.addr, 0x81, 255 - time)
        }

        light(): number {
            return this.raw()[0]
        }

        rgb(): number[] {
            let result: number[] = this.raw()
            let clear: number = result.shift()
            for (let x: number = 0; x < result.length; x++) {
                result[x] = result[x] * 255 / clear
            }
            return result
        }

        raw(): number[] {
            this.setup()
            let result: Buffer = smbus.readBuffer(this.addr, 0xb4, pins.sizeOf(NumberFormat.UInt16LE) * 4)
            return smbus.unpack("HHHH", result)
        }
    }

    let _tcs3472: tcs3472 = new tcs3472(0x29)
    _tcs3472.setIntegrationTime(2.4)

    /**
     * Get the light level
     */
    //% blockId=brickcell_color_tcs34725_get_light
    //% block="Get light"
    export function getLight(): number {
        return Math.round(_tcs3472.light())
    }

    /**
     * Get the amount of red the colour sensor sees
     */
    //% blockId=brickcell_color_tcs34725__get_red
    //% block="Get red"
    export function getRed(): number {
        return Math.round(_tcs3472.rgb()[0])
    }

    /**
     * Get the amount of green the colour sensor sees
     */
    //% blockId=brickcell_color_tcs34725_get_green
    //% block="Get green"
    export function getGreen(): number {
        return Math.round(_tcs3472.rgb()[1])
    }

    /**
     * Get the amount of blue the colour sensor sees
     */
    //% blockId=brickcell_color_tcs34725_get_blue
    //% block="Get blue"
    export function getBlue(): number {
        return Math.round(_tcs3472.rgb()[2])
    }
}