(function(window) {
    var app = (function(document) {

        var head_displayId = config.head_displayId,
            feedId = config.feedId;
        var background_working = false;
        var data_present_in_localStorage = false;
        var number_of_news = 0;

        var input_data = config.input_data2,
            words_to_check_for_news = config.words_to_check,
            max_news_per_site = config.max_news_per_site,
            number_of_news_in_single_page = config.number_of_news_in_single_page,
            cities_list = config.city;

        var head_links_array = [],
            head_metaTags_array = [],
            anchorTags_array = [];

        var final_titles_array = [],
            final_description_array = [],
            final_newsHref_array = [],
            final_imageHref_array = [],
            final_time_array = [],
            final_priority_array = [],
            final_city_array = [],
            final_state_array = [];

        var final_titles_array2 = [],
            final_description_array2 = [],
            final_newsHref_array2 = [],
            final_imageHref_array2 = [],
            final_time_array2 = [],
            final_priority_array2 = [],
            final_city_array2 = [],
            final_state_array2 = [];

        var temp_titles_array = [],
            temp_description_array = [],
            temp_newsHref_array = [],
            temp_imageHref_array = [],
            temp_time_array = [],
            temp_priority_array = [],
            temp_city_array = [],
            temp_state_array = [];

        var new_news_titles_array = [],
            new_news_description_array = [],
            new_news_newsHref_array = [],
            new_news_imageHref_array = [],
            new_news_time_array = [],
            new_news_priority_array = [],
            new_news_city_array = [],
            new_news_state_array = [];

        var prev_date = null,
            number_of_news = 0;

        var promise_array = [],
            single_news_priority_array = [],
            single_news_links_array = [],
            single_news_image_array = [];

        var previous_saved_date;

        var all_promise_done = false;

        var make_head_links_array = function(obj) {
            head_links_array = [];
            for (var key in obj) {
                head_links_array.push(obj[key]);
            }
        };

        var update_already_present_news = function(set_title, set_description, set_image_href, set_news_href, news_feed_time, priority, city, state) {

            // for (var key in final_newsHref_array2) {
            //     if (final_newsHref_array2[key] == set_news_href) {
            //         final_titles_array2[key] = set_title;
            //         final_description_array2[key] = set_description;
            //         final_imageHref_array2[key] = set_image_href;
            //         final_newsHref_array2[key] = set_news_href;
            //         final_time_array2[key] = news_feed_time;
            //         final_priority_array2[key] = priority;

            //         var class_name = functions.remove_punchuations(set_title);
            //         $("." + class_name).find("img").attr("src", set_image_href);
            //         $("." + class_name).find(".news_feed_description_div").val(set_description);
            //         $("." + class_name).find(".news_feed_title_div").val(set_title);
            //         $("." + class_name).find(".news_feed_time_div").find("span").val(news_feed_time);

            //     }
            // }
            for (var key in final_newsHref_array2) {
                if (final_newsHref_array2[key] == set_news_href) {
                    final_newsHref_array2.splice(key, 1);
                    final_titles_array2.splice(key, 1);
                    final_description_array2.splice(key, 1);
                    final_imageHref_array2.splice(key, 1);
                    final_newsHref_array2.splice(key, 1);
                    final_time_array2.splice(key, 1);
                    final_priority_array2.splice(key, 1);
                    final_city_array2.splice(key, 1);
                    final_state_array2.splice(key, 1);

                    // var class_name = functions.remove_punchuations(set_title);
                    // $("." + class_name).find("img").attr("src", set_image_href);
                    // $("." + class_name).find(".news_feed_description_div").val(set_description);
                    // $("." + class_name).find(".news_feed_title_div").val(set_title);
                    // $("." + class_name).find(".news_feed_time_div").find("span").val(news_feed_time);

                    var class_name = functions.remove_punchuations(final_titles_array2[key]);

                    $("." + class_name).remove();
                }
            }
        };

        var make_head_metaTags_array = function(obj) {
            head_metaTags_array = [];
            for (var key in obj) {
                head_metaTags_array.push(obj[key]);
            }
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
                                is_rss_link = 1;
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
            var global_full_news_data = data;
            is_rss_link = 0;
            json_traverse(global_full_news_data.query.results.body);
            var count = 0;
            for (var key in anchorTags_array) {
                var temp = JSON.stringify(anchorTags_array[key]);
                var temp2 = temp.toLowerCase();
                if (functions.check_for_words(temp2)) {

                    var _singleNewsPageLink;
                    if ($.isArray(anchorTags_array[key].a)) {
                        _singleNewsPageLink = anchorTags_array[key].a[0].href;
                    } else {
                        _singleNewsPageLink = anchorTags_array[key].a.href;
                    }
                    if (_singleNewsPageLink != undefined) {

                        if ((_singleNewsPageLink.indexOf("http:") != -1) || (_singleNewsPageLink.indexOf("https:") != -1)) {} else {
                            _singleNewsPageLink = _site + _singleNewsPageLink;
                        }
                        var get_title = traversing_function(anchorTags_array[key].a, "title");
                        if (get_title == undefined) {
                            get_title = traversing_function(anchorTags_array[key].a, "content");
                        }
                        if (get_title != undefined) {
                            single_news_links_array.push(_singleNewsPageLink);
                            single_news_priority_array.push(priority);
                        }
                    }
                }
            }
        };

        var crawl_single_news_page_function = function(_site, data, priority) {

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
                    make_head_metaTags_array(global_single_news_data.query.results[key]);
                }
            }
            var set_description = find_description();
            var set_image_href = find_image_href();
            var news_feed_time = find_news_feed_time();
            var dd = functions.check_for_words(set_title);
            if (dd) {
                push_news_data(set_title, set_description, set_image_href, set_news_href, news_feed_time, priority);
            }
        };

        var crawl_single_news_page_function_for_imageOnly = function(data) {
            var global_single_news_data = data;
            for (var key in global_single_news_data.query.results) {
                if (key == "meta") {
                    make_head_metaTags_array(global_single_news_data.query.results[key]);
                }
            }
            var image_href = find_image_href();
            return image_href;
        };

        var crawl_rss_feed_link_function = function(_site, data, priority) {
            var feed_id_instance = document.getElementById(feedId);
            if (data.query.results == null) {
                return;
            }
            for (var i = 0; i < data.query.results.item.length && i <= max_news_per_site; i++) {
                var temp = data.query.results.item[i].title.toLowerCase();
                // if (functions.check_for_words(temp)) {
                if (1) {
                    var set_title = data.query.results.item[i].title;
                    var set_description = data.query.results.item[i].description;

                    var set_image_href;
                    if (data.query.results.item[i].image) {
                        set_image_href = data.query.results.item[i].image.src;
                    } else {
                        set_image_href = "image/images2.jpg";

                    }
                    var html2 = /(<([^>]+)>)/gi;
                    set_description = set_description.replace(html2, '');
                    var set_news_href = data.query.results.item[i].link;
                    var news_feed_time = data.query.results.item[i].pubDate;

                    var set_news_city = functions.get_city_of_news_from_details(set_title, set_description, set_news_href);
                    var set_news_state = functions.get_state_of_news_from_details(set_title, set_description, set_news_href);

                    if ((background_working == true) || (data_present_in_localStorage == true)) {
                        var x = Date.parse(news_feed_time);
                        var y = Date.parse(previous_saved_date);
                        if (x > y) {
                            no_of_new_news++;
                            news_feed_time = news_feed_time.toString();
                            if ((final_titles_array2.indexOf(set_title) != -1) || (final_newsHref_array2.indexOf(set_image_href) != -1)) {
                                update_already_present_news(set_title, set_description, set_image_href, set_news_href, news_feed_time, priority, set_news_city, set_news_state);
                            }
                            push_in_new_news_array(set_title, set_description, set_image_href, set_news_href, news_feed_time, priority, set_news_city, set_news_state);
                        }
                    } else {
                        if (set_image_href == "image/images2.jpg") {
                            push_news_data_temp(set_title, set_description, set_image_href, set_news_href, news_feed_time, priority, set_news_city, set_news_state);
                        } else {
                            push_news_data(set_title, set_description, set_image_href, set_news_href, news_feed_time, priority, set_news_city, set_news_state);
                        }
                    }
                }
            }
        };

        var push_news_data = function(set_title, set_description, set_image_href, set_news_href, news_feed_time, priority, set_city, set_state) {

            // console.log("pushed data");
            if ((final_titles_array.indexOf(set_title) != -1) || (final_newsHref_array.indexOf(set_news_href) != -1)) {
                return;
            }
            if (set_image_href == "image/images2.jpg") {} else {
                if ((final_imageHref_array.indexOf(set_image_href) != -1)) {
                    return
                }
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

            if ((news_feed_time != null) && (news_feed_time != undefined) && (news_feed_time != "")) {
                final_time_array.push(news_feed_time);
            } else {
                if (prev_date != null) {
                    final_time_array.push(prev_date);
                } else {
                    final_time_array.push("Mon Mar 07 2016 11:10:57 GMT+0530 (IST)");
                }
            }

            final_city_array.push(set_city);
            final_state_array.push(set_state);

            var x = Date.parse(news_feed_time);

            var y = Date.parse(previous_saved_date);
            if (x > y) {
                previous_saved_date = news_feed_time;
            }

            final_priority_array.push(priority);

            prev_date = news_feed_time;
            // console.log(number_of_news);
            number_of_news++;
        };

        var push_news_data_temp = function(set_title, set_description, set_image_href, set_news_href, news_feed_time, priority, city, state) {

            if ((temp_titles_array.indexOf(set_title) != -1)) {
                return;
            }

            var x = Date.parse(news_feed_time);

            var y = Date.parse(previous_saved_date);
            if (x > y) {
                previous_saved_date = news_feed_time;
            }

            temp_titles_array.push(set_title);
            temp_description_array.push(set_description);
            temp_imageHref_array.push("meta");
            temp_newsHref_array.push(set_news_href);
            temp_time_array.push(news_feed_time);
            temp_priority_array.push(priority);
            temp_city_array.push(city);
            temp_state_array.push(state);
            // console.log(" push_news_data_temp" + number_of_news);
            number_of_news++;
        };

        var push_in_new_news_array = function(set_title, set_description, set_image_href, set_news_href, news_feed_time, priority, city, state) {
            if ((new_news_titles_array.indexOf(set_title) != -1)) {
                return;
            }

            var x = Date.parse(news_feed_time);

            var y = Date.parse(previous_saved_date);
            if (x > y) {
                previous_saved_date = news_feed_time;
            }
            new_news_titles_array.push(set_title);
            new_news_description_array.push(set_description);
            new_news_imageHref_array.push("meta");
            new_news_newsHref_array.push(set_news_href);
            new_news_time_array.push(news_feed_time);
            new_news_priority_array.push(priority);
            new_news_city_array.push(city);
            new_news_state_array.push(state);
        };

        var store_data_in_final2 = function() {
            for (var key in final_titles_array) {
                final_titles_array2.push(final_titles_array[key]);
                final_time_array2.push(final_time_array[key]);
                final_priority_array2.push(final_priority_array[key]);
                final_imageHref_array2.push(final_imageHref_array[key]);
                final_description_array2.push(final_description_array[key]);
                final_newsHref_array2.push(final_newsHref_array[key]);
                final_city_array2.push(final_city_array[key]);
                final_state_array2.push(final_state_array[key]);

                if (final_city_array[key] != "other") {
                    // console.log(final_city_array[key]);
                    // console.log(final_titles_array[key]);
                }
            }
        };

        var cleanup_array2 = function() {
            final_titles_array2 = [];
            final_time_array2 = [];
            final_priority_array2 = [];
            final_imageHref_array2 = [];
            final_description_array2 = [];
            final_newsHref_array2 = [];
            final_city_array2 = [];
            final_state_array2 = [];
        };

        var cleanup_new_news_array = function() {
            new_news_titles_array = [];
            new_news_description_array = [];
            new_news_imageHref_array = [];
            new_news_newsHref_array = [];
            new_news_time_array = [];
            new_news_priority_array = [];
            new_news_city_array = [];
            new_news_state_array = [];
        };

        var render_function2 = function() {




            var feed_id_instance = document.getElementById(feedId);
            // previous_saved_date = final_time_array2[0];
            // console.log("render_function called");
            var i = 0;
            $(feed_id_instance).html("");
            for (var key in final_titles_array2) {
                // console.log(final_imageHref_array2[i]);
                if (final_imageHref_array2[i] == "meta") {
                    final_imageHref_array2[i] = "image/images2.jpg";
                }
                $(feed_id_instance).append(functions.make_div(final_titles_array2[i], final_description_array2[i], final_imageHref_array2[i], final_newsHref_array2[i], final_time_array2[i]));
                i++;
            }
        };

        var render_function = function() {
            console.log("render function called");
            var city_arr = JSON.parse(localStorage.getItem("cities"));
            var feed_id_instance = document.getElementById(feedId);
            var i = 0;
            $(feed_id_instance).html("");
            for (var key in final_titles_array2) {
                if (check_match(city_arr, final_city_array2[key])) {
                    if (final_imageHref_array2[i] == "meta") {
                        final_imageHref_array2[i] = "image/images2.jpg";
                    }
                    $(feed_id_instance).append(functions.make_div(final_titles_array2[i], final_description_array2[i], final_imageHref_array2[i], final_newsHref_array2[i], final_time_array2[i]));
                }
                i++;
            }
        };
        var check_match = function(city_arr1, final_arr) {
            var ans = 0;
            // city_arr1 = JSON.parse(city_arr1);
            if (final_arr == "other") {
                final_arr = ["other"];
            }
            for (var key in final_arr) {
                for (var key1 in city_arr1) {
                    if (city_arr1[key1] == final_arr[key]) {
                        ans = 1;
                    }
                }
            }
            return ans;
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
            var yql = functions.prepare_link(_site, format);
            promise_array.push(functions.ajax_call_function(yql).then(function(data) {
                // console.log("got response");
                if (data == "err") {} else {
                    // console.log("a");
                    after_ajax_call_function(format, _site, data, priority);
                }
            }))
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

        var change_dates_same_format = function() {
            var n = number_of_news;
            for (i = 0; i < n; i++) {
                var d = new Date(final_time_array[i]);
                final_time_array[i] = d.toString();
            }
        };

        var sort_acc_to_date = function() {
            var n = number_of_news;
            var c, d;
            for (c = 0; c < (n - 1); c++) {
                for (d = 0; d < n - c - 1; d++) {
                    var first_date = Date.parse(final_time_array[d]);
                    // console.log(first_date);
                    first_date = Number(first_date);
                    // console.log(first_date);
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

                        swap = final_city_array[d];
                        final_city_array[d] = final_city_array[d + 1];
                        final_city_array[d + 1] = swap;

                        swap = final_state_array[d];
                        final_state_array[d] = final_state_array[d + 1];
                        final_state_array[d + 1] = swap;
                    }
                }
            }
        };

        var sort_acc_to_priority = function() {
            var n = number_of_news;
            var c, d;
            for (c = 0; c < (n - 1); c++) {
                for (d = 0; d < n - c - 1; d++) {
                    first_prio = final_priority_array[d];
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

                        swap = final_city_array[d];
                        final_city_array[d] = final_city_array[d + 1];
                        final_city_array[d + 1] = swap;

                        swap = final_state_array[d];
                        final_state_array[d] = final_state_array[d + 1];
                        final_state_array[d + 1] = swap;
                    }
                }
            }

            for (var key in final_priority_array) {}
        };

        var sort_new_news_acc_to_date = function() {
            var n = new_news_titles_array.length;
            var c, d;
            for (c = 0; c < (n - 1); c++) {
                for (d = 0; d < n - c - 1; d++) {
                    var first_date = Date.parse(new_news_time_array[d]);
                    // console.log(first_date);
                    first_date = Number(first_date);
                    // console.log(first_date);
                    var sec_date = Date.parse(new_news_time_array[d + 1]);
                    sec_date = Number(sec_date);
                    if (first_date < sec_date) {
                        var swap;
                        swap = new_news_time_array[d];
                        new_news_time_array[d] = new_news_time_array[d + 1];
                        new_news_time_array[d + 1] = swap;

                        swap = new_news_titles_array[d];
                        new_news_titles_array[d] = new_news_titles_array[d + 1];
                        new_news_titles_array[d + 1] = swap;

                        swap = new_news_description_array[d];
                        new_news_description_array[d] = new_news_description_array[d + 1];
                        new_news_description_array[d + 1] = swap;

                        swap = new_news_imageHref_array[d];
                        new_news_imageHref_array[d] = new_news_imageHref_array[d + 1];
                        new_news_imageHref_array[d + 1] = swap;

                        swap = new_news_newsHref_array[d];
                        new_news_newsHref_array[d] = new_news_newsHref_array[d + 1];
                        new_news_newsHref_array[d + 1] = swap;

                        swap = new_news_priority_array[d];
                        new_news_priority_array[d] = new_news_priority_array[d + 1];
                        new_news_priority_array[d + 1] = swap;

                        swap = new_news_city_array[d];
                        new_news_city_array[d] = new_news_city_array[d + 1];
                        new_news_city_array[d + 1] = swap;

                        swap = new_news_state_array[d];
                        new_news_state_array[d] = new_news_state_array[d + 1];
                        new_news_state_array[d + 1] = swap;
                    }
                }
            }
        };

        var sort_new_news_acc_to_priority = function() {
            var n = new_news_titles_array.length;
            var c, d;
            for (c = 0; c < (n - 1); c++) {
                for (d = 0; d < n - c - 1; d++) {
                    first_prio = new_news_priority_array[d];
                    sec_prio = new_news_priority_array[d + 1];

                    if (first_prio > sec_prio) {
                        var swap;
                        swap = new_news_time_array[d];
                        new_news_time_array[d] = new_news_time_array[d + 1];
                        new_news_time_array[d + 1] = swap;

                        swap = new_news_titles_array[d];
                        new_news_titles_array[d] = new_news_titles_array[d + 1];
                        new_news_titles_array[d + 1] = swap;

                        swap = new_news_description_array[d];
                        new_news_description_array[d] = new_news_description_array[d + 1];
                        new_news_description_array[d + 1] = swap;

                        swap = new_news_imageHref_array[d];
                        new_news_imageHref_array[d] = new_news_imageHref_array[d + 1];
                        new_news_imageHref_array[d + 1] = swap;

                        swap = new_news_newsHref_array[d];
                        new_news_newsHref_array[d] = new_news_newsHref_array[d + 1];
                        new_news_newsHref_array[d + 1] = swap;

                        swap = new_news_priority_array[d];
                        new_news_priority_array[d] = new_news_priority_array[d + 1];
                        new_news_priority_array[d + 1] = swap;

                        swap = new_news_city_array[d];
                        new_news_city_array[d] = new_news_priority_array[d + 1];
                        new_news_city_array[d + 1] = swap;

                        swap = new_news_state_array[d];
                        new_news_state_array[d] = new_news_state_array[d + 1];
                        new_news_state_array[d + 1] = swap;
                    }
                }
            }
        };

        var crawl_for_imageLink_from_meta = function(link, key) {
            // console.log("for image");
            var yql = functions.prepare_link(link, "single_news");
            promise_array.push(functions.ajax_call_function(yql).then(function(data) {
                if (data == "err") {} else {
                    var img = crawl_single_news_page_function_for_imageOnly(data);
                    temp_imageHref_array[key] = img;

                    for (var key2 in final_newsHref_array2) {
                        if (final_newsHref_array2[key2] == link) {
                            // console.log(img);
                            // console.log(img);
                            final_imageHref_array2[key2] = img;

                            var str = final_titles_array2[key2];
                            str = functions.remove_punchuations(str);
                            // str = str.replace(/\s+/g, '');
                            // str = str.replace(/\'/g, "");
                            // str = str.replace(/\"/g, "");
                            // str = str.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "");
                            // str = str.replace(/\?/g, "");
                            // console.log($("." + str).children()[0].childNodes[0].childNodes);
                            // console.log($("." + str).find("img").attr("src"));
                            // console.log(img);
                            // console.log("a"+$("." + str).children()[0].childNodes[0].childNodes.attr("src"));
                            // $("." + str).find("img").("src", img);
                            $("." + str).find("img").attr("data-src", img);
                            $("img").unveil();

                            // $("." + str).children()[0].childNodes[0].childNodes.attr("src", img);
                        }
                    }
                }
            }))
        };

        var move_from_temp_to_final = function() {
            // console.log(temp_city_array);
            for (var key in temp_titles_array) {
                if (final_titles_array.indexOf(temp_titles_array[key]) != -1) {
                    continue;
                }
                final_titles_array.push(temp_titles_array[key]);
                final_time_array.push(temp_time_array[key]);
                final_priority_array.push(temp_priority_array[key]);
                final_imageHref_array.push(temp_imageHref_array[key]);
                final_description_array.push(temp_description_array[key]);
                final_newsHref_array.push(temp_newsHref_array[key]);
                final_city_array.push(temp_city_array[key]);
                final_state_array.push(temp_state_array[key]);
            }
        };

        var move_from_tempo_to_final = function() {
            for (var key in new_news_titles_array) {
                if (final_titles_array.indexOf(temp_titles_array[key]) != -1) {
                    continue;
                }
                final_titles_array2.unshift(new_news_titles_array[key]);
                final_time_array2.unshift(new_news_time_array[key]);
                final_priority_array2.unshift(new_news_priority_array[key]);
                if (new_news_imageHref_array[key] == "meta") {
                    new_news_imageHref_array[key] = "image/images2.jpg";
                }
                final_imageHref_array2.unshift(new_news_imageHref_array[key]);
                final_description_array2.unshift(new_news_description_array[key]);
                final_newsHref_array2.unshift(new_news_newsHref_array[key]);
                final_city_array2.unshift(new_news_city_array[key]);
                final_state_array2.unshift(new_news_state_array[key]);
            }
            // console.log(final_titles_array2);
        };

        var initialBind = function() {
            // var t = new Date();

            if (typeof(Storage) !== "undefined") {
                var local_data = localStorage.getItem("data1");
                // var t = new Date();
                // console.log("got data at " + Number(t));
                if (local_data) {
                    if (local_data == "") {
                        // resolve;
                        return;
                    }
                    data_present_in_localStorage = true;
                    var d = JSON.parse(local_data);
                    make_final_array2_from_local(JSON.parse(local_data));
                    // render_function();
                    initial_render(d);
                }
            } else {}
        };

        var initial_render = function(obj) {
            var city_arr = JSON.parse(localStorage.getItem("cities"));
            // console.log(final_city_array2);
            // var t = new Date();
            var feed_id_instance = document.getElementById(feedId);
            // console.log(obj[0]);
            $(feed_id_instance).html("");
            $(feed_id_instance).attr("class", "loaded");
            var i = 0;

            var x = Date.parse(obj[0].time);
            previous_saved_date = obj[0].time;

            for (var key in obj) {
                var y = Date.parse(obj[i].time);
                if (y > x) {
                    previous_saved_date = obj[i].time;
                    x = Date.parse(obj[i].time);
                } else {}
                if (check_match(city_arr, obj[i].city)) {

                    $(feed_id_instance).append(functions.make_div(obj[i].title, obj[i].description, obj[i].imageHref, obj[i].newsHref, obj[i].time));
                }
                i++;
            }
            // var t = new Date();
            // console.log("render complete" + Number(t));
            console.log("previous_saved_date: " + (Number(new Date(previous_saved_date))));
            $("img").unveil();
            $(feed_id_instance).scroll(function() {
                $("img").unveil();
            });
        };

        var make_final_array2_from_local = function(obj) {
            // console.log(obj);
            for (var key in obj) {
                final_titles_array2[key] = obj[key].title;
                final_description_array2[key] = obj[key].description;
                final_imageHref_array2[key] = obj[key].imageHref;
                final_newsHref_array2[key] = obj[key].newsHref;
                final_time_array2[key] = obj[key].time;
                final_priority_array2[key] = obj[key].priority;
                final_city_array2[key] = obj[key].city;
                final_state_array2[key] = obj[key].state;
            }
            // console.log(final_titles_array2);
        };

        var make_checkbox_form2 = function() {
            console.log("inside");
            var checked_items = cities_list;
            var from_local = JSON.parse(localStorage.getItem("cities"));
            var form = document.createElement("form");
            form.setAttribute("class", "form_submit");
            var main_div = document.createElement("div");
            for (var key in checked_items) {
                console.log(checked_items[key]);
                var label = document.createElement("label");
                label.innerHTML = checked_items[key];
                var y = document.createElement("div");
                var x = document.createElement("input");
                x.setAttribute("type", "checkbox");

                if (from_local.indexOf(checked_items[key]) != -1) {
                    x.setAttribute("checked", true);
                } else {}
                y.appendChild(x);
                y.appendChild(label);

                main_div.appendChild(y);
            }
            form.appendChild(main_div);
            var button = document.createElement("button");
            button.appendChild(document.createTextNode("Done"));
            button.setAttribute("class", "done");
            form.appendChild(button);
            return form;
        };

        var make_checkbox_form = function() {
            var checked_items = cities_list;
            var from_local = JSON.parse(localStorage.getItem("cities"));
            var form = document.createElement("form");
            form.setAttribute("id", "form_city");

            for (var key in checked_items) {
                var x = document.createElement("input");
                x.setAttribute("class", "checkbox_class");
                x.setAttribute("type", "checkbox");
                x.setAttribute("name", "cities_list");
                x.setAttribute("value", checked_items[key]);
                if (from_local.indexOf(checked_items[key]) != -1) {
                    x.setAttribute("checked", "checked");
                } else {}

                var label = document.createElement("label");
                label.setAttribute("for", "cities_list");
                label.innerHTML = capitalise_string(checked_items[key]);
                label.appendChild(document.createElement("br"));

                form.appendChild(x);
                form.appendChild(label);
                form.appendChild(document.createElement("br"));
            }


            var span = document.createElement("span");
            span.appendChild(document.createTextNode("Select All"));
            span.setAttribute("style", "font-weight: bold");
            span.setAttribute("class", "select_all");
            form.appendChild(span);

            var span = document.createElement("span");
            span.appendChild(document.createTextNode("Done"));
            span.setAttribute("style", "font-weight: bold");
            span.setAttribute("class", "done");
            form.appendChild(span);
            return form;
        };

        var capitalise_string = function(string) {
            return string.charAt(0).toUpperCase() + string.slice(1);
        };

        var change_city_in_local = function() {
            var arr = [];
            $('#form_city').find(':input').each(function() {
                // console.log($(this).attr("checked"));
                if ($(this).attr("checked") == undefined) {

                } else {
                    arr.push($(this).attr("value"));
                }
            })
            localStorage.setItem("cities", JSON.stringify(arr));
        };

        var select_all_tick = function() {
            // var arr = [];
            $('#form_city').find(':input').each(function() {
                    // console.log($(this).attr("checked"));
                    if ($(this).attr("checked") == undefined) {
                        $(this).attr("checked", true);

                    } else {
                        // arr.push($(this).attr("value"));
                    }
                })
                // localStorage.setItem("cities", JSON.stringify(arr));
        };

        var event_bind = function() {
            var feed_id_instance = document.getElementById(feedId);

            $("img").unveil();
            $(feed_id_instance).scroll(function() {
                $("img").unveil();
            });


            $("#change_city").on("click", function(e) {
                $(feed_id_instance).scrollTop(0);
                $(feed_id_instance).html("");

                var div = document.createElement("div");
                div.setAttribute("class", "select_city");
                var span = document.createElement("span");
                span.setAttribute("style", "font-size: larger;");
                span.appendChild(document.createTextNode("Select city"));

                div.appendChild(span);
                // $(feed_id_instance).append(document.createElement("br"));
                // $(feed_id_instance).append(document.createElement("br"));
                $(feed_id_instance).append(div);;
                // $(feed_id_instance).append(document.createElement("br"));
                // $(feed_id_instance).append(document.createElement("br"));
                $(feed_id_instance).append(make_checkbox_form());
                $("#change_city").hide();
                $(".checkbox_class").on("change", function(event) {

                    // console.log(event.target.attributes.getNamedItem("checked"));
                    if (event.target.attributes.getNamedItem("checked")) {

                        // if (event.target.attributes.getNamedItem("checked").value == "true") {
                        // console.log("a");
                        $(this).removeAttr("checked");
                    } else {
                        // console.log("s");
                        $(this).attr("checked", true);
                    }
                });
                $(".done").on("click", function(event) {
                    $(feed_id_instance).scrollTop(0);
                    $("#change_city").show();
                    console.log("done clicked");
                    change_city_in_local();
                    render_function();
                });

                $(".select_all").on("click", function(event) {
                    select_all_tick();

                });
            });
        };

        var bindForm = function() {
            // initialBind();
            if (localStorage.getItem("cities")) {
                console.log("cities local storage already present");
            } else {
                console.log(cities_list);
                localStorage.setItem("cities", JSON.stringify(cities_list));
            }

            no_of_new_news = 0;
            if (arguments.length > 0) {
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
                if (data_present_in_localStorage == false) {
                    $("#change_city").hide();
                }
                event_bind();
            }

            return new Promise(function(resolve, reject) {

                var head_displayInstance = document.getElementById(head_displayId);
                var feed_id_instance = document.getElementById(feedId);

                var len = input_data.data.length;
                for (var i = 0; i < len; i++) {
                    if (input_data.data[i].type == "mainpage") {
                        crawl_function("mainpage", input_data.data[i].url, input_data.data[i].priority);
                    } else if (input_data.data[i].type == "rss") {
                        crawl_function("rss", input_data.data[i].url, input_data.data[i].priority);
                    } else if (input_data.data[i].type == "") {
                        crawl_function("mainpage", input_data.data[i].url, input_data.data[i].priority);
                    }
                }
                if (background_working == false) {
                    if (data_present_in_localStorage == false) {
                        // console.log("loading");
                        $(feed_id_instance).addClass("loading");
                    }

                    $(".slider_for_new_news").hide();
                } else {
                    console.log(background_working);
                    console.log(promise_array);
                }

                Promise.all(promise_array).then(function() {




                    $("img").unveil();
                    $(feed_id_instance).scroll(function() {
                        $("img").unveil();
                    });


                    promise_array = [];
                    for (var key in single_news_links_array) {
                        crawl_function("single_news", single_news_links_array[key], single_news_priority_array[key]);
                    }
                    Promise.all(promise_array).then(function() {
                        // console.log(background_working);
                        if ((background_working == true) || (data_present_in_localStorage == true)) {

                            console.log("no_of_new_news: " + no_of_new_news);
                            if (no_of_new_news > 0) {
                                // if (1) {
                                previous_saved_date = new_news_time_array[0];

                                console.log("background_working");
                                if ($(feed_id_instance).scrollTop() != 0) {
                                    $(".slider_for_new_news").slideDown();
                                }
                                promise_array = [];
                                move_from_tempo_to_final();
                                // sort_new_news_acc_to_priority();
                                sort_new_news_acc_to_date();

                                for (var key in new_news_titles_array) {
                                    $(feed_id_instance).prepend(functions.make_div(new_news_titles_array[key], new_news_description_array[key], new_news_imageHref_array[key], new_news_newsHref_array[key], new_news_time_array[key]));
                                    crawl_for_imageLink_from_meta(new_news_newsHref_array[key], key);
                                }

                                Promise.all(promise_array).then(function() {
                                    var x = functions.make_data_a_json_object(final_titles_array2, final_description_array2, final_imageHref_array2, final_newsHref_array2, final_time_array2, final_priority_array2, final_city_array2, final_state_array2)
                                    x = JSON.stringify(x);
                                    cleanup_new_news_array();
                                    localStorage.setItem("data1", x);
                                    console.log("local storage changed");
                                    promise_array = [];
                                    resolve("final");
                                });

                                $(".slider_for_new_news").on("click", function() {
                                    $(".slider_for_new_news").slideUp();
                                    $(feed_id_instance).scrollTop(0);
                                });
                            } else {
                                resolve("final");
                            }
                        } else {
                            // console.log(temp_city_array);
                            move_from_temp_to_final();
                            change_dates_same_format();
                            sort_acc_to_priority();
                            sort_acc_to_date();
                            store_data_in_final2();

                            $(feed_id_instance).attr("class", "loaded");
                            $(feed_id_instance).removeClass("loading");

                            render_function();
                            // resolve("final");

                            promise_array = [];
                            for (var key in temp_titles_array) {
                                crawl_for_imageLink_from_meta(temp_newsHref_array[key], key);
                            }
                            Promise.all(promise_array).then(function() {
                                console.log("done");
                                $("#change_city").show();
                                var x = functions.make_data_a_json_object(final_titles_array2, final_description_array2, final_imageHref_array2, final_newsHref_array2, final_time_array2, final_priority_array2, final_city_array2, final_state_array2);
                                x = JSON.stringify(x);
                                localStorage.setItem("data1", x);
                                promise_array = [];
                                resolve("final");
                                event_bind();
                            });
                        }
                    });
                });
            });
        };

        return {
            initialBind: initialBind,
            bindForm: bindForm
        };

    })(window.document);

    window.app = app;
})(window);