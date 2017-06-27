
//Default
function defaultCtrl($scope, $rootScope, $http, authService, $modal) {

    $scope.isAdmin = false;
    $scope.loggedUser = authService.getAuthorizedUser();
    if($scope.loggedUser){
        if($scope.loggedUser.roleId == 1) $scope.isAdmin = true;
    }else{
        $scope.loggedUser = {
            roleId: 2,
            firstName: "Guest",
            lastName: "User"
        };
    }

    //save confirmation
    $scope.saveConfirmation = function (targetScope, action) {
        $scope.modalInstance = $modal.open({
            templateUrl: '/resources/views/modal/save-confirmation-modal.html',
            controller: 'saveConfirmationModalInstanceCtrl',
            resolve: {
                confirmAction: function() {
                    return action;
                },
                targetScope : function() {
                    return targetScope;
                }
            }
        });
    }

    $rootScope.deleteConfirmation = function (targetScope, action) {
        $scope.modalInstance = $modal.open({
            templateUrl: '/resources/views/modal/delete-confirmation-modal.html',
            controller: 'deleteConfirmationModalInstanceCtrl',
            resolve: {
                confirmAction: function() {
                    return action;
                },
                targetScope : function() {
                    return targetScope;
                }
            }
        });
    }
}

//translateCtrl - Controller for translate
function translateCtrl($translate, $scope) {
    $scope.changeLanguage = function (langKey) {
        $translate.use(langKey);
    };
}

//logout
function logoutCtrl($scope, $modal){

    $scope.logoutConfirm = function () {
        $scope.modalInstance = $modal.open({
          templateUrl: '/resources/views/modal/logout-modal.html',
          controller: 'logoutModalInstanceCtrl'
        });
    }
}

function logoutModalInstanceCtrl ($scope, $modalInstance, authService, $location) {
    
    $scope.logout = function () {
        $modalInstance.close();
        authService.userInvalid();
        $location.path("/login");
    };

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
}

function saveConfirmationModalInstanceCtrl($scope, $modalInstance, authService, $location, confirmAction, targetScope) {
    $scope.confirmAction = confirmAction;
    $scope.targetScope = targetScope;
    $scope.confirm = function () {
        $scope.targetScope.$eval($scope.confirmAction);
        $modalInstance.close();
    };

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
}

function deleteConfirmationModalInstanceCtrl($scope, $modalInstance, authService, $location, confirmAction, targetScope) {
    $scope.confirmAction = confirmAction;
    $scope.targetScope = targetScope;
    $scope.confirm = function () {
        $scope.targetScope.$eval($scope.confirmAction);
        $modalInstance.close();
    };

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
}

angular
.module('piApp')
.controller('defaultCtrl', defaultCtrl)
.controller('logoutCtrl', logoutCtrl)
.controller('logoutModalInstanceCtrl', logoutModalInstanceCtrl)
.controller('translateCtrl', translateCtrl)
.controller('saveConfirmationModalInstanceCtrl', saveConfirmationModalInstanceCtrl)
.controller('deleteConfirmationModalInstanceCtrl', deleteConfirmationModalInstanceCtrl)
;