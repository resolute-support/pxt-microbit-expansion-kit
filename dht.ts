enum tempType {
    //% block="Celsius (*C)"
    celsius,
    //% block="Fahrenheit (*F)"
    fahrenheit
}

//% color=#ff6800 icon="\uf043" weight=15
namespace dht11 {

    let _temptype: tempType = tempType.celsius
    let sensorPin: DigitalPin = undefined  // default pin not attached

    /**
     * Attach DHT11 sensor to a specific pin
     */
    //% block="attach DHT11 to pin %pin"
    //% pin.shadow="pins.digitalPin"
    //% weight=100
    export function attachSensor(pin: DigitalPin) {
        sensorPin = pin
    }

    /**
     * Select temperature type (Celsius/Fahrenheit)
     */
    //% block="Temperature type: $temp" advanced=true
    export function selectTempType(temp: tempType) {
        _temptype = temp
    }

    /**
     * Read humidity from DHT11 sensor (uses attached pin)
     */
    //% block="Read DHT11 humidity"
    export function readHumidity(): number {
        if (sensorPin === undefined) return -1
        let result = queryDHT11(sensorPin)
        return result.success ? result.humidity : -1
    }

    /**
     * Read temperature from DHT11 sensor (uses attached pin)
     */
    //% block="Read DHT11 temperature"
    export function readTemperature(): number {
        if (sensorPin === undefined) return -1
        let result = queryDHT11(sensorPin)
        if (!result.success) return -1
        let temp = result.temperature
        if (_temptype == tempType.fahrenheit)
            temp = temp * 9 / 5 + 32
        return temp
    }

    /**
     * Internal function: query DHT11 and return temperature/humidity
     */
    function queryDHT11(pin: DigitalPin): { success: boolean, humidity: number, temperature: number } {
        let dataArray: boolean[] = []
        let resultArray: number[] = []

        for (let i = 0; i < 40; i++) dataArray.push(false)
        for (let i = 0; i < 5; i++) resultArray.push(0)

        // Send start signal
        pins.digitalWritePin(pin, 0)
        basic.pause(18)
        pins.setPull(pin, PinPullMode.PullUp)
        pins.digitalReadPin(pin)
        control.waitMicros(40)

        if (pins.digitalReadPin(pin) == 1) {
            return { success: false, humidity: -1, temperature: -1 }
        }

        // Wait for sensor response
        while (pins.digitalReadPin(pin) == 0);
        while (pins.digitalReadPin(pin) == 1);

        // Read 40 bits
        for (let i = 0; i < 40; i++) {
            while (pins.digitalReadPin(pin) == 1);
            while (pins.digitalReadPin(pin) == 0);
            control.waitMicros(28)
            if (pins.digitalReadPin(pin) == 1) dataArray[i] = true
        }

        // Convert bits to bytes
        for (let i = 0; i < 5; i++)
            for (let j = 0; j < 8; j++)
                if (dataArray[8 * i + j]) resultArray[i] += 2 ** (7 - j)

        // Verify checksum
        let checksum = resultArray[4]
        let checksumTmp = resultArray[0] + resultArray[1] + resultArray[2] + resultArray[3]
        if (checksumTmp >= 512) checksumTmp -= 512
        if (checksumTmp >= 256) checksumTmp -= 256
        if (checksum != checksumTmp) return { success: false, humidity: -1, temperature: -1 }

        // Read values
        let humidity = resultArray[0] + resultArray[1] / 100
        let temperature = resultArray[2] + resultArray[3] / 100

        return { success: true, humidity: humidity, temperature: temperature }
    }
}
