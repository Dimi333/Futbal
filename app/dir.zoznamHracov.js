FutbalApp.directive('zoznamHracov', function(HraciServis, $q, $rootScope, $mdMedia, $mdDialog, NastaveniaServis) {
	return {
		restrict: 'E',
		scope: {
			hraci: "=hraci",
			upravy: "=upravy"
		},
		link: function(scope, element, attr) {
			scope.zvolenyHrac = null;
			scope.NastaveniaServis = NastaveniaServis;

			scope.$on('nahratyHraci', function(event, args) {
				scope.hraci = HraciServis.hraci;
			});

			scope.zmazHraca = function(id) {
				HraciServis.zmazHraca(id).then(
					function(result) {
						HraciServis.nacitajHracov().then(
							function(result) {
								HraciServis.hraci = result;
								scope.hraci = HraciServis.hraci;
							},
							function error(error) {
								console.log(error.statusText);
								scope.hraci = null;
							}
						)
					},
					function error(error) {
						console.log(error.statusText);
						scope.hraci = null;
					}
				);
			};

			scope.zvolHraca = function(id) {
				scope.zvolenyHrac = id;
			}

			scope.chcesZmazatHraca = function(ev) {
				if(typeof scope.zvolenyHrac == 'undefined' || scope.zvolenyHrac == null) {
					$mdDialog.show(
						$mdDialog.alert()
						.parent(angular.element(document.querySelector('#popupContainer')))
						.clickOutsideToClose(true)
						.title('Nieje zvolený hráč!')
						.textContent('Musíte zvoliť ktorého hráča chcete zmazať!')
						.ariaLabel('Výstraha, nieje vybratý hráč')
						.ok('Dobre')
						.targetEvent(ev)
					);
				} else {
					var confirm = $mdDialog.confirm()
						.title('Naozaj chcete zmazať hráča?')
						.textContent('Góly ostanú zachované')
						.ariaLabel('Naozaj zmazať hráča?')
						.targetEvent(ev)
						.ok('Áno')
						.cancel('Nie');

					$mdDialog.show(confirm).then(function() {
						scope.zmazHraca(scope.zvolenyHrac);
					}, function() {
						scope.status = 'zatvor';
					});
				}
			};

			scope.upravHraca = function(ev, zvolenyHrac) {
				if(typeof scope.zvolenyHrac == 'undefined' || scope.zvolenyHrac == null) {
					$mdDialog.show(
						$mdDialog.alert()
						.parent(angular.element(document.querySelector('#popupContainer')))
						.clickOutsideToClose(true)
						.title('Nieje zvolený hráč!')
						.textContent('Musíte zvoliť ktorého hráča chcete upraviť!')
						.ariaLabel('Výstraha, nieje vybratý hráč')
						.ok('Dobre')
						.targetEvent(ev)
					);

					return;
				}

				var useFullScreen = ($mdMedia('sm') || $mdMedia('xs'))  && scope.customFullscreen;
				scope.zvolenyHrac = zvolenyHrac;

				$mdDialog.show({
					controller: function($scope, $mdDialog, zvolenyHrac) {
						$scope.zvolenyHrac = zvolenyHrac;

						$scope.hide = function() {
							$mdDialog.hide();
						};
						
						$scope.cancel = function() {
							$mdDialog.hide();
						};
						
						$scope.answer = function(answer) {
							$mdDialog.hide(answer);
						};
					},
					locals: {
						zvolenyHrac: zvolenyHrac
					},
					template: `
						<md-dialog aria-label="Úprava hráča" ng-cloak>
							<form>
								<md-toolbar>
									<div class="md-toolbar-tools">
										<h2>Úprava hráča</h2>

										<span flex></span>

										<md-button class="md-icon-button" ng-click="cancel()">
											<md-icon md-svg-src="img/ic_close_24px.svg" aria-label="Close dialog"></md-icon>
										</md-button>
									</div>
								</md-toolbar>

								<md-dialog-content>
									<div class="md-dialog-content">
										<pridaj-hraca uprav="1" idhraca="{{zvolenyHrac}}"></pridaj-hraca>
									</div>
								</md-dialog-content>

								<md-dialog-actions layout="row">
									<md-button ng-click="cancel()" style="margin-right:20px;">
										Zatvor
									</md-button>
								</md-dialog-actions>
							</form>
						</md-dialog>
					`,
					targetEvent: ev,
					clickOutsideToClose:true,
					fullscreen: useFullScreen
				})
				.then(function(answer) {
					//$scope.status = 'You said the information was "' + answer + '".';
				}, function() {
					//$scope.status = 'You cancelled the dialog.';
				});

				scope.$watch(function() {
					return $mdMedia('xs') || $mdMedia('sm');
				}, function(wantsFullScreen) {
					scope.customFullscreen = (wantsFullScreen === true);
				});
			};
		},
		controller: function($scope) {
			if($scope.upravy == 0) {
				$scope.predicate = 'farba';
			} else {
				$scope.predicate = 'kolkoStrelilGolov';
			}
			$scope.reverse = true;

			$scope.order = function(predicate) {
				$scope.reverse = ($scope.predicate === predicate) ? !$scope.reverse : false;
				$scope.predicate = predicate;
			};
		},
		template: `
				<div class="row">
					<md-radio-group ng-model="zvolenyHrac">
						<div class="obalTabulky">
							<table class="table">
								<thead>
									<tr>
										<th ng-show="upravy"></th>
										<th>
											<md-button>Číslo</md-button>
										</th>
										<th>
											<md-button ng-click="order('menoHraca')">Meno</md-button>
		     								<span class="sortorder" ng-show="predicate === 'menoHraca'" ng-class="{reverse:reverse}"></span>
		     							</th>
										<th>
											<md-button ng-click="order('kolkoStrelilGolov')">Góly</md-button>
		     								<span class="sortorder" ng-show="predicate === 'kolkoStrelilGolov'" ng-class="{reverse:reverse}"></span>
										</th>
										<th ng-show="upravy">
											<md-button ng-click="order('pocetHier')">Počet zápasov</md-button>
		     								<span class="sortorder" ng-show="predicate === 'pocetHier'" ng-class="{reverse:reverse}"></span>
		     							</th>
									<th>
											<md-button ng-click="order('pocetVyhier')">Počet výhier</md-button>
		     								<span class="sortorder" ng-show="predicate === 'pocetVyhier'" ng-class="{reverse:reverse}"></span>
		     							</th>
										<!--th ng-show="upravy">
											<md-button ng-click="order('pocetHier')">Počet prehier</md-button>
		     								<span class="sortorder" ng-show="predicate === 'pocetHier'" ng-class="{reverse:reverse}"></span>
		     							</th-->
										<th ng-show="hraci[0].farba">
											<md-button ng-click="order('farba')">Farba</md-button>
		     								<span class="sortorder" ng-show="predicate === 'farba'" ng-class="{reverse:reverse}"></span>
										</th>
									</tr>
								</thead>
								<tbody>
									<tr ng-class="{\'modry\': x.farba == 2}" ng-repeat="x in hraci | orderBy:predicate:reverse">
										<td class="prvyRiadokRadio" ng-show="upravy"><md-radio-button ng-click="zvolHraca(x.idHraca)" ng-value="x.idHraca" class="md-primary" aria-label="Id Hráča"></md-radio-button></td>
										<td class="md-whiteframe-z1">{{x.cislo}}</td>
										<td class="md-whiteframe-z1">{{x.menoHraca}}</td>
										<td class="md-whiteframe-z1">{{x.kolkoStrelilGolov}} <small ng-show="upravy">(~{{x.kolkoStrelilGolov / x.pocetHier | number:1}})</small></td>
										<td class="md-whiteframe-z1" ng-show="upravy">{{x.pocetHier}}</td>
										<td class="md-whiteframe-z1" ng-show="upravy">{{x.pocetVyhier}}</td>
										<!--td ng-show="upravy">x</td-->
										<td class="md-whiteframe-z1" ng-show="x.farba">
											<div ng-switch="x.farba">
												<div ng-switch-when="1">Biely</div>
												<div ng-switch-when="2">Modrý</div>
											</div>
										</td>
									</tr>
								</tbody>
							</table>
						</div>
					</md-radio-group>

					<md-button ng-show="upravy" ng-if="NastaveniaServis.nastavenia.mazanie == true" class="md-warn md-primary md-raised" ng-click="chcesZmazatHraca($event)" flex="100" flex-gt-md="auto">
						Zmazať hráča
					</md-button>

					<md-button ng-show="upravy" ng-if="NastaveniaServis.nastavenia.uprava == true" class="md-primary md-raised" ng-click="upravHraca($event, zvolenyHrac)" flex="100" flex-gt-md="auto">
						Upraviť hráča
					</md-button>
				</div>
				`
	}
});
