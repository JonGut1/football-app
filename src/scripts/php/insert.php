<?php
	$updatedData = $_POST['newData'];
	file_put_contents('../data/data.json', $updatedData);
?>


