
	var markers = {};
	var polyline;

	// DRAW POLYGON AND MARKERS IN THE MAP
	function drawShipPolyline(ship_data) {

		// Get polyline path meanwhile adding markers...
		var trace = [];
		_.each(ship_data,function(ele,i){
			if (ele.location.latitude != undefined && ele.location.longitude != null) {
				var latlng = new L.LatLng(ele.location.latitude,ele.location.longitude);
				trace.push(latlng);
				var marker = new L.OldWeatherMarker(latlng, map, {iden:i});
				markers[i] = marker;
			}
		});
		

		// Draw polyline if there is more than 1 point
    if (_.size(trace)>1) {
      polyline = new L.Polyline(trace, {color: '#F15A3E'});
      map.addLayer(polyline);
    }
		
		if (_.size(trace)==1) {
			map.setView(trace[0],5);
		} else if (_.size(trace)>1) {
			map.fitBounds(new L.LatLngBounds(trace));
		}
		
		// Hack for Google Chrome + Leaflet
		setTimeout(function(){
		  $('div.leaflet-map-pane').css('-webkit-transform','');
		},500);
	}
	
	
	// Simulate fire event over markers
	function fireMapEvent(type,iden) {
	  if (type=="mouseover") {
	    markers[iden]._simulateOver();
	  } else {
	    markers[iden]._simulateOut();
	  }
	}
	
	
	// Restart Map application
	function restartMap() {
	  map.removeLayer(polyline);
	  _.each(markers,function(ele,i){
	    ele.onRemove(map);
	    delete markers[i];
	  });
	}