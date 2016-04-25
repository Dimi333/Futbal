function HlCtrl($scope, HraciServis, NastaveniaServis, $window, $mdSidenav, $location) {
	var _this = this;

	$scope.zn = '1.3 (1.0)';

	$scope.chod = function(kam) {
		$location.path(kam);
	}

	$scope.toggleMenu = function() {
		$mdSidenav('left').toggle();
	}
}
