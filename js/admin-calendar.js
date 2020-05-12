var widgetAddNote = new NotesWinToAdd(200, 'note__popup', 'widget-add-note'); //Объект окна заметки в котором можно добалять заметки
var widgetEditorNote = new EditableNotesWin(200, 'note__popup', 'widget-editor-note');

// Конструктор-класс для календаря находящегося в админ панели. Создан для добавления и изменения функционала обычного календаря
function AdminCalendar(obj) {
    Calendar.apply(this, arguments);
}


// Древо наследования AdminCalendar -> Calendar -> Function
AdminCalendar.prototype = Object.create(Calendar.prototype);
AdminCalendar.prototype.constructor = AdminCalendar;

AdminCalendar.prototype.launch = function () { //Запуск Админ-календаря
    var self = this;

    //Порядок вызова функций менять нельзя, это может к неожиданным последствиям!!!
    this.createCells(); //Вызов функции создающей наполнение ячеек. Подробнее смотри в описании самой функции. Лучше посмотреть, потому что это важно, функция сложная
}


AdminCalendar.prototype.addHandler = function (thisObj) { //Функция добавления обработчиков на ячейки
    var self = this;

    this.$obj.find('.calendar__cell[data-date]').not(this.$noteCell).on( //Обработчик для обычных ячеек (т.е. без заметок)
        'click',
        function () {
            self.handlerEmptyDays(event.currentTarget);
        }
    );

    this.$noteCell.on( //Обработчик для ячеек с заметками
        'click',
        function () {
            self.handelrDayWithNote(event.currentTarget);
        }
    );
}

AdminCalendar.prototype.handelrDayWithNote = function (target) {
    var targetCell = target;
    if ($(target).attr('data-is-note') === 'true') { //Проверяет есть ли у ячейки атрибута ячейки с заметкой

        var dataId = $(target).attr('data-id'); //id ячейки
        var ajaxId = 'nid=' + dataId;

        $.post(
            '/ajax-handlers/calendar-get-data-cell.php',
            ajaxId,
            function (result) {
                console.log(result);
                if (result === 'NoId') {
                    alert('Заметка не найдена');
                    return false;
                } else {
                    try { //получение данных с БД и вывод окна
                        var result = JSON.parse(result);
                        // var newNote  = new EditableNotesWin('.note__popup', 200, 'note__popup', result); //Объект окна заметки с самой заметкой. Логику получения данных из БД нужно будет переделать
                        result.$rootNoteObj = $(targetCell);

                        widgetEditorNote.openWidget(result); //Создание объекта окна заметки
                    } catch (err) {
                        alert('Произошла ошибка на сервере');
                        console.log(err);
                    }
                }
            }
        );
    }
}

AdminCalendar.prototype.handlerEmptyDays = function (target) {
    if (this.$obj.attr('data-admin') === 'true' && $(target).attr('data-is-note') !== 'true') { //Проверка атрибута Календаря и проверка того, что у ячейки не стоит атрибута ячейки с заметкой
        widgetAddNote.openWidget({
            date: $(target).attr('data-date'),
            $rootNoteObj: $(target)
        }); //Создание объекта окна заметки
    }

}


AdminCalendar.prototype.removeHandler = function () { //Функция удаления обработчиков на ячейки
    this.$obj.find('.calendar__cell[data-date]').not(this.$noteCell).off('click');
    this.$noteCell.off('click');
}