
app.controller('EventDetailController', function($rootScope, $scope) {

	$scope.isOntime = true;

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

	var isOntime = function() {
		var date = new Date();
		if (($scope.event.fromHour < date && $scope.event.toHour > date))
			return true;
		else 
			return false;
	}

	if (!$rootScope.selectedEvent) {
		location.href = "#/home";
	} else {
		$scope.event = $rootScope.selectedEvent;
		$scope.isOntime = !isOntime();
	}

});
