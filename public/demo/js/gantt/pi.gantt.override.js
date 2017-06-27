Gantt.prototype.generatePuck = function(target, puckData, timelineSeq){
	var isLongPuck = false;
	var isMiddlePuck = false;
	var isShortPuck = false;
	var isNewPuck = true;
	//how long is every single pixel stand for (minutes)
	var blockTimeLenth = this.datas.blockScale * 60 / this.datas.blockWidth;
	//get the offset (minutes) of the first Arr time to the first coordination
	var timeOffset = getTimeOffset(this.options.firstArrTime, this.datas.blockScale);

	//remove the current puck before
	if($(target).find("#" + puckData.id).length > 0){
		isNewPuck = false;
		$(target).find("#" + puckData.id).remove();
	}

	var puck = $("<div/>");
	puck.attr("id", puckData.id);

	puck.addClass("puck_block");
	//if the puck is a baggage puck
	if(this.type == 'baggage') puck.addClass("baggage");
	puck.css({
		width: this.datas.blockWidth,
		height: this.datas.blockWidth - 5,
	})

	var puckWidth = 0;
	var puckLeft = 0;
	var puckTop = 0;
	var slotSeq = 0;

	if(puckData.assignedSlot != undefined){
		if(this.type == 'flight'){
			slotSeq = this.datas.slotList.indexOf(puckData.assignedSlot);
		}
		puckTop = slotSeq * this.datas.blockWidth;
		puck.attr("data-assignStatus", "assigned");
	}else{
		puck.attr("data-assignStatus", "unassign");
	}

	puck.attr("data-start", puckData.onBlkTime);
	puck.attr("data-end", puckData.offBlkTime);

	//puckWidth = getTotalDiffMinutes(Date.parse(puckData.offBlkTime), Date.parse(puckData.onBlkTime)) / blockTimeLenth - 2;
	//puckLeft = getTotalDiffMinutes(Date.parse(puckData.onBlkTime), this.options.firstArrTime) / blockTimeLenth + timeOffset / blockTimeLenth;

	if(puckData.type == "vehicle"){
		puckWidth = getTotalDiffMinutes(Date.parse(puckData.onBlkTime), Date.parse(puckData.offBlkTime)) / blockTimeLenth - 2;
		puckLeft = getTotalDiffMinutes(Date.parse(puckData.offBlkTime), this.options.firstArrTime) / blockTimeLenth + timeOffset / blockTimeLenth;

	}else{
		puckWidth = getTotalDiffMinutes(Date.parse(puckData.offBlkTime), Date.parse(puckData.onBlkTime)) / blockTimeLenth - 2;
		puckLeft = getTotalDiffMinutes(Date.parse(puckData.onBlkTime), this.options.firstArrTime) / blockTimeLenth + timeOffset / blockTimeLenth;

	}

	if(puckWidth > this.datas.longPuckWidth){
		isLongPuck = true;
	}else if(puckWidth > this.datas.middlePuckWidth && puckWidth <= this.datas.longPuckWidth){
		isMiddlePuck = true;
	}else{
		isShortPuck = true;
	}

	//the puck in timeline
	if(timelineSeq != undefined && timelineSeq > -1){
		puckTop = timelineSeq * this.datas.blockWidth;
	}

	puck.css({
		"position": "absolute",
		"display": "block",
		"left": puckLeft + "px",
		"top": puckTop + "px",
		"width": puckWidth + "px"
	});

	//puck.text(puckData.station + " --- " + puckData.amount);

	if(puckData.type == "vehicle"){
		puck.addClass("vehicle");

		puck.attr("data-toggle", "tooltip");
		puck.attr("data-placement", "top");
		puck.attr("data-html", true);
		puck.attr("title", "type: " + puckData.vehicleType + "<br>" + "name: " + puckData.vehicleName);
		//puck.text(puckData.vehicleName);
	}else{
		var inboundStation = $("<div/>");
		inboundStation.addClass("inboundStation");
		var inboundFltInfo = getFormatDateByLong(puckData.onBlkTime, "hh:mm");;
		inboundStation.html(inboundFltInfo);
		//puck.prepend(inboundStation);

		var outboundStation = $("<div/>");
		outboundStation.addClass("outboundStation");
		var outboundFltInfo = getFormatDateByLong(puckData.offBlkTime, "hh:mm");
		outboundStation.html(outboundFltInfo);
		//puck.append(outboundStation);

		puck.attr("data-toggle", "tooltip");
		puck.attr("data-placement", "top");
		puck.attr("data-html", true);
		puck.attr("title", inboundFltInfo + " ~ " + outboundFltInfo + "<br>"
			+ puckData.arrStation + " -- " + puckData.depStation);
	}



	//set special class for puck in timeline
	if(timelineSeq != "N/A" && timelineSeq > -1){
		puck.addClass("inTimeline")
		$(target).append(puck);
	}else{
		//append the puck into table of the assigned Gate id is not null
		if(target != "" && puckData.assignedSlot != undefined && puckData.assignedSlot != '0'){
			$(target).append(puck);
		}
	}

	if(this.options.isAssigning){
		$(target).append(puck);
	}

	return puck;
}

Gantt.prototype.showGanttItemInfo = function(id){

}


Gantt.prototype.addPuckMoveListener = function(){//disable the click listener of this case

}

Gantt.prototype.puckSelectListener = function(){//disable the select listener of this case

}


Gantt.prototype.getUnassinedGanttItems = function(){
	var before = (new Date()).getTime();
	//must to sort the items by on block time first before add to unassigned section
	var ganttItems = this.getGanttItems();
	ganttItems = ganttItems.sort(sortOnBlkTime);

	var unassignedGanttItems = [];
	for(var i = 0; i < ganttItems.length; i++){
		if(ganttItems[i].datas.assignedSlot == undefined || ganttItems[i].datas.assignedSlot == ""){
			//put sorted items into gantt
			this.appendUnassignedItem(unassignedGanttItems, ganttItems[i]);
		}
	}
	//lenth need to be added 1
	this.datas.maxUnassignedItemRows = unassignedGanttItems.length;

	checkProcessTime("JS - Time for getting Unassigned items", before);
	return unassignedGanttItems;
}

Gantt.prototype.drawTimelinePucks = function(unassignedGanttItems){
	var before = (new Date()).getTime();
	var timelineData = $("<div id='ganttContainer-data'/>");

	if(unassignedGanttItems && unassignedGanttItems.length > 0){
		for(var i=0; i < unassignedGanttItems.length; i++){
			for(var j=0; j<unassignedGanttItems[i].items.length; j++){
				var gitem = unassignedGanttItems[i].items[j];
				//generate the puck into the timeline table if there is no onBlkTime
				if(gitem.datas.onBlkTime && gitem.datas.assignedSlot == undefined){
					this.generatePuck(timelineData, gitem.datas, i);
				}
			}
		}
	}

	var $datatable = $(this.datas.itemInTimelineTarget).find("#datatable");
	timelineData.prependTo($datatable);
	//set the height of the data area
	timelineData.height($("#ganttContainer-data").parent().height() - 2);

	checkProcessTime("JS - Drawing Unassigned items", before);
}

Gantt.prototype.generateSolts = function (){
	var soltItems = this.datas.soltItems
	this.datas.slotList = [];
	$("#soltTable").html("");

	this.options.rowNumber = 0;
	if(soltItems && soltItems.length > 0){
		var table = $("<table/>");
		for(var i=0; i < soltItems.length; i++){
			//add the gate name to the array, need to get the index via name later.
			this.datas.slotList[i] = soltItems[i];

			var tr = $("<tr/>");
			var row = $("<td/>");
			row.addClass("tRow");
			row.addClass("gateRow");
			row.text(soltItems[i]);

			//row can have multiple lines if the object is carousel object

			row.attr("height", this.datas.blockWidth);
			this.options.rowNumber++;

			tr.append(row);
			table.append(tr);
		}
		$("#soltTable").append(table);
	}
	$(".gateRow").popover({"container":"body"});

}

Gantt.prototype.ganttDataProcess = function($gantt){
	if($gantt){
		var today = (new Date()).getTime();
		return new GanttItem({
			id: $gantt.id,
			type: $gantt.type,
			vehicleType: $gantt.VehicleType,
			vehicleName: $gantt.VehicleName,
			depStation: $gantt.DepStation,
			arrStation: $gantt.ArrStation,
			onBlkTime: getFormatDateByLong(today + $gantt.DepTime * 60 * 1000, "yyyy-MM-dd hh:mm"),
			offBlkTime: getFormatDateByLong(today + $gantt.ArrTime * 60 * 1000, "yyyy-MM-dd hh:mm"),
			assignedSlot: $gantt.Flight,
			index: $gantt.index ? $gantt.index : -1,
		});
	}
}
