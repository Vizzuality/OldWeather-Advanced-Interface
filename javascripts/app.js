	
	var map;
	var logbook;

	// INITIALIZE APP //
	$(document).ready(function(){
	  map = new google.maps.Map(
      document.getElementById("map"), {
      center: new google.maps.LatLng(0, 0),
      zoom: 3,
      disableDefaultUI: true,
      mapTypeControlOptions: {
        mapTypeIds: [google.maps.MapTypeId.ROADMAP, 'mapbox']
      }
    });

    // Add the mapbox layer type
    map.mapTypes.set('mapbox', mbLayer({
        tileset: 'world-bright',
        name: 'World Bright'
    }));

    // Set the default map to world light
    map.setMapTypeId('mapbox');

		// Bind button for next ship
		$('a.ok').click(function(ev){
		  stopPropagation(ev);
		  nextShip();
		});
		
		// Zoom control
		$('a.zoom_in').click(function(ev){
		  stopPropagation(ev);
		  map.setZoom(map.getZoom()+1);		  
		});
		$('a.zoom_out').click(function(ev){
		  stopPropagation(ev);
		  map.setZoom(map.getZoom()-1);
		});

		getShipData(31);
	});
	
	
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
				showLogbook(ship_data.location);
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




