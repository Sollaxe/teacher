<?php
  
  session_start();
  require '../modules/m_auth_verif_ajax.php';

  setlocale (LC_ALL, 'ru_RU.UTF-8', 'Rus');
  require '../modules/m_func_to_work.php';

  $imagePath = $_POST['fop']; //Путь удаляемой картинке
  settype($imagePath, 'string');

  if ( !isset($_POST['fop']) ) {
    exit('NoPath');
  }

  //Проверка на наличие пути к картинке
  if ( $imagePath && is_value_string(basename($imagePath)) ) {
    $removingImg = $_SERVER['DOCUMENT_ROOT'] . '/images/upload-image/' . basename($imagePath); //Полный путь к удаляемой картинке

    if ( verif_unlink_img($removingImg) ) { //Проверка на наличие файла на пути
      echo unlink($removingImg); //Удаление картинки
    } else {
      exit('NoPath'); //Если на пути нет файла, то сообщаем об этом в клиент
    }

  } else {
    exit('NoPath'); //Если нет пути к картинке, то сообщаем об этом в клиент
  }

?>