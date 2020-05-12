<?php

  session_start();
  require '../modules/m_auth_verif_ajax.php';

  require '../modules/m_connection.php';
  require '../modules/m_func_to_work.php';

  $catId = $_POST['id']; //id удаляемой категории
  settype($catId, 'integer');

  if ( !isset($_POST['id']) ) {
    exit('NoId');
  }



  if ( $catId && is_value_string($catId) ) { //Проверка на наличие id
    mysqli_real_escape_string($connection, $catId); //Экранирование символов


    $deleteCatFromFiles = mysqli_prepare(
      $connection,
      "DELETE FROM `file_to_categorie` WHERE `id_categorie` = ?;"
    ); //Удаление категории из таблицы категорий к файлам

    if ( $deleteCatFromFiles ) {
      mysqli_stmt_bind_param($deleteCatFromFiles, 'i', $catId);
      $validQuerySecond = mysqli_stmt_execute($deleteCatFromFiles);

      if ( !$validQuerySecond ) {
        exit('NoDelete');
      }
      
      mysqli_stmt_close($deleteCatFromFiles);
    } else {
      exit('NoDelete');
    }


    $deleteCat = mysqli_prepare(
      $connection,
      "DELETE FROM `categorie` WHERE `categorie_id` = ?;"
    ); //Удаление категории из таблици категорий

    if ( $deleteCat ) {
      mysqli_stmt_bind_param($deleteCat, 'i', $catId);
      $validQueryFirst = mysqli_stmt_execute($deleteCat);

      if ( !$validQueryFirst ) {
        exit('NoDelete');
      }

      mysqli_stmt_close($deleteCat);
    } else {
      exit('NoDelete');
    }



    if ( $validQueryFirst && $validQuerySecond ) { //Если оба запроса прошли, выводить 1
      echo 1;
    } else {
      exit('NoDelete'); //Если один из запросов не прошёл, выводить сообщение об этом в клиент
    }

  } else { //Если нет id, выводить сообщение об этом в клиент
    exit ('NoId');
  }

  mysqli_close($connection);
?>