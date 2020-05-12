<?php

  session_start();
  require '../modules/m_auth_verif_ajax.php';
  
  require '../modules/m_connection.php';
  require '../modules/m_func_to_work.php';

  $colName = $_POST['col']; //Колонка в БД
  $pathImg = $_POST['dataImg'];
  settype($colName, 'string');
  settype($pathImg, 'string');

  if ( !isset($_POST['col']) || !isset($_POST['dataImg']) || !$colName || !is_value_string($colName) || !$pathImg || !is_value_string($pathImg) ) {
    exit('NoQuery');
  }

  $colName = mysqli_real_escape_string($connection, $colName);


  $whiteColList = ['main_profile_photo_path', 'about_me_photo_path'];

  if ( !in_array($colName, $whiteColList) ) {
    $removingImg = $_SERVER['DOCUMENT_ROOT'] . '/images/upload-image/' .  basename($pathImg);

    if ( verif_unlink_img($removingImg) ) { //Проверка наличия файла на пути
      unlink($removingImg);
    }
    exit ('NotFoundCol');
  }

  $colData = mysqli_prepare(
    $connection,
    "SELECT `$colName` FROM `main_index` WHERE `id` = '1'"
  ); //Запрос на путь к картинке

  if ( $colData ) { //Проверка и запись запроса
    $validExe = mysqli_stmt_execute($colData);

    if ( !$validExe ) {
      exit('NoQuery');
    }

    mysqli_stmt_bind_result($colData, $imagePath);

    if ( mysqli_stmt_fetch($colData) ) {

      if ( is_value_string(basename($imagePath)) ) { //Проверка наличия пути к картинке
        $removingImg = $_SERVER['DOCUMENT_ROOT'] . '/images/upload-image/' .  basename($imagePath); //Полный путь к картинке

        if ( verif_unlink_img($removingImg) ) { //Проверка наличия файла на пути
          echo unlink($removingImg);
        } else {
          exit('NoPath'); //Если нет файла на пути, сообщить об этом в клиент
        }
      } else {
        exit('NoPath'); //Если нет пути к файлу, то сообщить об этом в клиент
      }
    } else {
      exit('NoQuery');
    }

    mysqli_stmt_close($colData);

  } else {
    exit('NoQuery');
  }

  mysqli_close($connection);

?>