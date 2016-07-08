ble.enable(
    function() {
        console.log("Bluetooth is enabled");
    },
    function() {
        console.log("The user did *not* enable Bluetooth");
    }
);
