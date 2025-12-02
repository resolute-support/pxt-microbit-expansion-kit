//% color="#ff6800" icon="\uf108" weight=15
namespace ColourSensor {
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

    /**
     * Get the light level
     */
    //% blockId=brickcell_color_tcs34725_get_light
    //% block="Get light"
    //% subcategory="color tcs34725"
    export function getLight(): number {
        return Math.round(_tcs3472.light())
    }

    /**
     * Get the amount of red the colour sensor sees
     */
    //% blockId=brickcell_color_tcs34725__get_red
    //% block="Get red"
    //% subcategory="color tcs34725"
    export function getRed(): number {
        return Math.round(_tcs3472.rgb()[0])
    }

    /**
     * Get the amount of green the colour sensor sees
     */
    //% blockId=brickcell_color_tcs34725_get_green
    //% block="Get green"
    //% subcategory="color tcs34725"
    export function getGreen(): number {
        return Math.round(_tcs3472.rgb()[1])
    }

    /**
     * Get the amount of blue the colour sensor sees
     */
    //% blockId=brickcell_color_tcs34725_get_blue
    //% block="Get blue"
    //% subcategory="color tcs34725"
    export function getBlue(): number {
        return Math.round(_tcs3472.rgb()[2])
    }

    /**
     * Set the integration time of the colour sensor in ms
     */
    //% blockId=brickcell_color_tcs34725_set_integration_time
    //% block="Set colour integration time %time ms"
    //% time.min=0 time.max=612 value.defl=500
    //% subcategory="color tcs34725"
    export function setColourIntegrationTime(time: number): void {
        return _tcs3472.setIntegrationTime(time)
    }
}