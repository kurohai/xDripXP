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
        document.getElementById("obj_id").addEventListener("click", this.startDexcomScan, false);
        document.getElementById("activate-main").addEventListener("click", this.activateMainApp, false);
        document.getElementById("activate-scan").addEventListener("click", this.activateScanApp, false);
        document.getElementById("activate-debug").addEventListener("click", this.activateDebugApp, false);
    },

    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        app.receivedEvent('deviceready');
        kuroapp.init();
        kuroapp.screenMain = document.getElementById("main-app");
        kuroapp.screenScan = document.getElementById("scan-app");
        kuroapp.screenDebug = document.getElementById("debug-app");
    },

    // Update DOM on a Received Event
    receivedEvent: function(id) {
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');
        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');
        kuroapp.log('Received Event: ' + id);
    },

    startDexcomScan: function() {
        // onclick callback to initialize ble and start scan
        initBLE();
        scanDexcom();
    },

    activateMainApp: function() {
        // body...
        kuroapp.log("activating main app");
        kuroapp.screenMain.setAttribute('style', 'display: block;');
        kuroapp.screenScan.setAttribute('style', 'display: none;');
        kuroapp.screenDebug.setAttribute('style', 'display: none;');
        $("#activate-main").addClass("active");
        $("#activate-scan").removeClass("active");
        $("#activate-debug").removeClass("active");
    },

    activateScanApp: function() {
        // body...
        kuroapp.log("activating scan app");
        kuroapp.screenMain.setAttribute('style', 'display: none;');
        kuroapp.screenScan.setAttribute('style', 'display: block;');
        kuroapp.screenDebug.setAttribute('style', 'display: none;');
        $("#activate-main").removeClass("active");
        $("#activate-scan").addClass("active");
        $("#activate-debug").removeClass("active");
    },

    activateDebugApp: function() {
        // body...
        kuroapp.log("activating debug app");
        kuroapp.screenMain.setAttribute('style', 'display: none;');
        kuroapp.screenScan.setAttribute('style', 'display: none;');
        kuroapp.screenDebug.setAttribute('style', 'display: block;');
        $("#activate-main").removeClass("active");
        $("#activate-scan").removeClass("active");
        $("#activate-debug").addClass("active");
    },


};

function checkConnected(device) {
    // Usage!
    sleep(1000).then(() => {
        // Do something after the sleep!
        ble.isConnected(
            device.id,
            function() {
                alert("P2 Device is connected: " + device.name);
            },
            function() {
                alert("Device is *not* connected: " + device.name);
            }
        );

    });

};

function foundDevice(device) {
    // scan results

    var deviceInfo = JSON.stringify(device);

    kuroapp.log("found device: " + deviceInfo);

    // device.services = new Uint8Array(device.advertising);
    device.services = new Uint8Array(device.advertising);
    device.services = toHexString(device.services);
    // device.services = bytesToString(device.advertising);
    var deviceInfo = JSON.stringify(device);

    kuroapp.log("device ads: " + deviceInfo);

    addScannedDeviceDetailsRatchet(device);

    checkForDexcom(device);
};

function bytesToString(buffer) {
    return String.fromCharCode.apply(null, new Uint8Array(buffer));
};

function toHexString(byteArray) {
    return byteArray.map(function(byte) {
        return ('0' + (byte & 0xFF).toString(16)).slice(-2);
    }).join('')
};

function scanDexcom() {
    // do scan
    $("p.received").text("Scanning");
    ble.scan([], 360, foundDevice, kuroapp.log("err in scan"));
};

function checkForDexcom(device) {
    // check found device for dexcom

    var deviceInfo = JSON.stringify(device);
    if (device.name.indexOf("Dexcom") != -1) {
        kuroapp.log("Found Dexcom! \n" + deviceInfo);
        // addScannedServiceDetails(device);
        // connectDexcom(device);
        // checkConnected(device);
    } else {
        addScannedDeviceDetailsRatchet(device);
        kuroapp.log("not dexcom: \n" + deviceInfo);
    };
};

function connectSuccess(status) {
    status = formatCB(status);
    checkConnected(device);

    kuroapp.log("P1 connection successful! " + status);
};

function formatCB(val) {
    return JSON.stringify(val);
};

function connectError(status) {
    status = formatCB(status);
    kuroapp.log("connection error! " + status);
};

function initializeResult(status) {
    status = formatCB(status);
    kuroapp.log("init result: " + status);

};

function initBLE() {
    params = {
        "request": true,
        "statusReceiver": true,
        "restoreKey": "hellodexcom"
    };
    bluetoothle.initialize(initializeResult, params);
};

function connectDexcom(device) {
    // do connect
    // partially working
    var params = {
        "address": device.id
    };
    kuroapp.log("connection to: " + formatCB(params));
    bluetoothle.connect(connectSuccess, connectError, params);

};

function scanServices(device) {
    // do discover
    // not working yet

    var params = {
        "address": device.id
    }

    bluetoothle.discover(
        function(e) {
            alert("success" + e);
        },
        function(e) {
            alert("fail" + e);
        },
        params
    );
};

function addScannedServiceDetails(device) {
    // update found device services on scan page

    var devicetable = document.getElementById("deviceFound");
    var row = devicetable.insertRow(-1);
    var dev_id = row.insertCell(0);
    var dev_name = row.insertCell(1);
    var dev_srv = row.insertCell(2);
    dev_id.innerHTML = device.id;
    dev_name.innerHTML = device.name;
    dev_srv.innerHTML = '<input type="button" value="' + device.name + ' id="con_obj" />';
};

function addScannedDeviceDetailsRatchet(device) {
    // update found devices table on scan page

    var listID = "list-" + device.id;
    var listIDp = "#" + listID;
    $("#deviceListRatchet").append(
        "<li class=\"table-view-cell\" id=\"" + listID + "\">" +
        device.name +
        "  " +
        device.id +
        " <button id=\"" + device.id + "\" class=\"btn\">Connect</button></li>"
    );
    // var parentObj = document.getElementById("deviceListRatchet");
    // var listItem = document.getElementById(listID);
    // var button = parentObj.querySelector("#"+device.id);
    // kuroapp.log("parent table: " + parentObj.className);
    // kuroapp.log("listItem id: " + listItem.id);
    // kuroapp.log("listItem id: " + listItem.className);
    var button = document.getElementById(device.id);
    kuroapp.log("button: " + button.className);
    button.addEventListener("click", function(){kuroapp.connect(device)}, false);


    // kuroapp.log("button added: " + button.id);

    // var parentObj = document.getElementById("oop-test-01").addEventListener("click", function(){kuroapp.connect(device.id)}, false);
    // $("#"+device.id).on("click", function(){kuroapp.connect(device.id)});


    // <li class=\"table-view-cell\">Item 1 <button class=\"btn\">Button</button></li>
    // <li class="table-view-cell">Item 1 <button class="btn">Button</button></li>
    // <li class="table-view-cell">Item 2 <button class="btn btn-primary">Button</button></li>
    // <li class="table-view-cell">Item 3 <button class="btn btn-positive">Button</button></li>
    // <li class="table-view-cell">Item 4 <button class="btn btn-negative">Button</button></li>
};


function sleep(time) {
    return new Promise((resolve) => setTimeout(resolve, time));
};

app.initialize();

// function scanDexcom2() {
//     // do scan
//     bluetoothle.startScan([], 360, foundDevice(device), kuroapp.log("err in scan"));
// };
