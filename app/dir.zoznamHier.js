FutbalApp.directive('zoznamHier', function(HryServis, $q, $rootScope, $mdMedia, $mdDialog) {
	return {
		restrict: 'E',
		link: function(scope, element, attr) {
			scope.zvolenaHra = null;

			scope.$on('nahrateHry', function(event, args) {
				scope.hry = HryServis.hry;
			});

			scope.chcesZmazatHru = function(ev) {
				if(typeof scope.zvolenaHra == 'undefined' || scope.zvolenaHra == null) {
					$mdDialog.show(
						$mdDialog.alert()
						.parent(angular.element(document.querySelector('#popupContainer')))
						.clickOutsideToClose(true)
						.title('Nieje zvolený zápas!')
						.textContent('Musíte zvoliť ktorý zápas chcete zmazať!')
						.ariaLabel('Výstraha, nieje vybratý zápas')
						.ok('Dobre')
						.targetEvent(ev)
					);
				} else {
					var confirm = $mdDialog.confirm()
						.title('Naozaj chcete zmazať hru?')
						.textContent('Zmažú sa aj všetky strelené góly!')
						.ariaLabel('Naozaj zmazať hru?')
						.targetEvent(ev)
						.ok('Áno')
						.cancel('Nie');

					$mdDialog.show(confirm).then(function() {
						scope.zmazHru(scope.zvolenaHra, ev);
					}, function() {
						scope.status = 'zatvor';
					});
				}
			};

			scope.zvolHru = function(id) {
				scope.zvolenaHra = id;
			}

			scope.zmazHru = function(id, ev) {
				HryServis.zmazHru(id).then(
					function(result) {
						HryServis.nacitajHry().then(
							function(result) {
								HryServis.hry = result;
								scope.hry = HryServis.hry;
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
		template: `<div class="row">
						<md-radio-group ng-model="zvolenaHra">
							<div class="obalTabulky">
								<table class="table">
									<thead>
										<tr>
											<th></th>
											<th>Názov hry</th>
											<th class="tac">Výsledok</th>
											<th class="md-whiteframe-z1">Bieli</th>
											<th class="modry tac md-whiteframe-z1">Modrí</th>
										</tr>
									</thead>
									<tbody>
										<tr ng-repeat="x in hry">
											<td class="prvyRiadokRadio"><md-radio-button ng-click="zvolHru(x.idHry)" ng-value="x.id" class="md-primary" aria-label="Id hry"></md-radio-button></td>
											<td>
												<md-button ng-if="x.odohrate == 1" type="button" ng-click="zobrazHru(x.id, x.nazov)" class="md-raised md-primary">{{x.nazov}}</small></md-button>
												<md-button ng-if="x.odohrate == 0" type="button" ng-click="otvorHru(x.id)" class="md-raised md-warn">Začni hru <small>{{x.nazov}}</small></md-button>
											</td>
											<td class="tac"><b>{{x.vysledok}}</b></td>
											<td class="md-whiteframe-z1">{{x.biely}}</td>
											<td class="modry tac md-whiteframe-z1">{{x.modry}}</td>
										</tr>
									</tbody>
								</table>
							</div>
						</md-radio-group>

						<md-button type="button" ng-click="chcesZmazatHru($event)" class="md-raised md-warn">Zmazať hru</md-button>
				</div>`
	}
});