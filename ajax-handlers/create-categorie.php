<?php

  session_start();
  require '../modules/m_auth_verif_ajax.php';

  require '../modules/m_connection.php';
  require '../modules/m_func_to_work.php';

  $catName = $_POST['name']; //Имя новой категории
  settype($catName, 'string');

  if ( !isset($_POST['name']) ) {
    exit('NoNameCat');
  }


  $catName = verif_contenteditable_line_text($catName, $connection); //Проверка данных


  if ($catName && is_value_string($catName) ) { //Проверка на наличие имени

    $categorieTable = mysqli_prepare(
      $connection,
      "INSERT INTO `categorie` (`name`) VALUES (?);"
    ); //Запрос добавляющий новую категорию в БД

    if ( $categorieTable ) { //Если имя не было добавлено, то закрываем php
      mysqli_stmt_bind_param($categorieTable, 's', $catName);
      $validExe = mysqli_stmt_execute($categorieTable);

      if ( !$validExe ) {
        exit('QueryErr');
      }

      $id = $connection->insert_id; //Сохраняем id добавленной категории
      echo $id; //Выводим id добаленной категории в клиент
      mysqli_stmt_close($categorieTable);
      
    } else {
      exit('server_err');
    }

  } elseif ( !is_value_string($catName) ) {
    exit ('NoNameCat'); //Если нет имени категории, выводить NoNameCat и закрывать php
  } else {
    exit('undef_err');
  }


  mysqli_close($connection);
?>