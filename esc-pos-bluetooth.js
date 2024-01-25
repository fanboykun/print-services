document.querySelector('#esc-pos-bluetooth-print-btn').addEventListener('click', handleESC)

function handleESC() {
    // let dynHtml = `print://${window.location}?srcTp=uri&srcObj=html&numCopies=1&src="data:text/html",<h1 style='text-align:center'>PRINTING DYNAMICALLY GENERATED HTML</h1>`
    // let dynHtml = "print://escpos.org/escpos/bt/print/?srcTp=uri&srcObj=html&numCopies=1&src='data:text/html',okay"
    // let dynHtml = "print://escpos.org/escpos/bt/print/?srcTp=uri&srcObj=html&src='data:text/html,<p>Okay</p>'";
    let dynHtml = "print://escpos.org/escpos/bt/print/?srcTp=uri&srcObj=html&src='data:text/html,";
    // let dynHtml = "print://escpos.org/escpos/bt/print/?srcTp=uri&srcObj=html&src='http://192.168.100.14/bt-xa'";
    dynHtml += "<h1 style='text-align:center'>PRINTING DYNAMICALLY GENERATED HTML</h1>"
    dynHtml += "'";
    try {
        console.log(dynHtml)
        window.location.href = dynHtml;
    } catch ( err ) {
        alert(err)
    }
}
