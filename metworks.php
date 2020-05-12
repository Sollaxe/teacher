<?php
  require 'modules/m_connection_unknown_user.php';
  require 'modules/m_func_create_vert_file.php';

  $catId         = $_GET['cat'];
  $searchQuery   = $_GET['query'];
  $currentPage   = $_GET['page'];
  $valFileOnPage = 5;
  $valPage       = 0;


  settype($catId, 'integer');
  settype($searchQuery, 'string');
  settype($currentPage, 'integer');


  if (!$currentPage) $currentPage = 1;
?>


<!DOCTYPE html>
<html lang="en">
  <head>

    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
      
    <title>metworks</title>
      
    <!-- <link href="https://fonts.googleapis.com/css?family=Dosis|Roboto+Mono|Roboto+Slab|Source+Sans+Pro|Quicksand" rel="stylesheet"> -->
    <link rel="stylesheet" href="/css/main-metworks.css">
    
    <script src="/js/jquery-3.3.1.js"></script>
    <script src="js/clamp.js"></script>
    <script src="/js/main.js"></script>
    
    <script src="/js/header.js"></script>
    <script src="/js/popup.js"></script>
    <script src="/js/menu.js"></script>
    <script src="/js/file-section.js"></script>
    <script src="/js/pagination.js"></script>
    <script src="/js/metworks.js"></script>

  </head>


  <body class="body">


    <?php
      //Подключение модуля вычисляющего ширину скролл-бара и задающего правый padding всей странице равный ширине этого скролл-бара (оч.важный модуль).
      //Нужен для того, чтобы страница не дёргалась при скрытии скролл-бара всплывающими окнами
      include 'modules/m_comput_scroll_width.php';

      include 'modules/m_menu.php';
      include 'modules/m_header.php';
      include 'modules/m_create_link_file.php';

    ?>

    <section class="page-name page-name_size_m outer-container" style="background-image: url('/images/books.jpg');">
      <div class="inner-container page-name__container">
        <div class="page-name__content text text_color_white">
          <div class="page-name__name text_size_xul">
            <h2 class="text text_font_sans-regular">Мои работы</h2>
          </div>
        </div>
      </div>
    </section>

    <section class="file-section file-section_theme_softblue outer-container">
      <div class="inner-container file-section__inner-container">

        <section class="file-section__search-block search-block search-block_theme_whitegreen search-block_size_m">

          <!-- Сохранение изначальных значений из GET запроса к бд. Сделано для того, чтобы при "прелистывании" страницы, возвращать изначальные значения в поля формы и отправлять эту форму -->
          <form data-search-is-change="0" data-init-cat <?php echo "=\"" . $catId . "\""; ?> data-init-query <?php echo "=\"" . $searchQuery . "\""; ?> id="form" action="metworks.php" method="GET">
            <!-- Данное скрытое поле хранит текущую страницу, при "перелистывании" значение перезаписывается и отправляется на сервер для генерации новой страницы -->
            <input type="hidden" name="page" id="form__page" value <?php echo "=\"" . $currentPage . "\""; ?>>
            <div class="search-block__form-container">
              <div class="search-block__select-container">
                <select class="search-block__categorie-select" name="cat" id="form__select">
                  <option value="">Все категории</option>
                  <?php
                    $categorieTable = mysqli_query(
                      $connection,
                      "SELECT * FROM `categorie`;"
                    );

                    if ( $catId ) { //Задание option по-умолчанию соответствующего текущей категории из GET
                      while ($currentCategorie = mysqli_fetch_assoc($categorieTable)) {
                        if ( $catId === (int)$currentCategorie["categorie_id"] ) {
                          echo '<option class="search-block__categorie-option" value="' . $currentCategorie["categorie_id"] . '" selected>' . $currentCategorie["name"] . '</option>';
                        } else {
                          echo '<option class="search-block__categorie-option" value="' . $currentCategorie["categorie_id"] . '">' . $currentCategorie["name"] . '</option>';
                        }
                      }

                    } else {
                      while ($currentCategorie = mysqli_fetch_assoc($categorieTable)) {
                        echo '<option class="search-block__categorie-option" value="' . $currentCategorie["categorie_id"] . '">' . $currentCategorie["name"] . '</option>';
                      }
                    }

                  ?>
                </select>
              </div>
              <div class="search-block__search-field">
                <?php
                  if ( $searchQuery ) { //Задание значения поля по-умолчанию соответствующего значению запроса из GET
                    echo '<input id="form__search-input" class="search-block__search-input text" placeholder="Введите запрос" type="text" name="query" value="' . $searchQuery . '">';
                  } else {
                    echo '<input id="form__search-input" class="search-block__search-input text" placeholder="Введите запрос" type="text" name="query">';
                  }
                ?>
                <input id="form__submit" class="search-block__submit text" type="submit" value="Поиск">
              </div> 
            </div>
          </form>
        </section>

        <section class="file-section__file-block">

          <?php

            $catId           = mysqli_real_escape_string($connection, $catId);
            $searchQuery     = mysqli_real_escape_string($connection, $searchQuery);
            $valFilesCreated = 0; //Кол-во созданных файл-блоков

            //Далее идёт полный алгоритм поиска, разделённый на условные блоки, исходя из данных GET, будет применён тот или иной алгоритм поиска файл-блоков

            //$sqlFileOffset - Переменная для задания отступа(offset) LIMIT, равна количеству файл-блоков выводимых на странице умноженому на номер текущей страницы уменьшенный на один (valFileOnPage * (currentPage - 1))
            //$valFileOnPage - Переменная хранящая количество файл-блоков отображающихся на одной странице
            //Данные переменные нужны для "перелистывания" страниц

            //$valFile - Переменная хранящая общее кол-во файл-блоков соответсвующих данному запросу поиска (или вообще общее кол-во файл-блоков, если запроса нет)
            //$valPage - Переменная хранящая общее кол-во страниц необходимых для отображения всех файл блоков. Рассчитывается путём деления общего кол-ва файлов соответствующих запросу на кол-во файлов отображемых на одной странице, так же полученное значение округляется в большую сторону посредством ceil()
            //Данные переменные нужны для рассчёта и записи количества необходимых страниц пагинации

            if ( $searchQuery && $catId ) { //Алгоритм поиска и подсчёта страниц в тех случаях, когда поиск осуществляется и по категории, и по запросу из поля поиска
              $sqlFileOffset = $valFileOnPage * ($currentPage - 1); //Переменная хранящая текущий offset в количестве файл-блоков для LIMIT

              $searchCatValFiles = mysqli_prepare(
                $connection,
                "SELECT COUNT(`id_file`) AS `files_val_to_cat` FROM `file_to_categorie` WHERE `id_categorie` = ?;"
              ); //Запрос который выводит кол-во файл-блоков имеющих искомую категорию

              if ( $searchCatValFiles ) {
                mysqli_stmt_bind_param($searchCatValFiles, 'i', $catId);
                $validExe = mysqli_stmt_execute($searchCatValFiles);

                if ( $validExe ) {
                  $resultStmt    = mysqli_stmt_get_result($searchCatValFiles);
                  $valFilesToCat = (int)mysqli_fetch_assoc($resultStmt)['files_val_to_cat']; //Переменная с кол-вом файл-блоков имеющих искомую категорию
                }

                mysqli_stmt_close($searchCatValFiles);
              }


              $valIterPassed   = 0; //Кол-во проиденных итераций цикла перебирающего файл-блоки с искомой категорией
              $valFileSearched = 0; //Кол-во файл-блоков которые имели искомую категорию и удволетворяли поисковому запросу

              //Цикл перебирающий файл-блоки с искомой категорией (по одному). Будет выполняться пока количество найденных файл-блоков не превышает кол-во выводимых на странице файлов и пока кол-во итераций цикла не превышает общее кол-во файл-блоков с икомой категорией
              while ( $valFilesCreated < $valFileOnPage && $valIterPassed < $valFilesToCat ) {

                $searchCat = mysqli_prepare(
                  $connection,
                  "SELECT `id_file` FROM `file_to_categorie` WHERE `id_categorie` = ? LIMIT ?, 1;"
                ); //Запрос на id файл-блока имеющего искомую категорию. Такие запросы идут по-очереди, во время итерации цикла, с каждой новой итерацией берётся следующий файл-блок и проверяется по второму запросу

                if ( $searchCat ) {
                  mysqli_stmt_bind_param($searchCat, 'ii' ,$catId, $valIterPassed);
                  $validExe = mysqli_stmt_execute($searchCat);

                  if ( !$validExe ) {
                    $valIterPassed++;
                    mysqli_stmt_close($searchCat);
                    continue;
                  }

                  $searchCatResultStmt = mysqli_stmt_get_result($searchCat);
                  mysqli_stmt_close($searchCat);

                  $currentFileId = (int)mysqli_fetch_assoc($searchCatResultStmt)['id_file']; //id текущего файл-блока

                  $isSearchFileInTable = mysqli_prepare(
                    $connection,
                    "SELECT COUNT(`file_id`) AS `file_is_found` FROM `files` WHERE `title_file` LIKE ? AND `file_id` = ?;"
                  ); //Проверяет соответствует ли текущий файл блок запросу поиска
                      // echo (int)$filesTable;

                  if ( $isSearchFileInTable ) {
                    $searchQueryStmtParam = '%' . $searchQuery . '%';
                    mysqli_stmt_bind_param($isSearchFileInTable, 'si', $searchQueryStmtParam, $currentFileId);
                    $validExe = mysqli_stmt_execute($isSearchFileInTable);

                    if ( !$validExe ) {
                      $valIterPassed++;
                      mysqli_stmt_close($isSearchFileInTable);
                      continue;
                    }

                    $filesTableResultStmt = mysqli_stmt_get_result($isSearchFileInTable);
                    mysqli_stmt_close($isSearchFileInTable);

                    $isSearchFile = (int)mysqli_fetch_assoc($filesTableResultStmt)['file_is_found']; //Переменная с результатом проверки на соответсвие текущему поисковому запросу

                    if ( $isSearchFile ) { //Если файл-блок соответствует текущему поисковому запросу, то обновляем кол-во найденных файл-блоков
                      $valFileSearched++;
                    }


                    // Если текущий файл блок соответствует текущему поисковому запросу и кол-во найденных файлов не превышает кол-во не превышает кол-во файл-блоков которые должны отображаться на странице, то
                    if ( !!$isSearchFile && $valFileSearched > $sqlFileOffset ) {
                      $querySearchFile = mysqli_prepare(
                        $connection,
                        "SELECT `file_id`, `title_file`, `pubdate`, `size_file`, `path_image` FROM `files` WHERE `title_file` LIKE ? AND `file_id` = ?;"
                      ); //Запрос на данные о файл-блоке

                      //Проверка валидности запроса и запись данных с БД в переменную
                      if ( $querySearchFile ) {
                        mysqli_stmt_bind_param($querySearchFile, 'si', $searchQueryStmtParam, $currentFileId);
                        $validExe = mysqli_stmt_execute($querySearchFile);

                        if ($validExe) {
                          $querySearchFileResultStmt = mysqli_stmt_get_result($querySearchFile);
                          mysqli_stmt_close($querySearchFile);

                          if ( $currentFile = mysqli_fetch_assoc($querySearchFileResultStmt) ) {
                            create_vert_file_html($currentFile, $connection); //Создание файл-блока с помощью пользовательской функции
                            $valFilesCreated++; //Инкремент переменной с кол-вом созданных файлов
                            $fileIsCreated = true; //Подтверждение того, что хотя бы один файл был создан
                          }
                        } else {
                          mysqli_stmt_close($querySearchFile);
                        }
                      }
                    }
                  }
                }
                
                $valIterPassed++; //Инкремент итератора цикла беребирающего файл-блоки
              }

              if ( $fileIsCreated ) {
                //Счётчик файл-блоков подходящих под запрос
                $valFile = 0; //default

                $searchCounterCat = mysqli_prepare(
                  $connection,
                  "SELECT `id_file` FROM `file_to_categorie` WHERE `id_categorie` = ?;"
                ); //Запрос на возвращающих id файл блоков с искомой категорией

                if ( $searchCounterCat ) {
                  mysqli_stmt_bind_param($searchCounterCat, 'i', $catId);
                  $validExe = mysqli_stmt_execute($searchCounterCat);
                  $searchQueryStmtParam = '%' . $searchQuery . '%';

                  if ( $validExe ) {
                    $searchCounterCatResultStmt = mysqli_stmt_get_result($searchCounterCat);
                    mysqli_stmt_close($searchCounterCat);

                    $currentCatFileCountQuery = mysqli_prepare(
                      $connection,
                      "SELECT COUNT(`file_id`) AS val_file FROM `files` WHERE `title_file` LIKE ? AND `file_id` = ?;"
                    ); //Запрос возвращающий 1 если текущий файл-блок удволетворяет поисковому запросу, 0 если не удволетворяет поисковому запросу

                    //Цикл перебирающий файл-блоки с искомой категорией. Нужен для подсчёта файл-блоков удволетворяющих поисковому запросу
                    if ( $currentCatFileCountQuery ) {
                      while ( $currentCounterFileId = mysqli_fetch_assoc($searchCounterCatResultStmt)['id_file'] ) {
                        mysqli_stmt_bind_param($currentCatFileCountQuery, 'si', $searchQueryStmtParam, $currentCounterFileId);
                        $validExe = mysqli_stmt_execute($currentCatFileCountQuery);

                        if ($validExe) {
                          $valFile += (int)mysqli_fetch_assoc( mysqli_stmt_get_result($currentCatFileCountQuery) )['val_file']; //Прибавление к кол-ву найденных файл-блоков ещё одного файл-блока
                        }
                      }

                      mysqli_stmt_close($currentCatFileCountQuery);
                    }
                  } else {
                    mysqli_stmt_close($searchCounterCat);
                  }
                }

                $valPage = ceil($valFile / $valFileOnPage);
              } else {
                $valFile = 0;
                $valPage = 0;
              }

            } elseif ( $catId ) { //Алгоритм поиска и подсчёта страниц в тех случаях, когда поиск осуществляется по категории
              $sqlFileOffset = $valFileOnPage * ($currentPage - 1);
              $valFile = 0; //default

              $searchCat = mysqli_prepare(
                $connection,
                "SELECT `id_file` FROM `file_to_categorie` WHERE `id_categorie` = ? LIMIT ?, ?;"
              ); //Запрос возвращающий id файл-блоков с искомой категорией

              if ( $searchCat ) {
                mysqli_stmt_bind_param($searchCat, 'iii', $catId, $sqlFileOffset, $valFileOnPage);
                $validExe = mysqli_stmt_execute($searchCat);

                if ( $validExe ) {
                  $searchCatResultStmt = mysqli_stmt_get_result($searchCat);
                  mysqli_stmt_close($searchCat);

                  //Цикл перебирающий id найденных файл-блоков, извлекает информацию из БД о каждом найденном файл-блоке и создаёт их
                  while ( $currentFileId = mysqli_fetch_assoc($searchCatResultStmt)['id_file'] ) {

                    $filesTable = mysqli_prepare(
                      $connection,
                      "SELECT `file_id`, `title_file`, `pubdate`, `size_file`, `path_image` FROM `files` WHERE `file_id` = ?;"
                    ); //Запрос на информацию о текущем перебираемом файл-блоке

                    if ( $filesTable ) {
                      mysqli_stmt_bind_param($filesTable, 'i', $currentFileId);
                      $validExe = mysqli_stmt_execute($filesTable);

                      if ( $validExe ) {
                        $filesTableResultStmt = mysqli_stmt_get_result($filesTable);
                        mysqli_stmt_close($filesTable);

                        if ( $currentFile = mysqli_fetch_assoc($filesTableResultStmt) ) { //Если файл-блок с таким id найден, то создаём его
                          create_vert_file_html($currentFile, $connection);
                          $valFilesCreated++;
                        }
                      } else {
                        mysqli_stmt_close($filesTable);
                      }
                    }
                  }
                  
                  //Счётчик найденных файл-блоков
                  $mysqlValFile = mysqli_prepare(
                    $connection,
                    "SELECT COUNT(`id_file`) AS val_file FROM `file_to_categorie` WHERE `id_categorie` = ?;"
                  ); //Запрос возвращающий кол-во файл блоков с искомой категорией

                  if ( $mysqlValFile ) {
                    mysqli_stmt_bind_param($mysqlValFile, 'i', $catId);
                    $validExe = mysqli_stmt_execute($mysqlValFile);

                    if ( $validExe ) {
                      $valFile = (int)mysqli_fetch_assoc( mysqli_stmt_get_result($mysqlValFile) )['val_file'];
                    }

                    mysqli_stmt_close($mysqlValFile);
                  }
                } else {
                  mysqli_stmt_close($searchCat);
                }
              }
            
              $valPage = ceil($valFile / $valFileOnPage);


            } elseif ( $searchQuery ) { //Алгоритм поиска и подсчёта страниц в тех случаях, когда поиск осуществляется по значению поля поиска
              $sqlFileOffset = $valFileOnPage * ($currentPage - 1);
              $valFile = 0; //default

              $filesTable = mysqli_prepare(
                $connection,
                "SELECT `file_id`, `title_file`, `pubdate`, `size_file`, `path_image` FROM `files` WHERE `title_file` LIKE ? ORDER BY `file_id` DESC LIMIT ?, ?;"
              ); //Запрос возвращающий информацию о файл-блоках удволетворяющих запросу поиска

              if ( $filesTable ) {
                $searchQueryStmtParam = '%' . $searchQuery . '%';
                mysqli_stmt_bind_param($filesTable, 'sii', $searchQueryStmtParam, $sqlFileOffset, $valFileOnPage);
                $validExe = mysqli_stmt_execute($filesTable);

                if ( $validExe ) {
                  //Цикл создающий файл-блоки
                  $filesTableResultStmt = mysqli_stmt_get_result($filesTable);
                  mysqli_stmt_close($filesTable);
                  while ( $currentFile = mysqli_fetch_assoc($filesTableResultStmt) ) { 
                    create_vert_file_html($currentFile, $connection);
                    $valFilesCreated++;
                  }
                } else {
                  mysqli_stmt_close($filesTable);
                }


                //Счётчик найденных файл блоков
                $mysqlValFile = mysqli_prepare(
                  $connection,
                  "SELECT COUNT(`file_id`) AS val_file FROM `files` WHERE `title_file` LIKE ?;"
                );//Запрос возвращающий кол-во файл-блоков удволетворяющих запросу поиска

                if ( $mysqlValFile ) {
                  mysqli_stmt_bind_param($mysqlValFile, 's', $searchQueryStmtParam);
                  $validExe = mysqli_stmt_execute($mysqlValFile);

                  if ( $validExe ) {
                    $valFile = (int)mysqli_fetch_assoc( mysqli_stmt_get_result($mysqlValFile) )['val_file'];
                  }

                  mysqli_stmt_close($mysqlValFile);
                }
              }

              $valPage = ceil($valFile / $valFileOnPage);

            } else { //Алгоритм поиска и подсчёта страниц в тех случаях, когда поиск не осуществляется. По-сути, просто запрос на все файл-блоки, но с пагинацией
              $sqlFileOffset = $valFileOnPage * ($currentPage - 1);
              $valFile = 0; //default

              $filesTable = mysqli_prepare(
                $connection,
                "SELECT `file_id`, `title_file`, `pubdate`, `size_file`, `path_image` FROM `files` ORDER BY `file_id` DESC LIMIT ?, ?;"
              ); //Запрос возвращающий информацию о всех файл блоках (в пределах LIMIT естественно)

              if ( $filesTable ) {
                mysqli_stmt_bind_param($filesTable, 'ii', $sqlFileOffset, $valFileOnPage);
                $validExe = mysqli_stmt_execute($filesTable);

                if ( $validExe ) {
                  $filesTableResultStmt = mysqli_stmt_get_result($filesTable);
                  mysqli_stmt_close($filesTable);

                  //Цикл создающий файл-блоки
                  while ( $currentFile = mysqli_fetch_assoc($filesTableResultStmt) ) {
                    create_vert_file_html($currentFile, $connection);
                    $valFilesCreated++;
                  }

                  //Счётчик найденных файл-блоков
                  $mysqlValFile = mysqli_query(
                    $connection,
                    "SELECT COUNT(`file_id`) AS val_file FROM `files`;"
                  ); //Запрос возвращающий кол-во всех файл-блоков

                  $valFile = (int)mysqli_fetch_assoc($mysqlValFile)['val_file'];
                  $valPage = ceil($valFile / $valFileOnPage);

                } else {
                  mysqli_stmt_close($filesTable);
                }
              }
            }

            if ( $valFilesCreated <= 0 ) {
              echo '<p style="margin-top: 20px;" class="text text_font_roboto-slab-light text_size_xl">По данному запросу ничего не найдено</p>';
            }
          ?>


        </section>

        <?php
          //Если кол-во страниц необходимых для отображения файл-блоков больше 1, то пагинация будет создана
          if ( $valPage > 1 ) {
        ?>
          <nav data-val-page <?php echo "=\"" . $valPage . "\""; ?> data-current-page <?php echo "=\"" . $currentPage . "\""; ?> onselectstart="return false" onmousedown="return false" class="file-section__pagination pagination pagination_size_m pagination_theme_white text text_font_roboto-regular">
            <div class="pagination__item pagination__item-arrow pagination__item-arrow-prev pagination__item_style_fill">
              <span class="pagination__item-text text">&lt;</span>
            </div>

            <div class="pagination__item pagination__item-arrow pagination__item-arrow-next pagination__item_style_fill">
              <span class="pagination__item-text text">&gt;</span>
            </div>
          </nav>
        <?php
          }
        ?>

      </div>
    </section>

    <?php
      include 'modules/m_footer.php';
    ?>
    
  </body>
</html>


<?php
  mysqli_close($connection)
?>