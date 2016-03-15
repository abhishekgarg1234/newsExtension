(function(window) {
    var app = (function(document) {

        var head_displayId = config.head_displayId,
            feedId = config.feedId;
        // view_nextId = config.view_next,
        // view_prevId = config.view_next;
        var background_working = false;
        //data from configs
        var click_count = 0;

        var input_data = config.input_data2,
            words_to_check_for_news = config.words_to_check,
            max_news_per_site = config.max_news_per_site,
            number_of_news_in_single_page = config.number_of_news_in_single_page;

        var head_links_array = [],
            head_metaTags_array = [],
            anchorTags_array = [];

        var final_titles_array = [],
            final_description_array = [],
            final_newsHref_array = [],
            final_imageHref_array = [],
            final_time_array = [],
            final_priority_array = [];

        var final_titles_array2 = [],
            final_description_array2 = [],
            final_newsHref_array2 = [],
            final_imageHref_array2 = [],
            final_time_array2 = [],
            final_priority_array2 = [];

        var temp_titles_array = [],
            temp_description_array = [],
            temp_newsHref_array = [],
            temp_imageHref_array = [],
            temp_time_array = [],
            temp_priority_array = [];


        var prev_date = null,
            number_of_news = 0;

        var promise_array = [],
            single_news_priority_array = [],
            single_news_links_array = [],
            single_news_image_array = [];

        var previous_saved_date;

        var make_head_links_array = function(obj) {
            head_links_array = [];
            for (var key in obj) {
                head_links_array.push(obj[key]);
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

                    // var set_image_href = find_image_href_from_description(data.query.results.item[i].description);
                    var set_image_href = "image/images2.jpg";
                    var html2 = /(<([^>]+)>)/gi;
                    set_description = set_description.replace(html2, '');
                    var set_news_href = data.query.results.item[i].link;
                    var news_feed_time = data.query.results.item[i].pubDate;
                    if (set_image_href == "image/images2.jpg") {
                        push_news_data_temp(set_title, set_description, set_image_href, set_news_href, news_feed_time, priority);
                    } else {
                        push_news_data(set_title, set_description, set_image_href, set_news_href, news_feed_time, priority);
                    }
                    // }

                    // $(feed_id_instance).append(make_div(set_title, set_description, set_image_href, set_news_href, news_feed_time));

                    // single_news_links_array.push(data.query.results.item[i].link);
                    // single_news_priority_array.push(priority);
                }
            }
        }

        var push_news_data = function(set_title, set_description, set_image_href, set_news_href, news_feed_time, priority) {
            console.log("pushed data");
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

        var push_news_data_temp = function(set_title, set_description, set_image_href, set_news_href, news_feed_time, priority) {
            if ((temp_titles_array.indexOf(set_title) != -1)) {
                return;
            }
            temp_titles_array.push(set_title);
            temp_description_array.push(set_description);
            temp_imageHref_array.push("meta");
            temp_newsHref_array.push(set_news_href);
            temp_time_array.push(news_feed_time);
            temp_priority_array.push(priority);

            number_of_news++;
        };

        var render_function2 = function() {
            var feed_id_instance = document.getElementById(feedId);
            previous_saved_date = final_time_array[0];
            console.log("render_function called");
            var i = 0;
            // $(feed_id_instance).html("");
            for (var key in final_titles_array) {
                $(feed_id_instance).append(functions.make_div(final_titles_array[i], final_description_array[i], final_imageHref_array[i], final_newsHref_array[i], final_time_array[i]));
                i++;
            }
        };
        var store_data_in_final2 = function() {
            for (var key in final_titles_array) {
                final_titles_array2.push(final_titles_array[key]);
                final_time_array2.push(final_time_array[key]);
                final_priority_array2.push(final_priority_array[key]);
                final_imageHref_array2.push(final_imageHref_array[key]);
                final_description_array2.push(final_description_array[key]);
                final_newsHref_array2.push(final_newsHref_array[key]);
            }
        };

        var cleanup_array2 = function() {
            final_titles_array2 = [];
            final_time_array2 = [];
            final_priority_array2 = [];
            final_imageHref_array2 = [];
            final_description_array2 = [];
            final_newsHref_array2 = [];
        };

        var render_function = function() {
            console.log("render_function called");
            previous_saved_date = final_time_array[0];
            var start = click_count * number_of_news_in_single_page;
            var end = start + 10;
            if (end > number_of_news) {
                end = number_of_news;
            }
            console.log(start);
            console.log(end);
            render_part(start, end);
        };

        var render_part = function(start, end) {
            console.log("render part called");
            var feed_id_instance = document.getElementById(feedId);
            $(feed_id_instance).html("");
            for (var i = start; i < end; i++)
                $(feed_id_instance).append(functions.make_div(final_titles_array2[i], final_description_array2[i], final_imageHref_array2[i], final_newsHref_array2[i], final_time_array2[i]));
            i++;
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
                if (data == "err") {} else {
                    after_ajax_call_function(format, _site, data, priority);
                }
            }))
        };

        var temp_crawl2 = function(format, _site, priority) {
            var yql = functions.prepare_link(_site, format);

            promise_array.push(
                new Promise(function(resolve, reject) {
                    functions.ajax_call_function(yql).then(function(data) {
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

        var change_dates_same_format = function() {
            var n = number_of_news;
            for (i = 0; i < n; i++) {
                var d = new Date.parse(final_time_array[i]);
                final_time_array[i] = d.toString();
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

        var crawl_for_imageLink_from_meta = function(link, key) {
            var yql = functions.prepare_link(link, "single_news");
            promise_array.push(functions.ajax_call_function(yql).then(function(data) {
                if (data == "err") {} else {
                    var img = crawl_single_news_page_function_for_imageOnly(data);
                    temp_imageHref_array[key] = img;
                }
            }))
        };

        var sort_acc_to_priority = function() {
            var n = number_of_news;
            var c, d;
            for (var key in final_priority_array) {}
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

            for (var key in final_priority_array) {}
        };

        var move_from_temp_to_final = function() {
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
            }
        };

        var maintain_next_prev = function() {
            $(".show").show();
            $(".hide").hide();
        };
        maintain_next_prev();

        var bindForm = function() {
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
                // background_working = false;
            }

            return new Promise(function(resolve, reject) {

                var head_displayInstance = document.getElementById(head_displayId);
                var feed_id_instance = document.getElementById(feedId);
                // var view_nextInstance=document.getElementById(view_nextId);
                // var view_prevInstance=document.getElementById(view_prevId);

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
                    $(feed_id_instance).addClass("loading");
                    $(".slider_for_new_news").slideUp();
                } else {
                    console.log(background_working);
                }
                Promise.all(promise_array).then(function() {

                    promise_array = [];
                    for (var key in temp_titles_array) {
                        crawl_for_imageLink_from_meta(temp_newsHref_array[key], key);
                    }
                    Promise.all(promise_array).then(function() {
                        promise_array = [];
                        for (var key in single_news_links_array) {
                            crawl_function("single_news", single_news_links_array[key], single_news_priority_array[key]);
                        }
                        Promise.all(promise_array).then(function() {
                            $(feed_id_instance).attr("class", "loaded");
                            $(feed_id_instance).removeClass("loading");

                            move_from_temp_to_final();
                            change_dates_same_format();
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
                                        click_count = 0;
                                        maintain_next_prev();
                                        cleanup_array2();
                                        store_data_in_final2();
                                        render_function();
                                    });
                                }
                                resolve("final");
                            } else {
                                store_data_in_final2();
                                render_function();
                                $("#view_next").removeClass("hide").addClass("show");
                                maintain_next_prev();

                                $("#view_next").on("click", function() {
                                    click_count++;
                                    if (click_count <= 0) {
                                        $("#view_prev").addClass("hide");
                                        click_count = 0;
                                    } else {
                                        console.log("A");
                                        $("#view_prev").removeClass("hide").addClass("show");
                                    }
                                    var start = click_count * number_of_news_in_single_page;
                                    var end = start + 10;
                                    if (end > number_of_news) {
                                        $("#view_next").addClass("hide");
                                        end = number_of_news;
                                    } else {
                                        $("#view_next").removeClass("hide");
                                    }
                                    console.log(start);
                                    console.log(end);
                                    render_part(start, end);
                                    maintain_next_prev();
                                });
                                $("#view_prev").on("click", function() {
                                    click_count--;
                                    if (click_count <= 0) {
                                        $("#view_prev").addClass("hide");
                                        click_count = 0;
                                    } else {
                                        $("#view_prev").removeClass("hide").addClass("show");
                                    }
                                    var start = click_count * number_of_news_in_single_page;
                                    var end = start + 10;
                                    if (end > number_of_news) {
                                        $("#view_next").addClass("hide");
                                        end = number_of_news;
                                    } else {
                                        $("#view_next").removeClass("hide").addClass("show");
                                    }
                                    render_part(start, end);
                                    maintain_next_prev();
                                });
                                resolve("final");
                            }
                        });
                    });
                });
            });
        };

        return {
            bindForm: bindForm
        };

    })(window.document);

    window.app = app;
})(window);
