<?php
  include 'modules/m_connection.php';
  include 'modules/m_func_to_work.php';
  mysqli_close($connection);

?>

<!DOCTYPE html>
<html>
  <head>
    <script src = "https://ajax.googleapis.com/ajax/libs/jquery/3.1.0/jquery.min.js"></script>
    <script>

      function Test1() {
        this.a = 10;
        this.b = 20;
      }

      Test1.prototype.constructor = Test1;

      Test1.prototype.sum = function() {
        return this.a + this.b;
      }

      Test1.prototype.showSum = function() {
        console.log(this.sum());
      }

      function Test2() {
        Test1.apply(this, arguments);
      }

      Test2.prototype = Object.create(Test1.prototype);
      Test2.prototype.constructor = Test2;

      Test2.prototype.sum = function() {
        return this.a * this.b;
      }

      var test1 = new Test1();
      var test2 = new Test2();

      test1.showSum();
      test2.showSum();

      /*
        Короче, сейчас я буду здесь излагать свою идею о том, как можно легко, просто и играючи вкрукить нормальную генерацию виджетов, чтобы они не удалялись после закрытия.
        1 - Надо сделать общий метод для всех popup, который меняет инфу в уже существующем виджете нужного типа
        2 - И прикрутить этот метод в метод активации таким образом, чтобы он вызывался если popup того же типа уже создавался и есть в DOM
        3 - Метод кстати работает просто. Чтобы не плодить и не переписывать кучу одинакого кода, мы будем в прототипах popup менять родительский метод который перезаписывает виджеты, а этот родительский метод вызывать при активации окна, предварительно проверив существование в DOM виджета того же типа
        

        Кста, Js-код выше показывает реализацию моей идеи "на пальцах", вроде наглядно получилось, да и я вкурил как это работает

        Пишу всё это, потому что могу забыть такое решение, надо ещё очень много всего переписать, поэтому за работу, потом буду кодить что написано выше
      */

    </script>
  </head>
  <body>
  </body>
</html>