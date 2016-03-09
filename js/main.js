(function(config, app) {
    // app.bindForm();
    function temp() {
        console.log(arguments.length);
        if (arguments.length == 0) {
            app.bindForm().then(function(data) {
                setTimeout(function() {
                    temp(1);
                }, 30000);
            });
        } else {
            app.bindForm(1).then(function(data) {
                setInterval(temp(1), 30000);
                console.log("done");
            });

        }

    };
    temp();

})(window.config, window.app);
