var FutbalApp = angular.module('FutbalApp', ['ngAnimate', 'ngRoute', 'ngMaterial']);

/******************************************************************/
/******** Filtre 		 						 ******************/
/******************************************************************/
FutbalApp.filter('zoradPodla', function(){
	return function(input, attribute) {
		if (!angular.isObject(input)) return input;

		var array = [];
		for(var objectKey in input) {
			array.push(input[objectKey]);
		}

		array.sort(function(a, b) {
			a = parseInt(a[attribute]);
			b = parseInt(b[attribute]);
			return a - b;
		});

		return array;
	}
});
/******************************************************************/
/******** Config 		  						 ******************/
/******************************************************************/
FutbalApp.config(['$httpProvider', '$routeProvider', '$mdThemingProvider', '$locationProvider', function($httpProvider, $routeProvider, $mdThemingProvider, $locationProvider) {
	$routeProvider.
			when('/hraci', {
				templateUrl: 'app/hraci/templ.hraci.html',
				controller: 'HraciCtrl',
				activetab: 'hraci'
			}).
			when('/hry', {
				templateUrl: 'app/hry/hry.html',
				controller: 'HryCtrl',
				activetab: 'hry'
			}).
			when('/zacniHru/:idHry', {
				templateUrl: 'app/hry/templ.zacataHra.html',
				controller: 'zacataHraCtrl',
				activetab: 'hry'
			}).
			when('/zobrazHru/:idHry/:nazov', {
				templateUrl: 'app/hry/zaznamHry.html',
				controller: 'zaznamHryCtrl',
				activetab: 'hry'
			}).
			when('/zmeny', {
				templateUrl: 'app/zmeny/templ.zmeny.html',
				controller: 'zmenyCtrl',
				activetab: 'zmeny'
			}).
			when('/nastavenia', {
				templateUrl: 'app/nastavenia/templ.nastavenia.html',
				controller: 'nastaveniaCtrl as $ctrl',
				activetab: 'nastavenia'
			}).
			otherwise({
				redirectTo: 'hry'
			});

	$locationProvider.html5Mode(true).hashPrefix('*');

	$mdThemingProvider.theme('default')
		.primaryPalette('blue')
		.accentPalette('red');
}]);

/******************************************************************/
/******** Direktivy	 	  						 ******************/
/******************************************************************/
FutbalApp.directive('prihlasovaciFormular', function() {
	return {
		restrict: 'E',
		controller: function() {
			
		},
		template: "<br><br><form><input type='text' ng-model='meno'><input `type='password' ng-model='heslo'><button type='submit'>Prihlas sa</button></form>"
	}
});


/******************************************************************/
/******** Ctrl 			 						 ******************/
/******************************************************************/
FutbalApp.controller('HlCtrl', HlCtrl);
FutbalApp.controller('HraciCtrl', HraciCtrl);
FutbalApp.controller('HryCtrl', HryCtrl);
FutbalApp.controller('zacataHraCtrl', zacataHraCtrl);
FutbalApp.controller('zaznamHryCtrl', zaznamHryCtrl);
FutbalApp.controller('zmenyCtrl', zmenyCtrl);
FutbalApp.controller('nastaveniaCtrl', nastaveniaCtrl);