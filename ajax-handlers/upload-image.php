<?php

  session_start();
  require '../modules/m_auth_verif_ajax.php';

  setlocale (LC_ALL, 'ru_RU.UTF-8', 'Rus');
  require '../modules/m_func_to_work.php';
  require '../modules/m_func_scaling_image.php';

  $image        = $_FILES['img']; //Загружаемая картинка
  $imgMaxWidth  = (int)$_POST['block_width']; //Максимальная ширина картинки  (максимальными данные значения будут в зависимости от ориентации картинки, см. в func_scale_img)
  $imgMaxHeight = (int)$_POST['block_height']; //Максимальная высота картинки (максимальными данные значения будут в зависимости от ориентации картинки, см. в func_scale_img)

  if ( !isset($_FILES['img']) || !isset($_POST['block_width']) || !isset($_POST['block_height']) || $imgMaxWidth === 0 || $imgMaxHeight === 0 ) {
    exit('NoData');
  }

  $imgType = pathinfo($image['name'], PATHINFO_EXTENSION); //Расширение загружаемой картинки

  $permittedTypes = ["jpg", "jpeg", "png", "webp"]; //Массив допустимых расширений картинки

  if ( !in_array(mb_strtolower($imgType), $permittedTypes) ) { //Проверка расширения картинки, если расширение не подходит, то сообщаем об этом в клиент
    exit('WrongType');
  }

  $uploadDir = $_SERVER['DOCUMENT_ROOT'] . '/images/upload-image/'; //Директория для загружаемых картинок
  $nameFile = uniqid("", true); //Генерация уникального имени для картинки


  $uploadFile = $uploadDir . $nameFile . '.' . $imgType; //Путь к новой картинке

  if ( move_uploaded_file($image['tmp_name'], $uploadFile) ) { //Перемещение картинки из temp и проверка результата перемещения

    $isScaled = func_scale_image( $uploadFile, mb_strtolower($imgType), $imgMaxWidth, $imgMaxHeight ); //Масштабирование картинки

    if ( !$isScaled ) { //Если масштабирование не прошло, то мы удаляем загруженную картинку и сообщаем об этом в клиент
      if ( verif_unlink_img($uploadFile) ) {
        unlink($uploadFile);
      }
      exit('ScaleError');
    }

    $toJsonObj = [
      "nameUpdFile" => basename($uploadFile),
      "valid" => 1,
      "scale" => $isScaled
    ];

    echo json_encode($toJsonObj);
  } else {
    echo 0;
  }



?>
