var global_full_news_data = null;
var global_single_news_data = null;
var global_click_count = 0;
// var check = 1;
var words_to_check = ["sanjay", "smriti", "jaitley", "budget"];
// var words_to_check = ["estate", "property", "house", "flat"];

var setLocalStorageItems = function() {
    if (typeof(Storage) !== "undefined") {
        if (!localStorage.getItem("news")) {
            localStorage.setItem("news", '{"count":"2","data":["http://www.hindustantimes.com/","http://timesofindia.indiatimes.com/"]}');
        }
    } else {}
};

var head_data = function() {
    var div = document.createElement("div");
    div.setAttribute("class", "head_data");

    var span = document.createElement("span");
    span.setAttribute("class", "head_span");

    var text_node = document.createTextNode("Proptiger");
    span.appendChild(text_node);
    div.appendChild(span);
    return div;
};

function requestCrossDomain(site) {
    var link_array = [];
    var _site = site;
    if (!site) {
        alert('No site was passed.');
        return false;
    }
    var yql = 'http://query.yahooapis.com/v1/public/yql?q=' + encodeURIComponent('select * from html where url="' + _site + '"') + '&format=json';

    function json_traverse(o) {
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
    }

    function traverse_for_title(o) {
        var type = typeof o;
        if (type == "object") {
            for (var key in o) {
                var t = key.toLowerCase()
                if (t == "title") {
                    return o[key];
                }
                traverse_for_title(o[key]);
            }
        } else {
            var tt = JSON.stringify(o);
        }
    }

    function traverse_for_href(o) {
        var type = typeof o;
        if (type == "object") {
            for (var key in o) {
                var t = key.toLowerCase();
                if ((t == "href")) {
                    return o[key];
                }
                traverse_for_href(o[key]);
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
    }

    $.ajax({
        url: yql
    }).done(function(data) {

        global_full_news_data = data;
        json_traverse(global_full_news_data.query.results.body);
        var count = 0;
        for (var key in link_array) {
            var temp = JSON.stringify(link_array[key]);
            var temp2 = temp.toLowerCase();

            if (check_for_words(temp2)) {
                // var div = document.createElement("div");
                // var a = document.createElement("a");
                var _singleNewsPageLink;
                // xxx = traverse_for_href(link_array[key]);
                if ($.isArray(link_array[key].a)) {
                    // console.log("array");
                    _singleNewsPageLink = link_array[key].a[0].href;
                } else {
                    // console.log("not an array");
                    _singleNewsPageLink = link_array[key].a.href;
                }
                // var _singleNewsPageLink = xxx;
                if (_singleNewsPageLink != undefined) {

                    if ((_singleNewsPageLink.indexOf("http:") != -1) || (_singleNewsPageLink.indexOf("https:") != -1)) {

                    } else {
                        console.log(_singleNewsPageLink);
                        _singleNewsPageLink = _site + _singleNewsPageLink;
                        console.log(_singleNewsPageLink);
                    }
                    // a.setAttribute("href", _singleNewsPageLink);

                    var get_title = traverse_for_title(link_array[key].a);
                    // console.log(get_content);
                    // var text = document.createTextNode(get_title);
                    // a.appendChild(text);
                    // div.appendChild(a);

                    // if (link_array[key].a.content != undefined) {
                    if (get_title != undefined) {
                        // if (check == 1) {
                        //     // console.log(check);
                        //     div.setAttribute("class", "feeds show");
                        //     check = 2;
                        // } else {
                        //     // console.log(check);
                        //     div.setAttribute("class", "feeds hide");
                        // }
                        // console.log(link_array[key]);
                        crawl_single_news_page(_singleNewsPageLink);
                        // $("#feed").append(div);
                    }
                }
            }
        }
    }).fail(function(err) {
        console.log(err)
    });
}

function crawl_single_news_page(site) {
    var head_array_link = [];
    var head_array_meta = [];

    var _site = site;
    // console.log(_site);
    if (!_site) {
        alert('No site was passed.');
        return false;
    }
    var yql2 = 'http://query.yahooapis.com/v1/public/yql?q=' + encodeURIComponent('select * from html where url="' + _site + '"  and xpath="/html/head/*"  ') + '&format=json';
    // console.log(yql2);

    function make_array_link(o) {
        for (var key in o) {
            head_array_link.push(o[key]);
        }
    }

    function make_array_meta(o) {
        for (var key in o) {
            head_array_meta.push(o[key]);
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
    }

    function find_desc() {
        for (var key in head_array_meta) {
            var temp = head_array_meta[key];
            if (temp.hasOwnProperty("name")) {
                var temp_name = temp.name.toLowerCase();
                // console.log(temp_name)
                if (temp_name == "description") {
                    // console.log(temp.content);
                    return temp.content;
                }
            }
        }
    };

    function find_image_href() {
        for (var key in head_array_link) {
            var temp = head_array_link[key];
        }
    }

    function find_news_feed_time() {
        for (var key in head_array_meta) {

            var temp = head_array_meta[key];
            if (temp.hasOwnProperty("name")) {

                var temp_text = temp.name.toLowerCase();
                console.log(temp_text);
                if ((temp_text.indexOf("time") != -1) || (temp_text.indexOf("update") != -1) || (temp_text.indexOf("modified") != -1)) {

                    return temp.content;
                }
            }
        }
    }

    function find_news_feed_time2() {
        for (var key in head_array_meta) {

            var temp = head_array_meta[key];

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
    }

    function make_div(title, description_of_news, image_href, news_href, news_feed_time) {

        console.log(description_of_news);
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

    $.ajax({
        url: yql2
    }).done(function(data) {

        global_single_news_data = data;
        var set_news_href = _site;
        console.log(_site);
        var set_title = global_single_news_data.query.results.title;

        for (var key in global_single_news_data.query.results) {
            if (key == "link") {
                make_array_link(global_single_news_data.query.results[key]);
            }
        }
        for (var key in global_single_news_data.query.results) {
            if (key == "meta") {
                make_array_meta(global_single_news_data.query.results[key]);
            }
        }

        var set_desc = find_desc();
        var set_image_href = find_image_href();

        var news_feed_time = find_news_feed_time2();

        var dd = check_for_words(set_title);
        console.log(dd);
        if (dd) {
            $("#feed").append(make_div(set_title, set_desc, set_image_href, set_news_href, news_feed_time));
        }
    }).fail(function(err) {
        console.log(err)
    });
}

$(document).ready(function() {
    // $("#cl1").on("click", function() {
    //     global_click_count--;
    //     if (global_click_count < 0) {
    //         global_click_count = 0;
    //     }
    //     var tt = $("#feed").children();
    //     var temp = 0;
    //     for (var key in tt) {
    //         if (temp == global_click_count) {
    //             $(tt[global_click_count]).attr("class", "feeds show");
    //             $(tt[temp]).show();
    //         } else {
    //             $(tt[global_click_count]).attr("class", "feeds hide");
    //             $(tt[temp]).hide();
    //         }
    //         temp++;
    //     }

    // });
    // $("#cl2").on("click", function() {
    //     global_click_count++;
    //     var tt = $("#feed").children();

    //     var temp = 0;
    //     for (var key in tt) {

    //         if (temp == global_click_count) {
    //             $(tt[global_click_count]).attr("class", "feeds show");
    //             $(tt[temp]).show();
    //         } else {
    //             $(tt[global_click_count]).attr("class", "feeds hide");
    //             $(tt[temp]).hide();
    //         }
    //         temp++;
    //     }
    // });

    $("#head_data").append(head_data());
    setLocalStorageItems();
    var x = JSON.parse(localStorage.getItem("news"));
    var c = x.count;
    for (var i = 0; i < c; i++) {
        requestCrossDomain(x.data[i]);
        // crawl_single_news_page(x.data[i]);
    }
});
