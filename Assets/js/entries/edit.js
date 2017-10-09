$(function() {

    var initSortable = function(){
        // Orderable shop images
        $('#widgets-table').sortable({
            containerSelector: 'table',
            itemPath : '> tbody',
            itemSelector : 'tr',
            handle : '.handle',
            onDrop : function($item, container, _super, event) {

                $item.removeClass(container.group.options.draggedClass).removeAttr("style");
                $("body").removeClass(container.group.options.bodyClass);

                var order = [];
                var id;

                $.each( $(container.el).find('tr'), function (i, tr) {
                    if( id = $(tr).data('id') ) {
                        order.push( id );
                    }
                });

                //$.post($('#images-table').data('order-route'), { order : order }, function() {
                //$.growl.notice({
                //title : 'Veiksmīgi!',
                //message : 'Secība saglabāta'
                //});
                //});
            }
        });
    };

    var hideOrShowCountMessage = function(){
        var count = $('#widgets-table tr').length;
        if(!count) {
            $('#widgets-container #no-widgets').show();
        } else {
            $('#widgets-container #no-widgets').hide();
        }
    };

    $.get('/admin/content/entries/widgets', function(widgets){

        $('body').on('click', '#add-widget-button', function(){
            var key = $('#select-widget option:selected').val();
            var data = widgets[key];

            var id = '';
            var template = data.backend_template || data.name;
            var html = '<tr data-id="'+id+'">';
            html += '<td>';
            html += '<div class="template-container ' + (data.backend_with_border ? 'with-border' : '') + '">';

            html += '<div class="template-container-header handle">';
            html += '<span class="fa fa-icon fa-arrows"></span>' ;
            html += '<a class="delete-widget">Delete</a>' ;
            html += '</div>';

            html += '<div class="template-container-body">';
            html += template;
            html += '</div>';

            html += '</div>';
            html += '</td>';
            html += '</tr>';

            if( $('#widgets-table tbody tr').length ) {
                $('#widgets-table tbody tr:last').after(html);
            } else {
                $('#widgets-table tbody').html(html);
            }

            hideOrShowCountMessage();
            initSortable();

            var callable = onWidgetAdded[key];
            if(callable){
                callable();
            }
        });
    });

});