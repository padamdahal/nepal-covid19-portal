
$(document).ready(function(){
	
	$(".loading").show();
	dialog = $( "#dialog-form" ).dialog({
      autoOpen: false,
      height: 400,
      width: 350,
      modal: true
    });
	
	var sDate = '2020-01-01';
	var eDate;
	var disease = 'COVID-19';
	
	$("#sidebarToggle").on("click", function(e) {
        e.preventDefault();
        $("body").toggleClass("sb-sidenav-toggled");
    });
	
	$("#nextDate").addClass('disabled');
	
	$("#titleAdminLevel").html("Nepal");
	init("cases", 'Nepal', sDate, eDate=null, disease);
	
	$(".adminLevel").click(function(){
		$(".adminLevel").removeClass('active');
		$(".loading").show();
		var id = $(this).attr('id');
		$("#titleAdminLevel").html(id.replace("_"," "));
		
		var eDate = $("#eDate").html();
		if(eDate == 'Today'){
			eDate = null;
		}
		
		$('#'+id).addClass('active');
		init("cases", id.replace("_"," "), sDate, eDate, disease);
	});
	
	$(".dateChange").click(function(){
		var id = $(this).attr('id');
		var eDate;
		if(id == 'previousDate'){
			eDate = getDateString("previous", $("#eDate").html());
		}else{
			eDate = getDateString("next", $("#eDate").html());
		}
		 
		init("cases", $("#titleAdminLevel").html(), sDate, eDate, disease);
	});
	
	$("#covidSummary").on('click', '#mapCases', function(){
		init('cases', $("#adminLevel").val());
	});
		
	$("#covidSummary").on('click', '#mapRecovered', function(){
		init('Recovered', $("#adminLevel").val());
	});
		
	$("#covidSummary").on('click', '#mapActive', function(){
		init('Active', $("#adminLevel").val());
	});
		
	$("#covidSummary").on('click', '#mapDeath', function(){
		init('Death', $("#adminLevel").val());
	});
	
	
	
	window.onresize = function() {
		$(".col-md-6").each(function(i) {
			var chartElement = $(this).children().attr('id');
			var update = {
				width: $("#"+chartElement).width()
			};
			Plotly.restyle(chartElement, update);
		});
	};
	
	//setInterval(function(){ $("#previousDate").trigger('click');}, 3000);
	
	function filterDataByAdminLevel(data, adminLevel){
		var temp = [];
		$.each(data, function(i, row){
			if(adminLevel == 'Nepal'){
				temp.push(row);
			}else{
				if(row['Province'] == adminLevel || row['Organisation unit'] == adminLevel){
					temp.push(row);
				}
			}
		});
		
		return temp;
	}

	function init(caseType, adminLevel, sDate, eDate, disease){
		$(".loading").show();
		$.getJSON("http://103.69.126.98/covid19/dataservice/data-dev.php", function(dates) {
			if(eDate == null){
				eDate = dates.today;
			}
			$("#eDate").html(eDate);
			//$("#eDate").val(eDate);
			var url = "http://103.69.126.98/covid19/dataservice/data-dev.php?sDate="+sDate+"&eDate="+eDate+"&disease="+disease;
			
			$.getJSON(url, function(data){
				$(".loading").hide();
				var filteredData = filterDataByAdminLevel(data, adminLevel);
				displayTopSummary(filteredData, adminLevel);
				mapify(filteredData, adminLevel);
				chartify(filteredData, adminLevel);
			});
		});
	}
	
	function displayTopSummary(data, adminLevel){
		var caseCount = 0;
		var newCaseCount  = 0;
		var yCaseCount = 0;
		var newRecoveredCount = 0;
		var yRecoveredCount = 0;
		var recoveredCount = 0;
		var activeCount = 0;
		var deathCount = 0;
		var newDeathCount = 0;
		var yDeathCount = 0;
		$.each(data, function(i, row){
			caseCount += parseInt(row['Value']);
			
			if(row['Period'] == '2020'){
				caseCount += parseInt(row['Value']);
				if(row['Outcome'] == 'Death'){
					deathCount += parseInt(row['Value']);
				}
			
				if(row['Outcome'] == 'Recovered'){
					recoveredCount += parseInt(row['Value']);
				}
			}else if(row['Period'] == 'Today'){
				newCaseCount += parseInt(row['Value']);
				if(row['Outcome'] == 'Death'){
					newDeathCount += parseInt(row['Value']);
				}
			
				if(row['Outcome'] == 'Recovered'){
					newRecoveredCount += parseInt(row['Value']);
				}
			}else if(row['Period'] == 'Yesterday'){
				yCaseCount += parseInt(row['Value']);
				if(row['Outcome'] == 'Death'){
					yDeathCount += parseInt(row['Value']);
				}
			
				if(row['Outcome'] == 'Recovered'){
					yRecoveredCount += parseInt(row['Value']);
				}
			}
		});

		// new template
		$("#totalCases-1").html(caseCount);
		
		/* get and display the data of the selected day only */
		$.getJSON("http://103.69.126.98/covid19/dataservice/data-dev.php?type=day&sDate="+sDate+"&eDate="+$("#eDate").html()+"&disease="+disease, function(data) {
			$(".loading").hide();
			var filteredData = filterDataByAdminLevel(data, adminLevel);
			$.each(filteredData, function(i, row){
				newCaseCount += parseInt(row['Value']);
			});
			$("#newCases").html('+'+newCaseCount+ ' new');
		});
		
		
		// get death and recovered
		if(adminLevel == 'Nepal'){
		$.getJSON("http://103.69.126.98/covid19/dataservice/data-dev.php?type=outcome&sDate="+sDate+"&eDate="+$("#eDate").html()+"&disease="+disease, function(data) {
			$(".loading").hide();
			
			var filteredData = filterDataByAdminLevel(data, adminLevel);
			
			var recovered = 0;
			var death = 0;
			var active = 0;
			
				$.each(filteredData, function(i, data){
					recovered += parseInt(data['Number of cases recovered']);
					death += parseInt(data['Number of deaths']);
					
				});
				
				active = caseCount - recovered -death;
				$("#recovered-1").html(recovered);
				$("#death-1").html(death);
				$("#active-1").html(active);
				
				var recoveryRate = parseFloat(recovered/caseCount*100).toFixed(2);
				var config = {
					type: 'doughnut',
					data: {
						datasets: [{
							data: [recoveryRate, 100-recoveryRate],
							backgroundColor: ['green','lightgray']
						}],
						labels: [
							'Red',
							'Orange'
						]
					},
					options: {
						responsive: true,
						borderWidth:10,
						legend: {display: false},
						title: {display: true,text: 'Recovery Rate*: '+recoveryRate+'%', position: 'bottom'},
						animation: {animateScale: true,animateRotate: true},
						tooltips: {enabled: false},
						hover: {mode: null},
					}
				};

				var recoveryRateChart = document.getElementById('recoveryRate').getContext('2d');
				var myDoughnut = new Chart(recoveryRateChart, config);
				
				var deathRate = parseFloat(death/caseCount*100).toFixed(2);
				var deathRateChartConfig = {
					type: 'doughnut',
					data: {
						datasets: [{
							data: [deathRate, 100-deathRate],
							backgroundColor: ['red','lightgray']
						}],
						labels: [
							'Red',
							'Orange'
						]
					},
					options: {
						responsive: true,
						borderWidth:10,
						legend: {display: false},
						title: {display: true,text: 'Fatality Rate*: ' +deathRate+'%',position: 'bottom'},
						animation: {animateScale: true,animateRotate: true},
						tooltips: {enabled: false},
						hover: {mode: null},
					}
				};

				var deathRateChart = document.getElementById('fatalityRate').getContext('2d');
				var deathRateDoughnut = new Chart(deathRateChart, deathRateChartConfig);
			
		});
		
		/* get and display the outcome data of the selected day only */
		$.getJSON("http://103.69.126.98/covid19/dataservice/data-dev.php?type=outcomeDay&sDate="+sDate+"&eDate="+$("#eDate").html()+"&disease="+disease, function(data) {
			$(".loading").hide();
			var recoveredToday = 0;
			var deathToday = 0;
			var filteredData = filterDataByAdminLevel(data, adminLevel);
			$.each(filteredData, function(i, data){
				recoveredToday += parseInt(data['Number of cases recovered']);
				deathToday += parseInt(data['Number of deaths']);	
			});
			
			$("#recovered-new").html('+'+recoveredToday+' new');
			$("#death-new").html('+'+deathToday+' new');
			
		});
		
		}else{
			$("#recovered-1").html('...');
			$("#death-1").html('...');
			$("#active-1").html('...');
				
			$("#recovered-new").html('...');
			$("#death-new").html('...');
		}
	}
	
	// Map section
	function mapify(data, adminLevel){
			
			document.getElementById('mapContainer').innerHTML = "<div id='map' style='width:100%;height:100%'></div>";
			var map = L.map('map', {}).setView([28.3, 84.3], 7);
			map.zoomControl.setPosition('topright');
			map.addControl(new L.Control.Fullscreen({position:'topright'}));
			var geojson;
			
			if(adminLevel == "Nepal"){
				geojson = L.geoJson(nepalData, {
					style: style,
					onEachFeature: onEachFeature
				}).addTo(map);
			}else{		
				$.ajax({
					url: 'geojson/'+adminLevel.replace(" ", "")+'.json'
				}).done(function(geoJson) {					
					geojson = L.geoJson(geoJson, {
						style: style,
						onEachFeature: onEachFeature
					}).addTo(map);
					map.fitBounds(geojson.getBounds());
				});
			}
			
			map.attributionControl.addAttribution('COVID-19 Statistics &copy; <a href="http://edcd.gov.np">EDCD/MoHP</a>');
			
			// Print button
			L.easyPrint({
				title: 'Print',
				position: 'topright',
				sizeModes: ['A4Portrait', 'A4Landscape'],
				exportOnly: true
			}).addTo(map);
			
			var labelControl = L.control({position: 'bottomright'});
			labelControl.onAdd = function (map) {
				var div = L.DomUtil.create('div', 'info labelControl');
				div.innerHTML = '<input type="checkbox" id="toggleDataLabel" checked /> Data Labels<br/><input type="checkbox" id="toggleFeatureLabel" /> District Labels';
				return div;
			};
			labelControl.addTo(map);
			
			document.getElementById("toggleDataLabel").addEventListener( "click", function(e) {
				if(e.target.checked){
					$('.leaflet-div-icon #dataLabel').show();//css("opacity",1);
				}else{
					$('.leaflet-div-icon #dataLabel').hide();//css("opacity",0);
				}
			});
			
			document.getElementById("toggleFeatureLabel").addEventListener( "click", function(e) {
				if(e.target.checked){
					$('.leaflet-div-icon #featureLabel').show();//css("opacity",1);
				}else{
					$('.leaflet-div-icon #featureLabel').hide();//css("opacity",0);
				}
			});
			
			
			// Load province boundaries
			if(adminLevel == 'Nepal'){
				$.ajax({
					url: 'dataservice/nepal-provinces.json'
				}).done(function(provinces) {					
					L.geoJson(provinces, {
						style: function(){
							return {
								fillColor: 'none',
								weight: 2,
								opacity: 1,
								color: '#4378bf',
								dashArray: '0',
								fillOpacity: 0
							};
						},
						onEachFeature: function(feature,layer){
							layer.bringToFront();
						}
					}).addTo(map);
				})
			}
			
			// End load province boundaries
			
			function getCovidData(name){
				var covidInfo = 0;
				$.each(data, function(i, row){
					if(row['District'].substring(4, 100) == name){
						covidInfo += parseInt(row['Value']);
					}
				});
				return covidInfo;
			}
			
			function getDeath(type,name){
				var covidInfo = 0;
				var column;

				if(type == 'district')
					column = 5;
				if(type == 'municipality')
					column = 4;
				
				$.each(data, function(i, row){
					if(row['District'].toUpperCase() == name){
						if(row['Outcome'] == "DECEASED"){
							covidInfo++;
						}
					}
				});
				return covidInfo;
			}
			
			function getCovidDataAll(name){
				var cases = 0;
				var recovered = 0;
				var active = 0;
				var death = 0;
				
				var female = 0;
				var male = 0;
				
				var column;
				
				$.each(data, function(i, row){
					if(row['District'].substring(4, 100) == name){
						// Case, Outcome
						cases += parseInt(row['Value']);
						if(row['Outcome'] == "Recovered"){
							recovered += parseInt(row['Value']);
						}else if(row['Outcome'] != "Recovered" && row['Outcome'] != "Death"){
							active += parseInt(row['Value']);
						}else if(row['Outcome'] == "Death"){
								death += parseInt(row['Value']);
						}
						
						// Sex
						if(row['Sex'] == "Female"){
							female += parseInt(row['Value']);
						}else if(row['Sex'] == "Male"){
							male += parseInt(row['Value']);
						}
					}
				});
				
				var htmlOutcome = `<table class="summaryInfo">
					<tr class="cases"><td>Cases</td><td>`+cases+`</td></tr>
					<!--tr class="recovered"><td>Recovered</td><td>`+recovered+`</td></tr>
					<tr class="active"><td>Active</td><td>`+active+`</td></tr>
					<tr class="death"><td>Death</td><td>`+death+`</td></tr-->
					</table>`;
				
				var htmlSex = `<table class="table">
					<tr class=""><td colspan="2" style="text-align:center"><b>`+name+`</b></td></tr>
					<tr class=""><td><b>Female</b></td><td>`+female+`</td></tr>
					<tr class=""><td><b>Male</b></td><td>`+male+`</td></tr>
					<tr class=""><td><b>Total</b></td><td>`+cases+`</td></tr>
					</table>`;

				return htmlSex;
			}
			
			function getCovidDataByDistrict(district){
				var filteredData = [];
				$.each(data, function(i, row){
					if(i == 0){
						filteredData.push(row);
					}else if(row[5].toUpperCase() == district){
						filteredData.push(row);
					}
				});
				return filteredData;
			}
			
			function getMunicipalityName(name, level){
				var fullName;
				
				if(level == 'Gaunpalika'){
					fullName = name+" Rural Municipality";
				}
				if(level == 'Nagarpalika'){
					fullName = name+" Municipality";
				}
				if(level == 'Upamahanagarpalika'){
					fullName = name+" Sub Metropolitan";
				}
				if(level == 'Mahanagarpalika'){
					fullName = name+" Metropolitan";
				}
				return fullName;
			}
			
			// control that shows district info on hover
			var info = L.control({position:'topleft'});
			info.onAdd = function (map) {
				this._div = L.DomUtil.create('div', 'info');
				this.update();
				return this._div;
			};

			info.update = function (props) {
				var covidInfo = 0;
				var name;
				if(typeof(props) !== 'undefined' && typeof(props.TARGET) !== 'undefined'){
					covidInfo = getCovidDataAll(props.TARGET);
					name = props.TARGET
				}
				this._div.innerHTML = '<h6 style="margin-bottom:0"><b>COVID-19 Statistics: '+adminLevel+'</b></h6>' + (props ? '<div style="margin-top:10px">' + covidInfo +'</div>': '');
			};
			info.addTo(map);
			

			// get color depending on population density value
			function getColor(value) {
				var d = value;
				if(d == 0){
					return 'lightgreen'; 
				}else{
					return d > 200  ? 'red' :
						d > 50  ? '#FC9E2A' :
						'#FFEDA0';
				}
			}

			function style(feature) {
				var covidInfo = 0;
				var type;
				var name;
				if(typeof(feature.properties.TARGET) !== 'undefined'){
					//district feature
					type = 'district';
					name = feature.properties.TARGET;
				}else if(typeof(feature.properties.DISTRICT) !== 'undefined'){
					// Municipality Feature
					type = "municipality";
					var name = getMunicipalityName(feature.properties.NAME, feature.properties.LEVEL);
				}
				var covidInfo = getCovidData(name);
				
				var color = '#555';
				var weight = 1;
				if(getDeath(type, name) > 0){
					color = 'red';
					weight = 3;
				}
				return {
					weight: weight,
					opacity: 1,
					color: color,
					dashArray: '0',
					fillOpacity: 0.7,
					fillColor: getColor(covidInfo)
				};
			}

			function highlightFeature(e) {
				var layer = e.target;
				layer.setStyle({
					weight: 2,
					color: '#666',
					dashArray: '',
					fillOpacity: 0.7
				});
				info.update(layer.feature.properties);
			}

			function resetHighlight(e) {
				geojson.resetStyle(e.target);
				info.update();
			}
			
			
			function zoomToFeature(e) {
				dialog.dialog("open");
				var data = getCovidDataByDistrict(e.target.feature.properties.TARGET);
				
				var utils = $.pivotUtilities;
				var heatmap =  utils.renderers["Table"];
				var sumOverSum =  utils.aggregators["Sum over Sum"];

				$("#dialog-form").pivot( data, {
					rows: ["Area"],
					cols: ["Outcome"],
					renderer: heatmap
				  });
				  $(".ui-dialog-title").html(e.target.feature.properties.TARGET);
			}

			function onEachFeature(feature, layer) {
				layer.on({
					mouseover: highlightFeature,
					mouseout: resetHighlight,
					click: zoomToFeature
				});
				
				addLabel(feature,layer);
			}
			
			function addLabel(feature, layer){
				
				var covidData = getCovidData(feature.properties.TARGET);
				var displayHtml = '<span id="dataLabel">'+covidData+'</span><br/><span id="featureLabel">'+feature.properties.TARGET+'</span>';
				var display = covidData;
				var width = 25;
				var height = 20;
				var iconAnchor = null;
				
				if(adminLevel != 'Nepal'){
					display = covidData;
					//display = feature.properties.TARGET+', '+covidData;
					//width = 120;
				}
				
				if(feature.properties.TARGET == 'KATHMANDU'){
					iconAnchor = [30, 20];
				}
				
				if(covidData != 0){
					var myIcon = L.divIcon({
						iconSize: new L.Point(width, height), 
						iconAnchor: iconAnchor,
						html: displayHtml
					});
					
					L.marker([layer._bounds.getCenter().lat,layer._bounds.getCenter().lng], {icon: myIcon}).addTo(map);
					//.bindPopup(feature.properties.TARGET+'<br/>'+covidData);
				}
			}
			
			var legend = L.control({position: 'bottomleft'});
			legend.onAdd = function (map) {
				var div = L.DomUtil.create('div', 'info legend'),
				grades = [0, 50, 200],
				labels = ['<strong>Legend</strong>'],
				from, to;
				
				labels.push('<i style="background:' + getColor(0) + '"></i> No Cases');

				for (var i = 0; i < grades.length; i++) {
					from = grades[i];
					to = grades[i + 1];

					labels.push(
						'<i style="background:' + getColor(from + 1) + '"></i> ' +
						(from+1) + (to ? '&ndash;' + to : '+'));
				}

				div.innerHTML = labels.join('<hr/>');
				return div;
			};

			legend.addTo(map);
		}

	function chartify(data, adminLevel){			
		
		// Start rendering charts
		$.getJSON("config.json", function(configs) {
			$("#visualization").empty();
			
			// Cases by gender - Pie Chart
			var genderChart = `<div class="col-xl-4">
                                <div class="card mb-4">
                                    <div class="card-body" id="casesByGender"></div>
                                </div>
                            </div>`;
			$("#visualization").append(genderChart);
			
			var female = 0;
			var male = 0;
			var missing = 0;
			$.each(data, function(i, row){
				if(row['Sex'] == 'Female'){
					female += parseInt(row['Value']);
				}
				if(row['Sex'] == 'Male'){
					male += parseInt(row['Value']);
				}
			});
				
			var n = " (n="+(female+male)+")";
			var pieChartData = [{
				values: [female, male],
				labels: ['Female','Male'],
				hoverinfo: 'label+percent+value',
				hole: .4,
				type: 'pie'
			}];
				
			var dataType = 'Cases';
			var layout = {
				title: (dataType == 'Cases') ? dataType+' by sex'+n : dataType+ ' cases by sex '+n,
				showlegend: true,
				legend: {"orientation": "v"},
				height:530,
				width:$("body #casesByGender").width(),
				responsive:true
			};
			
			
			Plotly.newPlot('casesByGender', pieChartData, layout, {displaylogo: false, modeBarButtonsToRemove: ['pan2d','select2d','lasso2d','resetScale2d','zoom','zoomOut2d','zoomIn2d','drawclosedpath','drawopenpath','autoScale2d','hoverClosestCartesian','hoverCompareCartesian','toggleSpikelines']});
				
			var dt = data;
			console.log(configs);
			$.each(configs, function(key, config){
				var name = key;
				var config = config.config;
				if(typeof(config.apiParameter) != 'undefined' || config.apiParameter != null){
					var period = getlast14days($("#eDate").html());
					console.log(period);
					$.getJSON("dataservice/data-dev.php?"+config.apiParameter+'&period='+period+"&disease="+disease, function(d) {
						var filteredData = filterDataByAdminLevel(d, adminLevel);
						plotlyPlot(filteredData, name, config, adminLevel);
					});
				}else{
					plotlyPlot(dt, name, config, adminLevel);
				}
			});
		});
	}
	
	function plotlyPlot(data, name, config, adminLevel){
		var containerWidth = config.containerWidth;
		if(name == 'casesByProvince' && adminLevel != "Nepal"){
			
		}else{
			var html = `<div class="col-xl-`+containerWidth+`">
							<div class="card mb-4">
								<div class="card-body" id="`+name+`"></div>
							</div>
						</div>`;
			$("#visualization").append(html);
					
			var renderers;
			
			if(config.renderers == 'plotly_renderers'){
				renderers = $.pivotUtilities.plotly_renderers[config.type];
			}else{
				renderers = $.pivotUtilities.gchart_renderers[config.type];
			}
			
			var width = $("body #"+name).width();
			var chartTitle = ' Cases by ' +config.title;
			var sum = $.pivotUtilities.aggregatorTemplates.sum;
			var numberFormat = $.pivotUtilities.numberFormat;
			var intFormat = numberFormat({digitsAfterDecimal: 0});
			$("#"+name).pivot(data, {
				rows: config.rows,
				cols: config.cols,
				renderer: renderers,
				aggregator: sum(intFormat)(["Value"]),
				rendererOptions: { plotly: {responsive:true, height: config.height, width:width, xaxis:config.xaxis, yaxis:config.yaxis, title:chartTitle}}
			});
		}
	}
	
	function getDateString(prevNext, dateString){
		var today = new Date();
		var date = new Date(dateString);
		if(prevNext == "previous"){
			date.setDate(date.getDate()-1);
		}else{
			if(date.toISOString().substring(0,10) < today.toISOString().substring(0,10)){
				date.setDate(date.getDate()+1);
			}
		}
		if(date.toISOString().substring(0,10) == today.toISOString().substring(0,10)){
			$("#nextDate").addClass('disabled');
		}else{
			$("#nextDate").removeClass('disabled');
		}
		
		return date.toISOString().substring(0,10);
	}
	
	function getlast14days(dateString){
		var date = new Date(dateString);
		var periods = [];
		periods.push(date.toISOString().substring(0,10).replace(/-/g, ""));
		for(i=0; i<14; i++){
			date.setDate(date.getDate()-1);
			periods.push(date.toISOString().substring(0,10).replace(/-/g, ""));
		}
		return periods.join(';');
	}
})