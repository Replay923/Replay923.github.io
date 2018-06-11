var M_Event = {
    _listeners: {},    
    // 添加
    addEvent: function(type, fn) {
        if (typeof this._listeners[type] === "undefined") {
            this._listeners[type] = [];
        }
        if (typeof fn === "function") {
            this._listeners[type].push(fn);
        }    
        return this;
    },
    // 触发
    fireEvent: function(type) {
        var arrayEvent = this._listeners[type];
        if (arrayEvent instanceof Array) {
            for (var i=0, length=arrayEvent.length; i<length; i+=1) {
                if (typeof arrayEvent[i] === "function") {
                    arrayEvent[i]({ type: type });    
                }
            }
        }    
        return this;
    },
    // 删除
    removeEvent: function(type, fn) {
    	var arrayEvent = this._listeners[type];
        if (typeof type === "string" && arrayEvent instanceof Array) {
            if (typeof fn === "function") {
                // 清除当前type类型事件下对应fn方法
                for (var i=0, length=arrayEvent.length; i<length; i+=1){
                    if (arrayEvent[i] === fn){
                        this._listeners[type].splice(i, 1);
                        break;
                    }
                }
            } else {
                // 如果仅仅参数type, 或参数fn邪魔外道，则所有type类型事件清除
                delete this._listeners[type];
            }
        }
        return this;
    }
};

function getTQBegin()
{

// 获取城市  
var cityUrl = "https://restapi.amap.com/v3/ip?output=json&key=761d856bd2714d9d486c9dfb3dcd796c";  
var cityName = "地点：北京";
var cityAdCode = "110101";

//获取天气
$.getJSON(cityUrl, function(data) {
    if(data.status != "1" || data.info != "OK")
        return;
    cityName = data.city;
    cityAdCode = data.adcode;
    $.getJSON("https://restapi.amap.com/v3/weather/weatherInfo?city="+cityAdCode+"&key=761d856bd2714d9d486c9dfb3dcd796c",
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
			document.getElementById("slide-0").getAttributeNode('data-weather').value = getWeatherShow(weatherMode);		
			document.getElementById("item-0").className = getWeatherCss(weatherMode);

			M_Event.fireEvent("updateWeather");
        }
        catch (err) {  
            alert(err); } 


    $.getJSON("https://restapi.amap.com/v3/weather/weatherInfo?city="+cityAdCode+"&extensions=all&key=761d856bd2714d9d486c9dfb3dcd796c",
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
					
					document.getElementById("cityName-" + i).innerHTML = "地点：" + cityName;
                    document.getElementById("date-" + i).innerHTML = month + "/" + day;
                    if(i == 0)
                    {
                        document.getElementById("weekAndMonth-" + i).innerHTML = getWeek(weather_data[i].week) + ", " + day + "<sup>th</sup> of " + getMonth(month) + " " + year;
                    }
                    else if(weather_data[i] != null)				
                    {
						var tempWeatherName = weather_data[i].dayweather;
						if(tempWeatherName=="晴" || tempWeatherName=="多云")
							tempWeatherName = weather_data[i].nightweather;
						var weatherMode = getWeather(tempWeatherName);

                        document.getElementById("weekAndMonth-" + i).innerHTML = getWeek(weather_data[i].week) + ", " + day + "<sup>th</sup> of " + getMonth(month) + " " + year;
                        document.getElementById("Temperature-" + i).innerHTML = weather_data[i].daytemp + "<small>~ " +  weather_data[i].nighttemp + "°C</small>";
													
						document.getElementById("slide-" + i).getAttributeNode('data-weather').value = getWeatherShow(weatherMode);
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
			return "wi wi-sprinkle wi-big";
			break;
		case "rain":
			return "wi wi-rain wi-big";
			break;
		case "sleet":
			return "wi wi-sleet wi-big";
			break;
		case "snow":
			return "wi wi-snow wi-big";
			break;
		case "storm":
			return "wi wi-thunderstorm wi-big";
			break;
		case "fog":
			return "wi wi-fog wi-big";
			break;
		case "cloudy":
			return "wi wi-cloudy wi-big";
			break;
		case "cloud":
			return "wi wi-day-cloudy wi-big";
			break;
		case "tornado":
			return "wi wi-tornado wi-big";
			break;
		case "sandstorm":
			return "wi wi-sandstorm wi-big";
			break;
		default:
			return "wi wi-day-sprinkle wi-big";
			break;
	}
}

function getWeatherShow(str)
{
	switch(str)
	{
		case "sunny":
		case "cloud":
			return "sunny";
			break;

		case "cloudy":
		case "drizzle":
			return "drizzle";
			break;
		case "rain":
		case "snow":
			return "rain";
			break;
		case "storm":
			return "storm";
			break;
		case "tornado":
		case "sandstorm":
		case "fog":
			return "fallout";
			break;

		default:
			return "drizzle";
			break;
	}
}

function getWeather(str)
{
	switch(str)
	{
		case "晴":
			return "sunny";
			break;
		
		case "多云":
			return "cloud";
			break;
		case "阴":
			return "cloudy";
			break;

		case "小雨":
		case "小雨-中雨":
			return "drizzle";
			break;

		case "中雨":
		case "大雨":
			return "rain";
			break;

		case "冻雨":
		case "雨夹雪":
			return "sleet";
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
			return "snow";
			break;

		case "雾":
		case "轻雾":
		case "霾":
			return "fog";
			break;
			
		case "沙尘暴":	
		case "浮尘":
		case "扬沙":
		case "强沙尘暴":
		case "弱高吹雪":
			return "sandstorm";
			break;

		case "飑":
		case "龙卷风":
			return "tornado";
			break;
		
			
		default:
			return "drizzle";
			break;
	}
}