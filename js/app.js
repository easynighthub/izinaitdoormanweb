/* eslint no-alert: 0 */

'use strict';

var app = angular.module('myApp', [
  'ngRoute',
  'mobile-angular-ui',
  'firebase'
]);

app.config(function($routeProvider) {
  $routeProvider.when('/', {templateUrl: 'views/home.html', reloadOnSearch: false});
  $routeProvider.when('/home', {templateUrl: 'views/home.html', reloadOnSearch: false});
  $routeProvider.when('/login', {templateUrl: 'views/login.html', reloadOnSearch: false});
  $routeProvider.when('/event-detail', {templateUrl: 'views/eventDetail.html', reloadOnSearch: false});
  $routeProvider.when('/user-detail', {templateUrl: 'views/userDetail.html', reloadOnSearch: false});
});

window.logout = function() {
	firebase.auth().signOut().then(function() {
		localStorage.clear();
		window.location.href = '#/login';
		console.log('Signed Out');
	}, function(error) {
	    console.error('Sign Out Error', error);
	});
};
