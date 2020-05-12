<?php

  require 'm_session_regenerator.php';

  $authLogin = $_POST['login'];
  $authPass  = $_POST['pass'];
  $passVerif = false;

  settype($authLogin, 'string');
  settype($authPass, 'string');

  if ( isset($_POST['login']) && isset($_POST['pass']) && !isset($_GET['pv']) && !isset($_GET['lv']) ) {

    $userQuery = mysqli_prepare(
      $connection,
      "SELECT * FROM `users` WHERE `login` = ? LIMIT 1"
    );

    if ( $userQuery ) {
      mysqli_stmt_bind_param($userQuery, 's', $authLogin);
      $validExe = mysqli_stmt_execute($userQuery);

      if ( $validExe ) {
        $userQueryResultStmt = mysqli_stmt_get_result($userQuery);
        mysqli_stmt_close($userQuery);
        $userQueryData = mysqli_fetch_assoc($userQueryResultStmt);

        if ( $userQueryData ) {
          $passVerif = password_verify($authPass, $userQueryData["password"]);

          if ( $passVerif ) {
            $_SESSION['user_id']       = $userQueryData['id'];
            $_SESSION['user_agent']    = $_SERVER['HTTP_USER_AGENT'];
            $_SESSION['user_ip']       = $_SERVER['REMOTE_ADDR'];
            $_SESSION['user_is_admin'] = $userQueryData["is_admin"];
            $_SESSION['nonce']         = time(true);

            header("Location: http://" . strtok($_SERVER['HTTP_HOST'] . $_SERVER['REQUEST_URI'], '?'));
          } else {
            header("Location: http://" . strtok($_SERVER['HTTP_HOST'] . $_SERVER['REQUEST_URI'], '?') . '?pv=0');
          }

          exit;
        } elseif ( isset($_POST['login']) ) {
          header("Location: http://" . strtok($_SERVER['HTTP_HOST'] . $_SERVER['REQUEST_URI'], '?') . '?lv=0');
        }
      }
    }
  }

  if ( isset($_GET['action']) && $_GET['action'] === "logout" ) {
    session_destroy();
    setcookie('PHPSESSID', '', 1);
    if ( isset($_GET['mess']) ) {
      header("Location: http://" . $_SERVER['HTTP_HOST'] . "?mess=" . $_GET['mess']);
    } else {
      header("Location: http://" . $_SERVER['HTTP_HOST'] . "/");
    }
    exit;
  }

  if ( !isset($_SESSION['user_id']) ) {
    session_destroy();
    setcookie('PHPSESSID', '', 1);
    include 'm_form_auth.php';
    exit;
  }

  if ( isset($_SESSION['user_id']) ) {
    my_session_verif();
    my_session_regenerate_id();
    if ( $_SESSION['user_agent'] !== $_SERVER['HTTP_USER_AGENT'] || $_SESSION['user_ip'] !== $_SERVER['REMOTE_ADDR'] || $_SESSION['user_is_admin'] !== 1 ) {
      session_destroy();
      setcookie('PHPSESSID', '', 1);
      header('HTTP/1.1 403 Forbidden');
      exit;
    }
  }






?>