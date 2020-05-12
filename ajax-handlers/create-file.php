<?php

  session_start();
  require '../modules/m_auth_verif_ajax.php';

  require '../modules/m_connection.php';
  require '../modules/m_func_to_work.php';


  
  $categorieArr = json_decode($_POST['categorie_arr']); //Массив с категориями
  $title_file   = $_POST['title_file']; //Название файл-блока
  $description  = $_POST['description']; //Описание файл-блока
  $image_path   = $_POST['image_path']; //Путь картинки для файл-блока

  settype($title_file, 'string');
  settype($description, 'string');
  settype($image_path, 'string');

  if ( !isset($_POST['title_file']) || !isset($_POST['title_file']) || !isset($_POST['title_file']) || !isset($_FILES['file']) || !isset($_POST['categorie_arr']) ) {
    exit('NoData');
  }

  $file = $_FILES['file']; //Файл

  //Проверка введённых данных
  $title_file  = verif_textarea_text($title_file, $connection); 
  $description = verif_textarea_text($description, $connection);
  $image_path  = verif_textarea_text($image_path, $connection);

  //Проверка введённых данных для категорий
  foreach ( $categorieArr as $key => $value ) {
    $value->categorie_id = verif_textarea_text($value->categorie_id, $connection);
    settype($value->categorie_id, 'integer');
  }

  //Проверка наличия названия файла и пути к картинке
  if ( !$title_file || !$image_path || !is_value_string($title_file) || !is_value_string($image_path) ) {
    exit('NoData');
  }

  //Проверка наличия файла
  if ( !$file ) {
    exit('NoFile');
  }

  $fileType = pathinfo($file['name'], PATHINFO_EXTENSION); //Расширение файла

  //Массив разрешённых расширений для файла
  $permittedTypes = ["ai", "avi", "bmp", "bps", "bz", "bz2", "doc", "docx", "fdf", "jpeg", "jpg", "mkv", "mp3", "mp4", "mpp", "mpg", "png", "ppi", "pps", "ppt", "ppz", "psd", "rar", "svg", "xlb", "xls", "zip", "gif"];

  //Проверка расширения файла
  if ( !in_array(mb_strtolower($fileType), $permittedTypes) ) {
    exit('WrongTypeFile'); //Если расширения файла нет в массиве, то php заканчивает работу и выводит WrongType
  }

  $uploadDir = $_SERVER['DOCUMENT_ROOT'] . '/upd-files/'; //Директория для загрузки файлов
  $nameFile = uniqid("", true); //Генерирование уникального имени для файла

  $uploadFile = $uploadDir . $nameFile . '.' . $fileType; //Конечный путь к файлу

  if ( move_uploaded_file($file['tmp_name'], $uploadFile) && file_exists($uploadFile) ) { //Проверка на загрузку файла из temp в основную директорию для файлов
    $file_path = '/upd-files/' . basename($uploadFile); //Запись абсолютного пути к файлу на сервере
    $file_size = round($file['size'] / 1024); //Запись размера файла в КБ


    $file_path   = mysqli_real_escape_string ($connection, $file_path); //Экранирование спец.символов
    $file_size   = mysqli_real_escape_string ($connection, $file_size); //Экранирование спец.символов
  
    //Проверка наличия названия файла, пути к картинке и пути к файлу
    if ( $title_file && $image_path && $file_path && is_value_string($title_file) && is_value_string($image_path) && is_value_string($file_path) ) {
  
      $pubdate = date('Y-m-d'); //Сохранение текущей даты или даты публикации файла вида гггг-мм-дд
  
      $mysqlInsertFileQuery = mysqli_prepare(
        $connection,
        "INSERT INTO `files` (`title_file`, `description`, `path_image`, `pubdate`, `size_file`, `path_file`)
        VALUES ( ?, ?, ?, '$pubdate', '$file_size', '$file_path');"
      ); //Вставка информации о файл-блоке в БД

      if ( $mysqlInsertFileQuery ) {
        mysqli_stmt_bind_param($mysqlInsertFileQuery, 'sss', $title_file, $description, $image_path);
        $validExe = mysqli_stmt_execute($mysqlInsertFileQuery);
        mysqli_stmt_close($mysqlInsertFileQuery);
      }

      if ( !$mysqlInsertFileQuery || !$validExe ) { //Если запрос не прошёл, то удаляем загруженный файл и выводим NoQuery, так же заканчиваем выполнение php
        remove_files_to_fileblock($file_path, $image_path);
        exit('NoQuery');
      }
  
      $idAddedFile = $connection->insert_id; //Запись id вставленного в БД файл-блока
  
      $categorieFile = mysqli_prepare(
        $connection,
        "INSERT INTO `file_to_categorie` (`id_file`, `id_categorie`) 
        VALUES ('$idAddedFile', ?);"
      );

        if ( $categorieFile ) {
          foreach ($categorieArr as $key => $value) { //Добавление в БД категорий к которым принадлежит файл
            mysqli_stmt_bind_param($categorieFile, 'i', $value->categorie_id);
            $validExe = mysqli_stmt_execute($categorieFile);

            if ( !$validExe ) {
              exit('NoCatQuery');
            }

          }
          mysqli_stmt_close($categorieFile);
        } else { //Если запрос не прошёл, то заканчиваем php и выводим в клиент сообщение об ошибке запроса
          exit('NoCatQuery');
        }


      $jsonPubdate = date('d.m.Y' ,strtotime($pubdate)); //Запись даты публикации файл-блока вида дд.мм.гггг
  
      //Массив с некоторыми данными о добавленном файл-блоке
      $DataObj = [
        "id_file" => $idAddedFile,
        "pubdate" => $jsonPubdate,
        "file_size" => $file_size
      ];
  
      $jsonDataObj = json_encode($DataObj); //Кодирование массива с данными в JSON 
  
      echo $jsonDataObj; //Отправка JSON'а в клиент
    } else { //Если не прошла проверка на название, путь к картинке и путь к файлу, то удаляем сохранённый файл и выводим в клиент сообщение об ошибке
      remove_files_to_fileblock($file_path, $image_path);
      exit('NoDataSecondErr'); //На фронте должно происходить закрытие окна
    }

  } else { //Если файл не удалось загрузить, то выводим сообщение об этом в клиент
    exit('NoFileUpload');
  }



  function remove_files_to_fileblock ($filePath, $imagePath) {
    $removingFile = $_SERVER['DOCUMENT_ROOT'] . $filePath;
    $removingImg = $_SERVER['DOCUMENT_ROOT'] . $imagePath;

    if ( verif_unlink_file($removingFile) ) {
      unlink($removingFile);
    }

    if ( verif_unlink_img($removingImg) ) {
      unlink($removingImg);
    }
  }

  mysqli_close($connection);
?>