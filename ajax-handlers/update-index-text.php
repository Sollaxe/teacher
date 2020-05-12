<?php

  session_start();
  require '../modules/m_auth_verif_ajax.php';

  require '../modules/m_connection.php';
  require '../modules/m_func_to_work.php';

  $colIndex = $_POST['col']; //Колонка в БД с соответсвующим текстом
  $textIndex = $_POST['text']; //Новый текст
  settype($colIndex, 'string');
  settype($textIndex, 'string');

  if ( !isset($_POST['col']) || !isset($_POST['text']) ) {
    exit('NoData');
  }

  //Проверка на наличие необходимых данных
  if ( $colIndex && $textIndex && is_value_string($colIndex) && is_value_string($textIndex) ) {

    $textIndex = trim($textIndex);
    $textIndex = verif_contenteditable_text($textIndex, $connection);
    $colIndex = mysqli_real_escape_string($connection, $colIndex);


    $whiteColList = ['quote','about_me_text','education','language','cpecialization','mail'];

    if ( !in_array($colIndex, $whiteColList) ) {
      exit('NotFoundCol');
    }

    $updateIndexText = mysqli_prepare(
      $connection,
      "UPDATE `main_index` SET `$colIndex` = ? WHERE `id` = '1';"
    ); //Запрос обновляющий текст

    if ( $updateIndexText ) {
      mysqli_stmt_bind_param($updateIndexText, 's', $textIndex);
      $validExe = mysqli_stmt_execute($updateIndexText);

      if ( $validExe ) {
        echo 1; //Если запрос прошёл, то выводим 1
      } else {
        exit('NoUpd');
      }

      mysqli_stmt_close($updateIndexText);
    } else {
      exit('NoUpd'); //Если нет, то сообщаем об этом в клиент
    }

  } elseif ( !is_value_string($textIndex) ) { //Если нет текста, то сообщаем об этом в клиент
    exit ('NoText');
  } elseif ( !$colIndex || !$textIndex || !is_value_string($colIndex) || !is_value_string($textIndex) ) { //Если нет необходимых данных, то сообщаем об этом в клиент
    exit ('NoData');
  } else {
    exit('undefErr'); //Неизвестное состояние
  }

  mysqli_close($connection);
?>