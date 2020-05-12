function TextRedactor(selector, callback) { //Конструктор-класс редактора текста
    this.$objs = $(selector); //Объект редактируемых элементов
    this.selector = selector; //Сохранение селектора редактируемых элементов
    this.funcAddInDB = callback;
}

TextRedactor.prototype.removeRedactor = function (editObj, actsBlock) { //удаление тектового редактора
    var $editObj = $(editObj); //объект элемента который редактировался

    if ($editObj.attr('contenteditable') === 'true') {
        $(actsBlock).remove(); //Удаление иконок с действиями вида: принять изменения/отменить изменения
        $editObj.attr('contenteditable', 'false'); //отключение функции редактирования текста
        this.addHandler(); //Назначение обработчика редактирования текстов для редактируемых текстов
    }
}


TextRedactor.prototype.createRedactor = function (editObj, iconEdit) { //Функция создающая текстовый редактор для текста который сейчас хотят отредактировать
    var self = this;
    var $editObj = $(editObj); //Объект текста который сейчас редактируется
    var initialValObj = $editObj.html(); //Сохранение изначального содержимого редактируемого текста

    if ($editObj.attr('contenteditable') === 'false') { //Проверка не яляется ли текст который хотят отредактировать уже редактируемым

        $editObj.attr('contenteditable', 'true'); //Добавление тексту который хотят отредактировать возможности редактирования
        this.removeHandler(); //Удаление обработчика со всех текстов которые могут редактироваться

        var $actsBlock = $('<div>', {
            class: 'text-redactor__icons-block',

            append: $('<div>', {
                class: 'icon icon_size_s icon_theme_darkgreen',
                title: 'accept',
                "data-act": 'accept',

                on: {
                    click: function () {
                        var valueAccept = $editObj.html(); //Новое значение изменённого текста
                        self.removeRedactor($editObj, $actsBlock); //Удаление редактора

                        var colTable = $editObj.attr('data-col');
                        var noteId = $editObj.closest('.text-redactor__parent').attr('data-id');

                        if (colTable) {
                            self.funcAddInDB(valueAccept, colTable);
                        } else if (noteId) {
                            self.funcAddInDB(valueAccept, noteId);
                        } else {
                            alert('Ошибка ввода. Перезагрузите страницу');
                            console.log('text redactor error');
                        }
                    }
                },

                append: $('<img>', {
                    class: 'icon__icon-img',
                    src: '/images/icon/icon-accept-white.png',
                    alt: 'принять'
                })
            })
                .add($('<div>', {
                    class: 'icon icon_size_s icon_theme_darkgreen',
                    title: 'cancel',
                    "data-act": 'cancel',

                    on: {
                        click: function () {
                            self.removeRedactor($editObj, $actsBlock); //Удаление редактора
                            $editObj.html(initialValObj); //Возврат редактируемому тексту исходного значения
                        }
                    },

                    append: $('<img>', {
                        class: 'icon__icon-img',
                        src: '/images/icon/icon-exit-big-white.png',
                        alt: 'отменить'
                    })
                }))
        }).insertAfter($editObj); //Вставка блока иконок с действиями вида: принять изменения/отменить изменения. Сохранение вставленного блока иконок в переменную
    }
}


TextRedactor.prototype.createIcon = function (obj) { //Функция создающая иконку редактирования радом с тектом который можно редактировать
    var self = this;
    var $editObj = $(obj); //Объект редактируемого текста которому рядом с которым будет создаваться иконка редактирования

    $('<div>', {
        class: 'icon icon_size_s icon_theme_darkgreen text-redactor__edit-icon',

        on: {
            click: function () {
                self.createRedactor($editObj, this);
            }
        },

        append: $('<img>', {
            class: 'icon__icon-img',
            src: '/images/icon/icon-edit-white.png',
            alt: 'редактировать'
        })
    }).insertAfter($editObj);

    var editObjParentPosition = $editObj.parent().css('position'); //Проверка режима позиционирования родительского элемента

    if (editObjParentPosition !== 'absolute' && editObjParentPosition !== 'fixed') { //Если позиционирование не абсолютное и не фиксированное, то ставим относительное позиционирование
        $editObj.parent().css('position', 'relative');
    }
}


//Функция добавляющая обработчик на эелементы которые можно редактировать; так же функция делает видимыми иконки редактирования. Обработчик запускает функцию создания иконок редактирования при наведении
TextRedactor.prototype.addHandler = function () {
    var self = this;
    this.$objs.siblings('.text-redactor__edit-icon').css('display', 'flex'); //Показ иконки редактирования текста, которая запускает редактор текст

    this.$objs.on(
        'mouseover',
        function () {
            if (!$(this).siblings('.text-redactor__edit-icon')[0]) { //Проверка есть ли рядом с текстом, который можно редактировать, иконки редактирования, если иконки нет, то функция создаёт её
                self.createIcon(this); //Делаем иконку рядом с ред.текстом
            }
        }
    );
}


//Функция убирающая обработчик с эелементов которые можно редактировать; так же функция делает невидимыми иконки редактирования.
TextRedactor.prototype.removeHandler = function () {
    this.$objs.siblings('.text-redactor__edit-icon').css('display', 'none'); //Скрытие иконки редактирования текста, которая запускает редактор текста
    this.$objs.off(); // Удаление обработчика c редактируемых элементов
}

TextRedactor.prototype.launch = function () { //Запуск редактора текстов
    var self = this;
    this.addHandler();
}