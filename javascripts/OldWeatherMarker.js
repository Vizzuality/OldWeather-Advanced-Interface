
  function OldWeatherMarker(latlng, info, map) {
    this.latlng_ = latlng;
  	this.inf = info;
  	this.map_ = map;

    this.offsetVertical_ = -5;
    this.offsetHorizontal_ = -5;
    this.height_ = 10;
    this.width_ = 10;

    this.setMap(map);
  }

  OldWeatherMarker.prototype = new google.maps.OverlayView();

  OldWeatherMarker.prototype.draw = function() {
    var me = this;
  	var num = 0;

    var div = this.div_;
    if (!div) {
      div = this.div_ = document.createElement('div');
      div.className = 'marker';
      var p_ = document.createElement('p');
      p_.innerHTML = this.inf.iden;
      div.appendChild(p_);

      var panes = this.getPanes();
      panes.floatPane.appendChild(div);
      
      google.maps.event.addDomListener(div, 'mouseover', function() {
        me.simulateOver();
        dispatchEvent('map','mouseover',me.inf.iden);
      });
      
      google.maps.event.addDomListener(div, 'mouseout', function() {
        me.simulateOut();
        dispatchEvent('map','mouseout',me.inf.iden);
      });
    }

  	var pixPosition = me.getProjection().fromLatLngToDivPixel(me.latlng_);
    if (pixPosition) {
  	  div.style.width = me.width_ + 'px';
  	  div.style.left = (pixPosition.x + me.offsetHorizontal_) + 'px';
  	  div.style.height = me.height_ + 'px';
  	  div.style.top = (pixPosition.y + me.offsetVertical_) + 'px';
    }

  };

  OldWeatherMarker.prototype.remove = function() {
    if (this.div_) {
      this.div_.parentNode.removeChild(this.div_);
      this.div_ = null;
    }
  };

  OldWeatherMarker.prototype.hide = function() {
    if (this.div_) {
      $(this.div_).find('div').fadeOut();
    }
  };

  OldWeatherMarker.prototype.getPosition = function() {
   return this.latlng_;
  };
  
  
  OldWeatherMarker.prototype.simulateOver = function(){
    var div = this.div_;
    $(div).addClass('hover');
  },

  OldWeatherMarker.prototype.simulateOut = function(){
    var div = this.div_;
    $(div).removeClass('hover');
  }
