(function(config, app) {


    var set_time_out=1000*config.timeout;
    // console.log(set_time_out);
    // app.bindForm();
    function temp() {
        // console.log(arguments.length);
        if (arguments.length == 0) {
            app.bindForm().then(function(data) {
                setTimeout(function() {
                    temp(1);
                }, set_time_out);
            });
        } else {
            app.bindForm(1).then(function(data) {
                setTimeout(temp(1), set_time_out);
                // console.log("done");
            });
        }
    };
    temp();

})(window.config, window.app);
