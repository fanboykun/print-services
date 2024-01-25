document.querySelector('#thermer-print-btn').addEventListener('click', hThhermerPrint)

function hThhermerPrint(e) {
    let data =
        {
            type: 0,
            content: 'My Content',
            bold: 1,
            align: 2,
            format: 3
        }
    let tsData = JSON.stringify(data)
    // let to = `my.bluetoothprint.scheme://${tsData}`
    let to = "my.bluetoothprint.scheme://https://print-server.vercel.app"
    try {
        console.log(to)
        window.location.href = to;
    } catch ( err ) {
        alert(err)
    }
}
