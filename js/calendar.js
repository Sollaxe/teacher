var simpleNote = new NotesWin(200, 'note__popup', 'simple-note');

//Конструктор-класс календаря
function Calendar(obj) {
    this.$obj = $(obj); //объект календаря
    this.$noteCell = this.$obj.find('.calendar__cell_note'); //ячейки календаря в которых есть заметки
    this.$cell = this.$obj.find('.calendar__cell'); //Обычные ячейки календаря
    this.$monthName = this.$obj.find('.calendar__month'); //объект в котором должно быть название месяца (подразумевается что его сначала нет, оно генерируется кодом)
    this.objNoteCells = [];
    this.$cellWithNum = $();

    this.monthNameArr = [ //Массив с названиями месяцев на русском языке
        'Январь',
        'Февраль',
        'Март',
        'Апрель',
        'Май',
        'Июнь',
        'Июль',
        'Август',
        'Сентябрь',
        'Октябрь',
        'Ноябрь',
        'Декабрь'
    ];

    this.globalDate = new Date(dateCurrentYearNum, dateCurrentMonthNum - 1); //Объект Date, с данными текущего месяца и года которые берутся с сервера через php и записываюся в переменные Js
    this.currentMonthYearStr = this.monthNameArr[this.globalDate.getMonth()] + ' ' + this.globalDate.getFullYear(); //Строка с текущим месяцем и годом, которая будет вставлена в объект с названием месяца
    this.currentMonthNum = this.globalDate.getMonth(); //Номер текущего месяца. от 0 до 11
}

Calendar.prototype.launch = function () { //Функция запуска календаря
    var self = this;


    //Нельзя нарушать последовательность вызова функций, может привести к неожиданным последствиям!!!
    this.createCells(); //Вызов функции создающей наполнение ячеек. Подробнее смотри в описании самой функции. Лучше посмотреть, потому что это важно, функция сложная

}

Calendar.prototype.addArrowHandler = function () { //Функция добавляющая обработчики для срелок переключателей месяца
    var self = this;

    this.$obj.find('.calendar__arrow[data-arrow-act="move-forward"]').on( //Обработчик для стрелки переключающей на след.месяц
        'click',
        function () {
            self.removeCells();
            self.globalDate.setMonth(self.globalDate.getMonth() + 1); //Установка след.месяца для объекта Date
            self.currentMonthYearStr = self.monthNameArr[self.globalDate.getMonth()] + ' ' + self.globalDate.getFullYear(); //Строка со след.месяцем и, возможно, годом, будет вставлена в объект с названием месяца
            self.currentMonthNum = self.globalDate.getMonth(); //Номер след.месяца. от 0 до 11

            self.createCells(); //Вызов функции создающей наполнение ячеек
        }
    );

    this.$obj.find('.calendar__arrow[data-arrow-act="move-backward"]').on( //Обработчик для стрелки переключающей на пред.месяц
        'click',
        function () {
            self.removeCells();
            self.globalDate.setMonth(self.globalDate.getMonth() - 1); //установление пред.месяца для объекта Date
            self.currentMonthYearStr = self.monthNameArr[self.globalDate.getMonth()] + ' ' + self.globalDate.getFullYear(); //Строка со пред.месяцем и, возможно, годом, будет вставлена в объект с названием месяца
            self.currentMonthNum = self.globalDate.getMonth(); //Номер пред.месяца. от 0 до 11

            self.createCells(); //Вызов функции создающей наполнение ячеек
        }
    );
}

Calendar.prototype.removeArrowHandler = function () {
    this.$obj.find('.calendar__arrow[data-arrow-act="move-forward"]').off('click');
    this.$obj.find('.calendar__arrow[data-arrow-act="move-backward"]').off('click');
}


Calendar.prototype.addHandler = function () { //функция установки стандартого обработчика на ячейки с заметками
    var self = this;

    this.$noteCell.on(
        'click',
        function () {
            if ($(this).attr('data-is-note') === 'true') { //Проверка яляется ли данная ячейка заметкой

                var dataId = $(this).attr('data-id'); //id заметки

                var ajaxId = 'nid=' + dataId;
                $.post(
                    '/ajax-handlers/calendar-get-data-cell.php',
                    ajaxId,
                    function (result) {
                        console.log(result);
                        if (result === "NoId") {
                            alert('Заметка не найдена');
                            return false;
                        }
                        try {
                            var result = JSON.parse(result); //Объект с данными заметки
                            //Вызов конструктора создающего виджет заметки. Логику получения данных с БД нужно будет переделать!

                            simpleNote.openWidget(result);
                        } catch (err) {
                            alert('На сервере произошла ошибка');
                            console.log(err);
                        }
                    }
                );
            }
        }
    );
}

Calendar.prototype.removeHandler = function () { //Функция удаления стандартного обработчика на ячейки с заметками
    this.$noteCell.off('click');
}


//Метод для удаления ячеек
Calendar.prototype.removeCells = function () {
    this.$cell.html(''); //Удаление содержимого всех ячеек
    this.$cell.removeAttr('data-date'); //Удаление атрибутов даты для всех ячеек

    this.$noteCell.removeAttr('data-is-note');
    this.$noteCell.removeAttr('data-pubdate');
    this.$noteCell.removeAttr('data-id');
    this.$noteCell.removeClass('calendar__cell_note');
}


//Функция создаёт наполнение ячеек. По-сути она нумерует содержимое ячеек, добаляет атрибуты в соответсвии с месяцем и годом исходя из нынешних данных о выбранном или текущем месяце и годе
//Из нетривиального, она добавляет или изменяет название месяца. Из названия функции это может быть не понятно, но изменить логику действия будет не очень сподручно
Calendar.prototype.createCells = function () {
    var self = this;

    this.removeArrowHandler(); //Удаление обработчиков для стрелок переключающих страницы календаря
    self.removeHandler(); //Удаление обработчиков ячеек


    this.$monthName.html(this.currentMonthYearStr); //Добавление/изменение содержимого блока с названием месяца и года
    this.globalDate.setDate(1); //Устанавливает объекту Date 1 число месяца

    var month = this.globalDate.getMonth(); //Сохраняет текущее число месяца. от 0 до 11

    var strMonth = (month + 1) + ''; //Форматирует число месяца если считать что исчисление месяцев начинается с 1 (т.е. от 1 до 12), а не с 0(как в программировании от 0 до 11), потом сохраняет число месяца как строку

    if (strMonth.length < 2) { //Если номер месяца имеет всего один знак, то в начале добавляется ноль
        strMonth = '0' + strMonth;
    }

    var year = this.globalDate.getFullYear(); //Получение текушего года
    var cellIndexStart = 0; //Индекс дня с которого начинается заполнение ячеек


    this.$cell.each(function (index, el) { //Перебор ячеек
        if (self.globalDate.getDay() === +$(this).attr('data-day')) { //Если индекс дня первого числа месяца совпадает с индексом дня ячейки, то записывается индекс этой ячейки
            cellIndexStart = index; //Запист индекса ячейкм
            return false; //Прерывание перебора ячеек
        }
    });

    for (var i = cellIndexStart; ; i++) { //Бесконечный цикл с итератором который изначально равен индексу первой заполняемой ячейки

        var $currentCell = this.$cell.eq(i); //Текущая перебираемая ячейка
        this.$cellWithNum.push($currentCell[0]);
        var date = this.globalDate.getDate() + ''; //Число месяца для текущей перебираемой ячейки. Приводится в строковой тип

        if (date.length < 2) { //Если число имеет всего один знак то, добавляется ноль в начале
            date = '0' + date;
        }

        $currentCell.html(this.globalDate.getDate()); //Запись в текущую перебираемую ячеку текущего числа
        var dateCell = $currentCell.attr('data-date', date + '.' + strMonth + '.' + year); //Запись в атрибут даты, даты соответствующей данной ячейке


        this.globalDate.setDate(this.globalDate.getDate() + 1); //Установка в объект Date следующего числа

        if (this.globalDate.getMonth() !== this.currentMonthNum) { //Если месяц из объекта Date установленный в цикле не соответсвует текущему месяцу раздела календаря, то происходит следующее:
            this.globalDate.setMonth(this.globalDate.getMonth() - 1); //Установка предыдущего месяца

            //Установка предыдущего месяца сделана для того, чтобы не было ошибок с исчеслением месяцев
            //Ошибка исчесления происходит потому, что в цикле мы устанавливаем в Date следующее от текущего число, и если оно больше чем чисел в месяце, то месяц тоже меняется
            //А благодаря смене месяцев мы выходим из бесконечного цикла. Поэтому нужно "откатывать" месяц назад

            break; //Выход из бесконечного цикла. Не убирай! А то плохо будет!
        }
    }

    var ajaxData = strMonth + '.' + year; //Переменная с текущим месяцем и годом

    //Ajax запрашивающий данные о заметках текущего месяца
    $.post(
        '/ajax-handlers/calendar-get-month-cells.php',
        'mon=' + ajaxData,
        function (result) {
            console.log(result);
            try {
                var objNoteCells = JSON.parse(result); //Объект с данными заметок текущего месяца


                //Цикл перебирающий ячейки в которых могут быть заметки
                self.$cellWithNum.each(function (index, el) {
                    var $currentCell = $(this); //Текущая ячейка
                    var dateCurrentCell = $currentCell.attr('data-date'); //Дата текущей ячейки

                    //Цикл перебирающий объект с данными заметок текущего месяца
                    objNoteCells.forEach(function (item, i, arr) {
                        if (item !== null) {
                            if (dateCurrentCell === item.date) { //Если дата текущей перебираемой заметки, равна дате текущей перебираемой ячейки, то ячейка становится заметкой
                                $currentCell.attr('data-is-note', 'true');
                                $currentCell.attr('data-pubdate', item.date);
                                $currentCell.attr('data-id', item.note_id);
                                $currentCell.addClass('calendar__cell_note');
                            }
                        }
                    });

                });
                self.$noteCell = self.$obj.find('.calendar__cell_note'); //Запись в объект всех заметок

                self.addHandler(); //Добавление обработчиков ячеек
                self.addArrowHandler(); //Добавление обработчиков для стрелок переключающих страницы календаря
            } catch (err) {
                alert('При получении заметок, произошла ошибка');
                console.log(err);
            }
        }
    );
}