function getTQBegin()
{

// 获取城市  
var cityUrl = "https://restapi.amap.com/v3/ip?output=json&key=761d856bd2714d9d486c9dfb3dcd796c&callback=?";  
var cityName = "北京";
var cityAdCode = "110101";

//获取天气
$.getJSON(cityUrl, function(data) {
    if(data.status != "1" || data.info != "OK")
        return;
    cityName = data.city;
    cityAdCode = data.adcode;
    $.getJSON("https://restapi.amap.com/v3/weather/weatherInfo?city="+cityName+"&key=761d856bd2714d9d486c9dfb3dcd796c",
    function(gaodeTQ)
    {
        try { 
            if (gaodeTQ == null || gaodeTQ.info != "OK" || gaodeTQ.status != "1" || gaodeTQ.lives.count == 0) 
               return; 
            var live = gaodeTQ.lives[0];
            var reporttime = live.reporttime;
            var dateSplit = reporttime.split(" ");
            var time = dateSplit[1];	
            dateSplit = dateSplit[0].split("-")
            var day = dateSplit[2];
            var month = dateSplit[1];
            var year = dateSplit[0];

            document.getElementById("Temperature-0").innerHTML = live.temperature + "°<small>C</small>";
            document.getElementById("Weather-0").innerHTML = live.weather;
        }
        catch (err) {  
            alert(err); } 


    $.getJSON("https://restapi.amap.com/v3/weather/weatherInfo?city="+cityName+"&extensions=all&key=761d856bd2714d9d486c9dfb3dcd796c",
    function(gaodeTQ)
    {
        try {  
            if (gaodeTQ == null || gaodeTQ.info != "OK" || gaodeTQ.status != "1" || gaodeTQ.forecasts.count == 0) 
               return;  
               
            if (gaodeTQ.forecasts[0].casts.length > 0) {  
                var weather_data = gaodeTQ.forecasts[0].casts;
                for(var i=0;i<weather_data.length;i++)
                {
                    var strDate = weather_data[i].date;
                    var dateSplit=strDate.split("-");								
                    var day = dateSplit[2];
                    var month = dateSplit[1];
                    var year = dateSplit[0];

                    document.getElementById("date-" + i).innerHTML = month + "/" + day;
                    if(i == 0)
                    {
                        document.getElementById("weekAndMonth-" + i).innerHTML = getWeek(weather_data[i].week) + ", " + day + "<sup>th</sup> of " + getMonth(month) + " " + year;
                    }
                    else if(weather_data[i] != null)				
                    {
                        document.getElementById("weekAndMonth-" + i).innerHTML = getWeek(weather_data[i].week) + ", " + day + "<sup>th</sup> of " + getMonth(month) + " " + year;
                        document.getElementById("Temperature-" + i).innerHTML = weather_data[i].daytemp + "<small>~ " +  weather_data[i].nighttemp + "°C</small>";
                        document.getElementById("Weather-" + i).innerHTML = "昼:" +  weather_data[i].dayweather + " ~ 夜:" +  weather_data[i].nightweather;
                    }
                }
            }
            } catch (err) {  
                alert(err);  } 
    }
);
    }
    );		

});	

}

function getWeek(str)
{
	switch(str)
	{
		case "1":
			return "Monday";
			break;
		case "2":
    		return "Tuesday";
			break;
		case "3":
            return "Wednesday";
			break;
		case "4":
			return "Thursday";
			break;
		case "5":
			return "Friday";
			break;
    	case "6":
			return "Saturday";
			break;
		case "7":
			return "Sunday";
			break;
		default:
			return "Monday";
			break;
	}
}

function getMonth(str)
{
	switch(str)
	{
		case "01":
		    return "January";
			break;
		case "02":
			return "February";
			break;
		case "03":
			return "March";
			break;
		case "04":
			return "April";
			break;
		case "05":
			return "May";
			break;
		case "06":
			return "June";
			break;
		case "07":
			return "July";
			break;
		case "08":
			return "August";
			break;
		case "09":
			return "September";
			break;
		case "10":
			return "October";
			break;
		case "11":
			return "November";
			break;
		case "12":
			return "December";
			break;
		default:
			return "December";
			break;
	}
}

function getWeather(str)
{
	switch(str)
	{
		case "小雨":
			break;
		case "大雨":
			break;
		case "雷雨":
			break;
		case "雾霾":
			break;
		default:
			break;
	}
}