

	function drawList(ship_data) {
		var tbody = '<tbody>';
		
		_.each(ship_data,function(logbook,i){
			// First each for loop all the logbooks of the json
			_.each(logbook.rows,function(row,j){
				tbody+=	"<tr iden='"+i+"' class='"+((j % 2==0)?'light':'dark')+"'>"+
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


		///////////////////////////////////////////////////////////
		// BIG TODOOOOO CREATE A EVENT DISPACHER AS ACTIONSCRIPT //
		///////////////////////////////////////////////////////////

		// Bind document event for hovering rows when points or graph is focused
		$(document).bind('mouseover_',
			function(ev){
				var iden = ev.iden;
				var from = ev.from;
				if (from != 'list') {
					$('table tbody tr[iden="'+iden+'"]').each(function(i,ele){
						$(ele).addClass('hover');
					});
				}
			}
		);

		$(document).bind('mouseout_',
			function(ev){
				var iden = ev.iden;
				var from = ev.from;
				if (from != 'list') {
					$('table tbody tr[iden="'+iden+'"]').each(function(i,ele){
						$(ele).removeClass('hover');
					});
				}
			}
		);


		// Trigger event for focus in the other elements of the app
		$('table tbody tr').hover(
			function(ev){
				var iden = $(this).attr('iden');
				var event = jQuery.Event("mouseover_");
				event.iden = iden;
				event.from = 'list';
				$(document).trigger(event);
			},
			function(ev){
				var iden = $(this).attr('iden');
				var event = jQuery.Event("mouseout_");
				event.iden = iden;
				event.from = 'list';
				$(document).trigger(event);
			}
		);
		
		// Add custom scroll for the list
		$('div.list').jScrollPane({showArrows:false, autoReinitialise: true});
	}