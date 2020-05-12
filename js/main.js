$(document).ready(function () { //Задание глобальных параметров документа
    globalParam.docWidth = $(document).width(); //Ширина документа
    globalParam.docHeight = $(document).height(); //Высота документа
    globalParam.scrollTop = $(document).scrollTop(); //Высота прокрутки документа

    $(document).on(
        'scroll',
        function () {
            globalParam.scrollTop = $(document).scrollTop(); //Изменение высоты прокрутки документа при скролле
        }
    );
});