
	// Convert date
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


	// Get date from string
	function getDate(date) {
		var date_parts = date.split(' ');
		var day = parseInt(date_parts[0].substr(0,date_parts[0].length-2));

		
		var month;
		var month_str = date_parts[1].substr(0,date_parts[1].length-1);

		switch (month_str) {
			case "January": month=0; break;
			case "February": month=1; break;
			case "March": month=2; break;
			case "April": month=3; break;
			case "May": month=4; break;
			case "June": month=5; break;
			case "July": month=6; break;
			case "August": month=7; break;
			case "September": month=8; break;
			case "October": month=9; break;
			case "November": month=10; break;
			default: month=11;
		}
		
		return {day:day, month:month, year:parseInt(date_parts[2])};
	}


	// Create a random id
	function randomId() {
	  var uuid= '';
      for (i = 0; i < 32; i++) {
       uuid += Math.floor(Math.random() * 16).toString(16);
      }
      return uuid;
	}


	function convertMonth(number){
		switch (number) {
			case 0: return "January"; break;
			case 1: return "February"; break;
			case 2: return "March"; break;
			case 3: return "April"; break;
			case 4: return "May"; break;
			case 5: return "June"; break;
			case 6: return "July"; break;
			case 7: return "August"; break;
			case 8: return "September"; break;
			case 9: return "October"; break;
			case 10: return "November"; break;
			default: return "December";
		}
	}

	function getMonth(month_str) {
		switch (month_str) {
			case "January": return 0; break;
			case "February": return 1; break;
			case "March": return 2; break;
			case "April": return 3; break;
			case "May": return 4; break;
			case "June": return 5; break;
			case "July": return 6; break;
			case "August": return 7; break;
			case "September": return 8; break;
			case "October": return 9; break;
			case "November": return 10; break;
			default: return 11;
		}
	}


	// Stop propagation function
	function stopPropagation(ev) {
		ev.stopPropagation();
		ev.preventDefault();
	}