function getWeek(str)
{
	switch(str)
	{
		case "周一":
			return "Monday";
			break;
		case "周二":
    		return "Tuesday";
			break;
		case "周三":
            return "Wednesday";
			break;
		case "周四":
			return "Thursday";
			break;
		case "周五":
			return "Friday";
			break;
    	case "周六":
			return "Saturday";
			break;
		case "周日":
			return "Sunday";
			break;
		default:
			return "Monday";
			break;
	}
}

function getMonth(id)
{
	switch(id)
	{
		case 1:
		    return "January";
			break;
		case 2:
			return "February";
			break;
		case 3:
			return "March";
			break;
		case 4:
			return "April";
			break;
		case 5:
			return "May";
			break;
		case 6:
			return "June";
			break;
		case 7:
			return "July";
			break;
		case 8:
			return "August";
			break;
		case 9:
			return "September";
			break;
		case 10:
			return "October";
			break;
		case 11:
			return "November";
			break;
		case 12:
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
