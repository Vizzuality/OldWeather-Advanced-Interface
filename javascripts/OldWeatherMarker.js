L.OldWeatherMarker = L.Class.extend({
    
    includes: L.Mixin.Events,
    
    options: {
			// Set id for each marker / row
  	},


  	initialize: function(latlng, map, options) {
  		L.Util.setOptions(this, options);
  		this._latlng = latlng;
  		this._div = null;
  		this._verticalOffset = 5;
  		this._horizontalOffset = 5;
  		this.onAdd(map);
  	},


  	onAdd: function(map) {
  	  var me = this;
      this._map = map;
  		var div = this._div = document.createElement('div');
			div.className = 'marker';
			var p_ = document.createElement('p');
			p_.innerHTML = this.options.iden;
			div.appendChild(p_);

      map._panes.markerPane.appendChild(this._div);

  		map.on('viewreset', this._reset, this);
  		this._reset();

      L.DomEvent.addListener(this._div, 'mouseover', this._onMouseOver, this);
      L.DomEvent.addListener(this._div, 'mouseout', this._onMouseOut, this);
  	},
  	

  	onRemove: function(map) {
  	  map._panes.markerPane.removeChild(this._div);
  		map.off('viewreset', this._reset, this);
  	},


  	getLatLng: function() {
  		return this._latlng;
  	},


  	setLatLng: function(latlng) {
  		this._latlng = latlng;
  		this._reset();
  	},


  	_reset: function() {
  		var pos = this._map.latLngToLayerPoint(this._latlng).round();
  		var div = this._div;
  		
  		div.style.left = pos.x-this._horizontalOffset + 'px';
  		div.style.top = pos.y-this._verticalOffset + 'px';
  	},
  	

  	_onMouseOver: function(e) {
  		L.DomEvent.stopPropagation(e);
      this.fire(e.type);
      this._simulateOver();
      dispatchEvent('map','mouseover',this.options.iden);
  	},


  	_onMouseOut: function(e) {
  	  L.DomEvent.stopPropagation(e);
      this.fire(e.type);
      this._simulateOut();
  		dispatchEvent('map','mouseout',this.options.iden);
  	},

    _simulateOver: function(){
      var div = this._div;
      $(div).addClass('hover');
    },

    _simulateOut: function(){
      var div = this._div;
      $(div).removeClass('hover');
    }

  });