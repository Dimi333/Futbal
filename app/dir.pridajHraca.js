FutbalApp.directive('pridajHraca', function(HraciServis, $rootScope) {
	return {
		restrict: 'E',	
		scope: {
			hraci: "&",
			pridaj: "=pridaj",
			idhraca: "@idhraca"
		},
		link: function(scope, element, attr) {
			scope.pridajHraca = function() {
				HraciServis.pridajHraca(scope.meno, scope.cislo).then(
					function(result) {
						HraciServis.nacitajHracov().then(
							function(result) {
								HraciServis.hraci = result;
								scope.hraci = HraciServis.hraci;
								$rootScope.$broadcast('nahratyHraci');
							},
							function error(error) {
								console.log(error.statusText);
							}
						)
					},
					function error(error) {
						console.log(error.statusText);
					}
				);
			}

			function createFilterFor(query) {
				return function filterFn(b) {
					return (b.idHraca == query);
				};
			}

			function createFilterForCislo(query) {
				return function filterFn(b) {
					return (b.cislo == query);
				};
			}

			if(scope.pridaj != 1) {
				var meno = HraciServis.hraci.filter(createFilterFor(scope.idhraca));
				scope.meno = meno[0].menoHraca || "";

				var cislo = HraciServis.hraci.filter(createFilterForCislo(scope.idhraca));
				scope.cislo = meno[0].cislo || "";
			}


			scope.upravHraca = function() {
				HraciServis.upravHraca(scope.meno, scope.cislo, scope.idhraca).then(
					function(result) {
						HraciServis.nacitajHracov().then(
							function(result) {
								HraciServis.hraci = result;
								scope.hraci = HraciServis.hraci;
								$rootScope.$broadcast('nahratyHraci');
							},
							function error(error) {
								console.log(error.statusText);
							}
						)
					},
					function error(error) {
						console.log(error.statusText);
					}
				);
			}
		},
		template: 
	`

		<md-input-container class="md-block">
			<label>Zadaj meno hráča</label>
			<input ng-model="meno">
		</md-input-container>

		<md-input-container class="md-block">
			<label>Zadaj číslo dresu hráča</label>
			<input ng-model="cislo">
		</md-input-container>

		<md-button ng-show="pridaj" ng-click="pridajHraca()" class="md-raised md-primary">Uložiť</md-button>

		<md-button ng-hide="pridaj" ng-click="upravHraca()" class="md-raised md-primary">Zmeniť</md-button>

	`
	}
});