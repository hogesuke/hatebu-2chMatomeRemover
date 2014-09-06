<?php
require "/etc/db_info.dat";

header('Access-Control-Allow-Origin:*');

$link = mysql_connect($db_URL, $db_USER, $db_PASSWORD);
if (!$link) {
    echo '[]';
}

$db_selected = mysql_select_db('remover', $link);
if (!$db_selected){
    echo '[]';
}

mysql_set_charset('utf8');

$result = mysql_query('SELECT url FROM web_site');
if (!$result) {
    echo '[]';
}

$url_json = '[';
while ($row = mysql_fetch_assoc($result)) {
    $url_json = $url_json.'"'.$row['url'].'", ';
}
$url_json = substr($url_json, 0, strlen($url_json) - 2).']';


$close_flag = mysql_close($link);

echo $url_json;
?>
