
app.controller('MainController', function($rootScope, $scope, $firebaseObject, $firebaseArray) {

	$scope.isLoaded = true;
	$scope.events = [];
	var eventIndex = 0;

	$('.btn-group.pull-left.back').addClass('hidden');
	$('.btn-group.pull-left.menu').removeClass('hidden');

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

	if (validateUser()){
		$scope.isLoaded = false;
	} else {
		location.href = "#/login";
	}

	var getEvents = function(index){
		var newEvent = firebase.database().ref('/events/' + $scope.eventsId[index]);
		newEvent = $firebaseObject(newEvent);
		newEvent.$loaded().then(function(){
			var date = new Date();
			if (newEvent.toHour > date) {
				$scope.events.push(newEvent);
			}
			eventIndex++;
			if ($scope.eventsId.length > eventIndex){
				getEvents(eventIndex);
			}
		});
	};

	var doormanData = $firebaseObject(firebase.database().ref('/doormans/').child($rootScope.doorman.uid));
	doormanData.$loaded().then(function(){
		$('.left-menu-header .name').text(doormanData.name);
		$('.left-menu-header .email').text(doormanData.email);
		$rootScope.doormanData = doormanData;
		if(doormanData.events) {
			$scope.eventsId = Object.keys(doormanData.events);
			getEvents(eventIndex);
		}
	});

	$scope.goToEventDetails = function(event) {
		$rootScope.selectedEvent = event;
		location.href = "#/event-detail";
	}

});
