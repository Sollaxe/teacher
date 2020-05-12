<?php

  session_start();
  require '../modules/m_auth_verif_ajax.php';

  require '../modules/m_connection.php';
  require '../modules/m_func_to_work.php';

  $noteId   = $_POST['id']; //id заметки
  $noteText = $_POST['text']; //Новый текст заметки
  settype($noteId, 'integer');
  settype($noteText, 'string');

  if ( !isset($_POST['id']) || !isset($_POST['text']) ) {
    exit('NoData');
  }

  //Проверка на наличие необходимых данных 
  if ( $noteId && $noteText && is_value_string($noteId) && is_value_string($noteText) ) {

    $noteText = verif_contenteditable_text($noteText, $connection);
    $noteId = mysqli_real_escape_string($connection, $noteId);

    $noteText = trim($noteText);

    $updateNote = mysqli_prepare(
      $connection,
      "UPDATE `notes` SET `note_text` = ? WHERE `note_id` = ?;"
    ); //Запрос на обновление заметки


    if ( $updateNote ) {
      mysqli_stmt_bind_param($updateNote, 'si', $noteText, $noteId);
      $validExe = mysqli_stmt_execute($updateNote);

      if ( $validExe ) {
        echo 1; //Если запрос прошёл, то выводим в клиент 1
      } else {
        exit('NoUpd');
      }

      mysqli_stmt_close($updateNote);
    } else {
      exit('NoUpd'); //Если нет, то сообщаем об этом в клиент
    }

  } elseif( !is_value_string($noteText) ) { //Если нет текста, то сообщаем об этом в клиент
    exit('NoText');
  } elseif ( !$noteId || !$noteText || !is_value_string($noteId) || !is_value_string($noteText) ) { //Если нет необходимых данных, то сообщаем об этом в клиент
    exit('NoData');
  } else {
    exit('undefErr'); //Неизвестное состояние
  }


  mysqli_close($connection);
?>