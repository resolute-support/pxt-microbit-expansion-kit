basic.forever(function() {
    let data = expansionPack.getBPM()
    serial.writeLine("" + data)
})