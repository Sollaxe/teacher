function Header(obj) {
    this.$obj = $(obj);
    this.objHeight = this.$obj.height();
}

function PortHeader(obj) {
    Header.apply(this, arguments);
    var self = this;

    this.currentStatus = this.$obj.attr('data-status'); //Текущий статус хэдера, содержит статус состояние вида: закреплён/незакреплён. Значение бёрется из атрибута  html
}

PortHeader.prototype = Object.create(Header.prototype);
PortHeader.prototype.constructor = PortHeader;

PortHeader.prototype.pin = function () { //Закрепляет хэдер наверху, делает его прозрачным. Преобразовния происходят посредством удаления и добавления классов
    this.$obj.removeClass('body__header_scroll');
    this.$obj.removeClass('header_theme_white');

    this.$obj.addClass('body__header_fixed');
    this.$obj.addClass('header_theme_trans');

    this.$obj.attr('data-status', 'fixed');
    this.currentStatus = 'fixed'; //Меняет статус хэдера. Ставит значение статуса: "зафиксирован сверху"
}

PortHeader.prototype.unpin = function () { //Открепляет хэдер от верха документа, делает его фиксированным и белым. Преобразовния происходят посредством удаления и добавления классов
    this.$obj.removeClass('body__header_fixed');
    this.$obj.removeClass('header_theme_trans');

    this.$obj.addClass('body__header_scroll');
    this.$obj.addClass('header_theme_white');

    this.$obj.attr('data-status', 'scroll');
    this.currentStatus = 'scroll'; //Меняет статус хэдера. Ставит значение статуса: "Плавает сверху"
}

PortHeader.prototype.launch = function () { //Функция запускающая хэдер
    var self = this;

    $(document).on( //Обработчик скролла документа
        'scroll',
        function () {
            if (globalParam.scrollTop >= self.objHeight && self.currentStatus === 'fixed') { //Проверяет скролл и статус хэдера. Если скролл больше высоты хэдера и статус: "Зафиксирован сверху", то запускается функция открепления
                self.unpin();
            } else if (globalParam.scrollTop < self.objHeight && self.currentStatus === 'scroll') { //Проверяет скролл и статус хэдера. Если скролл меньше высоты хэдера и статус: "Плавает сверху", то запускается функция прикрипления
                self.pin();
            }
        }
    );
}



  
