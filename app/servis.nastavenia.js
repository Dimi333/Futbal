FutbalApp.service('NastaveniaServis', function($http, $q, $rootScope) {
	var _this = this;
	_this.hry = null; //zoznam všetkých hier

	_this.nastavenia = {};

	_this.nastavenia.mazanie = false;
	_this.nastavenia.uprava = false;
});