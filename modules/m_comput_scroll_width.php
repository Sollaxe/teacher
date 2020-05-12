<script>
  var globalParam = {};
  var div = document.createElement('div');
  div.style.overflowY = 'scroll';
  div.style.width = '50px';
  div.style.height = '50px';
  div.style.visibility = 'hidden';
  document.body.appendChild(div);
  globalParam.scrollWidth = div.offsetWidth - div.clientWidth;
  document.body.removeChild(div);
  $('head').append('<style>.outer-container {padding-right:'+ globalParam.scrollWidth +'px}</style>');
</script>