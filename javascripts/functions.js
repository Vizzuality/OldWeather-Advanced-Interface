
	function convertDate(date) {
		var day_sufix ='';
		if (date.day==1) {
			day_sufix = 'st';
		} else if (date.day==2) {
			day_sufix = 'nd';
		} else if (date.day==3) {
			day_sufix = 'rd';
		} else {
			day_sufix = 'th';
		}
		
		var month = "";
		switch (date.month) {
			case 0: month="January"; break;
			case 1: month="February"; break;
			case 2: month="March"; break;
			case 3: month="April"; break;
			case 4: month="May"; break;
			case 5: month="June"; break;
			case 6: month="July"; break;
			case 7: month="August"; break;
			case 8: month="September"; break;
			case 9: month="October"; break;
			case 10: month="November"; break;
			default: month="December";
		}
		
		return date.day+day_sufix+' '+month+', '+date.year;
	}