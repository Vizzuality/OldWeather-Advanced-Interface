var colors = {'bulb':'#F25A3D','sea':'#088DBB','air':'#08A7AD'};

function drawGraph(ship_data) {

	var data_values = {bulb:[], sea:[], air:[]};

  // Save all data in an array (data_values)
  var max_value = 0,
      min_value = 0;
	_.each(ship_data,function(logbook,i){
		_.each(logbook.rows,function(row,i){
			if (row.bulb!=undefined && !isNaN(row.bulb)) {
				data_values.bulb.push(parseInt(row.bulb));
        if (max_value<row.bulb) max_value = row.bulb;
        if (min_value>row.bulb) min_value = row.bulb;
			} else {
				data_values.bulb.push(-9999);
			}

			if (row.sea!=undefined && !isNaN(row.sea)) {
				data_values.sea.push(parseInt(row.sea));
        if (max_value<row.sea) max_value = row.sea;
        if (min_value>row.sea) min_value = row.sea;
			} else {
				data_values.sea.push(-9999);
			}

			if (row.air!=undefined && !isNaN(row.air)) {
				data_values.air.push(parseInt(row.air));
        if (max_value<row.air) max_value = row.air;
        if (min_value>row.air) min_value = row.air;
			} else {
				data_values.air.push(-9999);
			}
		});
	});

  

  // Draw
  var height = 237,
      leftgutter = 0,
      bottomgutter = 25,
      topgutter = 5,
      width = $('div#graph').width() + (($('div#graph').width() - leftgutter) / data_values.sea.length),
      r = Raphael("graph", width, height),
      X = (width - leftgutter) / data_values.sea.length,
      max = max_value,
      min = min_value,
      Y = (height - bottomgutter - topgutter) / max;


  
  

  r.drawGrid(leftgutter + X * .5 + .5, topgutter + .5, width - leftgutter - X, height - topgutter - bottomgutter, 10, 10, "#333");
	var frame = r.image("/images/hover_graph.png", 300, 0, 17, 237).hide();
	


  _.each(data_values,function(element,i){
    // Set path first
    var path = r.path().attr({stroke: colors[i], "stroke-width": 1, "stroke-linejoin": "round"}),
    is_label_visible = false,
    leave_timer,
    blanket = r.set();
    var p, y_, x_;

    _.each(element,function(value,j){
      var y = y_ = Math.round(height - bottomgutter - Y * value),
          x = x_ = Math.round(leftgutter + X * (j + .5));

      if (!j) {
          p = ["M", x, y, "C", x, y];
      }
      if (j && j < element.length - 1) {
          var Y0 = Math.round(height - bottomgutter - Y * element[j - 1]),
              X0 = Math.round(leftgutter + X * (j - .5)),
              Y2 = Math.round(height - bottomgutter - Y * element[j + 1]),
              X2 = Math.round(leftgutter + X * (j + 1.5));
          var a = getAnchors(X0, Y0, x, y, X2, Y2);
          p = p.concat([a.x1, a.y1, x, y, a.x2, a.y2]);
      }
      blanket.push(r.rect(leftgutter + X * j, 0, X, height - bottomgutter).attr({stroke: "none", fill: "#fff", opacity: 0}));
      var rect = blanket[blanket.length - 1];
      var id = 'vizz'; // TODO
      (function (x, y, data, id) {
          var timer, j = 0;
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
      })(x, y, element);
    });
    p = p.concat([x_, y_, x_, y_]);
    path.attr({path: p});
    frame.toFront();
    blanket.toFront();
  });

  //Positionate graph closer to edge
  var range = (data_values.sea.length*X) - $('div#graph').width();
  $('svg').css('marginLeft',-(range/2)+'px');
}




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





Raphael.fn.drawGrid = function (x, y, w, h, wv, hv, color) {
    color = "#666666";
    //console.log(h,w);

    // "M", Math.round(x) + .5, Math.round(y) + .5, "L", Math.round(x + 8) + .5, Math.round(y) + .5,
    // "M", Math.round(x + w) + .5, Math.round(y + h) + .5, "L",Math.round(x) + .5, Math.round(y + h) + .5

    var path = [],
        rowHeight = h / 5;
    for (var i = 0; i < 6; i++) {
        path = path.concat(["M", Math.round(x) + .5, Math.round(y + i * rowHeight) + .5, "L", Math.round(x + 8) + .5, Math.round(y + i * rowHeight) + .5]);
        path = path.concat(["M", Math.round(x + w) + .5, Math.round(y + i * rowHeight) + .5, "L", Math.round(x + w - 8) + .5, Math.round(y + i * rowHeight) + .5]);


    }
    return this.path(path.join(",")).attr({stroke: color});
};

// $(function () {
//     $("#data").css({
//         position: "absolute",
//         left: "-9999em",
//         top: "-9999em"
//     });
// });