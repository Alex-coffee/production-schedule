function productStaticServices($http, $q){

    var getProductStaticData = function () {
        return $http.get("demo/or/input/ProductStaticData.json")
    }


    return{
        getProductStaticData: getProductStaticData
    }
}

angular
.module('piApp')
.factory('productStaticServices', productStaticServices);

