app.controller('UserDetailController', function($rootScope, $scope, $route, $firebaseObject) {
	
	var userId = $route.current.params.code;
	var selectedEvent = null;
	var month = ['enero','febrero','marzo','abril','mayo','junio','julio','agosto','septiembre','obtubre','noviembre','diciembre'];

	$('.btn-group.pull-left.back').addClass('hidden');
	$('.btn-group.pull-left.menu').removeClass('hidden');

	$scope.openScnanernext = function() {
		location.href = 'zxing://scan/?ret=http://'+ location.host +'/reciveCode.html?code={CODE}';
	};

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

	if (!userId) {
		location.href = "#/home";
	}

	var isValidated = function(events) {
		if (!events)
			return false;

		var visitedEvents = Object.keys(events);
		if (visitedEvents.indexOf(selectedEvent.id) >= 0) {
			$('.row.validated').removeClass('hidden');
			$('.row.row-buttons').addClass('hidden');
		}
		else
			return false;
	};

	var user = firebase.database().ref('/users/' + userId);
	user = $firebaseObject(user);
	user.$loaded().then(function(){
		if (!user.email){
			alert('Usuario no existe en la base de datos');
			$rootScope.selectedEventId = localStorage.getItem('selectedEventId');
			location.href = "#/event-detail";
		}
		selectedEvent = firebase.database().ref('/events/' + localStorage.getItem('selectedEventId'));
		selectedEvent = $firebaseObject(selectedEvent);
		selectedEvent.$loaded().then(function(){
			console.log(selectedEvent);
			$scope.selectedEvent = selectedEvent;
			$scope.user = user;
			console.log(selectedEvent.freemiumHour , new Date().getTime() );
			$scope.enterPrice = selectedEvent.freemiumHour > new Date().getTime() ?
			'Entrada en horario gratis.' : 'Porcentaje de descuento: ' + selectedEvent.descOutHour + '%'; 
			if (user.asistProd)
				isValidated(user.asistProd[$rootScope.doorman.uid]);
			$('.user-detail .splash-content').addClass('hidden');
		});
	});

	var checkIsfirstTime = function() {
		if (user.asistProd && user.asistProd[$rootScope.doorman.uid])
			return false;
		else 
			return true;
	}

	$scope.acceptUser = function() {
		$('.user-detail .validating').removeClass('hidden');
		var isDescActive = ($scope.selectedEvent.freemiumHour > new Date().getTime());
		var userData = {
			displayName: user.displayName,
			email: user.email,
			gender: user.gender || '',
			dateAttendance: new Date().getTime(),
			birthday: user.birthday || '',
			descActive: !isDescActive,
			isFirstTime: checkIsfirstTime()
		};
		var historyRef = 'history/'+ selectedEvent.id + '/' + $rootScope.doorman.uid + '/' + userId;
		firebase.database().ref(historyRef).set(userData).then(
        function(s){
          	var userRef = 'users/' + userId + '/asistProd/'+ $rootScope.doorman.uid + '/' + selectedEvent.id;
          	firebase.database().ref(userRef).set(new Date().getTime()).then(
  				function(s) {
					var adminRef = 'admins/' + selectedEvent.admin + '/clients/' + userId;
					firebase.database().ref(adminRef).set(true).then(
  						function(s) {
							var userHistoryRef = 'users/' + userId + '/history/' + selectedEvent.id;
							firebase.database().ref(userHistoryRef).set(true).then(
  								function(s) {
  									var date = new Date();
  									var facturaId = month[date.getMonth()] + date.getUTCFullYear();
  									var ref = firebase.database().ref('admins/' + selectedEvent.admin +'/facturas/'+facturaId);
  									var facturaRequest = $firebaseObject(ref);
  									facturaRequest.$loaded().then(function(){
  										var update = {
  											pay: false,
  											usersDesc: facturaRequest.usersDesc ? (isDescActive ? facturaRequest.usersDesc + 1 : facturaRequest.usersDesc) : 1,
  											usersFree: facturaRequest.usersFree ? (!isDescActive ? facturaRequest.usersFree + 1 : facturaRequest.usersFree) : 1
  										};
  										firebase.database().ref('admins/' + selectedEvent.admin + '/facturas/' + facturaId).set(update).then(
  											function(s){
												$('.row.validated').removeClass('hidden');
												$('.row.row-buttons').addClass('hidden');
												$('.user-detail .validating').addClass('hidden');

  											},function(e){
												alert('Error, intente de nuevo');
								        		console.log('se guardo mal ', e);
  											}
										);
  									});
  								}, function(e) {
									alert('Error, intente de nuevo');
					        		console.log('se guardo mal ', e);
  								}
							);
  						}, function(e) {
							alert('Error, intente de nuevo');
			        		console.log('se guardo mal ', e);
  						}
					);
  				}, function(e) {
			        alert('Error, intente de nuevo');
			        console.log('se guardo mal ', e);
  				}
  			);
        }, function(e) {
          alert('Error, intente de nuevo');
          console.log('se guardo mal ', e);
        }
      );
	}

});
