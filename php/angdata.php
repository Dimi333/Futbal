<?php
//v. 1.3
//treba este set.php, kde su nastavenia
header('Content-Type: text/html; charset=utf-8');

include 'set.php';
include 'Database.class.php';

$db = new Database($set_host, $set_user, $set_pass, $set_dbname);

$db->query("SET CHARACTER SET utf8");
$db->execute();
/*$jwt = new JWT();

if($_GET['vypisZeton']) {
	$token = null;

	$headers = apache_request_headers();

	if(isset($headers['Authorization'])){
		$matches = array();
		preg_match('/Token token="(.*)"/', $headers['Authorization'], $matches);

		if(isset($matches[1])){
			$token = $matches[1];
		}
	}

	$token = $jwt->decode($token, $key, array('HS256'));

	if($token->name) {
		echo $token->name;

	} else {
		echo "prihlas sa";
	}

} else if($_GET['vratZeton']) {

	$request_body = file_get_contents('php://input');
	echo json_decode($request_body);

	//echo "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiYWRtaW4iOnRydWV9.TJVA95OrM7E2cBab30RMHrHDcEfxjoYZgeFONFh7HgQ";
} else {*/
	switch ($_GET['co']) {
		case 'nacitajHry':
			/*$db->query("SELECT
							hry.nazov, hry.id, odohrate,
							GROUP_CONCAT(IF(h_r.farba = 1, hraci.meno, NULL) SEPARATOR ', ') AS biely,
							GROUP_CONCAT(IF(h_r.farba = 2, hraci.meno, NULL) SEPARATOR ', ') AS modry
						FROM
							futbal_hry_hraci AS h_r
						LEFT JOIN
							futbal_hraci AS hraci ON hraci.id = h_r.id_hraca
						RIGHT JOIN
							futbal_hry AS hry ON hry.id = h_r.id_hry
						GROUP BY
							hry.nazov
						ORDER BY
							hry.id
						DESC
						");*/

			$db->query("SELECT
				a.nazov,
				a.id,
				a.odohrate,
				a.biely,
				a.modry,
				b.vysledok
			FROM
				(SELECT
					hry.nazov AS nazov,
					hry.id AS id,
					odohrate AS odohrate,
					GROUP_CONCAT(IF(h_r.farba = 1, hraci.meno, NULL) SEPARATOR ', ') AS biely,
					GROUP_CONCAT(IF(h_r.farba = 2, hraci.meno, NULL) SEPARATOR ', ') AS modry
				FROM
					futbal_hry_hraci AS h_r
				LEFT JOIN
					futbal_hraci AS hraci ON hraci.id = h_r.id_hraca
				RIGHT JOIN
					futbal_hry AS hry ON hry.id = h_r.id_hry
				GROUP BY
					hry.nazov
				ORDER BY
					hry.id
				DESC
			) a

			LEFT JOIN
				(select
					distinct concat(IFNULL(a.pocet1, '0'), ':', IFNULL(b.pocet2, '0')) AS vysledok,
					a.id_hry
				from
					(select
						count(id_golu) as pocet1,
						id_hry
					from
						futbal_goly
					where
						farba = 1
					group by
						id_hry) a

				left join
					(select
						count(id_golu) as pocet2,
						id_hry
					from
						futbal_goly
					where
						farba = 2
					group by
						id_hry) b

				on a.id_hry = b.id_hry) b

			ON
				a.id = b.id_hry");

			echo json_encode($db->resultset());

			break;

		case 'pridajHru':
			$db->query('INSERT INTO futbal_hry (id, nazov, odohrate) VALUES (NULL, :nazov, 0)');
			$db->bind(':nazov', $_GET['nazov']);
			$db->execute();

			$posledne_id = $db->lastInsertId();

			$json_obj = json_decode($_GET['zvolenyHraci'], true);
			$db->beginTransaction();
				for($i=0; $i<count($json_obj); $i++) {
					$db->query('INSERT INTO futbal_hry_hraci (id, id_hry, id_hraca, farba) VALUES (NULL, :posledne_id, :id, "1")');
					$db->bind(':posledne_id', $posledne_id);
					$db->bind(':id', $json_obj[$i]['idHraca']);
					$db->execute();
				}
			$db->endTransaction();

			$json_obj2 = json_decode($_GET['zvolenyHraci2'], true);
			$db->beginTransaction();
				for($x=0; $x<count($json_obj2); $x++) {
					$db->query('INSERT INTO futbal_hry_hraci (id, id_hry, id_hraca, farba) VALUES (NULL, :posledne_id, :id, "2")');
					$db->bind(':posledne_id', $posledne_id);
					$db->bind(':id', $json_obj2[$x]['idHraca']);
					$db->execute();
				}
			$db->endTransaction();

			break;

		case 'zmazHru':
			$db->beginTransaction();
				$db->query('DELETE FROM futbal_hry WHERE id = :id');
				$db->bind(':id', $_GET['id']);
				$db->execute();

				//zmaže vzťahy hráč-hra, ale nezmaže góly
				$db->query('DELETE FROM futbal_hry_hraci WHERE id_hry = :id_hry');
				$db->bind(':id_hry', $_GET['id']);
				$db->execute();

				//zmaže góly z tej hry
				$db->query('DELETE FROM futbal_goly WHERE id_hry = :id_hry');
				$db->bind(':id_hry', $_GET['id']);
				$db->execute();

				//zmaže asistencie z tej hry
				$db->query('DELETE FROM futbal_asistencie WHERE id_hry = :id_hry');
				$db->bind(':id_hry', $_GET['id']);
				$db->execute();
			$db->endTransaction();
			break;

		case 'nacitajHracov':
			/*$db->query('SELECT
							hraci.meno,
							hraci.id,
							hraci.cislo,
							COUNT(goly.id_golu) AS kolkoStrelilGolov
						FROM
							futbal_hraci AS hraci
						LEFT JOIN
							futbal_goly AS goly ON goly.id_hraca = hraci.id
						GROUP BY
							hraci.meno
						ORDER BY
							hraci.id
						DESC');

				$db->query(
							"SELECT
								a.idHraca, a.kolkoStrelilGolov, a.menoHraca, b.pocetHier
							FROM
				                (SELECT
									hraci.meno AS menoHraca,
									hraci.id AS idHraca,
									hraci.cislo,
									COUNT(goly.id_golu) AS kolkoStrelilGolov
								FROM
									futbal_hraci AS hraci
								LEFT JOIN
									futbal_goly AS goly ON goly.id_hraca = hraci.id
				                GROUP BY
									goly.id_hraca) a

							LEFT JOIN (SELECT
									COUNT(hry.id) AS pocetHier,
				                   	hry.id_hraca AS idHraca
								FROM
									futbal_hry_hraci AS hry
								GROUP BY
									hry.id_hraca) b

							ON a.idHraca = b.idHraca

							ORDER BY
								a.idHraca
							DESC"
						);*/
				$db->query(
						"SELECT
							hraci.meno AS menoHraca,
							hraci.id AS idHraca,
							IF(hraci.cislo = 0, '', hraci.cislo) AS cislo,
							(COUNT(goly.id_golu) / IFNULL(b.pocetHier, 1)) AS gnz,
							COUNT(goly.id_golu) AS kolkoStrelilGolov,
							IFNULL(b.pocetHier, 0) AS pocetHier,
							(
								select
									SUM(
										fhh.farba = (
											select IF(SUM(farba=1)>SUM(farba=2),1,IF(SUM(farba=1)=SUM(farba=2),0,2))
											from
												futbal_goly
											where
												id_hry=fhh.id_hry
											group by id_hry
										)
									) as vitazne_zapasy
								from
									futbal_hry_hraci as fhh
								where
									fhh.id_hraca = hraci.id
							) as pocetVyhier,
							(
								select
									COUNT(a.id_hraca)
								from
									futbal_asistencie as a
								where
									a.id_hraca = hraci.id
							) as pocetAsistencii
						FROM
							futbal_hraci AS hraci

						LEFT JOIN
							futbal_goly AS goly ON goly.id_hraca = hraci.id

                        LEFT JOIN (SELECT
									COUNT(hry.id) AS pocetHier,
				                   	hry.id_hraca AS idHraca
								FROM
									futbal_hry_hraci AS hry
								GROUP BY
									hry.id_hraca) b

							ON hraci.id = b.idHraca
						GROUP BY
							hraci.meno
						ORDER BY
							hraci.id
						DESC"
					);


				echo json_encode($db->resultset(), JSON_NUMERIC_CHECK);
			break;

		case 'nacitajHracovDanejHry':
			$vysledok = $db->query('SELECT
										hry.nazov,
									    hry.id AS id_hry,
										hraci.id AS id_hraca,
									    hraci.meno AS menoHraca,
									    hraci.cislo,
									    h_r.farba
									FROM
										futbal_hry_hraci AS h_r
									LEFT JOIN
										futbal_hraci AS hraci ON hraci.id = h_r.id_hraca
									LEFT JOIN
										futbal_hry AS hry ON hry.id = h_r.id_hry
									WHERE
										hry.id = :id');
			$db->bind(':id', $_GET['idHry']);

			echo json_encode($db->resultset());
			break;

		case 'nacitajHracovDanejHrySgolmi':
			/*$vysledok = $db->query('SELECT COUNT(*) AS goly FROM futbal_goly AS goly WHERE goly.id_hry = :id AND farba = 1
									UNION
									SELECT COUNT(*) FROM futbal_goly AS goly WHERE goly.id_hry = :id AND farba = 2');
			$db->bind(':id', $_GET['idHry']);

			$arr1 = $db->resultset();*/

			/*
			SELECT
										hraci.meno AS menoHraca,
										IF(hraci.cislo = 0, "", hraci.cislo) AS cislo,
										hraci.id,
										goly.farba,
										COUNT(goly.id_golu) AS kolkoStrelilGolov,
										a.pocetAsistencii
									FROM
										futbal_hraci AS hraci
									LEFT JOIN
										futbal_goly AS goly ON goly.id_hraca = hraci.id
									LEFT JOIN
										(
											SELECT
												COUNT(id_hry) AS pocetAsistencii,
												id_hraca
											FROM
												futbal_asistencie
											WHERE
												id_hry = :id
											GROUP BY
												id_hraca
										) a
										ON hraci.id = a.id_hraca
									WHERE
										goly.id_hry = :id
									GROUP BY
										hraci.meno
			*/

			$vysledok = $db->query('SELECT
										hraci.meno AS menoHraca,
										IF(hraci.cislo = 0, "", hraci.cislo) AS cislo,
										hraci.id,
										goly.farba,
										COUNT(goly.id_golu) AS kolkoStrelilGolov,
										COUNT(a.id_hraca) AS pocetAsistencii
									FROM
										futbal_hraci AS hraci
									LEFT JOIN
										futbal_goly AS goly ON goly.id_hraca = hraci.id
									LEFT JOIN
										futbal_asistencie AS a ON a.id_hraca = hraci.id
									WHERE
										goly.id_hry = :id
									GROUP BY
										hraci.meno
									');
			$db->bind(':id', $_GET['idHry']);

			//echo json_encode(array_merge($arr1, $db->resultset()));
			echo json_encode($db->resultset());
			break;

		case 'ulozHranuHru':
			$goly = json_decode($_GET['vsetkyStreleneGoly'], true);
			$asistencie = json_decode($_GET['vsetkyAsistencie'], true);

			//goly
			$db->beginTransaction();
				for($i=0; $i<count($goly); $i++) {
					$db->query('INSERT INTO futbal_goly (id_golu, id_hry, id_hraca, farba) VALUES (NULL, :id_hry, :id_hraca, :farba)');
					$db->bind(':id_hry', $goly[$i]['id_hry']);
					$db->bind(':id_hraca', $goly[$i]['id_hraca']);
					$db->bind(':farba', $goly[$i]['farba']);
					$db->execute();
				}

				$db->query('UPDATE futbal_hry SET odohrate = 1 WHERE id = :id_hry');
				$db->bind(':id_hry', $_GET['id']);
				$db->execute();
			$db->endTransaction();

			//asistencie
			$db->beginTransaction();
				for($i=0; $i<count($asistencie); $i++) {
					$db->query('INSERT INTO futbal_asistencie (id_hraca, id_hry) VALUES (:id_hraca, :id_hry)');
					$db->bind(':id_hry', $asistencie[$i]['id_hry']);
					$db->bind(':id_hraca', $asistencie[$i]['id_hraca']);
					$db->execute();
				}
			$db->endTransaction();

			break;

		case 'pridajHraca':
			$db->query('INSERT INTO futbal_hraci (id, meno, cislo) VALUES (NULL, :meno_hraca, :cislo_hraca)');
			$db->bind(':meno_hraca', $_GET['meno']);
			$db->bind(':cislo_hraca', $_GET['cislo']);
			$db->execute();
			break;

		case 'upravHraca':
			$db->query('UPDATE futbal_hraci SET meno = :meno_hraca, cislo = :cislo_hraca WHERE id = :id_hraca');
			$db->bind(':meno_hraca', $_GET['meno']);
			$db->bind(':cislo_hraca', $_GET['cislo']);
			$db->bind(':id_hraca', $_GET['idhraca']);
			$db->execute();
			break;

		case 'zmazHraca':
			$db->query('DELETE FROM futbal_hraci WHERE id = :id');
			$db->bind(':id', $_GET['id']);
			$db->execute();
			break;

		default:
			break;
	}
//}
