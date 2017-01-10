app.controller('LoginController', function($rootScope, $scope, $route, $routeParams, $location, $firebaseObject) {

	if ($location.path() == '/login') {
		$('.btn-group.pull-left').addClass('hidden');
	}

	var validateUser = function() {
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

	if(validateUser()) {
		$('.btn-group.pull-left').removeClass('hidden');
		window.location.href = '#/home';
	}

	$scope.login = function() {
		firebase.auth().signInWithEmailAndPassword($scope.email, $scope.password).then(
			function(s){
				var doorman = $firebaseObject(firebase.database().ref('/doormans/' + s.uid));
				doorman.$loaded().then(function(){
					if (('$value' in doorman)){
						alert('Este usuario no es doorman');
						window.logout();
					}else {
						$rootScope.doorman = s;
						$('.btn-group.pull-left').removeClass('hidden');
						window.location.href = '#/home';
					}
				});
			},
			function(e) {
			  $('.account-wall form p').text(e.message);
		});
	}
});
