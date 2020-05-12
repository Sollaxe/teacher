<?php

  require '../modules/m_connection_unknown_user.php';
  require '../modules/m_func_to_work.php';

  $monthDate = $_POST['mon']; //Число месяца и год в формате мм.гггг
  settype($monthDate, 'string');

  if ( !isset($_POST['mon']) || !is_value_string($monthDate) || !$monthDate ) {
    exit('NoQuery');
  }

  $monthDate = mysqli_real_escape_string($connection, $monthDate); //Экранирование спец.символов

  $objCells = array(); //Создание массива с данными заметок

  $searchNotes = mysqli_prepare(
    $connection,
    "SELECT `date`, `note_id` FROM `notes` WHERE `month_date` = ?;"
  ); //Запрос возвращающий id и дату заметок на текущий месяц (указанный в $monthDate)


  if ( $searchNotes ) {
    mysqli_stmt_bind_param($searchNotes, 's', $monthDate);
    $validExe = mysqli_stmt_execute($searchNotes);

    if ( $validExe ) {
      mysqli_stmt_bind_result($searchNotes, $date, $note_id);

      while ( mysqli_stmt_fetch($searchNotes) ) {
        $noteData = [
          'date'      => date('d.m.Y' ,strtotime($date)),
          'note_id'   => $note_id
        ];
        $objCells[] = $noteData; //Добавление в массив данных о текущей заметке
      }
    } else {
      exit('NoQuery');
    }

    mysqli_stmt_close($searchNotes);

  } else {
    exit('NoQuery');
  }


  
  //Цикл перебирающий заметки и записывающий их в массив с данными заметок
  // while ( $currentNote = mysqli_fetch_assoc($searchNotes) ) {
  //   $currentNote['date'] = date('d.m.Y' ,strtotime($currentNote['date'])); //Форматирование даты в формате дд.мм.гггг



  //   $objCells[] = $currentNote; //Добавление в массив данных о текущей заметке
  // }

  $jsonObjCells = json_encode($objCells); //Кодирование в JSON массива с данными заметок
  echo $jsonObjCells; //Отправка JSON'а клиенту



  mysqli_close($connection);
?>