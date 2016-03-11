(function(window) {
    var config = {
        'head_displayId': 'head_display',
        'feedId': 'feed',
        'input_data2': { "count": 6, "data": [{ "priority": 1, "url": "http://timesofindia.indiatimes.com/", "type": "mainpage" }, { "priority": 2, "url": "http://www.hindustantimes.com/", "type": "mainpage" }, { "priority": 4, "url": "http://page2rss.com/5a11ae68559796f395886bd54bd108ee", "type": "rss" }, { "priority": 5, "url": "http://timesofindia.feedsportal.com/c/33039/f/533922/index.rss", "type": "rss" }, { "priority": 6, "url": "http://timesofindia.feedsportal.com/c/33039/f/533925/index.rss", "type": "rss" }, { "priority": 7, "url": "http://timesofindia.feedsportal.com/c/33039/f/533924/index.rss", "type": "rss" }] },
        // 'input_data2': { "count": 1, "data": [{ "priority": 1, "url": "http://timesofindia.indiatimes.com/rssfeeds/7098551.cms", "type": "rss" },] },
        'words_to_check': ["sanjay", "smriti", "jaitley", "budget", "solutions", "haryana", "delhi"],
        'timeout': 10
    };

    window.config = config;

})(window);
