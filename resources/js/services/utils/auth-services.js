function authService($cookies, $cookieStore){

    var getAuthorizedUser = function(){
        var existing_cookie_user = $cookies.get('userInfo');
        var currentUser;
        if(existing_cookie_user){
            currentUser = jQuery.parseJSON(existing_cookie_user)
        }
        return currentUser;
    }

    var userAuthorize = function(item){
        //expire in 30 mins
        var expireDate=new Date();
        expireDate.setTime(expireDate.getTime() + 1800*1000);
        //expireDate.setTime(expireDate.getTime() + 10*1000);

        $cookies.put('userInfo', JSON.stringify(item), {'expires': expireDate.toGMTString()});
    }

    var keepAccountAlive = function(){
        var expireDate=new Date();
        expireDate.setTime(expireDate.getTime() + 1800*1000);
        var currentUserInfo = getAuthorizedUser();
        if(currentUserInfo != undefined){
            $cookies.put('userInfo', JSON.stringify(currentUserInfo), {'expires': expireDate.toGMTString()});
        }
    }

    var userInvalid = function(){
        $cookies.remove('userInfo');
        //$cookies.remove('jsessionid');
    }

    var getJSessionId = function(){
        return $cookies.get('jsessionid');
    }

    return{
        getAuthorizedUser: getAuthorizedUser,
        userAuthorize: userAuthorize,
        userInvalid: userInvalid,
        keepAccountAlive: keepAccountAlive,
        getJSessionId: getJSessionId
    }
}

angular
.module('piApp')
.factory('authService', authService);

