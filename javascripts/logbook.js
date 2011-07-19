
  function showLogbook(url) {
    $('div.logbook').css('background','url(\''+url+'\')');
  }
  
  function fireLogbookEvent(type,x,y) {
    if (type=="mouseover") {
      var size = Math.min($('div.logbook').width()/2,$('div.logbook').height()/2);
      if (x>size) {x=x-size}
      if (y>size) {y=y-size}
      $('div.logbook').css('background-position','-'+x+'px -'+y+'px');
      $('div.logbook div.legend').hide();
    } else {
      $('div.logbook div.legend').show();
    }
  }