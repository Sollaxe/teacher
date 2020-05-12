<?php

  session_start();
  require '../modules/m_auth_verif_ajax.php';

  require '../modules/m_connection.php';
  require '../modules/m_func_to_work.php';

  $fileId = $_POST['fid']; //id удаляемого файла
  settype($fileId, 'integer');

  if ( !isset($_POST['fid']) ) {
    exit('NoId');
  }

  $fileId = mysqli_real_escape_string($connection, $fileId);

  if ( $fileId && is_value_string($fileId) ) { //Проверка на наличие id

    $selectFile = mysqli_prepare(
      $connection,
      "SELECT `path_image`, `path_file` FROM `files` WHERE `file_id` = ?;"
    ); //Запрос возвращающий путь к картинке и путь к файлу

    if ( !$selectFile ) {
      exit('undefErr');
    }

    mysqli_stmt_bind_param($selectFile, 'i', $fileId);
    $validExe = mysqli_stmt_execute($selectFile);

    if ( !$validExe ) {
      exit('NoId');
    }

    $resultStmt = mysqli_stmt_get_result($selectFile);

    //Удаление файла и картинки для файл-блока
    if ( $dataObj = mysqli_fetch_assoc($resultStmt) ) {

      if ( is_value_string( basename($dataObj["path_image"]) ) ) {
        $removingImg = $_SERVER['DOCUMENT_ROOT'] . '/images/upload-image/' . basename($dataObj["path_image"]);

        if ( verif_unlink_img($removingImg) ) {
          unlink($removingImg);
        }
      }

      if ( is_value_string( basename($dataObj["path_file"]) ) ) {
        $removingFile = $_SERVER['DOCUMENT_ROOT'] . '/upd-files/' . basename($dataObj["path_file"]);

        if ( verif_unlink_file($removingFile) ) {
          unlink($removingFile);
        }
      }

    }

    mysqli_stmt_close($selectFile);


    //Удаление файл-блока из таблицы с файл-блоками и из таблицы категорий к файлам
    $deleteFile = mysqli_prepare(
      $connection,
      "DELETE FROM `files` WHERE `file_id` = ?;"
    );

    if ( $deleteFile ) {
      mysqli_stmt_bind_param($deleteFile, 'i', $fileId);
      $validExe = mysqli_stmt_execute($deleteFile);
      if (!$validExe) {
        exit('undefErr');
      }
      mysqli_stmt_close($deleteFile);
    }




    $removeCatsQuery = mysqli_prepare(
      $connection,
      "DELETE FROM `file_to_categorie` WHERE `id_file` = ?;"
    );

    if ( $removeCatsQuery ) {
      mysqli_stmt_bind_param($removeCatsQuery, 'i', $fileId);
      $validExe = mysqli_stmt_execute($removeCatsQuery);
      if (!$validExe) {
        exit('undefErr');
      }
      mysqli_stmt_close($removeCatsQuery);
    }



    echo 1; //Если всё прошло хорошо, возвращаем 1
    
  } elseif ( !$fileId || !is_value_string($fileId) ) {
    exit('NoId'); //Если нет id, сообщаем об этом в клиент
  } else {
    exit('undefErr'); //Непридвиденное состояние
  }

  mysqli_close($connection);

?>