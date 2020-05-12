var fileSection;

$(document).ready(function () {

    var header = new PortHeader('.header');
    header.launch();

    var menu = new Menu('.menu__popup', 200, '.header__but-menu', '.menu__exit', '.menu__item', 100);
    menu.launch();

    var calendar = new Calendar('.calendar');
    calendar.launch();

    fileSection = new FileSection('.file-section');
    fileSection.launch();

});