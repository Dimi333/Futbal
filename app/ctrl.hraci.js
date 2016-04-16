function HraciCtrl($scope, HraciServis, $mdMedia, $mdDialog) {
	var _this = this;
	$scope.hraci;
	$scope.hry;

	$scope.oknoPridajHraca = function(ev) {
		var useFullScreen = ($mdMedia('sm') || $mdMedia('xs'))  && $scope.customFullscreen;

		$mdDialog.show({
			controller: function($scope, $mdDialog) {
				$scope.hide = function() {
					$mdDialog.hide();
				};
				
				$scope.cancel = function() {
					$mdDialog.cancel();
				};
				
				$scope.answer = function(answer) {
					$mdDialog.hide(answer);
				};
			},
			template: `
				<md-dialog aria-label="Pridanie hráča" ng-cloak>
					<form>
						<md-toolbar>
							<div class="md-toolbar-tools">
								<h2>Pridanie hráča</h2>

								<span flex></span>
								
								<md-button class="md-icon-button" ng-click="cancel()">
									<md-icon md-svg-src="img/ic_close_24px.svg" aria-label="Close dialog"></md-icon>
								</md-button>
							</div>
						</md-toolbar>

						<md-dialog-content>
							<div class="md-dialog-content">
								<pridaj-hraca pridaj="1"></pridaj-hraca>
							</div>
						</md-dialog-content>

						<md-dialog-actions layout="row">
							<md-button ng-click="answer('zatvor')" style="margin-right:20px;">
								Zatvor
							</md-button>
						</md-dialog-actions>
					</form>
				</md-dialog>
			`,
			parent: angular.element(document.body),
			targetEvent: ev,
			clickOutsideToClose:true,
			fullscreen: useFullScreen
		})
		.then(function(answer) {
			//$scope.status = 'You said the information was "' + answer + '".';
		}, function() {
			//$scope.status = 'You cancelled the dialog.';
		});

		$scope.$watch(function() {
			return $mdMedia('xs') || $mdMedia('sm');
		}, function(wantsFullScreen) {
			$scope.customFullscreen = (wantsFullScreen === true);
		});
	};

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
}