var min = 2;
var max = 11;
var colors = ['#000000','#ffffff','#000060','#ff6657','#00800f','#dd7500','#1000b0','#7020a0','#c00020','#b040a0','#808080'];
var invcolors = ['#ffffff','#000000','#ffffbf','#0088a8','#ff7ff0','#009aff','#ffff7f','#4f2fcf','#2fbfdf','#4fbf5f','#000000'];

var m = 11;
var gridSize = 40;  // approximate number of squares across and down
var transitionTime = 1000;
var rows = 0;

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
    var oldRows = rows;
    m = (m + off - min)%((max-min)+1) + min;
    if (m < min) {
        m += (max-min)+1;
    }
    var patches = Math.floor(gridSize/(2*m));
    rows = patches * m + 1;
    d3.select("#quilt")
        .transition()
        .duration(transitionTime)
        .attr("viewBox", -(gridSize+1)/2 + " " + -(gridSize+1)/2 
                          + " " + (gridSize+1) + " " + (gridSize+1));
        
    for (var y = 0;  y < Math.max(rows, oldRows); y++) {
        data = []
        if (y < rows) {
            for (var x = 0; x < rows; x++) {
                data.push({x:x, y:y, color: x * y % m})
                data.push({x:x, y:-y, color: x * y % m})
                data.push({x:-x, y:y, color: x * y % m})
                data.push({x:-x, y:-y, color: x * y % m})
            }
        }
        rects = d3.select("#quilt").selectAll("rect.row"+y)
            .data(data);
        rects.enter()
            .append("rect")
            .attr("class", "row"+y)
            .style("opacity",0);
//             .attr("x", function(d) { return 4*d.x })
//             .attr("y", function(d) { return 4*d.y });
        rects.transition()
            .duration(transitionTime)
            .attr("x",function(d) { return d.x-.5; })
            .attr("y", function(d) { return d.y-.5; })
            .attr("width", 1)
            .attr("height", 1)
            .style("opacity",1)
            .style("fill", function(d) { return colors[d.color] });    
        rects.exit()
            .transition()
            .duration(transitionTime)
//             .attr("x", function(d) { return 4*d.x; })
//             .attr("y", function(d) { return 4*d.y; })
            .style("opacity",0)
            .remove();
    }
    
    
    
    var modtext = document.getElementById("modulus");
    modtext.innerHTML = m;
}
    
document.onkeypress = function(k) {

}