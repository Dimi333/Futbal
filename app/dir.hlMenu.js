FutbalApp.directive('hlMenu', function($route, $location) {
	return {
		restrict: 'E',
		controller: function(){
			_this = this;

			_this.chod = function(kam) {
				$location.path(kam);
			}
		},
		controllerAs: '$ctrl',
		template: `

			<md-list class="laveMenu">
				<md-list-item>
					<md-button ng-click="$ctrl.chod('hry')" ng-class="{ active: $route.current.activetab == 'hry' }">
						Hry
					</md-button>
				</md-list-item>

				<md-divider></md-divider>

				<md-list-item>
					<md-button ng-click="$ctrl.chod('hraci')" ng-class="{active: $route.current.activetab == \'hraci\'}">
						Hráči
					</md-button>
				</md-list-item>

				<md-divider></md-divider>

				<md-list-item>
					<md-button ng-click="$ctrl.chod('nastavenia')" ng-class="{active: $route.current.activetab == \'nastavenia\'}">
						Nastavenia
					</md-button>
				</md-list-item>

				<md-divider></md-divider>
			</md-list>

`
	}
});