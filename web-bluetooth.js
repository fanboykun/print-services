document.querySelector('#web-bluetooth-print-btn').addEventListener('click', onButtonClick)
let bluetooth_device = null
function onButtonClick() {

  navigator.bluetooth.getAvailability().then((available) => {
    if (!available) {
      alert("This device not supports Bluetooth!");
      return
    }
  });

  let primaryService = '00001801-0000-1000-8000-00805f9b34fb'
  let optionalServices  = '0x1800, 0x1801, 0x180A'

    // Validate services UUID entered by user first.
  let finalOptionalServices = optionalServices.split(/, ?/)
    .map(s => s.startsWith('0x') ? parseInt(s) : s)
    .filter(s => s && BluetoothUUID.getService);
  
    console.log('Requesting any Bluetooth Device...');
    navigator.bluetooth.requestDevice({
     // filters: [...] <- Prefer filters to save energy & show relevant devices.
    //  filters: [{services: [primaryService]}], 
      acceptAllDevices: true,
      optionalServices: finalOptionalServices
    }).then(device => {
      console.log('Connecting to GATT Server...');
      return device.gatt.connect();
    }).then(server => {
      // Note that we could also get all services that match a specific UUID by
      // passing it to getPrimaryServices().
      console.log('Getting Services...');
      // return server.getPrimaryServices(primaryService);
      return server.getPrimaryServices();
    }).then(services => {
      console.log('Getting Characteristics...');
      let queue = Promise.resolve();
      services.forEach(service => {
        queue = queue.then(_ => service.getCharacteristics().then(characteristics => {
          console.log('> Service: ' + service.uuid);
          
          primaryService = service?.uuid
          send(characteristics)
          
          characteristics.forEach(characteristic => {
            console.log('>> Characteristic: ' + characteristic.uuid + ' ' + getSupportedProperties(characteristic, true));
          });
      }));
      });
      // console.log(queue)
      return queue;
    }).catch(error => {
      console.log('Argh! ' + error);
    });
}
  
  /* Utils */
  
  function getSupportedProperties(characteristic, stringyfy = false) {
    let supportedProperties = [];
    for (const p in characteristic.properties) {
      if (characteristic.properties[p] === true) {
        supportedProperties.push(p.toUpperCase());
      }
    }
    if(stringyfy) return '[' + supportedProperties.join(', ') + ']';
    return supportedProperties
    
}

function send(characteristics) {

  let filteredChar = characteristics.filter((val, i) => {
    return val.properties?.write == true || val.properties?.reliableWrite == true
  })
  let finalChar = null
  filteredChar.length > 1 ? finalChar = filteredChar[0] : finalChar = filteredChar
  try {
    characteristics.forEach((char, i) => {
      char.getDescriptors().then(descriptors => {
        console.log(descriptors)
        descriptors.forEach((desc, i) => {
          console.log(desc.value)
          // if (desc.uuid == '2901') {
          //   finalChar = char
          // }
        })
      }).catch(error => {
        console.error(error)
      })
    })
  } catch (err) {}
  return

    // Construct print command in ESC/POS format
    const commands = `TEXT 0,0,"Hello World!"\nPRINT 1`;

    // Encode and send as bytes 
    const bytes = new TextEncoder().encode(commands);
    // finalChar.writeValue(new Uint8Array([0x1b, 0x40]))
    // finalChar.writeValue(bytes)
    finalChar.writeWithoutResponse(bytes)
    .then(function() {
      console.log('Write successful');
    }).catch(function (error) {
      console.log('Argh! ' + error);
    })
}
  
function log(param) {
  return console.log(param)
}