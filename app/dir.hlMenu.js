FutbalApp.directive('hlMenu', function($route) {
	return {
		restrict: 'E',
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

				<md-divider></md-divider>

				<md-list-item>
					<md-button ng-class="{active: $route.current.activetab == \'nastavenia\'}">
						<a href="nastavenia">Nastavenia</a>
					</md-button>
				</md-list-item>

				<md-divider></md-divider>
			</md-list>

`
	}
});