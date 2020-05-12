$(document).ready(function () {

    /*var calendar = new Calendar('.calendar');
    calendar.launch();*/

    calendar = new AdminCalendar('.calendar');
    calendar.launch();


    var fileSection = new AdminFileSection('.file-section');
    fileSection.launch();


    if ($('.pagination')[0]) {
        var pagination = new Pagination('.pagination', '.pagination__item');
        pagination.launch();
    }


    //Функция для обновления текстов на странице
    //updText - Новый текст
    //col - обновляемая колонка
    function updateIndexText(updText, col) {

        var fd = new FormData();
        fd.append('col', col);
        fd.append('text', updText);

        $.ajax({
            url: '/ajax-handlers/update-index-text.php',
            data: fd,
            processData: false,
            contentType: false,
            type: 'POST',
            success: function (result) {
                console.log(result);
                if (result === 'NoData') {
                    alert('Ошибка данных. Перезагрузите страницу');
                } else if (result === 'NoUpd') {
                    alert('Ошибка при обновлении текста. Текст не изменился');
                } else if (result === 'NoText') {
                    alert('Текстовое поле пусто. Текст не изменился');
                } else if (result === 'NotFoundCol') {
                    alert('Ошибка запроса. Перезагрузите страницу');
                } else if (+result !== 1) {
                    alert('На сервере произошла ошибка');
                }
            }
        });

    }


    var textRedactor = new TextRedactor('.contenteditable', updateIndexText);
    textRedactor.launch();

    //Обработчик для картинок на странице которые можно обновлять
    $('.button-to-upload-photo').on(
        'click',
        function () {
            var $parentObj = $(this).closest('.parent-block-upd-photo'); //Родительский блок кнопки
            var photoPathColName = $parentObj.attr('data-table-name'); //Колонка для пути картинки

            //Функция для обновления картинок на странице
            //dataPath - путь к картинке
            function uploadPhotoInIndex(dataPath) {
                $.post(
                    '/ajax-handlers/remove-photo-from-index.php',
                    'col=' + photoPathColName + '&' + 'dataImg=' + dataPath,
                    function (result) {
                        console.log(result);
                        if (result === 'NotFoundCol' || result === 'NoQuery' || result === 'NoPath') {
                            alert('Ошибка запроса. Перезагрузите страницу');
                            return false;
                        }

                        $.post(
                            '/ajax-handlers/add-photo-in-index.php',
                            'col=' + photoPathColName + '&' + 'data=' + dataPath,
                            function (result) {
                                if (result === 'NotFoundCol') {
                                    alert('Ошибка запроса. Перезагрузите страницу');
                                } else if (+result === 1) {
                                    console.log(dataPath);
                                    $parentObj.attr('style', 'background-image: url(\'' + dataPath + '\')'); //Изменение картинки на странице
                                } else {
                                    alert('Ошибка на сервере. Перезагрузите страницу');
                                }
                            }
                        );
                    }
                );
            }

            var uploadPhotoInIndexWrap = uploadPhotoInIndex.bind(this); //Биндим функцию к текущему контексту вызовов

            var objImgSize = { //Объект с размерами картинок, нужен для задания характеристик масштабирования
                imgWidth: null,
                imgHeight: null
            }

            if (photoPathColName === 'main_profile_photo_path') { //Если это главная картинка сайта, то задаются след.значения
                objImgSize.imgWidth = 2000;
                objImgSize.imgHeight = 1200;
            } else if (photoPathColName === 'about_me_photo_path') { //Если это вторичная картинка сайта, то задаются след.значения
                objImgSize.imgWidth = 500;
                objImgSize.imgHeight = 335;
            } else { //Если картинка не подходит ни под одно условие, то задаются след.значения
                objImgSize.imgWidth = 1500;
                objImgSize.imgHeight = 1000;
            }

            var photoLoader = new PhotoLoader(200, 'photo-loader__popup', uploadPhotoInIndexWrap, objImgSize);
            photoLoader.createPhotoLoader();
        }
    );


    setInterval(function () {
        $.post(
            '/ajax-handlers/sess-regen.php',
            function (result) {
                console.log('sess verif');
            }
        );
    }, 150 * 1000);


    function timeoutSessOut() {
        return setTimeout(function () {
            document.location.href = "/admin-panel.php?action=logout&mess=limitsess";
        }, 9000 * 1000);
    }


    function addTimeoutSessOutHandle() {
        var timeoutId = timeoutSessOut();

        var handler = function (e) {
            clearTimeout(timeoutId);
            console.log(e);
            $(document).off('keypress scroll mousemove click', handler);

            setTimeout(function () {
                addTimeoutSessOutHandle();
            }, 30 * 1000);
        }

        $(document).on('keypress scroll mousemove click', handler);
    }

    addTimeoutSessOutHandle();


});