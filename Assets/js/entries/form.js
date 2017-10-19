$(function() {

    var initSortable = function(){
        // Orderable shop images
        $('#widgets-table').sortable({
            containerSelector: '#widgets-table',
            itemPath : '> tbody',
            itemSelector : '.widget-tr',
            handle : '.widget-tr-handle',
            onDrop : function($item, container, _super, event) {

                $item.removeClass(container.group.options.draggedClass).removeAttr("style");
                $("body").removeClass(container.group.options.bodyClass);

                var order = [];
                var id;

                $.each( $(container.el).find('tr'), function (i, tr) {
                    if( id = $(tr).data('content-block-id') ) {
                        order.push( id );
                    }
                });
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

    var loadWysiwygOnPageload = function(){
        var count = $('#widgets-table tr').length;
        if(!count) {
            $('#select-widget').val('simple_text');
            $('#add-widget-button').trigger('click');
        }
    };

    var replaceAll = function(search, replacement, source) {
        return source.split(search).join(replacement);
    };

    var randomString = function() {
        var text = "";
        var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

        for (var i = 0; i < 5; i++)
            text += possible.charAt(Math.floor(Math.random() * possible.length));

        return text;
    };

    $.get('/admin/content/entries/widgets', function(widgets){

        $('body').on('click', '#add-widget-button', function(){
            var key = $('#select-widget option:selected').val();
            var data = widgets[key];

            var contentBlockId = randomString();
            var javascriptKey = data.javascript_key;
            var template = data.backend_template || data.name;

            var withBorder = data.backend_with_border ? 'with-border' : '';

            var html = $('#widget-tr-template').html();
            html = replaceAll('{{ contentBlockId }}', contentBlockId, html);
            html = replaceAll('{{ key }}', key, html);
            html = replaceAll('{{ javascriptKey }}', javascriptKey, html);
            html = replaceAll('{{ withBorder }}', withBorder, html);
            html = replaceAll('{{ template }}', template, html);

            if( $('#widgets-table tbody .widget-tr').length ) {
                $('#widgets-table tbody .widget-tr:last').after(html);
            } else {
                $('#widgets-table tbody').html(html);
            }

            hideOrShowCountMessage();
            initSortable();

            var callable = onWidgetAdded[key];
            if(callable){
                var widgetTr = $('#widgets-table .widget-tr:last');
                callable(widgetTr);
            }
        });

        // On page load - show wysiwyg, if there are no widgets
        loadWysiwygOnPageload();
    });

    // Delete widget blocks
    $('body').on('click', '.delete-widget', function(){

        var closestTr = $(this).closest('tr');

        swal({
            title: 'Are you sure?',
            text: 'Do you really want to remove this block?',
            type: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes',
            confirmButtonColor: "#DD6B55",
            cancelButtonText: 'Cancel'
        }).then(function() {
            // Yes
            $(closestTr).fadeOut(function(){
                $(this).remove();
            });
        }, function(dismiss) {
            // Cancel
        });
    });

    // On page load, initialize widgets
    $('#widgets-table tr').each(function(index, widgetTr){

        var key = $(widgetTr).data('key');

        var callable = onWidgetAdded[key];
        if(callable){
            callable(widgetTr);
        }
    });

    // After widgets have been initialised - init sortable
    initSortable();

    // Init switchery
    $('.switchery').each(function(i, switcher) {
        new Switchery(switcher);
        $(switcher).closest('.hidden-switchery').show();
    });

    // Slug generation
    $('body').on('keyup', 'input.title', function(){
        var title = $(this).val();
        var slug = Netcore.slugify(title);
        $(this).closest('.tab-pane').find('input.slug').val(slug);
    });

    $('body').on('click', '#submit-button', function(){

        var dataForBackend = $(this).closest('form').serializeArray();

        var widgets = [];

        $('#widgets-table .widget-tr').each(function(i, o){

            var key = $(o).data('key');
            var javascriptKey = $(o).data('javascript-key');
            var contentBlockId = $(o).data('contentBlockId');
            var collector = widgetDataCollectors[javascriptKey];

            var item = {
                'order': i,
                'widget': key,
                'contentBlockId': contentBlockId
            };

            if(collector) {
                item['data'] = collector($(this));
            }

            widgets.push(item);
        });

        dataForBackend.push({
            name: 'widgets',
            value: JSON.stringify(widgets)
        });

        var form = $(this).closest('form');

        // Reset errors
        $(form).find('.has-error').removeClass('has-error');
        $(form).find('.error-span').text('');

        // Post to backend
        $.ajax({
            url: $(form).attr('action'),
            type: $(form).attr('method'),
            data: dataForBackend,
            dataType: 'json',
            success: function (response) {
                if(response.redirect_to) {
                    window.location.href = response.redirect_to;
                } else {
                    $.growl.notice({
                        title : 'Success!',
                        message : 'Data saved!'
                    });
                }
            },
            error: function (xhr) {
                var errors = xhr.responseJSON.errors;

                $.each(errors, function(key, value){

                    if(key == 'widgets') {
                        $.each(value, function(index, object){
                            $.each(object, function(name, value){

                                var splitted = name.split('.');
                                var widgetBlockIndex = splitted[1]; // e.g. "0"
                                var isoCode = splitted[2]; // e.g. "en"
                                var field = splitted[3]; // e.g. "content"

                                $('.template-container-header').eq(widgetBlockIndex)
                                    .addClass('has-error');

                                $('.template-container').eq(widgetBlockIndex)
                                    .find('.error-span[data-field="' + isoCode + '-' + field + '"]')
                                    .text(value);
                            });
                        });
                    } else {
                        var splitted = key.split('.');

                        var htmlName = splitted[0];
                        splitted.shift();

                        $.each(splitted, function(i, string){
                            htmlName += '[' + string + ']';
                        });

                        var formGroup = $('input[name="' + htmlName + '"]').closest('.form-group');
                        $(formGroup).addClass('has-error');
                        $(formGroup).find('.error-span').text(value);
                    }
                });

                $('html, body').animate({
                    scrollTop: $(".has-error:first").offset().top - 100
                }, 500);
            }
        });
    });
});
