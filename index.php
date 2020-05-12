<!DOCTYPE html>
<html lang="Ru-ru">
  <head>

    <?php
      if ( isset($_GET['mess']) ) {
        settype($_GET['mess'], 'string');
        $messageForUser = 'Сообщение'; //defalut

        if ( $_GET['mess'] === 'limitsess' ) {
          $messageForUser = 'Превышен лимит ожидания действий. Авторизуйтесь повторно если хотите продолжить работу в панели';
        } else if ( $_GET['mess'] === 'sec' ) {
          $messageForUser = 'Сессия была прервана ради безопасности соединения, пожалуйста, авторизуйтесь повторно';
        }

        echo
        "<script>
          alert('$messageForUser');
          document.location.href = '/';
        </script>";
        exit;
      }

      require 'modules/m_connection_unknown_user.php';
      require 'modules/m_func_create_vert_file.php';
    ?>

    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
      
    <title>teacher</title>
    <link rel="stylesheet" href="/css/main-index.css">
    
    <script src="/js/jquery-3.3.1.js"></script>
    <script src="/js/clamp.js"></script>
    <script src="/js/main.js"></script>

    <script src="/js/header.js"></script>
    <script src="/js/popup.js"></script>
    <script src="/js/menu.js"></script>
    <script src="/js/calendar.js"></script>
    <script src="/js/file-section.js"></script>
    <script src="/js/index.js"></script>
  </head>


  <body class="body">

    <?php
      $indexMainTable = mysqli_query(
        $connection,
        "SELECT * FROM `main_index`"
      );
      $indexMainInfo = mysqli_fetch_assoc($indexMainTable); //Запрос основной информации страницы (пути к изображениям, тексты с блока "обо мне")

      //Подключение модуля вычисляющего ширину скролл-бара и задающего правый padding всей странице равный ширине этого скролл-бара (оч.важный модуль).
      //Нужен для того, чтобы страница не дёргалась при скрытии скролл-бара всплывающими окнами
      include 'modules/m_comput_scroll_width.php'; 
      
      include 'modules/m_menu.php';
      include 'modules/m_header.php';
      include 'modules/m_create_link_file.php';
      
      echo "<script>var dateCurrentMonthNum = ". date('m') .", dateCurrentYearNum = ". date('Y') .";</script>"; //Сохранение в JS переменных даты запрошенной с сервера
    ?>

    <section class="person-block outer-container" style="background-image: url(<?php echo '\'' . $indexMainInfo["main_profile_photo_path"] . '\''?>);">
      <div class="inner-container person-block__container">
        <div class="person-block__content text text_color_white">
          <div class="person-block__name text_size_xul">
            <h2 class="text text_font_sans-regular">Джонатан Тэйлор</h2>
          </div>
          <div class="person-block__blockquote text_size_xs">
            <q class="text text_font_roboto-slab-light"><?php echo $indexMainInfo["quote"] ?></q>
          </div>
        </div>
      </div>
    </section>

    <section class="about-me about-me_theme_softgreen outer-container">
      <div class="inner-container about-me__inner-container">

        <div class="about-me__section-name section-name section-name_vertical section-name_theme_white section-name_size_l">
          <h2 class="text text_font_roboto-regular">Обо мне</h2> <!-- Расчёты координат проводить в JS! -->
        </div>

        <section class="about-me__top-section">
          <article class="about-me__essay text_font_sans-regular">
            <div class="text">
              <?php echo $indexMainInfo["about_me_text"]; ?>
            </div>
          </article>
          <div class="about-me__image-block">
            <div class="drove-image drove-image_size_m drove-image_theme_softgreygreen">
              <div class="drove-image__droving-img" style="background-image: url(<?php echo '\'' . $indexMainInfo["about_me_photo_path"] . '\''?>);"></div>
            </div>
          </div>
        </section>

        <section class="about-me__botttom-section">
          <div onselectstart="return false" onmousedown="return false" class="about-me__calendar calendar">
            <div class="calendar__month-select">
              <span data-arrow-act="move-backward" class="calendar__arrow">&lt;</span>
              <span class="calendar__month text text_font_roboto-light"></span>
              <span data-arrow-act="move-forward" class="calendar__arrow">&gt;</span>
            </div>
            <table class="calendar__table text_font_quick-light text_size_s">
              <tr class="calendar__row calendar__row-1 calendar__row-days text text_font_roboto-light">
                <td data-day-num="1" class="calendar__day calendar__day-1">Пн</td>
                <td data-day-num="2" class="calendar__day calendar__day-2">Вт</td>
                <td data-day-num="3" class="calendar__day calendar__day-3">Ср</td>
                <td data-day-num="4" class="calendar__day calendar__day-4">Чт</td>
                <td data-day-num="5" class="calendar__day calendar__day-5">Пт</td>
                <td data-day-num="6" class="calendar__day calendar__day-6">Сб</td>
                <td data-day-num="0" class="calendar__day calendar__day-7">Вс</td>
              </tr>
              <tr class="calendar__row calendar__row-2">
                <td data-day="1" class="calendar__cell"></td>
                <td data-day="2" class="calendar__cell"></td>
                <td data-day="3" class="calendar__cell"></td>
                <td data-day="4" class="calendar__cell"></td>
                <td data-day="5" class="calendar__cell"></td>
                <td data-day="6" class="calendar__cell"></td>
                <td data-day="0" class="calendar__cell"></td>
              </tr>
              <tr class="calendar__row calendar__row-3">
                <td data-day="1" class="calendar__cell"></td>
                <td data-day="2" class="calendar__cell"></td>
                <td data-day="3" class="calendar__cell"></td>
                <td data-day="4" class="calendar__cell"></td>
                <td data-day="5" class="calendar__cell"></td>
                <td data-day="6" class="calendar__cell"></td>
                <td data-day="0" class="calendar__cell"></td>
              </tr>
              <tr class="calendar__row calendar__row-4">
                <td data-day="1" class="calendar__cell"></td>
                <td data-day="2" class="calendar__cell"></td>
                <td data-day="3" class="calendar__cell"></td>
                <td data-day="4" class="calendar__cell"></td>
                <td data-day="5" class="calendar__cell"></td>
                <td data-day="6" class="calendar__cell"></td>
                <td data-day="0" class="calendar__cell"></td>
              </tr>
              <tr class="calendar__row calendar__row-5">
                <td data-day="1" class="calendar__cell"></td>
                <td data-day="2" class="calendar__cell"></td>
                <td data-day="3" class="calendar__cell"></td>
                <td data-day="4" class="calendar__cell"></td>
                <td data-day="5" class="calendar__cell"></td>
                <td data-day="6" class="calendar__cell"></td>
                <td data-day="0" class="calendar__cell"></td>
              </tr>
              <tr class="calendar__row calendar__row-6">
                <td data-day="1" class="calendar__cell"></td>
                <td data-day="2" class="calendar__cell"></td>
                <td data-day="3" class="calendar__cell"></td>
                <td data-day="4" class="calendar__cell"></td>
                <td data-day="5" class="calendar__cell"></td>
                <td data-day="6" class="calendar__cell"></td>
                <td data-day="0" class="calendar__cell"></td>
              </tr>
              <tr class="calendar__row calendar__row-7">
                <td data-day="1" class="calendar__cell"></td>
                <td data-day="2" class="calendar__cell"></td>
                <td data-day="3" class="calendar__cell"></td>
                <td data-day="4" class="calendar__cell"></td>
                <td data-day="5" class="calendar__cell"></td>
                <td data-day="6" class="calendar__cell"></td>
                <td data-day="0" class="calendar__cell"></td>
              </tr>
            </table>
          </div>

          <section class="about-me__bordered-block bordered-block bordered-block_size_m bordered-block_theme_white">
            <div class="bordered-block__title">
              <h3 class="text text_font_roboto-regular">Ещё немного обо мне</h3>
            </div>
            <div class="bordered-block__angle bordered-block__angle-1"></div>
            <div class="bordered-block__angle bordered-block__angle-2"></div>
            <div class="bordered-block__angle bordered-block__angle-3"></div>
            <div class="bordered-block__angle bordered-block__angle-4"></div>

            <div class="bordered-block__container img-list text_font_sans-regular">
              <div class="bordered-block__item img-list__item">
                <img class="img-list__dec-img" src="/images/icon/icon-education-white.png" alt="">
                <span class="text"><?php echo $indexMainInfo["education"]; ?></span>
              </div>
              <div class="bordered-block__item img-list__item">
                <img class="img-list__dec-img" src="/images/icon/icon-lang-white.png" alt="">
                <span class="text"><?php echo $indexMainInfo["language"]; ?></span>
              </div>
              <div class="bordered-block__item img-list__item">
                <img class="img-list__dec-img" src="/images/icon/icon-physics-white.png" alt="">
                <span class="text"><?php echo $indexMainInfo["cpecialization"]; ?></span>
              </div>
              <div class="bordered-block__item img-list__item">
                <img class="img-list__dec-img" src="/images/icon/icon-dog-white.png" alt="">
                <span class="text"><?php echo $indexMainInfo["mail"]; ?></span>
              </div>
            </div>
          </section>

        </section>
      </div>
    </section>
    
    <section class="file-section file-section_theme_ocean outer-container">
      <div class="inner-container file-section__inner-container">
        <div class="file-section__section-name section-name section-name_vertical section-name_theme_white section-name_size_l">
          <h2 class="text text_font_roboto-regular">Мои работы</h2> <!-- Расчёты координат проводить в JS! -->
        </div>
        <div class="file-section__file-block">
          <?php
            $filesTable = mysqli_query(
              $connection,
              "SELECT `file_id`, `title_file`, `pubdate`, `size_file`, `path_image` FROM `files` ORDER BY `file_id` DESC LIMIT 10;"
            ); //Запрос с БД файлов

            while ( ($currentFile = mysqli_fetch_assoc($filesTable)) ) { 
              create_vert_file_html($currentFile, $connection); //Функция создающая файл-блоки
            }
          ?>
        </div>

        <nav class="file-section__but-block">
          <a href="metworks.php" class="link link_dis_inl-block button button_style_simple button_size_l button_simple-theme_white">
            <div class="button__container">
              <span class="text text_size_m">Показать больше</span>
            </div>
          </a>
        </nav>

      </div>
    </section>

    <?php
      include 'modules/m_footer.php';
    ?>
    

  </body>
</html>


<?php
  mysqli_close($connection);
?>