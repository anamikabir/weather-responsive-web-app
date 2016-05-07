function find_image(icon)
{
	var imageName; 
	if(icon=="clear-day") imageName="clear.png";
    else if(icon=="clear-night") imageName="clear_night.png";
    else if(icon=="rain") imageName="rain.png";
	else if(icon=="snow") imageName="snow.png";
    else if(icon=="sleet") imageName="sleet.png";
    else if(icon=="wind") imageName="wind.png";
    else if(icon=="fog") imageName="fog.png";
    else if(icon=="cloudy") imageName="cloudy.png";
    else if(icon=="partly-cloudy-day") imageName="cloud_day.png";
    else if(icon=="partly-cloudy-night") imageName="cloud_night.png";
	return imageName;
}

function preci_val(precipVal)
{
	var precipText="";
	if (precipVal>=0 && precipVal<0.002) precipText="None";
    else if(precipVal>=0.002 && precipVal<0.017) precipText="Very Light";
    else if(precipVal>=0.017 && precipVal<0.1) precipText="Light";
    else if(precipVal>=0.1 && precipVal<0.4) precipText="Moderate";
    else if(precipVal>=0.4) precipText="Heavy";
	return precipText;
}

function convertTimestamp(timestamp,timezone)
{
	var d=moment(timestamp*1000);
	var timee=d.tz(timezone).format("hh:mm A");
	return timee;
}
/*function convertTimestamp(timestamp) {
  var d = new Date(timestamp * 1000),	// Convert the passed timestamp to milliseconds
		yyyy = d.getFullYear(),
		mm = ('0' + (d.getMonth() + 1)).slice(-2),	// Months are zero based. Add leading 0.
		dd = ('0' + d.getDate()).slice(-2),			// Add leading 0.
		hh = d.getHours(),
		h = hh,
		min = ('0' + d.getMinutes()).slice(-2),		// Add leading 0.
		ampm = 'AM',
		time;
			
	if (hh > 12) {
		h = hh - 12;
		ampm = 'PM';
	} else if (hh === 12) {
		h = 12;
		ampm = 'PM';
	} else if (hh == 0) {
		h = 12;
	}
	//time = yyyy + '-' + mm + '-' + dd + ', ' + h + ':' + min + ' ' + ampm;
	time= 	 h + ':' + min + ' ' + ampm;
	return time;
}*/
function convertDate(timestamp) {
  var d = new Date(timestamp * 1000),	
		//mm = ('0' + (d.getMonth() + 1)).slice(-2),
	dd = ('0' + d.getDate()).slice(-2),			// Add leading 0.
	dateD;
	var month = new Array();
	month[0] = "Jan";
	month[1] = "Feb";
	month[2] = "Mar";
	month[3] = "Apr";
	month[4] = "May";
	month[5] = "Jun";
	month[6] = "Jul";
	month[7] = "Aug";
	month[8] = "Sep";
	month[9] = "Oct";
	month[10] = "Nov";
	month[11] = "Dec";
	var n = month[d.getMonth()];
	DateD= 	 n+ ' '+dd;
	return DateD;
}
function convertDay(timestamp) {
	var d = new Date(timestamp * 1000);
	var dayy=d.getDay(),weekday;
	switch(dayy)
	{
		case 0:	{weekday="Sunday"; break;}
		case 1:	{weekday="Monday"; break;}			
		case 2:	{weekday="Tuesday"; break;}
		case 3:	{weekday="Wednesday"; break;}
		case 4:	{weekday="Thursday"; break;}
		case 5:	{weekday="Friday"; break;}
		case 6:	{weekday="Saturday"; break;}
	}
	return weekday;
}
$.ajaxSetup ({
      // Disable caching of AJAX responses
      cache: false,
});
var $temp_Street="", $temp_City="", $temp_State="",$temp_Degree, $to_print="",$temper, $latt, $longg;

$(document).ready(function(){
	
	var html_text="";

	$("#submitButton").on("click", function () {
			var $error_in_doc= true;
			$temp_Street="";
			$temp_Degree="";
			$temp_State="";
			$temp_City="";
			var $StreetErr = true, $CityErr=true, $StateErr=true;
			$temp_Street= $("#Street_Add").val().trim();
			$temp_City=$("#City_Name").val().trim();
			$temp_State=$("#State_Name").val();
			if($temp_Street== "")
			{$("#StreetAddError").html("Please enter the street address"); $StreetErr = true;}
			else {$("#StreetAddError").html(""); $StreetErr = false;}
			if($temp_City== "")
			{$("#CityNameError").html("Please enter the city"); $CityErr=true;}
			else {$("#CityNameError").html(""); $CityErr=false;}
			if($temp_State==null)
			{$("#StateNameError").html("Please select a state"); $StateErr=true;}
			else {$("#StateNameError").html(""); $StateErr=false;}
			if(!$StreetErr && !$CityErr && !$StateErr)
			{$error_in_doc=false;}
			if(!$error_in_doc)
			{
				$temp_Degree = $('input[name="Degree"]:checked').val();
				$.ajax({
					url: 'http://cs-server.usc.edu:28147/index.php',
					cache: false,
					// this is the parameter list
					data: { StreetAdd: $temp_Street,
							CityName: $temp_City,
							StateName: $temp_State,
							Degree: $temp_Degree
							},
					dataType: "json",
					type: 'GET',
					success: function(data)					
					{
						
						var temp_unit, wind_unit, visibility_unit, pressure_unit;
						if($temp_Degree == "Farenheit")
						{	temp_unit="F";
							wind_unit="mph"; 
							visibility_unit="mi"; 
							pressure_unit="mb";
						}
						else
						{ 
						temp_unit="C";
						wind_unit="m/s"; 
						visibility_unit="km"; 
						pressure_unit="hPa"; }
						$latt= data.latitude;
						$longg=data.longitude;
						$to_print=find_image(data.currently.icon);
						$temper=data.currently.summary+","+Math.round(data.currently.temperature)+"\xB0"+temp_unit;
						html_text="";
						html_text+="<div class='container-fluid nopadding' id='Searchresult'><div id='content'><ul id='tabs' class='nav nav-pills' data-tabs='tabs'>";
						html_text+="<li class='active'><a href='#RightNow' data-toggle='tab'>Right Now</a></li><li><a href='#NextHours' data-toggle='tab'>Next 24 hours</a></li><li><a href='#NextDays' data-toggle='tab'>Next 7 days</a></li></ul>";
						html_text+="<div id='my-tab-content' class='tab-content'><div class='tab-pane active' id='RightNow'><div class='row'>";
						html_text+="<div id='ResultTabs' class='col-md-6' style='padding-right:0; margin:0'><div class='container-fluid'><div class='row'><div class='col-md-6' style='background-color:#F57D7E'><center><img class='img-responsive' src='";
						html_text+=find_image(data.currently.icon);
						html_text+="' width='100em' height='105em'></center></div><div class='col-md-6' style='background-color:#F57D7E'>";
						html_text+="<center><span style='color:white; font-size:0.9em'>"+data.currently.summary+" in "+$temp_City+","+$temp_State+"</span><br/>";
						html_text+="<span style='color:white; font-size:3em'>"+Math.round(data.currently.temperature)+"</span><sup><span style='color:white; font-size:1em'>&deg;"+temp_unit+"</span></sup><br/>";
						html_text+="<span style='color:blue; font-size:0.9em'>L: "+Math.round(data.daily.data[0].temperatureMin)+"&deg;</span>|";
						html_text+="<span style='color:green; font-size:0.9em'>H: "+Math.round(data.daily.data[0].temperatureMax)+"&deg;</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<img id=share_button class='img-responsive' style='display: inline-block' src='fb.png' width='20em' height='20em' onclick='sharePost()'></center></div></div></div>";
						html_text+="<div style='display:inline-block;' class='container row'><div class='col-md-6'><table class='table table-striped' style='width:100%' id='myTable1'><tbody><tr><td>Precipitation</td><td>"+preci_val(data.currently.precipIntensity)+"</td></tr>";
						html_text+="<tr><td>Chance of Rain</td><td>"+Math.round((data.currently.precipProbability)*100)+"%</td></tr>";
						html_text+="<tr><td>Wind Speed</td><td>"+(data.currently.windSpeed).toFixed(2)+" "+wind_unit+"</td></tr>";
						html_text+="<tr><td>Dew Point</td><td>"+Math.round(data.currently.dewPoint)+" &deg;"+temp_unit+"</td></tr>";
						html_text+="<tr><td>Humidity</td><td>"+Math.round((data.currently.humidity)*100)+"%</td></tr>";
						html_text+="<tr><td>Visibility</td><td>";
						if(data.currently.visibility)
							html_text+=(data.currently.visibility).toFixed(2)+" "+visibility_unit+"</td></tr>";
						else html_text+="NA</td></tr>";
						html_text+="<tr><td>Sunrise</td><td>"+convertTimestamp(data.daily.data[0].sunriseTime,data.timezone)+"</td></tr>";
						html_text+="<tr><td>Sunset</td><td>"+convertTimestamp(data.daily.data[0].sunsetTime,data.timezone)+"</td></tr></tbody></table>";
						html_text+="</div></div><div class='col-md-6'></div></div>";
						html_text+="<div id='ResultMap' style='padding-left:0;width:400px ;min-width:400px; height=400px; min-height:400px' class='col-md-6'></div>";
						html_text+="</div></div>";
						html_text+="<div class='tab-pane' id='NextHours'><div>";
						html_text+="<div><table id='tab2_details' width='100%' style='text-align:center; background-color:#337ab7; color:white'><thead><tr><th style='text-align:center; padding:0.5em;' width='20%'>Time</th>";
						html_text+="<th style='text-align:center; padding:0.5em;' width='20%'>Summary</th><th style='text-align:center; padding:0.5em;' width='20%'>Cloud Cover</th><th style='text-align:center; padding:0.5em;' width='20%'>Temp (&deg;"+temp_unit+")";
						html_text+="</th><th style='text-align:center; padding:0.5em;' width='20%'>View Details</th></tr></thead>";
						for (i=1; i<=24; i++)
						{
							html_text+="</table><table style='background-color:white; text-align:center; padding:2em; margin:0' width='100%'><tr><td width='20%'>";
							html_text+=convertTimestamp(data.hourly.data[i].time,data.timezone)+"</td><td width='20%'><center><img class='img-responsive' style='padding:0.1em' src='"+find_image(data.hourly.data[i].icon)+"' width='40em' height='40em'></center>";
							html_text+="</td><td width='20%'>"+Math.round((data.hourly.data[i].cloudCover)*100)+"%</td><td width='20%'>"+data.hourly.data[i].temperature+"</td><td width='20%'>";
							html_text+="<a data-toggle='collapse' href='#hour"+i+"' aria-expanded='false' aria-controls='collapseExample'><span class='glyphicon glyphicon-plus' aria-hidden='true'></span></a></td></tr></table>";
							html_text+="<div class='collapse' id='hour"+i+"'><div class='well' style='padding:1em; margin:0'><table style='text-align:center' width='100%'>";
							html_text+="<tr><th style='text-align:center; background-color:white;' width='25%'>Wind</th><th style='text-align:center; background-color:white;' width='25%'>Humidity</th><th style='text-align:center; background-color:white;' width='25%'>Visibility</th><th style='text-align:center; background-color:white;' width='25%'>Pressure</th></tr>";
							html_text+="<tr><td width='25%'>"+(data.hourly.data[i].windSpeed).toFixed(2)+wind_unit+"</td><td width='25%'>"+Math.round((data.hourly.data[i].humidity)*100)+"%</td><td width='25%'>"+(data.hourly.data[i].visibility)+visibility_unit+"</td><td width='25%'>"+(data.hourly.data[i].pressure)+pressure_unit+"</td></tr></table></div></div>";
							html_text+="<hr style='color:grey; margin:0 auto'>";
						}
						html_text+="</div></div></div><div class='tab-pane' id='NextDays'>";
						html_text+="<div class='row container-fluid' width='100%' style='background-color:#2F3439; margin:0 auto; padding:0'><div class='col-md-2'></div>";
						html_text+="<div id='mod1' data-toggle='modal' data-target='#myModal1' class='col-md-1' style='background-color:#327CB7; padding:0em; margin:0.5em; border-radius: 0.25em; color:white'><center><b>"+convertDay(data.daily.data[1].time)+"<br/><br/>"+convertDate(data.daily.data[1].time)+"</b><br/><br/><img class='img-responsive' src='"+find_image(data.daily.data[1].icon)+"' width='60em' height='60em'><br/>Min<br/>Temp<br/><span style='font-size:2em'>"+Math.round(data.daily.data[1].temperatureMin)+"&deg;</span><br/><br/>Max<br/>Temp<br/><span style='font-size:2em'>"+Math.round(data.daily.data[1].temperatureMax)+"&deg;</span></center><br/></div>";
						html_text+="<div id='mod2' data-toggle='modal' data-target='#myModal2' class='col-md-1' style='background-color:#EF423E; padding:0em; margin:0.5em; border-radius: 0.25em; color:white'><center><b>"+convertDay(data.daily.data[2].time)+"<br/><br/>"+convertDate(data.daily.data[2].time)+"</b><br/><br/><img class='img-responsive' src='"+find_image(data.daily.data[2].icon)+"' width='60em' height='60em'><br/>Min<br/>Temp<br/><span style='font-size:2em'>"+Math.round(data.daily.data[2].temperatureMin)+"&deg;</span><br/><br/>Max<br/>Temp<br/><span style='font-size:2em'>"+Math.round(data.daily.data[2].temperatureMax)+"&deg;</span></center><br/></div>";
						html_text+="<div id='mod3' data-toggle='modal' data-target='#myModal3' class='col-md-1' style='background-color:#E88E48; padding:0em; margin:0.5em; border-radius: 0.25em; color:white'><center><b>"+convertDay(data.daily.data[3].time)+"<br/><br/>"+convertDate(data.daily.data[3].time)+"</b><br/><br/><img class='img-responsive' src='"+find_image(data.daily.data[3].icon)+"' width='60em' height='60em'><br/>Min<br/>Temp<br/><span style='font-size:2em'>"+Math.round(data.daily.data[3].temperatureMin)+"&deg;</span><br/><br/>Max<br/>Temp<br/><span style='font-size:2em'>"+Math.round(data.daily.data[3].temperatureMax)+"&deg;</span></center><br/></div>";
						html_text+="<div id='mod4' data-toggle='modal' data-target='#myModal4' class='col-md-1' style='background-color:#A7A52E; padding:0em; margin:0.5em; border-radius: 0.25em; color:white'><center><b>"+convertDay(data.daily.data[4].time)+"<br/><br/>"+convertDate(data.daily.data[4].time)+"</b><br/><br/><img class='img-responsive' src='"+find_image(data.daily.data[4].icon)+"' width='60em' height='60em'><br/>Min<br/>Temp<br/><span style='font-size:2em'>"+Math.round(data.daily.data[4].temperatureMin)+"&deg;</span><br/><br/>Max<br/>Temp<br/><span style='font-size:2em'>"+Math.round(data.daily.data[4].temperatureMax)+"&deg;</span></center><br/></div>";
						html_text+="<div id='mod5' data-toggle='modal' data-target='#myModal5' class='col-md-1' style='background-color:#986EA8; padding:0em; margin:0.5em; border-radius: 0.25em; color:white'><center><b>"+convertDay(data.daily.data[5].time)+"<br/><br/>"+convertDate(data.daily.data[5].time)+"</b><br/><br/><img class='img-responsive' src='"+find_image(data.daily.data[5].icon)+"' width='60em' height='60em'><br/>Min<br/>Temp<br/><span style='font-size:2em'>"+Math.round(data.daily.data[5].temperatureMin)+"&deg;</span><br/><br/>Max<br/>Temp<br/><span style='font-size:2em'>"+Math.round(data.daily.data[5].temperatureMax)+"&deg;</span></center><br/></div>";
						html_text+="<div id='mod6' data-toggle='modal' data-target='#myModal6' class='col-md-1' style='background-color:#F57B7C; padding:0em; margin:0.5em; border-radius: 0.25em; color:white'><center><b>"+convertDay(data.daily.data[6].time)+"<br/><br/>"+convertDate(data.daily.data[6].time)+"</b><br/><br/><img class='img-responsive' src='"+find_image(data.daily.data[6].icon)+"' width='60em' height='60em'><br/>Min<br/>Temp<br/><span style='font-size:2em'>"+Math.round(data.daily.data[6].temperatureMin)+"&deg;</span><br/><br/>Max<br/>Temp<br/><span style='font-size:2em'>"+Math.round(data.daily.data[6].temperatureMax)+"&deg;</span></center><br/></div>";
						html_text+="<div id='mod7' data-toggle='modal' data-target='#myModal7' class='col-md-1' style='background-color:#D04270; padding:0em; margin:0.5em; border-radius: 0.25em; color:white'><center><b>"+convertDay(data.daily.data[7].time)+"<br/><br/>"+convertDate(data.daily.data[7].time)+"</b><br/><br/><img class='img-responsive' src='"+find_image(data.daily.data[7].icon)+"' width='60em' height='60em'><br/>Min<br/>Temp<br/><span style='font-size:2em'>"+Math.round(data.daily.data[7].temperatureMin)+"&deg;</span><br/><br/>Max<br/>Temp<br/><span style='font-size:2em'>"+Math.round(data.daily.data[7].temperatureMax)+"&deg;</span></center><br/></div>";
						html_text+="<div class='col-md-3'></div>";
						for(i=1;i<8;i++)
						{
							html_text+="<div class='modal fade' id='myModal"+i+"' tabindex='-1' role='dialog' aria-labelledby='myModalLabel"+i+"'><div class='modal-dialog' role='document'><div class='modal-content'><div class='modal-header'><button type='button' class='close' data-dismiss='modal' aria-label='Close'><span aria-hidden='true'>&times;</span></button><h4 class='modal-title' id='myModalLabel"+i+"'>Weather in "+$temp_City+" on "+convertDate(data.daily.data[i].time)+"</h4></div><div class='modal-body'><center><img class='img-responsive' src='"+find_image(data.daily.data[i].icon)+"' width='200em' height='200em'/><br/><h3>"+convertDay(data.daily.data[i].time)+": <span style='color:orange'>"+(data.daily.data[i].summary)+"</span></h3></center>";
							html_text+="<div class='row'><div class='col-md-4'><center><h4 style='text-align:center'>Sunrise Time</h4>"+convertTimestamp(data.daily.data[i].sunriseTime,data.timezone)+"</center></div><div class='col-md-4'><center><h4 style='text-align:center'>Sunset Time</h4>"+convertTimestamp(data.daily.data[i].sunsetTime,data.timezone)+"</center></div><div class='col-md-4'><center><h4 style='text-align:center'>Humidity</h4>"+Math.round((data.daily.data[i].humidity)*100)+"%</center></div></div><div class='row'><div class='col-md-4'><center><h4 style='text-align:center'>Wind Speed</h4>"+(data.daily.data[i].windSpeed)+wind_unit+"</center></div>";
							html_text+="<div class='col-md-4'><center><h4 style='text-align:center'>Visibility</h4>";
							if(data.daily.data[i].visibility)
							{html_text+=(data.daily.data[i].visibility)+visibility_unit+"</center></div><div class='col-md-4'><center><h4 style='text-align:center'>Pressure</h4>"+(data.daily.data[i].pressure)+pressure_unit+"</center></div></div></div><div class='modal-footer'><button type='button' class='btn btn-default' data-dismiss='modal'>Close</button></div></div></div></div>";
							}
							else
								html_text+="NA</center></div><div class='col-md-4'><center><h4 style='text-align:center'>Pressure</h4>"+(data.daily.data[i].pressure)+pressure_unit+"</center></div></div></div><div class='modal-footer'><button type='button' class='btn btn-default' data-dismiss='modal'>Close</button></div></div></div></div>";
						}
						html_text+="</div></div></div></div>";
						html_text+="<script type='text/javascript'>$(document).ready(function ($) {$('#tabs').tab();});</script></div>";
						$('#divWrap').html(html_text);
						$('#divWrap').css({"width":"80%","padding":"0","margin":"0 auto"});
						$('.nav-pills>li>a').css({"border-radius":"0.25em", "border-style":"solid", "border-color":"white", "border-width":"0.1em"});
						$('.table-striped > tbody > tr:nth-of-type(even)').css({"background-color": "#F3DEDB"});
						$('.table-striped > tbody > tr:nth-of-type(odd)').css({"background-color": "#F9F9F9"});
						InitMap();
						
					},
					error: function(){
					}
				});
				
			}		
    }); 

	$("#clearButton").on("click", function () {
		
		$("#Street_Add").val("");
		$("#City_Name").val("");
		$("#State_Name").val(null);
		$("[name=Degree]").filter("[value='Farenheit']").prop("checked",true);
		$("#StreetAddError").html("");
		$("#CityNameError").html("");
		$("#StateNameError").html("");
		$("#divWrap").html("");
		$temp_Street="";
		$temp_Degree="";
		$temp_State="";
		$temp_City="";
	});
	
	$("#share_button").on("click", function (){
			
						var $nameFB='Current weather in '+$temp_City+','+$temp_State;
						FB.ui(
						{
						method: 'feed',
						name: $nameFB,
						link: 'http://forecast.io/',
						picture: $to_print,
						caption: $temper,
						description: 'WEATHER INFORMATION FROM FORECAST.IO',
						message: 'Say something about this...'
						},function(response){if (!response || response.error) {
						alert('Not Posted');
						} else {
							alert('Posted successfully');
								}});
						});
});


function sharePost()
{
	var $nameFB='Current weather in '+$temp_City+','+$temp_State;
						FB.ui(
						{
						method: 'feed',
						name: $nameFB,
						link: 'http://forecast.io/',
						picture: $to_print,
						caption: $temper,
						description: 'WEATHER INFORMATION FROM FORECAST.IO',
						message: 'Say something about this...'
						},function(response){if (!response || response.error) {
						alert('Not Posted');
						} else {
							alert('Posted successfully');
						}});
			
}
function initMap() {
        var mapDiv = document.getElementById('ResultMap');
        var map = new google.maps.Map(mapDiv, {
          center: {lat: 44.540, lng: -78.546},
          zoom: 8
        });
      }

function CreateMap()
{
	try{
                var lon = $longg;
                var lat = $latt;
				
                var map = new OpenLayers.Map("ResultMap", 
                {
                    units:'m',
                    projection: "EPSG:900913",
                    displayProjection: new OpenLayers.Projection("EPSG:4326")
                });

                var osm = new OpenLayers.Layer.XYZ(
                    "osm",
                    "http://${s}.tile.openweathermap.org/map/osm/${z}/${x}/${y}.png",
                    {
                        numZoomLevels: 8, 
                        sphericalMercator: true
                    }
                );


                var mapnik = new OpenLayers.Layer.OSM();

                var opencyclemap = new OpenLayers.Layer.XYZ(
                    "opencyclemap",
                    "http://a.tile3.opencyclemap.org/landscape/${z}/${x}/${y}.png",
                    {
                        numZoomLevels: 8, 
                        sphericalMercator: true
                    }
                );

                var precipitation = new OpenLayers.Layer.XYZ(
                    "Precipitation forecasts",
                    "http://${s}.tile.openweathermap.org/map/precipitation/${z}/${x}/${y}.png",
                    {
                        numZoomLevels: 8, 
                        isBaseLayer: false,
                        opacity: 0.5,
                        sphericalMercator: true
                    }
                );

                var clouds = new OpenLayers.Layer.XYZ(
                    "Clouds forecasts",
                    "http://${s}.tile.openweathermap.org/map/clouds/${z}/${x}/${y}.png",
                    {
                        numZoomLevels: 19, 
                        isBaseLayer: false,
                        opacity: 0.6,
                        sphericalMercator: true

                    }
                );

                var centre = new OpenLayers.LonLat(lon, lat).transform(new OpenLayers.Projection("EPSG:4326"), 
								new OpenLayers.Projection("EPSG:900913"));
                map.addLayers([mapnik, osm, opencyclemap, precipitation, clouds]);
                    map.setCenter( centre, 6);
            }
            catch(e){
				alert("Error");
                $('#ResultMap').html("<p style='text-align:center;background-color:#F5F4F2'>The map is currently not available.<br>" + e + "</p>");
            }
}