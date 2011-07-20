
	var markers = {};
	var polyline;
	var bounds = new google.maps.LatLngBounds();

	// DRAW POLYGON AND MARKERS IN THE MAP
	function drawShipPolyline(ship_data) {

		// Get polyline path meanwhile adding markers...
		var trace = [];
		_.each(ship_data,function(ele,i){
			if (ele.location.latitude != undefined && ele.location.longitude != null) {
				var latlng = new google.maps.LatLng(ele.location.latitude,ele.location.longitude);
				trace.push(latlng);
				bounds.extend(latlng);
				var marker = new OldWeatherMarker(latlng, {iden:i}, map);
				markers[i] = marker;
			}
		});
		

    //Draw polyline if there is more than 1 point
    if (_.size(trace)>1) {
      polyline = new google.maps.Polyline({path:trace, strokeColor: '#F15A3E', strokeWeight:3});
      polyline.setMap(map);
    }
    
    if (_.size(trace)==1) {
      map.setCenter(trace[0]);
      map.setZoom(5);
    } else if (_.size(trace)>1) {
      map.fitBounds(bounds);
    }
	}
	
	
	// Simulate fire event over markers
	function fireMapEvent(type,iden) {
	  if (type=="mouseover") {
	    markers[iden].simulateOver();
	  } else {
	    markers[iden].simulateOut();
	  }
	}
	
	
	// Restart Map application
	function restartMap() {
	  polyline.setMap(null);
	  _.each(markers,function(ele,i){
	    ele.remove();
	    delete markers[i];
	  });
	}


	// Redraw polygon
	function redrawPolygon() {
		var trace = [],
				bounds = new google.maps.LatLngBounds();
			
		_.each(markers,function(ele,i){
			trace.push(ele.getPosition());
			bounds.extend(ele.getPosition());
		});
		polyline.setPath(trace);
		map.fitBounds(bounds);
	}