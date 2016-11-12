app.controller('UserDetailController', function($rootScope, $scope, $route, $firebaseObject) {
	console.log($route.current.params);

	var validateUser = function() {
		if ($rootScope.doorman)
			return true;

	  	for ( var i = 0, len = localStorage.length; i < len; ++i ) {
		  	var str = localStorage.key(i);
			var patt = new RegExp('firebase:authUser:');
			if(patt.test(str)){
				$rootScope.doorman = JSON.parse(localStorage.getItem(str));
				return true;
			}
		}
		return false;
	}

	if (!validateUser()){
		location.href = "#/login";
	}

	var userId = $route.current.params;

	var user = firebase.database().ref('/users/' + userId.code);
	user = $firebaseObject(user);
	user.$loaded().then(function(){
		console.log(user);
		$scope.user = user;
	});

});
