function zacataHraCtrl($scope, HraciServis, HryServis, $routeParams, $window) {
	var _this = this;

	HraciServis.vsetkyStreleneGoly = [];
	$scope.idHry = $routeParams.idHry;
	$scope.modry = 0;
	$scope.biely = 0;

	$scope.dalGol = function(id_hraca, index) {
		HraciServis.vsetkyStreleneGoly.push({id_hry: $scope.idHry, id_hraca: id_hraca, farba: HraciServis.hraciDanejhry[index].farba});

		if(typeof HraciServis.hraciDanejhry[index].goly != 'undefined') {
			HraciServis.hraciDanejhry[index].goly++;
		} else  {
			HraciServis.hraciDanejhry[index].goly = 1;
		}

		if(HraciServis.hraciDanejhry[index].farba == 1) {
			$scope.biely++;
		} else {
			$scope.modry++;
		}
	}

	$scope.ukonciAulozStav = function(idHry) {
		HryServis.ulozHru($scope.idHry, JSON.stringify(HraciServis.vsetkyStreleneGoly)).then(
			function(result) {
				HryServis.nacitajHry().then(
					function(result) {
						HryServis.hry = result;
						$scope.hry = HryServis.hry;
						$scope.chod('hry');
					},
					function error(error) {
						console.log(error.statusText);
						$scope.hry = null;
					}
				);
				HraciServis.nacitajHracov().then(
					function(result) {
						HraciServis.hraci = result;
						$scope.hraci = HraciServis.hraci;
					},
					function error(error) {
						console.log(error.statusText);
						$scope.hraci = null;
					}
				);
			},
			function error(error) {
				console.log(error.statusText);
				$scope.hraci = null;
			}
		);

		HraciServis.hraci = null;
		$scope.modry = 0;
		$scope.biely = 0;
		HraciServis.vsetkyStreleneGoly = [];
	}

	HraciServis.nacitajHracovDanejhry($scope.idHry).then(
		function(result) {
			$scope.modry = 0;
			$scope.biely = 0;
			HraciServis.vsetkyStreleneGoly = [];
			HraciServis.hraciDanejhry = result;
			$scope.hraciDanejhry = HraciServis.hraciDanejhry;
		},
		function error(error) {
			console.log(error.statusText);
			$scope.hraciDanejhry = null;
		}
	)
}