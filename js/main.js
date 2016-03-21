(function(config, app) {

    // chrome.storage.local.clear(function() {
    //     console.log("cleared");
    // })
    // chrome.storage.local.get("data1", function(result) {
    //     console.log(result);
    // });
    // var t = new Date();
    // console.log("begin" + Number(t));
    app.initialBind();


    var time_out = 1000 * config.timeout;

    function temp() {
        if (arguments.length == 0) {
            app.bindForm().then(function(data) {
                // console.log(Number(new Date()));
                setTimeout(function() {
                    // console.log(Number(new Date()));
                    temp(1);
                }, time_out);
            });
        } else {
            // console.log(Number(new Date()));
            // console.log("called");
            app.bindForm(1).then(function(data) {
                // console.log(Number(new Date()));
                setTimeout(function() {
                    // console.log(Number(new Date()));
                    temp(1);
                }, time_out);
            });
        }
    };
    temp();

})(window.config, window.app);