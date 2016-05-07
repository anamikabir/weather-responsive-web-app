<?php 
	header("Access-Control-Allow-Origin: *");
    if(isset($_GET["StreetAdd"]) and isset($_GET["CityName"]) and isset($_GET["StateName"]))
    {
		$myAddr=$_GET["StreetAdd"].",".$_GET["CityName"].",".$_GET["StateName"];
        $myAddr= str_replace (" ", "+", urlencode($myAddr));
        $geocodeURL="https://maps.google.com/maps/api/geocode/xml?address=".$myAddr;

        $xml= simplexml_load_file($geocodeURL) or die("url not loading<br/>");
		if($xml->status=="OK")
                {
                    $latitude=$xml->result->geometry->location->lat;
                    $longitude=$xml->result->geometry->location->lng;
                    if($_GET["Degree"]=="Farenheit")
                        $units="us";
                    else
                        $units="si";
                    $myForecastKey="0077257bda00f6880f69352c84492cfd"; 
                    $forecastURL="https://api.forecast.io/forecast/".$myForecastKey."/".$latitude.",".$longitude."?units=".$units."&exclude=flags";
                    $jsonResponse = file_get_contents($forecastURL);
                    $json = json_decode($jsonResponse,true);
					echo json_encode($json); 
				}
			else
				echo "Could not load";
	}
?>