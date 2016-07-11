var app = {

    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },

    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
        document.addEventListener('obj_id', this.derpHarder, false);
    },

    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        app.receivedEvent('deviceready');
    },

    // Update DOM on a Received Event
    receivedEvent: function(id) {
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');

        console.log('Received Event: ' + id);
        document.getElementById("obj_id").addEventListener("click", this.derpHarder, false);
    },

    derpHarder: function() {
        initBluetoothLE();
        scanDexcom();
    }
};

function initBluetoothLE() {
    var params = {
        "request": true,
        "statusReceiver": false,
        "restoreKey": "bluetoothleplugin"
    }
    bluetoothle.initialize(alert("ble init success"), params);
}

function startScanSuccess(result) {
    alert("scan started \n" + JSON.stringify(result));
};

function startScanError() {
    alert("Error Starting Scan");
};

function scanDexcom() {
    // do scan
    alert("Starting Dexcom Scan");

    var params = {
        "services": [
            "180A",
            "FEBC"
        ],
        "allowDuplicates": false,
        "scanMode": bluetoothle.SCAN_MODE_LOW_LATENCY,
        "matchMode": bluetoothle.MATCH_MODE_AGGRESSIVE,
        "matchNum": bluetoothle.MATCH_NUM_MAX_ADVERTISEMENT,
        "callbackType": bluetoothle.CALLBACK_TYPE_ALL_MATCHES,
    };

    bluetoothle.startScan(startScanSuccess, startScanError, params);
};

function checkConnected(device) {
    ble.isConnected(
        device.id,
        function() {
            alert("Peripheral is connected");
        },
        function() {
            alert("Peripheral is *not* connected");
        }
    );
};

function checkForDexcom(device) {
    // check found device for dexcom
    var deviceInfo = JSON.stringify(device);
    // alert("checking: \n" + device.id + " " + device.name);
    if ( device.name.indexOf("Dexcom") != -1 ) {
        alert("Found Dexcom! \n" + deviceInfo);
        connectDexcom(device);
        checkConnected(device);
    } else {
        alert("not dexcom: \n" + deviceInfo);
    };
};

function connectDexcom(device) {
    // do connect
    ble.connect(
        device.id,
        function() {alert("Dexcom Connected");},
        function() {alert("Dexcom Not Connected");}
    );
};

function addScannedDeviceDetails(device) {
    var devicetable = document.getElementById("deviceList");
    var row = devicetable.insertRow(-1);
    var dev_id = row.insertCell(0);
    var dev_name = row.insertCell(1);
    var dev_rssi = row.insertCell(2);
    dev_id.innerHTML = device.id;
    dev_name.innerHTML = device.name;
    dev_rssi.innerHTML = device.rssi;
};

app.initialize();
