function getTQBegin()
{

// 获取城市  
var cityUrl = "https://restapi.amap.com/v3/ip?output=json&key=761d856bd2714d9d486c9dfb3dcd796c";  
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
			var weatherMode = getWeather(live.weather);	
			document.getElementById("slide-0").getAttributeNode('data-weather').value = weatherMode;
			document.getElementById("item-0").className = getWeatherCss(weatherMode);
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
						
						var weatherMode = getWeather(weather_data[i].nighttemp);	
						document.getElementById("slide-" + i).getAttributeNode('data-weather').value = weatherMode;
						document.getElementById("item-" + i).className = getWeatherCss(weatherMode);
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

function getWeatherCss(str)
{
	switch(str)
	{
		case "sunny":
			return "wi wi-day-sunny wi-big";
			break;
		case "drizzle":
			return "wi wi-day-sprinkle wi-big";
			break;
		case "rain":
			return "wi wi-day-rain-wind wi-big";
			break;
		case "storm":
			return "wi wi-day-storm-showers wi-big";
			break;
		case "fallout":
			break;
		default:
			return "wi wi-day-sprinkle wi-big";
			break;
	}
}

function getWeather(str)
{
	switch(str)
	{
		case "晴":
		case "多云":
			return "sunny";
			break;

		case "阴":
			break;

		case "小雨":
		case "小雨-中雨":
			return "drizzle";
			break;

		case "中雨":
		case "大雨":
		case "冻雨":
		case "雨夹雪":
			return "rain";
			break;

		case "暴雨":
		case "大暴雨":
		case "特大暴雨":
		case "中雨-大雨":
		case "大雨-暴雨":
		case "暴雨-大暴雨":
		case "大暴雨-特大暴雨":
		case "阵雨":
		case "雷阵雨":
		case "雷阵雨并伴有冰雹":
			return "storm";
			break;
			
		case "阵雪":
		case "小雪":
		case "中雪":
		case "大雪":
		case "暴雪":
		case "小雪-中雪":
		case "中雪-大雪":
		case "大雪-暴雪":
			return "fallout";
			break;



		case "雾":
			break;
		case "轻雾":
			break;
		case "霾":
			return "fallout";
			break;
			
		case "沙尘暴":	
		case "浮尘":
		case "扬沙":
		case "强沙尘暴":


		case "飑":
		case "龙卷风":
		case "弱高吹雪":
			return "fallout";
			break;
			
		default:
			return "drizzle";
			break;
	}
}