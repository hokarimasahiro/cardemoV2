function 色変換 (色順: number) {
    if (色順 == 1) {
        LED_COLOR = carcotrol.colors(RGBColors.Red)
    } else if (色順 == 2) {
        LED_COLOR = carcotrol.colors(RGBColors.Orange)
    } else if (色順 == 3) {
        LED_COLOR = carcotrol.colors(RGBColors.Yellow)
    } else if (色順 == 4) {
        LED_COLOR = carcotrol.colors(RGBColors.Green)
    } else if (色順 == 5) {
        LED_COLOR = carcotrol.colors(RGBColors.Blue)
    } else if (色順 == 6) {
        LED_COLOR = carcotrol.colors(RGBColors.Indigo)
    } else if (色順 == 7) {
        LED_COLOR = carcotrol.colors(RGBColors.Violet)
    } else if (色順 == 8) {
        LED_COLOR = carcotrol.colors(RGBColors.Purple)
    } else if (色順 == 9) {
        LED_COLOR = carcotrol.colors(RGBColors.White)
    } else {
        LED_COLOR = carcotrol.colors(RGBColors.Black)
    }
}
bluetooth.onBluetoothConnected(function () {
    carcotrol.setLED(Position.Both, carcotrol.colors(RGBColors.Blue))
    basic.showIcon(IconNames.Happy)
})
bluetooth.onBluetoothDisconnected(function () {
    carcotrol.setLED(Position.Both, carcotrol.colors(RGBColors.Black))
    basic.showIcon(IconNames.Confused)
    DEMO_NO = 0
})
input.onButtonPressed(Button.A, function () {
    if (DEMO_NO == 0) {
        DEMO_NO = 1
        if (carcotrol.getCarType() == carcotrol.car(carType.Tinybit)) {
            DEMO_SPEED = 60
        } else if (carcotrol.getCarType() == carcotrol.car(carType.Porocar)) {
            DEMO_SPEED = 200
        } else {
            DEMO_SPEED = 100
        }
    } else {
        DEMO_NO = 0
        DEMO_SPEED = 0
        carcotrol.carCtrl(0, 0)
    }
})
function 受信データ解析 (データ: string) {
    コマンド = データ.substr(0, 1)
    パラメータ1 = parseFloat(データ.substr(1, 4))
    パラメータ2 = parseFloat(データ.substr(5, 4))
}
bluetooth.onUartDataReceived(serial.delimiters(Delimiters.NewLine), function () {
    受信データ = bluetooth.uartReadUntil(serial.delimiters(Delimiters.NewLine))
    受信データ解析(受信データ)
    if (コマンド == "M") {
        carcotrol.carCtrl(パラメータ1, パラメータ2)
    } else if (コマンド == "L") {
        色変換(パラメータ2)
        if (パラメータ1 >= 5) {
            carcotrol.setLED(Position.Both, LED_COLOR)
        } else if (パラメータ1 == 0) {
            carcotrol.setNeoColor(LED_COLOR)
        } else {
            carcotrol.setNeoPixelColor(パラメータ1 - 1, LED_COLOR)
        }
    } else if (コマンド == "D") {
        DEMO_NO = パラメータ1
        DEMO_SPEED = パラメータ2
        if (DEMO_NO == 0) {
            carcotrol.carCtrl(0, 0)
        }
    }
})
input.onButtonPressed(Button.B, function () {
    if (DEMO_NO == 0) {
        DEMO_NO = 2
        if (carcotrol.getCarType() == carcotrol.car(carType.Tinybit)) {
            DEMO_SPEED = 60
        } else if (carcotrol.getCarType() == carcotrol.car(carType.Porocar)) {
            DEMO_SPEED = 200
        } else {
            DEMO_SPEED = 100
        }
    } else {
        DEMO_NO = 0
        DEMO_SPEED = 0
        carcotrol.carCtrl(0, 0)
    }
})
let 受信データ = ""
let パラメータ2 = 0
let パラメータ1 = 0
let コマンド = ""
let DEMO_SPEED = 0
let DEMO_NO = 0
let LED_COLOR = 0
let 回転時間 = 0
bluetooth.startUartService()
if (carcotrol.getCarType() == carcotrol.car(carType.Tinybit)) {
    basic.showString("T")
    回転時間 = 100
} else if (carcotrol.getCarType() == carcotrol.car(carType.Maqueen)) {
    basic.showString("M")
    回転時間 = 300
} else if (carcotrol.getCarType() == carcotrol.car(carType.Porocar)) {
    basic.showString("P")
    回転時間 = 300
} else {
    basic.showString("U")
    回転時間 = 300
}
carcotrol.setNeoBrightness(50)
carcotrol.setNeoColor(carcotrol.colors(RGBColors.Black))
carcotrol.setLED(Position.Both, carcotrol.colors(RGBColors.Black))
basic.showIcon(IconNames.SmallHeart)
basic.forever(function () {
    if (DEMO_NO == 2) {
        if (carcotrol.getLineColor(Position.Left, lineColor.White) && carcotrol.getLineColor(Position.Right, lineColor.White)) {
        	
        } else if (carcotrol.getLineColor(Position.Left, lineColor.White) && carcotrol.getLineColor(Position.Right, lineColor.Black)) {
            carcotrol.carCtrl(DEMO_SPEED, 0)
        } else if (carcotrol.getLineColor(Position.Left, lineColor.Black) && carcotrol.getLineColor(Position.Right, lineColor.White)) {
            carcotrol.carCtrl(0, DEMO_SPEED)
        } else if (carcotrol.getLineColor(Position.Left, lineColor.Black) && carcotrol.getLineColor(Position.Right, lineColor.Black)) {
            carcotrol.carCtrl(DEMO_SPEED, DEMO_SPEED)
        }
        if (carcotrol.getLineColor(Position.Left, lineColor.White)) {
            led.plot(0, 2)
        } else {
            led.unplot(0, 2)
        }
        if (carcotrol.getLineColor(Position.Right, lineColor.White)) {
            led.plot(4, 2)
        } else {
            led.unplot(4, 2)
        }
    }
    basic.pause(2)
})
