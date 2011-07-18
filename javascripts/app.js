	
	var map;
	var logbooks_ = [];

	// INITIALIZE APP //
	function initApp() {
		map = new L.Map('map',{maxZoom:9});
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
			url: '/data/fake.txt?989',
			dataType: 'text',
			type: 'GET',
			success:function(result){
				var ship_data = $.parseJSON(result);
				drawShipPolyline(ship_data.logbook);
				//drawGraph(ship_data.logbook);
				drawList(ship_data.logbook);
				completeRequest(ship_data);
			}
		});
	}
	
	



	// Fill data from logbook and hide Mamufas
	function completeRequest(ship_data) {
		//Fill data of the logbook - Ship name, logbook url,...
		$('h1').text(ship_data.ship_name);
		$('div.info p').html(ship_data.ship_type+', <a target="_blank" href="'+ship_data.location+'">view the logbook</a>')

		//Close mamufas
		$('div.mamufas').fadeOut();
	}




