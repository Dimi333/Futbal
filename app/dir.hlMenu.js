FutbalApp.directive('hlMenu', function($route) {
	return {
		restrict: 'E',
		controller: function($scope) {
			//	console.log($route);
			
		},
		template: `

			<md-list class="laveMenu">
				<md-list-item>
					<md-button ng-class="{ active: $route.current.activetab == 'hry' }">
						<a href="hry">Hry</a>
					</md-button>
				</md-list-item>

				<md-divider></md-divider>

				<md-list-item>
					<md-button ng-class="{active: $route.current.activetab == \'hraci\'}">
						<a href="hraci">Hráči</a>
					</md-button>
				</md-list-item>
			</md-list>

`
	}
});