function Menu(obj, animDuration, butShow, butHide, menuItems, itemAnimDuration) { //Конструктор-класс всплывающего меню
    PopupWindow.apply(this, arguments);
    this.$butHide = $(butHide); //Кнопка для скрытия меню. Находиться в рядом с самим меню
    this.$butShow = $(butShow); //Кнопка для показа меню. Находиться в хэдере
    this.$menuItems = $(menuItems); //Разделы меню
    this.itemAnimDuration = itemAnimDuration;//Время анимации одного раздела меню
    this.itemAnimDelay = this.animDuration - this.itemAnimDuration; //Задержка анимации разделов меню после анимации всплытия самого меню
}


//Древо наследования: Menu -> PopupWindow -> Function
Menu.prototype = Object.create(PopupWindow.prototype);
Menu.prototype.constructor = Menu;

Menu.prototype.launch = function () { //Функция запускающая Меню
    var self = this;

    this.$butShow.on(
        'click',
        function () {
            if (self.$obj.attr('data-status') === 'hide') { //Проверка статуса меню вида: видно/скрыто
                self.active(); //Активация окна

                var i = 0; // пременная-итератор для интервала
                setTimeout(function () { //Задержка для анимации разделов меню после анимации всплытия самого меню
                    var interval = setInterval(function () { //Интервал между анимциями разделов меню. Функция анимирует разделы по-очереди с интервалом заданым itemAnimDuration
                        var $currentItem = self.$menuItems.eq(i); //Сохранение в переменную текущего раздела в очереди
                        $currentItem.addClass('menu__item_show'); //Добавление класса с анимацией
                        i++; //Инкремент итератора
                        if (i >= self.$menuItems.length) { //Если разделы кончились, то происходит удаление интервала и прекращение добавления классов
                            clearInterval(interval);
                        }
                    }, self.itemAnimDuration);
                }, self.itemAnimDelay)
            }

            $(window).on(
                'keyup',
                function (event) {
                    console.log(event.which);
                    if (event.keyCode === 27) {
                        if (self.$obj.attr('data-status') === 'show') { //Проверка статуса меню вида: видно/скрыто
                            $(window).off('keyup');
                            self.deactive(); //Деактивация окна

                            self.$menuItems.removeClass('menu__item_show');//Удаление классов с разделов
                        }
                    }
                });
        }
    );

    this.$butHide.on(
        'click',
        function () {
            if (self.$obj.attr('data-status') === 'show') { //Проверка статуса меню вида: видно/скрыто
                self.deactive(); //Деактивация окна
                self.$obj.attr('data-status', 'hide'); //Изменение статуса окна на: скрыто

                self.$menuItems.removeClass('menu__item_show');//Удаление классов с разделов
            }
        }
    );
}
