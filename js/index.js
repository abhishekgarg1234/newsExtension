var global_full_news_data = null;
var global_single_news_data = null;
var global_click_count = 0;
var words_to_check = ["sanjay", "smriti", "jaitley", "budget"];

var head_links_array = [];
var head_metaTags_array = [];
var link_array = [];
var is_rss_link = 0;

var setLocalStorageItems = function() {
    if (typeof(Storage) !== "undefined") {
        if (!localStorage.getItem("news")) {
            localStorage.setItem("news", '{"count":"2","data":["http://www.hindustantimes.com/","http://timesofindia.indiatimes.com/"]}');
        }
    } else {}
};

var head_display = function() {
    var div = document.createElement("div");
    div.setAttribute("class", "head_display");

    var span = document.createElement("span");
    span.setAttribute("class", "head_span");

    var text_node = document.createTextNode("Proptiger");
    span.appendChild(text_node);
    div.appendChild(span);
    return div;
};

var make_head_links_array = function(o) {
    for (var key in o) {
        head_links_array.push(o[key]);
    }
};

var make_head_meatTags_array = function(o) {
    for (var key in o) {
        head_metaTags_array.push(o[key]);
    }
};

var check_for_words = function(x) {
    console.log(x);
    x = x.toLowerCase(x);
    for (var key in words_to_check) {
        if (x.indexOf(words_to_check[key]) != -1) {
            return 1;
        }
    }
    return 0;
};

var find_desc = function() {
    for (var key in head_metaTags_array) {
        var temp = head_metaTags_array[key];
        if (temp.hasOwnProperty("name")) {
            var temp_name = temp.name.toLowerCase();
            if (temp_name == "description") {
                return temp.content;
            }
        }
    }
};

var find_image_href = function() {
    for (var key in head_links_array) {
        var temp = head_links_array[key];
    }
};

var find_news_feed_time = function() {
    for (var key in head_metaTags_array) {

        var temp = head_metaTags_array[key];
        if (temp.hasOwnProperty("name")) {

            var temp_text = temp.name.toLowerCase();
            console.log(temp_text);
            if ((temp_text.indexOf("time") != -1) || (temp_text.indexOf("update") != -1) || (temp_text.indexOf("modified") != -1)) {

                return temp.content;
            }
        }
    }
};

var find_news_feed_time2 = function() {
    for (var key in head_metaTags_array) {

        var temp = head_metaTags_array[key];

        for (var key2 in temp) {
            var tt = temp[key2].toLowerCase();
            if (((tt.indexOf("time") != -1) && ((tt.indexOf("publish") != -1))) || ((tt.indexOf("update") != -1) && (tt.indexOf("time") != -1)) || ((tt.indexOf("modified") != -1))) {
                if (tt.indexOf("times") != -1) {

                } else {
                    return temp.content;
                }
            }
        }
    }
};

var make_div = function(title, description_of_news, image_href, news_href, news_feed_time) {

    if (((description_of_news == "")) || (description_of_news == undefined)) {
        description_of_news = title;
    }
    var main_div = document.createElement("div");
    main_div.setAttribute("class", "news_feed_div");

    var title_div = document.createElement("div");
    title_div.setAttribute("class", "news_feed_title_div");
    var anchor = document.createElement("a");
    anchor.setAttribute("href", news_href);
    anchor.setAttribute("class", "news_feed_anchor_tag");
    var text = document.createTextNode(title);
    anchor.appendChild(text);
    title_div.appendChild(anchor);

    var description_div = document.createElement("div");
    description_div.setAttribute("class", "news_feed_description_div");
    var description_span = document.createElement("span");
    description_span.setAttribute("class", "description_span");
    var text = document.createTextNode(description_of_news);
    description_span.appendChild(text);
    description_div.appendChild(description_span);

    var image_div = document.createElement("div");
    image_div.setAttribute("class", "news_feed_image_div");
    var image = document.createElement("img");
    image.setAttribute("src", image_href);

    var time_div = document.createElement("div");
    time_div.setAttribute("class", "news_feed_time_div");
    var time_span = document.createElement("span");
    var text = document.createTextNode(news_feed_time);
    time_span.appendChild(text);
    time_div.appendChild(time_span);

    // div.appendChild(image);
    main_div.appendChild(title_div);
    main_div.appendChild(description_div);
    main_div.appendChild(time_div);

    return main_div;
};

var crawl_single_news_page_function = function(_site, data) {

    global_single_news_data = data;
    var set_news_href = _site;
    // console.log(_site);
    var set_title = global_single_news_data.query.results.title;

    for (var key in global_single_news_data.query.results) {
        if (key == "link") {
            make_head_links_array(global_single_news_data.query.results[key]);
        }
    }
    for (var key in global_single_news_data.query.results) {
        if (key == "meta") {
            make_head_meatTags_array(global_single_news_data.query.results[key]);
        }
    }

    var set_desc = find_desc();
    var set_image_href = find_image_href();

    var news_feed_time = find_news_feed_time2();
    // console.log(set_title);
    var dd = check_for_words(set_title);
    // console.log(dd);
    if (dd) {
        $("#feed").append(make_div(set_title, set_desc, set_image_href, set_news_href, news_feed_time));
    }
};

var json_traverse = function(o) {
    var type = typeof o;
    if (type == "object") {
        for (var key in o) {
            var t = key.toLowerCase();
            if (t == "a") {
                link_array.push(o);
            }
            json_traverse(o[key]);
        }
    } else {
        var tt = JSON.stringify(o);
    }
};

var traversing_function = function(o, key_to_traverse) {
    var type = typeof o;
    if (type == "object") {
        for (var key in o) {
            var t = key.toLowerCase();
            if ((t == key_to_traverse)) {
                return o[key];
            }
            traversing_function(o[key], key_to_traverse);
        }
    } else {
        var tt = JSON.stringify(o);
    }
}

var check_for_words = function(x) {
    for (var key in words_to_check) {
        if (x.indexOf(words_to_check[key]) != -1) {
            return 1;
        }
    }
    return 0;
};

var have_rssLink = function(data) {
    if ((is_rss_link == 0)) {
        var type = typeof data;
        var body_data = data;
        if (type == "object") {
            for (var key in body_data) {
                var temp_key = key.toLowerCase();
                if (temp_key == "href") {
                    var temp_link = body_data[key];
                    if ((temp_link.indexOf("rss.cms") != -1) || (temp_link.indexOf("=rss") != -1)) {
                        console.log(body_data[key]);
                        is_rss_link = 1;
                        console.log(body_data[key]);
                        xx=body_data[key];
                        break;
                        // return body_data[key];
                    }
                }
                have_rssLink(body_data[key]);
            }
        } else {}
    }
};

var requestCrossDomain_function = function(_site, data) {
    global_full_news_data = data;
    is_rss_link = 0;
    var temp_rss_link = have_rssLink(global_full_news_data.query.results.body)
    // if (is_rss_link == 1) {
    //     console.log("rss traverse");
    //     console.log(temp_rss_link);
    //     crawl_function(1, temp_rss_link);
    // } else {
        json_traverse(global_full_news_data.query.results.body);
        var count = 0;
        for (var key in link_array) {
            var temp = JSON.stringify(link_array[key]);
            var temp2 = temp.toLowerCase();
            if (check_for_words(temp2)) {
                var _singleNewsPageLink;
                if ($.isArray(link_array[key].a)) {
                    _singleNewsPageLink = link_array[key].a[0].href;
                } else {
                    _singleNewsPageLink = link_array[key].a.href;
                }
                if (_singleNewsPageLink != undefined) {

                    if ((_singleNewsPageLink.indexOf("http:") != -1) || (_singleNewsPageLink.indexOf("https:") != -1)) {

                    } else {
                        // console.log(_singleNewsPageLink);
                        _singleNewsPageLink = _site + _singleNewsPageLink;
                        // console.log(_singleNewsPageLink);
                    }
                    var get_title = traversing_function(link_array[key].a, "title");
                    if (get_title != undefined) {
                        crawl_function(0, _singleNewsPageLink);
                    }
                }
            // }
        }

    }
};

var crawl_function = function(main_link_page, site) {
    var _site = site;
    if (!site) {
        alert('No site was passed.');
        return false;
    }
    if (main_link_page == 1) {
        link_array = [];
        var yql = 'http://query.yahooapis.com/v1/public/yql?q=' + encodeURIComponent('select * from html where url="' + _site + '"') + '&format=json';
        ajax_call_function(yql, 1, _site);
    } else {
        head_links_array = [];
        head_metaTags_array = [];
        var yql2 = 'http://query.yahooapis.com/v1/public/yql?q=' + encodeURIComponent('select * from html where url="' + _site + '"  and xpath="/html/head/*"  ') + '&format=json';
        ajax_call_function(yql2, 0, _site);

    }
}

var ajax_call_function = function(yql, main_link_page, _site) {
    $.ajax({
        url: yql
    }).done(function(data) {
        if (main_link_page == 1) {
            requestCrossDomain_function(_site, data);

        } else {
            crawl_single_news_page_function(_site, data);
        }

    }).fail(function(err) {
        console.log(err)
    });
}

$(document).ready(function() {
    $("#head_display").append(head_display());
    setLocalStorageItems();
    var x = JSON.parse(localStorage.getItem("news"));
    var c = x.count;
    for (var i = 0; i < c; i++) {
        crawl_function(1, x.data[i]);
    }
});
