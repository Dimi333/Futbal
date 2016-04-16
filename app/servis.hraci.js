FutbalApp.service('HraciServis', function($http, $q, $rootScope) {
	var _this = this;
	_this.hraci = null; //zoznam všetkých hráčov
	_this.hraciDanejhry = null; //zoznam hráčov hry, ktorý sa práve hrá
	_this.vsetkyStreleneGoly = []; //pole všetkých gólov, slúži na uloženie celej hry do DB, treba potom vždy vymazať

	_this.nacitajHracovDanejhry = function(idHry) {
		odlozeny_hraciDanejHry = $q.defer();

		return $http.post("php/angdata.php?co=nacitajHracovDanejHry&idHry="+idHry)
			.then(function(response) {
				//slub je splneny
				odlozeny_hraciDanejHry.resolve(response.data);
				return odlozeny_hraciDanejHry.promise;
			}, function(response) {
				//odmientutie
				odlozeny_hraciDanejHry.reject(response);
				return odlozeny_hraciDanejHry.promise;
			}
		)
	}

	_this.nacitajHracovDanejhrySgolmi = function(idHry) {
		odlozeny_hraciDanejHrySgolmi = $q.defer();

		return $http.post("php/angdata.php?co=nacitajHracovDanejHrySgolmi&idHry="+idHry)
			.then(function(response) {
				//slub je splneny
				odlozeny_hraciDanejHrySgolmi.resolve(response.data);
				return odlozeny_hraciDanejHrySgolmi.promise;
			}, function(response) {
				//odmientutie
				odlozeny_hraciDanejHrySgolmi.reject(response);
				return odlozeny_hraciDanejHrySgolmi.promise;
			}
		)
	}

	_this.nacitajHracov = function() {
		odlozeny_hraci = $q.defer();

		return $http.post("php/angdata.php?co=nacitajHracov")
			.then(function(response) {
				//slub je splneny
				odlozeny_hraci.resolve(response.data);
				return odlozeny_hraci.promise;
			}, function(response) {
				//odmientutie
				odlozeny_hraci.reject(response);
				return odlozeny_hraci.promise;
			}
		)
	}

	_this.pridajHraca = function(meno, cislo) {
		odlozeny_hraci_pridaj = $q.defer();

		return $http.post("php/angdata.php?co=pridajHraca&meno="+meno+"&cislo="+cislo)
			.then(function(response) {
				//slub je splneny
				odlozeny_hraci_pridaj.resolve(response.data);
				return odlozeny_hraci_pridaj.promise;
			}, function(response) {
				//odmientutie
				odlozeny_hraci_pridaj.reject(response);
				return odlozeny_hraci_pridaj.promise;
			})
	}

	_this.upravHraca = function(meno, cislo, idhraca) {
		odlozeny_hraci_uprav = $q.defer();

		return $http.post("php/angdata.php?co=upravHraca&meno="+meno+"&cislo="+cislo+"&idhraca="+idhraca)
			.then(function(response) {
				//slub je splneny
				odlozeny_hraci_uprav.resolve(response.data);
				return odlozeny_hraci_uprav.promise;
			}, function(response) {
				//odmientutie
				odlozeny_hraci_uprav.reject(response);
				return odlozeny_hraci_uprav.promise;
			})
	}

	_this.zmazHraca = function(id) {
		odlozeny_hraci_zmaz = $q.defer();

		return $http.post("php/angdata.php?co=zmazHraca&id="+id)
			.then(function(response) {
				//slub je splneny
				odlozeny_hraci_zmaz.resolve(response.data);
				return odlozeny_hraci_zmaz.promise;
			}, function(response) {
				//odmientutie
				odlozeny_hraci_zmaz.reject(response);
				return odlozeny_hraci_zmaz.promise;
			})
	}
});