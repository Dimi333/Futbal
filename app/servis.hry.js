FutbalApp.service('HryServis', function($http, $q, $rootScope) {
	var _this = this;
	_this.hry = null; //zoznam všetkých hier

	_this.nacitajHry = function() {
		odlozeny_hry = $q.defer();

		return $http.post("php/angdata.php?co=nacitajHry")
			.then(function(response) {
				//slub je splneny
				odlozeny_hry.resolve(response.data);
				return odlozeny_hry.promise;
			}, function(response) {
				//odmientutie
				odlozeny_hry.reject(response);
				return odlozeny_hry.promise;
			})
	}

	_this.ulozHru = function(idHry, vsetkyStreleneGoly, vsetkyAsistencie) {
		odlozeny_hry_ulozenieHry = $q.defer();

		return $http.post("php/angdata.php?co=ulozHranuHru&id="+idHry+"&vsetkyStreleneGoly="+vsetkyStreleneGoly+"&vsetkyAsistencie="+vsetkyAsistencie)
			.then(function(response) {
				//slub je splneny
				odlozeny_hry_ulozenieHry.resolve(response.data);
				return odlozeny_hry_ulozenieHry.promise;
			}, function(response) {
				//odmientutie
				odlozeny_hry_ulozenieHry.reject(response);
				return odlozeny_hry_ulozenieHry.promise;
			})
	}

	_this.zmazHru = function(id) {
		odlozeny_hry_zmaz = $q.defer();

		return $http.post("php/angdata.php?co=zmazHru&id="+id)
			.then(function(response) {
				//slub je splneny
				odlozeny_hry_zmaz.resolve(response.data);
				return odlozeny_hry_zmaz.promise;
			}, function(response) {
				//odmientutie
				odlozeny_hry_zmaz.reject(response);
				return odlozeny_hry_zmaz.promise;
			})
	}

	_this.pridajHru = function(nazov, zvolenyHraci, zvolenyHraci2) {
		odlozeny_hry_pridaj = $q.defer();
		console.log(zvolenyHraci);

		return $http.post("php/angdata.php?co=pridajHru&nazov="+nazov+"&zvolenyHraci="+zvolenyHraci+"&zvolenyHraci2="+zvolenyHraci2)
			.then(function(response) {
				//slub je splneny
				odlozeny_hry_pridaj.resolve(response.data);
				return odlozeny_hry_pridaj.promise;
			}, function(response) {
				//odmientutie
				odlozeny_hry_pridaj.reject(response);
				return odlozeny_hry_pridaj.promise;
			})
	}
});
