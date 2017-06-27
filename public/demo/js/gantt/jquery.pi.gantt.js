
	
	function checkProcessTime(actionName, before){
		var after = (new Date()).getTime();
		var seconds = (after - before) / 1000;
		console.log(actionName + " takes " + seconds + " second(s).");
	}
	
	var Gantt = function (element, datas, options) {
	    this.init('flight', element, datas, options)
	 }
	
	Gantt.prototype = {
	    constructor: Gantt
	  , init: function (type, element, datas, options) {
		  var before = (new Date()).getTime();
		  var $this = $(this);
	      this.type = type
	      this.checkinViewListener = null;
	      this.$element = $(element);
	      this.datas = datas
	      this.options = $.extend({}, $.fn.gantt.defaults, $this.data(), typeof options == 'object' && options)
	      this.generateHiddenItems();
	      this.dataProcess();
	      this.drawGantt();
	      //prepend the scale slider
	      if(this.datas.showScaleSlider){
			this.generateScaleSlider(this.$element);
		  }
	      if(this.datas.showSearcher){
			 this.generateGanttItemSeacher();
	      }
	    }
		, ganttDataProcess: function($gantt){
			if($gantt){
				return new GanttItem({
					id: $gantt.id,
					aircraft: $gantt.aircraft,
					registration: $gantt.registration,
					acType: $gantt.acType,
					airline: $gantt.airline,
					status: $gantt.status,
					onBlkTime: $gantt.onBlkTime ,
					offBlkTime: $gantt.offBlkTime ,
					flightGroups: $gantt.flightGroups ,
					isLocked: $gantt.isLocked ,
					assignedSlot: $gantt.gate ,
					index: $gantt.index ,
					violations: $gantt.violations,
					groupSet: $gantt.groupSet,
					groupColor: $gantt.color ? $gantt.color : null,
					linkedTarget: $gantt.linkedPuck ? $gantt.linkedPuck.id : null ,
					foreGate : $gantt.foreGate ? $gantt.foreGate : null ,
					afterGate : $gantt.afterGate ? $gantt.afterGate : null ,
					in_flt_id: $gantt.inboundFlt ? $gantt.inboundFlt.id : null ,
					in_flt_airline: $gantt.inboundFlt ? $gantt.inboundFlt.airline : "N/A" ,
					in_flt_fltNum: $gantt.inboundFlt ? $gantt.inboundFlt.fltNum : "N/A" ,
					in_flt_fleet: $gantt.inboundFlt ? $gantt.inboundFlt.fleet : "N/A" ,
					in_flt_aircraft: $gantt.inboundFlt ? $gantt.inboundFlt.aircraft : "N/A" ,
					in_flt_registration: $gantt.inboundFlt ? $gantt.inboundFlt.registration : "N/A" ,
					in_flt_fltType: $gantt.inboundFlt ? $gantt.inboundFlt.fltType : "N/A" ,
					in_flt_depStation: $gantt.inboundFlt ? $gantt.inboundFlt.depStation : "N/A" ,
					in_flt_arrStation: $gantt.inboundFlt ? $gantt.inboundFlt.arrStation : "N/A" ,
					in_flt_std: $gantt.inboundFlt ? $gantt.inboundFlt.std : "N/A" ,
					in_flt_sta: $gantt.inboundFlt ? $gantt.inboundFlt.sta : "N/A" ,
					in_flt_etd: $gantt.inboundFlt ? $gantt.inboundFlt.etd : "N/A" ,
					in_flt_eta: $gantt.inboundFlt ? $gantt.inboundFlt.eta : "N/A" ,
					in_flt_atd: $gantt.inboundFlt ? $gantt.inboundFlt.atd : "N/A" ,
					in_flt_ata: $gantt.inboundFlt ? $gantt.inboundFlt.ata : "N/A" ,
					in_flt_segSeq: $gantt.inboundFlt ? $gantt.inboundFlt.segSeq : "N/A" ,
					in_flt_fltStatus: $gantt.inboundFlt ? $gantt.inboundFlt.fltStatus : "N/A" ,
					in_flt_onwardFltNum: $gantt.inboundFlt ? $gantt.inboundFlt.onwardFltNum : "N/A" ,
					out_flt_id: $gantt.outboundFlt ? $gantt.outboundFlt.id : null ,
					out_flt_airline: $gantt.outboundFlt ? $gantt.outboundFlt.airline : "N/A" ,
					out_flt_fltNum: $gantt.outboundFlt ? $gantt.outboundFlt.fltNum : "N/A" ,
					out_flt_fleet: $gantt.outboundFlt ? $gantt.outboundFlt.fleet : "N/A" ,
					out_flt_aircraft: $gantt.outboundFlt ? $gantt.outboundFlt.aircraft : "N/A" ,
					out_flt_registration: $gantt.outboundFlt ? $gantt.outboundFlt.registration : "N/A" ,
					out_flt_fltType: $gantt.outboundFlt ? $gantt.outboundFlt.fltType : "N/A" ,
					out_flt_depStation: $gantt.outboundFlt ? $gantt.outboundFlt.depStation : "N/A" ,
					out_flt_arrStation: $gantt.outboundFlt ? $gantt.outboundFlt.arrStation : "N/A" ,
					out_flt_std: $gantt.outboundFlt ? $gantt.outboundFlt.std : "N/A" ,
					out_flt_sta: $gantt.outboundFlt ? $gantt.outboundFlt.sta : "N/A" ,
					out_flt_etd: $gantt.outboundFlt ? $gantt.outboundFlt.etd : "N/A" ,
					out_flt_eta: $gantt.outboundFlt ? $gantt.outboundFlt.eta : "N/A" ,
					out_flt_atd: $gantt.outboundFlt ? $gantt.outboundFlt.atd : "N/A" ,
					out_flt_ata: $gantt.outboundFlt ? $gantt.outboundFlt.ata : "N/A" ,
					out_flt_segSeq: $gantt.outboundFlt ? $gantt.outboundFlt.segSeq : "N/A" ,
					out_flt_fltStatus: $gantt.outboundFlt ? $gantt.outboundFlt.fltStatus : "N/A" ,
					out_flt_onwardFltNum: $gantt.outboundFlt ? $gantt.outboundFlt.onwardFltNum : "N/A" 
				});
			}
		}
		, dataProcess: function(){
			var rawDatas = this.datas.rawDatas;
			var ganttItems = [];
			if(rawDatas != null && rawDatas.length > 0){
				for(var i = 0; i < rawDatas.length; i++){
					var $gantt = rawDatas[i];
					
					ganttItems.push(
						this.ganttDataProcess($gantt)
					);
				}
			}
//			this.datas.ganttItems = ganttItems;
			//data persistent
			$("#ganttItemsData").val(JSON.stringify(ganttItems));
			
			var blockerDatas = this.datas.blockerRawData;
			var closureDatas = this.datas.closureRawData;
			var blockItems = [];
			if(blockerDatas){
				for(var key in blockerDatas){
					if(blockerDatas[key].length > 0){
						for(var i = 0; i<blockerDatas[key].length; i++){
							var $block = blockerDatas[key][i];
							blockItems.push(
								new GanttBlockItem({
									type: "reservation",
									airline: $block.airlines,
									startTime: $block.startTime,
									endTime: $block.endTime,
									slot: $block.gate
								})
							);
							
						}
					}
				}
			}
			
			if(closureDatas){
				for(var key in closureDatas){
					if(closureDatas[key].length > 0){
						for(var i = 0; i<closureDatas[key].length; i++){
							var $block = closureDatas[key][i];
							blockItems.push(
								new GanttBlockItem({
									type: "closure",
									startTime: $block.startTime,
									endTime: $block.endTime,
									slot: $block.gate,
									isHardRuled: $block.isHardRuled,
									flightGroups: $block.flightGroups
								})
							);
							
						}
					}
				}
			}
			this.datas.blockItems = blockItems;
			
			//get the time range
			if(this.datas.firstArrTime != null && this.datas.lastDepTime != null){
				this.options.firstArrTime = this.datas.firstArrTime;
				this.options.lastDepTime = this.datas.lastDepTime;
			}else{
				var timeRange = calTimeRange(this.getGanttItems());
				this.options.firstArrTime = timeRange[0];
				this.options.lastDepTime = timeRange[1];
			}

			if(this.datas.zoomScaleLabel != null && this.datas.zoomScale != null){
				this.options.zoomScaleLabel = this.datas.zoomScaleLabel;
				this.options.zoomScale = this.datas.zoomScale;
			}

		}
		, getGanttItems: function(){
			var pdatas = $.parseJSON($("#ganttItemsData").val());
			return pdatas;
		}
		, getGanttItemsInDOM: function(idString){
			var resultGanttItem = [];
			if(idString && idString != ""){
				var ids = idString.split(",");
				for(var i = 0; i < ids.length; i++){
					resultGanttItem.push($("#datatable").find("#"+ ids[i]));
				}
			}
			return resultGanttItem;
		}
		, fetchGanttItemByIds: function(idString){
			var resultGanttItem = [];
			if(idString && idString != ""){
				if(idString.indexOf("#") == 0){
					idString = idString.substring(1);
				}
				
				var ids = idString.split(",");
				var pdatas = this.getGanttItems();
				
				if(ids && pdatas.length > 0){
					for(var index = 0; index < ids.length; index++){
						for(var i = 0; i < pdatas.length; i++){
							if(pdatas[i].datas.id == ids[index]){
								resultGanttItem.push(pdatas[i])
							}
						}
					}
				}
			}
			return resultGanttItem;
		}
		, updateGanttItem: function(obj){
			var pdatas = this.getGanttItems();
			var hasBeenUnassigned = false;
			if(obj && pdatas.length > 0){
				for(var i = 0; i < pdatas.length; i++){
					if(pdatas[i].datas.id == obj.datas.id){
						if(obj.datas.id == undefined) console.log("ID is undefined, i=" + i);
						//assign
						if(obj.datas.assignedSlot && pdatas[i].datas.assignedSlot == undefined){
							this.removeItemInGantt(obj);
						}
						if(pdatas[i].datas.assignedSlot != undefined && obj.datas.assignedSlot == undefined){
							hasBeenUnassigned = true;
						}
						
						pdatas[i].datas = obj.datas;
						break;
					}
				}
				//update the data
				$("#ganttItemsData").val(JSON.stringify(pdatas));
			}
			//if this obj has been unassigned
			return hasBeenUnassigned;
		}
		, deleteGanttItem: function(obj){
			var pdatas = this.getGanttItems();
			if(obj && pdatas.length > 0){
				var indexToDelete;
				for(var i = 0; i < pdatas.length; i++){
					try {
						if(pdatas[i].datas.id == obj.datas.id){
							indexToDelete = i;
							this.removeItemInGantt(obj);
							break;
						}
					}catch(error) {
						console.log(error + " i=" + i);
					}
				}
				if(indexToDelete) pdatas.splice(indexToDelete, 1);
				//update the data
				$("#ganttItemsData").val(JSON.stringify(pdatas));
			}
		}
		, addGanttItem: function(obj){
			var pdatas = this.getGanttItems();
			if(obj){
				pdatas.push(obj);
				//update the data
				$("#ganttItemsData").val(JSON.stringify(pdatas));
			}
		}
		, removeItemInGantt: function(obj){
			//remove item in gantt items
			if($("#datatable").find("#"+obj.datas.id).length > 0){
				$("#datatable").find("#"+obj.datas.id).remove();
			}
			
			//remove item in unassign items
			if(this.datas.itemInTimelineTarget){
				if($(this.datas.itemInTimelineTarget).find("#"+obj.datas.id).length > 0){
					$(this.datas.itemInTimelineTarget).find("#"+obj.datas.id).remove();
				} 
		    }
		}
		, drawGantt: function(){
//			  this.showLoading()
			var datas = this.datas;
			var before = (new Date()).getTime();
			  //onDrawGanttStart listener
		      if(typeof this.datas.onDrawGanttStart == 'function' && this.datas.onDrawGanttStart){
		    	  $(document).one( "onDrawGanttStart", function( event, data ) {
		    		  datas.onDrawGanttStart(event, data);
		    	  });
		    	  $(document).trigger("onDrawGanttStart");
		      }
			  //make the container
			  this.$element.append(this.generateFrame());
			  
				//append slots into the table
		      this.generateSolts();
		      //draw grids 
		      this.drawGrids(this.datas.blockScale);
		      
		      this.drawBlock();

			  this.drawMealTimeRange();
		      
		      this.drawPucks(this.getGanttItems());
		      
		      this.$element.append($("<div class='clearfix'/>"));
		      //draw the gantt items if item in timeline has been set
		      this.drawItemsInTimeline();
		      
		      //add listeners
		      this.addPuckListener();
		      this.showTimeline();
		      
		      //use lazy mode to show ganttItems if the switch is on.
		      if(datas.isLazyLoadMode) this.checkTimeRangeInView();
		      
		      this.addMainScrollbarListener();
		      
		      //onDrawGanttEnd listener
		      if(typeof this.datas.onDrawGanttEnd == 'function' && this.datas.onDrawGanttEnd){
		    	  $(document).one( "onDrawGanttEnd", function( event, data ) {
		    		  datas.onDrawGanttEnd(event, data);
		    	  });
		    	  $(document).trigger("onDrawGanttEnd");
		      }
		      checkProcessTime("Total time for drawing Gantt items", before);
//		      this.hideLoading();
		}
		,reScaleGantt: function(scaleValue){
			var scale = 1/scaleValue;
			$(".puck_block").css({
				"transform": "scaleX(" + scale + ")"
			});
		}
		, clearTimelineMark: function(){
			$('.headerGrids').find(".mouseTimelineMark").tooltip('destroy');
			$(".mouseTimelineMark").remove();
		}
		, showTimeline: function(){
			var $this = this;
			var blockTimeLenth = $this.datas.blockScale * 60 / $this.datas.blockWidth;
			
			if(this.datas.showCurrentTimeline){
				var dataGtids = $(document).find(".tGrids");
				if(dataGtids.length > 0){
					dataGtids.each(function(e){
						var timelineMark = $("<div class='timelineMark'/>")
						$(this).prepend(timelineMark);
						//locate current time first
						$this.setTimelinePosition(timelineMark);
						setInterval(function(){$this.setTimelinePosition(timelineMark)}, 5000); 
					})
					
					$(".ganttContainer, .sidebar-container").click(function(e){
						if($(e.target).attr("id") == "ganttContainer-data"){
							$this.clearTimelineMark();
							
							dataGtids.each(function(){
								var mouseTimelineMark = $("<div class='mouseTimelineMark'/>")
								$(this).prepend(mouseTimelineMark); 
							});
							$(".mouseTimelineMark").css({
								"left" : e.offsetX
							});
							
							var $target = $('.headerGrids').find(".mouseTimelineMark");
							$target.tooltip({
								"container": $this.$element,
								"title": getFormatDateByLong($this.options.firstArrTime + (e.offsetX * blockTimeLenth * 60 * 1000), "yyyy-MM-dd hh:mm")
							});
							$target.tooltip("show");
						}
					});
					
					//set the slider to specific tool bar if the container has been set.
					if(this.datas.toolBarContainer){
						$("#currentTimeLocator").remove();
						var container = $(this.datas.toolBarContainer);
						var currentTimeLocator = $("<a id='currentTimeLocator' class='btn btn-white btn-xs pull-left'/>");
						var icon = $("<i class='fa fa-clock-o '/>");
						var iconContainer = $("<span/>");
						iconContainer.text("定位到当前时间：");
						iconContainer.prepend(icon);
						currentTimeLocator.append(iconContainer);
						container.prepend(currentTimeLocator);
						
						$(currentTimeLocator).click(function(){
							var leftValue = $this.leftParaProduce($($(".timelineMark")[0]).css("left"));
							if( leftValue > ($this.datas.blockWidth * 10)){
								$("#dataGridsScroller").mCustomScrollbar("scrollTo", $this.leftParaProduce($($(".timelineMark")[0]).css("left")) - ($this.datas.blockWidth * 10), {
								    scrollInertia:1000
								});
							}else{
								$("#dataGridsScroller").mCustomScrollbar("scrollTo", 0, {
								    scrollInertia:1000
								});
							}
							
						});
						
					}
				}
			}
			
		}
		, setTimelinePosition: function(target){
			if(target != undefined){
				var blockTimeLenth = this.datas.blockScale * 60 / this.datas.blockWidth;
				//get the offset (minutes) of the first Arr time to the first coordination
				var timeOffset = getTimeOffset(this.options.firstArrTime, this.datas.blockScale);
				var left = 0;
					left = getTotalDiffMinutes((new Date()).getTime(), this.options.firstArrTime) / blockTimeLenth + timeOffset / blockTimeLenth;
//				left = getTotalDiffMinutes(1431719200000, this.options.firstArrTime) / blockTimeLenth + timeOffset / blockTimeLenth;
				$(target).css({
					"left": left
				});
			}
		}
		, showLoading: function(){
			var loading = $("<div id='ganttLoading'/>")
			var loadingIcon = $("<i class='fa fa-spinner fa-spin' />")
			loading.append($("<div/>").append(loadingIcon));
			loading.appendTo(document.body);
		}
		, hideLoading: function(){
			$("#ganttLoading").remove();
		}
		, generateFrame: function () {
			var ganttContainer;
			if(this.$element.find(".ganttContainer").length > 0){
				ganttContainer = this.$element.find(".ganttContainer");
				ganttContainer.html("");
			}else{
				ganttContainer = $("<div class='ganttContainer'/>");
			}
			var timeLineLabelContainer = $("<div class='tGate headerGrids'/>");
			
			var timeSlot = $("<table/>");
			var timeSlotTr = $("<tr/>");
			var timeSlotTd = $("<td/>");
			timeSlotTd.text("Timeline");
			timeSlotTd.addClass("timelineHeader");
			timeSlotTd.appendTo(timeSlotTr);
			timeSlotTd.css({
				height: this.datas.blockWidth
			});
			
			timeSlotTr.appendTo(timeSlot);
			timeSlot.appendTo(timeLineLabelContainer);
			
			var timeLineContainer = $("<div id='header' class='rightPanel'/>");
			var timeLineScroller = $("<div id='timeLineScroller' class='scroller'/>");
			var timeLine = $("<div id='headerGrids' class='tGrids headerGrids'/>");
			timeLine.appendTo(timeLineScroller);
			timeLineScroller.appendTo(timeLineContainer);
			
			var dataGridsContainer = $("<div id='viewport' class='dataGrids'/>");
			var soltLabelContainer = $("<div id='soltTable' class='tGate'/>");
			var dataGridsPanel = $("<div class='rightPanel innerPanel'/>");
			
			var dataGridsScroller = $("<div id='dataGridsScroller' class='scroller'/>");
			var dataGrids = $("<div id='datatable' class='tGrids'/>");
			
			soltLabelContainer.appendTo(dataGridsContainer);
			dataGrids.appendTo(dataGridsScroller);
			dataGridsScroller.appendTo(dataGridsPanel);
			dataGridsPanel.appendTo(dataGridsContainer);
			
			timeLineLabelContainer.appendTo(ganttContainer);
			timeLineContainer.appendTo(ganttContainer);
			$("<div class='clearfix'/>").appendTo(ganttContainer);
			dataGridsContainer.appendTo(ganttContainer);
			$("<div class='clearfix'/>").appendTo(ganttContainer);
			
			dataGridsContainer.css({
				height: $(window).height() - 280
				//height: $(window).height() - 530
			});

			
			$(window).resize(function() {
				dataGridsContainer.css({
					height: $(window).height() - 280
					//height: $(window).height() - 530
				});
			});
			
			var scrollerContainer = $("<div id='scroller_container'/>");
			scrollerContainer.appendTo(ganttContainer);

			return ganttContainer;
	    }
		//show scale slider, need 
		, generateScaleSlider: function (ganttContainer) {
			var $this = this;
			var datas = this.datas;
			var options = this.options;
			var container = $("<div class='sliderRow'/>");
			
			//set the slider to specific tool bar if the container has been set.
			if(datas.toolBarContainer){
				container = $(datas.toolBarContainer);
			}else{//default
				container.prependTo(ganttContainer);
			}
			
			var sliderContainer = $("<div class='sliderContainer'/>");
			var sliderInput = $("<input id='scaleSlider'/>");
			var sliderLabel = $("<div class='scaleSliderLabel'/>")
			var sliderItem = $("<div class='sliderItem'/>");

			sliderItem.appendTo(sliderContainer);
			sliderLabel.appendTo(sliderContainer);
//			$("<br/>").appendTo(sliderContainer);
			sliderInput.appendTo(sliderItem);
			sliderLabel.text(options.zoomScaleLabel[0]);
			sliderContainer.appendTo(container);
//			$("<div class='clearfix'/>").appendTo(container);
			
			
			$(document).ready(function(){
				$("#scaleSlider").ionRangeSlider({
				    type: "single",
				    values: options.zoomScaleLabel,
				    onFinish: function (data) {
				    	sliderLabel.text(data.from_value);
				    	datas.blockScale = options.zoomScale[data.from];
				    	$this.clearTimelineMark();
				    	
				    	//clear the current scroll bar before gantt redraw
				    	$("div[id$='_scrollbar_horizontal']").remove();
				    	$this.drawGantt();
				    	//append the scroll bar into correct place
				    	var scrollBar_h = $("div[id$='_scrollbar_horizontal']")
				        if($('#bottom-sidebar').hasClass('sidebar-open')){
				        	scrollBar_h.appendTo("#scoller");
				        }else{
				        	scrollBar_h.appendTo("#scroller_container");
				        }
				    }
				});
			})
		}
		, generateGanttItemSeacher: function () {
			var $this = $(this);
			var that = this;
			if(this.datas.showSearcher){
				if(this.datas.toolBarContainer){
					var container = $(this.datas.toolBarContainer);
					
				    var inputGroup = $("<div id='ganttItemSeacher' class='input-group input-group-sm'>");
					
					//add search into tool bar container
					var searchInputer = $("<input />");
					searchInputer.addClass("form-control");
					searchInputer.attr("placeholder", "搜索机场、航空公司、航班号或机尾号");
					
					var inputGroupBtn = $("<span class='input-group-btn'>");
					var removeBtn = $("<button class='btn btn-sm btn-default' type='button'/>");
					var removeIcon = $("<i class='fa fa-remove'/>");
					removeBtn.append(removeIcon);
					inputGroupBtn.append(removeBtn);
					
					inputGroup.append(searchInputer);
					inputGroup.append(inputGroupBtn);
					container.append(inputGroup);
					
					removeBtn.click(function(){
						searchInputer.val("");
						$("#gantt-search-result").remove();
					});
					
					var result = [];
					searchInputer.keyup(function(){
						result = [];
						var ganttItems = that.getGanttItems();
						var searchValue =  $(this).val();
						if(searchValue != ""){
							for(var i = 0; i < ganttItems.length; i++){
								var reg = ganttItems[i].datas.registration;
								var airline = ganttItems[i].datas.airline;
								var inFlt = ganttItems[i].datas.in_flt_fltNum;
								var outFlt = ganttItems[i].datas.out_flt_fltNum;
								var inActDepStation = ganttItems[i].datas.in_flt_depStation;
								var outActArrStation = ganttItems[i].datas.out_flt_arrStation;
								
								if(reg && reg.toLowerCase().indexOf(searchValue.toLowerCase()) > -1) result.push(ganttItems[i]);
								if(airline && airline.toLowerCase().indexOf(searchValue.toLowerCase()) > -1) result.push(ganttItems[i]);
								if(inFlt && inFlt.toLowerCase().indexOf(searchValue.toLowerCase()) > -1) result.push(ganttItems[i]);
								if(outFlt && outFlt.toLowerCase().indexOf(searchValue.toLowerCase()) > -1) result.push(ganttItems[i]);
								if(inActDepStation && inActDepStation.toLowerCase().indexOf(searchValue.toLowerCase()) > -1) result.push(ganttItems[i]);
								if(outActArrStation && outActArrStation.toLowerCase().indexOf(searchValue.toLowerCase()) > -1) result.push(ganttItems[i]);
								
							}
						}
						//generate drop down list for search result
						$("#gantt-search-result").remove();
						if(result.length > 0){
							var ul = $("<ul id='gantt-search-result' class='gantt-search-result'/>");
							
							for(var i=0; i<result.length; i++){
								var liItem = $("<li></li>");
								var text = "";
								
								if(result[i].datas.in_flt_fltNum != "N/A"){
									text += result[i].datas.airline + result[i].datas.in_flt_fltNum + " - ";
								}else{
									text += result[i].datas.in_flt_fltNum + " - ";
								}
								if(result[i].datas.out_flt_fltNum != "N/A"){
									text += result[i].datas.airline + result[i].datas.out_flt_fltNum + "   ";;
								}else{
									text += result[i].datas.out_flt_fltNum + "   ";
								}
								text += result[i].datas.registration;
								liItem.attr("data-id", "#" + result[i].datas.id);
								liItem.text(text);
								ul.append(liItem);
							}
							container.append(ul);
							ul.css({
								"position" : "absolute",
								"width": $("#ganttItemSeacher")[0].clientWidth,
								"top" : $("#ganttItemSeacher")[0].offsetTop + $("#ganttItemSeacher")[0].clientHeight + 2 ,
								"left" : $("#ganttItemSeacher")[0].offsetLeft
							});
							
							$(".gantt-search-result").find("li").click(function(){
								that.locatePuckItem([$(this).attr("data-id")]);
							});
						}
					});
				}
			}
			
		}
		, generateSolts: function () {
			var soltItems = this.datas.soltItems
			this.datas.slotList = [];
			this.datas.carouselList = [];
			$("#soltTable").html("");
			
			this.options.rowNumber = 0;
			if(soltItems && soltItems.length > 0){
				var table = $("<table/>");
				for(var i=0; i < soltItems.length; i++){
					//add the gate name to the array, need to get the index via name later.
					this.datas.slotList[i] = soltItems[i].name;
					
					if(soltItems[i].simProcess != undefined && soltItems[i].simProcess > 0){
						for(var j = 0; j < soltItems[i].simProcess; j++ )
						carouselList.push(soltItems[i].name + "," + j);
					}
					
					var tr = $("<tr/>");
					var row = $("<td/>");
					row.addClass("tRow");
					row.addClass("gateRow");
					row.text(soltItems[i].name);
					
					//row can have multiple lines if the object is carousel object
					if(this.type == 'baggage'){
						var simProcess = soltItems[i].simProcess;
						if(simProcess == null) simProcess = 1;
						
						row.css({
							"height": this.datas.blockWidth * this.options.simProcess - (this.options.simProcess - 1)
						});
						this.options.rowNumber += simProcess;
					}else{ //else, it is a gate object
						row.attr("height", this.datas.blockWidth);
						this.options.rowNumber++;
					}
					
					row.attr("data-toggle", "popover");
					row.attr("data-placement", "right");
					row.attr("data-trigger", "hover");
					row.attr("data-html", true);
					
					//gate object, show detail information
					if(soltItems[i].gateBuffer != undefined){
						var gateMixValue = "";
						if(soltItems[i].gateMix != undefined && soltItems[i].gateMix.length > 0){
							gateMixValue += "<dt>登机口允许机型:</dt><dd>";
							var _gateMix = soltItems[i].gateMix;
							for(var j = 0; j < _gateMix.length; j++){
								gateMixValue += _gateMix[j] + "    ";
							}
							gateMixValue += "</dd>";
						}
						
						row.attr("data-content",
							"<dl class='dl-horizontal gate'>" +
									"<dt>最短间隔时间:</dt>" +  
									"<dd>" + soltItems[i].gateBuffer + "</dd>" +  
									"<dt>是否为远机位:</dt>" +  
									"<dd>" + soltItems[i].isHardstand + "</dd>" +  
									"<dt>国际航班停靠:</dt>" +  
									"<dd>" + soltItems[i].custom + "</dd>" +    
									"<dt>国内航班停靠:</dt>" +  
									"<dd>" + soltItems[i].dom + "</dd>" +  
									gateMixValue +
							"</dl>"
						);
					}
					//Carousel object, show detail information
					if(this.type == 'baggage'){
						row.attr("data-content",
							"<dl class='dl-horizontal gate'>" +
									"<dt>类型:</dt>" +  
									"<dd>" + soltItems[i].type + "</dd>" +  
									"<dt>描述:</dt>" +  
									"<dd>" + soltItems[i].description + "</dd>" +  
							"</dl>"
						);
					}
					
					tr.append(row);
					table.append(tr);
				}
				$("#soltTable").append(table);
			}
			$(".gateRow").popover({"container":"body"});
	    }
		, generateTimelineViewSolts: function (target) {
			$(target).html("");
			var maxUnassignedItemRows = this.datas.maxUnassignedItemRows;
			
			var dataGridsContainer = $("<div id='viewport' class='timelineView dataGrids'/>");
			var soltLabelContainer = $("<div id='soltTable' class='tGate'/>");
			var dataGridsPanel = $("<div class='rightPanel innerPanel'/>");
			
			var dataGridsScroller = $("<div id='dataGridsScroller' class='scroller'/>");
			var dataGrids = $("<div id='datatable' class='tGrids'/>");
			
			soltLabelContainer.appendTo(dataGridsContainer);
			dataGrids.appendTo(dataGridsScroller);
			dataGridsScroller.appendTo(dataGridsPanel);
			dataGridsPanel.appendTo(dataGridsContainer);
			dataGridsContainer.appendTo($(target));
			//draw solt items
			if(maxUnassignedItemRows && maxUnassignedItemRows >= 0){
				var table = $("<table/>");
				for(var i=0; i < maxUnassignedItemRows; i++){
					
					var tr = $("<tr/>");
					var row = $("<td/>");
					row.addClass("tRow");
					row.css({
						height: this.datas.blockWidth
					})
					//row.text(rawDatas[i].airline + rawDatas[i].arrFlight + " -- " + rawDatas[i].depFlight);
					tr.append(row);
					table.append(tr);
				}
				soltLabelContainer.append(table);
			}
			
			//draw grids
			var diffDays = getCeilDiffDays(this.options.lastDepTime, this.options.firstArrTime);
			//create a container for the date selector
			var totalBlock = diffDays * 24 / this.datas.blockScale;
			
//			var t = $("<table/>");
//			for(var k = 0; k < maxUnassignedItemRows; k++){
//				var line = $("<tr/>");
//				for(var i = 0; i < totalBlock; i++){
//					var blockItem =  $("<td/>");
//					blockItem.attr("height", this.datas.blockWidth);
//					blockItem.attr("width", this.datas.blockWidth);
//					line.append(blockItem);
//				}
//				t.append(line);
//			}
//			t.appendTo($(target).find("#datatable"));
			
			//set the total width to the parent container
			$(target).find("#datatable").width(this.datas.blockWidth * totalBlock);
			$(target).find("#datatable").height(this.datas.blockWidth * maxUnassignedItemRows);
			//scroller position
			var scrollerContainer = $("<div id='scroller_container'/>");
	    }
		, drawBlock: function(){
			var blockItems = this.datas.blockItems;
			if(blockItems && blockItems.length > 0){
				for(var i = 0; i<blockItems.length; i++){
					this.generateBlock("#datatable", blockItems[i].datas);
				}
			}
		}
		, drawMealTimeRange: function(){
			var mealTimeArray = this.datas.mealTimeArray;
			var blockTimeLength = this.datas.blockScale * 60 / this.datas.blockWidth;
			var timeOffset = getTimeOffset(this.options.firstArrTime, this.datas.blockScale);
			var that = this;

			if(mealTimeArray && mealTimeArray.length > 0){
				mealTimeArray.forEach(function (mealTime) {
					if(mealTime){
						var mealRange = $('<div class="meal_range"/>');
						var width = getTotalDiffMinutes(mealTime.endTime, mealTime.startTime) / blockTimeLength;
						var left = getTotalDiffMinutes(mealTime.startTime, that.options.firstArrTime) / blockTimeLength + timeOffset / blockTimeLength;

						mealRange.width(width).height($("#datatable").height());
						mealRange.css({
							"left": left
						});

						$("#datatable").append(mealRange);
					}

					// if(mealTime){
					// 	var block = $("<div/>");
					// 	var gateSeq = 0;
					// 	gateSeq = this.datas.slotList.indexOf(blockItem.slot);
                    //
					// 	//how long is every single pixel stand for (minutes)
					// 	var blockTimeLenth = this.datas.blockScale * 60 / this.datas.blockWidth;
					// 	var timeOffset = getTimeOffset(this.options.firstArrTime, this.datas.blockScale);
                    //
					// 	block.css({
					// 		"left": getTotalDiffMinutes(blockItem.startTime, this.options.firstArrTime) / blockTimeLenth + timeOffset / blockTimeLenth + "px",
					// 		"top": gateSeq * this.datas.blockWidth + "px",
					// 		"width": getTotalDiffMinutes(blockItem.endTime, blockItem.startTime) / blockTimeLenth + "px",
					// 		"height": this.datas.blockWidth + "px"
					// 	});
                    //
					// 	if(blockItem.type == "reservation"){
					// 		if(blockItem.airline){
					// 			var airlineInfo = $("<span/>");
					// 			airlineInfo.addClass("airlineInfo");
					// 			airlineInfo.text(blockItem.airline.join(", "));
					// 			block.addClass("airlineBlock");
					// 			block.append(airlineInfo);
					// 		}
					// 	}
                    //
					// 	if(blockItem.type == "closure"){
					// 		var airlineInfo = $("<span/>");
					// 		airlineInfo.addClass("closureInfo");
					// 		airlineInfo.text(blockItem.flightGroups);
					// 		block.addClass("gateClosureBlock");
					// 		if(blockItem.isHardRuled) block.addClass("hardRuled");
					// 		block.append(airlineInfo);
					// 	}
					// 	var $datatable = $(".ganttContainer").find("#datatable");
					// 	$datatable.append(block);
					// }

				})
			}
		}
		, drawGrids: function (blockScale) {
			var diffDays = getCeilDiffDays(this.options.lastDepTime, this.options.firstArrTime);
			//create a container for the date selector
			var totalBlock = diffDays * 24 / blockScale;
			
			var timelineHeader = $("<div/>");
			var startTime = this.options.firstArrTime;
			
			var blockTimeLenth = this.datas.blockScale * 60 / this.datas.blockWidth;
			
			//Hours header
			for(var i = 0; i < totalBlock; i++){
				var timeSpan = $("<span/>");
				timeSpan.addClass("timeSpan");
				
				var scaleContainer = $("<div class='scaleContainer'/>");
				scaleContainer.css({
					width: this.datas.blockWidth,
					height: this.datas.blockWidth + 1
				});
				
				startTime = this.options.firstArrTime + blockTimeLenth * 60 * 1000 * (this.datas.blockWidth * i);
				
				for(var scaleNo = 0; scaleNo < 4; scaleNo++){
					var scaleItem = $("<div class='scaleItem'/>");
						scaleItem.css({
							width: (this.datas.blockWidth / 4)
						});
						
					//add attribute for contain the time information
					if(scaleNo == 0){
						scaleItem.addClass("scaleMoment");
						scaleItem.attr("data-moment", startTime);
						var time = getFormatDateByLong(startTime, "yyyy-MM-dd hh:mm");
						timeSpan.text(time);
					}
					scaleContainer.append(scaleItem);
				}
				
				if(i % 10 == 2 && i != 0) {
					scaleContainer.prepend(timeSpan);
				}
//				startTime += 1000 * 60 * 60 * blockScale;
				timelineHeader.append(scaleContainer);
			}

			$("#headerGrids").append(timelineHeader);
			
			//set the total width to the parent container
			$("#datatable").width(this.datas.blockWidth * totalBlock);
			$("#datatable").height(this.datas.blockWidth * this.options.rowNumber);
			$("#headerGrids").width(this.datas.blockWidth * totalBlock);
			
			$("#headerGrids").css({
				"width": $("#headerGrids").width() + 50,
				"height": this.datas.blockWidth
			});
	    }
		, drawPucks: function(puckData){
			if(puckData == undefined){
				puckData = this.getGanttItems();
			}
			
			var timelineData = $("<div id='ganttContainer-data'/>");
			if(puckData && puckData.length > 0){
				for(var i=0; i < puckData.length; i++){
					if(this.type == "baggage"){
						//generate the puck into the timeline table if it has been assigned carousel
						if(puckData[i].carousel){
							this.generatePuck(timelineData, puckData[i].datas);
						}
					}
					if(this.type == "flight"){
						//generate the puck into the timeline table if there is no onBlkTime
						if(puckData[i].datas.onBlkTime){
							this.generatePuck(timelineData, puckData[i].datas);
						}
					}
				}
			}
			var $datatable = $(".ganttContainer").find("#datatable");
			timelineData.prependTo($datatable);
			//set the height of the data area
			$("#ganttContainer-data").height($("#ganttContainer-data").parent().height() - 2);
		}
		, resetGanttHeight: function(){
			var container = $("#ganttContainer-data").parent();
			if(this.datas.heightChangeTarget){
				container = $(this.datas.heightChangeTarget); 
			}
			$("#ganttContainer-data").height(container.height() - 2);
		}
		, resetItemPosition: function(){
			if($("#currentGanttItem").val() != ""){
				var ganttItemId = $("#currentGanttItem").val().split(",");
				$(ganttItemId).each(function(){
					if($("#" + this).hasClass("newAssign")){
						$("#" + this).remove();
					}else{
						$("#" + this).animate({
							top: $("#startPos-top").val() + "px"
						});
					}
				});
			}
		}
		,drawItemsInTimeline: function(skipScrollBar){
			var before = (new Date()).getTime();
			//draw the gantt items if item in timeline has been set
		      if(this.datas.itemInTimelineTarget){
		    	  var unassignedItems = this.getUnassinedGanttItems();
		    	  this.generateTimelineViewSolts(this.datas.itemInTimelineTarget);
		    	  this.drawTimelinePucks(unassignedItems);
		    	  this.addTimelineScrollbarListener();
		    	  
		      }
		      checkProcessTime("Time for Drawing Unassigned Gantt Items", before);
		}
		, getUnassinedGanttItems: function(){
			var before = (new Date()).getTime();
			//must to sort the items by on block time first before add to unassigned section
			var ganttItems = this.getGanttItems();
			ganttItems = ganttItems.sort(sortOnBlkTime);
			
			var unassignedGanttItems = [];
			for(var i = 0; i < ganttItems.length; i++){
				if(ganttItems[i].datas.assignedSlot == undefined || ganttItems[i].datas.assignedSlot == ""){
					//put sorted items into gantt
					//this.appendUnassignedItem(unassignedGanttItems, ganttItems[i]);
					unassignedGanttItems.push(ganttItems[i]);
					if(ganttItems[i].datas.index != -1 && ganttItems[i].datas.index >= this.datas.maxUnassignedItemRows){
						this.datas.maxUnassignedItemRows = ganttItems[i].datas.index + 1;
					}
				}
			}
			//lenth need to be added 1
			if(this.datas.maxUnassignedItemRow > 0) this.datas.maxUnassignedItemRow++;
			//this.datas.maxUnassignedItemRows = unassignedGanttItems.length;
			
			checkProcessTime("Time for getting Unassigned items", before);
			return unassignedGanttItems;
		}
		, appendUnassignedItem: function(targetArray, item){
			var needAdd = true;

			if(targetArray != undefined && targetArray.length > 0){
				for(var i = 0; i < targetArray.length; i ++){
					if((targetArray[i].nextStartTime < item.datas.onBlkTime)){
						targetArray[i].items.push(item);
						targetArray[i].nextStartTime = item.datas.offBlkTime;
						needAdd = false;
						break;
					}
				}
			}

			if(needAdd){
				var unassignedItem = new UnassignedItem([], 0, targetArray.length);
				unassignedItem.items.push(item);
				unassignedItem.nextStartTime = item.datas.offBlkTime;
				targetArray.push(unassignedItem);
			}
		}
		, drawTimelinePucks: function(unassignedGanttItems){
			var timelineData = $("<div id='ganttContainer-data'/>");
			if(unassignedGanttItems && unassignedGanttItems.length > 0){
				for(var i=0; i < unassignedGanttItems.length; i++){
					var item = unassignedGanttItems[i];
					this.generatePuck(timelineData, item.datas, item.datas.index);
				}
			}

			var $datatable = $(this.datas.itemInTimelineTarget).find("#datatable");
			timelineData.prependTo($datatable);
			//set the height of the data area
			timelineData.height($("#ganttContainer-data").parent().height() - 2);
		}
		, checkViolation: function(puck){
			var violations = this.datas.violations;
			if(violations.length > 0){
				for(var i = 0; i < violations.length; i++){
					if(violations[i].puckId == puck.attr("id")){
						if(violations[i].exempt == false && !puck.hasClass("hard-violation")) {
							puck.addClass("hard-violation");
						}
						if(violations[i].exempt == true && !puck.hasClass("soft-violation")) {
							puck.addClass("soft-violation");
						}
						break;
					}
				}
			}
		}
		, generatePuck: function(target, puckData, timelineSeq){
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
				if(this.type == 'baggage'){
					//use the index, need to set as carouselSequence - 1
					slotSeq = this.datas.slotList.indexOf(puckData.assignedSlot + "," + puckData.slotSequence);
				}
				puckTop = slotSeq * this.datas.blockWidth;
				puck.attr("data-assignStatus", "assigned");
			}else{
				puck.attr("data-assignStatus", "unassign");
			}
			
			puck.attr("data-start", puckData.onBlkTime);
			puck.attr("data-end", puckData.offBlkTime);
			
			puckWidth = getTotalDiffMinutes(Date.parse(puckData.offBlkTime), Date.parse(puckData.onBlkTime)) / blockTimeLenth - 2;
			puckLeft = getTotalDiffMinutes(Date.parse(puckData.onBlkTime), this.options.firstArrTime) / blockTimeLenth + timeOffset / blockTimeLenth;
			
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
			
			if(puckData.groupColor != null){
				puck.css({
					"border": "3px solid #" + puckData.groupColor
				});
			}
			
//			this.checkViolation(puck);
			if(puckData.violations && puckData.violations.length > 0){
				var violations = puckData.violations;
				for(var i = 0; i < violations.length; i++){
					if(violations[i].exempt == false && !puck.hasClass("hard-violation")) {
						puck.addClass("hard-violation");
					}
					if(violations[i].exempt == true && !puck.hasClass("soft-violation")) {
						puck.addClass("soft-violation");
					}
				}
			}
			
			var airline = $("<span/>");
			airline.addClass("airline");
			
			var inboundStation = "N/A";
			var outboundStation = "N/A";
			
			if(puckData.in_flt_depStation != undefined && puckData.in_flt_depStation != "N/A"){
				inboundStation = puckData.in_flt_depStation;
			}
		
			if(puckData.out_flt_arrStation != undefined && puckData.out_flt_arrStation != "N/A"){
				inboundStation = puckData.out_flt_arrStation;
			}
			

			if(isLongPuck) {
				var airlineInfo = [];
				if(puckData.in_flt_fltNum != "N/A"){
					airlineInfo.push(puckData.in_flt_airline + puckData.in_flt_fltNum);
				}
				if(puckData.out_flt_fltNum != "N/A"){
					airlineInfo.push(puckData.out_flt_airline + puckData.out_flt_fltNum);
				}
				airline.text(airlineInfo.join(" - "));
				puck.text(puckData.aircraft + " " + puckData.registration);
				puck.append(airline)
				puck.addClass("long-puck");
			}
			
			if(isMiddlePuck && this.datas.blockScale == 1) {
				var airlineInfo = [];
				if(puckData.in_flt_fltNum != "N/A"){
					airlineInfo.push(puckData.in_flt_airline + puckData.in_flt_fltNum);
				}
				if(puckData.out_flt_fltNum != "N/A"){
					airlineInfo.push(puckData.out_flt_airline + puckData.out_flt_fltNum);
				}
				airline.html(airlineInfo.join(" - ") + " / " + puckData.aircraft + "<br>" + getFormatDateByLong(puckData.onBlkTime, "hhmm") + " " + getFormatDateByLong(puckData.offBlkTime, "hhmm"));
				puck.append(airline)
			}
			
			if(isShortPuck && this.datas.blockScale == 1) {
				var airlineInfo = [];
				if(puckData.in_flt_fltNum != "N/A"){
					airlineInfo.push(puckData.in_flt_airline + puckData.in_flt_fltNum);
				}
				if(puckData.out_flt_fltNum != "N/A"){
					airlineInfo.push(puckData.out_flt_airline + puckData.out_flt_fltNum);
				}
				airline.html(airlineInfo.join(" - ") + " / " + puckData.aircraft + "<br>" + getFormatDateByLong(puckData.onBlkTime, "hhmm") + " " + getFormatDateByLong(puckData.offBlkTime, "hhmm"));
				
				puck.append(airline)
			}
			
			
			var inboundStation = $("<div/>");
			inboundStation.addClass("inboundStation");
			
			if(puckData.in_flt_fltNum != "N/A" && puckData.in_flt_fltNum != "" && this.type == 'flight'){
				var inboundFltInfo = "";
				inboundFltInfo += puckData.in_flt_depStation == "N/A" ? "" : puckData.in_flt_depStation + "<br/>";
				inboundFltInfo += getFormatDateByLong(puckData.onBlkTime, "hh:mm");;
				if(isLongPuck) {
					inboundStation.html(inboundFltInfo);
				}
				
				var caretLeft = $("<i/>");
				caretLeft.addClass("fa");
				caretLeft.addClass("inbound");
				caretLeft.addClass("fa-caret-left");
				caretLeft.addClass(puckData.in_flt_ata == undefined ? "showRed":"");
				inboundStation.prepend(caretLeft);
				
			}
			if(puckData.foreGate != null && isLongPuck){
				var foreGate = $("<div/>");
				foreGate.addClass("fore_after_gate");
				foreGate.text("T" + puckData.foreGate);
				inboundStation.append(foreGate)
			}
			puck.prepend(inboundStation);
			
			var outboundStation = $("<div/>");
			outboundStation.addClass("outboundStation");
			if(puckData.out_flt_fltNum != "N/A" && puckData.out_flt_fltNum  != ""){
				var outboundFltInfo = "";
				outboundFltInfo += puckData.out_flt_arrStation == "N/A" ? "" : puckData.out_flt_arrStation + "<br/>";
				outboundFltInfo += getFormatDateByLong(puckData.offBlkTime, "hh:mm");
				
				if(isLongPuck) outboundStation.html(outboundFltInfo);
				
				var caretRight = $("<i/>");
				caretRight.addClass("fa");
				caretRight.addClass("outbound");
				caretRight.addClass("fa-caret-right");
				caretRight.addClass(puckData.out_flt_atd == undefined ? "showRed":"");
				outboundStation.append(caretRight);
			}
			if(puckData.afterGate != null && isLongPuck){
				var afterGate = $("<div/>");
				afterGate.addClass("fore_after_gate");
				afterGate.text("T" + puckData.afterGate);
				outboundStation.append(afterGate)
			}
			puck.append(outboundStation);
			
			if(puckData.isLocked){
				puck.prepend("<i class='fa fa-lock'/>");
				puck.addClass("puckLocked");
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
			
//			$(puck).popover({"container":"body"});
			return puck;
		}
		, generateBlock: function(target, blockItem){
			
			if(blockItem){
				var block = $("<div/>");
				var gateSeq = 0;
				gateSeq = this.datas.slotList.indexOf(blockItem.slot);
				
				//how long is every single pixel stand for (minutes)
				var blockTimeLenth = this.datas.blockScale * 60 / this.datas.blockWidth;
				var timeOffset = getTimeOffset(this.options.firstArrTime, this.datas.blockScale);
				
				block.css({
					"left": getTotalDiffMinutes(blockItem.startTime, this.options.firstArrTime) / blockTimeLenth + timeOffset / blockTimeLenth + "px",
					"top": gateSeq * this.datas.blockWidth + "px",
					"width": getTotalDiffMinutes(blockItem.endTime, blockItem.startTime) / blockTimeLenth + "px",
					"height": this.datas.blockWidth + "px"
				});
				
				if(blockItem.type == "reservation"){
					if(blockItem.airline){
						var airlineInfo = $("<span/>");
						airlineInfo.addClass("airlineInfo");
						airlineInfo.text(blockItem.airline.join(", "));
						block.addClass("airlineBlock");
						block.append(airlineInfo);
					}
				}
				
				if(blockItem.type == "closure"){
					var airlineInfo = $("<span/>");
					airlineInfo.addClass("closureInfo");
					airlineInfo.text(blockItem.flightGroups);
					block.addClass("gateClosureBlock");
					if(blockItem.isHardRuled) block.addClass("hardRuled");
					block.append(airlineInfo);
				}
				var $datatable = $(".ganttContainer").find("#datatable");
				$datatable.append(block);
			}
		}
		, addMainScrollbarListener: function(){
			var that = this;
			
			$("#viewport").mCustomScrollbar({ 
				axis:"y", 
				autoDraggerLength: false,
				mouseWheel:{ scrollAmount: 10 },
				theme:"dark-thick"
			});
			
			$("#dataGridsScroller").mCustomScrollbar({
		        axis:"x",
		        scrollInertia: 0,
		        theme:"dark-thick",
		        mouseWheel:{ enable: false },
		        callbacks:{
		        	onInit: function(){
		        		if(that.datas.isLazyLoadMode) that.lazyLoadGanttItem(that.calculateLazyLoadTimeRange());
		        	},
		        	onScrollStart:function(){
		        		that.clearTimelineMark();
		        	},
		        	onScroll: function(){
		        		if(that.datas.isLazyLoadMode) that.lazyLoadGanttItem(that.calculateLazyLoadTimeRange());
		        	},
		            whileScrolling: function(){
		            	$("#timeLineScroller").scrollLeft(-this.mcs.left);
		            	
		            	//draw the gantt items if item in timeline has been set
		            	if(that.datas.itemInTimelineTarget){
		            		$(that.datas.itemInTimelineTarget).find("#dataGridsScroller").scrollLeft(-this.mcs.left);
			      	    }
		            }
		        }
		    });
			
			var scrollBar_h = $("div[id$='_scrollbar_horizontal']")
			
//			if(this.datas.scrollerTarget){
//				scrollBar_h.appendTo($(this.datas.scrollerTarget));
//			}else{
				scrollBar_h.appendTo("#scroller_container");
//			}
		}
		, checkTimeRangeInView: function(){
			//need the jquery.inview.js support
			checkinViewListener = $('.scaleMoment').bind('inview', function(event, isInView, topOrBottomOrBoth) {
				  if (isInView) {
					  $(this).addClass("inview");
				  } else {
					  $(this).removeClass("inview");
				  }
			});
		}
		, calculateLazyLoadTimeRange: function(){
			//
			var range = [];
			var momentLength = $('.scaleMoment.inview').length;
			if(momentLength > 1){
				range.push($($('.scaleMoment.inview')[0]).attr("data-moment"));
				range.push($($('.scaleMoment.inview')[momentLength - 1]).attr("data-moment"));
			}
			return range;
		}
		, lazyLoadGanttItem: function(timeRange){
			var items = this.getGanttItems();
			var itemsToShow = [];
			var itemsToHide = [];
			var startTime = timeRange[0];
			var endTime = timeRange[1];
			for(var i=0; i < items.length; i++){
				if( (Date.parse(items[i].datas.onBlkTime) >= startTime && Date.parse(items[i].datas.offBlkTime) <= endTime) ||
					(Date.parse(items[i].datas.onBlkTime) < startTime && Date.parse(items[i].datas.offBlkTime) > startTime)	||
					(Date.parse(items[i].datas.onBlkTime) < endTime && Date.parse(items[i].datas.offBlkTime) > endTime)){
					itemsToShow.push(items[i]);
				}else{
					itemsToHide.push(items[i]);
				}
			}
			if(itemsToShow.length > 0){
				for(var i=0; i<itemsToShow.length; i++){
					$("#" + itemsToShow[i].datas.id).show();
				}
			}
			if(itemsToHide.length > 0){
				for(var i=0; i<itemsToHide.length; i++){
					$("#" + itemsToHide[i].datas.id).hide();
				}
			}
			
		}
		, addTimelineScrollbarListener: function(){
			//draw the gantt items if item in timeline has been set
		    if(this.datas.itemInTimelineTarget){
		    	$(this.datas.itemInTimelineTarget).find("#viewport").mCustomScrollbar({ 
					axis:"y", 
					autoDraggerLength: false,
					mouseWheel:{ scrollAmount: 10 },
					theme:"dark-thick"
				});
		    }
			
		}
		, addPuckListener: function(){
			//select
			this.puckSelectListener();
			//moving
			this.puckMoveListener();
		}
		, generateHiddenItems: function(){
			this.$element.html("");
			var startPositionLeftValue = $("<input id='startPos-left' type='hidden'/>")
			var startPositionTopValue = $("<input id='startPos-top' type='hidden'/>")
			var scrollTopValue = $("<input id='scrollTop' type='hidden'/>")
			var currentGanttItem = $("<input id='currentGanttItem' type='hidden'/>")
			var ganttItemsData = $("<input id='ganttItemsData' type='hidden'/>")
			var isGanttItemInSameLine = $("<input id='isGanttItemInSameLine' type='hidden'/>")
			
			this.$element.append(startPositionLeftValue);
			this.$element.append(startPositionTopValue);
			this.$element.append(scrollTopValue);
			this.$element.append(currentGanttItem);
			this.$element.append(ganttItemsData);
			this.$element.append(isGanttItemInSameLine);
		}
		, getOptions: function (options) {
			options = $.extend({}, $.fn.gantt.defaults, this.$element.data(), options)
		    return options
		  }
		, searchGanttItem: function (itemId) {
			var pdatas = this.getGanttItems();
			if(itemId && pdatas.length > 0){
				for(var i = 0; i < pdatas.length; i++){
					if(pdatas[i].datas.id == itemId){
						return pdatas[i];
					}
				}
			}
		    return null;
		  }
		, addPuckMoveListener: function(puckItem){
			var options = this.options;
			var that = this;
			
			//skip the move listener if the puck has been locked
			if($(puckItem).hasClass("puckLocked")){
				return;
			}
			
			if(!$(puckItem).hasClass("inTimeline")){//assigned puck
				
				$(puckItem).on("dblclick", function(event){
					that.showPuckRange($(puckItem));
					$(puckItem).addClass("moving");
					
					//set the current position
//					$("#startPos-left").val(that.leftParaProduce($(puckItem).css("left")));
			    	$("#startPos-top").val(that.leftParaProduce($(puckItem).css("top")));
			    	$("#currentGanttItem").val($(puckItem).attr("id"));
			    	//PF('notificationBar').hide();
				});
				
				$(puckItem).on("click", function(event){
					if($(puckItem).hasClass("moving")){
						$(puckItem).removeClass("moving");
						$(puckItem).removeClass("newAssign");
					}
				});
			}else{//pucks not assigned
				$(puckItem).on("dblclick", function(event){
					var newPuck = $(puckItem).clone();
					
					that.showPuckRange(newPuck);
					newPuck.addClass("moving");
					newPuck.addClass("newAssign");
					that.$element.find("#ganttContainer-data").append(newPuck);
					
					$("#currentGanttItem").val($(puckItem).attr("id"));
					//PF('notificationBar').hide();
					
					//the onStart listener for unassigned puck
					if(typeof that.datas.onUnassignedPuckActivated == 'function' && that.datas.onUnassignedPuckActivated){
						$(document).one( "unassignedPuckActivated", function( event, data ) {
							that.datas.onUnassignedPuckActivated(event, data);
						});
						$(document).trigger("unassignedPuckActivated");
					}
					
				});
			}
		}
		, puckMoveListener: function(){
			var options = this.options;
			var that = this;
			$(".puck_block").each(function(el){
				var $this = $(this);
				//disable the pucks when time pass by
//				if($this.overlaps(".timelineMark").length == 0){
					that.addPuckMoveListener($this);
//				}
			});
		}
		, leftParaProduce: function(puckLeft){
			if(!isNaN(puckLeft)){
				return puckLeft;
			}else if(puckLeft != undefined && puckLeft.indexOf("px") > 0){
				puckLeft = puckLeft.substring(0,puckLeft.indexOf("px"));
				return puckLeft;
			}
		}
		, puckSelectListener: function(){
			var $this = this;
			//clear "selected" class when user clicks 
			$(".tGrids").on("click", function(e){
				if(!$(e.target).hasClass("puck_block") 
						 && !$(e.target).parent().hasClass("puck_block")
						 && !$(e.target).parents().hasClass("notification")){
					$(".puck_block").removeClass("selected");
					$(".puck_block").removeClass("highlighted");
					$(".puck_block").removeClass("effectedPuck");
					//PF('notificationBar').hide();
				}
			});
			
			$(".puck_block").each(function(e){
				$this.addPuckSelectListener(this);
			})
		}
		, addPuckSelectListener: function(puck){
			var $this = this;
			var $datas = this.datas;
			
			$(puck).on("mousedown", function(e){
				//if all the gantt items are selected in same line
				var isSameLine = true;
				var ids = [];
				var gategateSequences = [];
				switch (e.which) {
			        case 1:
						if(e.shiftKey == false){
							$this.cleanHighlight();
						}
						$(this).toggleClass("selected");
						$(this).toggleClass("highlighted");
						//generate id array for unassign action
						if(e.shiftKey == true){
							$(".puck_block.selected").each(function(){
								ids.push($(this).attr("id"));
							});
							$("#ganttAssignedParam").val(ids.join(","));
							$("#currentGanttItem").val(ids.join(","));
						}else{
							$("#ganttAssignedParam").val($(this).attr("id"));
						};
//			            break;
			        case 3:
			        	if(!$(this).hasClass("selected")){
			        		$this.cleanHighlight();
			        		$(this).addClass("selected");
							$(this).addClass("highlighted");
			        	}
						//generate id array for unassign action
						$(".puck_block.selected").each(function(){
							ids.push($(this).attr("id"));
							var topValue = $(this).css("top").substring(0, $(this).css("top").indexOf("px"));
							var sequence = Math.floor(topValue/$datas.blockWidth);
							gategateSequences.push(sequence);
						});
						
						$("#ganttAssignedParam").val(ids.join(","));
						$("#currentGanttItem").val(ids.join(","));
//			            break;
			        default:
			        	for(var i=0; i<gategateSequences.length; i++){
							if(i>0){
								if(gategateSequences[i] != gategateSequences[i-1]){
									isSameLine = false;
								}
							}
						}
			        	$("#isGanttItemInSameLine").val(isSameLine)
			        ;
			    }
				$this.showGanttItemInfo(ids);
				
				//add listener for assign listener
				if(typeof $datas.onPuckSelected == 'function' && $datas.onPuckSelected){
					$(document).one( "puckSelected", function( event, data ) {
						$datas.onPuckSelected(event, data);
					});
					$(this).trigger("puckSelected", {id: ids, param : isSameLine});
				}
			});
		}
		, cleanHighlight: function(){
			$(".puck_block").removeClass("highlighted");
			$(".puck_block").removeClass("selected");
			$(".soft-violation").removeClass("highlighted_violation");
			$(".hard-violation").removeClass("highlighted_violation");
			$(".puck_block").removeClass("effectedPuck");
		}
		, showPuckRange: function(puck){
			var options = this.options;
			var datas = this.datas;
			var that = this;
			
			var puckRange = $('<div class="puck_range"/>');
			puckRange.width(puck.width()).height($("#datatable").height());
			puckRange.css({
				"left": puck.css("left")
			});
			
			puckRange.mousemove(function(e){
				puck.css({
					"top": Math.floor(e.offsetY/ datas.blockWidth) * datas.blockWidth
				});
			});
			
			puckRange.mousedown(function(e){
				var overlapedPucks = puck.overlaps(puck.parent().find('.puck_block'));
				if(overlapedPucks.length >= options.overlapLimitation){
					
					if(puck.attr("data-assignStatus") == "unassign"){
						puck.effect('bounce');
					}else{
						that._puckSwap(puck, overlapedPucks);
					}
				}else{
					that._puckAssigned(puck);
					//open the bottom panel 
					 if(puck.hasClass("newAssign")) {
						   $("#bottom-sidebar").addClass('sidebar-open');
						   var scrollBar_h = $("div[id$='_scrollbar_horizontal']")
					        if($('#bottom-sidebar').hasClass('sidebar-open')){
					        	scrollBar_h.appendTo("#scoller");
					        }else{
					        	scrollBar_h.appendTo("#scroller_container");
					        }
					   }
				}
			});
			
			$(document).keydown(function(e) {
				  if (e.which == 27 && puckRange.is(":visible")) {
				   e.preventDefault();
				   //hide puck range, and remove the new created puck
				   that._puckAssignCancel(puck);
				 //open the bottom panel if user opearting a new puck
				   if(puck.hasClass("newAssign")) {
					   $("#bottom-sidebar").addClass('sidebar-open');
					   var scrollBar_h = $("div[id$='_scrollbar_horizontal']")
				        if($('#bottom-sidebar').hasClass('sidebar-open')){
				        	scrollBar_h.appendTo("#scoller");
				        }else{
				        	scrollBar_h.appendTo("#scroller_container");
				        }
				   }
				  }
			});
			$("#datatable").append(puckRange);
		}
		, activeSwappingPucks: function(){
			var options = this.options;
			var datas = this.datas;
			var that = this;
			
			var pucksToSwap = $("#currentGanttItem").val();
			var ganttItems = this.fetchGanttItemByIds(pucksToSwap)
			var ganttItemsInDOM = this.getGanttItemsInDOM(pucksToSwap);
			
			var timeRange = calTimeRange(ganttItems);
			var startTime = timeRange[0];
			var endTime = timeRange[1];
			
			var blockTimeLenth = this.datas.blockScale * 60 / this.datas.blockWidth;
			var rangeWidth = getTotalDiffMinutes(endTime, startTime) / blockTimeLenth - 2;
			var rangeLeft = getTotalDiffMinutes(startTime, this.options.firstArrTime) / blockTimeLenth;
			
			if(ganttItemsInDOM.length > 0){
				$("#startPos-top").val(that.leftParaProduce($(ganttItemsInDOM[0]).css("top")));
			}
			
			var puckRange = $('<div class="puck_range"/>');
			$("#datatable").append(puckRange);
			puckRange.width(rangeWidth).height($("#datatable").height());
			puckRange.css({
				"left": rangeLeft
			});
			
			puckRange.mousemove(function(e){
				$(ganttItemsInDOM).each(function(){
					$(this).addClass("moving");
					$(this).css({
						"top": Math.floor(e.offsetY/ datas.blockWidth) * datas.blockWidth
					});
				});
			});
			
			puckRange.mousedown(function(e){
				var overlapedPucks = []
				$(ganttItemsInDOM).each(function(){
					$(this).removeClass("moving");
					$(this).overlaps($(this).parent().find('.puck_block')).each(function(){
						if(!isObjectInList(overlapedPucks, $(this)[0]))
							overlapedPucks.push($(this)[0]);
					});
				});
				puckRange.remove();
				that._pucksSwap($(ganttItemsInDOM), overlapedPucks);
			});
			
			$(document).keydown(function(e) {
				  if (e.which == 27 && puckRange.is(":visible")) {
					  e.preventDefault();
				   //hide puck range, and remove the new created puck
					  $(ganttItemsInDOM).each(function(){
						   $(this).removeClass("moving");
						   $(this).animate({
							   top: $("#startPos-top").val() + "px"
						   });
					  });
					  puckRange.remove();
				  }
			});
		}
		, addItem: function(object){
			var ganttData = this.ganttDataProcess(object);
			
			if(ganttData) {
				this.addGanttItem(ganttData);
				var puck;
				
				if(ganttData.datas.assignedSlot == undefined){//unassign case
					this.puckUnassign(ganttData.datas);
					if($(this.datas.itemInTimelineTarget)){
						puck = this.generatePuck($(this.datas.itemInTimelineTarget).find("#ganttContainer-data"), ganttData.datas, ganttData.datas.index);
						puck.addClass("inTimeline");
					}
				}else{
					puck = this.generatePuck("#ganttContainer-data", ganttData.datas);
				}
				this.addPuckMoveListener(puck);
				this.addPuckSelectListener(puck);
				menuListener(puck);
			}
		}
		, updateUnassignedRows: function(rowNum){
			if(this.datas.itemInTimelineTarget){
				this.datas.maxUnassignedItemRows += rowNum;
				var maxUnassignedItemRows = this.datas.maxUnassignedItemRows;
				
				var soltLabelContainer = $(this.datas.itemInTimelineTarget).find("#soltTable")
				if(soltLabelContainer){
					var table = soltLabelContainer.find("table");
					if(table.length == 0){
						table = $("<table/>");
						soltLabelContainer.append(table);
					}
					
					if(rowNum > 0){
						for(var i=0; i < rowNum; i++){
							var tr = $("<tr/>");
							var row = $("<td/>");
							row.addClass("tRow");
							row.css({
								height: this.datas.blockWidth
							})
							//row.text(rawDatas[i].airline + rawDatas[i].arrFlight + " -- " + rawDatas[i].depFlight);
							tr.append(row);
							table.append(tr);
						}
					}else{
						var steps = Math.abs(rowNum);
						for(var i=0; i < steps; i++){
							table.find("tr")[0].remove();
						}
					}
					$(this.datas.itemInTimelineTarget).find("#datatable").height(this.datas.blockWidth * maxUnassignedItemRows);
				}
		    }
		}
		, updateItem: function(object){
			var ganttData = this.ganttDataProcess(object);
			
			if(ganttData) {
				var hasBeenUnassigned = this.updateGanttItem(ganttData);
				var puck;
				if(ganttData.datas.assignedSlot == undefined){//unassign case
					this.puckUnassign(ganttData.datas);
					if($(this.datas.itemInTimelineTarget)){
						puck = this.generatePuck($(this.datas.itemInTimelineTarget).find("#ganttContainer-data"), ganttData.datas, ganttData.datas.index);
						puck.addClass("inTimeline");
					}
				}else{
					puck = this.generatePuck("#ganttContainer-data", ganttData.datas);
				}
				this.addPuckMoveListener(puck);
				this.addPuckSelectListener(puck);
				menuListener(puck);
			}
		}
		, deleteItem: function(object){
			var ganttData = this.ganttDataProcess(object);
			
			if(ganttData) {
				this.deleteGanttItem(ganttData);
			}
		}
		, updateGanttViolations: function(){
			var $datas = this.datas;
			//actions for update Violations
			
			//add listener for assign listener
			if(typeof $datas.onViolationUpdated == 'function' && $datas.onViolationUpdated){
				$(document).one( "violationUpdated", function( event, data ) {
					$datas.onViolationUpdated(event, data);
				});
				$(document).trigger("violationUpdated", {});
			}
		}
		, locatePuckItem: function(data){
			var itemId = data[0];
			var violationValue = data[1];
			var targetObj = $(".tGrids").find(itemId);
//			$("#ganttContainer-data").find(itemId);
			
			if(targetObj.length > 0){
				$(".puck_block").removeClass("highlighted");
				$(".puck_block").removeClass("effectedPuck");
				
				//find the unassigned item and open the unassigned panel
				if($(targetObj[0]).hasClass("inTimeline")){
					$("#bottom-sidebar").addClass("sidebar-open");
				}
				
				$(targetObj[0]).addClass("highlighted");
				//scroll the custom scrollbar
				var scrollTop = 0;
				
				var ganttData = this.fetchGanttItemByIds(itemId);
				
				if(ganttData.length > 0){
					if(ganttData[0].datas.index > -1){//unassigned items
						scrollTop = ganttData[0].datas.index * this.datas.blockWidth;
						$(this.datas.itemInTimelineTarget).find("#viewport").mCustomScrollbar("scrollTo", scrollTop, {
						    scrollInertia:1000
						});
						
					}else{//assigned items
						if((this.leftParaProduce($(targetObj[0]).css("top"))) > 3 * this.datas.blockWidth){
							scrollTop = -(this.leftParaProduce($(targetObj[0]).css("top"))) + 3 * this.datas.blockWidth;
						}
						$("#viewport").mCustomScrollbar("scrollTo", scrollTop, {
						    scrollInertia:1000
						});
					}
				}
				
				if(this.leftParaProduce($(targetObj[0]).css("left")) > 6 * this.datas.blockWidth){
					$("#dataGridsScroller").mCustomScrollbar("scrollTo", this.leftParaProduce($(targetObj[0]).css("left")) - 6 * this.datas.blockWidth, {
					    scrollInertia:1000
					});
				}else{
					$("#dataGridsScroller").mCustomScrollbar("scrollTo", 0, {
					    scrollInertia:1000
					});
				}
				
				if(violationValue){
					$("#" + violationValue).addClass("effectedPuck");
				}
			}
			
		}
		, showGanttItemInfo:function(id){
			//don't show info for multiple items
			if(id.length > 1){
				return;
			}
			if(this.datas.toolBarContainer){
				container = $("#nbContent");
				container.html("");
				
//				if(!$("#notificationBar").is(":visible")) PF('notificationBar').hide();
				
				var itemDatas = this.searchGanttItem(id);
				var item = null;
				if(itemDatas != null){
					item = itemDatas.datas;
				}
				
				if(item != null){
					var violations = "";
					for(var j = 0; j < item.violations.length; j++){
						violations += "<tr><td colspan='6'><span class='label " + 
								(item.violations[j].exempt == true ? "label-warning":"label-danger") + 
								"'>" + item.violations[j].message +
								"</span></td></tr>"
					}
					
					var drapDropInfo = "";
					if(item.foreGate != null || item.afterGate != null){
						var drapDropRow = $("<tr/>");
						drapDropInfo = "<td>航班拖拽信息: </td><td>";
						
						if(item.foreGate != null && item.afterGate != null){
							drapDropInfo += item.foreGate + "<i class='fa fa-arrows-h'/>" + item.afterGate;
						}else{
							if(item.foreGate != null){
								drapDropInfo += item.foreGate + "<i class='fa fa-arrow-right '/>";
							}
							if(item.afterGate != null){
								drapDropInfo += "<i class='fa fa-arrow-right '/>" + item.afterGate;
							}
						}
						
						drapDropInfo += "</td></tr>";
						drapDropRow.html(drapDropRow); 
					}
					
					var content = "<table>" +
									"<tr>" +
										"<td>航空公司: </td><td>"+ item.airline + "</td>" +
										"<td>机型: </td><td>"+ item.aircraft + "</td>" +
										"<td>机尾号: </td><td>"+ item.registration + "</td>" +
									"</tr>" +
									"<tr>" +	
										"<td>到港航班: </td><td>"+ item.in_flt_fltNum + "</td>" +
										"<td>出发机场: </td><td>"+ item.in_flt_depStation + "</td>" +
										"<td>到港时间: </td><td>"+ getFormatDateByLong(item.onBlkTime, "yyyy-MM-dd hh:mm") + "</td>" +
									"</tr>" +
									"<tr>" +
										"<td>离港航班: </td><td>"+ item.out_flt_fltNum + "</td>" +
										"<td>目的机场: </td><td>"+ item.out_flt_arrStation + "</td>" +
										"<td>离港时间: </td><td>"+ getFormatDateByLong(item.offBlkTime, "yyyy-MM-dd hh:mm") + "</td>" +
									"</tr>" +
									"<tr>" +
										"<td>航班分组: </td><td colspan='5'>"+ item.groupSet + "</td>" +
									"</tr>" +
									drapDropInfo + 
									violations + 
									"</table>";
					
					var info = $("<div id='ganttItemInfoContent' class='ganttItemInfo'/>");
					info.html(content);
					container.append(info);
					//PF('notificationBar').show()
				}
			}
		}
		, puckUnassign: function(puck){
			//remove the current puck before 
			if($("#ganttContainer-data").find("#" + puck.id).length > 0){
				$("#ganttContainer-data").find("#" + puck.id).remove();
			}
		}
		, _puckAssigned: function(puck){
			var $datas = this.datas;
			var $this = this;
			//add listener for assign listener
			if(typeof $datas.onPuckAssigned == 'function' && $datas.onPuckAssigned){
				var topValue = puck.css("top").substring(0, puck.css("top").indexOf("px"));
				var gateSequence = Math.floor(topValue/$datas.blockWidth);
				
				if($datas.slotList[gateSequence] != undefined){
					$('.puck_range').remove();

					puck.removeClass("moving");
					puck.removeClass("inTimeline");
					
					$(document).one( "assign", function( event, data ) {
						$datas.onPuckAssigned(event, data);
					});
					puck.trigger("assign", {
						id: puck.attr("id"),
						slotSequence: gateSequence,
						slotName: $datas.slotList[gateSequence]
					});
				}
			}
		}
		, _puckSwap: function(puck, targetPucks){
			$('.puck_range').remove();
			puck.removeClass("moving");
			puck.removeClass("inTimeline");
			
			var puckId = $(puck).attr("id");
			var ids = [];
			$(targetPucks).each(function(){
				ids.push($(this).attr("id"));
			});
			var generatedParameter = puckId + ";" + ids.join(",");
			
			var $datas = this.datas;
			//add listener for swap listener
			if(typeof $datas.onPuckSwapped == 'function' && $datas.onPuckSwapped){
				$(document).one( "swap", function( event, data ) {
					$datas.onPuckSwapped(event, data);
				});
				puck.trigger("swap", {param : generatedParameter});
			}
			
		}
		, _pucksSwap: function(sourcePucks, targetPucks){
			var sourcePuckIds = [];
			$(sourcePucks).each(function(){
				sourcePuckIds.push($(this).attr("id"));
			});
			
			var targetPuckIds = [];
			$(targetPucks).each(function(){
				targetPuckIds.push($(this).attr("id"));
			});
			var generatedParameter = sourcePuckIds.join(",") + ";" + targetPuckIds.join(",");
			
			var $datas = this.datas;
			//add listener for swap listener
			if(typeof $datas.onPuckSwapped == 'function' && $datas.onPuckSwapped){
				$(document).one( "swap", function( event, data ) {
					$datas.onPuckSwapped(event, data);
				});
				$(document).trigger("swap", {param : generatedParameter});
			}
			
		}
		, _puckAssignCancel: function(puck){
			$('.puck_range').remove();
			
			if(puck.hasClass("inTimeline")) {//new puck to assign
				puck.remove();
			}else{//the pucks already in gantt
				puck.removeClass("moving");
				
				puck.animate({
//					left: $("#startPos-left").val() + "px",
					top: $("#startPos-top").val() + "px"
				});
			}
		}
	}

	$.fn.gantt = function (option, itemData) {
		return this.each(function () {
	      var $this = $(this)
	        , data = $this.data('gantt')
	        , options = $.extend({}, $.fn.gantt.defaults, typeof option == 'object' && option)
	      //if (!data)
			  $this.data('gantt', (data = new Gantt(this, options)))
	      if (typeof option == 'string') data[option](itemData)
	    })
	}
	
	$.fn.gantt.defaults = {
		rowNumber: 0,
		lastDepTime: 1397150495000,
		firstArrTime: 1396150495000,
		blockTimeLenth: 0,
		timeOffset: 0,
		blockWidth: 40,
		//the number of pack overlap
		overlapLimitation: 1,
		maxUnassignedItemRows: 0,
		rawDatas: [],
		ganttItems: [],
		soltItems: [],
		colorMap: {"default": "#ffffff"},
		timelineSlotItems: [],
		closureItems: [],
		violations: [],
		showScaleSlider: true,
		zoomScaleLabel: ["15分钟", "1小时", "2小时", "3小时"],
		zoomScale: [0.25, 1, 2, 3],
		blockScale: 0.25,
		isAssigning: false,
		longPuckWidth: 175,
		middlePuckWidth: 100,
		itemInTimelineTarget: null,
		heightChangeTarget: null,
		toolBarContainer: null,
		showCurrentTimeline: false,
		isLazyLoadMode: true,
		showSearcher: true,
		
//		callback
		onPuckSelected: null,
		onPuckAssigned: null,
		onPuckSwapped: null,
		onScaleSliderChanged: null,
		onUnassignedPuckActivated: null,
		onDrawGanttStart: null,
		onDrawGanttEnd: null,
		onViolationUpdated: null
	}

	$.fn.gantt.Constructor = Gantt;
	

	var GanttItem = function (datas) {
	    this.init(datas)
	 }
	
	$.fn.ganttItem = function (option) {
		return this.each(function () {
	      var $this = $(this)
	        , data = $this.data('ganttItem')
	        , options = $.extend({}, $.fn.ganttItem.defaults, typeof option == 'object' && option)
	      if (!data) $this.data('ganttItem', (data = new GanttItem(this, options)))
	      if (typeof option == 'string') data[option]()
	    })
	}
	
	$.fn.ganttItem.defaults = {
		id: null,
		aircraft: null,
		registration: null,
		acType: null,
		airline: null,
		status: null,
		onBlkTime: null,
		offBlkTime: null,
		flightGroups: null,
		assignedSlot: null,
		index: null,
		isLocked: false,
		linkedTarget: null,
		violations: [],
		groupColor: null,
		foreGate : null ,
		afterGate : null ,
		in_flt_id: null,
		in_flt_airline: null,
		in_flt_fltNum: null,
		in_flt_fleet: null,
		in_flt_aircraft: null,
		in_flt_registration: null,
		in_flt_fltType: null,
		in_flt_depStation: null,
		in_flt_arrStation: null,
		in_flt_std: null,
		in_flt_sta: null,
		in_flt_etd: null,
		in_flt_eta: null,
		in_flt_atd: null,
		in_flt_ata: null,
		in_flt_segSeq: null,
		in_flt_fltStatus: null,
		in_flt_onwardFltNum: null,
		out_flt_id: null,
		out_flt_airline: null,
		out_flt_fltNum: null,
		out_flt_fleet: null,
		out_flt_aircraft: null,
		out_flt_registration: null,
		out_flt_fltType: null,
		out_flt_depStation: null,
		out_flt_arrStation: null,
		out_flt_std: null,
		out_flt_sta: null,
		out_flt_etd: null,
		out_flt_eta: null,
		out_flt_atd: null,
		out_flt_ata: null,
		out_flt_segSeq: null,
		out_flt_fltStatus: null,
		out_flt_onwardFltNum: null
	}

	$.fn.ganttItem.Constructor = GanttItem;
	
	GanttItem.prototype = {
		    constructor: GanttItem
		  , init: function (datas) {
			  this.datas = datas;
		  }
	}
	
	var GanttBlockItem = function (datas) {
	    this.init(datas)
	 }
	
	$.fn.ganttBlockItem = function (option) {
		return this.each(function () {
	      var $this = $(this)
	        , data = $this.data('ganttBlockItem')
	        , options = $.extend({}, $.fn.ganttBlockItem.defaults, typeof option == 'object' && option)
	      if (!data) $this.data('ganttBlockItem', (data = new GanttBlockItem(this, options)))
	      if (typeof option == 'string') data[option]()
	    })
	}
	
	$.fn.ganttBlockItem.defaults = {
		id: null,
		type: null,
		startTime: null,
		endTime: null
	}

	$.fn.ganttBlockItem.Constructor = GanttBlockItem;
	
	GanttBlockItem.prototype = {
		    constructor: GanttBlockItem
		  , init: function (datas) {
			  this.datas = datas;
		  }
	}
	
	function getCeilDiffDays(time1, time2){
		return Math.ceil((time1 - time2) / (24*3600*1000));
	}
	function getDiffDays(time1, time2){
		return Math.floor((time1 - time2) / (24*3600*1000));
	}
	function getDiffHours(time1, time2){
		return Math.floor((time1 - time2) % (24*3600*1000) / (3600*1000));
	}
	function getDiffMinutes(time1, time2){
		return Math.floor((time1 - time2) % (24*3600*1000) % (3600*1000) / (60*1000));
	}
	function getTotalDiffMinutes(time1, time2){
		if(time1 > time2){
			return getDiffDays(time1, time2) * 24 * 60 + getDiffHours(time1, time2) * 60 + getDiffMinutes(time1, time2);
		}else{
			return -(getDiffDays(time2, time1) * 24 * 60 + getDiffHours(time2, time1) * 60 + getDiffMinutes(time2, time1));
		}
	}

	function getTimeOffset(time, blockScale){
		var display = getFormatDateByLong(time, "yyyy-MM-dd ") +
			Math.floor(parseInt(getFormatDateByLong(time, "hh")) / blockScale) * blockScale + ":00";
		return getTotalDiffMinutes(time, strtotime(display));
	}
	
	function parseTime(str) {
	    if(!/^(\d){8}$/.test(str)) return "invalid date";
	    var y = str.substr(0,4),
	        m = str.substr(4,2),
	        d = str.substr(6,2);
	    var targetDate = new Date(y,m,d);
	    return targetDate.getTime();
	}

	function strtotime(s){
	    var t = s.split(/(?: |-|:)/);
	    t[1]--;
	    eval('var d = new Date('+t.join(',')+');');
	    return d.getTime();
	}
	function calTimeRange(ganttItems){
		var timeRange = [];
		if(ganttItems != null && ganttItems.length > 0){
			var firstArr, lastDep;
			
			for(var i = 0; i < ganttItems.length; i++){
				if(i==0){
					firstArr = Date.parse(ganttItems[i].datas.onBlkTime);
					lastDep = Date.parse(ganttItems[i].datas.offBlkTime);
				}
				if(firstArr > Date.parse(ganttItems[i].datas.onBlkTime)) firstArr = Date.parse(ganttItems[i].datas.onBlkTime);
				if(lastDep < Date.parse(ganttItems[i].datas.offBlkTime)) lastDep = Date.parse(ganttItems[i].datas.offBlkTime);
			}
//			firstArr -= (2*3600*1000);
//			lastDep += (2*3600*1000);
			
			timeRange.push(firstArr);
			timeRange.push(lastDep);
		}
		return timeRange;
	}
	
	var UnassignedItem = function(items, nextStartTime, index){
		this.items = items;
		this.nextStartTime = nextStartTime;
		this.index = index;
	}

	function sortOnBlkTime(a,b){
		return strtotime(a.datas.onBlkTime) - strtotime(b.datas.onBlkTime);
	}
	
	var isObjectInList = function(list, object){
        var isInList = false;
        if(list.length > 0){
            for(var i = 0; i < list.length; i++){
                if(object.id == list[i].id){
                    isInList = true;
                    break;
                }
            }
        }
        return isInList;
    }


Date.prototype.yyyymmdd = function() {
	var yyyy = this.getFullYear().toString();
	var mm = (this.getMonth()+1).toString(); // getMonth() is zero-based
	var dd  = this.getDate().toString();
	return yyyy + (mm[1]?mm:"0"+mm[0]) + (dd[1]?dd:"0"+dd[0]); // padding
};