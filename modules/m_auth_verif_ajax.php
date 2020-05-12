<?php

  require 'm_session_regenerator.php';

  if ( !isset($_SESSION['user_id']) ) {
    header('HTTP/1.1 403 Forbidden');
    exit;
  }

  if ( isset($_SESSION['user_id']) ) {
    if ( $_SESSION['user_agent'] !== $_SERVER['HTTP_USER_AGENT'] || $_SESSION['user_ip'] !== $_SERVER['REMOTE_ADDR'] || $_SESSION['user_is_admin'] !== 1 ) {
      session_start();
      session_destroy();
      setcookie('PHPSESSID', '', 1);
      header('HTTP/1.1 403 Forbidden');
      exit;
    }
  }

  my_session_ajax_verif();
  my_session_regenerate_id();


?>