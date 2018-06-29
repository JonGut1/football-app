<?php
	$path;
	$updatedData = $_POST['newData'];
	$checker = $_POST['checker'];
	if ($checker === 'matches') {
		$path = '../data/allMatches.json';
	}
	if ($checker === 'results') {
		$path = '../data/results.json';
	}
	if ($checker === 'playerData') {
		$path = '../data/playerData.json';
	}
	if ($checker === 'inputNames') {
		$path = '../data/inputNames.json';
	}
	file_put_contents($path, $updatedData);
?>


