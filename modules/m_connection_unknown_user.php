<?php

  setlocale (LC_ALL, 'ru_RU.UTF-8', 'Rus');

  $connection = mysqli_connect(
    '127.0.0.1',
    'unknown',
    'pas',
    'teacher_db'
  );


  if ( $connection == false ) {
    header('HTTP/1.1 500 Internal Server Error');
    exit();
  }

?>