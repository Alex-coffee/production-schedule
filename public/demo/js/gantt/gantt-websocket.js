if(host == undefined){
	var host = "ws://localhost:8080/GateSystem/GateSystem-websocket";
}
var wSocket = new WebSocket(host);
var browserSupport = ("WebSocket" in window) ? true : false;

// called body onLoad()
function initializeReception() {
	if (browserSupport) {
		wSocket.onopen = function() {
			appendMessage( "Web Socket is connected, sending data");
			wSocket.send("ping");
			
		};
	} else {
		// The browser doesn't support WebSocket
		alert("WebSocket is NOT supported by your Browser!");
	}
}

toastr.options = {
  "closeButton": true,
  "debug": false,
  "progressBar": true,
  "positionClass": "toast-top-right",
  "onclick": null,
  "showDuration": "400",
  "hideDuration": "1000",
  "timeOut": "7000",
  "extendedTimeOut": "1000",
  "showEasing": "swing",
  "hideEasing": "linear",
  "showMethod": "fadeIn",
  "hideMethod": "fadeOut"
}

// called when a message is received
wSocket.onmessage = function(event) {
//	var ganttNotify = $.parseJSON(event.data);
//	if(2 == ganttNotify.type){
////		toastr.success("Flight has been updated");
//		ganttTarget.gantt("update", ganttNotify.object);
//	}
	
	var ganttNotifies = $.parseJSON(event.data);
	try {
		var infoArray = []
		if(ganttNotifies.length > 0){
			for(var i in ganttNotifies){
				if(0 == ganttNotifies[i].type){
					infoArray.push(ganttNotifies[i]);
				}
				if(1 == ganttNotifies[i].type && ganttTarget != null){
					ganttTarget.gantt("addItem", ganttNotifies[i].object);
				}
				if(2 == ganttNotifies[i].type && ganttTarget != null){
					ganttTarget.gantt("updateItem", ganttNotifies[i].object);
				}
				if(3 == ganttNotifies[i].type && ganttTarget != null){
					ganttTarget.gantt("deleteItem", ganttNotifies[i].object);
				}
				if(4 == ganttNotifies[i].type && ganttTarget != null){
					ganttTarget.gantt("updateGanttViolations");
				}
				if(5 == ganttNotifies[i].type){
					window.location.reload();
				}
				if(6 == ganttNotifies[i].type && ganttTarget != null){
					ganttTarget.gantt("updateUnassignedRows", ganttNotifies[i].object);
				}
			}
		}
		
		//show notifications
		if(infoArray.length > 5){
			toastr.success(infoArray[0].message + "<br>" + infoArray[1].message + "<br>" + infoArray[2].message + "<br>...", "共有" + infoArray.length + "条信息");
		}else{
			if(infoArray.length > 0){
				for(var j in infoArray){
					toastr.success(infoArray[j].message);
				}
			}
		}
		if(infoArray.length > 0){
			appendItemInNotificationList("#notificationList", infoArray);
		}
		
	}catch(e){
		console.log("Notification Error: " + e);
	}
	
};

function appendItemInNotificationList(target, items){
	if($(target)){
		for(var i in items){
			var info = $("<li class='info-element'/>");
			if(items[i].message != ""){
				info.text(items[i].message);
				$(target).prepend(info);
			}
		}
	}
}

// called when socket closes
wSocket.onclose = function() {
	// websocket is closed.
//	appendMessage("Connection is closed...");
};

function increasePuckWidth(){
	var puck = $(".puck_block")[0];
	
	$(puck).width($(puck).width() + 50);
	$(puck).addClass("socketSelected");
}

function decreasePuckWidth(){
	var puck = $(".puck_block")[0];
	
	if($(puck).width() < 100){
		alert("Cannot Reduce Anymore");
	}else{
		$(puck).width($(puck).width() - 50);
	}
//	setTimeout(function(){ $(puck).width($(puck).width() - 50); }, 300);
	$(puck).addClass("socketSelected");
}