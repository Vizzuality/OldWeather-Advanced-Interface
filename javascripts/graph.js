function drawGraph(ship_data) {
	
	function getAnchors(p1x, p1y, p2x, p2y, p3x, p3y) {
	        var l1 = (p2x - p1x) / 2,
	            l2 = (p3x - p2x) / 2,
	            a = Math.atan((p2x - p1x) / Math.abs(p2y - p1y)),
	            b = Math.atan((p3x - p2x) / Math.abs(p2y - p3y));
	        a = p1y < p2y ? Math.PI - a : a;
	        b = p3y < p2y ? Math.PI - b : b;
	        var alpha = Math.PI / 2 - ((a + b) % (Math.PI * 2)) / 2,
	            dx1 = l1 * Math.sin(alpha + a),
	            dy1 = l1 * Math.cos(alpha + a),
	            dx2 = l2 * Math.sin(alpha + b),
	            dy2 = l2 * Math.cos(alpha + b);
	        return {
	            x1: p2x - dx1,
	            y1: p2y + dy1,
	            x2: p2x + dx2,
	            y2: p2y + dy2
	        };
	    }
	    // Grab the data
	    var labels = [5,5,5,5,5,35,345,32],
	        data = [15,5,3,50,25,35,45,32];
	    

	    // Draw
	    var width = $('div#graph').width(),
	        height = 237,
	        leftgutter = 0,
	        bottomgutter = 25,
	        topgutter = 5,
	        colorhue = .6 || Math.random(),
	        color = "hsb(" + [colorhue, .5, 1] + ")",
	        r = Raphael("graph", width, height),
	        X = (width - leftgutter) / labels.length,
	        max = Math.max.apply(Math, data),
	        Y = (height - bottomgutter - topgutter) / max;
	    //r.drawGrid(leftgutter + X * .5 + .5, topgutter + .5, width - leftgutter - X, height - topgutter - bottomgutter, 10, 10, "#333");
	    var path = r.path().attr({stroke: color, "stroke-width": 1, "stroke-linejoin": "round"}),
	        is_label_visible = false,
	        leave_timer,
	        blanket = r.set();
					
			var frame = r.image("/images/hover_graph.png", 300, 0, 17, 237).hide();
			

	    var p;
	    //Each value...
			for (var i = 0, ii = data.length; i < ii; i++) {
	        var y = Math.round(height - bottomgutter - Y * data[i]),
	            x = Math.round(leftgutter + X * (i + .5));
	
	        if (!i) {
	            p = ["M", x, y, "C", x, y];
	        }
	        if (i && i < ii - 1) {
	            var Y0 = Math.round(height - bottomgutter - Y * data[i - 1]),
	                X0 = Math.round(leftgutter + X * (i - .5)),
	                Y2 = Math.round(height - bottomgutter - Y * data[i + 1]),
	                X2 = Math.round(leftgutter + X * (i + 1.5));
	            var a = getAnchors(X0, Y0, x, y, X2, Y2);
	            p = p.concat([a.x1, a.y1, x, y, a.x2, a.y2]);
	        }
	        blanket.push(r.rect(leftgutter + X * i, 0, X, height - bottomgutter).attr({stroke: "none", fill: "#fff", opacity: 0}));
	        var rect = blanket[blanket.length - 1];
					var id = i;
	        (function (x, y, data, id) {
	            var timer, i = 0;
	            rect.hover(function () {
	                clearTimeout(leave_timer);
	                frame.attr({x: x-9}).show();
	                is_label_visible = true;
	            }, function () {
	                leave_timer = setTimeout(function () {
	                    frame.hide();
	                    is_label_visible = false;
	                }, 1);
	            });
	        })(x, y, data[i]);
	    }
	
	
	    p = p.concat([x, y, x, y]);
	    path.attr({path: p});
	    frame.toFront();
	    blanket.toFront();
}



// Raphael.fn.drawGrid = function (x, y, w, h, wv, hv, color) {
//     color = color || "#000";
//     var path = ["M", Math.round(x) + .5, Math.round(y) + .5, "L", Math.round(x + w) + .5, Math.round(y) + .5, Math.round(x + w) + .5, Math.round(y + h) + .5, Math.round(x) + .5, Math.round(y + h) + .5, Math.round(x) + .5, Math.round(y) + .5],
//         rowHeight = h / hv,
//         columnWidth = w / wv;
//     for (var i = 1; i < hv; i++) {
//         path = path.concat(["M", Math.round(x) + .5, Math.round(y + i * rowHeight) + .5, "H", Math.round(x + w) + .5]);
//     }
//     for (i = 1; i < wv; i++) {
//         path = path.concat(["M", Math.round(x + i * columnWidth) + .5, Math.round(y) + .5, "V", Math.round(y + h) + .5]);
//     }
//     return this.path(path.join(",")).attr({stroke: color});
// };

// $(function () {
//     $("#data").css({
//         position: "absolute",
//         left: "-9999em",
//         top: "-9999em"
//     });
// });