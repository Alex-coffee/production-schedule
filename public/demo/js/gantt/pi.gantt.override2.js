var areaColorMap = {
	"C": "#1c84c6",
	"D": "#ed5565",
	"E": "#f8ac59",
	"M": "#8e44ad",
	"9": "#95a5a6",
}

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

	puckWidth = getTotalDiffMinutes(puckData.offBlkTime, puckData.onBlkTime) / blockTimeLenth - 2;
	puckLeft = getTotalDiffMinutes(puckData.onBlkTime, this.options.firstArrTime) / blockTimeLenth + timeOffset / blockTimeLenth;

	//the puck in timeline
	if(timelineSeq != undefined && timelineSeq > -1){
		puckTop = timelineSeq * this.datas.blockWidth;
	}

	puck.css({
		"position": "absolute",
		"display": "block",
		"left": puckLeft + "px",
		"top": puckTop + "px",
		"width": puckWidth + "px",
		"border-color": (areaColorMap[puckData.gateArea] ? areaColorMap[puckData.gateArea] : "#1ab394")
	});

	puck.attr("data-toggle", "tooltip");
	puck.attr("data-placement", "top");
	puck.attr("data-html", true);


	var tooltipContent = [];
	puckData.subTasks.forEach(function (subtask) {
		var content = "<span>航班:</span>" + subtask.flightNum + "<span class='m-l-sm'>机型:</span>" + subtask.fleetType +
			"<span class='m-l-sm'>时间:</span>" + getFormatDateByLong(subtask.depTime, "hh:mm") + "<span class='m-l-sm'>停机位:</span>" + subtask.gate;
		tooltipContent.push(content);
	})

	puck.attr("title", tooltipContent.join("<br>"));

	if(puckWidth > 35) {
		if(puckData.subTasks.length == 1){
			puck.text("区域" + puckData.gateArea + ",  " + puckData.subTasks[0].flightNum);
		}else{
			puck.text("区域" + puckData.gateArea + ",  " + puckData.subTasks[0].flightNum + "等, 共" + puckData.subTasks.length + "个任务");
		}

	}

	var inboundStation = $("<div/>");
	inboundStation.addClass("inboundStation");
	var inboundFltInfo = "";
	inboundFltInfo += getFormatDateByLong(puckData.onBlkTime, "hh:mm");;
	inboundStation.html(inboundFltInfo);
	puck.prepend(inboundStation);


	var outboundStation = $("<div/>");
	outboundStation.addClass("outboundStation");
	var outboundFltInfo = "";
	outboundFltInfo += getFormatDateByLong(puckData.offBlkTime, "hh:mm");
	outboundStation.html(outboundFltInfo);
	puck.append(outboundStation);



	if(puckData.delay > 0){
		var delayBlockWidth = puckData.delay / blockTimeLenth - 2;
		var delayBlock = $("<div/>");
		delayBlock.addClass("delayBlock");

		delayBlock.css({
			width: delayBlockWidth,
			height: this.datas.blockWidth - 6,
		})

		puck.prepend(delayBlock)
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


Gantt.prototype.generateSolts = function (){
	var soltItems = this.datas.soltItems
	this.datas.slotList = [];
	$("#soltTable").html("");

	this.options.rowNumber = 0;
	if(soltItems && soltItems.length > 0){
		var table = $("<table/>");
		for(var i=0; i < soltItems.length; i++){
			//add the gate name to the array, need to get the index via name later.
			this.datas.slotList[i] = soltItems[i].groupId;

			var tr = $("<tr/>");
			var row = $("<td/>");
			row.addClass("tRow");
			row.addClass("gateRow");
			row.html(getName() + " 工号: 000" + (i + 1) +
				"<br>类型: " + soltItems[i].staffGroupType + " " + (soltItems[i].driveLisence ? '需要': '不要') + "执照");

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

		return new GanttItem({
			id: $gantt.id,
			fleetType: $gantt.fleetType,
			flightNum: $gantt.flightNum,
			gate: $gantt.gate,
			gateArea: $gantt.gateArea,
			groupId: $gantt.groupId,
			depTime: $gantt.depTime,
			onBlkTime: $gantt.startTime,
			offBlkTime: $gantt.endTime,
			assignedSlot: $gantt.groupId,
			subTasks: $gantt.subTask,
			index: $gantt.index ? $gantt.index : -1,
		});
	}
}


function getName(){
	var familyNames = new Array(
		"赵", "钱", "孙", "李", "周", "吴", "郑", "王", "冯", "陈",
		"褚", "卫", "蒋", "沈", "韩", "杨", "朱", "秦", "尤", "许",
		"何", "吕", "施", "张", "孔", "曹", "严", "华", "金", "魏",
		"陶", "姜", "戚", "谢", "邹", "喻", "柏", "水", "窦", "章",
		"云", "苏", "潘", "葛", "奚", "范", "彭", "郎", "鲁", "韦",
		"昌", "马", "苗", "凤", "花", "方", "俞", "任", "袁", "柳",
		"酆", "鲍", "史", "唐", "费", "廉", "岑", "薛", "雷", "贺",
		"倪", "汤", "滕", "殷", "罗", "毕", "郝", "邬", "安", "常",
		"乐", "于", "时", "傅", "皮", "卞", "齐", "康", "伍", "余",
		"元", "卜", "顾", "孟", "平", "黄", "和", "穆", "萧", "尹"
	);
	var givenNames = new Array(
		"子璇", "淼", "国栋", "夫子", "瑞堂", "甜", "敏", "尚", "国贤", "贺祥", "晨涛",
		"昊轩", "易轩", "益辰", "益帆", "益冉", "瑾春", "瑾昆", "春齐", "杨", "文昊",
		"东东", "雄霖", "浩晨", "熙涵", "溶溶", "冰枫", "欣欣", "宜豪", "欣慧", "建政",
		"美欣", "淑慧", "文轩", "文杰", "欣源", "忠林", "榕润", "欣汝", "慧嘉", "新建",
		"建林", "亦菲", "林", "冰洁", "佳欣", "涵涵", "禹辰", "淳美", "泽惠", "伟洋",
		"涵越", "润丽", "翔", "淑华", "晶莹", "凌晶", "苒溪", "雨涵", "嘉怡", "佳毅",
		"子辰", "佳琪", "紫轩", "瑞辰", "昕蕊", "萌", "明远", "欣宜", "泽远", "欣怡",
		"佳怡", "佳惠", "晨茜", "晨璐", "运昊", "汝鑫", "淑君", "晶滢", "润莎", "榕汕",
		"佳钰", "佳玉", "晓庆", "一鸣", "语晨", "添池", "添昊", "雨泽", "雅晗", "雅涵",
		"清妍", "诗悦", "嘉乐", "晨涵", "天赫", "玥傲", "佳昊", "天昊", "萌萌", "若萌"
	);
	var i = parseInt( 10 * Math.random()) * 10 + parseInt(10 * Math.random());
	var familyName = familyNames[i];
	var j = parseInt( 10 * Math.random()) * 10  + parseInt(10 * Math.random());
	var givenName = givenNames[i];
	var name = familyName + givenName;
	return name;
}