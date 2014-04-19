var min = 2;
var max = 11;
var colors = ['#000000','#ffffff','#000040','#ff7757','#00800f','#ff6500','#000080','#b0d030','#d04020','#b040a0','#808080'];
var invcolors = ['#ffffff','#000000','#ffffbf','#0088a8','#ff7ff0','#009aff','#ffff7f','#4f2fcf','#2fbfdf','#4fbf5f','#000000'];

var m = max;

var newshadow = function(c,pix,blur) {
    var ret = '';
    for (var i = -pix; i <= pix; i+= pix) {
        for (var j = -pix; j <= pix; j+= pix) {
            ret += c + " " + i + "px " + j + "px " + blur + "px, ";
        }
    }
    return ret + "0px 0px";
}

var trigger = function(off) {
    m = (m + off - min)%((max-min)+1) + min;
    if (m < min) {
        m += (max-min)+1;
    }
    document.body.style.backgroundImage = "url(modquilt-" + m + ".png)";
    document.body.style.backgroundPosition = "50% 50%";
    var modtext = document.getElementById("modulus");
    modtext.innerHTML = m;
    //  modtext.style.color = colors[m];
    //  modtext.style.textShadow = newshadow(invcolors[m],2,1);
}

document.onkeypress = function(k) {

}