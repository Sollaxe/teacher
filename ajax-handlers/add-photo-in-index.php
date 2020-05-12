<?php

  session_start();
  require '../modules/m_auth_verif_ajax.php';
  
  require '../modules/m_connection.php';
  require '../modules/m_func_to_work.php';

  $colName = $_POST['col']; //Имя столбца в БД
  $pathImg = $_POST['data']; //Путь к изображению
  settype($colName, 'string');
  settype($pathImg, 'string');

  if ( !isset($_POST['col']) || !isset($_POST['data']) || !$colName || !is_value_string($colName) || !$pathImg || !is_value_string($pathImg) ) {
    exit('NoUpd');
  }

  // echo $colName;
  // echo $dataPath;

  $colName = verif_textarea_text($colName, $connection);   //Проверка полученных значений
  $pathImg = verif_textarea_text($pathImg, $connection); //Проверка полученных значений

  $whiteColList = ['main_profile_photo_path', 'about_me_photo_path'];

  if ( !in_array($colName, $whiteColList) ) {
    $removeDir = $_SERVER['DOCUMENT_ROOT'] . '/images/upload-image/' .  basename($pathImg);

    if ( verif_unlink_img($removeDir) ) { //Проверка файла
      unlink($removeDir);
    }
    
    exit ($removeDir);
  }

  $query = mysqli_prepare(
    $connection,
    "UPDATE `main_index` SET `$colName` = ? WHERE `id` = '1'"
  );

  if ( $query ) {
    mysqli_stmt_bind_param($query, 's', $pathImg);
    $validExe = mysqli_stmt_execute($query);

    if ( $validExe ) {
      echo 1;
    } else {
      exit('NoUpd');
    }

    mysqli_stmt_close($query);
  }



  mysqli_close($connection);

?>