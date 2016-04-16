FutbalApp.directive('pridajHru', function(HryServis, $rootScope, HraciServis) {
	return {
		restrict: 'E',
		controller: function($scope, $timeout, $q) {
			$scope.zvolenyHraci = [];
			$scope.zvolenyHraci2 = [];

			$scope.querySearch = function(query) {
				var results = query ?
					$scope.vsetciHraci.filter(createFilterFor(query)) : [];
				return results;
			}

			function createFilterFor(query) {
		      var lowercaseQuery = query;
		      return function filterFn(b) {
		        return (b.menoHraca.indexOf(lowercaseQuery) != -1);
		      };
		    }

			$scope.vsetciHraci = HraciServis.hraci;
		},
		link: function(scope, element, attr, $timeout, $q) {
			scope.pridajHru = function() {
				HryServis.pridajHru(scope.meno, JSON.stringify(scope.zvolenyHraci), JSON.stringify(scope.zvolenyHraci2)).then(
					function(result) {
						HryServis.nacitajHry().then(
								function(result) {
									HryServis.hry = result;
									scope.hry = HryServis.hry;
									$rootScope.$broadcast('nahrateHry');
								},
								function error(error) {
									console.log(error.statusText);
									scope.hry = null;
								}
							)
					},
					function error(error) {
						console.log(error.statusText);
						scope.hraci = null;
					}
				);
			};
		},
		template: `	
					<div ng-cloak layout="row">
						<div flex="1">
							<md-content class="md-padding">
								<md-input-container class="md-block">
									<label>Zadaj názov hry</label>
									<input ng-model="meno">
								</md-input-container>
							</md-content>
						</div>
					</div>
					
					<div ng-cloak layout="row">

						<div flex="1">
							<md-content class="md-padding autocomplete">
							  <h3>Bieli</h3>
							  <md-contact-chips filter-selected="false" ng-model="zvolenyHraci" md-contacts="querySearch($query)" md-contact-name="menoHraca" placeholder="Napíš meno"></md-contact-chips>

								<md-list class="fixedRows">
							      <md-subheader class="md-no-sticky">Hráči</md-subheader>
							      <md-list-item class="md-2-line contact-item" ng-repeat="hrac in vsetciHraci">
							        <div class="md-list-item-text compact">
							          <h3>{{hrac.menoHraca}}</h3>
							        </div>
							      </md-list-item>
							    </md-list>
							</md-content>
						</div>

						<div flex="1">
							<md-content class="md-padding autocomplete">
							<h3>Modrí</h3>
							  <md-contact-chips filter-selected="false" ng-model="zvolenyHraci2" md-contacts="querySearch($query)" md-contact-name="menoHraca" placeholder="Napíš meno"></md-contact-chips>

								<md-list class="fixedRows">
							      <md-subheader class="md-no-sticky">Hráči</md-subheader>
							      <md-list-item class="md-2-line contact-item" ng-repeat="hrac in vsetciHraci">
							        <div class="md-list-item-text compact">
							          <h3>{{hrac.menoHraca}}</h3>
							        </div>
							      </md-list-item>
							    </md-list>
							</md-content>
						</div>
					</div>

					<div ng-cloak layout="row">
						<div flex="1">
							<md-button ng-click="pridajHru()" class="md-raised md-warn">Ulož</md-button>
						</div>
					</div>
				`
	}
});