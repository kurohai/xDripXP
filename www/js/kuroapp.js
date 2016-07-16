var kuroapp = {
    init: function() {
        this.template_dir = "./templates/";
        this.log(this.template_dir);
        this.log("KuroApp starting...");
        // document.getElementById("oop-btn-01").addEventListener("click", this.hello, false);
        $("#oop-btn-01").on("click", this.hello);
        this.log("KuroApp initialized!");
    },

    hello: function() {
        // alert("Hello, " + name);
        // this.setName(name);

        alert("Hello, " + kuroapp.template_dir);
    },

    setName: function(input) {
        // body...
        alert("setting name attribute");
        this.name = input;
    },

    log: function(logString) {
        // body...
        var template = "<li class=\"table-view-cell\">{{text}}</li>";

        console.log(logString);
        $("#oop-test-01").append(template.replace("{{text}}", logString));
    }

}
