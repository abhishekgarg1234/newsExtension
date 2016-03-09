(function(window) {
    var app = (function(document) {

        var head_displayId, feedId;

        head_displayId = config.head_displayId;
        feedId = config.feedId;


        var background_working = false;

        var input_data = config.input_data2,
            words_to_check_for_news = config.words_to_check;

        var head_links_array = [],
            head_metaTags_array = [],
            anchorTags_array = [];

        var final_titles_array = [],
            final_description_array = [],
            final_newsHref_array = [],
            final_imageHref_array = [],
            final_time_array = [],
            final_priority_array = [];

        var prev_date = null,
            number_of_news = 0;

        var promise_array = [],
            single_news_priority_array = [],
            single_news_links_array = [];

        var previous_saved_date;

        var make_head_links_array = function(obj) {
            head_links_array = [];
            for (var key in obj) {
                head_links_array.push(obj[key]);
            }
        };

        var make_head_meatTags_array = function(obj) {
            head_metaTags_array = [];
            for (var key in obj) {
                head_metaTags_array.push(obj[key]);
            }
        };

        var check_for_words = function(str) {
            str = str.toLowerCase(str);
            for (var key in words_to_check_for_news) {
                if (str.indexOf(words_to_check_for_news[key]) != -1) {
                    return 1;
                }
            }
            return 0;
        };

        var find_description = function() {
            for (var key in head_metaTags_array) {
                if (head_metaTags_array[key].hasOwnProperty("name")) {
                    if (head_metaTags_array[key].name.toLowerCase() == "description") {
                        return head_metaTags_array[key].content;
                    }
                }
            }
        };

        var find_image_href_from_meta_ogimage = function() {
            for (var key in head_metaTags_array) {
                // console.log(head_metaTags_array);
                if (head_metaTags_array[key].hasOwnProperty("property")) {
                    if (head_metaTags_array[key].property.toLowerCase() == "og:image") {
                        return head_metaTags_array[key].content;
                    }
                }
            }
        };

        var find_image_href = function() {
            var image = find_image_href_from_meta_ogimage();
            return image;
        };

        var find_image_href_from_description = function(str) {
            var _str = str;
            if (_str.indexOf('src=') != -1) {
                var index = _str.indexOf("src=");
                index = index + 5;
                var str2 = _str.substr(index);
                index = str2.indexOf("\"");
                return str2.substr(0, index);
            } else {
                return "image/images2.jpg";
            }
        };

        var change_desc_remove_imgTags = function(str) {
            str.replace(/<(?:.|\n)*?>/gm, '');
            return str;
        };

        var find_news_feed_time = function() {
            for (var key in head_metaTags_array) {
                var temp = head_metaTags_array[key];
                for (var key2 in temp) {
                    var tt = temp[key2].toLowerCase();
                    if (((tt.indexOf("time") != -1) && ((tt.indexOf("publish") != -1))) || ((tt.indexOf("update") != -1) && (tt.indexOf("time") != -1)) || ((tt.indexOf("modified") != -1))) {
                        if (tt.indexOf("times") != -1) {} else {
                            return temp.content;
                        }
                    }
                }
            }
        };

        var make_div = function(title, description_of_news, image_href, news_href, news_feed_time) {

            var main_div = document.createElement("div");
            main_div.setAttribute("class", "news_feed_div");


            var left_div = document.createElement("div");
            left_div.setAttribute("class", "news_feed left_div");

            var image_div = document.createElement("div");
            image_div.setAttribute("class", "news_feed_image_div");
            var image = document.createElement("img");
            // image.setAttribute("src", image_href);
            // image.setAttribute("src", "image/images2.jpg");
            if (image_href == "image/images2.jpg") {
                image.setAttribute("src", image_href);
            } else {
                image.setAttribute("src", image_href);
            }
            image.setAttribute("alt", "Image not available");
            image.setAttribute("onError", "this.src='image/images2.jpg'");
            image.setAttribute("style", "width:90px;height:90px;");
            image_div.appendChild(image);

            left_div.appendChild(image_div);


            var right_div = document.createElement("div");
            right_div.setAttribute("class", "news_feed right_div");

            var title_div = document.createElement("div");
            title_div.setAttribute("class", "news_feed_title_div");
            var anchor = document.createElement("a");
            anchor.setAttribute("href", news_href);
            anchor.setAttribute("class", "news_feed_anchor_tag");
            anchor.setAttribute("target", "_blank");
            var text = document.createTextNode(title);
            anchor.appendChild(text);
            title_div.appendChild(anchor);

            // var description_div = document.createElement("div");
            // description_div.setAttribute("class", "news_feed_description_div");
            // var description_span = document.createElement("span");
            // description_span.setAttribute("class", "description_span");
            // var text = document.createTextNode(description_of_news);
            // description_span.appendChild(text);
            // description_div.appendChild(description_span);
            // var t = find_image_href_from_description(description_of_news);
            // console.log(t);
            // var description_div = document.createElement("div");
            // description_div.setAttribute("class", "news_feed_description_div");
            // description_div.innerHTML = description_of_news;
            // console.log(description_of_news);



            if ((description_of_news == "none")) {
                description_of_news = "";
                title_div.setAttribute("class", "title_div_without_description");
            } else {
                var description_div = document.createElement("div");
                description_div.setAttribute("class", "news_feed_description_div");
                description_div.innerHTML = description_of_news;
            }
            var time_div = document.createElement("div");
            time_div.setAttribute("class", "news_feed_time_div");
            var time_span = document.createElement("span");
            var text = document.createTextNode(news_feed_time);
            time_span.appendChild(text);
            time_div.appendChild(time_span);

            right_div.appendChild(title_div);
            if (description_of_news != "") {
                right_div.appendChild(description_div);
            }
            right_div.appendChild(time_div);

            // div.appendChild(image);
            // main_div.appendChild(image_div);
            // main_div.appendChild(title_div);
            // main_div.appendChild(description_div);
            // main_div.appendChild(time_div);
            main_div.appendChild(left_div);
            main_div.appendChild(right_div);

            return main_div;
        };

        var json_traverse = function(obj) {
            var type = typeof obj;
            if (type == "object") {
                for (var key in obj) {
                    var t = key.toLowerCase();
                    if (t == "a") {
                        anchorTags_array.push(obj);
                    }
                    json_traverse(obj[key]);
                }
            } else {}
        };

        var traversing_function = function(obj, key_to_traverse) {
            var type = typeof obj;
            if (type == "object") {
                for (var key in obj) {
                    var t = key.toLowerCase();
                    if ((t == key_to_traverse)) {
                        return obj[key];
                    }
                    traversing_function(obj[key], key_to_traverse);
                }
            } else {}
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
                                xx = body_data[key];
                                return body_data[key];
                            }
                        } else {
                            have_rssLink(body_data[key]);
                        }
                    }
                } else {}
            }
        };

        var crawl_mainPage_function = function(_site, data, priority) {
            console.log(_site);
            // console.log(data);
            var global_full_news_data = data;
            is_rss_link = 0;
            json_traverse(global_full_news_data.query.results.body);
            var count = 0;
            for (var key in anchorTags_array) {
                // console.log(anchorTags_array[key]);
                var temp = JSON.stringify(anchorTags_array[key]);
                var temp2 = temp.toLowerCase();
                if (check_for_words(temp2)) {
                    var _singleNewsPageLink;
                    if ($.isArray(anchorTags_array[key].a)) {
                        _singleNewsPageLink = anchorTags_array[key].a[0].href;
                    } else {
                        _singleNewsPageLink = anchorTags_array[key].a.href;
                    }
                    if (_singleNewsPageLink != undefined) {

                        if ((_singleNewsPageLink.indexOf("http:") != -1) || (_singleNewsPageLink.indexOf("https:") != -1)) {

                        } else {
                            _singleNewsPageLink = _site + _singleNewsPageLink;
                        }
                        var get_title = traversing_function(anchorTags_array[key].a, "title");
                        if (get_title != undefined) {
                            single_news_links_array.push(_singleNewsPageLink);
                            // console.log(priority);
                            single_news_priority_array.push(priority);
                        }
                    }
                }
            }
        };

        var crawl_single_news_page_function = function(_site, data, priority) {
            // if (data == "err") {
            //     return false;
            // }
            var feed_id_instance = document.getElementById(feedId);

            var global_single_news_data = data;
            var set_news_href = _site;


            if (global_single_news_data.query.results == null) {
                return false;
            }
            var set_title = global_single_news_data.query.results.title;

            for (var key in global_single_news_data.query.results) {
                if (key == "link") {
                    make_head_links_array(global_single_news_data.query.results[key]);
                } else if (key == "meta") {
                    make_head_meatTags_array(global_single_news_data.query.results[key]);
                }
            }
            // for (var key in global_single_news_data.query.results) {
            //     if (key == "meta") {
            //         make_head_meatTags_array(global_single_news_data.query.results[key]);
            //     }
            // }
            var set_description = find_description();
            var set_image_href = find_image_href();
            var news_feed_time = find_news_feed_time();
            var dd = check_for_words(set_title);
            if (dd) {
                push_news_data(set_title, set_description, set_image_href, set_news_href, news_feed_time, priority);
                // return 1;
                // $(feed_id_instance).append(make_div(set_title, set_description, set_image_href, set_news_href, news_feed_time));
            }
        };

        var crawl_rss_feed_link_function = function(_site, data, priority) {
            var feed_id_instance = document.getElementById(feedId);
            if (data.query.results == null) {
                return;
            }
            for (var i = 0; i < data.query.results.item.length; i++) {
                var temp = data.query.results.item[i].title.toLowerCase();
                if (check_for_words(temp)) {
                    var set_title = data.query.results.item[i].title;
                    var set_description = data.query.results.item[i].description;

                    var set_image_href = find_image_href_from_description(data.query.results.item[i].description);
                    var html2 = /(<([^>]+)>)/gi;
                    set_description = set_description.replace(html2, '');

                    var set_news_href = data.query.results.item[i].link;
                    var news_feed_time = data.query.results.item[i].pubDate;

                    push_news_data(set_title, set_description, set_image_href, set_news_href, news_feed_time, priority);
                    // $(feed_id_instance).append(make_div(set_title, set_description, set_image_href, set_news_href, news_feed_time));
                }
            }
        };

        var push_news_data = function(set_title, set_description, set_image_href, set_news_href, news_feed_time, priority) {
            console.log("pushed data");
            // console.log(priority);
            if ((final_titles_array.indexOf(set_title) != -1) || (final_newsHref_array.indexOf(set_news_href) != -1) || (final_imageHref_array.indexOf(set_image_href) != -1)) {
                return;
            }

            if ((set_title != null) && (set_title != undefined) && (set_title != "")) {
                final_titles_array.push(set_title);
            } else {
                return;
            }

            if ((set_news_href != null) && (set_news_href != undefined) && (set_news_href != "")) {
                final_newsHref_array.push(set_news_href);
            } else {
                return;
            }

            if ((set_description != null) && (set_description != undefined) && (set_description != "")) {
                final_description_array.push(set_description);
            } else {
                final_description_array.push("none");
            }

            if ((set_image_href != null) && (set_image_href != undefined) && (set_image_href != "")) {
                final_imageHref_array.push(set_image_href);
            } else {
                final_imageHref_array.push("image/images2.jpg");
            }

            // var d = new Date(news_feed_time);
            // if (d == "Invalid Date") {
            //     news_feed_time = convert_to_validDate(news_feed_time);
            // }
            if ((news_feed_time != null) && (news_feed_time != undefined) && (news_feed_time != "")) {

                final_time_array.push(news_feed_time);
            } else {
                if (prev_date != null) {
                    final_time_array.push(prev_date);
                } else {
                    final_time_array.push("Mon Mar 07 2016 11:10:57 GMT+0530 (IST)");
                }
            }


            final_priority_array.push(priority);

            prev_date = news_feed_time;
            number_of_news++;
        };

        var render_function = function() {
            console.log(final_priority_array);
            previous_saved_date = final_time_array[0];
            console.log("render_function called");
            var feed_id_instance = document.getElementById(feedId);
            var i = 0;


            // $(feed_id_instance).html("");
            for (var key in final_titles_array) {
                console.log(final_priority_array[i]);
                $(feed_id_instance).append(make_div(final_titles_array[i], final_description_array[i], final_imageHref_array[i], final_newsHref_array[i], final_time_array[i]));
                // $(feed_id_instance).append(make_div(set_title, set_description, set_image_href, set_news_href, news_feed_time));
                i++;
            }
        };

        var prepare_link = function(_site, format) {
            var x1 = 'http://query.yahooapis.com/v1/public/yql?q=';
            if (format == "mainpage") {
                var yql = x1 + encodeURIComponent('select * from html where url="' + _site + '"') + '&format=json';
                return yql;
            } else if (format == "rss") {
                var yql = x1 + encodeURIComponent('select * from rss where url="' + _site + ' "') + '&format=json';
                return yql;
            } else if (format == "single_news") {
                var yql = x1 + encodeURIComponent('select * from html where url="' + _site + '"  and xpath="/html/head/*"  ') + '&format=json';
                return yql;
            }
        };

        var crawl_function = function(format, site, priority) {
            var _site = site;
            if (!_site) {
                alert('No site was passed.');
                return false;
            }
            if (format == "mainpage") {
                anchorTags_array = [];
                temp_crawl(format, _site, priority);
            } else if (format == "rss") {
                temp_crawl(format, _site, priority);
            } else if (format == "single_news") {
                head_links_array = [];
                head_metaTags_array = [];
                temp_crawl(format, _site, priority);
            }
        };

        var temp_crawl = function(format, _site, priority) {
            var yql = prepare_link(_site, format);

            promise_array.push(new Promise(function(resolve, reject) {
                    ajax_call_function(yql).then(function(data) {
                        resolve(data);
                        // reject(data);
                    });
                })
                .then(function(data) {
                    if (data == "err") {} else {
                        after_ajax_call_function(format, _site, data, priority);
                    }
                })
            );
        };

        var after_ajax_call_function = function(format, _site, data, priority) {
            if (format == "mainpage") {
                crawl_mainPage_function(_site, data, priority);
            } else if (format == "rss") {
                crawl_rss_feed_link_function(_site, data, priority);
            } else if (format == "single_news") {
                crawl_single_news_page_function(_site, data, priority);
            } else {}
        };

        var ajax_call_function = function(url) {
            return new Promise(function(resolve, reject) {
                $.ajax({
                    url: url
                }).done(function(data) {
                    // console.log(url);
                    // console.log(data);
                    resolve(data);
                }).fail(function(err) {
                    // console.log(err);
                    // reject(err);
                    resolve("err");
                });
            });
        };

        var ajax_call_function2 = function(yql, format, _site) {
            var pro = new Promise(function(resolve, reject) {
                $.ajax({
                    url: yql
                }).success(function(data, str, xhr) {
                    if (format == "mainpage") {
                        crawl_mainPage_function(_site, data);
                        resolve(_site);
                    } else if (format == "rss") {
                        crawl_rss_feed_link_function(_site, data);
                        resolve(_site);
                    } else if (format == "single_news") {
                        crawl_single_news_page_function(_site, data);
                        resolve(data);
                    } else {}

                }).fail(function(err) {
                    console.log(err);
                    resolve("a");
                });
            });
            if (format != "single_news") {
                promise_array.push(pro);
            } else {
                promise_array2.push(pro);
            }
        };

        var sort_acc_to_date = function() {
            var n = number_of_news;
            var c, d;
            for (c = 0; c < (n - 1); c++) {
                for (d = 0; d < n - c - 1; d++) {
                    var first_date = Date.parse(final_time_array[d]);
                    first_date = Number(first_date);
                    var sec_date = Date.parse(final_time_array[d + 1]);
                    sec_date = Number(sec_date);
                    if (first_date < sec_date) {
                        var swap;
                        swap = final_time_array[d];
                        final_time_array[d] = final_time_array[d + 1];
                        final_time_array[d + 1] = swap;

                        swap = final_titles_array[d];
                        final_titles_array[d] = final_titles_array[d + 1];
                        final_titles_array[d + 1] = swap;

                        swap = final_description_array[d];
                        final_description_array[d] = final_description_array[d + 1];
                        final_description_array[d + 1] = swap;

                        swap = final_imageHref_array[d];
                        final_imageHref_array[d] = final_imageHref_array[d + 1];
                        final_imageHref_array[d + 1] = swap;

                        swap = final_newsHref_array[d];
                        final_newsHref_array[d] = final_newsHref_array[d + 1];
                        final_newsHref_array[d + 1] = swap;

                        swap = final_priority_array[d];
                        final_priority_array[d] = final_priority_array[d + 1];
                        final_priority_array[d + 1] = swap;
                    }
                }
            }
        };

        var sort_acc_to_priority = function() {
            var n = number_of_news;
            var c, d;
            for (c = 0; c < (n - 1); c++) {
                for (d = 0; d < n - c - 1; d++) {
                    // var first_date = Date.parse(final_time_array[d]);
                    // first_date = Number(first_date);

                    first_prio = final_priority_array[d];
                    // var sec_date = Date.parse(final_time_array[d + 1]);
                    // sec_date = Number(sec_date);
                    sec_prio = final_priority_array[d + 1];

                    if (first_prio > sec_prio) {
                        var swap;
                        swap = final_time_array[d];
                        final_time_array[d] = final_time_array[d + 1];
                        final_time_array[d + 1] = swap;

                        swap = final_titles_array[d];
                        final_titles_array[d] = final_titles_array[d + 1];
                        final_titles_array[d + 1] = swap;

                        swap = final_description_array[d];
                        final_description_array[d] = final_description_array[d + 1];
                        final_description_array[d + 1] = swap;

                        swap = final_imageHref_array[d];
                        final_imageHref_array[d] = final_imageHref_array[d + 1];
                        final_imageHref_array[d + 1] = swap;

                        swap = final_newsHref_array[d];
                        final_newsHref_array[d] = final_newsHref_array[d + 1];
                        final_newsHref_array[d + 1] = swap;

                        swap = final_priority_array[d];
                        final_priority_array[d] = final_priority_array[d + 1];
                        final_priority_array[d + 1] = swap;
                    }
                }
            }
        };

        var bindForm = function() {
            console.log(arguments.length);
            if (arguments.length > 0) {
                console.log(arguments.length);
                background_working = true;
                promise_array = [];
                final_titles_array = [];
                final_description_array = [];
                final_imageHref_array = [];
                final_newsHref_array = [];
                final_time_array = [];
                final_priority_array = [];
                single_news_links_array = [];
                single_news_priority_array = [];
                console.log("got arguments");
            } else {
                // background_working = false;
            }

            return new Promise(function(resolve, reject) {

                var head_displayInstance = document.getElementById(head_displayId);
                var feed_id_instance = document.getElementById(feedId);

                // var c = input_data.count;
                var c = input_data.data.length;
                for (var i = 0; i < c; i++) {
                    if (input_data.data[i].type == "mainpage") {
                        crawl_function("mainpage", input_data.data[i].url, input_data.data[i].priority);
                    } else if (input_data.data[i].type == "rss") {
                        crawl_function("rss", input_data.data[i].url, input_data.data[i].priority);
                    } else if (input_data.data[i].type == "") {
                        crawl_function("mainpage", input_data.data[i].url, input_data.data[i].priority);
                    }
                }
                if (background_working == false) {
                    console.log("inside");
                    $(feed_id_instance).addClass("loading");
                    $(".slider_for_new_news").slideUp();
                } else {
                    console.log(background_working);
                }
                Promise.all(promise_array).then(function() {
                    promise_array = [];
                    for (var key in single_news_links_array) {
                        crawl_function("single_news", single_news_links_array[key], single_news_priority_array[key]);
                    }
                    Promise.all(promise_array).then(function() {
                        $(feed_id_instance).attr("class", "loaded");
                        $(feed_id_instance).removeClass("loading");
                        sort_acc_to_date();
                        sort_acc_to_priority();

                        if (background_working == true) {


                            // sort_acc_to_date();
                            var x = Date.parse(final_time_array[0]);
                            var y = Date.parse(previous_saved_date);
                            if (x > y) {
                                // if (1) {
                                $(".slider_for_new_news").slideDown();
                                $(".slider_for_new_news").on("click", function() {
                                    $(".slider_for_new_news").slideUp();
                                    render_function();
                                });
                            }
                            resolve("final");



                        } else {
                            render_function();
                            resolve("final");
                        }
                    });
                    // $(".slider_for_new_news").slideUp();

                    // var myVar = setInterval(myTimer, 100000);

                    // function myTimer() {
                    // promise_array = [];
                    // promise_array2 = [];

                    // final_titles_array = [];
                    // final_description_array = [];
                    // final_imageHref_array = [];
                    // final_newsHref_array = [];
                    // final_time_array = [];
                    // final_priority_array=[];
                    // single_news_links_array = [];
                    //     console.log(final_titles_array);

                    //     console.log("timer called");
                    //     for (var i = 0; i < c; i++) {
                    //         if (input_data.data[i].type == "mainpage") {
                    //             crawl_function("mainpage", input_data.data[i].url);
                    //         } else if (input_data.data[i].type == "rss") {
                    //             crawl_function("rss", input_dasta.data[i].url);
                    //         }
                    //     }
                    //     Promise.all(promise_array).then(function() {
                    //         for (var key in single_news_links_array) {
                    //             crawl_function("single_news", single_news_links_array[key]);
                    //         }
                    //         Promise.all(promise_array2).then(function() {
                    //             sort_acc_to_date();
                    //             var x = Date.parse(final_time_array[0]);
                    //             var y = Date.parse(previous_saved_date);
                    //             // if (x > y) {
                    //             $(".slider_for_new_news").slideDown();
                    //      $(".slider_for_new_news").on("click", function() {
                    //     $(".slider_for_new_news").slideUp();
                    //     render_function();
                    // });
                    //             // }


                    //         });
                    //     });
                    // }
                    // });
                });
            });
        };

        return {
            bindForm: bindForm
        };

    })(window.document);

    window.app = app;
})(window);
