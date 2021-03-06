$(function () {
    $('.js-toggle-panel-body').click(function (e) {
        e.preventDefault();
        $(this).parent().parent().next().slideToggle();
    });

    $('.js-toggle-attachment-featured').change(function () {
        var isChecked = 0;
        var id = $(this).data('id');
        if(this.checked) {
            var isChecked = 1;
        }

        $.ajax({
            type: 'POST',
            data: {
                id: id,
                state: isChecked
            },
            url: '/admin/content/attachment/state',
            success: function (data) {
                $.growl.success({
                    title: 'Success!',
                    message: 'State changed!'
                });
            }
        });
    });

    var initSortable = function () {
        $('.widgets-container').each(function (index, container) {
            $(container).find('.widgets-table').sortable({
                containerSelector: '.widgets-table',
                itemPath: '> tbody',
                itemSelector: '.widget-tr',
                handle: '.widget-tr-handle',
                onDrop: function ($item, container, _super, event) {

                    $item.removeClass(container.group.options.draggedClass).removeAttr("style");
                    $("body").removeClass(container.group.options.bodyClass);

                    var order = [];
                    var id;

                    $.each($(container.el).find('tr'), function (i, tr) {
                        if (id = $(tr).data('content-block-id')) {
                            order.push(id);
                        }
                    });
                }
            });
        });
    };

    var initSummernote = function(btn){
        // Initialize

        var widgetTr = $(btn).closest('.widget-tr');
        var textareas = $(widgetTr).find('.image-blocks-summernote:not(.initialized)');
        if(!btn) {
            var textareas = $('.image-blocks-summernote:not(.initialized)');
        }
        $.each(textareas, function(i, object){
            $.each(textareas, function(i, object){
                $(object).addClass('initialized').summernote({
                    height: 210,
                    focus: true,
                    toolbar: [
                        ['style', ['bold', 'italic', 'underline', 'clear']],
                        ['fontsize', ['fontsize']],
                        ['color', ['color']],
                        ['style', ['style']],
                        ['para', ['ul', 'ol', 'paragraph']],
                        ['height', ['height']],
                        ['insert', ['picture', 'video', 'link', 'table']],
                        ['codeview', ['codeview']],
                        ['cleaner', ['cleaner']]
                    ],
                    cleaner:{
                        action: 'both', // both|button|paste 'button' only cleans via toolbar button, 'paste' only clean when pasting content, both does both options.
                        newline: '<br>', // Summernote's default is to use '<p><br></p>'
                        notStyle: 'position:absolute;top:0;left:0;right:0', // Position of Notification
                        icon: '<i class="note-icon"><span class="fa fa-paint-brush"></span></i>',
                        keepHtml: false, // Remove all Html formats
                        keepOnlyTags: ['<p>', '<br>', '<ul>', '<li>', '<b>', '<strong>','<i>', '<a>'], // If keepHtml is true, remove all tags except these
                        keepClasses: false, // Remove Classes
                        badTags: ['style', 'script', 'applet', 'embed', 'noframes', 'noscript', 'html'], // Remove full tags with contents
                        badAttributes: ['style', 'start'], // Remove attributes from remaining tags
                        limitChars: false, // 0/false|# 0/false disables option
                        limitDisplay: 'both', // text|html|both
                        limitStop: false // true/false
                    },
                    fontSizes: ['10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24'],
                    tableClassName: 'table ntc-table'
                });
            });
        });
    };

    initSummernote();

    var initDatepicker = function () {
        // Datepicker assets need to be fixed
        /*
         $('.datepicker').datepicker({
         dateFormat: 'dd.mm.yy'
         });
         */
    };

    var hideOrShowCountMessage = function () {
        $('.widgets-container').each(function (index, container) {
            var count = $(container).find('.widgets-table .widget-tr').length;
            if (!count) {
                $(container).find('.no-widgets').show();
            } else {
                $(container).find('.no-widgets').hide();
            }
        });
    };

    var loadWysiwygOnPageload = function () {
        $('.widgets-container').each(function (index, container) {
            var count = $(container).find('.widgets-table .widget-tr').length;
            if (!count) {
                $('.add-widget-button').trigger('click');
            }
        });
    };

    var replaceAll = function (search, replacement, source) {
        return source.split(search).join(replacement);
    };

    var randomString = function () {
        var text = "";
        var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

        for (var i = 0; i < 5; i++)
            text += possible.charAt(Math.floor(Math.random() * possible.length));

        return text;
    };

    var initMainWidgetFields = function () {
        $('.widget-tr').each(function(index, widget){
            var id = $(widget).data('content-block-id');
            $(widget).find('.js-main-fields-block .js-input').each(function (i, field) {
                $(field).attr('name', 'main_fields[' + id + '][' + $(field).data('name') + ']');
            });
        });
    };

    $.ajax({
        url: '/admin/content/entries/widgets',
        type: 'GET',
        data: null,
        dataType: 'json',
        success: function (widgets) {

            $('body').on('click', '#add-widget-button', function () {
                var key = $('#select-widget option:selected').val();
                var data = widgets[key];

                var container = $('.widgets-container:visible');
                var locale = $(container).data('locale');

                var contentBlockId = randomString();
                var javascriptKey = data.javascript_key;
                var widgetName = data.name;
                var template = data.backend_template ? data.backend_template[locale] : data.name;

                var withBorder = data.backend_with_border ? 'with-border' : '';

                var html = $('#widget-tr-template').html();
                html = replaceAll('{{ contentBlockId }}', contentBlockId, html);
                html = replaceAll('{{ key }}', key, html);
                html = replaceAll('{{ javascriptKey }}', javascriptKey, html);
                html = replaceAll('{{ withBorder }}', withBorder, html);
                html = replaceAll('{{ template }}', template, html);
                html = replaceAll('{{ widgetName }}', widgetName, html);

                var tbody = $(container).find('.widgets-table .widgets-table-tbody');
                if ($(tbody).find('.widget-tr').length) {
                    $(tbody).find('.widget-tr:last').after(html);
                } else {
                    $(tbody).html(html);
                }

                hideOrShowCountMessage();
                initSortable();

                var callable = onWidgetAdded[javascriptKey];
                if (callable) {
                    var widgetTr = $(tbody).find('.widget-tr:last');
                    callable(widgetTr);
                }

                $('.js-main-fields-block').each(function(index, block){
                    initSummernote(block);
                });
                initMainWidgetFields();
            });

            // On page load - show wysiwyg, if there are no widgets
            loadWysiwygOnPageload();
        },
        error: function (xhr) {
            $.growl.error({
                title: 'Error!',
                message: 'Sorry, there ws an error. Please try again later or inform technical staff about this problem.',
                duration: 10000
            });
        }
    });

    // Delete widget blocks
    $('body').on('click', '.delete-widget', function () {

        var closestTr = $(this).closest('tr');

        swal({
            title: 'Are you sure?',
            text: 'Do you really want to remove this block?',
            type: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes',
            confirmButtonColor: "#DD6B55",
            cancelButtonText: 'Cancel'
        }).then(function () {
            // Yes
            $(closestTr).fadeOut(function () {
                $(this).remove();
            });
        }, function (dismiss) {
            // Cancel
        });
    });

    // On page load, initialize widgets
    $('.widgets-container').each(function (index, container) {
        $(container).find('.widgets-table .widget-tr').each(function (index, widgetTr) {

            var javascriptKey = $(widgetTr).data('javascriptKey');

            var callable = onWidgetAdded[javascriptKey];
            if (callable) {
                callable(widgetTr);
            }
        });

        window.scrollTo(0, 0);
    });

    // After widgets have been initialised - init sortable
    initSortable();

    // Init datepicker on page load
    initDatepicker();

    // Init switchery
    $('.switchery').each(function (i, switcher) {
        new Switchery(switcher);
        $(switcher).closest('.hidden-switchery').show();
    });

    // Slug generation
    $('body').on('keyup', 'input.title', function () {
        var title = $(this).val();
        var slug = Netcore.slugify(title);
        $(this).closest('.tab-pane').find('input.slug').val(slug);
    });

    // Summernote has an issue with Instert image -> Image URL
    // If link is pasted via ctrl+v keyboard shortcut, then everything is fine
    // However, it does not work with Right click -> Paster. Then "Insert image" button stays gray.
    // That's why we manually trigger "keyup" event to enable "Insert image"
    $('body').on('paste', '.note-image-url', function(){
        window.setTimeout(function(){
            $('.note-image-url').trigger('keyup');
        }, 100)
    });

    // Revisions
    $('#revisions-info-container').show();
    $("#revisions-modal").on("show.bs.modal", function(e) {
        var link = $(e.relatedTarget);
        $(this).find(".modal-body").load(link.data("href"));
    });

    $('body').on('click', '.submit-button:not(.loading)', function(){

        var btn = $(this);
        $(btn).addClass('loading');
        var dataForBackend = $(this).closest('form').serializeArray();

        var widgets = [];

        $('.widgets-container').each(function (index, container) {
            $(container).find('.widgets-table .widget-tr').each(function (i, o) {

                var key = $(o).data('key');
                var javascriptKey = $(o).data('javascript-key');
                var contentBlockId = $(o).data('contentBlockId');
                var locale = $(o).closest('.widgets-container').data('locale');
                var collector = widgetDataCollectors[javascriptKey];

                var item = {
                    'order': i,
                    'widget': key,
                    'locale': locale,
                    'contentBlockId': contentBlockId
                };

                if (collector) {
                    item['data'] = collector($(this));
                }

                widgets.push(item);
            });
        });

        dataForBackend.push({
            name: 'widgets',
            value: JSON.stringify(widgets)
        });

        var form = $(this).closest('form');

        // Reset errors
        $(form).find('.has-error').removeClass('has-error');
        $(form).find('[data-toggle="tooltip"]').tooltip('destroy');
        $(form).find('.error-span').text('');

        var formData = new FormData();

        console.log(dataForBackend);

        $(dataForBackend).each(function (index, object) {
            formData.append(object.name, object.value);
        });

        $.each(formDataImages, function (imageName, file) {
            formData.append(imageName, file);
        });

        var contentBlockFileInput = $('.js-block-file');
        $.each(contentBlockFileInput, function (i, block) {
            $.each($(block)[0].files, function (i, file) {
                formData.append($(block).attr('name'), file);
            });
        });


        // Entry attachment
        var attachmentInputs = $(this).closest('form').find('input.attachment');
        $.each(attachmentInputs, function (index, input) {
            var attachments = $(input)[0].files;
            $.each(attachments, function (i, file) {
                var name = $(input).attr('name');
                formData.append(name, file);
            });
        });

        $(btn).find('.not-loading').hide();
        $(btn).find('.loading').show();

        var saveAs = $(btn).data('save-as');
        formData.append('save_as', saveAs);

        // Post to backend
        $.ajax({
            url: $(form).attr('action'),
            type: $(form).attr('method'),
            data: formData,
            dataType: 'json',
            processData: false, // Important for FormData
            contentType: false, // Important for FormData
            success: function (response) {

                if (response.redirect_to) {
                    window.location.href = response.redirect_to;
                } else {

                    $(btn).removeClass('loading');
                    $(btn).find('.not-loading').show();

                    $.growl.notice({
                        title: 'Success!',
                        message: 'Data saved!'
                    });
                }
            },
            error: function (xhr) {

                $(btn).removeClass('loading');

                $(btn).find('.loading').hide();
                $(btn).find('.not-loading').show();

                var statusCode = xhr.status;

                if (statusCode != 422) {

                    $.growl.error({
                        title: 'Error!',
                        message: 'Sorry, there ws an error. Please try again later or inform technical staff about this problem.',
                        duration: 10000
                    });

                    return;
                }

                var errors = xhr.responseJSON.errors;

                $.each(errors, function (key, value) {

                    if (key == 'widgets') {
                        $.each(value, function (index, object) {
                            $.each(object, function (name, value) {

                                var splitted = name.split('.');
                                var type = splitted[0]; // e.g. "tableCeel" or "specificFields"

                                if (type == 'tableCell') {

                                    var widgetBlockIndex = splitted[1]; // e.g. "0"
                                    var tdId = splitted[2]; // e.g. 0

                                    // todo Pieliekam bootstrap tooltip par erroru

                                    var td = $('.template-container').eq(widgetBlockIndex)
                                        .find('td[data-td-id="' + tdId + '"]');

                                    $(td).addClass('has-error')
                                        .attr('data-toggle', 'tooltip')
                                        .attr('data-container', 'body')
                                        .attr('title', value)
                                    ;

                                    $(td).tooltip(); // Bootstrap tooltip
                                }

                                if (type == 'specificField') {
                                    var widgetBlockIndex = splitted[1]; // e.g. "0"
                                    var isoCode = splitted[2]; // e.g. "en"
                                    var field = splitted[3]; // e.g. "content"

                                    $('.template-container').eq(widgetBlockIndex)
                                        .find('.error-span[data-field="' + isoCode + '-' + field + '"]')
                                        .text(value);
                                }

                                $('.template-container-header').eq(widgetBlockIndex)
                                    .addClass('has-error');
                            });
                        });
                    } else {
                        var splitted = key.split('.');

                        var htmlName = splitted[0];
                        splitted.shift();

                        $.each(splitted, function (i, string) {
                            htmlName += '[' + string + ']';
                        });

                        var formGroup = $('input[name="' + htmlName + '"]').closest('.form-group');
                        $(formGroup).addClass('has-error');
                        $(formGroup).find('.error-span').text(value);
                    }
                });

                // Switch to tab that has error
                var firstError = $('.has-error:first');
                var visible = $(firstError).is(':visible');
                if (!visible) {
                    var closestTab = $(firstError).closest('.tab-pane');
                    if (closestTab) {
                        var id = $(closestTab).attr('id');
                        $('a[href="#' + id + '"]').click();
                    }
                }

                $('html, body').animate({
                    scrollTop: $(".has-error:first").offset().top - 100
                }, 500);
            }
        });
    });
});

