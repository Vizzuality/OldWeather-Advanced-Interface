

	function drawList(ship_data) {
		var tbody = '<tbody>',
				count = 0;
		
		_.each(ship_data,function(logbook,i){
			// First each for loop all the logbooks of the json
			_.each(logbook.data,function(row,j){
			  console.log(logbook);
				tbody+=	"<tr iden='"+i+"' class='"+((j % 2==0)?'light':'dark')+"'>"+
									"<td><div style=\"width:65px\">"+i+"</div></td>"+
									"<td><div style=\"width:140px\">"+convertDate(logbook.date) +"</div></td>"+
									"<td><div style=\"width:130px\">"+logbook.location.latitude.toFixed(4) +' / '+ logbook.location.longitude.toFixed(4)+"</div></td>"+
									"<td c='bulb' r='"+count+"' class='enabled'><div style=\"width:80px\">"+row.bulb+((row.bulb!='--')?'&ordm;C':'')+"</div></td>"+
									"<td c='sea' r='"+count+"' class='enabled'><div style=\"width:80px\">"+row.sea+((row.sea!='--')?'&ordm;C':'')+"</div></td>"+
									"<td c='air' r='"+count+"' class='enabled'><div style=\"width:80px\">"+row.air+((row.air!='--')?'&ordm;C':'')+"</div></td>"+
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
         dispatchEvent('list','mouseover',$(this).attr('iden'));
       },
       function(ev){
         dispatchEvent('list','mouseout',$(this).attr('iden'));
       }
      );

      // EDITOR
      // Create custom values editor
      var editor = (function() {
        var old_value,    // Values of the cell
            new_value,
            c,            // Position of the cell
            r;            

        // Create element
        $('div.list').append(
          '<div class="editor">'+
            '<form>'+
              '<div class="top"></div>'+
              '<div class="mid">'+
                '<div class="first">'+
                  '<input class="text" type="text" value=""/>'+
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

        // Form to accept ENTER bind
        $('form').submit(function(ev){
          stopPropagation(ev);
          if ($('div.editor div.first').is(':visible')) {
            new_value = $('div.editor form input').val();
            if (new_value == old_value) {
              hideEditor();
              return false; 
            }

            if (checkNumber(new_value)) {
              secondStep();
            }
          } else {
            // TODO create a new request

            // Normalize values to add for example ºC
            $('table tbody td[r="'+r+'"][c="'+c+'"]').find('div').html(new_value+'&ordm;C');
            // Hide editor
            hideEditor(); 
          }
        });


        function secondStep() {
          // Fill data
          $('div.editor div.second p:eq(0)').html(old_value+'&ordm;C');
          $('div.editor div.second p:eq(1)').html(new_value+'&ordm;C');

          // Show next step
          $('div.editor div.second').show();

          // Hide previous step
          $('div.editor div.first').hide();
        }


        function checkNumber(number){
          var pattern = /^([+-]?(((\d+(\.)?)|(\d*\.\d+))([eE][+-]?\d+)?))$/;
             if (pattern.test(number)) {
               $('div.editor input').removeClass('error');
               return true;
             } else {
               $('div.editor input').addClass('error');

               $('div.editor').jrumble({rumbleEvent: 'click'});
               $('div.editor').trigger('click');    
               setTimeout(function(){
                   $('div.editor').trigger('click');
                   $('div.editor').unbind('click')
               }, 300);

               return false;
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
          var app_height = $(document).height();

          // Calculate where to positionate the editor window
          position.top = position.top-430;
          position.left = position.left-44;

          $('div.editor').css({
            top:position.top+'px',
            left:position.left+'px'
          });

          // Get cell position
          c = cell.attr('c');
          r = cell.attr('r');
          // Get old value
          old_value = cell.find('div').text();

          //TODO NORMALIZE VALUES!!
          old_value = old_value.substr(0,old_value.length-2);
          $('div.editor input').val(old_value);

          // Store previous value
          $('div.editor').attr('alt',cell.find('div').text());

          $('div.editor').show();
          $('div.editor input').select().focusin();


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

		

