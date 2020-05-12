<?php

  session_start();
  require '../modules/m_auth_verif_ajax.php';

  require '../modules/m_connection.php';
  require '../modules/m_func_to_work.php';

  $catId   = $_POST['id']; //id обновляемой категории
  $catName = $_POST['name']; //Новое имя категории

  settype($catId, 'integer');
  settype($catName, 'string');

  if ( !isset($_POST['id']) || !isset($_POST['name']) ) {
    exit('NoData');
  }


  //Проверка на наличие данных
  if ( $catName && $catId && is_value_string($catName) && is_value_string($catId) ) {

    $catName = verif_contenteditable_line_text($catName, $connection);
    $catId = mysqli_real_escape_string($connection, $catId);

    if ( !((int)$catId) ) { //Если id не число, то сообщить об этом в клиент
      exit('NoData');
    }

    $updateCategorie = mysqli_prepare(
      $connection,
      "UPDATE `categorie` SET `name` = ? WHERE `categorie_id` = ?;"
    ); //Запрос на обновление имени категории в БД

    if ( $updateCategorie ) {
      mysqli_stmt_bind_param($updateCategorie, 'si', $catName, $catId);
      $validExe = mysqli_stmt_execute($updateCategorie);

      if ( $validExe ) {
        echo 1;
      } else {
        exit('NoUpd');
      }

      mysqli_stmt_close($updateCategorie);
    } else {
      exit ('NoUpd');
    }

  } elseif ( !$catName || !$catId || !is_value_string($catName) || !is_value_string($catId) ) {
    exit ('NoData'); //Если нужных данных нет в наличии, то сообщить об этом в клиент
  } else {
    exit ('undefErr'); //Неизвестное состояние
  }

  mysqli_close($connection);
?>