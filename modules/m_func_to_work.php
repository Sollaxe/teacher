<?php

  //$conn - аргумент принимающий текущее соединение с БД $connection


  //Функция для проверки введённых данных в поле contenteditable, отсеивает нежелательные и потенциально опасные тэги, сохраняет только теги div и br
  function verif_contenteditable_text ($inputStr, $conn) {
    $outputStr = strtr($inputStr, array("<div>" => "[div]", "</div>" => "[/div]", "<br>" => "[br]", "<br/>" => "[br/]", "&nbsp;" => " ") ); //Перезапись div и br без "<>"
    $outputStr = htmlspecialchars($outputStr); //Преобразование html-сущностей
    $outputStr = strtr($outputStr, array("[div]" => "<div>", "[/div]" => "</div>", "[br]" => "<br>", "[br/]" => "<br/>") ); //Перезапись div и br в классический вариант с "<>"
    $outputStr = mysqli_real_escape_string($conn, $outputStr); //Экранирование спец.символов перед SQL запросом

    return $outputStr; //Возвращение проверенной строки
  }

  //Функция для проверки введённых данных в поле textarea (может использоваться и с другими полями)
  function verif_textarea_text ($inputStr, $conn) {
    $outputStr = str_replace(["\r\n", "\n", "\r"], " ", $inputStr);
    // $outputStr = strtr($inputStr, array("\r" => " ", "\n", " ") ); //Удаление div и br тэгов
    $outputStr = htmlspecialchars($outputStr); //Преобразование html-сущностей
    // $outputStr = mysqli_real_escape_string($conn, $outputStr); //Экранирование спец.символов

    return $outputStr; //возвращение проверенной строки
  }

  //Функция для проверки введённых данных в поле contenteditable, отличие от функции выше в том, что введённые значения будут идти в одну строку, без div и br
  function verif_contenteditable_line_text ($inputStr, $conn) {
    $outputStr = strtr($inputStr, array("<div>" => "", "</div>" => "", "<br>" => "", "<br/>" => "") ); //Удаление div и br тэгов
    $outputStr = htmlspecialchars($outputStr); //Преобразование html-сущностей
    $outputStr = mysqli_real_escape_string($conn, $outputStr); //экранирование спец.символов перед SQL запросом

    return $outputStr; //возвращение проверенной строки
  }

  //Функция проверяет есть ли в строке значения исключая разрешённые тэги div и br, а так же исключая пробелы
  function is_value_string ($inputStr) {
    $outputStr = strtr($inputStr, array("<div>" => "", "</div>" => "", "<br>" => "", "<br/>" => "", "&nbsp;" => "") ); //Удаление div, br и пробелов
    $outputStr = trim($outputStr); //Обрезание пробелов по концам строки

    if ( strlen($outputStr) !== 0 ) { //Если длина строки не равна нулю, то функция возращает true
      return true;
    } elseif ( strlen($outputStr) === 0 ) { //Если длина строки равна нулю, то функция возращает false
      return false;
    } else { //Если ни одно условие не выполнилось, то генерируется ошибка
      throw new Exception("user function error");
    }
  }

  //Функция для проверки файла перед его удалением (создана для лучшего обеспечения безопасности файловой системы)
  function verif_unlink_file ($path) {
    $parentPathDirName = basename(dirname($path), 1);

    if ( $parentPathDirName === 'upd-files' && is_file($path) ) {
      return true;
    } else {
      return false;
    }
  }

  //Функция для проверки изображения перед его удалением (создана для лучшего обеспечения безопасности файловой системы)
  function verif_unlink_img ($path) {
    $parentPathDirName = basename(dirname($path), 1);

    if ( $parentPathDirName === 'upload-image' && is_file($path) ) {
      return true;
    } else {
      return false;
    }
  }






?>