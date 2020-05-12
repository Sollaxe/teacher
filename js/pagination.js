function Pagination(obj, pagiItem) {
    this.$obj = $(obj); //Объект пагинации
    this.$pagiItem = $(pagiItem); //плитки страниц пагинации
    this.objWidth = parseInt(this.$obj.css('width')); //Ширина объекта пагинации
    this.currentPage = +this.$obj.attr('data-current-page'); //Текущая страница пагинации


    this.widthPagiArrow = parseInt(this.$pagiItem.eq(0).css('width')); //Ширина плитки-стрелки переключателя плиток страниц
    this.marginPagiItem = parseInt(this.$pagiItem.eq(0).css('margin-right')); //Запись правого отступа от плитки страниц
    this.widthPagiItem = parseInt(this.$pagiItem.css('max-width')); //Максимальная ширина плитки с номером страницы

    this.offsetWidthPagiItem = this.widthPagiItem + this.marginPagiItem; //Макс.ширина плитки и отступ плитки, т.ё. занимаемое плиткой место
    //Количество элементов пагинации которое может вместиться на страницу
    this.valPagiItemToCreate = Math.floor((this.objWidth - (2 * (this.widthPagiArrow + this.marginPagiItem))) / this.offsetWidthPagiItem);

    this.pagiItemSelector = pagiItem; //Селектор плиток страниц пагинации
    this.valPage = +this.$obj.attr('data-val-page'); //Количество страниц для пагинации

    console.log(this.valPagiItemToCreate);

}

Pagination.prototype.constructor = Pagination;

Pagination.prototype.nextItem = function () { //Функция перелистывания пагинации вперёд
    var self = this;
    if (this.lastItemNum < this.valPage) { //Проверка не является ли последняя плитка-страница в блоке пагинации ссылкой на последнюю страницу с файлами на сайте

        this.lastItemNum++; //Инкремент номера последнего элемента пагинации
        this.firstItemNum++; //Инеремент номера первого элемента пагинации
        this.$pagiItem.eq(1).off('click').remove(); //Удаление первого элемента пагинации

        var $newPagiItem = $('<div>', {
            class: 'pagination__item pagination__item-num pagination__item_style_num',
            "data-act": 'go-to-page',
            "data-pagenum": this.lastItemNum,

            on: {
                click: function () {
                    self.handlerClickPagiItem(event.currentTarget);
                }
            },

            append: $('<span>', {
                class: 'pagination__item-text text',
                text: this.lastItemNum
            })
        }).insertAfter(this.$pagiItem.eq(-2));

        //Удаление старого и запись нового элемента, в объект с элементами
        this.$pagiItem.splice(1, 1);
        this.$pagiItem.splice(-1, 0, $newPagiItem[0]);

        console.log(this.$pagiItem);

        if (this.lastItemNum === this.currentPage) { //Если первый элемент (по-сути, добавленный только что) пагинации является текущей страницей, то ему задаются соответствующие стили
            $newPagiItem.addClass('pagination__item_style_fill').addClass('pagination__item_current-page');
            $newPagiItem.removeAttr('data-act');
        }
    }
}

Pagination.prototype.prevItem = function () { //функция перелистывания пагинации назад
    var self = this;
    if (this.firstItemNum > 1) { //Проверка не является ли первый элемент пагинации меньше или равен одному

        this.lastItemNum--; //Дикремент номера последнего элемента пагинации
        this.firstItemNum--; //Дикремент номера первого элемента пагинации
        this.$pagiItem.eq(-2).off('click').remove(); //Удаление последнего элемента пагинации

        var $newPagiItem = $('<div>', {
            class: 'pagination__item pagination__item-num pagination__item_style_num',
            "data-act": 'go-to-page',
            "data-pagenum": this.firstItemNum,

            on: {
                click: function () {
                    self.handlerClickPagiItem(event.currentTarget);
                }
            },

            append: $('<span>', {
                class: 'pagination__item-text text',
                text: this.firstItemNum
            })
        }).insertAfter(this.$pagiItem.eq(0));

        //Удаление старого и запись нового элемента, в объект с элементами
        this.$pagiItem.splice(-2, 1);
        this.$pagiItem.splice(1, 0, $newPagiItem[0]);

        console.log(this.$pagiItem);

        if (this.firstItemNum === this.currentPage) { //Если последний элемент (по-сути, добавленный только что) пагинации является текущей страницей, то ему задаются соответствующие стили
            $newPagiItem.addClass('pagination__item_style_fill').addClass('pagination__item_current-page');
            $newPagiItem.removeAttr('data-act');
        }
    }
}

Pagination.prototype.launch = function () { //функция запуска пагинации
    var self = this;

    var $newPagiItem = $('<div>', {
        class: 'pagination__item pagination__item_current-page pagination__item_style_fill',
        "data-pagenum": this.currentPage,

        append: $('<span>', {
            class: 'pagination__item-text text',
            text: this.currentPage
        })
    }).insertAfter(this.$pagiItem.eq(0));


    for (var i = 1, pI = 1; i < this.valPagiItemToCreate && i < this.valPage; i++) {
        console.log(i);

        //Если новый элемент пагинации превышает количество необходимых страниц, то слева от элемента пагинации текущей страницы создаётся элемент со значением меньше на один чем последующий
        if ((i + this.currentPage) > this.valPage) {

            var $newPagiItem = $('<div>', {
                class: 'pagination__item pagination__item-num pagination__item_style_num',
                "data-act": 'go-to-page',
                "data-pagenum": this.currentPage - pI,

                on: {
                    click: function () {
                        self.handlerClickPagiItem(event.currentTarget);
                    }
                },

                append: $('<span>', {
                    class: 'pagination__item-text text',
                    text: this.currentPage - pI
                })
            }).insertAfter(this.$pagiItem.eq(0));

            pI++; //Инкремент prevIter, считает сколько уже было создано элементов предшевствующих элемент текущей страницы (Если отнять один)

            continue;
        }

        var $newPagiItem = $('<div>', {
            class: 'pagination__item pagination__item-num pagination__item_style_num',
            "data-act": 'go-to-page',
            "data-pagenum": i + this.currentPage,

            on: {
                click: function () {
                    self.handlerClickPagiItem(event.currentTarget);
                }
            },

            append: $('<span>', {
                class: 'pagination__item-text text',
                text: i + this.currentPage
            })
        }).insertBefore(this.$pagiItem.eq(-1));
    }

    this.$pagiItem = $(this.pagiItemSelector); //Запись в объект с элементами пагинации всех элементов пагинации

    this.lastItemNum = +this.$pagiItem.eq(-2).attr('data-pagenum'); //Номер последней страницы с файлами на сайте на которую ссылается плитка-странца
    this.firstItemNum = +this.$pagiItem.eq(1).attr('data-pagenum'); //Номер первой страницы с файлами на сайте на которую ссылается плитка-странца

    //Обработчик для клика на стрелку перелистывающую пагинацию вперёд
    $('.pagination__item-arrow-next').on(
        'click',
        function () {
            self.nextItem(); //Вызов метода перелистывающего пагинацию вперед
        }
    );

    //Обработчик для клика на стрелку перелистывающую пагинацию назад
    $('.pagination__item-arrow-prev').on(
        'click',
        function () {
            self.prevItem(); //Вызов метода перелистывающего пагинацию вперед
        }
    );
}


//Метод добавляющий обработчики на элементы пагинации
Pagination.prototype.addHandlerPaginationItem = function () {
    var self = this;
    this.$obj.find(this.pagiItemSelector + '[data-act="go-to-page"]').on(
        'click',
        function () {
            self.handlerClickPagiItem(event.currentTarget);
        }
    );
}

Pagination.prototype.handlerClickPagiItem = function (target) {
    var currentPageNum = $(target).attr('data-pagenum'); //Номер страницы
    $('#form__search-input').blur(); //Блюрим поле поиска, чтобы у него сработало событие change если оно было изменено

    //Если данные в форме менялись, то они приводятся к изначальным значениями
    if (+$('#form').attr('data-search-is-change')) {
        $('#form__search-input').val($('#form').attr('data-init-query'));
        $('#form__select').val($('#form').attr('data-init-cat'));
    }

    $('#form__scroll-top').val(globalParam.scrollTop); //Запись текущего скролла в скрытое поле созданное для хранения значения этого скролла
    $('#form__page').val(currentPageNum); //Запись номера страницы, на которую совершается переход, в скрытое поле созданное для хранения текущей страницы
    $('#form').submit(); //Вызов события submit для формы
}

//Метод удаляющий обработчики на элементах пагинации
Pagination.prototype.removeHandlerPaginationItem = function () {
    this.$obj.find(this.pagiItemSelector + '[data-act="go-to-page"]').off('click');
}


//html элемента пагинации являющегося текущей страницей
/*     <div data-pagenum="' + this.currentPage + '" class="pagination__item pagination__item_style_fill pagination__item_current-page">\
        <span class="pagination__item-text text">' + this.currentPage + '</span>\
      </div>\*/


//html обычного элемента пагинации
/*<div data-act="go-to-page" data-pagenum="'+ this.lastItemNum +'" class="pagination__item pagination__item-num pagination__item_style_num">\
    <span class="pagination__item-text text">'+ this.lastItemNum +'</span>\
  </div>\*/
