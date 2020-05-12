<?php

  session_start();
  require '../modules/m_auth_verif_ajax.php';

  require '../modules/m_connection.php';
  require '../modules/m_func_to_work.php';
  
  $month_date = $_POST['month_date']; //Месяц и год заметки вида мм.гггг
  $note_date  = $_POST['note_date']; //Дата заметки вида дд.мм.гггг
  $note_text  = $_POST['note_text']; //Текст заметки

  settype($month_date, 'string');
  settype($note_date, 'string');
  settype($note_text, 'string');

  if ( !isset($_POST['month_date']) || !isset($_POST['note_date']) || !isset($_POST['note_text']) ) {
    exit('NoQuery');
  }

  $note_text  = verif_contenteditable_text($note_text, $connection); //Проверка для текста заметки
  $month_date = verif_textarea_text($month_date, $connection); //Проверка
  $note_date  = verif_textarea_text($note_date, $connection);  //Проверка



  //Проверка существуют ли нужные данные
  if ( !$note_date || !$month_date || !$note_text || !is_value_string($note_text) || !is_value_string($note_date) || !is_value_string($month_date) ) {
    exit('NoTextNote'); //Если нет нужных данных, то выводится сообщение об этом в клиент
  }

  //Проверка существуют ли нужные данные
  if ( $note_date && $month_date && $note_text && is_value_string($note_text) && is_value_string($note_date) && is_value_string($month_date) ) {

    $note_date = date('Y-m-d' ,strtotime($note_date)); //Форматирование даты заметки для вставки в БД вида гггг-мм-дд

    $upadatingNote = mysqli_prepare(
      $connection,
      "INSERT INTO `notes` (`date`, `month_date`, `note_text`) VALUES (?, ?, ?);"
    ); //Добавление заметки в БД


    if ( $upadatingNote ) {
      mysqli_stmt_bind_param($upadatingNote, 'sss', $note_date, $month_date, $note_text);
      $validExe = mysqli_stmt_execute($upadatingNote);
      if ( !$validExe ) {
        exit('NoQuery');
      }

      mysqli_stmt_close($upadatingNote);

    } else {
      exit('NoQuery');
    }

    $id = $connection->insert_id; //id добавленной заметки
    echo $id; //Вывод id добавленной заметки в клиент

  } else {
     exit('NoTextNote');
  }

  mysqli_close($connection);
?>