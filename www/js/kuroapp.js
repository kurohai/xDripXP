var kuroapp = {
    init: function() {
        this.template_dir = "./templates/";
        this.log(this.template_dir);
        this.log("KuroApp starting...");
        // document.getElementById("oop-btn-01").addEventListener("click", this.hello, false);
        // $("#oop-btn-01").on("click", this.hello);
        this.bindEvents();
        this.log("KuroApp initialized!");
    },

    bindEvents: function() {
        // body
        $("#oop-btn-01").on("click", kuroapp.hello);
    },

    hello: function() {
        // alert("Hello, " + name);
        // kuroapp.setName(name);

        kuroapp.log("Connecting...");
    },

    connect: function(device) {
        // alert("Hello, " + name);

        kuroapp.log("Connecting to: " + device.id);
        connectDexcom(device);
    },

    setName: function(input) {
        // body...
        alert("setting name attribute");
        kuroapp.name = input;
    },

    log: function(logString) {
        // body...
        var template = "<li class=\"table-view-cell\">{{text}}</li>";

        console.log(logString);
        $("#oop-test-01").append(template.replace("{{text}}", logString));
    },



}
