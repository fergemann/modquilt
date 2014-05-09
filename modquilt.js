/* global document, window, d3, NT */
/* exported chooseOperator, trigger */
var min = 2;
var max = 11;
var colors = ['#000000','#ffffff','#000060','#ff6657','#00800f','#dd7500',
              '#1000b0','#7020a0','#c00020','#b040a0','#ddcc00'];
colors[NaN] = '#808080';

var m = 10;
var gridSize = 46;  // approximate number of squares across and down
var transitionTime = 500;
var rows = 0;
var operators = {
    "+": function(a, b, m) { return NT.mod(a+b, m); },
    "*": function(a, b, m) { return NT.mod(a*b, m); },
    "^": function(a, b, m) { return NT.powMod(a, b, m); }
};

var operator = "*";

var squareDivHtml = function(a, b, m) {
    switch(operator) {
        case "+":
            return a + " + " + b + " &equiv; " + 
                   operators["+"](a,b,m) + " mod " + m;
        case "*":
            return a + " &times; " + b + " &equiv; " + 
                   operators["*"](a,b,m) + " mod " + m;
        case "^":
            var c = operators["^"](a,b,m);
            var aParen = (a < 0) ? '('+a+')' : a;
            if (isNaN(c)) {
                return aParen + '<sup>' + b  + '</sup> is undefined mod ' + m;
            } else {
                return aParen + '<sup>' + b + '</sup> &equiv; ' + 
                       c + " mod " + m;
            }
    }
};

var makeKey = function() {
    var numbers = []
    for (var i = 0; i < m; i++) {
        numbers[i] = i;
    }
    var lis = d3.select("#key").selectAll("li").data(numbers);
    lis.enter()
        .append("li")
        .html(function(d) { 
            return '<div class="keyBox" style="background: ' + colors[d] + 
                   '"></div>' + '<div class="keyNum">' + d + '</class>';
        });
    lis.exit()
        .remove();
}

var chooseOperator = function(op) {
    operator = op;
    trigger(0);
};

var trigger = function(off) {
    d3.selectAll(".selectedOperator").classed("selectedOperator", false);
    var buttonIds = {"+":"#plusButton", 
                     "*":"#timesButton", 
                     "^":"#powerButton"};
    d3.select(buttonIds[operator]).classed("selectedOperator", true);
    var oldRows = rows;
    m = (m + off - min)%((max-min)+1) + min;
    if (m < min) {
        m += (max-min)+1;
    }
    makeKey();
    var patches = Math.floor(gridSize/(2*m));
    rows = patches * m + 1;
    d3.select("#quilt")
        .transition()
        .duration(transitionTime)
        .attr("viewBox", -(gridSize+1)/2 + " " + -(gridSize+1)/2 +
                         " " + (gridSize+1) + " " + (gridSize+1));
    var infoDiv = d3.select("#squareInfo");
    
    var getXCoord = function(d) { return d.x - 0.5; };
    var getYCoord = function(d) { return d.y - 0.5; };
    var getColor = function(d) { 
        return colors[operators[operator](d.x, d.y, m)]; 
    };
    var mouseOverHandler =  function (d) {
        //prevent info div from falling off page
        var left = d3.event.pageX;
        if ((left + infoDiv[0][0].clientWidth) > window.innerWidth) {
            left = left - infoDiv[0][0].clientWidth;
        }
        infoDiv.transition()
            .delay(500)
            .duration(200)
            .style("opacity", 0.9)
            .style("left", left + "px")
            .style("top", (d3.event.pageY - infoDiv[0][0].clientHeight) + "px")
            .each("start", function() {
                infoDiv.html(squareDivHtml(d.x, d.y, m));
            });
    };
    var mouseOutHandler = function () {
        infoDiv.transition()
            .duration(400)
            .style("opacity", 0);
    };

    
    for (var y = 0;  y < Math.max(rows, oldRows); y++) {
        var data = [];
        if (y < rows) {
            for (var x = 0; x < rows; x++) {
                data.push({x:x, y:y});
                if (y > 0) {
                    data.push({x:x, y:-y});
                }
                if (x > 0) {
                    data.push({x:-x, y:y});
                    if (y > 0) {
                        data.push({x:-x, y:-y});
                    }
                }
            }
        }
        var rects = d3.select("#quilt g").selectAll("rect.row"+y)
            .data(data);
        rects.enter()
            .append("rect")
            .attr("class", "row"+y)
//             .attr("x", function(d) { return 4*d.x })
//             .attr("y", function(d) { return 4*d.y })
            .style("opacity",0);
        rects.transition()
            .duration(transitionTime)
            .attr("x", getXCoord)
            .attr("y", getYCoord)
            .attr("width", 1)
            .attr("height", 1)
            .style("opacity",1)
            .style("fill", getColor);
        rects.on("mouseover", mouseOverHandler)        
            .on("mouseout", mouseOutHandler);  
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
};
