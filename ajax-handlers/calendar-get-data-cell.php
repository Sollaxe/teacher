<?php

  require '../modules/m_connection_unknown_user.php';
  require '../modules/m_func_to_work.php';

  $noteId = $_POST['nid']; //id заметки
  settype($noteId, 'int');

  if ( !isset($_POST['nid']) ) {
    exit('NoSearch');
  }

  $noteId = mysqli_real_escape_string($connection, $noteId); //экранирование спец.символов

  //Проверка на наличие id
  if ( $noteId && is_value_string($noteId) ) {

    $searchNote = mysqli_prepare(
      $connection,
      "SELECT `date`, `note_id`, `note_text` FROM `notes` WHERE `note_id` = ? ;"
    ); //Запрос на вывод данных о заметке

    if ( $searchNote ) {
      mysqli_stmt_bind_param($searchNote, 'i', $noteId);
      $validExe = mysqli_stmt_execute($searchNote);

      if ( !$validExe ) {
        exit ('NoSearch');
      }

      mysqli_stmt_bind_result($searchNote, $date, $note_id, $note_text);

      if ( mysqli_stmt_fetch($searchNote) ) {
        $noteData = [
          'date'      => date('d.m.Y' ,strtotime($date)),
          'note_id'   => $note_id,
          'note_text' => $note_text
        ];

        $jsonObjCells = json_encode($noteData); //Кодирование объекта с информацией заметки в JSON
        echo $jsonObjCells; //Отправка JSON'а клиенту
        
      } else {
        exit('NoSearch');
      }

      mysqli_stmt_close($searchNote);
    }

    if ( !$searchNote ) { //Если запрос не удался, то вывеси NoId и закончить выполнение php
      exit('NoSearch');
    }
  } else {
    exit('NoSearch'); //Если id нет, то выводить NoId и заканчивать выполнение php
  }


  
  mysqli_close($connection);
?>