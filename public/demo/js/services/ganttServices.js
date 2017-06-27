//demands
function ganttServices($http, $q){

    var getProductionScheduleResult = function(){
        return $http.get("demo/or/output/ProductionScheduleResult.json");
    }

    var getGanttData = function () {
        var d = $q.defer();

        getProductionScheduleResult().then(res => {
            var productionScheduleResult = res.data;
            let puckItems = [];
            let i = 0;

            var today = new Date();
            today.setHours(0);
            today.setMinutes(0);
            today.setSeconds(0);
            today.setMilliseconds(0);
            var todayTime = today.getTime();

            productionScheduleResult.forEach(productSchedule => {

                productSchedule.plan.forEach(p => {
                    puckItems.push({
                        id: i++,
                        orderId: productSchedule.orderId,
                        orderName: productSchedule.orderName,
                        assignedSlot: productSchedule.orderId,
                        amount: p.amount,
                        line: p.line,
                        startTime: todayTime + p.time * 24 * 3600 * 1000,
                        endTime: todayTime + (p.time + 1) * 24 * 3600 * 1000
                    });
                })
            })

            console.log(puckItems)
        })

        return d.promise;
    }

    return{
        getProductionScheduleResult: getProductionScheduleResult,
        getGanttData: getGanttData
    }
}

angular
.module('piApp')
.factory('ganttServices', ganttServices);

