function zacataHraCtrl($scope, HraciServis, HryServis, $routeParams, $window) {
	var _this = this;

	HraciServis.vsetkyStreleneGoly = [];
	_this.idHry = $routeParams.idHry;
	_this.modry = 0;
	_this.biely = 0;

	_this.dalGol = function(id_hraca, index) {
		HraciServis.vsetkyStreleneGoly.push({id_hry: _this.idHry, id_hraca: id_hraca, farba: HraciServis.hraciDanejhry[index].farba});

		if(typeof HraciServis.hraciDanejhry[index].goly != 'undefined') {
			HraciServis.hraciDanejhry[index].goly++;
		} else  {
			HraciServis.hraciDanejhry[index].goly = 1;
		}

		if(HraciServis.hraciDanejhry[index].farba == 1) {
			_this.biely++;
		} else {
			_this.modry++;
		}
	}

	_this.asistoval = function(id_hraca, index) {
		HraciServis.vsetkyAsistencie.push({id_hraca: id_hraca, id_hry: _this.idHry});

		if(typeof HraciServis.hraciDanejhry[index].asistencie != 'undefined') {
			HraciServis.hraciDanejhry[index].asistencie++;
		} else  {
			HraciServis.hraciDanejhry[index].asistencie = 1;
		}
	}

	_this.ukonciAulozStav = function(idHry) {
		HryServis.ulozHru(_this.idHry, JSON.stringify(HraciServis.vsetkyStreleneGoly), JSON.stringify(HraciServis.vsetkyAsistencie)).then(
			function(result) {
				HryServis.nacitajHry().then(
					function(result) {
						HryServis.hry = result;
						_this.hry = HryServis.hry;
						$scope.chod('hry');
					},
					function error(error) {
						console.log(error.statusText);
						_this.hry = null;
					}
				);
				HraciServis.nacitajHracov().then(
					function(result) {
						HraciServis.hraci = result;
						_this.hraci = HraciServis.hraci;
					},
					function error(error) {
						console.log(error.statusText);
						_this.hraci = null;
					}
				);
			},
			function error(error) {
				console.log(error.statusText);
				_this.hraci = null;
			}
		);

		HraciServis.hraci = null;
		_this.modry = 0;
		_this.biely = 0;
		HraciServis.vsetkyStreleneGoly = [];
	}

	HraciServis.nacitajHracovDanejhry(_this.idHry).then(
		function(result) {
			_this.modry = 0;
			_this.biely = 0;
			HraciServis.vsetkyStreleneGoly = [];
			HraciServis.hraciDanejhry = result;
			_this.hraciDanejhry = HraciServis.hraciDanejhry;
		},
		function error(error) {
			console.log(error.statusText);
			_this.hraciDanejhry = null;
		}
	)
}
