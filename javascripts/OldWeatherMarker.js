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
  		this._map = map;
  		this.onAdd(this._map);
  	},


  	onAdd: function(map) {
  	  var me = this;
  		this._map = map;
  		var div = this._div = document.createElement('div');
			div.setAttribute('class','marker');
			
			var value = document.createElement('p');
			value.innerHTML = this.options.id_;

			div.appendChild(value);

  		map._panes.markerPane.appendChild(this._div);
      L.DomEvent.addListener(this._div, 'mouseover', this._onMouseOver, this);
      L.DomEvent.addListener(this._div, 'mouseout', this._onMouseOut, this);

  		map.on('viewreset', this._reset, this);
  		this._reset();
  	},
  	

  	onRemove: function(map) {
  	  map._panes.markerPane.removeChild(this._canvas);
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
  		L.DomEvent.preventDefault(e);
  		// this.fire(e.type);
  	},


  	_onMouseOut: function(e) {
  		L.DomEvent.stopPropagation(e);
  		L.DomEvent.preventDefault(e);
  		// this.fire(e.type);
  	}

  });