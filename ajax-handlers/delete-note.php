<?php

  session_start();
  require '../modules/m_auth_verif_ajax.php';

  require '../modules/m_connection.php';
  require '../modules/m_func_to_work.php';

  $noteId = $_POST['nid']; //id удаляемой заметки
  settype($noteId, 'integer');

  if ( !isset($_POST['nid']) ) {
    exit('NoId');
  }

  if ( $noteId && is_value_string($noteId) ) { //Проверка наличия id 
    $noteId = mysqli_real_escape_string($connection, $noteId);

    $noteToDelete = mysqli_prepare(
      $connection,
      "DELETE FROM `notes` WHERE `note_id` = ?;"
    ); //Удаление заметки из БД

    if ( $noteToDelete ) {
      mysqli_stmt_bind_param($noteToDelete, 'i', $noteId);
      $validExe = mysqli_stmt_execute($noteToDelete);

      if ( $validExe ) {
        exit('1');
      } else {
        exit('NoDelete');
      }

      mysqli_stmt_close($noteToDelete);
    } else {
      exit('NoDelete');
    }

  } elseif ( !is_value_string($noteId) ) { //если нет id заметки, сообщаем об этом в клиент
    exit('NoId');
  }



  mysqli_close($connection);

?>