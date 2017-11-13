$(document).ready(function () {
    var validTypes = ['jpg', 'png', 'jpeg'];

    function fileTypeCheck(files, validTypes) {
        var filesExt = [];
        // console.log(files.length);
        for (var i = 0; i < files.length; i++) {
            filesExt.push(files[i].name.substr(files[i].name.lastIndexOf('.') + 1).toLowerCase());
        }
        unicFilesExt = filesExt.filter(function (item, pos) {
            return filesExt.indexOf(item) == pos;
        });
        // console.log('validTypes: ' + validTypes);
        // console.log('filesExt: ' + filesExt);
        // console.log('unicFilesExt: ' + unicFilesExt);
        var invalidTypes = unicFilesExt.filter(n=> validTypes.indexOf(n) === -1);
        if (invalidTypes.length > 0) {
            // console.log('ERR: file types invalid ');
            err = 0;
        } else {
            // console.log('OK: file types valid ');
            err = 1;
        }
        return err;
    }

    function fileSizeCheck(files, maxFileSize, maxFilesSize) {
        var fileSize = 0,
            filesSize = 0;
        // console.log(files.length);
        for (var i = 0; i < files.length; i++) {
            fileSize = files[i].size / 1000;
            if (fileSize > maxFileSize) {
                console.log('ERR: file size: ' + fileSize);
                err = 0;
                break;
            } else {
                console.log('OK: file size: ' + fileSize);
                err = 1;
            }
            filesSize += fileSize;
            if (filesSize > maxFilesSize) {
                console.log('ERR: max files size: ' + filesSize);
                err = 0;
                break;
            } else {
                console.log('OK: max files size: ' + filesSize);
            }
        }

        return err;
    }

    function addAttachentsToDropArea(files) {
        dropAreaAttachments.empty();
        if (!fileSizeCheck(files, 1200, 30000)) {
            $('.input-type-file__error').text('Максимальный размер файла 3мб. Максимальный размер всех файлов 30мб.');
        } else if (!fileTypeCheck(files, validTypes)) {
            $('.input-type-file__error').text('Вы можете загрузить только jpg и png');
        } else {
            $('.input-type-file__error').text('');
            for (i = 0; i < files.length; i++) {
                dropAreaAttachments.append(
                    '<div class="input-type-file__attachment">' +
                    '<div class="input-type-file__attachment-name">' + files[i].name + '</div>' +
                    '<div class="input-type-file__attachment-remove"></div>' +
                    '</div>');
            }
        }


    }

    // function uploadAttachedFiles(files){
    //     console.log(files);
    //     var formData = new FormData();
    //     $.each( files, function( key, value ){
    //         formData.append( key, value );
    //     });
    //     console.log(formData);
    //     $.ajax({
    //         type: 'POST',
    //         url: '/boarSender.php',
    //         //dataType: 'json',
    //         processData: false,
    //         contentType: false,
    //         data: formData,
    //         beforeSend: function (xhr) {
    //
    //         },
    //         success: function (data) {
    //
    //         },
    //         error: function (xhr, ajaxOptions, thrownError) {
    //             alert(xhr.status);
    //             alert(thrownError);
    //         }
    //     });
    // }
    $('.input-type-file-wrap').bind('dragover', function () {
        $(this).addClass('input-type-file-wrap_dragover');
    });
    $('.input-type-file-wrap').bind('dragleave', function () {
        $(this).removeClass('input-type-file-wrap_dragover');
    });
    $('.boarAjax input[type=file]').on('change', function () {
        var files = inputTypeFile[0].files;
        //var filename = $('input[type=file]', this).val().split('\\').pop();
        // console.log(filename);
        // $('.input-type-file__attachments').append('<div class=""></div>')
        addAttachentsToDropArea(files);
    });


    var dropArea = $('.input-type-file-wrap'),
        formWithDropArea = $('#add_advert_form'),
        dropAreaError = $('.input-type-file__error'),
        dropAreaAttachments = $('.input-type-file__attachments'),
        attachedFile = 'attached-file',
        attachedFileName = 'attached-file__name',
        attachedFileRemoveBtn = 'attached-file__remove-btn',
        //attachments = '',
        i = 0,
        excludedFiles = [],
        classDragover = 'input-type-file-wrap_dragover',
        //classDragleave = 'photo-upload-popup__drop-area--dragleave',
        attachmentsItem = 0,
        attachmentRemoveBtn = 0,
        err = 0,
        allowedExtentions = ['jpeg', 'jpg', 'png'];
    var inputTypeFile = $('input[type=file]', dropArea);
    //   inputTypeFile.attr('title', 'РџРµСЂРµС‚Р°С‰РёС‚Рµ С„Р°Р№Р»С‹ СЃСЋРґР°');

    dropArea.on('dragover', function () {
        dropArea.addClass(classDragover);
    });

    dropArea.on('dragleave', function () {
        dropArea.removeClass(classDragover);
    });

    //  inputTypeFile.on('change', function () {
    //      var files = inputTypeFile[0].files;
    //      dropAreaAttachments.empty();
    //      if (fileSizeCheck(files, 1200, 30000) && fileTypeCheck(files, validTypes)) {
    //          console.log('OK: fileSizeCheck and fileTypeCheck valid');
    //          //uploadAttachedFiles(files);
    //      } else {
    //          console.log('ERR: fileSizeCheck or fileTypeCheck not valid')
    //      }
    //  });


    function ajaxMsg(msg_text) {
        $('.ajax-form-popup-text').text(msg_text);
        $('.ajax-form-popup-overlay, .ajax-form-popup').show();
    }

    function createMsgWindow() {
        $('body').append('<div class="ajax-form-popup-overlay"></div>');
        $('body').append('<div class="ajax-form-popup"></div>');
        $('.ajax-form-popup').append('<div class="ajax-form-popup-close">x</div>');
        $('.ajax-form-popup').append('<div class="ajax-form-popup-text"></div>');
    }

    $(document).on('click', '.ajax-form-popup-overlay, .ajax-form-popup-close', function () {
        $('.ajax-form-popup-overlay, .ajax-form-popup').hide();
    });
    createMsgWindow();
    $(".boarAjax").submit(function () {
        var form = $(this);

        var formData = new FormData($(this)[0]);
        var i = 0;
        // var formName = $('input[name=form_name]', this).val();
        // var ajaxID = 'forms';
        var inputs = form.find('input[type=text], textarea, select');
        //console.log(inputs);
        var files = inputTypeFile[0].files;
        var requireds_arr = [];
        var ruNames_arr = [];
        inputs.each(function () {
            ruNames_arr.push($(this).data('ru-name'));
            requireds_arr.push($(this).data('required'));
            //console.log($(this));


        });
        formData.append('ruNames ', JSON.stringify(ruNames_arr));
        formData.append('requireds ', JSON.stringify(requireds_arr));
        //formData.append('formName', formName);
        //formData.append('ajaxID', ajaxID);

        $.ajax({
            type: 'POST',
            url: 'boarSender.php',
            //dataType: 'json',
            processData: false,
            contentType: false,
            data: formData,
            beforeSend: function (xhr) {
                var required = $(form).find('input[data-required=1], textarea[data-required=1], select[data-required=1]');
                required.each(function () {
                    if ($(this).val() === '' || $(this).val() === undefined || $(this).val() === null) {
                        $(this).css('box-shadow', 'inset 0 0 2px 1px red');
                        xhr.abort();
                    } else {
                        $(this).css('box-shadow', 'initial');
                    }
                });
                console.log(files);
                if (files.length > 0) {
                    if (fileSizeCheck(files, 1200, 30000) && fileTypeCheck(files, validTypes)) {
                        console.log('attached files, fileSizeCheck and fileTypeCheck OK');
                        // xhr.abort();
                    } else {
                        console.log('no files attached');
                        xhr.abort();
                    }
                } else {
                    console.log('no files attached');
                }
            },
            success: function (data) {
                var response = JSON.parse(data);
                if (response['error'] === 'invalid') {
                    ajaxMsg('Подтвердите что Вы не робот!');
                    $('.popup').hide();
                    $('.overlay').fadeIn();
                    console.log('response error ' + response['error']);
                } else if (response['error'] === 'error') {
                    ajaxMsg('Ошибка отправки. Повторите позже.');
                    $('.popup').hide();
                    $('.overlay').fadeIn();
                } else if (response['error'] === 'ok') {
                    ajaxMsg('Ваше сообщение успешно отправлено!');
                    $('.popup').hide();
                    $('.overlay').fadeIn();
                }

            },
            error: function (xhr, ajaxOptions, thrownError) {
                alert(xhr.status);
                alert(thrownError);
            }
        });
        return false;
    });
});