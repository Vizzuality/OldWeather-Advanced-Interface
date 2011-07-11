

	function drawList(ship_data) {
		var tbody = '<tbody>';
		
		_.each(ship_data,function(logbook,i){
			// First each for loop all the logbooks of the json
			
			_.each(logbook.rows,function(row,j){
				tbody+=	"<tr>"+
									"<td><div style=\"width:65px\">"+i+"</div></td>"+
									"<td><div style=\"width:135px\">"+convertDate(logbook.date) +"</div></td>"+
									"<td><div style=\"width:130px\">"+logbook.location.lat.toFixed(4) +' / '+ logbook.location.lng.toFixed(4)+"</div></td>"+
									"<td><div style=\"width:80px\">"+row.bulb+"</div></td>"+
									"<td><div style=\"width:80px\">"+row.sea+"</div></td>"+
									"<td><div style=\"width:80px\">"+row.air+"</div></td>"+
								"</tr>";
			});
		});
		
		tbody += '</tbody>';
		$('div.list table').append(tbody);
		
		$('div.list').jScrollPane({showArrows:false, autoReinitialise: true});
	}