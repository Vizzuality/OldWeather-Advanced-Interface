

	function drawList(ship_data) {
		var tbody = '<tbody>',
				count = 0;
		
		_.each(ship_data,function(logbook,i){
			// First each for loop all the logbooks of the json
			_.each(logbook.data,function(row,j){
				tbody+=	"<tr x='"+row.x+"' y='"+row.y+"' iden='"+i+"' class='"+((j % 2==0)?'light':'dark')+"'>"+
									"<td><div style=\"width:65px\">"+i+"</div></td>"+
									"<td class='enabled' type=\"date\" r='"+count+"'><div class='"+logbook.date.status+"' style=\"width:170px\">"+convertDate(logbook.date) +"</div></td>"+
									"<td class='enabled' type=\"location\" r='"+count+"'><div class='"+logbook.location.status+"' style=\"width:170px\">"+logbook.location.latitude.toFixed(8) +' / '+ logbook.location.longitude.toFixed(8)+"</div></td>"+
								"</tr>";
				count++;
			});
		});
		
		tbody += '</tbody>';
		$('div.list table').append(tbody);
		
		if (editor==null) {
		  // Add custom scroll for the list
   	  $('div.list').jScrollPane({showArrows:false, autoReinitialise: true});

      // Trigger event for focus in the other elements of the app
      $('table tbody tr').hover(
       function(ev){
         dispatchEvent('list','mouseover',$(this).attr('iden'),$(this).attr('x'),$(this).attr('y'));
       },
       function(ev){
         dispatchEvent('list','mouseout',$(this).attr('iden'),0,0);
       }
      );

      // EDITOR
      // Create custom values editor
      var editor = (function() {
        var old_value,    // Values of the cell
            new_value,
            r,
            type,
            iden;            

        // Create element
        $('div.list').append(
          '<div class="editor">'+
            '<form>'+
              '<div class="top"></div>'+
              '<div class="mid">'+
                '<div class="first">'+
                 '<div class="position">'+
                   '<label>LATITUDE</label>'+
                   '<input type="text" value=""/>'+
                   '<label>LONGITUDE</label>'+
                   '<input type="tetx" value=""/>'+
                 '</div>'+
                 '<div class="date">'+
                   '<span class="select day">'+
                     '<label>DAY</label>'+
                     '<a href="#day" alt="23"><span>23</span></a>'+
                     '<ul>'+
                       '<li>1</li><li>2</li><li>3</li><li>4</li><li>5</li><li>6</li><li>7</li><li>8</li><li>9</li>'+
                       '<li>10</li><li>11</li><li>12</li><li>13</li><li>14</li><li>15</li><li>16</li><li>17</li><li>18</li>'+
                       '<li>19</li>20<li>1</li><li>21</li><li>22</li><li>23</li><li>24</li><li>25</li><li>26</li><li>27</li>'+
                       '<li>28</li><li>29</li><li>30</li><li>31</li>'+
                     '</ul>'+
                   '</span>'+
                   '<span class="select month">'+
                     '<label>MONTH</label>'+
                     '<a href="#month"><span>January</span></a>'+
                     '<ul>'+
                       '<li>January</li>'+
                       '<li>February</li>'+
                       '<li>March</li>'+
                       '<li>April</li>'+
                       '<li>May</li>'+
                       '<li>June</li>'+
                       '<li>July</li>'+
                       '<li>August</li>'+
                       '<li>September</li>'+
                       '<li>October</li>'+
                       '<li>November</li>'+
                       '<li>December</li>'+
                     '</ul>'+
                   '</span>'+
                   '<span class="select year">'+
                     '<label>YEAR</label>'+
                     '<a href="#year" alt="1930"><span>1930</span></a>'+
                     '<ul>'+
                       '<li>1930</li>'+
                       '<li>1931</li>'+
                       '<li>1932</li>'+
                     '</ul>'+
                   '</span>'+
                 '</div>'+
                '</div>'+
                '<div class="second">'+
                  '<label>BEFORE</label>'+
                  '<p>xxxx</p>'+
                  '<label><span>AFTER</span></label>'+
                  '<p class="new">xxxx</p>'+
                '</div>'+
              '</div>'+
              '<div class="bottom">'+
                '<a class="cancel" href="#cancel">cancel</a>'+
                '<a class="next"><span>SUBMIT</span></a>'+
              '</div>'+
            '</form>'+
          '</div>'
        );

        // Add listeners
        $('div.editor a.next').click(function(ev){
          stopPropagation(ev);
          $('div.editor form').submit();
        });

        $('div.editor a.cancel').click(function(ev){
          stopPropagation(ev);
          hideEditor();
        });

        // Date selector
        $('span.select a').click(function(ev){
          stopPropagation(ev);
          if (!$(this).parent().find('ul').is(':visible')) {
            $('span.select ul').each(function(i,ele){$(ele).hide()});
            $(this).parent().find('ul').show();

            $('body').click(function(event){
              if (!$(event.target).closest('span.select ul').length) {
                $('span.select ul').each(function(i,ele){$(ele).hide()});
                $('body').unbind('click');
              }
            });
          }
        });

        $('span.select ul li').click(function(ev){
          var value = $(this).text();
          $(this).closest('span.select').find('a').children('span').text(value);
          $('body').unbind('click');
          $('span.select ul').each(function(i,ele){$(ele).hide()});
        });


        // Form to accept ENTER bind
        $('form').submit(function(ev){
          stopPropagation(ev);
          if ($('div.editor div.first').is(':visible')) {

            if (type!="date") {
              new_value = $('div.editor form input:eq(0)').val() + ' / ' + $('div.editor form input:eq(1)').val();
              if (new_value == old_value) {
                hideEditor();
                return false; 
              }

              if (checkPosition()) {
                secondStep();
              }
            } else {
              new_value = {day:$('span.select.day a span').text(),month:getMonth($('span.select.month a span').text()),year:$('span.select.year a span').text()};
              if (new_value.day == old_value.day && new_value.year == old_value.year && new_value.month == old_value.month) {
                hideEditor();
              } else {
                secondStep();
              }
            }

          } else {
            // TODOOOOO REQUEST TO SERVER

            // Change value of the cell
            if (type!="date") {
              $('table tbody td[r="'+r+'"][type="'+type+'"]').find('div').html(new_value);
              var new_latlng = new google.maps.LatLng(new_value.split(' / ')[0],new_value.split(' / ')[1]);
              markers[iden].setPosition(new_latlng);
              redrawPolygon();
            } else {
              $('table tbody td[r="'+r+'"][type="'+type+'"]').find('div').html(convertDate(new_value));
            }
            // Hide editor
            hideEditor(); 
          }
        });


        function secondStep() {
          if (type!="date") {
            // Fill data
            $('div.editor div.second p:eq(0)').html(old_value);
            $('div.editor div.second p:eq(1)').html(new_value);
          } else {
            $('div.editor div.second p:eq(0)').html(convertDate(old_value));
            $('div.editor div.second p:eq(1)').html(convertDate(new_value));
          }

          // Show next step
          $('div.editor div.second').show();
          // Hide previous step
          $('div.editor div.first').hide();
        }


        function checkPosition(){
          var pattern = /^([+-]?(((\d+(\.)?)|(\d*\.\d+))([eE][+-]?\d+)?))$/;
          var errors = 0;

          // Check latitude
          var latitude = $('div.editor input:eq(0)').val();
          if (pattern.test(latitude) && latitude<180 && latitude>-180) {
            $('div.editor input:eq(0)').removeClass('error');
          } else {
            errors++;
            $('div.editor input:eq(0)').addClass('error');
          }

          // Check longitude
          var longitude = $('div.editor input:eq(1)').val();
          if (pattern.test(longitude) && longitude<180 && longitude>-180) {
            $('div.editor input:eq(1)').removeClass('error');
          } else {
            errors++;
            $('div.editor input:eq(1)').addClass('error');
          }

          // Errors??
          if (errors>0) {
            $('div.editor').jrumble({rumbleEvent: 'click'});
            $('div.editor').trigger('click');
            setTimeout(function(){
              $('div.editor').trigger('click');
              $('div.editor').unbind('click')
            }, 300);
            return false;
          } else {
            $('div.editor input').each(
              function(i,ele){
                $(ele).removeClass('error');
              }
            );
            return true;
          }
        }


        function hideEditor() {
          $(document).unbind('keydown');
          $('div.editor').hide();
          $('div.editor div.first').show();
          $('div.editor div.second').hide();
        }


        function showEditor(cell) {
          $('div.editor input').removeClass('error');

          var position = cell.offset();
          var position_list = $('div.list').position().top;
          var app_height = $(document).height();
          // Calculate where to positionate the editor window
          position.top = position.top-position_list - 10;
          position.left = position.left+2;

          $('div.editor').css({
            top:position.top+'px',
            left:position.left+'px'
          });

          // Get type (date or position)
          type = cell.attr('type');
          r = cell.attr('r');
          iden = cell.closest('tr').attr('iden');
          // Get old value
          old_value = cell.find('div').text();


          // Show the proper type of edition (date or position) 
          $('div.editor div.first div.date,div.editor div.first div.position').hide();
          if (type=="date") {
            old_value = getDate(old_value);

            $('span.select:eq(0) a span').text(old_value.day);
            $('span.select:eq(1) a span').text(convertMonth(old_value.month));
            $('span.select:eq(2) a span').text(old_value.year);

            $('div.editor div.first div.date').show();
          } else {
            $('div.editor div.first div.position').show();
            var values = old_value.split(' / ');
            $('div.editor div.first div.position input:eq(0)').val(values[0]);
            $('div.editor div.first div.position input:eq(1)').val(values[1]);
          }
          
          $('div.editor').show();
          $('div.editor input:eq(0)').select().focusin();


          $(document).keydown(function(event){
            if (event.which == '27') {
              hideEditor();
            }
          });
        }

        return {
          hide: hideEditor,
          show: showEditor
        }
      }());




      // Document listener to show editor properly
      $(document).dblclick(function(event){
        var target = event.target || event.srcElement;
           var targetElement = target.nodeName.toLowerCase();

           if ($(target).closest('td').length>0 && $(target).closest('td').hasClass('enabled')) {
             editor.show($(target).closest('td'));
             if (event.preventDefault) {
               event.preventDefault();
               event.stopPropagation();
             } else {
               event.stopPropagation();
               event.returnValue = false;
             }
           }
      });
      // Document listener to close the editor if it is opened
      $(document).click(function(event){
        var target = event.target || event.srcElement;
           var targetElement = target.nodeName.toLowerCase();

           if ($(target).closest('.editor').length==0 && $(target).closest('td').length==0) {
             editor.hide();
           }
      });
  		
		}
 	}
	
	
	
	// Fire list event to simulate over rows
	function fireListEvent(type,iden) {
	  if (type=="mouseover") {
     $('table tbody tr[iden="'+iden+'"]').each(function(i,ele){
       $(ele).addClass('hover');
     });
	  } else {
     $('table tbody tr[iden="'+iden+'"]').each(function(i,ele){
       $(ele).removeClass('hover');
     });
	  }
	}


	function restartList() {
	  $('tbody').remove();
	}

		

