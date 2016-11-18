
app.controller('EventDetailController', function($rootScope, $scope, $firebaseObject) {

	$scope.isOntime = true;
	$scope.url = 'zxing://scan/?ret=http://'+ location.host +'/reciveCode.html?code={CODE}';

	$('.btn-group.pull-left.back').removeClass('hidden');
	$('.btn-group.pull-left.menu').addClass('hidden');
	$('.btn-group.pull-left.back').click(function(){
		location.href = '#/home';
	});

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

	if ($rootScope.selectedEvent) {
		$scope.event = $rootScope.selectedEvent;
		localStorage.setItem("selectedEventId", $scope.event.id);
		$scope.isOntime = !isOntime();
	}else if ($rootScope.selectedEventId) {
		var newEvent = firebase.database().ref('/events/' + $rootScope.selectedEventId);
		newEvent = $firebaseObject(newEvent);
		newEvent.$loaded().then(function(){
			$scope.event = newEvent;
			$scope.isOntime = !isOntime();
		});
	}else {
		location.href = "#/home";
	}

	$scope.openScanner = function() {
		location.href = $scope.url;
	};

});
