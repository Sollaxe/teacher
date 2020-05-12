function PopupWindow(obj, animDuration) { //Конструктор-класс для всплывающих окон (не виджетов)
    this.$obj = $(obj);
    this.animDuration = animDuration; //Хранит количество времени за которое происходит анимация
}

PopupWindow.prototype.active = function () { //Делает окно (и виджет, и обычное окно) активным, запрещает скролл body
    $('body').css('overflow-y', 'hidden'); //Запрет скролла для body
    this.$obj.css('display', 'flex'); //Делает видимым контейнер-popup
    this.$obj.removeClass('popup_hide'); //Удаляет класс который делал контейнер невидимым
    this.$obj.addClass('popup_show'); //Добавляет класс видимого контейнера-popup
    this.$obj.attr('data-status', 'show'); //Изменение статуса окна на: видно
}

PopupWindow.prototype.deactive = function () { //Делает окно (и виджет, и обычное окно) неактивным, разрешает скролл body
    var self = this;
    this.$obj.removeClass('popup_show');//Удаляет класс видимого popup-контейнера
    this.$obj.addClass('popup_hide');//Добавляет класс невидимого popup-контейнера
    this.$obj.attr('data-status', 'hide'); //Изменение статуса окна на: скрыто

    setTimeout(function () {                  //Ставит задержку, для скрытия окна и разрешению скролла body, равную количеству времени за которое происходит анимация
        $('body').css('overflow-y', 'auto'); //Разрешение скролла для body
        self.$obj.css('display', 'none'); //Делает невидимым popup-контейнер
    }, this.animDuration);
}


function RecessivePopupWindow(animDuration, objName) { //Конструктор-класс для всплывающих окон-виджетов, т.е. окон которые генерируются из Js кода в DOM, но при этом они удаляются
    this.animDuration = animDuration;
    this.objName = objName;
}

//Если говорить о производительности, то это лучше чем просто создавать такие окна сразу в html, но хуже как виджет, потому что они удаляются и приходится их снова создавать
//Надо обязательно учесть это в будующих проектах, но сейчас поздно это исправлять, так как на такой логике создания виджетов построены все виджеты на сайте
//Чтобы исправить эту проблему, придётся перебирать весь код заново, либо вообще переписывать

//Данный класс изменяет только логику скрытия окон, точнее он их просто удаляет после их скрытия, создавался он только с этой целью


//Дерево наследования: RecessivePopupWindow -> PopupWindow -> Function
RecessivePopupWindow.prototype = Object.create(PopupWindow.prototype);
RecessivePopupWindow.prototype.constructor = RecessivePopupWindow;


RecessivePopupWindow.prototype.createPopup = function () {   //Вставляет контейнер для всплывающих виджетов в начало body
    // this.$obj = $('<div data-status="show" class="popup popup_show"></div>').prependTo('.body');
    this.$obj = $('<div>', {
        class: 'popup popup_show',
        "data-status": 'show'
    }).prependTo($('body'));

    return this.$obj; //Возвращает объект контейнера (сомнительная функция, ибо нигде не нашла применеия, надо подумать об её удалении, но возможно она может где-нибудь пригодиться)
}

RecessivePopupWindow.prototype.deactive = function () { //Делает окно (виджет) неактивным и удаляет его
    var self = this;
    PopupWindow.prototype.deactive.apply(this, arguments); //Вызывает функцию деактивации окна из PopupWindow в данном контексте, т.е. просто делает его неактивным, но пока не удаляет

    setTimeout(function () { //В данном месте он уже удаляет окно, с задержкой на анимацию деактивации самого всплывающего окна
        self.$obj.remove();
    }, this.animDuration);
}

RecessivePopupWindow.prototype.active = function () { //Делает окно (виджет) активным, запрещает скролл body
    this.createPopup(); //Создание контейнера popup или по-другому это this.$obj
    this.$obj.addClass(this.objName); //Задание контейнеру класса соответсующего контейнера виджета
    PopupWindow.prototype.active.apply(this, arguments); //Вызов функции активизации окна из PopupWindow в данном контексте
}


function WidgetPopup(animDuration, objName, widgetId) {
    RecessivePopupWindow.apply(this, arguments);
    this.widgetId = widgetId;
}

//Дерево наследования: WidgetPopup -> RecessivePopupWin -> PopupWin -> Function
WidgetPopup.prototype = Object.create(RecessivePopupWindow.prototype);
WidgetPopup.prototype.constructor = WidgetPopup;


WidgetPopup.prototype.createWidget = function () {
    RecessivePopupWindow.prototype.active.apply(this, arguments);
    var self = this;
    this.$obj.attr('id', this.widgetId);
    console.log(this.widgetId);
    this.createWidgetContent();
}

WidgetPopup.prototype.showWidget = function () {
    PopupWindow.prototype.active.apply(this, arguments);
    var self = this;
}

WidgetPopup.prototype.hideWidget = function () {
    PopupWindow.prototype.deactive.apply(this, arguments);
}

WidgetPopup.prototype.removeWidget = function () {
    RecessivePopupWindow.prototype.deactive.apply(this, arguments);
}

WidgetPopup.prototype.openWidget = function (dataObj) {
    var self = this;
    this.dataWidget = dataObj;

    if (!this.$obj) {
        this.createWidget();
    } else {
        this.changeWidgetContent();
        this.showWidget();
    }

    $(window).on(
        'keyup',
        function (event) {
            if (event.keyCode === 27) {
                $(window).off('keyup');
                self.hideWidget();
            }
        });
}


//Конструктор-класс для виджетов-заметок из календаря. На стадии разработки back-end'а нужно будет переделать логику получения данных заметки
function NotesWin(animDuration, objName, widgetId) {
    WidgetPopup.apply(this, arguments);
}


//Древо наследования: NotesWin -> RecessivePopupWindow -> PopupWindow -> Function
NotesWin.prototype = Object.create(WidgetPopup.prototype);
NotesWin.prototype.constructor = NotesWin;


NotesWin.prototype.createWidgetContent = function () { //Функция создающая виджет с заметкой
    var self = this;

    //html исходник
    // <div class="note note_size_m note_theme_softgreen">
    //   <div class="note__head">
    //     <img class="note__exit" src="/images/icon/icon-exit-white.png" alt="">
    //     <div class="note__title-block text text_font_roboto-regular">
    //       <span class="note__title text text_size_xxl">Заметки</span>
    //       <span class="note__pubdate text text_size_xs">'+ this.dataNote.date +'</span>
    //     </div>
    //   </div>
    //   <div data-id="'+ this.dataNote.note_id +'" class="note__body">
    //     <div class="note__text text text_font_sans-regular text_size_xs">'+ this.dataNote.note_text +'</div>
    //   </div>
    // </div>

    this.$noteObjParent = $('<div>', {
        class: 'note note_size_m note_theme_softgreen',

        append: $('<div>', {
            class: 'note__head',

            append: $('<img>', {
                class: 'note__exit',
                src: '/images/icon/icon-exit-white.png',
                alt: 'Закрыть',

                on: {
                    click: function () {
                        self.hideWidget();
                    }
                }
            }).add($('<div>', {
                class: 'note__title-block text text_font_roboto-regular',

                append: $('<span>', {
                    class: 'note__title text text_size_xxl',
                    text: 'Заметки'
                }).add($('<span>', {
                    class: 'note__pubdate text text_size_xs',
                    text: this.dataWidget.date
                }))
            }))

        }).add($('<div>', {
            class: 'note__body',
            "data-id": this.dataWidget.note_id,

            append: $('<div>', {
                class: 'note__text text text_font_sans-regular text_size_xs',
                html: this.dataWidget.note_text
            })
        }))
    }).prependTo(this.$obj);

    this.$notePubdateObj = this.$noteObjParent.find('.note__pubdate');
    this.$noteBodyObj = this.$noteObjParent.find('.note__body');
    this.$noteTextObj = this.$noteObjParent.find('.note__text');
}

NotesWin.prototype.changeWidgetContent = function () {
    this.$notePubdateObj.text(this.dataWidget.date);
    this.$noteBodyObj.attr('data-id', this.dataWidget.note_id);
    this.$noteTextObj.html(this.dataWidget.note_text);
}


//Конструктор-класс виджета с файлом. Надо изменить логику получения данных файла. Сделать получение данных из БД
function FileWin(animDuration, objName, /*dataFile*/ widgetId) {
    WidgetPopup.apply(this, arguments);
    // this.dataFile     = dataFile; //Объект с данными о файле
    // this.categorieArr = this.dataFile.categorie_arr; //Массив с категориями файла
    this.getVarStr = window.location.search;
}

//Древо наследования: FileWin -> RecessivePopupWindow -> PopupWindow -> Function
FileWin.prototype = Object.create(WidgetPopup.prototype);
FileWin.prototype.constructor = FileWin;


FileWin.prototype.createWidgetContent = function () { //Функция создающая виджет с файлом
    var self = this;

    // <div class="file-win file-win_size_m file-win_theme_darkblue">
    //   <img class="file-win__exit" src="/images/icon/icon-exit-white.png" alt="">
    //   <div class="file-win__image" style="background-image: url(\''+ this.dataFile.path_image +'\');"></div>
    //   <div class="file-win__body">
    //     <div class="file-win__name-file">
    //       <span title="'+ this.dataFile.title_file +'" class="file-win__name-file-text text text_font_sans-regular text_size_s">'+ this.dataFile.title_file +'</span>
    //     </div>
    //     <div class="file-win__info text_font_sans-light text_size_xs">
    //       <span class="text file-win__file-size">Размер: '+ this.dataFile.size_file +' Кб</span>
    //       <span class="text file-win__pubdate">'+ this.dataFile.pubdate +'</span>
    //     </div>
    //     <div class="file-win__tags text_font_sans-light text_size_xs">
    //     </div>
    //     <div class="file-win__file-desc">
    //       <p title="'+ this.dataFile.description +'" class="file-win__file-desc-text text text_font_sans-regular text_size_xxs">'+ this.dataFile.description +'</p>
    //     </div>
    //     <a href="'+ this.dataFile.path_file +'" class="file-win__download-file button button_size_s button_theme_green button_style_img link link_theme_inherit link_dis_inl-block">
    //       <div class="button__container">
    //         <img class="button__image" src="/images/icon/icon-upload-white.png">
    //         <span class="text_font_sans-light text_size_s">Скачать</span>
    //       </div>
    //     </a>
    //   </div>
    // </div>


    this.$fileWinParent = $('<div>', {
        class: 'file-win file-win_size_m file-win_theme_darkblue',

        append: $('<img>', {
            class: 'file-win__exit',
            src: '/images/icon/icon-exit-white.png',
            alt: 'Закрыть',

            on: {
                click: function () {
                    self.hideWidget();
                }
            }
        }).add($('<div>', {
            class: 'file-win__image',
            css: {
                backgroundImage: "url('" + this.dataWidget.path_image + "')"
            }
        })).add($('<div>', {
            class: 'file-win__body',

            append: $('<div>', {
                class: 'file-win__name-file',

                append: $('<span>', {
                    class: 'file-win__name-file-text text text_font_sans-regular text_size_s',
                    title: this.dataWidget.title_file,
                    text: this.dataWidget.title_file
                })
            }).add($('<div>', {
                class: 'file-win__info text_font_sans-light text_size_xs',

                append: $('<span>', {
                    class: 'text file-win__file-size',
                    text: 'Размер: ' + this.dataWidget.size_file + ' Кб'
                }).add($('<span>', {
                    class: 'text file-win__pubdate',
                    text: this.dataWidget.pubdate
                }))
            })).add($('<div>', {
                class: 'file-win__tags text_font_sans-light text_size_xs'
            })).add($('<div>', {
                class: 'file-win__file-desc',

                append: $('<p>', {
                    class: 'file-win__file-desc-text text text_font_sans-regular text_size_xxs',
                    title: this.dataWidget.description,
                    text: this.dataWidget.description
                })
            })).add($('<a>', {
                href: this.dataWidget.path_file,
                class: 'file-win__download-file button button_size_s button_theme_green button_style_img link link_theme_inherit link_dis_inl-block',

                append: $('<div>', {
                    class: 'button__container',

                    append: $('<img>', {
                        class: 'button__image',
                        src: '/images/icon/icon-upload-white.png'
                    }).add($('<span>', {
                        class: 'text_font_sans-light text_size_s',
                        text: 'Скачать'
                    }))
                })
            }))
        }))
    }).prependTo(this.$obj);

    this.$imageFileObj = this.$fileWinParent.find('.file-win__image');
    this.$titleFileObj = this.$fileWinParent.find('.file-win__name-file-text');
    this.$fileSizeObj = this.$fileWinParent.find('.file-win__file-size');
    this.$filePubdateObj = this.$fileWinParent.find('.file-win__pubdate');
    this.$fileDescObj = this.$fileWinParent.find('.file-win__file-desc-text');
    this.$filePathObj = this.$fileWinParent.find('.file-win__download-file');
    this.$fileTagsBlockObj = this.$fileWinParent.find('.file-win__tags');

    this.createCategorieList(this.dataWidget.categorie_arr);

    history.replaceState({fileId: this.dataWidget.file_id}, '', '?fid=' + this.dataWidget.file_id);

    var moduleDesc = this.$obj.find('.file-win__file-desc-text')[0]; //DOM-элемент описания файла
    $clamp(moduleDesc, {clamp: '120px'}); //Обрезания описания по высоте, с помощью репозитория clamp.js

    var $moduleTags = this.$fileTagsBlockObj[0]; //Сохранение объекта-контейнера для тэгов
    $clamp($moduleTags, {clamp: 2});
}

FileWin.prototype.changeWidgetContent = function () {
    this.$imageFileObj.css('backgroundImage', "url('" + this.dataWidget.path_image + "')");

    this.$titleFileObj.attr('title', this.dataWidget.title_file);
    this.$titleFileObj.text(this.dataWidget.title_file);

    this.$fileSizeObj.text('Размер: ' + this.dataWidget.size_file + ' Кб');
    this.$filePubdateObj.text(this.dataWidget.pubdate);

    this.$fileDescObj.attr('title', this.dataWidget.description);
    this.$fileDescObj.text(this.dataWidget.description);

    this.$filePathObj.attr('href', this.dataWidget.path_file);

    this.$fileTagsBlockObj.children().remove();
    this.createCategorieList(this.dataWidget.categorie_arr);

    history.replaceState({fileId: this.dataWidget.file_id}, '', '?fid=' + this.dataWidget.file_id);
}

FileWin.prototype.createCategorieList = function (catArr) {
    var categorieArr = catArr;

    for (var i = 0; (i + 1) <= categorieArr.length; i++) {
        $('<a>', {
            href: '/metworks.php?cat=' + categorieArr[i].categorie_id,
            class: 'file-win__file-tag text link link_hv_underline link_theme_inherit',
            text: categorieArr[i].categorie_name
        }).appendTo(this.$fileTagsBlockObj).after(' ');
    } //Вставка категорий файла

}


FileWin.prototype.hideWidget = function () {
    WidgetPopup.prototype.hideWidget.apply(this, arguments);

    if (this.getVarStr && this.getVarStr.indexOf('?fid=') === -1) {
        history.replaceState(null, '', this.getVarStr);
    } else {
        history.replaceState(null, null, window.location.pathname);
    }
}