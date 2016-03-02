(function(config, app) {
    app.set_head_displayId(config.head_displayId);
    app.set_feedId(config.feedId);
    app.bindForm();
})(window.config, window.app);
