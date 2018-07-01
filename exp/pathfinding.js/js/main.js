(function($) {
    $(document).ready(function () {
        // suppress select events
        $(window).bind('selectstart', function(event) {
            event.preventDefault();
        });
        // initialize visualization
        Panel.init();
        Controller.init();
    });
})(jQuery);