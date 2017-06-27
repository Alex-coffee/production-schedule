function lineStaticServices($http, $q){

    var getLineStaticData = function () {
        return $http.get("demo/or/input/LineStaticData.json")
    }


    return{
        getLineStaticData: getLineStaticData
    }
}

angular
.module('piApp')
.factory('lineStaticServices', lineStaticServices);

