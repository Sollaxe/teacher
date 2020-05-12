<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>teacher</title>

  <link href="https://fonts.googleapis.com/css?family=Dosis|Roboto+Mono|Roboto+Slab|Source+Sans+Pro|Quicksand" rel="stylesheet">
  <link rel="stylesheet" href="/css/main-autorization.css">

  <script src="/js/jquery-3.3.1.js"></script>
  <script src="/js/clamp.js"></script>
  <script src="/js/main.js"></script>

</head>
<body class="body">
  <?php
    include 'modules/m_comput_scroll_width.php';

    // echo (int)(isset($_GET['pv']) && (int)isset($_GET['pv']) === 0);

    if ( isset($_GET['pv']) && (int)$_GET['pv'] === 0 ) {
      $isPassVerif = false;
    } else {
      $isPassVerif = true;
    }

    if ( isset($_GET['lv']) && (int)$_GET['lv'] === 0 ) {
      $isLoginVerif = false;
    } else {
      $isLoginVerif = true;
    }


  ?>

  <div class="outer-container">
    <div class="autorization-block">
      <div class="autorization-block__title">
        <span class="text text_font_dosis-regular text_size_xul">Autorization</span>
      </div>
      <div class="autorization-block__body">
        <form action="/admin-panel.php" method="POST">
          <div class="autorization-block__fields">
            <label class="autorization-block__field" for="">
              <span class="text text_font_dosis-regular text_size_xxl">login:</span>
              <input class="autorization-block__login text_font_dosis-regular text_size_xxl" name="login" type="text" autofocus>
            </label>
            <label class="autorization-block__field" for="">
              <span class="text text_font_dosis-regular text_size_xxl">password:</span>
              <input class="autorization-block__pass text_font_dosis-regular text_size_xxl" name="pass" type="password">
            </label>
          </div>
          <div class="autorization-block__submit-block">
            <input id="submit" type="submit" class="button button_style_simple button_size_l button_simple-theme_white text text_font_dosis-regular text_size_xl" value="log in">
            <!-- <div class="button button_style_simple button_size_l button_simple-theme_white">
              <div class="button__container">
                <span class="text text_font_dosis-regular text_size_xl">log in</span>
              </div>
            </div> -->
          </div>
        </form>
      </div>
    </div>
  </div>

  <?php
    if ( $isLoginVerif ) {
      if ( !$isPassVerif ) {
        echo '<script>alert(\'Неверный пароль\');</script>';
      }
    } else {
      echo '<script>alert(\'Неверный логин\');</script>';
    }


  ?>
  
</body>
</html>