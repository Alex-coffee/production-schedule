function lineStaticCtrl($scope, $q, $modal, lineStaticServices){
    $scope.dataList = [];

    loadData();

    function loadData(){

        lineStaticServices.getLineStaticData().then(function(result){
            $scope.dataList = result.data;
        });
    }

    // $scope.edit = function (item) {
    //     $scope.openFlightModal(item);
    // }

    // $scope.openFlightModal = function (detailItem) {
    //     $scope.modalInstance = $modal.open({
    //         templateUrl: 'demo/views/modal/flight-detail-modal.html',
    //         controller: 'flightModalInstanceCtrl',
    //         backdrop: "static",
    //         resolve: {
    //             detailItem: function() {
    //                 return detailItem;
    //             }
    //         }
    //     });
    //
    //     $scope.modalInstance.result.then(function (data) {
    //         if(data){
    //             flightServices.save($scope.dataList).then(function (res) {
    //                 toastr.success(res.data.message);
    //             })
    //         }
    //     })
    // }
}

// function flightModalInstanceCtrl($scope, $state, $modalInstance, detailItem) {
//     $scope.detailItem = angular.copy(detailItem);
//
//     $scope.save = function () {
//         if($("#detailForm").valid()){
//             Object.assign(detailItem, $scope.detailItem);
//             $modalInstance.close(detailItem);
//         }
//     };
//
//     $scope.cancel = function () {
//         $modalInstance.dismiss('cancel');
//     };
// }

angular
.module('piApp')
.controller('lineStaticCtrl', lineStaticCtrl)
;