<?php

  session_start();
  require '../modules/m_auth_verif_ajax.php';

  require '../modules/m_connection.php';
  require '../modules/m_func_to_work.php';


  $title_file   = $_POST['title_file']; //Название файл-блока
  $image_path   = $_POST['image_path']; //Путь к картинке
  $file_id      = $_POST['file_id']; //id файл-блока
  $description  = $_POST['description']; //Описание файл-блока
  $categorieArr = json_decode($_POST['categorieArr']); //Массив с категориями

  settype($title_file, 'string');
  settype($image_path, 'string');
  settype($file_id, 'integer');
  settype($description, 'string');

  if ( !isset($_POST['title_file']) || !isset($_POST['image_path']) || !isset($_POST['file_id']) || !isset($_POST['description']) || !isset($_POST['categorieArr']) ) {
    exit('NoData');
  }

  $title_file  = verif_textarea_text($title_file, $connection);
  $image_path  = verif_textarea_text($image_path, $connection);
  $file_id     = verif_textarea_text($file_id, $connection);
  $description = verif_textarea_text($description, $connection);

  foreach ($categorieArr as $key => $value) {
    $value->categorie_id = verif_textarea_text($value->categorie_id, $connection);
    settype($value->categorie_id, 'integer');
  }

  //Проверка на наличие необходимых данных
  if ( !$title_file || !$image_path || !$file_id || !is_value_string($title_file) || !is_value_string($image_path) || !is_value_string($file_id) ) {
    exit('NoData');
  } 

  if ( $title_file && $image_path && $file_id && is_value_string($title_file) && is_value_string($image_path) && is_value_string($file_id) ) {



    $queryPrevImage = mysqli_prepare(
      $connection,
      "SELECT `path_image` FROM `files` WHERE `file_id` = ?;"
    ); //Запрос на путь к предыдущей (не обязательно, она может и не измениться, но на данном этапе, программа об этом не знает) картинке файл-блоке


    if ( $queryPrevImage ) {
      mysqli_stmt_bind_param($queryPrevImage, 'i', $file_id);
      $validExe = mysqli_stmt_execute($queryPrevImage);

      if ( $validExe ) {
        mysqli_stmt_bind_result($queryPrevImage, $prevImgPath);

        if ( mysqli_stmt_fetch($queryPrevImage) ) {
          if ( basename($image_path) !== basename($prevImgPath) ) {
            $removingImg = $_SERVER['DOCUMENT_ROOT'] . '/images/upload-image/' . basename($prevImgPath);

            if ( verif_unlink_img($removingImg) ) {
              unlink($removingImg);
            }
          }
        }
      }

      mysqli_stmt_close($queryPrevImage);

    }



    $updFileQuery = mysqli_prepare(
      $connection,
      "UPDATE `files` SET `title_file` = ?, `description` = ?, `path_image` = ? WHERE `file_id` = ?;"
    ); //Обновление информации файл-блока

    if ( $updFileQuery ) {
      mysqli_stmt_bind_param($updFileQuery, 'sssi', $title_file, $description, $image_path, $file_id);
      $validExe = mysqli_stmt_execute($updFileQuery);

      if ( !$validExe ) {
        exit('NoUpd');
      } //Проверка запроса

      mysqli_stmt_close($updFileQuery);

    } else {
      exit('NoUpd');
    } //Проверка запроса



    $categorieFile = mysqli_prepare(
      $connection,
      "SELECT `id_categorie`, `id_file` FROM `file_to_categorie` WHERE `id_file` = ?;"
    ); //Запрос на категории к которым принадлежал файл-блок

    if ( $categorieFile ) {
      mysqli_stmt_bind_param($categorieFile, 'i', $file_id);

      $validExe   = mysqli_stmt_execute($categorieFile);
      $resultStmt = mysqli_stmt_get_result($categorieFile);

      mysqli_stmt_close($categorieFile);

      if ( !$validExe ) {
        exit('NoCatQuery');
      }


      while ( $currentCat = mysqli_fetch_assoc($resultStmt) ) { //Перебор каждой категории
        $isRemove = true; //Переменная для определения наличия этой категории у файл-блока после его изменения. То есть, если категории в обновлённом файл-блоке нет, то она удаляется из БД благодаря информации из этой переменной


        //Перебор массива с обновлёнными категориями
        foreach ($categorieArr as $key => $value) {
          if ($currentCat["id_categorie"] == $value->categorie_id) { //Если текущая категория из БД совпадает с перебираемой категорией из нового массива категорий, то происходит следующее
            $categorieArr[$key] = NULL; //Обнуление объекта перебираемой категории из нового массива категорий
            $isRemove = false; //Переменная сообщающая что категорию нужно удалить из БД ставиться в значение false
            // print_r($categorieArr[$key] = 0);
          }
        }

        if ($isRemove) { //Если мы не нашли в новом массиве категорий старую категорию, то она удаляется из БД
          $removeCatQuery = mysqli_query(
            $connection,
            "DELETE FROM `file_to_categorie` WHERE `id_categorie` = '$currentCat[id_categorie]' AND `id_file` = '$currentCat[id_file]';"
          );

          if ( !$removeCatQuery ) {
            exit('NoCatQuery');
          } //Проверка запроса
        }
      }
    }


    //Цикл перебирающий массив с новыми категориями
    foreach ($categorieArr as $key => $value) {

      //Если в массиве с новыми категориями есть новые, не обнулённые, категории, то они добавляются в БД
      if (!is_null($value)) {

        $addCatAtFile = mysqli_prepare(
          $connection,
          "INSERT INTO `file_to_categorie` (id_file, id_categorie) VALUES ( ?, ? )"
        );

        if ( $addCatAtFile ) {

          mysqli_stmt_bind_param($addCatAtFile, 'ii', $file_id, $value->categorie_id);
          $validExe = mysqli_stmt_execute($addCatAtFile);

          if ( $validExe ) {
            $categorieArr[$key] = NULL; //Обнуление в массиве объекта добавленной категории
          } else {
            exit('NoCatQuery');
          }

          mysqli_stmt_close($addCatAtFile);

        } else {
          exit('NoCatQuery');
        }
      }
    }


    echo 1; //Если всё нештяк, то выводим 1
    
  } else {
    exit('undefErr'); //Неизвестное состояние
  }

  mysqli_close($connection);


?>