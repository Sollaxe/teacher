<?php

  //Функция для создания файл-блоков
  //Первым аргументом принимает объект с информацией о файл-блоке возвращаемый mysqli_fetch_assoc
  //Вторым аргументом принимает текущее соединение $connection
  function create_vert_file_html( $currentFile, $conn ) {
    $pubdateCurrentFile = date('d.m.Y' ,strtotime($currentFile["pubdate"])); //Интерпретируем дату публикации в нужный нам формат дд.мм.гггг

    //Вывод первой части файл-блока
    echo '<div data-file-id="' . $currentFile["file_id"] . '" class="vert-file vert-file_size_m vert-file_theme_white file-section__file text_font_sans-regular">
      <div class="vert-file__img" style="background-image: url(\'' . $currentFile["path_image"] . '\');"></div>
      <div class="vert-file__content">
        <div class="vert-file__name text_size_xxs">
          <span title="' . $currentFile["title_file"] . '" class="vert-file__name-text text text_hv-cursor_pointer">' . $currentFile["title_file"] . '</span>
        </div>
        <div class="vert-file__info text text_size_us">
          <div class="vert-file__tags">';

    $catToFile = mysqli_prepare(
      $conn,
      "SELECT `id_categorie` FROM `file_to_categorie` WHERE `id_file` = ?;"
    ); //Запрос выводящий id категорий к которым принадлежит файл-блок

    if ( $catToFile ) {
      mysqli_stmt_bind_param($catToFile, 'i', $currentFile["file_id"]);
      $validExe = mysqli_stmt_execute($catToFile);

      if ( $validExe ) {
        $catToFileResultStmt = mysqli_stmt_get_result($catToFile);
        mysqli_stmt_close($catToFile);

        $categorie = mysqli_prepare(
          $conn,
          "SELECT * FROM `categorie` WHERE `categorie_id` = ?;"
        ); //Запрос выводящий информацию о категориях к которым принадлежит файл-блок

        if ( $categorie ) {
          while ( $currentLine = mysqli_fetch_assoc($catToFileResultStmt) ) {
            mysqli_stmt_bind_param($categorie, 'i', $currentLine["id_categorie"]);
            $validExe = mysqli_stmt_execute($categorie);

            if ( $validExe ) {
              $categorieStmtResult = mysqli_stmt_get_result($categorie);

              if ( $curretntCat = mysqli_fetch_assoc($categorieStmtResult) ) { //Проверка на валидность запроса и вывод одной категории в файл-блок
                echo '<a class="vert-file__tag link link_undecorate link_hv_underline link_theme_inherit" href="/metworks.php?cat=' . $curretntCat["categorie_id"] . '">' . $curretntCat["name"] . '</a> ';
              }
            }
          }

          mysqli_stmt_close($categorie);
        }
      } else {
        mysqli_stmt_close($catToFile);
      }
    }


    //Вывод второй части файл-блока
    echo  '</div>
          <div class="vert-file__subinfo">
            <span class="text vert-file__file-size">Размер: ' . $currentFile["size_file"] . 'Кб</span>
            <span class="text vert-file__file-pubdate">' . $pubdateCurrentFile . '</span>
          </div>
        </div>
      </div>
    </div>';
  }

?>