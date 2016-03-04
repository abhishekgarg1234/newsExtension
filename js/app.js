(function(window) {
    var app = (function(document) {

        var head_displayId, feedId;

        var set_head_displayId = function(set_head_display) {
            head_displayId = set_head_display;
        };
        var set_feedId = function(set_feedId) {
            feedId = set_feedId;
        };

        var words_to_check = ["sanjay", "smriti", "jaitley", "budget", "found"];
        var head_links_array = [];
        var head_metaTags_array = [];
        var anchorTags_array = [];

        var final_titles_array = [];
        var final_description_array = [];
        var final_imageHref_array = [];
        var final_newsHref_array = [];
        var final_time_array = [];
        var is_rss_link = 0;


        var promise_array = [];

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

        var make_head_links_array = function(obj) {
            for (var key in obj) {
                head_links_array.push(obj[key]);
            }
        };

        var make_head_meatTags_array = function(obj) {
            for (var key in obj) {
                head_metaTags_array.push(obj[key]);
            }
        };

        var check_for_words = function(x) {
            x = x.toLowerCase(x);
            for (var key in words_to_check) {
                if (x.indexOf(words_to_check[key]) != -1) {
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

        var find_image_href = function() {};

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

            // console.log(description_of_news);
            if (((description_of_news == "")) || (description_of_news == undefined)) {
                description_of_news = title;
            }
            var main_div = document.createElement("div");
            main_div.setAttribute("class", "news_feed_div");



            var right_div = document.createElement("div");
            right_div.setAttribute("class", "news_feed");

            var title_div = document.createElement("div");
            title_div.setAttribute("class", "news_feed_title_div");
            var anchor = document.createElement("a");
            anchor.setAttribute("href", news_href);
            anchor.setAttribute("class", "news_feed_anchor_tag");
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

            var description_div = document.createElement("div");
            description_div.setAttribute("class", "news_feed_description_div");
            description_div.innerHTML = description_of_news;



            var left_div = document.createElement("div");
            left_div.setAttribute("class", "news_feed");

            var image_div = document.createElement("div");
            image_div.setAttribute("class", "news_feed_image_div");
            var image = document.createElement("img");

            // image.setAttribute("src", image_href);
            image.setAttribute("src", "image/images2.jpg");
            image.setAttribute("alt", "Image not available");
            image.setAttribute("style", "width:90px;height:90px;");
            image_div.appendChild(image);

            left_div.appendChild(image_div);






            var time_div = document.createElement("div");
            time_div.setAttribute("class", "news_feed_time_div");
            var time_span = document.createElement("span");
            var text = document.createTextNode(news_feed_time);
            time_span.appendChild(text);
            time_div.appendChild(time_span);



            right_div.appendChild(title_div);
            right_div.appendChild(description_div);
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
        }

        var have_rssLink = function(data) {

            // var type = typeof data;
            // var body_data = data;
            // if (type == "object") {

            // }
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
                                // break;

                                return body_data[key];
                            }
                        } else {
                            have_rssLink(body_data[key]);
                        }

                    }
                } else {}
            }
        };

        var crawl_mainPage_function = function(_site, data) {
            // console.log(data);
            var global_full_news_data = data;
            is_rss_link = 0;
            // var temp_rss_link = have_rssLink(global_full_news_data.query.results.body);
            // if (is_rss_link == 1) {
            if (0) {
                //     console.log("rss traverse");
                //     console.log(temp_rss_link);
                //     crawl_function(2, temp_rss_link);


                // select * from rss where url = "http://www.thehindu.com/news/?service=rss"

            } else {
                console.log(global_full_news_data);
                json_traverse(global_full_news_data.query.results.body);
                var count = 0;
                for (var key in anchorTags_array) {
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
                                // console.log(_singleNewsPageLink);
                                _singleNewsPageLink = _site + _singleNewsPageLink;
                                // console.log(_singleNewsPageLink);
                            }
                            var get_title = traversing_function(anchorTags_array[key].a, "title");
                            if (get_title != undefined) {


                                // var pro = new Promise(function(resolve, reject) {

                                // $.(crawl_function("single_news", _singleNewsPageLink)).done(resolve("aa"));

                                // function fir(){
                                //     var deff=$.Deferred();
                                crawl_function("single_news", _singleNewsPageLink);
                                //      console.log("Aaaa");
                                //      deff.resolve("done");
                                //     return deff.promise();
                                // };
                                // function sec(){
                                //     var promise=fir();
                                //     console.log(promise);
                                //     promise.then(function(result){
                                //         console.log("sone");
                                //     });
                                // };

                                // sec();

                                // resolve("aa");
                                // });
                                // console.log(pro);
                                // promise_array.push(pro);
                                // crawl_function(0, _singleNewsPageLink);
                            }
                        }
                    }
                }
            }
        };

        var crawl_single_news_page_function = function(_site, data) {
            console.log("crawl_single_news_page_function");
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
            var news_feed_time = find_news_feed_time2();
            var dd = check_for_words(set_title);
            if (dd) {
                push_news_data(set_title, set_description, set_image_href, set_news_href, news_feed_time);
                return 1;
                // $(feed_id_instance).append(make_div(set_title, set_description, set_image_href, set_news_href, news_feed_time));
            }
        };

        var crawl_rss_feed_link_function = function(_site, data) {
            console.log("crawl_rss_feed_link_function");
            var feed_id_instance = document.getElementById(feedId);
            if (data.query.results == null) {
                return;
            }
            for (var i = 0; i < data.query.results.item.length; i++) {
                var temp = data.query.results.item[i].title.toLowerCase();
                if (check_for_words(temp)) {
                    var set_title = data.query.results.item[i].title;
                    var set_description = data.query.results.item[i].description;
                    var set_image_href = "";
                    var set_news_href = data.query.results.item[i].link;
                    var news_feed_time = data.query.results.item[i].pubDate;

                    push_news_data(set_title, set_description, set_image_href, set_news_href, news_feed_time);
                    // $(feed_id_instance).append(make_div(set_title, set_description, set_image_href, set_news_href, news_feed_time));
                }


            }
        };

        var push_news_data = function(set_title, set_description, set_image_href, set_news_href, news_feed_time) {
            console.log("pushed data");
            final_titles_array.push(set_title);
            final_description_array.push(set_description);
            final_imageHref_array.push(set_image_href);
            final_newsHref_array.push(set_news_href);
            final_time_array.push(news_feed_time);
        }

        var render_function = function() {
            console.log("render_function called");
            var feed_id_instance = document.getElementById(feedId);
            var i = 0;
            for (var key in final_titles_array) {
                $(feed_id_instance).append(make_div(final_titles_array[i], final_description_array[i], final_imageHref_array[i], final_newsHref_array[i], final_time_array[i]));
                // $(feed_id_instance).append(make_div(set_title, set_description, set_image_href, set_news_href, news_feed_time));
                i++;
            }
        }

        var prepare_link = function(_site, format) {
            if (format == "mainpage") {
                // console.log("html entered");
                var yql = 'http://query.yahooapis.com/v1/public/yql?q=' + encodeURIComponent('select * from html where url="' + _site + '"') + '&format=json';
                // console.log(yql);
                return yql;
            } else if (format == "rss") {
                // console.log("rss entered");
                var yql = 'http://query.yahooapis.com/v1/public/yql?q=' + encodeURIComponent('select * from rss where url="' + _site + ' "') + '&format=json';
                // console.log(yql);
                return yql;
            } else if (format == "single_news") {
                // console.log("html entered");
                var yql = 'http://query.yahooapis.com/v1/public/yql?q=' + encodeURIComponent('select * from html where url="' + _site + '"  and xpath="/html/head/*"  ') + '&format=json';
                // console.log(yql);
                return yql;
            }
        }

        var crawl_function = function(format, site) {
            // return new Promise(function(resolve,reject) {

            if (format == "single_news") {
                // console.log("wwww");
            }
            var _site = site;
            console.log(_site);
            if (!site) {
                alert('No site was passed.');
                return false;
            }
            // if (main_link_page == 1) {
            if (format == "mainpage") {
                // console.log("mainpage entered");
                anchorTags_array = [];
                var yql = prepare_link(_site, format);
                // console.log("returned: " + yql);
                // var yql = 'http://query.yahooapis.com/v1/public/yql?q=' + encodeURIComponent('select * from html where url="' + _site + '"') + '&format=json';
                ajax_call_function(yql, format, _site);
                // ajax_call_function(yql, format, _site).then(function(response) {
                //     return;
                // })

                // } else if (main_link_page == 2) {
            } else if (format == "rss") {
                // console.log(_site);
                // console.log("rss entered");
                var yql = prepare_link(_site, "rss");
                // var yql = 'http://query.yahooapis.com/v1/public/yql?q=' + encodeURIComponent('select * from rss where url="' + _site + ' "') + '&format=json';
                // console.log("returned: " + yql);
                ajax_call_function(yql, format, _site);
                // ajax_call_function(yql, format, _site).then(function(response) {
                //     return;
                // })
            } else if (format == "single_news") {
                // console.log("singlr news");
                // console.log(_site);
                console.log("single news entered");
                head_links_array = [];
                head_metaTags_array = [];
                var yql = prepare_link(_site, format);
                // console.log("returned: " + yql);
                // var yql = 'http://query.yahooapis.com/v1/public/yql?q=' + encodeURIComponent('select * from html where url="' + _site + '"  and xpath="/html/head/*"  ') + '&format=json';
                ajax_call_function(yql, format, _site).then(function(data){
                    crawl_single_news_page_function(_site, data);
                });

                // ajax_call_function(yql, format, _site).then(function(response) {
                //     return;
                // })


            }

            // });
        };

        var ajax_call_function = function(yql, format, _site) {
            console.log("a");
            // return new Promise(function(resolve, reject) {



            // var pro = new promise(resolve, reject) {


            var pro = new Promise(function(resolve, reject) {
                $.ajax({
                    url: yql
                }).success(function(data,str,xhr) {
                    // if (main_link_page == 1) {
                    if (format == "mainpage") {
                        console.log("mainpage");
                        crawl_mainPage_function(_site, data);
                        resolve(_site);
                        // } else if (main_link_page == 2) {
                    } else if (format == "rss") {
                        crawl_rss_feed_link_function(_site, data);
                        resolve(_site);
                    } else if (format == "single_news") {
                        console.log("single news");
                        // console.log(data);
                        // var s = new Promise(function(response, reject) {
                        // crawl_single_news_page_function(_site, data);


                        // (function(_site, data) {
                        //     crawl_single_news_page_function(_site, data);
                        //     resolve();
                        // })(_site, data);

                        
                        resolve(data);

                        // function fir() {
                        //     var deff = $.Deferred();
                        //     var fir_return = crawl_single_news_page_function(_site, data);
                        //     console.log("fir_return=: " + fir_return);
                        //     console.log("Aaaa");
                        //     if (fir_return == 1) {
                        //         deff.resolve("done");
                        //         return deff.promise();
                        //     }
                        // };

                        // function sec() {
                        //     var promise = fir();
                        //     // console.log(x);
                        //     console.log(promise);
                        //     promise.then(function(result) {
                        //         console.log("sone");
                        //     });
                        // };
                        // sec(); // });
                        // promise_array.push(s);

                    } else {}



                    // console.log(pro);

                    // promise_array.push(pro);


                }).fail(function(err) {
                    console.log(yql);
                    console.log(err);
                    // ajax_call_function(yql,main_link_page,_site);
                });

            });
            console.log(pro);

            promise_array.push(pro);

            return pro;
            // resolve("ajax_call_function_resolve");
            // });



            // console.log(ajax_call);

            // promise_array.push(ajax_call);
        }

        var bindForm = function() {

            var head_displayInstance = document.getElementById(head_displayId);
            var feed_id_instance = document.getElementById(feedId);

            $(head_displayInstance).append(head_display());

            setLocalStorageItems();
            var x = JSON.parse(localStorage.getItem("news"));
            var c = x.count;



            for (var i = 0; i < c; i++) {

                if (x.data[i].type == "mainpage") {
                    // console.log(x.data[i].url);
                    crawl_function("mainpage", x.data[i].url);
                    // crawl_function("mainpage", x.data[i].url).then(function(response){
                    //     continue;
                    // });
                } else if (x.data[i].type == "rss") {
                    crawl_function("rss", x.data[i].url);
                    // crawl_function("rss", x.data[i].url).then(function(response){
                    //    continue;
                    // });
                }
            }

            // $.when(promise_array).then(function() {
            //     console.log(promise_array);
            //     console.log(final_titles_array);
            //     render_function();
            // });

            Promise.all(promise_array).then(function() {
                console.log(promise_array);
                console.log(final_titles_array);
                render_function();
            });

            // render_function();
            //         }

            // function xx() {crawl_rss_feed_link_function
            //     return new Promise(function(resolve, reject) {
            //         for (var i = 0; i < c; i++) {

            //             if (x.data[i].type == "mainpage") {
            //                 // console.log(x.data[i].url);
            //                 crawl_function("mainpage", x.data[i].url);
            //             } else if (x.data[i].type == "rss") {
            //                 crawl_function("rss", x.data[i].url);
            //             }
            //         }
            //     });
            // }

            // xx().then(function(response) {
            //     console.log("response");
            //     render_function();
            // });

            // if (window.Promise) {
            //     console.log("promise found");
            //     var promise = new Promise(function(resolve, reject) {


            // for (var i = 0; i < c; i++) {
            //     if (x.data[i].type == "mainpage") {
            //         // console.log(x.data[i].url);
            //         crawl_function("mainpage", x.data[i].url);
            //     } else if (x.data[i].type == "rss") {
            //         crawl_function("rss", x.data[i].url);
            //     }
            // }
            //         // resolve("loop completed");

            //         if (i==c) {
            //             resolve("Stuff worked!");
            //         } else {
            //             reject(Error("It broke"));
            //         }
            //     });
            // }
            // var x = JSON.parse(localStorage.getItem("news"));
            // var c = x.count;
            // // console.log("count: " + c);
            // for (var i = 0; i < c; i++) {
            //     if (x.data[i].type == "mainpage") {
            //         // console.log(x.data[i].url);
            //         crawl_function("mainpage", x.data[i].url);
            //     } else if (x.data[i].type == "rss") {
            //         crawl_function("rss", x.data[i].url);
            //     }
            // }

            // promise.then(function() {
            //     render_function();
            // });


            // promise.then(function(result) {
            //     render_function();
            //     // console.log(result); // "Stuff worked!"
            // }, function(err) {
            //     console.log(err); // Error: "It broke"
            // });
        };

        return {
            set_head_displayId: set_head_displayId,
            set_feedId: set_feedId,
            bindForm: bindForm
        };

    })(window.document);

    window.app = app;
})(window);
