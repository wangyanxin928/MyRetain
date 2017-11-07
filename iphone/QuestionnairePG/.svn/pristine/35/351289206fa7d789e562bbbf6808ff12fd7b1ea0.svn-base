// ================================================================
//  author:文霞
//  createDate: 2017/05/04
//  description: 根据实际业务封装的ossupload插件
//  ===============================================================
"use strict";
define(['jquery', 'underscore','base64','plupload'],
    function ($, _) {
        var accessid= 'LTAIxU6gGmQxNT49';
        var accesskey= '9PgE5Ulkxb6v8bbnWSuugbvmtKfxhb';
        var host = 'http://schoolsafty.oss-cn-beijing.aliyuncs.com';//阿里云文件保存地址--校园安全
        var myOssupload = {
//            accessid:'LTAIxU6gGmQxNT49',
//            accesskey:'9PgE5Ulkxb6v8bbnWSuugbvmtKfxhb',
//            host:'http://qhpg.oss-cn-qingdao.aliyuncs.com',
            createUploader:function(uploadoption){
                var g_dirname = uploadoption.g_dirname;
                var g_object_name = '';
                var g_object_name_type = uploadoption.g_object_name_type;
//                var now = timestamp = Date.parse(new Date()) / 1000;

                var policyText = {
                    "expiration": "2020-01-01T12:00:00.000Z", //设置该Policy的失效时间，超过这个失效时间之后，就没有办法通过这个policy上传文件了
                    "conditions": [
                        ["content-length-range", 0, 5048576000] // 设置上传文件的大小限制5G大概
                    ]
                };
                var policyBase64 = Base64.encode(JSON.stringify(policyText));
                var message = policyBase64;
                var bytes = Crypto.HMAC(Crypto.SHA1, message, accesskey, { asBytes: true }) ;
                var signature = Crypto.util.bytesToBase64(bytes);

                var set_upload_param=function(up, filename, ret){
                        g_object_name = g_dirname;
                        if (filename != '') {
                            var suffix = get_suffix(filename);
                            calculate_object_name(filename)
                        }
                        var new_multipart_params = {
                            'key' : g_object_name,
                            'policy': policyBase64,
                            'OSSAccessKeyId': accessid,
                            'success_action_status' : '200', //让服务端返回200,不然，默认会返回204
                            'signature': signature
                        };

                        up.setOption({
                            'url': host,
                            'multipart_params': new_multipart_params
                        });
                        up.start();
                    },
                    random_string=function(len){
                        len = len || 32;
                        var chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';
                        var maxPos = chars.length;
                        var pwd = '';
                        for (var i = 0; i < len; i++) {
                            pwd += chars.charAt(Math.floor(Math.random() * maxPos));
                        }
                        return pwd;
                    },
                    get_suffix=function(filename){
                        var pos = filename.lastIndexOf('.');
                        var suffix = '';
                        if (pos != -1) {
                            suffix = filename.substring(pos)
                        }
                        return suffix;
                    },
                    calculate_object_name=function(filename){
                        if (g_object_name_type == 'local_name')
                        {
                            g_object_name += "${filename}"
                        }
                        else if (g_object_name_type == 'random_name')
                        {
                            var suffix = get_suffix(filename);
                            g_object_name = g_dirname + random_string(10) + suffix
                        }
                        return ''
                    },
                    get_uploaded_object_name=function(filename){
                        if (g_object_name_type == 'local_name')
                        {
                            var tmp_name = g_object_name;
                            tmp_name = tmp_name.replace("${filename}", filename);
                            return tmp_name
                        }
                        else if(g_object_name_type == 'random_name')
                        {
                            return g_object_name
                        }
                    };

                var filters={};
                if(uploadoption.filters&&uploadoption.filters.types){
                    filters.mime_types=[{ title : "自定义限制", extensions : uploadoption.filters.types }];
                }
                if(uploadoption.filters&&uploadoption.filters.fileSize){
                    filters.max_file_size=uploadoption.filters.fileSize;
                }
                var uploader = new plupload.Uploader({
                    runtimes : 'html5,flash,silverlight,html4',
                    browse_button : uploadoption.choosebtn,
                    multi_selection: false,
                    container: document.getElementById(uploadoption.container),
                    flash_swf_url : 'lib/plupload-2.1.2/js/Moxie.swf',
                    silverlight_xap_url : 'lib/plupload-2.1.2/js/Moxie.xap',
                    url : 'http://oss.aliyuncs.com',
                    //添加文件上传限制 20170707 by 文霞
                    filters:filters,
                    init: {
                        PostInit: function() {
                            var uploadbtnid=uploadoption.uploadbtn;
                            if(uploadbtnid){
                                document.getElementById(uploadbtnid).onclick = function() {
                                    set_upload_param(uploader, '', false);
                                    return false;
                                };
                            }
                        },
                        FilesAdded: function(up, files) {
                            plupload.each(files, function(file) {
                                var sizev=plupload.formatSize(file.size);
                                //上传中方法加进度条
                                var ossfiledivid=uploadoption.ossfile;
                                if(uploadoption.type!="file"){  //图片上传
                                    //如果是图片上传,不用确认按钮直接执行上传
                                    set_upload_param(uploader, '', false);
                                }else if(uploadoption.type=="file"&&uploadoption.multiple){//多个文件上传
                                    var fileName=file.name.length>25?file.name.substring(0,24)+'...':file.name;
                                    document.getElementById(ossfiledivid).innerHTML += '<div id="' + file.id + '" filename="'+file.name+'" filesize="'+sizev+'" title="'+file.name+'"><div class="dataDocTitle"><i class="dataFileState0"></i><span class="data-removeDoc-icon deletefile"></span>' + fileName + ' (' + sizev + ')</div>'
                                        +'<div class="layui-progress" lay-showpercent="yes"><div class="layui-progress-bar layui-bg-green" lay-percent="0%" style="width: 0%;"><span class="layui-progress-text">0%</span></div></div>'
                                        +'</div>';
                                }else{//单个文件上传
                                    //删除uploader中的file对象
                                    if($("#ossfile2>div").length!=0){
                                        var fileid = $("#ossfile2>div")[0].id;//file.id;
                                        uploader.removeFile(fileid);
                                    }
                                    var fileName=file.name.length>25?file.name.substring(0,24)+'...':file.name;
                                    document.getElementById(ossfiledivid).innerHTML = '<div id="' + file.id + '" filename="'+file.name+'" filesize="'+sizev+'" title="'+file.name+'"><div class="dataDocTitle"><i class="dataFileState0"></i><span class="data-removeDoc-icon deletefile"></span>' + fileName + ' (' + sizev + ')</div>'
                                        +'<div class="layui-progress" lay-showpercent="yes"><div class="layui-progress-bar layui-bg-green" lay-percent="0%" style="width: 0%;"><span class="layui-progress-text">0%</span></div></div>'
                                        +'</div>';
                                    //单个文件上传没有确认上传按钮，直接上传
                                    set_upload_param(uploader, '', false);
                                }
                            });
                        },
                        BeforeUpload: function(up, file) {
                            set_upload_param(up, file.name, true);
                        },
                        UploadProgress: function(up, file) {
                            //只有需要显示进度条的地方这个才执行
                            if(uploadoption.type=="file") {
                                var d = document.getElementById(file.id);
                                $("#"+file.id).find(".layui-progress").show();
                                $("#"+file.id).find(".layui-progress-bar")[0].style.width = file.percent + '%';
                                $("#"+file.id).find(".layui-progress-bar")[0].setAttribute('lay-percent', file.percent);
                                $("#"+file.id).find(".layui-progress-text").html(file.percent + '%');
                            }else{
                                /*$(".layui-progress").show();
                                $(".layui-progress-bar")[0].style.width = file.percent + '%';
                                $(".layui-progress-bar")[0].setAttribute('lay-percent', file.percent);
                                $(".layui-progress-text").html(file.percent + '%');*/
                            }
                        },
                        FileUploaded: function(up, file, info) {
                            if (info.status == 200)
                            {
                                var filesrc=host + "/" + get_uploaded_object_name(file.name);
                                //上传成功之后的方法
                                if(uploadoption.type=="head"){
                                    $(".layui-progress").hide();
                                    var ossfiledivid=uploadoption.ossfile;
                                    document.getElementById(ossfiledivid).src=filesrc;
                                }else if(uploadoption.type=="img"){
                                    $(".layui-progress").hide();
                                    var ossfiledivid=uploadoption.ossfile;
                                    $("#"+ossfiledivid).append(" <div class=\"layui-inline\"><img class='file_img' src=\""+filesrc+"\"></div>");
                                }else {
                                    $("#" + file.id).attr("fileurl", filesrc);
                                }
                                //上传完成之后把进度条隐藏，显示下载按钮
                                $("#" + file.id).find(".layui-progress").hide();
                                $("#" + file.id).find(".deletefile").hide();
                                $("#" + file.id).find(".dataDocTitle").append("<a href=\""+filesrc+"\" class=\"data-downloadDoc-icon\" style='margin-left: 20px;'></a><span class=\"deletefile data-removeDoc-icon1\" style='margin-left: 20px;'></span>");
                            }
                            else
                            {
                                document.getElementById(file.id).getElementsByTagName('b')[0].innerHTML = info.response;
                            }
                        },
                        Error: function(up, err) {
                            document.getElementById('console').appendChild(document.createTextNode("\nError xml:" + err.response));
                        }
                    }
                });
                //注册删除按钮的点击事件
                if(uploadoption.type=="file") {
                    $('#'+uploadoption.ossfile).delegate('.deletefile','click',function(){
                        var fileBlock= event.target.parentNode.parentNode;
                        var fileid=fileBlock.id;
                        //删除dom节点
                        fileBlock.remove();
                        //删除uploader中的file对象
                        uploader.removeFile(fileid);
                    })
                }
                return uploader;
            }
        };
        return myOssupload;
    }
);
/*   uploadoption实例  by wenxia 20170707   */
/**
//文件上传需要的对象--多个对象
 var uploadoption2={
 "choosebtn":"selectfiles2",// 选择文件按钮id
 "uploadbtn":"postfiles2",//确定上传按钮id
 "container":"container12",//选择和确实上传按钮的 父节点id
 "ossfile":"ossfile2",//图片存放位置区域id
 "g_dirname":"ceshi/",//如果不填，默认是上传到根目录, 注意目录要带/结尾
 "g_object_name_type":"local_name",//local_name:上传文件名字保持本地文件名字,random_name:上传文件名字是随机文件名
 "type":"file",//head头像模式显示为头像,img图片格式可以是多个图片是个图片列表,file文件格式一个个文件列表带进度条显示
 "multiple":true,//是否多个文件上传
 "filters":{
    "types":"jpg,gif,png,zip",
    "fileSize":"400kb"
 }
 };
 var uploader2=myossupload.createUploader(uploadoption2);
 uploader2.init();

 //单个对象
 var uploadoptionS={
 "choosebtn":"selectfilesS",// 选择文件按钮id
 //                "uploadbtn":"",//确定上传按钮id
 "container":"containerS",//选择和确实上传按钮的父节点id
 "ossfile":"ossfileS",//图片存放位置区域id
 "g_dirname":"ceshi/",//如果不填，默认是上传到根目录, 注意目录要带/结尾
 "g_object_name_type":"local_name",//local_name:上传文件名字保持本地文件名字,random_name:上传文件名字是随机文件名
 "type":"file",//head头像模式显示为头像,img图片格式可以是多个图片是个图片列表,file文件格式一个个文件列表带进度条显示
 "multiple":false//是否多个文件上传
 };
 var uploaderS=myossupload.createUploader(uploadoptionS);
 uploaderS.init();

 //图片
 var uploadoptionPic={
 "choosebtn":"selectfilesPic",// 选择文件按钮id
 //                "uploadbtn":"",//确定上传按钮id
 "container":"containerPic",//选择和确实上传按钮的父节点id
 "ossfile":"ossfilePic",//图片存放位置区域id
 "g_dirname":"ceshi/",//如果不填，默认是上传到根目录, 注意目录要带/结尾
 "g_object_name_type":"local_name",//local_name:上传文件名字保持本地文件名字,random_name:上传文件名字是随机文件名
 "type":"img",//head头像模式显示为头像,img图片格式可以是多个图片是个图片列表,file文件格式一个个文件列表带进度条显示
 "multiple":false//是否多个文件上传
 };
 var uploaderPic=myossupload.createUploader(uploadoptionPic);
 uploaderPic.init();
* */