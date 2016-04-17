function nastaveniaCtrl($scope, NastaveniaServis) {
	_this = this;
	_this.NastaveniaServis = NastaveniaServis;

	_this.spravaOmazani = NastaveniaServis.nastavenia.mazanie;
	_this.spravaOuprave = NastaveniaServis.nastavenia.uprava;

	_this.onChangeMazanie = function(cbState) {
		_this.spravaOmazani = cbState;
		NastaveniaServis.nastavenia.mazanie = cbState;
	};

	_this.onChangeUprava = function(cbState) {
		_this.spravaOuprave = cbState;
		NastaveniaServis.nastavenia.uprava = cbState;
	};
}
