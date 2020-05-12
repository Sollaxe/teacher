<?php
  function my_session_verif() {
    if ( isset($_SESSION['destroyed']) && $_SESSION['destroyed'] < time() ) {
      session_destroy();
      setcookie('PHPSESSID', '', 1);
      header("Location: http://" . $_SERVER['HTTP_HOST'] . "/?mess=sec");
      exit;
    }
  }


  function my_session_ajax_verif() {
    if ( isset($_SESSION['destroyed']) && $_SESSION['destroyed'] < time() ) {
      session_destroy();
      setcookie('PHPSESSID', '', 1);
      header("HTTP/1.1 403 Forbidden");
      exit;
    }
  }


  function my_session_regenerate_id() {
    if ( session_status() === PHP_SESSION_ACTIVE ) {
      if ( $_SESSION['nonce'] < time() - 300 ) {
        $_SESSION['destroyed'] = time();
        session_regenerate_id(false);

        $_SESSION['nonce'] = time();
        unset($_SESSION['destroyed']);
      }
    } else {
      header('HTTP/1.1 403 Forbidden');
      exit;
    }
  }
?>