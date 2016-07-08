/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
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
        scanDexcom();
    }
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

function scanDexcom() {
    // do scan
    alert("Starting Dexcom Scan");
    ble.scan([], 360, function(device) {
        addScannedDeviceDetails(device);
        checkForDexcom(device);
    }, console.log("err in scan"));
    // var i = 1
    // while (i == 1) {
    //     if (checkConnected()) {
    //         // do stuff
    //     }
    // }
}

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
