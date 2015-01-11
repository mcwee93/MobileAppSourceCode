		localStorage.removeItem('trackingList');
		
		if (!window.console) console = {
			log: function() { window.status = Array.prototype.slice.call(arguments).join(""); }
		};

		var markers = new Array(); 
		var infowindows = new Array(); 
		
		var poly; 
		if (navigator.geolocation) {
			var timeoutVal = 55000; 
			var maximumAgeVal = 60000 
			navigator.geolocation.watchPosition(
				displayPosition, 
				displayError,
				{ enableHighAccuracy: true, timeout: timeoutVal, maximumAge: maximumAgeVal }
			);
			
			
		}
		else {
			alert("Geolocation is not supported by this browser");
		}
		
		function renderPoint(timestamp, lat, lng) {		
			console.log("Render ",new Date(timestamp).toLocaleString()," | ", lat , " | ", lng);
			var pos = new google.maps.LatLng(lat,lng);
		
			markers[timestamp] = new google.maps.Marker({
				position: pos,
				map: map,
				title: "Here at: " + parseTimestamp(timestamp) 
			});
			var contentString = "<b>Timestamp:</b> " + new Date(timestamp).toLocaleString()  + "<br/><b>Previous location:</b> lat " + lat + ", long " + lng;
			
			infowindows[timestamp] = new google.maps.InfoWindow({ 
				content: contentString
			});
			
			google.maps.event.addListener(markers[timestamp], 'mouseover', function() { 
				infowindows[timestamp].open(map,markers[timestamp]); 
			});
			
			google.maps.event.addListener(markers[timestamp], 'mouseout', function() { 
				infowindows[timestamp].close(map,markers[timestamp]); 
			});
			var path = poly.getPath(); 
			path.push(pos); 
			console.log("path.push ", lat, lng);
		}
		
		function displayPosition(position) {			
			var pos = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
			var options = {
				zoom: 12, 
				center: pos,
				mapTypeId: google.maps.MapTypeId.ROADMAP
			};
			map = new google.maps.Map(document.getElementById("map"), options); 

			var polyOptions = {
			strokeColor: '#3388cc',
			strokeOpacity: 1.0,
			strokeWeight: 4
			}
			poly = new google.maps.Polyline(polyOptions);
			poly.setMap(map);
			trackingList.addPoint(position); 
			trackingList.getAllPoints(); 
		}
		function displayError(error) {
			var errors = { 
				1: 'Unfortunately permission has been denied',
				2: 'Your position is unavailable at this time',
				3: 'Request timeout'
			};
			alert("Error: " + errors[error.code]);
		}
		function parseTimestamp(timestamp) {
			var d = new Date(timestamp);
			var day = d.getDate();
			var month = d.getMonth() + 1;
			var year = d.getFullYear();
			var hour = d.getHours();
			var mins = d.getMinutes();
			var secs = d.getSeconds();
			var msec = d.getMilliseconds();
			return day + "." + month + "." + year + " " + hour + ":" + mins + ":" + secs + "," + msec;
		}
	
		trackingList = {}; 
		
		trackingList.open = function() {
			if (localStorage.trackingList) {
				this.list = JSON.parse(localStorage.trackingList); 
			} else {
				this.list = { 
				1 : Array(55.676751, -4.071341)
				}; 
				localStorage.trackingList = JSON.stringify(this.list);
			}
		};		
	
		trackingList.addPoint = function(position) {
			this.list[position.timestamp] = Array(position.coords.latitude, position.coords.longitude);
			localStorage.trackingList = JSON.stringify(this.list); 
			console.log("ADD ",position.timestamp," | ", position.coords.latitude ," | ", position.coords.longitude, " <<<<<<<<<");
			this.getAllPoints(); 
		};

		trackingList.getAllPoints = function() {
			
			var point;
			for (var key in this.list) {
				point = this.list[key]; 
				renderPoint( parseFloat(key), point[0], point[1] );
			}
		};

		trackingList.open();