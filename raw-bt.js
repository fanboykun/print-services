document.querySelector('#raw-bt-print-btn').addEventListener('click', beginPrint)

function beginPrint() {
    let template = 'oke'
    let t = printer.transformBase64(template)
    // let t = template
    printer.print(t, (s = true) => {
        if (s == true) {
            console.log(`printing 1 copy`)
        }
        setTimeout(() => {
            n += 1
        }, 3000)    // process delay (mocking the printing time)

    // }, true)    // 3rd parameter is to mock the printing process, set it to true to debug
    })    // 3rd parameter is to mock the printing process, set it to true to debug
}

const printer = {
    status: false,
    rawbt: {
        S: "#Intent;scheme=rawbt;",
        P: "package=ru.a402d.rawbtprinter;end;"
    },
    command: {
        esc: '\x1B',
        newLine: '\x0A',
        formFeed: '\x0C'
    },
    print(t, cb, mock = false) {
        // mock the printing process
        // used for debugging and testing only
        if (mock === true) {
            setTimeout(() => {
                r()
            }, 1000)
            var r = () => { return cb() }
        }
        // check the device compatibility
        if (!this.isCommpatible()) {
            // console.error(`attempting to run printer in not compatible device`)
            alert('attempting to run printer in not compatible device')
            return cb(false);
        }
        if (this.status == true) console.error('wait.. printer is busy')
        try {
            this.status = true;
            setTimeout(() => {
                window.location.href = "intent:base64,"+t+this.rawbt.S+this.rawbt.P;
                setTimeout(() => {
                    this.status = false;
                    if (typeof cb == 'function') {
                        return cb()
                    }
                }, 1000)
            }, 10)
        } catch (error) {
            console.error(error)
        }
    },
    generate(t) {
        let template = this.command.esc + "@"
        template += this.command.newLine
        if (typeof t == 'object') {
            for (let i = 0; i < t.length; i++){
                template += transform(t[i])
                template += this.command.newLine
            }
        }
        template += t
        return template
    },
    transformByte(r) {
        const encoder = new TextEncoder
        return encoder.encode(r)
    },
    transformBase64(r) {
        if (typeof r != 'string') {
            console.error(`base64 transform only accepts string as the argument, received ${typeof r}`)
            return;
        }
        return btoa(r);
    },
    isCommpatible() {
        var ua = navigator.userAgent.toLowerCase();
        // var uad = navigator.userAgentData.platform.toLowerCase();
        var isAndroid = ua.indexOf("android") > -1;
       return isAndroid
    },
    generateTemplate(data) {
        if (typeof data != 'object') {
         console.error(`can't generate template on string, should be object`)
            return
        }

        let template = []
        for (const [b, a] of Object.entries(data)) {
            let go = `${b} : ${a}`
            template = [...template, go]
        }
    
        return Object.values(template).join('\r\n').toString()

    }
} 
