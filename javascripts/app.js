	
	var map;
	var logbooks_ = [];

	// INITIALIZE APP //
	function initApp() {
		map = new L.Map('map',{zoomControl:false,maxZoom:10});
		// Don't show the 'Powered by Leaflet' text
		map.attributionControl.setPrefix('');
		map.setView(new L.LatLng(43,-3), 4).addLayer(
		    new L.TileLayer('http://a.tiles.mapbox.com/mapbox/1.0.0/world-bright/{z}/{x}/{y}.png', {
		        scheme: 'tms',
		        attribution: "World bright - Mapbox"
		    }));
		
		getShipData();
	}
	
	
	// GET SHIP DATA FROM THE SERVER //
	function getShipData() {
		$.ajax({
			url: '/data/fake.txt',
			dataType: 'text',
			type: 'GET',
			success:function(result){
				var ship_data = $.parseJSON(result);
				processData(ship_data);
			}
		});
	}
	
	
	// PROCESS AND NORMALIZE THE SHIP DATA... //
	function processData(ship_data) {
		_.each(ship_data,function(logbook,h){
			// First each for loop all the logbooks of the json
			var new_logbook = new Object();
			new_logbook.url = logbook.location;
			new_logbook.order = logbook.order;
			new_logbook.rows = [];
			new_logbook.date = {};
			new_logbook.location = {};
			
			
			var position = new Object(),date = new Object(),info = new Object();
			
			_.each(logbook.asset_results,function(assets,i){
				// Second each for loop all asset_results of this logbook
				_.each(assets,function(asset,k){
					// Third each for loop over all items
					if (k=="consensus") {
						_.each(asset,function(consen,j){
							// Forth each for loop over all consensus ... Madness!
							if (i==1) {
									new_logbook.location[j] = consen.value;
								} else if (i==0) {
									new_logbook.date[j] = consen.value;
								} else {
									info[j] = consen.value;
								}
						});
					}

					if (k=="consensus" && i>1) {
							new_logbook.rows.push({rank:h,bulb:((info.bulb.length>0)?info.bulb:'--'),sea:((info.sea.length>0)?info.sea:'--'),air:((info.air.length>0)?info.air:'--')});
					}
				});
			});
			
			logbooks_.push(new_logbook);
		});

		
		drawShipPolyline(logbooks_);
		drawGraph(logbooks_);
		drawList(logbooks_);

	}