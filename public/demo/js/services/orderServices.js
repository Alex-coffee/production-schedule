function orderServices($http, $q){

    var getOrders = function () {
        return $http.get("demo/or/input/Orders.json")
    }


    return{
        getOrders: getOrders
    }
}

angular
.module('piApp')
.factory('orderServices', orderServices);

