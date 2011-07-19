	
	var map;
	var logbook;

	// INITIALIZE APP //
	function initApp() {
		map = new L.Map('map',{maxZoom:9,dragging:false, doubleClickZoom:false});
		// Don't show the 'Powered by Leaflet' text
		map.attributionControl.setPrefix('');
		map.setView(new L.LatLng(43,-3), 4).addLayer(
	    new L.TileLayer('http://a.tiles.mapbox.com/mapbox/1.0.0/world-bright/{z}/{x}/{y}.png', {
        scheme: 'tms',
        attribution: "World bright - Mapbox"
	    }));

		// Bind button for next ship
		$('a.ok').click(function(ev){
		  stopPropagation(ev);
		  nextShip();
		});
		
		getShipData(31);
	}
	
	
	// GET SHIP DATA FROM THE SERVER //
	function getShipData(number) {
		$.ajax({
			url: '/data/fake.txt?order='+number,
			dataType: 'text',
			type: 'GET',
			success:function(result){
				var ship_data = $.parseJSON(result);
				logbook = ship_data;
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
	
	
	// Restart app to show next ship
	function nextShip() {
	  $('div.mamufas').fadeIn();
	  // Restart graph
	  //restartGraph();
	  // Restart map
	  restartMap();
	  // Restart list
	  restartList();
	  // Get next ship
	  setTimeout(getShipData(logbook.order+1),500);
	}




