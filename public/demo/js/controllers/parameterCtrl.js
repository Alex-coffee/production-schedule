function parameterCtrl($scope, parameterServices, $modal){

    loadData();

    $scope.save = function(){

        if($("#paramForm").valid()){
            parameterServices.saveParameter($scope.parameters).then(function(result){
                if(result.data.status == "success"){
                    toastr.success(result.data.message);
                }
            })
        }

    }

    function loadData(){
        parameterServices.getParameterData().then(function(result){
            $scope.parameters = result.data;
        });
    }

    $scope.newMealTime = function () {
        $scope.openMealTimeModal({}, true);
    }
    $scope.editMealTime = function (mt) {
        $scope.openMealTimeModal(mt, false);
    }
    $scope.removeMealTime = function (mt) {
        $scope.parameters.mealTime.remove(mt);
    }

    $scope.openMealTimeModal = function (detailItem, isNew) {
        $scope.modalInstance = $modal.open({
            templateUrl: 'demo/views/modal/mealTime-modal.html',
            controller: 'mealTimeModalInstanceCtrl',
            backdrop: "static",
            resolve: {
                detailItem: function() {
                    return detailItem;
                },
                isNew: function() {
                    return isNew;
                }
            }
        });

        $scope.modalInstance.result.then(function (data) {
            if(data.isNew){
                $scope.parameters.mealTime.push(data.item);
            }
        })
    }

    $scope.getType = function (keyName) {
        if(keyName == "isMealTimeContraintsOn" || keyName == "isMealTimeConstraintHard"){
            return "radio";
        }else if(keyName == "mealTime"){
            return "table";
        }else{
            return "number";
        }
    }
}

function mealTimeModalInstanceCtrl($scope, $state, $modalInstance, detailItem, isNew) {
    $scope.detailItem = angular.copy(detailItem);

    $scope.save = function () {
        if($("#detailForm").valid()){
            detailItem.startTime = $scope.detailItem.startTime;
            detailItem.endTime = $scope.detailItem.endTime;

            $modalInstance.close({
                item: detailItem,
                isNew: isNew
            });
        }
    };

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
}

angular
.module('piApp')
.controller('parameterCtrl', parameterCtrl)
.controller('mealTimeModalInstanceCtrl', mealTimeModalInstanceCtrl)
;