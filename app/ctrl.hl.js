function HlCtrl($scope, HraciServis, $window, $mdSidenav) {
	var _this = this;

	$scope.zn = '1.2 (1.0)';

	$scope.chod = function(kam) {
		$window.location.href = kam;
	}

	$scope.toggleMenu = function() {
		$mdSidenav('left').toggle();
	}
}
