var simpleFileWidget = new FileWin(200, 'file-win__popup', 'simple-file-widget');

//Конструктор-класс для секции с файлами
function FileSection(obj) {
    this.$obj = $(obj); //Объект секции с файлами
    this.$target = this.$obj.find('.vert-file__img, .vert-file__name-text'); //Объекты элементов при нажатии на которые происходит генерация окна с файлом
    this.$fileNames = this.$obj.find('.vert-file__name'); //Тайтл файла
    this.dataSearchIsChange = 0; //Переменная показывающая изменялись ли поля в блоке form. (0 - не изменялись, 1 - изменялись)
    // this.objSelector = obj; ------ Не уверен насчёт использования данной переменной, но похоже, она нигде не используется, если не будет выявлено ошибок работы, переменную удалить

    this.$fileNames.each(function () { //Перебирает тайтлы всех файлов, устанавливает построчное обрезание текста спомощью репозитория clamp.js
        $clamp(this, {clamp: 2});
    });

    var $module = this.$obj.find('.vert-file__tags');

    $module.each(function (index, el) { //Устанавливаем построчное обрезание текста на блоках с категориями
        $clamp(this, {clamp: 2});
    });
}

FileSection.prototype.launch = function () { //Запускает Функции коструктора
    var self = this;

    //Обработчик для события изменения селекта с категориями
    $('#form__select').on(
        'change',
        function () {
            console.log('ch');
            if (!(+self.dataSearchIsChange)) { //Если переменная показывающая изменялись ли поля в блоке form равно нулю, то блок ниже будет выполняться
                $('#form').attr('data-search-is-change', '1'); //Ставит в атрибут form значение означающее что поля в form изменялись
                self.dataSearchIsChange = 1; //Переменная показывающая изменялись ли поля получает значение 1 (значит изменялись)
            }
        }
    );

    //Обработчик для события изменения поля поиска
    $('#form__search-input').on(
        'change',
        function () {
            console.log('ch');
            if (!(+self.dataSearchIsChange)) { //Если переменная показывающая изменялись ли поля в блоке form равно нулю, то блок ниже будет выполняться
                $('#form').attr('data-search-is-change', '1'); //Ставит в атрибут form значение означающее что поля в form изменялись
                self.dataSearchIsChange = 1; //Переменная показывающая изменялись ли поля получает значение 1 (значит изменялись)
            }
        }
    );

    //Обработчик клика по submit
    $('#form__submit').on(
        'click',
        function () {
            event.preventDefault(); //Отменяет стандартное поведение при событии
            $('#form__search-input').blur(); //Блюрит поле поиска, нужно чтобы на поле сработало событие change
            $('#form__page').val('1'); //Ставит скрытому input'у с номером страницы первый номер страницы
            $('#form').submit(); //Запускает событие submit для формы
        }
    );

    this.addDefHandler(); //Ставим стандартные обработчики событий
}

FileSection.prototype.addDefHandler = function () {
    var self = this;

    this.$target.on( //Обработчик на таргетированные элементы (значение см.выше)
        'click',
        function () {
            self.defFileHandler(event.currentTarget);
        }
    );
}

FileSection.prototype.defFileHandler = function (target) {
    var fileId = $(target).closest('.vert-file').attr('data-file-id'); //Сохраняет id файла

    this.createWinFile(fileId);
}


FileSection.prototype.createWinFile = function (fileId) {
    var self = this;

    $.post(
        '/ajax-handlers/get-file.php',
        'fid=' + fileId,
        function (result) {
            console.log(result);

            try {
                if (result === 'NoId') {
                    alert('Не удалось найти файл, перезагрузите страницу');
                } else if (result === 'NoQuery') {
                    alert('Ошибка запроса');
                } else if (result) {
                    var result = JSON.parse(result); //Запись полученых данных
                    simpleFileWidget.openWidget(result); //Создаёт виджет с файлом
                }
            } catch (err) {
                alert('Ошибка при загрузке файла');
                console.log(err);
            }
        }
    );
}

FileSection.prototype.removeDefHandler = function () {
    this.$target.off('click');
}



