(function(window) {
    var functions = (function(document) {

        var words_to_check_for_news = config.words_to_check;

        var check_for_words = function(str) {
            // console.log(str);
            str = str.toLowerCase(str);
            for (var key in words_to_check_for_news) {
                if (str.indexOf(words_to_check_for_news[key]) != -1) {
                    return 1;
                }
            }
            return 0;
        };

        var remove_punchuations = function(str) {
            str = str.replace(/\s+/g, '');
            str = str.replace(/\'/g, "");
            str = str.replace(/\"/g, "");
            str = str.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "");
            str = str.replace(/\?/g, "");
            return str;

        }

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

        var make_div = function(title, description_of_news, image_href, news_href, news_feed_time) {
            if (image_href == "meta") {
                image_href = "image/images2.jpg";
            }

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
            var str = title;
            str = remove_punchuations(str);

            main_div.setAttribute("class", str);

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
            var changed_time_type = change_time_type_fn(news_feed_time);
            var text = document.createTextNode(changed_time_type);
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
        var change_time_type_fn = function(input_time) {
            //return a string with ago;
            var ans;
            var d = new Date();
            d = Number(d);
            var d2 = Date.parse(input_time);
            var diff = d - d2;
            diff = parseInt((diff / 1000) / 60);
            if (diff < 60) {
                ans = diff + " min ago";
            } else if (diff >= 60 && diff < 1440) {
                var min = diff % 60;
                diff = parseInt(diff / 60);
                // ans = diff + " hours " + min + "min ago";
                ans = diff + " hours ago";
            } else if (diff >= 1440 && diff < 43200) {
                var days = parseInt((diff / 60) / 24);
                // console.log(input_time);
                ans = days + " days ago";
            } else {
                ans = input_time;
            }

            return ans;

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

        var ajax_call_function = function(url) {
            return new Promise(function(resolve, reject) {
                $.ajax({
                    url: url
                }).done(function(data) {
                    // console.log(url);
                    // console.log(data);
                    // console.log(data);
                    resolve(data);
                }).fail(function(err) {
                    // console.log(err);
                    // reject(err);
                    resolve("err");
                });
            });
        };

        var get_city_of_news_from_details = function() {
            return "global";

        };

        var get_state_of_news_from_details = function() {
            return "global";
        };

        return {
            check_for_words: check_for_words,
            find_image_href_from_description: find_image_href_from_description,
            make_div: make_div,
            prepare_link: prepare_link,
            ajax_call_function: ajax_call_function,
            remove_punchuations: remove_punchuations,
            get_city_of_news_from_details: get_city_of_news_from_details,
            get_state_of_news_from_details: get_state_of_news_from_details
        };

    })(window.document);

    window.functions = functions;
})(window);
