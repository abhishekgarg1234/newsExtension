var globals = null;
var global_click_count = 0;
var check = 1;


// $("#cl").on("click", function() {
//     global_click_count++;
//     var tt = $("#feed").children();
//     $(tt[global_click_count]).attr("class", "feeds show");
// });
$(document).ready(function() {

    $("#cl1").on("click", function() {
        global_click_count--;
        if (global_click_count < 0) {
            global_click_count = 0;
        }
        var tt = $("#feed").children();
        var temp = 0;
        for (var key in tt) {
            if (temp == global_click_count) {
                $(tt[global_click_count]).attr("class", "feeds show");
                $(tt[temp]).show();
            } else {
                $(tt[global_click_count]).attr("class", "feeds hide");
                $(tt[temp]).hide();
            }
            temp++;
        }
        // $(tt[global_click_count]).attr("class", "feeds show");

    });
    $("#cl2").on("click", function() {
        global_click_count++;
        var tt = $("#feed").children();

        var temp = 0;
        for (var key in tt) {

            if (temp == global_click_count) {
                $(tt[global_click_count]).attr("class", "feeds show");
                $(tt[temp]).show();
            } else {
                $(tt[global_click_count]).attr("class", "feeds hide");
                $(tt[temp]).hide();
            }
            temp++;
        }

        // $(tt[global_click_count]).attr("class", "feeds show");
        // $(tt[global_click_count]).show();
    });


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

    $("#head_data").append(head_data());


    var setLocalStorageItems = function() {
        if (typeof(Storage) !== "undefined") {
            if (!localStorage.getItem("news")) {
                localStorage.setItem("news", '{"count":"2","data":["http://www.hindustantimes.com/","http://timesofindia.indiatimes.com/"]}');
            }
        } else {}
    };
    setLocalStorageItems();

    // function requestCrossDomain(site, callback) {
    function requestCrossDomain(site) {
        var link_array = [];
        var _site = site;
        // console.log("start   " + _site);
        if (!site) {
            alert('No site was passed.');
            return false;
        }
        var yql = 'http://query.yahooapis.com/v1/public/yql?q=' + encodeURIComponent('select * from html where url="' + _site + '"') + '&format=json';

        function json_traverse(o) {
            var type = typeof o;
            if (type == "object") {
                for (var key in o) {
                    // console.log("key: ", key);
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
                    // console.log("key: ", key);
                    var t = key.toLowerCase();
                    // if ((t == "content") || t == "title") {
                    if (t == "title") {
                        // console.log(t);
                        // console.log(o[key]);
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
                    // console.log("key: ", key);
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

        $.ajax({
            url: yql
        }).done(function(data) {

            globals = data;
            json_traverse(globals.query.results.body);
            var count = 0;
            for (var key in link_array) {
                var temp = JSON.stringify(link_array[key]);
                var temp2 = temp.toLowerCase();
                // if ((temp2.indexOf("xiaomi") != -1) || (temp2.indexOf("railway") != -1)) {
                if ((temp2.indexOf("sanjay dutt") != -1)) {
                    // console.log(link_array[key]);
                    var div = document.createElement("div");


                    var a = document.createElement("a");
                    var xxx;
                    // console.log(typeof(link_array[key]));
                    xxx = traverse_for_href(link_array[key]);
                    // console.log(xxx);
                    if ($.isArray(link_array[key].a)) {
                        // console.log("array");
                        xxx = link_array[key].a[0].href;
                    } else {
                        // console.log("not an array");
                        xxx = link_array[key].a.href;
                    }
                    var cc = xxx;
                    if (cc != undefined) {
                        if (cc.indexOf(_site) != -1) {

                        } else {
                            cc = _site + cc;
                        }
                        a.setAttribute("href", cc);

                        var get_title = traverse_for_title(link_array[key].a);
                        // console.log(get_content);
                        var text = document.createTextNode(get_title);
                        a.appendChild(text);
                        div.appendChild(a);

                        // if (link_array[key].a.content != undefined) {
                        if (get_title != undefined) {
                            if (check == 1) {
                                // console.log(check);
                                div.setAttribute("class", "feeds show");
                                check = 2;
                            } else {
                                // console.log(check);
                                div.setAttribute("class", "feeds hide");
                            }
                            // console.log(link_array[key]);
                            $("#feed").append(div);
                        }
                    }
                }
            }

            $(".hide").hide();
            $(".show").show();

        }).fail(function(err) {
            console.log(err)
        });
    }






    var x = JSON.parse(localStorage.getItem("news"));
    var c = x.count;
    for (var i = 0; i < c; i++) {
        requestCrossDomain(x.data[i]);
    }

});
