function ganttchart($timeout) {
    return {
        restrict: 'A',
        scope: {
            ganttOptions: '=',
            ganttRefreash: '='
        },
        link: function (scope, elem, attrs) {

            scope.$watchGroup(['ganttOptions', 'ganttRefreash'], function(newValue, oldValue) {
                if(newValue[0] || newValue[1] > 1){
                    elem.gantt(newValue[0]);
                }

            }, true);
        }
    }
}

angular
    .module('piApp')
    .directive('ganttchart', ganttchart)