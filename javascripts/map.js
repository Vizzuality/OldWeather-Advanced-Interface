
		var markers = [];

		// DRAW POLYGON AND MARKERS IN THE MAP
		function drawShipPolyline(ship_data) {
			
			// Get polyline path meanwhile adding markers...
			var trace = [];
			_.each(ship_data,function(ele,i){
				if (ele.location.lat != undefined && ele.location.lat != null) {
					var latlng = new L.LatLng(ele.location.lat,ele.location.lng);
					trace.push(latlng);
					var marker = new L.OldWeatherMarker(latlng, map, {id_:i});
					markers.push(marker);
				}
			});
			
			
			// Draw polyline if there is more than 1 point
			if (_.size(trace)>1) {
				var polyline = new L.Polyline(trace, {color: '#F15A3E'});
				map.addLayer(polyline);
			}
			
			if (_.size(trace)==1) {
				map.setView(trace[0],5);
			} else if (_.size(trace)>1) {
				map.fitBounds(new L.LatLngBounds(trace));
			}
		}