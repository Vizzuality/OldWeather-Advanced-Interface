
	// Request controller

	function request(uuid,type,position,new_value,old_value){
		request_queue[uuid] = 'active';
		$.ajax(
			url:"http://localhost:8888/fake/",
			type: "POST",
			success: function(result) {
				
			},
			error: function(e) {
				
			}
		);
	}

	request.prototype.requestOk = function() {
		
	}

	request.prototype.requestKo = function() {
		
	}




	// Request queue
	var request_queue={};

	
