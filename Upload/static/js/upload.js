    

    /**
     * 文件上传 -到阿里云
     *
     * 依赖于 jquery & plupload.js
     *
     * @param attachBox         {String} 附件容器 id
     * @param addBtnWrapper     {String} 按钮容器 id
     * @param addBtn            {String} 添加按钮 id 
     * @param limit             {Number} 限制上传个数
     * @param obj               {Object} 数据 (当limit==1  obj只存url, url = obj.url ; 当limit>1, obj存id&url, 通过遍历获取)
     * @param type              {String} 上传类型  "image" 图片  "file" 文件
     */
    function upload(attachBox, addBtnWrapper, addBtn, limit, obj, type) {
        var userid = "123",
            attachContainer = $('#' + attachBox),
            addAttachButton = $('#' + addBtn);
        var address = {
            serverUrl: "http://122.224.199.228:8060/service/osssignature",    // 开发
            // serverUrl: "http://122.224.199.228:8080/service/osssignature",      // 测试
            //serverUrl: "http://112.124.3.182:8080/service/osssignature",      // 生产

            aliyunUrl: "http://oss-cn-shanghai.aliyuncs.com"

        }

        var accessid = '', host = '', policyBase64 = '', signature = '', callbackbody = '', expire = 0;

        attachContainer.on('mouseenter', '.attach-box', function () {
            $(this).find('.delt').css('display', 'block');
        });

        attachContainer.on('mouseleave', '.attach-box', function () {
            $(this).find('.delt').css('display', 'none');
        });

        if(limit <= 10){
            attachContainer.find('ul').addClass("fileLimit"+limit);
        }

        function previewImage(file, callback) {//file为plupload事件监听函数参数中的file对象,callback为预览图片准备完成的回调函数
            if (!file || !/image\//.test(file.type)) return; //确保文件是图片
            if (file.type == 'image/gif') {//gif使用FileReader进行预览,因为mOxie.Image只支持jpg和png
                var fr = new mOxie.FileReader();
                fr.onload = function () {
                    callback(fr.result);
                    fr.destroy();
                    fr = null;
                };
                fr.readAsDataURL(file.getSource());
            } else {
                var preloader = new mOxie.Image();
                preloader.onload = function () {
                    //preloader.downsize( 640, 640 );//先压缩一下要预览的图片,宽300，高300
                    //得到图片src,实质为一个base64编码的数据
                    var imgsrc = preloader.type == 'image/jpeg' ? preloader.getAsDataURL('image/jpeg', 80) : preloader.getAsDataURL();
                    callback && callback(imgsrc); //callback传入的参数为预览图片的url
                    preloader.destroy();
                    preloader = null;
                };
                preloader.load(file.getSource());
            }
        }

        function previewAttach(file, callback) {
            var filename = file.name;
            var attachType = "";
            if (filename.indexOf(".doc") > 0) {
                attachType = "word";
            } else if (/(jpg|gif|png|JPG|GIF|PNG|JPEG|jpeg)$/.test(filename)) {
                attachType = "images";
            } else if (filename.indexOf(".xls") > 0) {
                attachType = "excel";
            } else if (filename.indexOf(".ppt") > 0) {
                attachType = "ppt";
            } else if (filename.indexOf(".zip") > 0 || filename.indexOf(".rar") > 0) {
                attachType = "compressed";
            } else if (filename.indexOf(".pdf") > 0) {
                attachType = "pdf";
            } else if (filename.indexOf(".txt") > 0 || filename.indexOf(".rtf") > 0) {
                attachType = "plain-text";
            } else {
                attachType = "cloud";
            }
            callback && callback(attachType);
        }

        function get_signature(callbackFun) {
            $.ajax({
                type: "get",
                async: false,
                url: address.serverUrl,
                dataType: "jsonp",
                contentType: "application/json",
                jsonp: "callback",
                //jsonpCallback: "",
                success: function (data) {
                    var obj = typeof data == "object" ? data : JSON.parse(data);
                    host = obj['host'];
                    policyBase64 = obj['policy'];
                    accessid = obj['accessid'];
                    signature = obj['signature'];
                    expire = parseInt(obj['expire']);
                    callbackbody = obj['callback'];
                    callbackFun();
                },
                error: function () {
                    alert('获取签名信息失败');
                }
            });
        }

        function set_upload_param(up, callbackFun) {
            //可以判断当前expire是否超过了当前时间,如果超过了当前时间,就重新取一下.3s 做为缓冲
            var now = Date.parse(new Date()) / 1000;
            var expireFlag = expire < now + .3;
            if (expireFlag) {
                get_signature(function () {
                    set_upload_param(up, callbackFun);
                });
            } else {
                var key = userid + "/" + new Date().getTime();
                up.setOption({
                    'url': host,
                    'multipart_params': {
                        'key': key,
                        'policy': policyBase64,
                        'OSSAccessKeyId': accessid,
                        'success_action_status': '200', //让服务端返回200,不然，默认会返回204
                        'callback': callbackbody,
                        'signature': signature,
                        'x:usertype': "1",
                        'x:userid': userid,
                        'x:channel': "3"
                    }
                });
                callbackFun();
            }
        }

        var mime_types; // 上传文件类型限制
        type === "image" ? mime_types = [ {title: "Image files", extensions: "jpg,jpeg,gif,png,JPG,JPEG,GIF,PNG"} ] : mime_types = [];
        var attachUploader = new plupload.Uploader({
            runtimes: "html5,flash,silverlight,html4",
            browse_button: addBtn,
            container: document.getElementById(addBtnWrapper),
            url: address.aliyunUrl,
            flash_swf_url: "/js/vendor/Moxie.swf",
            silverlight_xap_url: "/js/vendor/Moxie.xap",
            filters: {
                max_file_size: '10mb',
                mime_types: mime_types,
                prevent_duplicates: true //不允许选取重复文件
            },
            multi_selection: false,
            init: {
                PostInit: function (up) {
                    attachContainer.on('click', '.delt', function () {
                        var fileid = $(this).attr('data-fileid');
                        if (obj[fileid]) delete obj[fileid];
                        up.removeFile(fileid);
                        $(this).parent().remove();
                    });
                },

                Browse: function (up) {
                },

                FilesAdded: function (up, files) {
                    var size = attachContainer.find('li').not('#' + addBtnWrapper).size();
                    var totalLength = size + files.length;
                    if (totalLength > limit) {
                        up.splice(size <= limit ? size : limit, totalLength - limit);
                        files.splice(limit - size, totalLength - limit);
                        alert("最多上传"+limit + "个");
                    }
                    plupload.each(files, function (file) {
                        var fileid = file.id;
                        var filename = file.name;
                        if (type === "image") {
                            previewImage(file, function (imgsrc) {
                                var pictureString = '<li class="attach-box">' +
                                    '<a class="delt heit" href="javascript:;" data-fileid="' + fileid + '" title="' + filename + '">X</a>' +
                                    '<em class="upload-loading"></em>'+
                                    '<img src="' + imgsrc + '" alt="">' +
                                    '</li>';
                                addAttachButton.parent().before(pictureString);
                            });
                        }else if (type === "file") {
                            previewAttach(file, function (attachType) {
                                var pictureString = '<li class="attach-box">' +
                                    '<a class="delt heit" href="javascript:;" data-fileid="' + fileid + '">X</a>' +
                                    '<em class="upload-loading"></em>'+
                                    '<span class="' + attachType + '"></span>' +
                                    '<p class="attach-name">' + filename + '</p>' +
                                    '</li>';
                                addAttachButton.parent().before(pictureString);
                            });
                        }
                        
                    });
                    set_upload_param(up, function () {
                        up.start();
                    });
                },
                BeforeUpload: function (up, file) {
                    up.settings.multipart_params['x:filename'] = file.name;
                },
                UploadProgress: function (up, file) {
                    var progressBox = $("a[data-fileid="+ file.id +"]").siblings(".upload-loading")
                    progressBox.text(file.percent+ "%");
                },
                FileUploaded: function (up, file, info) {
                    set_upload_param(up, function () {
                        if (info.status == 200) {
                            var response = JSON.parse(info.response);
                            if(limit === 1){
                                obj.url=response.url;
                            }else{
                                obj[file.id] = {
                                    id: response.id,
                                    url: response.url
                                };
                            }
                            $("a[data-fileid="+ file.id +"]").siblings(".upload-loading").fadeOut();
                            console.log(obj);

                        }
                    });

                },
                QueueChanged: function (up) {
                },
                Error: function (up, args) {
                    switch (args.code) {
                        case -601:
                            alert("只能上传图片");
                            break;
                        case -602:
                            alert("不能重复上传");
                            break;
                    }
                }
            }
        });

        attachUploader.init();
    }
