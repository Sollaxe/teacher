var widgetCatRedactor = new CatRedactor(200, 'cat-redactor__popup', 'widget-cat-redactor'); //Создание объекта виджета-редактора категорий

//Конструктор-класс секции с файлами в админ панели. Создан, в первую очередь, для дополнения функционала обычного конструктора секции с файлами. Добавляет функции редактирования файловой системы сайта
function AdminFileSection(obj) {
    FileSection.apply(this, arguments);
    this.$target = this.$obj.find('.vert-file__name-text');
}

//Дерево наследования: AdminFileSection -> FileSection -> Function
AdminFileSection.prototype = Object.create(FileSection.prototype);
AdminFileSection.prototype.constructor = AdminFileSection;

//Метод для обновления изменённого файл-блока
AdminFileSection.prototype.funcUpdateVertFile = function (objDataUpdFile) {
    var objDataUpdFile = objDataUpdFile; //Объект с данными файл-блока

    var $updFile = this.$obj.find('.vert-file[data-file-id=' + objDataUpdFile.file_id + ']');
    var $fileImg = $updFile.find('.vert-file__img');
    var $titleFile = $updFile.find('.vert-file__name-text');
    var $containerTags = $updFile.find('.vert-file__tags');

    $titleFile.html(objDataUpdFile.title_file); //Изменение имени файл-блока
    $fileImg.attr('style', 'background-image: url(' + objDataUpdFile.image_path + ');'); //Изменение картинки файл-блока

    $containerTags.children().remove(); //Удаление категорий файл-блока

    //Перебор массива с новыми категориями и добавление их в обновлённый файл-блок
    objDataUpdFile.categorieArr.forEach(function (item, index, arr) {
        // $containerTags.append('<a class="vert-file__tag link link_undecorate link_hv_underline link_theme_inherit" href="/metworks.php?cat='+ item.categorie_id +'">' + item.categorie_name + '</a>');

        $('<a>', {
            href: '/metworks.php?cat=' + item.categorie_id,
            class: 'vert-file__tag link link_undecorate link_hv_underline link_theme_inherit',
            text: item.categorie_name
        }).appendTo($containerTags).after(' ');
    });
}

//Метод для добавления нового файл-блока
AdminFileSection.prototype.funcAddVertFile = function (objDataUpdFile) {
    var self = this;
    var objDataUpdFile = objDataUpdFile; //Объект с данными файл-блока

    var $fileBlock = this.$obj.find('.file-section__file-block'); //Секция с файл-блоками
    var $blockAfterInsert = $fileBlock.find('.add-file'); //Объект после которого надо вставить новый файл-блок

    // var $addedBlock = $('\
    //   <div data-file-id="' + objDataUpdFile.id_file + '" class="vert-file vert-file_size_m vert-file_theme_white file-section__file text_font_sans-regular">\
    //     <div class="vert-file__img" style="background-image: url(\'' + objDataUpdFile.image_path + '\');"></div>\
    //     <div class="vert-file__content">\
    //       <div class="vert-file__name text_size_xxs">\
    //         <span title="" class="vert-file__name-text text text_hv-cursor_pointer">' + objDataUpdFile.title_file + '</span>\
    //       </div>\
    //       <div class="vert-file__info text text_size_us">\
    //         <div class="vert-file__tags">\
    //         </div>\
    //         <div class="vert-file__subinfo">\
    //           <span class="text vert-file__file-size">Размер: ' + objDataUpdFile.file_size + 'Кб</span>\
    //           <span class="text vert-file__file-pubdate">'+ objDataUpdFile.pubdate + '</span>\
    //         </div>\
    //       </div>\
    //     </div>\
    //   </div>\
    // ').insertAfter($blockAfterInsert); //Вставка нового файл блока с полученными данными

    var $addedBlock = $('<div>', {
        class: 'vert-file vert-file_size_m vert-file_theme_white file-section__file text_font_sans-regular',
        "data-file-id": objDataUpdFile.id_file,

        append: $('<div>', {
            class: 'vert-file__img',
            css: {
                backgroundImage: "url('" + objDataUpdFile.image_path + "')",
            },

            on: {
                mouseover: function () {
                    self.handlerToCreateEditIcon(event.currentTarget);
                }
            }
        })
            .add($('<div>', {
                class: 'vert-file__content',

                append: $('<div>', {
                    class: 'vert-file__name text_size_xxs',

                    append: $('<span>', {
                        class: 'vert-file__name-text text text_hv-cursor_pointer',
                        text: objDataUpdFile.title_file,

                        on: {
                            click: function () {
                                self.defFileHandler(event.currentTarget);
                            }
                        }
                    })
                })
                    .add($('<div>', {
                        class: 'vert-file__info text text_size_us',

                        append: $($('<div>', {
                            class: 'vert-file__tags'
                        }))
                            .add($('<div>', {
                                class: 'vert-file__subinfo',

                                append: $('<span>', {
                                    class: 'text vert-file__file-size',
                                    text: 'Размер ' + objDataUpdFile.file_size + 'Кб'
                                })
                                    .add($('<span>', {
                                        class: 'text vert-file__file-pubdate',
                                        text: objDataUpdFile.pubdate
                                    }))
                            }))
                    }))
            }))
    }).insertAfter($blockAfterInsert);

    var $containerTags = $addedBlock.find('.vert-file__tags'); //Блок с категориями файл-блока

    $clamp($containerTags[0], {clamp: 2});

    //Вставка категорий файл-блока
    objDataUpdFile.categorieArr.forEach(function (item, index, arr) {
        // $containerTags.append('\
        //   <a class="vert-file__tag link link_undecorate link_hv_underline link_theme_inherit" href="/metworks.php?cat='+ item.categorie_id +'">' + item.categorie_name + '</a>\
        // ');
        $('<a>', {
            class: 'vert-file__tag link link_undecorate link_hv_underline link_theme_inherit',
            href: '/metworks.php?cat=' + item.categorie_id,
            text: item.categorie_name
        }).appendTo($containerTags).after(' ');
    });

    //Перезапись объекта с элементами при нажатии на которые происходит вызов окна файл-блока
    this.$target = this.$obj.find('.vert-file__name-text');
}


AdminFileSection.prototype.launch = function () { //Запускает функционал секции с файлами
    var self = this;

    FileSection.prototype.launch.apply(this, arguments); //Перенимает функционал обычной секции с файлами

    if (this.$obj.attr('data-admin') === 'true') { //проверяет, по атрибуту, является ли секция с файлами - админ-секцией с файлами

        this.addHandlerFiles();
    }

    this.$obj.find('.search-block__categorie-redactor-but').on( //Назначение обработчика для кнопки вызывающей редактор категорий
        'click',
        function () {
            widgetCatRedactor.openWidget(); //Создание самого виджета
        }
    );


    $('#form__submit').off('click');

    //Обработчик клика по submit
    $('#form__submit').on(
        'click',
        function () {
            event.preventDefault(); //Отменяет стандартное поведение при событии
            $('#form__search-input').blur(); //Блюрит поле поиска, нужно чтобы на поле сработало событие change
            $('#form__scroll-top').val(globalParam.scrollTop); //Ставит скрытому input'у со значением верхнего скролла значение равное текущему верхнему скроллу
            $('#form__page').val('1'); //Ставит скрытому input'у с номером страницы первый номер страницы
            $('#form').submit(); //Запускает событие submit для формы
        }
    );


    //обработчик для клика на блок-кнопку вызывающего виджет для добавления файла в файловую систему сайта
    this.$obj.find('.add-file').on(
        'click',
        function () {
            var funcAddVertFileWrap = self.funcAddVertFile.bind(self); //биндит функцию к текущему контексту вызовов
            $.post(
                '/ajax-handlers/get-categories.php',
                function (result) {

                    try {
                        var catArr = JSON.parse(result); //Запись всех категорий существующих на данный момент
                        var fileAddEditor = new FileAddEditor(200, 'file-editor__popup', null, catArr, funcAddVertFileWrap); //Создание объекта виджета для добавления файла в файловую систему сайта
                        fileAddEditor.createFileAddEditor(); //Создание самого виджета
                    } catch (err) {
                        console.log(err);
                        alert('Произошла ошибка на сервере');
                    }
                }
            );
        }
    );


    var $module = this.$obj.find('.vert-file__tags'); //Сохранение объекта-контейнера для тэгов

    $module.each(function (index, el) { //Обрезание тэгов по строкам, с помощью репозитория clamp.js
        $clamp(this, {clamp: 2});
    });
}


AdminFileSection.prototype.addHandlerFiles = function () {
    var self = this;

    $('.vert-file__img').on( //Добавляем новый обработчик для картинки, который будет срабатывать при наведении на картинку
        'mouseover',
        function () {
            self.handlerToCreateEditIcon(event.currentTarget);
        }
    );
}

AdminFileSection.prototype.handlerToCreateEditIcon = function (target) {
    var self = this;
    if (!$(target).find('.vert-file__edit-screen')[0]) { //Если у блока файла уже есть блок действий с файлом, то ничего не произойдёт и обработчик ничего не сделает, а если нет блока действий, то будет следующее:

        // $(this).append('<div class="vert-file__edit-screen">\
        //   <img src="/images/icon/icon-edit-white.png" alt="" class="vert-file__edit-icon vert-file__editor-win-but">\
        //   <img src="/images/icon/icon-delete-white.png" alt="" class="vert-file__edit-icon vert-file__delete-but">\
        // </div>'); //Вставка внутрь блока-картинки блока действий с файлом

        $('<div>', {
            class: 'vert-file__edit-screen',

            append: $('<img>', {
                class: 'vert-file__edit-icon vert-file__editor-win-but',
                src: '/images/icon/icon-edit-white.png',
                alt: 'Редактировать',

                on: {
                    click: editFile
                }
            })
                .add($('<img>', {
                    class: 'vert-file__edit-icon vert-file__delete-but',
                    src: '/images/icon/icon-delete-white.png',
                    alt: 'Удалить',

                    on: {
                        click: deleteFile
                    }
                }))
        }).appendTo($(target));

        function editFile() {
            var fileId = $(this).closest('.vert-file').attr('data-file-id'); //Сохраняет id файла
            var ajaxData = 'fid=' + fileId;
            var target = $(this);

            var funcUpdateVertFileWrap = self.funcUpdateVertFile.bind(self); //Биндим функцию к текущему контексту вызовов

            $.post(
                '/ajax-handlers/get-categories.php',
                function (result) {
                    try {
                        var catArr = JSON.parse(result); //Запись всех существующих категорий
                    } catch (err) {
                        console.log(err);
                        alert('Произошла ошибка на сервере');
                        return false;
                    }

                    $.post(
                        '/ajax-handlers/get-file.php',
                        ajaxData,
                        function (result) { //result - json возвращаемый с сервера
                            console.log(result);

                            try {
                                if (result === 'NoId') {
                                    alert('Не удалось найти файл, перезагрузите страницу');
                                } else if (result === 'NoQuery') {
                                    alert('Ошибка запроса');
                                } else if (result) {
                                    var dataFile = JSON.parse(result); //Объект с информацией о файл-блоке
                                    var fileEditor = new FileEditor(200, 'file-editor__popup', dataFile, catArr, funcUpdateVertFileWrap); //Создание объекта виджета-редактора файлов для конкретного файла
                                    fileEditor.createFileEditor(); //Создание самого виджета
                                }
                            } catch (err) {
                                alert('Ошибка при загрузке файла');
                                console.log(err);
                            }
                        }
                    );
                }
            );
        }

        function deleteFile() {
            var $thisRemovingFile = $(this).closest('.vert-file'); //Удаляемый файл-блок
            var idRemovingFile = $thisRemovingFile.attr('data-file-id'); //id удаляемого файл-блока
            var confirmation = confirm('Вы действительно хотите удалить файл?'); //Проверка для пользователя

            if (confirmation) {
                $.post(
                    '/ajax-handlers/delete-file.php',
                    'fid=' + idRemovingFile,
                    function (result) {
                        console.log(result);
                        if (result === 'NoId') {
                            alert('Не удалось удалить файл');
                        } else if (+result) {
                            $($thisRemovingFile).closest('.vert-file').remove(); //Удаление файла
                        } else {
                            alert('Ошибка на сервере');
                        }
                    }
                );
            }
        }
    }
}

AdminFileSection.prototype.removeHandlerFiles = function () {
    $('.vert-file__img').off('mouseover');
}