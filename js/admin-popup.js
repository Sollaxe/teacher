//Вынесение объекта календаря в глобальную область видимости, для возможности обращения к методам календаря без надобности создания нового объекта календаря
var calendar;


//Конструктор-класс для виджетов-добавления заметок в календарь. На стадии арзработки back-end'а нужно будет переделать логику получения данных заметки!
function NotesWinToAdd(animDuration, objName, WidgetId) {
    NotesWin.apply(this, arguments);
}

//Дерево наследования: NotesWinToAdd -> NotesWin -> RecessivePopupWindow -> PopupWindow -> Function
NotesWinToAdd.prototype = Object.create(NotesWin.prototype);
NotesWinToAdd.prototype.constructor = NotesWinToAdd;


NotesWinToAdd.prototype.createWidgetContent = function () { //Создание виджета-добавления заметок
    var self = this;

    // this.$obj.prepend('\
    //   <div class="note note_size_m note_theme_softgreen note__add-note-win">\
    //     <div class="note__head">\
    //       <img class="note__exit" src="/images/icon/icon-exit-white.png" alt="">\
    //       <div class="note__title-block text text_font_roboto-regular">\
    //         <span class="note__title text text_size_xxl">Заметки</span>\
    //         <span class="note__pubdate text text_size_xs">'+ this.date +'</span>\
    //       </div>\
    //     </div>\
    //     <div class="note__body">\
    //       <div class="note__text text text_font_sans-regular text_size_m">Заметок на это день нет</div>\
    //       <div class="note__add-note-but text text_font_sans-regular text_size_m">\
    //         <img class="note__add-icon" src="images/icon/icon-plus-white.png" alt="">\
    //         <span class="text">Добавить запись</span>\
    //       </div>\
    //     </div>\
    //   </div>\
    // '); //Создание виджета

    this.$noteObjParent = $('<div>', {
        class: 'note note_size_m note_theme_softgreen note__add-note-win',

        append: $('<div>', {
            class: 'note__head',

            append: $('<img>', {
                class: 'note__exit',
                src: '/images/icon/icon-exit-white.png',
                alt: 'Выход',

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

            append: $('<div>', {
                class: 'note__text text text_font_sans-regular text_size_m',
                text: 'Заметок на этот день нет'
            }).add($('<div>', {
                class: 'note__add-note-but text text_font_sans-regular text_size_m',

                on: {
                    click: function () {
                        self.showNoteTextarea();
                    }
                },

                append: $('<img>', {
                    class: 'note__add-icon',
                    src: '/images/icon/icon-plus-white.png',
                    alt: ''
                }).add($('<span>', {
                    class: 'text',
                    text: 'Добавить запись'
                }))
            }))
        }))
    }).prependTo(this.$obj);

    this.$notePubdateObj = this.$noteObjParent.find('.note__pubdate');
    this.$noteBodyObj = this.$noteObjParent.find('.note__body');
    this.$butToAddNoteObj = this.$noteObjParent.find('.note__add-note-but');
}

NotesWinToAdd.prototype.changeWidgetContent = function () {
    this.$notePubdateObj.html(this.dataWidget.date);
}

NotesWinToAdd.prototype.hideWidget = function () {
    WidgetPopup.prototype.hideWidget.apply(this, arguments);

    if (this.$actionBlocks) {
        if (this.$actionBlocks.css('display') === 'flex') {
            this.hideNoteTextarea();
        }
    }
}

NotesWinToAdd.prototype.showNoteTextarea = function () {
    if (!this.$actionBlocks) {
        this.createNoteTextarea();
    } else {
        this.$butToAddNoteObj.siblings('.note__text').css('display', 'none'); //Удаление текста сообщающего что заметок на день нет
        this.$butToAddNoteObj.css('display', 'none'); //Удаление самой кнопки для добавления заметок

        this.$actionBlocks.css('display', 'flex');

        this.$noteTextarea.html('Напишите заметку');
        this.$noteTextarea.addClass('text_style_placeholder-light');
    }
}

NotesWinToAdd.prototype.hideNoteTextarea = function () {
    if (this.$actionBlocks) {
        this.$butToAddNoteObj.siblings('.note__text').css('display', 'flex'); //Удаление текста сообщающего что заметок на день нет
        this.$butToAddNoteObj.css('display', 'flex'); //Удаление самой кнопки для добавления заметок

        this.$actionBlocks.css('display', 'none');
    }
}

NotesWinToAdd.prototype.createNoteTextarea = function () {
    var self = this;

    this.$butToAddNoteObj.siblings('.note__text').css('display', 'none'); //Удаление текста сообщающего что заметок на день нет
    this.$butToAddNoteObj.css('display', 'none'); //Удаление самой кнопки для добавления заметок
    //По-сути сверху происходит очистка "тела" от блоков

    // $noteBody.append('\
    //   <div contenteditable="true" class="note__textarea text text_style_placeholder-light">Напишите заметку</div>\
    //   <div class="note__icons-block">\
    //     <div title="accept" data-act="accept" class="icon icon_size_s icon_theme_darkgreen">\
    //       <img class="icon__icon-img" src="/images/icon/icon-accept-white.png" alt="">\
    //     </div>\
    //     <div title="cancel" data-act="cancel" class="icon icon_size_s icon_theme_darkgreen">\
    //       <img class="icon__icon-img" src="/images/icon/icon-exit-big-white.png" alt="">\
    //     </div>\
    //   </div>\
    // '); //Создание редактора заметок

    this.$actionBlocks = $('<div>', {
        class: 'note__textarea text text_style_placeholder-light',
        contenteditable: 'true',
        text: 'Напишите заметку',
    }).add($('<div>', {
        class: 'note__icons-block',

        append: $('<div>', {
            class: 'icon icon_size_s icon_theme_darkgreen',
            title: 'accept',
            "data-act": 'accept',

            on: {
                click: function () {
                    self.saveNote();
                }
            },

            append: $('<img>', {
                class: 'icon__icon-img',
                src: '/images/icon/icon-accept-white.png',
                alt: 'accept'
            })
        }).add($('<div>', {
            class: 'icon icon_size_s icon_theme_darkgreen',
            title: 'cancel',
            "data-act": 'cancel',

            on: {
                click: function () {
                    self.hideNoteTextarea();
                }
            },

            append: $('<img>', {
                class: 'icon__icon-img',
                src: '/images/icon/icon-exit-big-white.png',
                alt: 'cancel'
            })
        }))
    })).appendTo(this.$noteBodyObj);

    this.$noteTextarea = this.$actionBlocks.eq(0);
    this.launchPlaceholder();
}


NotesWinToAdd.prototype.saveNote = function () {
    var self = this;
    var noteAddingText = this.$noteTextarea.html(); //Сохраняет текст из объекта в котором записывается текст заметки

    if (noteAddingText.length !== 0 && !this.$noteTextarea.hasClass('text_style_placeholder-light')) { //проверяет есть ли вообще текст и не является ли этот текст placeholder'ом
        var newNoteDate = this.dataWidget.date; //Дата новой заметки
        var arrNoteDate = newNoteDate.split('.');
        var newNoteMonthDate = arrNoteDate[1] + '.' + arrNoteDate[2]; //Месяц и год в которых находится заметка

        var fd = new FormData();
        fd.append('note_date', newNoteDate);
        fd.append('month_date', newNoteMonthDate);
        fd.append('note_text', noteAddingText);

        $.ajax({
            url: '/ajax-handlers/create-note.php',
            data: fd,
            processData: false,
            contentType: false,
            type: 'POST',
            success: function (result) {
                console.log(result);

                if (!isNaN(result)) {
                    var noteId = result //Возвраюается id добавленной ячейки

                    self.dataWidget.$rootNoteObj.attr('data-is-note', 'true'); //Добавляет исходной ячейке атрибут говорящий что в этой ячейке есть заметка
                    self.dataWidget.$rootNoteObj.attr('data-id', noteId); //Добавляет исходной ячейке id заметки
                    self.dataWidget.$rootNoteObj.addClass('calendar__cell_note'); //Добавляет исходной ячейке класс для ячейки с заметкой

                    self.dataWidget.$rootNoteObj.off('click');

                    //Данные ячейки сохраняются для того, чтобы после добавления новой заметки, обновить объекты ячеек с заметками
                    calendar.$noteCell = calendar.$obj.find('.calendar__cell_note'); //ячейки календаря в которых есть заметки

                    self.dataWidget.$rootNoteObj.on(
                        'click',
                        function () {
                            calendar.handelrDayWithNote(event.currentTarget);
                        }
                    );

                    self.hideNoteTextarea();
                    self.hideWidget();
                } else if (result === 'NoTextNote') {
                    alert('Нет данных для добавления заметки');
                } else if (result === 'NoQuery') {
                    alert('Ошибка запроса на сервере. Перезагрузите страницу');
                }
            }
        });
    }
}


NotesWinToAdd.prototype.launchPlaceholder = function () {
    var self = this;
    //Далее идёт эмуляция placeholder'а, очень интересная вещь, можно попробовать доработать её, но пока-что она остаётся такой какой есть
    //В комментариях данная эмуляция думаю не нуждается, так как, во-первых, она лёгкая в исполнении, а во-вторых потому что она не так уж и сильно относится к логике кода на этом проекте
    //Но, думаю в будущем её можно взять на вооружение как неплохой вариант, надо только довести до ума.

    this.$noteTextarea.on(
        'focus',
        function () {
            if (self.$noteTextarea.hasClass('text_style_placeholder-light')) {
                self.$noteTextarea.html('');
                self.$noteTextarea.removeClass('text_style_placeholder-light');
            }
        }
    );

    this.$noteTextarea.on(
        'blur',
        function () {
            if (self.$noteTextarea.html().length === 0) {
                self.$noteTextarea.html('Напишите заметку');
                self.$noteTextarea.addClass('text_style_placeholder-light');
            }
        }
    );
}


//Конструктор-класс для виджетов-редакторов заметок календаря. На стадии разработки back-end'а нужно будет переделать логику получения данных заметки
function EditableNotesWin(animDuration, objName, WidgetId) {
    NotesWin.apply(this, arguments);
}


//Дерево наследования: EditableNotesWin -> NotesWin -> RecessivePopupWindow -> PopupWindow -> Function
EditableNotesWin.prototype = Object.create(NotesWin.prototype);
EditableNotesWin.prototype.constructor = EditableNotesWin;

EditableNotesWin.prototype.createWidgetContent = function (noteObj) { //Создание виджета с редактированием заметок
    var self = this;

    // this.createWidget();//Активация popup

    this.$rootNoteObj = $(noteObj); //Сохранение объекта ячейки от которой исходило событие

    // calendar.removeHandler(); //Удаление обработчиков с ячеек календаря

    // this.$obj.prepend('\
    //   <div class="note note_size_m note_theme_softgreen">\
    //     <div class="note__head">\
    //       <div class="note__icons-delete-block">\
    //         <div title="delete" data-act="delete" class="icon icon_size_s icon_theme_darkgreen">\
    //           <img class="icon__icon-img" src="/images/icon/icon-delete-white.png" alt="">\
    //         </div>\
    //       </div>\
    //       <img class="note__exit" src="/images/icon/icon-exit-white.png" alt="">\
    //       <div class="note__title-block text text_font_roboto-regular">\
    //         <span class="note__title text text_size_xxl">Заметки</span>\
    //         <span class="note__pubdate text text_size_xs">'+ this.dataNote.date +'</span>\
    //       </div>\
    //     </div>\
    //     <div data-id="'+ this.dataNote.note_id +'" class="note__body text-redactor__parent">\
    //       <div contenteditable="false" class="note__text text text_font_sans-regular text_size_xs contenteditable">'+ this.dataNote.note_text +'</div>\
    //     </div>\
    //   </div>\
    // '); //Добавление содержимого виджета

    this.$noteObjParent = $('<div>', {
        class: 'note note_size_m note_theme_softgreen',

        append: $('<div>', {
            class: 'note__head',

            append: $('<div>', {
                class: 'note__icons-delete-block',

                append: $('<div>', {
                    class: 'icon icon_size_s icon_theme_darkgreen',
                    title: 'delete',
                    "data-act": 'delete',

                    on: {
                        click: function () {
                            self.deleteNote();
                        }
                    },

                    append: $('<img>', {
                        class: 'icon__icon-img',
                        src: '/images/icon/icon-delete-white.png',
                        alt: 'delete'
                    })
                })
            }).add($('<img>', {
                class: 'note__exit',
                src: '/images/icon/icon-exit-white.png',
                alt: 'Выход',

                on: {
                    click: function () {
                        self.hideWidget();
                    }
                }
            })).add($('<div>', {
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
            class: 'note__body text-redactor__parent',
            "data-id": this.dataWidget.note_id,

            append: $('<div>', {
                class: 'note__text text text_font_sans-regular text_size_xs contenteditable',
                contenteditable: 'false',
                html: this.dataWidget.note_text
            })
        }))
    }).prependTo(this.$obj);

    this.$notePubdateObj = this.$noteObjParent.find('.note__pubdate');
    this.$noteBodyObj = this.$noteObjParent.find('.note__body');
    this.$noteTextObj = this.$noteObjParent.find('.note__text');

    this.textRedactor = new TextRedactor('.note__body .contenteditable', this.updateNoteText); //Создание объекта редактора текстов и его запуск
    this.textRedactor.launch();
}

EditableNotesWin.prototype.changeWidgetContent = function () {
    this.$notePubdateObj.text(this.dataWidget.date);
    this.$noteBodyObj.attr('data-id', this.dataWidget.note_id);
    this.$noteTextObj.html(this.dataWidget.note_text);
}

EditableNotesWin.prototype.hideWidget = function () {
    this.textRedactor.removeRedactor(this.$noteTextObj, this.$noteTextObj.siblings('.text-redactor__icons-block'));
    WidgetPopup.prototype.hideWidget.apply(this, arguments);
}

//метод для обновления заметки
//updText - Обновлённый текст
//note_id - id заметки которую обновляли
EditableNotesWin.prototype.updateNoteText = function (updText, note_id) {
    var fd = new FormData();
    fd.append('id', note_id);
    fd.append('text', updText);

    $.ajax({
        url: '/ajax-handlers/update-note.php',
        data: fd,
        processData: false,
        contentType: false,
        type: 'POST',
        success: function (result) {
            console.log(result);
            if (result === 'NoData') {
                alert('Ошибка ввода данных. Перезагрузите страницу');
            } else if (result === 'NoUpd') {
                alert('Произошла ошибка при изменении заметки. Перезагрузите страницу');
            } else if (result === 'NoText') {
                alert('Текстовое поле пусто. Изменения не внесены');
            } else if (+result !== 1) {
                alert('Произошла ошибка на сервере');
            }
        }
    });
}

EditableNotesWin.prototype.deleteNote = function () {
    var self = this;
    var confirmation = confirm('Вы действительно хотите удалить заметку?'); //Проверка для пользователя

    if (confirmation) {
        var noteId = this.dataWidget.$rootNoteObj.attr('data-id'); //id удаляемой ячейки
        var ajaxNoteId = 'nid=' + noteId;
        $.post(
            '/ajax-handlers/delete-note.php',
            ajaxNoteId,
            function (result) {
                console.log(result);

                if (!isNaN(result)) {
                    console.log(self.dataWidget.$rootNoteObj);
                    self.dataWidget.$rootNoteObj.removeAttr('data-is-note'); //Удаление атрибутов присущих ячейке с заметкой
                    self.dataWidget.$rootNoteObj.removeAttr('data-id'); //Удаление атрибута с id
                    self.dataWidget.$rootNoteObj.removeClass('calendar__cell_note'); //Удаление класса присущего ячейке с заметкой

                    self.dataWidget.$rootNoteObj.off('click');

                    self.hideWidget(); //Деактивация popup
                    // self.textRedactor.removeRedactor(); //Удаление текстового редактора

                    self.dataWidget.$rootNoteObj.on(
                        'click',
                        function () {
                            calendar.handlerEmptyDays(event.currentTarget);
                        }
                    )

                    //Данные ячейки удаляются для того, чтобы после удаления заметки, обновить объекты ячеек с заметками
                    calendar.$noteCell = calendar.$obj.find('.calendar__cell_note'); //ячейки календаря в которых есть заметки
                    // calendar.addHandler(); //Назначение обработчиков для ячеек календаря
                } else if (result === 'NoId') {
                    alert('Не удалось найти заметку, перезагрузите страницу');
                } else if (result === 'NoDelete') {
                    alert('Не удалось удалить заметку');
                } else {
                    alert('Неизвестная ошибка');
                }
            }
        );
    }
}


//Конструктор-класс виджета редактора категорий
function CatRedactor(animDuration, objName) {
    WidgetPopup.apply(this, arguments);
    this.$catList = null;
}


//Дерево наследования: CatRedactor -> RecessivePopupWindow -> PopupWindow -> Function
CatRedactor.prototype = Object.create(WidgetPopup.prototype);
CatRedactor.prototype.constructor = CatRedactor;

CatRedactor.prototype.openWidget = function () {
    var self = this;


    if (!this.$obj) {
        this.createWidget();
    } else {
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

CatRedactor.prototype.createWidgetContent = function () { //Функция создающая виджет
    var self = this;

    this.$fileSection = $('.file-section'); //Секция с файлами
    this.$selectList = this.$fileSection.find('.search-block__categorie-select'); //Селект с категориями в форме
    this.$fileTagList = this.$fileSection.find('.vert-file__tags'); //Объекты содержащие категории файл-блоков

    // this.$obj.prepend('\
    //   <div class="cat-redactor cat-redactor_size_m cat-redactor_theme_softgreen">\
    //     <div class="cat-redactor__head">\
    //       <div class="cat-redactor__title">\
    //         <span class="text text_font_roboto-regular text_size_xxl">Категории</span>\
    //         <img class="cat-redactor__exit" src="/images/icon/icon-exit-white.png" alt="">\
    //       </div>\
    //       <div class="cat-redactor__add-block">\
    //         <div class="button button_style_simple button_size_m button_theme_green">\
    //           <div class="button__container">\
    //             <img class="button__image button__image_plus" src="/images/icon/icon-plus-white.png" alt="">\
    //             <span class="text text_size_s">Добавить категорию</span>\
    //           </div>\
    //         </div>\
    //       </div>\
    //     </div>\
    //     <div class="cat-redactor__body cat-redactor__list"></div>\
    //   </div>\
    // '); //Создание наполнения виджета

    $('<div>', {
        class: 'cat-redactor cat-redactor_size_m cat-redactor_theme_softgreen',

        append: $('<div>', {
            class: 'cat-redactor__head',

            append: $('<div>', {
                class: 'cat-redactor__title',

                append: $('<span>', {
                    class: 'text text_font_roboto-regular text_size_xxl',
                    text: 'Категории'
                }).add($('<img>', {
                    class: 'cat-redactor__exit',
                    src: '/images/icon/icon-exit-white.png',
                    alt: 'Выйти',

                    on: {
                        click: function () {
                            self.hideWidget();
                        }
                    }
                }))
            }).add($('<div>', {
                class: 'cat-redactor__add-block',

                append: $('<div>', {
                    class: 'button button_style_simple button_size_m button_theme_green',

                    append: $('<div>', {
                        class: 'button__container',

                        append: $('<img>', {
                            class: 'button__image button__image_plus',
                            src: '/images/icon/icon-plus-white.png',
                            alt: ''
                        }).add($('<span>', {
                            class: 'text text_size_s',
                            text: 'Добавить категорию'
                        }))
                    })
                })
            }))
        }).add($('<div>', {
            class: 'cat-redactor__body cat-redactor__list'
        }))
    }).prependTo(this.$obj);

    this.$catList = this.$obj.find('.cat-redactor__list');

    //Запрос на сервер возвращающий все категории
    $.post(
        '/ajax-handlers/get-categories.php',
        function (dataCatArr) {

            try {
                var catArr = JSON.parse(dataCatArr); //Сохранение объекта с категориями
                console.log(catArr);
            } catch (err) {
                console.log(err);
                alert('На сервере произошла ошибка');
                return false;
            }

            //Перебирание объекта с категориями и добавление их в редактор категорий
            catArr.forEach(function (item, index, arr) {

                // self.$catList.append('\
                //   <div data-cat-id="' + item["categorie_id"] + '" class="cat-redactor__list-item">\
                //     <span contenteditable="false" class="text text_font_sans-regular text_size_m">' + item["name"] + '</span>\
                //     <div class="cat-redactor__item-editor">\
                //       <div data-act="delete" class="icon icon_size_s icon_theme_darkgreen cat-redactor__editor-icon cat-redactor__item-delete">\
                //         <img class="icon__icon-img" src="images/icon/icon-delete-white.png" alt="">\
                //       </div>\
                //       <div data-act="edit" class="icon icon_size_s icon_theme_darkgreen cat-redactor__editor-icon cat-redactor__item-edit">\
                //         <img class="icon__icon-img" src="images/icon/icon-edit-white.png" alt="">\
                //       </div>\
                //     </div>\
                //   </div>\
                // ');

                $('<div>', {
                    class: 'cat-redactor__list-item',
                    "data-cat-id": item.categorie_id,

                    append: $('<span>', {
                        class: 'text text_font_sans-regular text_size_m',
                        contenteditable: 'false',
                        text: item.name
                    }).add($('<div>', {
                        class: 'cat-redactor__item-editor',

                        append: $('<div>', {
                            class: 'icon icon_size_s icon_theme_darkgreen cat-redactor__editor-icon cat-redactor__item-delete',
                            "data-act": 'delete',

                            append: $('<img>', {
                                class: 'icon__icon-img',
                                src: '/images/icon/icon-delete-white.png',
                                alt: 'Удалить'
                            })
                        }).add($('<div>', {
                            class: 'icon icon_size_s icon_theme_darkgreen cat-redactor__editor-icon cat-redactor__item-edit',
                            "data-act": 'edit',

                            append: $('<img>', {
                                class: 'icon__icon-img',
                                src: '/images/icon/icon-edit-white.png',
                                alt: 'Редактировать'
                            })
                        }))
                    }))
                }).appendTo(self.$catList);
            });

            self.addHandler(); //Вызов функции назначающей обработчики на элементы редактора
        }
    );
}

CatRedactor.prototype.createCatItemRedactor = function (thisObj) { //Создание редактора отдельно взятой категории из общего списка категорий
    var self = this;
    var $rootCatObj = $(thisObj).closest('.cat-redactor__list-item'); //Сохранение редактируемогого элемента-категории из списка категории
    var $editableText = $rootCatObj.find('.text'); //Блок с названием категории
    var initialText = $editableText.html(); //Изначальный текст категории
    var $itemEditorBlock = $(thisObj).closest('.cat-redactor__item-editor'); //Блок с иконками действий для категории (удалить/редактировать)

    // this.$obj.find('.cat-redactor__list-item .icon').off();
    this.removeHandler(); //удаление обработчиков с иконок-действий категории и кнопки добавления категории

    $editableText.attr('contenteditable', 'true'); //Задание блоку с названием категории атрибута позволяющего редактировать название категории
    $itemEditorBlock.css('display', 'none'); //Скрытие блока с иконками действий для категории

    // $editableText.after('\
    //   <div class="cat-redactor__icons-block">\
    //     <div title="accept" data-act="accept" class="icon icon_size_s icon_theme_darkgreen">\
    //       <img class="icon__icon-img" src="/images/icon/icon-accept-white.png" alt="">\
    //     </div>\
    //     <div title="cancel" data-act="cancel" class="icon icon_size_s icon_theme_darkgreen">\
    //       <img class="icon__icon-img" src="/images/icon/icon-exit-big-white.png" alt="">\
    //     </div>\
    //   </div>\
    // '); //Вставка блока с кнопками принятия или отмены редактирования

    $('<div>', {
        class: 'cat-redactor__icons-block',

        append: $('<div>', {
            class: 'icon icon_size_s icon_theme_darkgreen',
            title: 'accept',
            "data-act": 'accept',

            on: {
                click: updateCategorie
            },

            append: $('<img>', {
                class: 'icon__icon-img',
                src: '/images/icon/icon-accept-white.png',
                alt: 'Принять'
            })
        }).add($('<div>', {
            class: 'icon icon_size_s icon_theme_darkgreen',
            title: 'cancel',
            "data-act": 'cancel',

            on: {
                click: cancelUpdateCategorie
            },

            append: $('<img>', {
                class: 'icon__icon-img',
                src: '/images/icon/icon-exit-big-white.png',
                alt: 'Отменить'
            })
        }))
    }).insertAfter($editableText);


    function updateCategorie() {
        var rootCatId = $rootCatObj.attr('data-cat-id'); //Сохранение id редактируемой категории
        var iconAccept = this;
        var editedText = $editableText.html(); //Изменённый текст категории (точнее он должен быть изменён, но это не обязательно)

        var confirmation = confirm('Вы уверены что хотите изменить название тэга?'); //Ещё одна проверка для пользователя

        if (confirmation) {
            //Запрос на сервер который обновляет категорию
            $.post(
                '/ajax-handlers/update-categorie.php',
                'id=' + rootCatId + '&' + 'name=' + editedText,
                function (result) {
                    console.log(result);
                    if (!isNaN(result)) {
                        self.removeCatItemRedactor(iconAccept, $editableText, $itemEditorBlock); //Удаление редактора названия категории

                        var $editableSelectItem = self.$selectList.find('.search-block__categorie-option[value="' + rootCatId + '"]'); //Категория из селекта с категориями
                        $editableSelectItem.html(editedText); //Запись нового имени для этой категории

                        var $editableFileTags = self.$fileTagList.find('.vert-file__tag[href$="' + rootCatId + '"]'); //Категории из файл-блоков
                        $editableFileTags.html(editedText); //Обновление имени для этих категорий
                    } else if (result === 'NoData') {
                        alert('Ошибка вводимых данных. Перезагрузите страницу');
                    } else if (result === 'NoUpd') {
                        alert('Ошибка при изменении имени. Имя не было изменено')
                    }
                }
            );
        }
    }

    function cancelUpdateCategorie() {
        var confirmation = confirm('Вы уверены что хотите отменить изменения?'); //Проверка для пользователя

        if (confirmation) {
            self.removeCatItemRedactor(this, $editableText, $itemEditorBlock); //Удаление редактора названия категории
            $editableText.html(initialText); //Возвращение первоначального названия категории
        }
    }
}

CatRedactor.prototype.removeCatItemRedactor = function (thisObj, editableText, itemEditorBlock) { //Функция удаления редактора названия категорий
    $(thisObj).closest('.cat-redactor__icons-block').remove(); //Удаление блока с кнопками принятия или отмены редактирования
    editableText.attr('contenteditable', 'false'); //Запрет на изменение названия категории
    itemEditorBlock.css('display', 'flex'); //Делаем блок с иконками действий для категории видимым

    this.addHandler(); //Добавление обработчиков для иконок-действий категории и кнопки добавления категории
}

CatRedactor.prototype.removeCatItem = function (thisObj) { //Функция удаления категории из общего списка категорий
    var self = this;
    var confirmation = confirm('Вы уверены что хотите удалить категорию?'); //Проверка для пользователя

    if (confirmation) {

        var $rootCatObj = $(thisObj).closest('.cat-redactor__list-item'); //Сохранение объекта категории
        var rootCatId = $rootCatObj.attr('data-cat-id'); //Сохранение id категории

        //Запрос на сервер удаляющий категорию
        $.post(
            '/ajax-handlers/delete-categorie.php',
            'id=' + rootCatId,
            function (result) {
                if (!isNaN(result)) {
                    $rootCatObj.remove(); //Удаление объекта категории

                    var $editableSelectItem = self.$selectList.find('.search-block__categorie-option[value="' + rootCatId + '"]'); //Удалённая категория в селекте
                    $editableSelectItem.remove(); //Удаление категории из селекта

                    var $editableFileTags = self.$fileTagList.find('.vert-file__tag[href$="' + rootCatId + '"]'); //Удалённая категория в файл-блоках
                    $editableFileTags.remove(); //Удаление категории из файл-блоков

                } else if (result === 'NoDelete') {
                    alert('Не удалось удалить категорию');
                } else if (result === 'NoId') {
                    alert('Не удалось найти категорию, презагрузите страницу');
                }
            }
        );
    }
}


//Логика поиска категорий которые нужно удалить или редактировать построена таким образом
//Что мы передаём в функции как аргумент объекты кнопок на которые были установлены обработчики и на которых сейчас произошло событие
//Через target'ы(т.е. кнопок на которых произошло событие) мы находим уже и всю нужную нам информацию об элементе и делаем с ним то, что нам нужно

CatRedactor.prototype.addHandler = function () { //Функция установки обработчиков для элементов виджета-редактора категорий
    var self = this;

    this.$catList.find('.icon[data-act="edit"]').on( //Обработчик кнопки редактирования категорий
        'click',
        function () {
            self.createCatItemRedactor(this); //Создание редактора названия отдельно взятой категории, передаём как аргумент объект кнопки на которую мы нажали
        }
    );

    this.$catList.find('.icon[data-act="delete"]').on( //Обработчика кнопки удаления категорий
        'click',
        function () {
            self.removeCatItem(this); //Удаление отдельно взятой категории, передаём как аргумент объект кнопки на которую мы нажали
        }
    );

    this.$obj.find('.cat-redactor__add-block .button').on( //Обработчик кнопки добавляющей новую категорию
        'click',
        function () {
            self.createAddingCatRedactor(this); //Создание элемента-редактора с помощью которого можно добавлять категории
        }
    );
}

CatRedactor.prototype.removeHandler = function () { //Функция удаления обработчиков для элементов виджета-редактора категорий
    this.$obj.find('.cat-redactor__list-item .icon').off(); //Удаление обработчиков с кнопок-действия для отдельно взятых категорий
    this.$obj.find('.cat-redactor__add-block .button').off(); //Удаление обработчика с кнопки добавления категорий
}

CatRedactor.prototype.createAddingCatRedactor = function (thisObj) { //Функция создающая элемент-редактор с помощью которого можно добавлять категории
    var self = this;
    var $buttonObj = $(thisObj); //Сохраняем объект-кнопки на которой произошло событие (она же кнопка добавления категорий)
    var $addBlock = $buttonObj.closest('.cat-redactor__add-block'); //Блок внутри которого кнопка на которой произошло событие

    $buttonObj.css('display', 'none'); //Скрытие кнопки добавления категорий

    this.removeHandler(); //Удаляем обработчики с элементов редактора категорий

    // '\
    // <div data-cat-id="undef" class="cat-redactor__list-item cat-redactor__added-list-item">\
    //   <span contenteditable="true" class="text text_font_sans-regular text_size_m text_style_placeholder">Назовите категорию</span>\
    //   <div class="cat-redactor__item-editor"></div>\
    // </div>\
    // '


    var $addedListItem = $('<div>', {
        class: 'cat-redactor__list-item cat-redactor__added-list-item',
        "data-cat-id": 'undef',

        append: $('<span>', {
            class: 'text text_font_sans-regular text_size_m text_style_placeholder',
            contenteditable: 'true',
            text: 'Назовите категорию'
        }).add($('<div>', {
            class: 'cat-redactor__item-editor'
        }))
    }).prependTo(this.$catList); //Добавляем новую элемент в список со всеми категориями (но это ещё не категория, а только её "скелет")

    // '\
    // <div class="cat-redactor__icons-block">\
    //   <div title="accept" data-act="accept" class="icon icon_size_s icon_theme_darkgreen">\
    //     <img class="icon__icon-img" src="/images/icon/icon-accept-white.png" alt="">\
    //   </div>\
    //   <div title="cancel" data-act="cancel" class="icon icon_size_s icon_theme_darkgreen">\
    //     <img class="icon__icon-img" src="/images/icon/icon-exit-big-white.png" alt="">\
    //   </div>\
    // </div>\
    // '

    var $iconsBlock = $('<div>', {
        class: 'cat-redactor__icons-block',

        append: $('<div>', {
            class: 'icon icon_size_s icon_theme_darkgreen',
            title: 'accept',
            "data-act": 'accept',

            on: {
                click: createCategorie
            },

            append: $('<img>', {
                class: 'icon__icon-img',
                src: '/images/icon/icon-accept-white.png',
                alt: 'Принять'
            })
        }).add($('<div>', {
            class: 'icon icon_size_s icon_theme_darkgreen',
            title: 'cancel',
            "data-act": 'cancel',

            on: {
                click: cancelCreateCategorie
            },

            append: $('<img>', {
                class: 'icon__icon-img',
                src: '/images/icon/icon-exit-big-white.png',
                alt: 'Отменить'
            })
        }))
    }).appendTo($addBlock); //Добавляем в блок с кнопкой добавления категорий блок с кнопками действий, принятия или отмены добавления новой категории

    var $addedListItemText = $addedListItem.find('.text'); //Сохранение объекта-блока с названием категории


    //Тут начинается эмуляция placeholder'а, о нём я писал выше
    $addedListItemText.on(
        'focus',
        function () {
            if ($addedListItemText.hasClass('text_style_placeholder')) {
                $addedListItemText.html('');
                $addedListItemText.removeClass('text_style_placeholder');
            }
        }
    );

    $addedListItemText.on(
        'blur',
        function () {
            if ($addedListItemText.html().length === 0) {
                $addedListItemText.html('Назовите категорию');
                $addedListItemText.addClass('text_style_placeholder');
            }
        }
    );

    //Тут заканчивается эмуляция placeholder'а

    function createCategorie() {
        var addingText = $addedListItemText.html(); //Название категории

        if (addingText.length !== 0 && !$addedListItemText.hasClass('text_style_placeholder')) { //Проверяет не есть ли у названия символы и проверяет не является ли название placeholder'ом

            //Запрос на сервер создающий новую категорию
            $.post(
                '/ajax-handlers/create-categorie.php',
                'name=' + addingText,
                function (catId) {
                    console.log(catId);
                    if (catId === 'NoNameCat') {
                        alert('Имя категории не задано');
                    } else if (catId === 'QueryErr') {
                        alert('Произошла ошибка при добавлении категории. Возможно такая категория уже есть, проверте наличие такой же категории');
                    } else if (!isNaN(catId)) {
                        $addedListItem.attr('data-cat-id', catId); //Запись в атрибут добавленного блока-категории id добавленной категории
                        $addedListItem.removeClass('cat-redactor__added-list-item'); //Удаление класса добавленной категории

                        // $addedListItem.find('.cat-redactor__item-editor').append('\
                        //   <div data-act="delete" class="icon icon_size_s icon_theme_darkgreen cat-redactor__editor-icon cat-redactor__item-delete">\
                        //     <img class="icon__icon-img" src="/images/icon/icon-delete-white.png" alt="">\
                        //   </div>\
                        //   <div data-act="edit" class="icon icon_size_s icon_theme_darkgreen cat-redactor__editor-icon cat-redactor__item-edit">\
                        //     <img class="icon__icon-img" src="/images/icon/icon-edit-white.png" alt="">\
                        //   </div>\
                        // '); //Вставка внутрь элемента добавленной категории блока с действиями (удалить/редактировать)

                        $('<div>', {
                            class: 'icon icon_size_s icon_theme_darkgreen cat-redactor__editor-icon cat-redactor__item-delete',
                            "data-act": 'delete',

                            append: $('<img>', {
                                class: 'icon__icon-img',
                                src: '/images/icon/icon-delete-white.png',
                                alt: 'Удалить'
                            })
                        }).add($('<div>', {
                            class: 'icon icon_size_s icon_theme_darkgreen cat-redactor__editor-icon cat-redactor__item-edit',
                            "data-act": 'edit',

                            append: $('<img>', {
                                class: 'icon__icon-img',
                                src: '/images/icon/icon-edit-white.png',
                                alt: 'Редактировать'
                            })
                        })).appendTo($addedListItem.find('.cat-redactor__item-editor'));

                        $(self.$selectList[0].children[0]).after('<option class="search-block__categorie-option" value="' + catId + '">' + addingText + '</option>'); //Вставка новой категории в селект
                        console.log(self.$selectList);

                        $iconsBlock.remove(); //Удаление блока с кнопками принятия или отмены добавления новой категории
                        $buttonObj.css('display', 'inline-block'); //Делаем кнопку добавления категорий видимой

                        self.addHandler(); //Устанавливаем обработчики на элементы редактора категорий
                    } else {
                        alert('Произошла ошибка');
                    }
                }
            );
        }
    }


    function cancelCreateCategorie() {
        var confirmation = confirm('Вы действительно хотите отменить действие?'); //Проверка для пользователя

        if (confirmation) {
            $addedListItem.remove(); //Удаление "скелета" новой категории
            $iconsBlock.remove(); //Удаление блока с кнопками принятия или отмены добавления новой категории
            $buttonObj.css('display', 'inline-block'); //Делаем кнопку добавления категорий видимой

            self.addHandler(); //Устанавливаем обработчики на элементы редактора категорий
        }
    }
}


//Конструктор-класс. Является переходным, нужен в первую очередь для объединения функций виджета редактора файла и виджета добавления нового файла
//Добавляет функцию добавления и редактирования категорий к которым относится файл
//Данный конструктор не может использоваться самостоятельно (это важно), если создать объект из него, то это либо приведёт к ошибке, либо просто ничего не произойдёт, ибо сам по себе он бесполезен
//ПОВТОРЯЮ, данный конструктор создавался как ПЕРЕХОДНОЙ класс для других конструкторов, а именно FileAddEditor и FileEditor. НИ В КОЕМ СЛУЧАЕ не использовать его как самостоятельный конструктор
function FileEditPopup(animDuration, objName, dataFile, allCatArr) {
    RecessivePopupWindow.apply(this, arguments);
    this.dataFile = dataFile;
    this.allCatArray = allCatArr;
}

//Дерево наследования: FileEditPopup -> RecessivePupupWindow -> PopupWindow -> Function 
FileEditPopup.prototype = Object.create(RecessivePopupWindow.prototype);
FileEditPopup.prototype.constructor = FileEditPopup;


FileEditPopup.prototype.mainFuncFileEditor = function () { //Функция вызова основного функционала виджета редактора файлов
    var self = this;
    var $catItems = this.$obj.find('.file-editor__cat-item'); //Объект с категориями файла

    //Обработчик для иконки удаления категории
    $('.file-editor__cat-remove-but').on('click', removeCat);

    $('.file-editor__add-cat-but').on( //Обработчик для кнопки добавления категорий
        'click',
        function () {
            // $(this).before('\
            //   <div class="file-editor__select-container">\
            //     <select class="file-editor__categorie-select" name="" id=""></select>\
            //   </div>\
            // '); //Создания селекта (выпадающего списка) с категориями. Данные нужно будет брать и БД

            var $selectContainer = $('<div>', {
                class: 'file-editor__select-container',

                append: $('<select>', {
                    class: 'file-editor__categorie-select'
                })
            }).insertBefore($(this));

            var $selector = $selectContainer.find('.file-editor__categorie-select'); //Сохранение объекта селекта

            self.allCatArray.forEach(function (item, index, arr) {
                $selector.append('<option class="file-editor__categorie-option" value="' + item['categorie_id'] + '">' + item['name'] + '</option>');
                selectText = $selector.find('option:selected').text();
                selectVal = +$selector.val();
            }); //Заполнение селекта категориями

            $(this).remove(); //Удаление кнопки для добавления категорий
            // $(this).css('display', 'none') //Удаление кнопки для добавления категорий

            var selectText = $selector.find('option:selected').text(); //Выбранный пункт с категорией
            var selectVal = +$selector.val(); //id категории указанный в значении опции


            // self.$obj.find('.file-editor__select-container').after('\
            //   <div class="file-editor__icons-block">\
            //     <div title="accept" data-act="accept" class="icon icon_size_s icon_theme_darkgreen">\
            //       <img class="icon__icon-img" src="/images/icon/icon-accept-white.png" alt="">\
            //     </div>\
            //     <div title="cancel" data-act="cancel" class="icon icon_size_s icon_theme_darkgreen">\
            //       <img class="icon__icon-img" src="/images/icon/icon-exit-big-white.png" alt="">\
            //     </div>\
            //   </div>\
            // '); //Создание блока с кнопками действия (Добавить категорию/Отменить добавление)

            $('<div>', {
                class: 'file-editor__icons-block',

                append: $('<div>', {
                    class: 'icon icon_size_s icon_theme_darkgreen',
                    title: 'accept',
                    "data-act": 'accept',

                    on: {
                        click: addCategorieInList
                    },

                    append: $('<img>', {
                        class: 'icon__icon-img',
                        src: '/images/icon/icon-accept-white.png',
                        alt: 'Принять'
                    })
                }).add($('<div>', {
                    class: 'icon icon_size_s icon_theme_darkgreen',
                    title: 'cancel',
                    "data-act": 'cancel',

                    on: {
                        click: function () {
                            self.removeCatSelector()
                        }
                    },

                    append: $('<img>', {
                        class: 'icon__icon-img',
                        src: '/images/icon/icon-exit-big-white.png',
                        alt: 'Отменить'
                    })
                }))
            }).insertAfter($selectContainer);

            $selector.on( //Обработчик для селекта, срабатывает при событии "изменение значения селекта, то есть выбор другой опции выпадающего списка"
                'change',
                function () {
                    selectText = $selector.find('option:selected').text(); //Обновление названия выбранной категории
                    selectVal = +$selector.val(); //Обновление id выбранной категории
                }
            );

            function addCategorieInList() {
                var confirmation = true; //Переменная проверки

                $catItems.each(function (index, el) { //Перебор уже имеющихся категорий
                    if (+$(this).attr('data-cat-id') === selectVal) { //Проверка текущей категории находящейся на переборе, соответствует ли её id, id выбранной категории
                        alert('Такая категория уже есть'); //Вывод сообщения о том, что выбранная категория уже есть в списке категорий
                        confirmation = false; //Изменение переменной проверки, даётся ложное значение
                        return false; //Выход из цикла перебора элементов
                    }
                });

                if (!confirmation) return false; //Если проверка ложна, то выход из всей функции обработчика

                var pushingCatObj = {
                    categorie_id: selectVal,
                    categorie_name: selectText
                } //Объект с данными о добавленной категории

                self.categorieArr.push(pushingCatObj); //Добавление объекта новой категории в массив со всеми категориями

                // //Если проверка пройдена, то добавляем категорию в список
                // self.$obj.find('.file-editor__cat-list').append('\
                //   <li data-cat-id="'+ selectVal +'" class="file-editor__cat-item">'+ selectText +'<img class="file-editor__cat-remove-but" src="/images/icon/icon-exit-darkgreen.png"></li>\
                // ');

                $('<li>', {
                    class: 'file-editor__cat-item',
                    "data-cat-id": selectVal,
                    text: selectText,

                    append: $('<img>', {
                        class: 'file-editor__cat-remove-but',
                        src: '/images/icon/icon-exit-darkgreen.png',
                        alt: 'удалить'
                    })
                }).appendTo(self.$obj.find('.file-editor__cat-list'));

                $('.file-editor__cat-remove-but').off(); //Удаления старых обработчиков удаления категории

                //Установка новых идентичных обработчиков, по-сути переставление обработчиков на новые элементы
                $('.file-editor__cat-remove-but').on('click', removeCat);
                self.removeCatSelector(); //Удаляет селект с выбором категорий и добавляет кнопку добавления категорий, но это см.ниже
            }
        }
    );

    function removeCat() {
        var removeCatId = +$(this).parent().attr('data-cat-id'); //id удаляемой категории
        //Перебираем массив со всеми категориями, если находим нужную категорию, то удаляем её из массива
        self.categorieArr.forEach(function (item, index, arr) {
            if (item.categorie_id === removeCatId) {
                self.categorieArr.splice(index, 1);
            }
        });

        $(this).parent().remove(); //Удаляет объект категории
        $catItems = self.$obj.find('.file-editor__cat-item'); //Обновляет объект со всеми категориями
    }
}

FileEditPopup.prototype.removeCatSelector = function () { //Функция удаления селекта с выбором категорий и добавления кнопки добавления категорий
    this.$obj.find('.file-editor__select-container, .file-editor__icons-block').remove(); //Удаляет селект с категориями

    // this.$obj.find('.file-editor__cat-block').append('\
    //   <div class="file-editor__add-cat-but">\
    //     <img class="file-editor__add-cat-but-img" src="/images/icon/icon-plus-green.png" alt="">\
    //     <span class="text text_font_sans-regular text_size_xs">Добавить категорию</span>\
    //   </div>\
    // '); //Заново создаёт кнопку добавления категорий

    //Заново создаём кнопку добавления категорий
    $('<div>', {
        class: 'file-editor__add-cat-but',

        append: $('<img>', {
            class: 'file-editor__add-cat-but-img',
            src: '/images/icon/icon-plus-green.png',
            alt: ''
        }).add($('<span>', {
            class: 'text text_font_sans-regular text_size_xs',
            text: 'Добавить категорию'
        }))
    }).appendTo(this.$obj.find('.file-editor__cat-block'));

    this.mainFuncFileEditor(); //Заново запускает основные функции
}

FileEditPopup.prototype.closeWin = function () {
    if (this.isPhotoHasEdited) { //Если фотография для файл-блока была удалена, то будет следующее
        var pathRemovePhoto = this.$obj.find('.file-editor__image').attr('data-image-path'); //Путь к фотографии

        //Запрос на сервер удаляющий фотографию
        $.post(
            '/ajax-handlers/remove-image.php',
            'fop=' + pathRemovePhoto,
            function (result) {
                console.log(result);
            }
        );
    }
    this.deactive(); //Деактивация popup
}


//Конструктор класс для виджета добавления новых файлов
function FileAddEditor(animDuration, objName, dataFile, allCatArr, funcAddVertFile) {
    FileEditPopup.apply(this, arguments);
    this.categorieArr = []; //Массив со всеми категориями
    this.funcAddVertFile = funcAddVertFile; //Функция (callback) добавляющая файл-блок в секцию с файлами
    self.isPhotoHasEdited = false; //Переменная состояния изменения фото. true - фото было изменено, false - фото изменено не было
}

//Дерево наследования: FileAddEditor -> FileEditPopup -> RecessivePopupWindow -> PopupWindow
FileAddEditor.prototype = Object.create(FileEditPopup.prototype);
FileAddEditor.prototype.constructor = FileAddEditor;

FileAddEditor.prototype.createFileAddEditor = function () { //Создание виджета для добавления новых файлов
    var self = this;
    this.active(); //активация popup


    // this.$obj.prepend('\
    //   <div class="file-editor file-editor_theme_softgreen file-editor_size_m">\
    //     <div class="file-editor__title">\
    //       <span class="text text_font_roboto-regular text_size_xxl">Добавить файл</span>\
    //       <img class="file-editor__exit" src="/images/icon/icon-exit-white.png" alt="">\
    //     </div>\
    //     \
    //     <form action="">\
    //       <div class="file-editor__body">\
    //       \
    //         <div class="file-editor__body-top">\
    //           <div class="file-editor__image" data-image-path="">\
    //             <img src="/images/icon/icon-upload-white.png" alt="" class="file-editor__image-edit-icon button-to-upload-photo">\
    //           </div>\
    //           <div class="file-editor__info">\
    //             <input class="file-editor__file-name text text_font_sans-regular text_size_s" type="text" placeholder="Имя">\
    //             <div class="file-editor__cat-block">\
    //               <span class="text text_font_sans-regular text_size_s">Категории:</span>\
    //               <ul class="file-editor__cat-list text text_font_sans-regular text_size_xs">\
    //               </ul>\
    //               <div class="file-editor__add-cat-but">\
    //                 <img class="file-editor__add-cat-but-img" src="/images/icon/icon-plus-green.png" alt="">\
    //                 <span class="text text_font_sans-regular text_size_xs">Добавить категорию</span>\
    //               </div>\
    //             </div>\
    //           </div>\
    //         </div>\
    //         \
    //         <div class="file-editor__body-bottom">\
    //           <div class="file-editor__upload-file">\
    //             <label class="file-editor__upload-file-label">\
    //               <div class="button button_style_simple button_size_s button_theme_green">\
    //                 <div class="button__container">\
    //                   <span class="text text_size_xs">загрузить файл</span>\
    //                 </div>\
    //               </div>\
    //               <input class="file-editor__upload-file-but" id="file-uploads" type="file">\
    //             </label>\
    //             <span class="file-editor__input-filename text_font_sans-regular text_size_xs"></span>\
    //           </div>\
    //           <textarea class="file-editor__desc-file text text_font_sans-regular text_size_xs" name="" id=""></textarea>\
    //           <div class="file-editor__submit-block">\
    //             <div class="button button_style_simple button_size_m button_theme_green">\
    //               <div class="button__container">\
    //                 <span class="text text_size_m">Добавить</span>\
    //               </div>\
    //             </div>\
    //           </div>\
    //         </div>\
    //         \
    //       </div>\
    //     </form>\
    //     \
    //   </div>\
    // '); //Создание содержимого виджета

    $('<div>', {
        class: 'file-editor file-editor_theme_softgreen file-editor_size_m',

        append: $('<div>', {
            class: 'file-editor__title',

            append: $('<span>', {
                class: 'text text_font_roboto-regular text_size_xxl',
                text: 'Добавить файл'
            })
                .add($('<img>', {
                    class: 'file-editor__exit',
                    src: '/images/icon/icon-exit-white.png',
                    alt: 'Выйти',

                    on: {
                        click: function () {
                            self.closeWin();
                        }
                    }
                }))
        })
            .add($('<form>', {
                action: '',

                append: $('<div>', {
                    class: 'file-editor__body',

                    append: $('<div>', {
                        class: 'file-editor__body-top',

                        append: $('<div>', {
                            class: 'file-editor__image',
                            "data-image-path": '',

                            append: $('<img>', {
                                class: 'file-editor__image-edit-icon button-to-upload-photo',
                                src: '/images/icon/icon-upload-white.png',
                                alt: '',

                                on: {
                                    click: function () {
                                        var $editableImg = $(this).closest('.file-editor__image'); //Блок с картинкой файл-блока

                                        function updPhotoInFile(dataPath) { //Функция обновляющая картинку файл блока
                                            $editableImg.attr('data-image-path', dataPath);
                                            $editableImg.attr('style', 'background-image: url(\'' + dataPath + '\')');
                                            self.isPhotoHasEdited = true; //Установка в переменную значения true(фото было редактировано)
                                        }

                                        var updPhotoInFileWrap = updPhotoInFile.bind(this); //Биндим фото к текущему контексту вызовов

                                        var objImgSize = {
                                            imgWidth: 360,
                                            imgHeight: 300
                                        } //Размеры блока для картинки

                                        var photoLoader = new PhotoLoader(200, 'photo-loader__popup', updPhotoInFileWrap, objImgSize); //создание объекта виджета загрузок фотографий
                                        photoLoader.createPhotoLoader(); //Запуск виджета объекта загрузок фотографий
                                    }
                                }
                            })
                        })
                            .add($('<div>', {
                                class: 'file-editor__info',

                                append: $('<input>', {
                                    class: 'file-editor__file-name text text_font_sans-regular text_size_s',
                                    type: 'text',
                                    placeholder: 'Введите название файла'
                                })
                                    .add($('<div>', {
                                        class: 'file-editor__cat-block',

                                        append: $('<span>', {
                                            class: 'text text_font_sans-regular text_size_s',
                                            text: 'Категории:'
                                        })
                                            .add($('<ul>', {
                                                class: 'file-editor__cat-list text text_font_sans-regular text_size_xs',
                                            }))
                                            .add($('<div>', {
                                                class: 'file-editor__add-cat-but',

                                                append: $('<img>', {
                                                    class: 'file-editor__add-cat-but-img',
                                                    src: '/images/icon/icon-plus-green.png',
                                                    alt: ''
                                                })
                                                    .add($('<span>', {
                                                        class: 'text text_font_sans-regular text_size_xs',
                                                        text: 'Добавить категорию'
                                                    }))
                                            }))
                                    }))
                            }))
                    })
                        .add($('<div>', {
                            class: 'file-editor__body-bottom',

                            append: $('<div>', {
                                class: 'file-editor__upload-file',

                                append: $('<label>', {
                                    class: 'file-editor__upload-file-label',

                                    append: $('<div>', {
                                        class: 'button button_style_simple button_size_s button_theme_green',

                                        append: $('<div>', {
                                            class: 'button__container',

                                            append: $('<span>', {
                                                class: 'text text_size_xs',
                                                text: 'загрузить файл'
                                            })
                                        })
                                    })
                                        .add($('<input>', {
                                            class: 'file-editor__upload-file-but',
                                            id: 'file-uploads',
                                            type: 'file',

                                            on: {
                                                change: function () {
                                                    var fileName = $(this).val().replace(/.*\\/, ""); //Берёт путь до файла из input type="file" и режет строку до названия файла, строка записывается в переменную
                                                    $('.file-editor__input-filename').html(fileName); //Выводит название рядом с кнопкой "загрузить файл"
                                                }
                                            }
                                        }))
                                })
                                    .add($('<span>', {
                                        class: 'file-editor__input-filename text_font_sans-regular text_size_xs'
                                    }))
                            })
                                .add($('<textarea>', {
                                    class: 'file-editor__desc-file text text_font_sans-regular text_size_xs',
                                    placeholder: 'Напишите ошисание файла'
                                }))
                                .add($('<div>', {
                                    class: 'file-editor__submit-block',

                                    append: $('<div>', {
                                        class: 'button button_style_simple button_size_m button_theme_green',

                                        on: {
                                            click: function () {
                                                self.submitFile();
                                            }
                                        },

                                        append: $('<div>', {
                                            class: 'button__container',

                                            append: $('<span>', {
                                                class: 'text text_size_m',
                                                text: 'Добавить'
                                            })
                                        })
                                    })
                                }))
                        }))
                })
            }))
    }).prependTo(this.$obj);

    this.mainFuncFileEditor(); //Запуск основных функций редактора файлов. Функция берётся из FileEditPopup

    $(window).on(
        'keyup',
        function (event) {
            if (event.keyCode === 27) {
                $(window).off('keyup');
                self.closeWin();
            }
        });
}

FileAddEditor.prototype.submitFile = function () {
    var self = this;
    var $targetBut = this.$obj.find('.file-editor__submit-block > .button');

    // var $loader = $('\
    //   <div class="loader loader_theme_green loader_size_m file-editor_loader">\
    //     <div class="loader-item loader-item-1"></div>\
    //     <div class="loader-item loader-item-2"></div>\
    //     <div class="loader-item loader-item-3"></div>\
    //   </div>\
    // ').insertBefore( $targetBut );


    var $loader = $('<div>', {
        class: 'loader loader_theme_green loader_size_m file-editor_loader',

        append: $('<div>', {
            class: 'loader-item loader-item-1'
        })
            .add($('<div>', {
                class: 'loader-item loader-item-2'
            }))
            .add($('<div>', {
                class: 'loader-item loader-item-3'
            }))
    }).insertBefore($targetBut);

    $targetBut.parent().css('justify-content', 'space-between');


    var textareaVal = this.$obj.find('.file-editor__desc-file').val(); //Описание
    var nameareaVal = this.$obj.find('.file-editor__file-name').val(); //Название файл-блока
    var updImgPath = this.$obj.find('.file-editor__image').attr('data-image-path'); //Путь к картинке
    var inputFile = this.$obj.find('.file-editor__upload-file-but')[0]; //файл

    jsonCatArr = JSON.stringify(this.categorieArr); //Кодируем массив с категориями в JSON

    //Заполняем formdata
    var fd = new FormData();
    fd.append('file', inputFile.files[0]);
    fd.append('categorie_arr', jsonCatArr);
    fd.append('title_file', nameareaVal);
    fd.append('description', textareaVal);
    fd.append('image_path', updImgPath);

    //Объект необходимый для создания файл-блока в секции файлов, так что удалять его нельзя
    var updDataFileObj = {
        categorieArr: self.categorieArr,
        title_file: nameareaVal,
        description: textareaVal,
        image_path: updImgPath,
    }

    $.ajax({
        url: '/ajax-handlers/create-file.php',
        data: fd,
        processData: false,
        contentType: false,
        type: 'POST',
        success: function (data) {

            $loader.remove();
            $targetBut.parent().css('justify-content', 'flex-end');

            console.log(data);
            var valid = !!(data);

            if (data === 'NoFile') {
                alert('Нет файла');
            } else if (data === 'WrongTypeFile') {
                alert('Данное расширение файла не поддерживается');
            } else if (data === 'NoQuery') {
                self.deactive();
                alert('Не удалось добавить файл');
            } else if (data === 'NoFileUpload') {
                self.deactive(); //Деактивация popup
                alert('Не удалось загрузить файл');
            } else if (data === 'NoData') {
                alert('Нет нужных данных. Проверьте правильность введённых данных');
            } else if (data === 'NoDataSecondErr') {
                self.deactive();
                alert('Ошибка при чтении введённых данных. Перезагрузите страницу');
            } else if (data === 'NoCatQuery') {
                alert('Не удалось добавить категории к файлу');
            } else if (valid) {

                //Тут должная быть функция которая вносит изменения для vert-file в админ панели
                try {
                    newData = JSON.parse(data); //Декодим json отправленный с сервера
                    updDataFileObj.id_file = newData.id_file; //id нового файл-блока
                    updDataFileObj.pubdate = newData.pubdate; //Дата публикации нового файл-блока
                    updDataFileObj.file_size = newData.file_size; //Размер загруженного файла

                    self.deactive(); //Деактивация popup
                    self.funcAddVertFile(updDataFileObj); //Функция добавляющая новый файл-блок в секцию с файлами

                } catch (err) {
                    console.log(err);
                    self.deactive();
                    alert('При добавлении файла произошла ошибка. Перезагрузите страницу');

                    //Если не удалось создать файл-блок, то удаляем картинку загруженную для него
                    $.post(
                        '/ajax-handlers/remove-image.php',
                        'fop=' + updDataFileObj.image_path,
                        function (result) {
                            console.log(result);
                        }
                    );
                }
            }
        }
    });
}


//Конструктор-класс для виджета редактирования информации уже имеющихся файлов
function FileEditor(animDuration, objName, dataFile, allCatArr, funcUpdateVertFile) {
    FileEditPopup.apply(this, arguments);
    this.categorieArr = this.dataFile.categorie_arr; //Массив со всеми категориями
    this.funcUpdateVertFile = funcUpdateVertFile; //Функция (callback) для обновления редактируемого файл-блока
    this.isPhotoHasEdited = false; //Переменная состояния изменения фото. true - фото было изменено, false - фото изменено не было
}


//Дерево наследования: FileEditor -> FileEditPopup -> RecessivePopupWindow -> PopupWindow -> Function
FileEditor.prototype = Object.create(FileEditPopup.prototype);
FileEditor.prototype.constructor = FileEditor;

FileEditor.prototype.createFileEditor = function () { //Функция создания виджета с редактором информации о уже имеющимся файле
    var self = this;
    this.active(); //Активация Popup


    // this.$obj.prepend('\
    //   <div data-file-id="'+ this.dataFile.file_id +'" class="file-editor file-editor_theme_softgreen file-editor_size_m">\
    //     <div class="file-editor__title">\
    //       <span class="text text_font_roboto-regular text_size_xxl">Редактировать файл</span>\
    //       <img class="file-editor__exit" src="/images/icon/icon-exit-white.png" alt="">\
    //     </div>\
    //     \
    //     <form action="">\
    //       <div class="file-editor__body">\
    //       \
    //         <div class="file-editor__body-top">\
    //           <div class="file-editor__image" data-image-path="'+ this.dataFile.path_image +'" style="background-image: url(\''+ this.dataFile.path_image +'\');">\
    //             <img src="/images/icon/icon-upload-white.png" alt="" class="file-editor__image-edit-icon button-to-upload-photo">\
    //           </div>\
    //           <div class="file-editor__info">\
    //             <input class="file-editor__file-name text text_font_sans-regular text_size_s" type="text" value="'+ this.dataFile.title_file +'" placeholder="Имя">\
    //             <div class="file-editor__cat-block">\
    //               <span class="text text_font_sans-regular text_size_s">Категории:</span>\
    //               <ul class="file-editor__cat-list text text_font_sans-regular text_size_xs">\
    //               </ul>\
    //               <div class="file-editor__add-cat-but">\
    //                 <img class="file-editor__add-cat-but-img" src="images/icon/icon-plus-green.png" alt="">\
    //                 <span class="text text_font_sans-regular text_size_xs">Добавить категорию</span>\
    //               </div>\
    //             </div>\
    //           </div>\
    //         </div>\
    //         \
    //         <div class="file-editor__body-bottom">\
    //           <textarea class="file-editor__desc-file text text_font_sans-regular text_size_xs" value="">'+ this.dataFile.description +'</textarea>\
    //           <div class="file-editor__submit-block">\
    //             <div class="button button_style_simple button_size_m button_theme_green">\
    //               <div class="button__container">\
    //                 <span class="text text_size_m">Редактировать</span>\
    //               </div>\
    //             </div>\
    //           </div>\
    //         </div>\
    //         \
    //       </div>\
    //     </form>\
    //     \
    //   </div>\
    // '); //Создание наполения виджета

    $('<div>', {
        class: 'file-editor file-editor_theme_softgreen file-editor_size_m',
        "data-file-id": this.dataFile.file_id,

        append: $('<div>', {
            class: 'file-editor__title',

            append: $('<span>', {
                class: 'text text_font_roboto-regular text_size_xxl',
                text: 'Редактировать файл'
            })
                .add($('<img>', {
                    class: 'file-editor__exit',
                    src: '/images/icon/icon-exit-white.png',
                    alt: 'Выйти',

                    on: {
                        click: function () {
                            self.closeWin();
                        }
                    }
                }))
        })
            .add($('<form>', {
                action: '',

                append: $('<div>', {
                    class: 'file-editor__body',

                    append: $('<div>', {
                        class: 'file-editor__body-top',

                        append: $('<div>', {
                            class: 'file-editor__image',
                            "data-image-path": this.dataFile.path_image,
                            css: {
                                backgroundImage: "url('" + this.dataFile.path_image + "')"
                            },

                            append: $('<img>', {
                                class: 'file-editor__image-edit-icon button-to-upload-photo',
                                src: '/images/icon/icon-upload-white.png',
                                alt: '',

                                on: {
                                    click: function () {
                                        var $editableImg = $(this).closest('.file-editor__image'); //Блок с картинкой файл-блока

                                        function updPhotoInFile(dataPath) { //Функция для обновления картинки файл-блока
                                            $editableImg.attr('data-image-path', dataPath);
                                            $editableImg.attr('style', 'background-image: url(\'' + dataPath + '\')');
                                            self.isPhotoHasEdited = true;
                                        }

                                        var updPhotoInFileWrap = updPhotoInFile.bind(this); //Биндим функцию в текущем контексте вызовов

                                        var objImgSize = { //Объект с размерами блока с картинкой файл-блока
                                            imgWidth: 360,
                                            imgHeight: 300
                                        }

                                        var photoLoader = new PhotoLoader(200, 'photo-loader__popup', updPhotoInFileWrap, objImgSize); //Создание объекта виджета с загрузкой новых фотографий
                                        photoLoader.createPhotoLoader(); //Создание виджета с загрузкой новых фоторафий
                                    }
                                }
                            })
                        })
                            .add($('<div>', {
                                class: 'file-editor__info',

                                append: $('<input>', {
                                    class: 'file-editor__file-name text text_font_sans-regular text_size_s',
                                    type: 'text',
                                    value: this.dataFile.title_file,
                                    placeholder: 'Введите название файла'
                                })
                                    .add($('<div>', {
                                        class: 'file-editor__cat-block',

                                        append: $('<span>', {
                                            class: 'text text_font_sans-regular text_size_s',
                                            text: 'Категории:'
                                        })
                                            .add($('<ul>', {
                                                class: 'file-editor__cat-list text text_font_sans-regular text_size_xs',
                                            }))
                                            .add($('<div>', {
                                                class: 'file-editor__add-cat-but',

                                                append: $('<img>', {
                                                    class: 'file-editor__add-cat-but-img',
                                                    src: '/images/icon/icon-plus-green.png',
                                                    alt: ''
                                                })
                                                    .add($('<span>', {
                                                        class: 'text text_font_sans-regular text_size_xs',
                                                        text: 'Добавить категорию'
                                                    }))
                                            }))
                                    }))
                            }))
                    })
                        .add($('<div>', {
                            class: 'file-editor__body-bottom',

                            append:
                                $('<textarea>', {
                                    class: 'file-editor__desc-file text text_font_sans-regular text_size_xs',
                                    text: this.dataFile.description,
                                    placeholder: 'Напишите ошисание файла'
                                })
                                    .add($('<div>', {
                                        class: 'file-editor__submit-block',

                                        on: {
                                            click: function () {
                                                self.submitFile();
                                            }
                                        },

                                        append: $('<div>', {
                                            class: 'button button_style_simple button_size_m button_theme_green',

                                            append: $('<div>', {
                                                class: 'button__container',

                                                append: $('<span>', {
                                                    class: 'text text_size_m',
                                                    text: 'Редактировать'
                                                })
                                            })
                                        })
                                    }))
                        }))
                })
            }))
    }).prependTo(this.$obj);

    var $catList = this.$obj.find('.file-editor__cat-list');

    for (var i = 0; (i + 1) <= this.categorieArr.length; i++) {

        // this.$obj.find('.file-editor__cat-list').append('\
        //   <li data-cat-id="'+ this.categorieArr[i].categorie_id +'" class="file-editor__cat-item">'
        //     + this.categorieArr[i].categorie_name +
        //     '<img class="file-editor__cat-remove-but" src="/images/icon/icon-exit-darkgreen.png">\
        //   </li>\
        // ');

        $('<li>', {
            class: 'file-editor__cat-item',
            "data-cat-id": this.categorieArr[i].categorie_id,
            text: this.categorieArr[i].categorie_name,

            append: $('<img>', {
                class: 'file-editor__cat-remove-but',
                src: '/images/icon/icon-exit-darkgreen.png',
                alt: 'удалить'
            })
        }).appendTo($catList);
    } //Вставка категорий файла

    this.mainFuncFileEditor(); //Запуск основных функций виджета

    $(window).on(
        'keyup',
        function (event) {
            if (event.keyCode === 27) {
                $(window).off('keyup');
                self.closeWin();
            }
        });
}

FileEditor.prototype.submitFile = function () {
    var self = this;
    var textareaVal = this.$obj.find('.file-editor__desc-file').val(); //Описание
    var nameareaVal = this.$obj.find('.file-editor__file-name').val(); //Имя файл-блока
    var updImgPath = this.$obj.find('.file-editor__image').attr('data-image-path'); //Путь к картинке
    var fileId = this.$obj.find('.file-editor').attr('data-file-id'); //id файл-блока

    var updDataFileObj = { //Объект необходимый для изменения файл-блока в секции с файлами
        categorieArr: self.categorieArr,
        title_file: nameareaVal,
        description: textareaVal,
        image_path: updImgPath,
        file_id: fileId
    }

    var catArrJson = JSON.stringify(this.categorieArr); //Кодируем массив со всеми категориями в JSON

    //Заполняем formdata
    var fd = new FormData();
    fd.append('categorieArr', catArrJson);
    fd.append('title_file', nameareaVal);
    fd.append('description', textareaVal);
    fd.append('image_path', updImgPath);
    fd.append('file_id', fileId);

    console.log(this.categorieArr);

    //Запрос на сервер обновляющий файл-блок
    $.ajax({
        url: '/ajax-handlers/update-file.php',
        data: fd,
        processData: false,
        contentType: false,
        type: 'POST',
        success: function (result) {
            console.log(result);
            var valid = !!(+result);
            if (result === 'NoData') {
                alert('Не были введены некоторые данные. Проверте наличие этих данных. Фотография и название файла являются обязательными');

            } else if (result === 'NoUpd') {
                self.deactive(); //Деактивация popup
                alert('Из-за ошибки на сервере изменения внесены не были. Перезагрузите страницу');

            } else if (result === 'NoCatQuery') {
                self.deactive(); //Деактивация popup
                alert('Из-за ошибки на сервере категории изменены не были. Перезагрузите страницу');

            } else if (result === 'undefErr') {
                self.deactive();
                alert('На сервере произошла ошибка. Перезагрузите страницу');
            } else if (valid) {
                self.deactive(); //Деактивация popup
                //Тут должная быть функция которая вносит изменения для vert-file в админ панели
                self.funcUpdateVertFile(updDataFileObj);

            } else {
                self.deactive();
                alert('На сервере произошла ошибка. Перезагрузите страницу');
            }
        }
    })
}


//Конструктор-класс для виджета с загрузкой новых фотографий
function PhotoLoader(animDuration, objName, funcToAddInTable, objImgSize) {
    RecessivePopupWindow.apply(this, arguments);
    this.initialOverflowStatus = $('body').css('overflow-y'); //Получает статут скролла (запрещён/не запрещён)
    this.currentFilePath = null; //Путь к текущей картинке (в смысле к той, которая сейчас находится в окне)
    this.funcToAddInTable = funcToAddInTable; //Функция (callback) для записи данных в БД
    this.objImgSize = objImgSize; //Объект с размерами блока для изображения
    // this.isPhotoWasSelected    = false; //Переменная обозначающая, что какая-то картинка уже была загружена. true - была загружена, false - не была загружена
}


//Дерево наследования: PhotoLoader -> RecessivePopupWindow -> PopupWindow -> Function
PhotoLoader.prototype = Object.create(RecessivePopupWindow.prototype);
PhotoLoader.prototype.constructor = PhotoLoader;

PhotoLoader.prototype.active = function () { //Активация popup для виджета фотографий
    this.createPopup(); //создание popup
    this.$obj.addClass(this.objName); //Задание контейнеру-popup класса подходящего под контейнер для виджета фотографий

    if (this.initialOverflowStatus !== 'hidden') { //Проверяет не запрещён ли скролл для body
        $('body').css('overflow-y', 'hidden'); //Если скролл не запрещён, то запрещает его. Соответсвенно если он запрещён, то данный код ничего не сделает
    }

    this.$obj.css('display', 'flex'); //Задаёт контейнеру-popup display flex
    this.$obj.removeClass('popup_hide'); //Удаляет класс скрывающий контейнер-popup
    this.$obj.addClass('popup_show'); //Добавляет класс показывающий контейнер-popup

}

PhotoLoader.prototype.deactive = function () { //Деактивация popup для виджета фотографий
    var self = this;
    this.$obj.removeClass('popup_show'); //Удаляет класс показывающий контейнер-popup
    this.$obj.addClass('popup_hide'); //Добавляет класс скрывающий контейнер-popup

    setTimeout(function () { //Задержка перед анимированием всех анимаций
        if (self.initialOverflowStatus !== 'hidden') { //Если скролл был не был запрещённ до создания виджета, то данный блок кода разрешает его
            $('body').css('overflow-y', 'auto'); //Разрешение скролла документа
        }
        self.$obj.remove(); //Удаление popup
    }, this.animDuration);
}

PhotoLoader.prototype.createPhotoLoader = function () { //Создание виджета для загрузки фотографий
    var self = this;
    this.active(); //Активация popup
    $(window).off('keyup');

    // this.$obj.prepend('\
    //   <div class="photo-loader photo-loader_size_m photo-loader_theme_simple">\
    //     <img class="photo-loader__exit" src="/images/icon/icon-exit-white.png" alt="">\
    //     <form enctype="multipart/form-data" action="">\
    //       <div class="photo-loader__upload-photo">\
    //         <label class="photo-loader__upload-photo-label">\
    //           <div class="button button_style_simple button_size_l button_theme_white-blue photo-loader__button-upload">\
    //             <div class="button__container">\
    //               <span class="text text_size_m">загрузить фото</span>\
    //             </div>\
    //           </div>\
    //           <input accept="image/*" class="photo-loader__upload-photo-input" id="photo-uploads" type="file">\
    //         </label>\
    //       </div>\
    //       <div class="photo-loader__image-block">\
    //         <figure class="photo-loader__img-figure">\
    //           <img class="photo-loader__upload-imagination" src="" alt="">\
    //         </figure>\
    //       </div>\
    //     </form>\
    //   </div>\
    // '); //Создание наполнения виджета

    $('<div>', {
        class: 'photo-loader photo-loader_size_m photo-loader_theme_simple',

        append: $('<img>', {
            class: 'photo-loader__exit',
            src: '/images/icon/icon-exit-white.png',
            alt: 'Закрыть',

            on: {
                click: function () {
                    self.deactive(); //Деактивация popup
                    self.deletePhoto(); //Удаление картинки
                }
            }
        })
            .add('<form>', {
                enctype: 'multipart/form-data',
                action: '',

                append: $('<div>', {
                    class: 'photo-loader__upload-photo',

                    append: $('<label>', {
                        class: 'photo-loader__upload-photo-label',

                        append: $('<div>', {
                            class: 'button button_style_simple button_size_l button_theme_white-blue photo-loader__button-upload',

                            append: $('<div>', {
                                class: 'button__container',

                                append: $('<span>', {
                                    class: 'text text_size_m',
                                    text: 'загрузить фото'
                                })
                            })
                        })
                            .add($('<input>', {
                                class: 'photo-loader__upload-photo-input',
                                id: 'photo-uploads',
                                type: 'file',
                                accept: 'image/*',

                                on: {
                                    change: function () {
                                        self.deletePhoto(); //Удаляем картинку
                                        self.uploadPhoto(this); //Загружаем текущую картинку
                                    }
                                }
                            }))
                    })
                })
                    .add($('<div>', {
                        class: 'photo-loader__image-block',

                        append: $('<figure>', {
                            class: 'photo-loader__img-figure',

                            append: $('<img>', {
                                class: 'photo-loader__upload-imagination',
                                src: '',
                                alt: ''
                            })
                        })
                    }))
            })
    }).prependTo(this.$obj);
}

PhotoLoader.prototype.uploadPhoto = function (thisPhoto) { //Функция для загрузки картинки
    var self = this;

    //Заполняем fd
    var fd = new FormData();
    fd.append('img', thisPhoto.files[0]);
    fd.append('block_width', this.objImgSize.imgWidth);
    fd.append('block_height', this.objImgSize.imgHeight);

    // var $loader = $('\
    //   <div class="loader loader_theme_blue loader_size_m file-editor_loader">\
    //     <div class="loader-item loader-item-1"></div>\
    //     <div class="loader-item loader-item-2"></div>\
    //     <div class="loader-item loader-item-3"></div>\
    //   </div>\
    // ').appendTo( $('.photo-loader__upload-photo') );

    var $loader = $('<div>', {
        class: 'loader loader_theme_blue loader_size_m photo-loader__loader',

        append: $('<div>', {
            class: 'loader-item loader-item-1'
        })
            .add($('<div>', {
                class: 'loader-item loader-item-2'
            }))
            .add($('<div>', {
                class: 'loader-item loader-item-3'
            }))
    }).appendTo(this.$obj.find('.photo-loader__upload-photo'));


    console.log(fd);
    $.ajax({
        url: '/ajax-handlers/upload-image.php',
        data: fd,
        processData: false,
        contentType: false,
        type: 'POST',
        success: function (result) {
            // var newdata = data.replace(/.*\\/, ""); //Вырезание имени файла

            $loader.remove();

            console.log(result);

            if (result === 'WrongType') {
                alert('Неподходящий тип изображения');
            } else if (result === 'ScaleError') {
                alert('Ошибка при обработке картинки');
            } else if (result === 'NoData') {

            } else {
                try {
                    var dataPhoto = JSON.parse(result); //Декодим json с сервера

                    $('.photo-loader__img-figure').css('display', 'block'); //Блок с изображением файла
                    $('.photo-loader__upload-photo').css('margin-bottom', '20px'); //Задание нижнего отступа для блока с кнопкой "загрузить фото"

                    var filePath = '/images/upload-image/'; //Путь к файлам на сервере

                    self.currentFilePath = filePath + dataPhoto.nameUpdFile; //Путь к загруженной картинке

                    $('.photo-loader__upload-imagination').attr('src', self.currentFilePath); //Задаётся путь до файла на сервере. Путь к папке с картинками на сервере + Имя загружаемого файла

                    if (!$('.photo-loader__icons-block')[0]) { //Если нет блока с кнопками-действиями, то они создаются
                        self.createActsBlock(); //Создание блока с кнопками-действиями
                    }
                } catch (err) {
                    alert('Ошибка на сервере');
                    console.log(err);
                }
            }
        }
    });
}

PhotoLoader.prototype.deletePhoto = function () { //Функция текущую картинку (см.выше в объявлении этой переменной)
    var self = this;
    var filePath = '/images/upload-image/'; //Директория на сервере
    if (this.currentFilePath !== null) { //Если есть текущая картинка
        //Запрос удаляющий картинку с сервера
        $.post(
            '/ajax-handlers/remove-image.php',
            'fop=' + self.currentFilePath,
            function (result) {
                if (result === 'NoPath') {
                    alert('Ошибка пути, ');
                }
                console.log(result)
            }
        );
    }
}

PhotoLoader.prototype.createActsBlock = function () { //Функция создающая блок с кнопками-действиями (сохранить фотографию/отменить сохранение, удалить фотографию )
    var self = this;

    // $('.photo-loader__upload-photo').append('\
    //   <div class="photo-loader__icons-block">\
    //     <div title="accept" data-act="accept" class="icon icon_size_s icon_theme_darkblue">\
    //       <img class="icon__icon-img" src="/images/icon/icon-accept-white.png" alt="">\
    //     </div>\
    //     <div title="cancel" data-act="cancel" class="icon icon_size_s icon_theme_darkblue">\
    //       <img class="icon__icon-img" src="/images/icon/icon-exit-big-white.png" alt="">\
    //     </div>\
    //   </div>\
    // '); //Создание блока с кнопками-действиями

    $('<div>', {
        class: 'photo-loader__icons-block',

        append: $('<div>', {
            class: 'icon icon_size_s icon_theme_darkblue',
            title: 'accept',
            "data-act": 'accept',

            on: {
                click: function () {
                    var confirmation = confirm('Вы уверены что хотите изменить фотографию?'); //Проверка для пользователя
                    if (confirmation) {
                        //тут путь фотографии должен сохраняться в БД, старая фотография должна удаляться(если она есть)
                        self.funcToAddInTable(self.currentFilePath); //Запись данных в БД
                        self.deactive(); //Деактивиция popup
                    }
                }
            },

            append: $('<img>', {
                class: 'icon__icon-img',
                src: '/images/icon/icon-accept-white.png',
                alt: 'Принять'
            })
        }).add($('<div>', {
            class: 'icon icon_size_s icon_theme_darkblue',
            title: 'cancel',
            "data-act": 'cancel',

            on: {
                click: function () {
                    var confirmation = confirm('Вы уверены что хотите отменить изменения?'); //Проверка для пользователя
                    if (confirmation) {
                        //Фотография должна удаляться с сервера.
                        self.deletePhoto(); //Удаляем картинку
                        self.deactive(); //Деактивация popup
                    }
                }
            },

            append: $('<img>', {
                class: 'icon__icon-img',
                src: '/images/icon/icon-exit-big-white.png',
                alt: 'Отменить'
            })
        }))
    }).appendTo(this.$obj.find('.photo-loader__upload-photo'));
}