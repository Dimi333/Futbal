function zaznamHryCtrl($scope, HraciServis, HryServis, $routeParams, $window) {
	var _this = this;

	$scope.idHry = $routeParams.idHry;
	$scope.nazov = $routeParams.nazov;
	$scope.vysledokBielych = 0;
	$scope.vysledokModrych = 0;
	$scope.chartObject = [];

	$scope.spocitajVysledok = function(hraci) {
		for(i=0; i<hraci.length; i++) {
			if(hraci[i].farba == 1) {
				$scope.vysledokBielych += Number(hraci[i].kolkoStrelilGolov);
			} else {
				$scope.vysledokModrych += Number(hraci[i].kolkoStrelilGolov);
			}
		}
	}

	HraciServis.nacitajHracovDanejhrySgolmi($scope.idHry).then(
		function(result) {
			HraciServis.hraciDanejhrySgolmi = result;
			$scope.hraciDanejhrySgolmi = HraciServis.hraciDanejhrySgolmi;
			$scope.spocitajVysledok($scope.hraciDanejhrySgolmi);
			
			for(i=0; i<$scope.hraciDanejhrySgolmi.length; i++) {
				$scope.chartObject.push(
					[$scope.hraciDanejhrySgolmi[i].meno, Number($scope.hraciDanejhrySgolmi[i].kolkoStrelilGolov)]
				);
			}
			$scope.chartObject = JSON.stringify($scope.chartObject);
		},
		function error(error) {
			console.log(error.statusText);
			$scope.hraciDanejhrySgolmi = null;
		}
	)
}