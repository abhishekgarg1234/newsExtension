var percentage_of_match = function(str1, str2) {
    str1 = str1.toLowerCase();
    str2 = str2.toLowerCase();

    var ar1 = str1.split(" ");
    var ar2 = str2.aplit(" ");
    var n1 = 0;
    var n1_length = sr1.length;
    var n2 = 0;
    var n2_length = ar2.length;
    for (var key in ar1) {
        for (var key2 in ar2) {
            if (ar1[key] == ar2[key2]) {
                n1++;
                break;
            }
        }
    }


    var ans1 = (n1 / n1_length) * 100;
    for (var key in ar2) {
        for (var key2 in ar1) {
            if (ar1[key2] == ar2[key]) {
                n2++;
                break;
            }
        }
    }
    var ans2 = (n2 / n2_length) * 100;

}
