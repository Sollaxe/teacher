<?php
  if ( isset($_GET["fid"]) ) {
    echo '<script>$(document).ready(function(){fileSection.createWinFile('.$_GET["fid"].');});</script>';
  }
?>


