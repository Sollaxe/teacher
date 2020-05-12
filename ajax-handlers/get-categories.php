<?php

  require '../modules/m_connection_unknown_user.php';
  require '../modules/m_func_to_work.php';

  $categorieArr = array(); //Массив с категориями
  
  $categorieTable = mysqli_prepare(
    $connection,
    "SELECT * FROM `categorie`;"
  ); //Запрос на все категорие которые есть

  if ( $categorieTable ) {
    $validExe = mysqli_stmt_execute($categorieTable);

    if (!$validExe) {
      exit('server_err');
    }

    mysqli_stmt_bind_result($categorieTable, $catId, $name);

    while ( mysqli_stmt_fetch($categorieTable) ) {
      $categorieArr[] = [
        "categorie_id" => $catId,
        "name" => $name
      ];
    } //Цикл записывающий в массив объекты категорий

    mysqli_stmt_close($categorieTable);
  }


  $jsonCatArr = json_encode($categorieArr); //Кодирование в Json массива с объектами категорий
  
  echo $jsonCatArr; //Отправка json в клиент

  mysqli_close($connection);
?>