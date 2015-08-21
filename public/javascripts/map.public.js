
	function init(feature){

		feature = feature || undefined;

		var layer = new L.tileLayer('http://a{s}.acetate.geoiq.com/tiles/acetate-hillshading/{z}/{x}/{y}.png', {
			attribution: '&copy;2012 Esri & Stamen, Data from OSM and Natural Earth',
			subdomains: '0123',
			minZoom: 2,
			maxZoom: 18
		});

		var map = L.map("map", {
			maxZoom: 16
		});
		//var layer = new L.StamenTileLayer("toner-lite");

		map.addLayer(layer);

		map.data = {};
		map.layers = {};

		if (feature === undefined){
		var point = [12.972892, 77.590598];

		//init to bangalore
		map.setView(point, 12);


		}
		else{
			//if the map is initialized from a feature search

			var geoj = L.geoJson(feature, {
					style: function (feat) {
					return {color: '#00B7FF'};
				},
				pointToLayer: function(feat, latlng){
					return new L.CircleMarker(latlng, {
						radius: 10,
						fillColor: "#00B7FF",
						color: "#000",
						weight: 1,
						opacity: 1,
						fillOpacity: 0.4
					});
				},
				onEachFeature: function (feat, layer) {
					layer.bindPopup(feat.properties.name);
				}
			});

			geoj.addTo(map);

			map.fitBounds(geoj.getBounds()).setZoom(13);
		}


		return map
	}

	function reqFromDBinBounds(areaType, cb){
			//var bbox = map.getBounds().toBBoxString();
			$.ajax({
				type: 'GET',
				url: '/map/data/'+areaType//+'/bounds/'+bbox
			}).done(function(result) {
				cb(result);
			});
	}

	function addFeatureLayer(layer){
		//if feature is not initialized, add to map object
		if (layer.length < 5){
			if(layer != 'Ward' && map.hasLayer(map.layers['Ward'])){
				map.removeLayer(map.layers['Ward'])
			}
			if(layer != 'DRO' && map.hasLayer(map.layers['DRO'])){
				map.removeLayer(map.layers['DRO'])
			}
			if(layer != 'SRO' && map.hasLayer(map.layers['SRO'])){
				map.removeLayer(map.layers['SRO'])
			}
		}
		if (Object.keys(map.layers).indexOf((layer)) == -1){

			layerButton(layer);
		}
		else{
			map.addLayer(map.layers[layer])

		}
	}

	function removeFeatureLayer(layer){

		if (Object.keys(map.layers).indexOf((layer)) != -1){
			map.removeLayer(map.layers[layer])
		}

	}

	function layerLoad(buttonName, callback){

		reqFromDBinBounds(buttonName, function(feature) {

			if (buttonName.length < 5){
				//checks if name length is shorter, eg sro/ward/dro
				map.layers[buttonName] = new L.featureGroup();
			}else{
				//apartments
				if (buttonName == 'Apartments'){
					map.layers[buttonName] = new L.markerClusterGroup({ disableClusteringAtZoom: 14, spiderfyOnMaxZoom: true, showCoverageOnHover: false, zoomToBoundsOnClick: true, iconCreateFunction: function(cluster) { return new L.DivIcon({ html: '<div class="uk-badge uk-badge-notification" style="position:absolute; background-color: darkorange">' + cluster.getChildCount() + '</div>', className: 'aptIcon'}); } });
				}
				else{
					if(buttonName == 'Landmarks-schools')
					{
						map.layers[buttonName] = new L.markerClusterGroup({ disableClusteringAtZoom: 14, spiderfyOnMaxZoom: true, showCoverageOnHover: false, zoomToBoundsOnClick: true, iconCreateFunction: function(cluster) { return new L.DivIcon({ html: '<div class="uk-badge uk-badge-notification" style="position:absolute; background-color: #1d96c1">' + cluster.getChildCount() + '</div>', className: 'amenIcon'}); } });
					}

					if(buttonName == 'Landmarks-majorbus'){
						map.layers[buttonName] = new L.markerClusterGroup({ disableClusteringAtZoom: 14, spiderfyOnMaxZoom: true, showCoverageOnHover: false, zoomToBoundsOnClick: true, iconCreateFunction: function(cluster) { return new L.DivIcon({ html: '<div class="uk-badge uk-badge-notification" style="position:absolute; background-color: #8b4513">' + cluster.getChildCount() + '</div>', className: 'amenIcon'}); } });
					}

					if(buttonName == 'Landmarks-metrostation'){
						map.layers[buttonName] = new L.markerClusterGroup({ disableClusteringAtZoom: 14, spiderfyOnMaxZoom: true, showCoverageOnHover: false, zoomToBoundsOnClick: true, iconCreateFunction: function(cluster) { return new L.DivIcon({ html: '<div class="uk-badge uk-badge-notification" style="position:absolute; background-color: #bc0000">' + cluster.getChildCount() + '</div>', className: 'amenIcon'}); } });
					}

					if(buttonName == 'Landmarks-itparks'){
						map.layers[buttonName] = new L.markerClusterGroup({ disableClusteringAtZoom: 14, spiderfyOnMaxZoom: true, showCoverageOnHover: false, zoomToBoundsOnClick: true, iconCreateFunction: function(cluster) { return new L.DivIcon({ html: '<div class="uk-badge uk-badge-notification" style="position:absolute; background-color: #430074">' + cluster.getChildCount() + '</div>', className: 'amenIcon'}); } });
					}


				}
			}

			//amenities: add custom icon for amenities, add popup with name
			feature.features = feature.features.map(function(x){var y = x; y.geometry = JSON.parse(y.geometry); return y });

			map.data[buttonName] = feature;

			L.geoJson(feature, {
				style: function (feat) {
					return {
						color: 'gray',
						weight: 1
					}
				},
				pointToLayer: function(feat, latlng){
					//return new L.marker(latlng, {icon: L.divIcon({className: 'aptIcon'}) } );
					if(buttonName == 'Apartments'){
						return new L.marker(latlng, {icon: apartmentIcon});
					}else{
						if(buttonName == 'Landmarks-schools')
							return new L.marker(latlng, {icon: schoolIcon});
						if(buttonName == 'Landmarks-majorbus')
							return new L.marker(latlng, {icon: busIcon});
						if(buttonName == 'Landmarks-metrostation')
							return new L.marker(latlng, {icon: metroIcon});
						if(buttonName == 'Landmarks-itparks')
							return new L.marker(latlng, {icon: itIcon});
					}

				},

				onEachFeature: function (feat, layer) {

					layer.properties = feat.properties || layer.properties;

					if (buttonName.length < 5){
						//only add these listeners for polygon layers
						if (buttonName.length < 5){
							layer.on({
								mouseover: highlightFeature,
								mouseout: resetHighlight,
								click: populateSidebarData
							});
						}

						//bind vals
						layer.bindPopup(createPopup(feat.properties.name,
							Math.ceil(feat.properties.mv),
							Math.ceil(feat.properties.gv),
							Math.ceil(feat.properties.rv),
							Math.ceil(feat.properties.lv), true),customOptions);
						//layer.bindPopup(layer.properties.name);

					}else{
						if (buttonName == 'Apartments'){
							//bind vals
							layer.bindPopup(createPopup(feat.properties.name,
								Math.ceil(feat.properties.mv),
								Math.ceil(feat.properties.gv),
								Math.ceil(feat.properties.rv),
								Math.ceil(feat.properties.lv), false),customOptions);
						}
						else{
							//bind name only
							layer.bindPopup(feat.properties.name);
						}

					}
				}
			}).addTo(map.layers[buttonName]);

				choroplethAll({
					guidance_value: 'gv',
					market_value: 'mv',
					registration_value: 'rv',
					listing_value: 'lv'
				}[$(':checked.property_values').attr('id')]);


				callback(map.layers[buttonName]);
		} );



	}

	function layerButton(buttonName){

			layerLoad(buttonName, function(layer){

				layer.addTo(map);
				if (buttonName.length < 5){
					//bring polygons to the back
					layer.bringToBack();
				}
				map.fitBounds(layer.getBounds());

			});

	}

	function populateSidebarData(e) {
		var layer = e.target;
		var propMap = {
			'#sidebar-data-name': layer.properties.name || null,
			'#sidebar-data-area': layer.properties.area || null,
			'#sidebar-data-pop': layer.properties.pop || null,
			'#sidebar-data-dens': layer.properties.dens || null,
			'#sidebar-data-pop-f': layer.properties.popf || null,
			'#sidebar-data-pop-m': layer.properties.popm || null,
			'#sidebar-data-gv': layer.properties.gv || null,
			'#sidebar-data-mv': layer.properties.mv || null,
			'#sidebar-data-rv': layer.properties.rv || null,
			'#sidebar-data-lv': layer.properties.lv || null
		};

		Object.keys(propMap).forEach(function(a){
			$(a).html(propMap[a]);
		});
	}

	function highlightFeature(e) {
		var layer = e.target;

		layer.setStyle({
			fillOpacity: 0.7
		});

		if (!L.Browser.ie && !L.Browser.opera) {
			layer.bringToFront();
		}
	}

	function resetHighlight(e) {
		var layer = e.target;

		layer.setStyle({
			fillOpacity: 0.2
		});
	}

	function resetHighlightNull(e) {
		var layer = e.target;

		layer.setStyle({
			fillOpacity: 0
		});
	}

	function maxMin(array, value){
		var max = Math.max.apply(Math,array.features.map(function(o){return o.properties[value];}));
		var min = Math.min.apply(Math,array.features.map(function(o){return o.properties[value];}));

		return {min : min, max :max};
}

	function choroplethAll(value){
		//use choropleth for all polygon layers if one is selected
		//pass empty value parameter to reset

		Object.keys(map.data).forEach(
			function(a){
				if (a.length < 5){
					choropleth(a, value);
				}
			}
		)
	}

	function choropleth(area,value){
		(map.scale) ? map.scale = map.scale : map.scale = new chroma.scale(['yellow', 'red']);
		//pass empty 'value' parameter to reset
		value = value || undefined;

		var m = maxMin(map.data[area], value);

		if (!map.legend){
			if (value) map.legend = new L.control({position: 'bottomleft'})
		}
		else{
			if (value){
				if (map.legend){
					//old div and Lcontrol object removed by removeControl
					map.removeControl(map.legend);
					map.legend = new L.control({position: 'bottomleft'})
				}
				else{
					map.legend = new L.control({position: 'bottomleft'})
				}
			}
			else{
				map.removeControl(map.legend);
			}
		}

		map.layers[area].eachLayer(function(d){

			if (value !== undefined){

				d.eachLayer(function(f){

					if (f.properties[value] != null){
						f.setStyle({fillColor: map.scale( (1-0)*(f.properties[value] - m.min)/(m.max-m.min) )});
					}

					else{
						f.setStyle({ fillOpacity: 0});
						f.on({
							mouseover: highlightFeature,
							mouseout: resetHighlightNull
						});
					}

				});

				//add new map legend
				if (map.legend !== undefined){

					map.legend.onAdd = function (map) {

						var div = L.DomUtil.create('div', 'info legend choro'),
							grades = [0.1, 0.3, 0.5, 0.7, 0.9],
							labels = {
								0.1: m.min,
								0.3: m.max*0.3,
								0.5: m.max *0.5,
								0.7: m.max*0.7,
								0.9: m.max*0.9};

						// loop through & generate a label with a colored square for each interval
						for (var i = 0; i < grades.length; i++) {
							div.innerHTML +=
								'<i style="background:' + map.scale(grades[i]) + '"></i> ' +
								Math.ceil(labels[grades[i]]/1000)*1000 + (Math.ceil(labels[grades[i + 1]]/1000)*1000 ? '&ndash;' + Math.ceil(labels[grades[i + 1]]/1000)*1000 + '<br>' : '+');
						}

						return div;
					};

					map.legend.onRemove = function(map){
						map.legend = undefined;
					}

					map.legend.addTo(map);

				}


			}else{
				d.eachLayer(function(f){

					f.setStyle({
						fillColor: 'gray',
						weight: 1
					});
				});
			}

	});


	}

	var apartmentIcon = L.icon({
		iconUrl: '/images/POINT_2.png',
		iconSize: [60,60], // size of the icon
		popupAnchor: [0,-15]
	});

	var schoolIcon = L.divIcon({
		className:'school-icon',
		html: '<i class="fa fa-graduation-cap fa-lg"><\i>',
		popupAnchor: [0,-15]

	});

	var busIcon = L.divIcon({
		className:'bus-icon',
		html: '<i class="fa fa-bus fa-lg"><\i>',
		popupAnchor: [0,-15]

	});

	var metroIcon = L.divIcon({
		className:'metro-icon',
		html: '<i class="fa fa-subway fa-lg"><\i>',
		popupAnchor: [0,-15]

	});
	var itIcon = L.divIcon({
		className:'it-icon',
		html: '<i class="fa fa-laptop fa-lg"><\i>',
		popupAnchor: [0,-15]

	});

	// create popup contents
	var createPopup = function(name, mv, gv, rv, lv, disablePopOut){
		var args = Array.prototype.slice.call(arguments);

		var chartHref = "/chart/"+args[0].split(' ')[1];
		var customPopup = [
			'&nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp',
			'&nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp',
			'&nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp',
			'&nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp',
			'<a href="#" class="popout" style="color:darkorange">',
			'<i class="fa fa-share"> </i>',
			'</a>',
			'&nbsp &nbsp',
			'<a href="#" class="close_popup" style="color:darkorange">',
			'<i class="fa fa-close"> </i>',
			'</a>',
			'<br>',
			'<b> '+name+' </b>',
			'<hr>',
			'<p style="color:white">',
			'Guidance Value',
			'&nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp ',
			Math.ceil(gv),
			'</p>',
			'<p style="color:white">',
			'Market Value',
			'&nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp  ',
			Math.ceil(mv),
			'</p>',
			'<p style="color:white">',
			'Listing Value',
			'&nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp  &nbsp   ',
			Math.ceil(lv),
			'</p>',
			'<p style="color:white">',
			'Registration Value',
			'&nbsp &nbsp &nbsp &nbsp &nbsp  ',
			Math.ceil(rv),
			'</p>',
			'<hr>',
			]

			if (disablePopOut){
				customPopup[4] = '';
				customPopup[5] = '';
				customPopup[6] = '';
			}

			return customPopup.join('');;
		}

	// specify popup options
	var customOptions =
	{
		'maxWidth': '500',
		'className' : 'custom'
	}

	function filter() {

		if (map.layers.Apartments){
			var values = $( "#slider-range" ).slider( "option", "values" );
			var filtered = new L.LayerGroup([map.layers.Apartments]);

			var checked = {
				guidance_value: 'gv',
				market_value: 'mv',
				registration_value: 'rv',
				listing_value: 'lv'
			}[$(':checked.property_values').attr('id')];

			if (checked !== undefined){

				map.layers.Apartments.clearLayers();

				var filtered = {type: "FeatureCollection", features: []}
				/*
				var filtered = map.data.Apartments.features.sort(function(a, b) {
					return a.properties[checked] - b.properties[checked];
				}); */

				map.data.Apartments.features.forEach(function(a){
					if (a.properties[checked] > values[0] && a.properties[checked] < values[1] ) {
						filtered.features.push(a);
					}
				});

				//fix - new function: sort and return middle array sliced

				L.geoJson(filtered, {
					style: function (feat) {
						return {
							color: 'gray',
							weight: 1
						}
					},
					pointToLayer: function (feat, latlng) {
						//return new L.marker(latlng, {icon: L.divIcon({className: 'aptIcon'}) } );
						return new L.marker(latlng, {icon: apartmentIcon});
					},
					onEachFeature: function (feat, layer) {
						layer.properties = feat.properties || layer.properties;

						layer.bindPopup(createPopup(feat.properties.name,
							feat.properties.mv,
							feat.properties.gv,
							feat.properties.rv,
							feat.properties.lv), customOptions);

					}
				}).addTo(map.layers.Apartments);

			}
		}

	}


