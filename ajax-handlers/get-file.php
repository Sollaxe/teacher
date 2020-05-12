<?php

  require '../modules/m_connection_unknown_user.php';
  require '../modules/m_func_to_work.php';

  $fileId = $_POST['fid']; //id удаляемого файла
  settype($fileId, 'integer');

  if ( !isset($_POST['fid']) ) {
    exit('NoId');
  }

  $fileId = mysqli_real_escape_string($connection, $fileId);

  if ( $fileId && is_value_string($fileId) ) { //Проверка наличия id

    $searchFile = mysqli_prepare(
      $connection,
      "SELECT * FROM `files` WHERE `file_id` = ?;"
    ); //Запрос на информацию о файле

    //Проверка запроса
    if ( $searchFile ) {
      mysqli_stmt_bind_param($searchFile, 'i', $fileId);
      $validExe = mysqli_stmt_execute($searchFile);

      if ( !$validExe ) {
        exit('NoQuery');
      }

      $resultStmt = mysqli_stmt_get_result($searchFile);
      mysqli_stmt_close($searchFile);
    } else {
      exit('NoQuery');
    }

    $file = mysqli_fetch_assoc($resultStmt); //Запись данных в объект

    $file['pubdate'] = date('d.m.Y' ,strtotime($file['pubdate'])); //форматирование даты публикации вида дд.мм.гггг
    $file['categorie_arr'] = []; //Массив с категориями


    $catToFile = mysqli_prepare(
      $connection,
      "SELECT `id_categorie` FROM `file_to_categorie` WHERE `id_file` = ?;"
    ); //Запрос на категории принадлежащие файл-блоку

    //Проверка запроса
    if ( $catToFile ) {
      mysqli_stmt_bind_param($catToFile, 'i', $file["file_id"]);
      $validExe = mysqli_stmt_execute($catToFile);

      if ( !$validExe ) {
        exit('NoQuery');
      }

      $catToFileStmtResult = mysqli_stmt_get_result($catToFile);
      mysqli_stmt_close($catToFile);
    } else {
      exit('NoQuery');
    }


    $categorie = mysqli_prepare(
      $connection,
      "SELECT * FROM `categorie` WHERE `categorie_id` = ?;"
    ); //Запрос на информацию о категории

    if ( !$categorie ) {
      exit('NoQuery');
    } //Проверка запроса

    //Цикл перебирающий категории
    while ( ($currentLine = mysqli_fetch_assoc($catToFileStmtResult)) ) {
      mysqli_stmt_bind_param($categorie, 'i', $currentLine["id_categorie"]);

      $validExe   = mysqli_stmt_execute($categorie);
      $resultStmt = mysqli_stmt_get_result($categorie);

      if ( $validExe ) {
        $currentCat = mysqli_fetch_assoc($resultStmt);
        $file['categorie_arr'][] = array(
          'categorie_id' => $currentCat['categorie_id'],
          'categorie_name' => $currentCat['name'],
        ); //Запись объекта текущей категории в массив с категориями
      } else {
        exit('NoQuery');
      }
    }

    mysqli_stmt_close($categorie);


    $jsonFile = json_encode($file); //Кодирование объекта файл-блока в Json

    echo $jsonFile; //Вывод в клиент json
  } elseif ( !$fileId || !is_value_string($fileId) ) {
    exit('NoId'); //Если нет id файл-блока, то сообщаем об этом в клиент
  }




  mysqli_close($connection);


?>