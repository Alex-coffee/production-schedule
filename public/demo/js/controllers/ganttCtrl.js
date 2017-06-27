function ganttCtrl($scope, ganttServices){
    $scope.showGantt = true;

    loadData();

    function loadData(){

        ganttServices.getGanttData();

    }

    var generateGantt = function(){
        //var today = new Date();
        var today = (new Date()).getTime();

        $scope.ganttOptions = {
            rawDatas: $scope.dataList,
            soltItems:	$scope.flightList,
            firstArrTime: strtotime(getFormatDateByLong(today + 200 * 60 * 1000, "yyyy-MM-dd hh")),
            lastDepTime: strtotime(getFormatDateByLong(today + 1325 * 60 * 1000 + 1000*3600*6, "yyyy-MM-dd hh")),
            blockWidth: 40,
            zoomScaleLabel: ["15分钟", "1小时", "2小时", "3小时"],
            zoomScale: [0.25, 1, 2, 3],
            blockScale: 0.25,
            //itemInTimelineTarget: "#unassigned-bottom",
            heightChangeTarget: "#center",
            scrollerTarget: "#scoller",
            toolBarContainer: "#ganttToolBar",
            showCurrentTimeline: false,
            isLazyLoadMode: false,
            showSearcher: false,
            onDrawGanttStart: function(event, data){

            },
            onDrawGanttEnd: function(event, data){

            },
            onPuckSelected: function(event, data){

            },
            onPuckAssigned: function(event, data){

            },
            onUnassignedPuckActivated: function(event){

            },
            onPuckSwapped: function(event, data){

            },
            onViolationUpdated: function(){

            }
        };

        //$scope.$apply();
    }
}

angular
.module('piApp')
.controller('ganttCtrl', ganttCtrl);