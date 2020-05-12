<?php
  
  //Функция для масштабирования загружаемых изображений
  //$imgSrc - путь к загруженному изображению
  //$imgType - расширение изображения, по которому нужно обработать изображение
  //$blockWidth - Ширина блока в который будет помещено изображение
  //$blockHeight - Высота блока в который будет помещено изображение
  function func_scale_image($imgSrc, $imgType, $blockWidth, $blockHeight) {


    //Сохранение новой картинки из полученой
    if ( $imgType === 'jpeg' || $imgType === 'jpg' ) { //JPEG расширение
      header('Content-type: image/jpeg');
      list($initWidth, $initHeight) = getimagesize($imgSrc); //Запись исходных размеров загруженного изображения
      $image = imagecreatefromjpeg($imgSrc); //Создание нового изображения из загруженного

    } elseif ( $imgType === 'png' ) { //PNG расширение
      header('Content-type: image/png');
      list($initWidth, $initHeight) = getimagesize($imgSrc); //Запись исходных размеров загруженного изображения
      $image = imagecreatefrompng($imgSrc); //Создание нового изображения из загруженного

    } elseif ( $imgType === 'webp' ) { //WebP Расширение
      header('Content-type: image/webp');
      list($initWidth, $initHeight) = getimagesize($imgSrc); //Запись исходных размеров загруженного изображения
      $image = imagecreatefromwebp($imgSrc); //Создание нового изображения из загруженного

    } else { //Если расширение картинки не совпало ни с одним из расширений, то вся функция возвращает false
      return false;
    }


    //Вычисление новых размеров картинки исходя из её ориентации
    if ( $initWidth < $blockWidth || $initHeight < $blockHeight ) { //Если картинка меньше чем блок для неё, то она остаётся без изменений
      $newWidth  = $initWidth;
      $newHeight = $initHeight;

    } elseif ( $initWidth > $initHeight ) { //Если ориентация горизонтальная
      $ratioImg  = $initHeight / $initWidth; //Пропорции картинки (высота/ширина)
      $newHeight = $blockHeight; //Высота картинки приравнивается к высоте блока с ней
      $newWidth  = round($newHeight / $ratioImg); //Ширина картинки уменьшается пропорционально высоте

    } elseif ( $initWidth < $initHeight ) { //Если ориентация вертикальная
      $ratioImg  = $initWidth / $initHeight; //Пропорции картинки (ширина/высота)
      $newWidth  = $blockWidth; //Ширина картинки приравнивается к ширине блока с ней
      $newHeight = round($newWidth / $ratioImg); //Высота картинки уменьшается пропорционально ширине

    } elseif ( $initWidth === $initHeight ) { //Если картинка квадратная
      $newWidth  = $blockWidth; //Ширина картинки приравнивается к ширине блока с ней
      $newHeight = $newWidth; //Высота картинки приравнивается к ширине картинки

    }



    // ресэмплирование
    $imageP = imagecreatetruecolor($newWidth, $newHeight); //Создание пустой картинки
    imagecopyresampled($imageP, $image, 0, 0, 0, 0, $newWidth, $newHeight, $initWidth, $initHeight); //Копирование нашей картинки на пустую картинку


    //Созранение полученной картинки в директории и возвращение результата (true - в случае успешного созранения /false - в случае неудачного сохранения или не соответсвия ни одному из разрешённых типов)
    if ( $imgType === 'jpeg' || $imgType === 'jpg' ) {
      return imagejpeg($imageP, $imgSrc);

    } elseif ( $imgType === 'png' ) {
      return imagepng($imageP, $imgSrc);

    } elseif ( $imgType === 'webp' ) {
      return imagewebp($imageP, $imgSrc);

    } else {
      return false;
    }




  }










?>