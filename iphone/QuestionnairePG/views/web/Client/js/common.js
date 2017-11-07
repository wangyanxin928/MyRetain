// ================================================================
//  author:文霞
//  createDate: 2017/07/28
//  description: 客户端公共js方法
//  ===============================================================

var initPopuDiv=function(){
        $(document.body).append("<div class=\"mask\"></div>");
        var studentToast = [
            '<div id="gx1" name="gx1" class="tan" style="display:none;">',
            '<div class="tan_closestu"><a href="javascript:void(0);"></a></div>',
            '<div class="gxcon1"></div>',
            '</div>'
        ].join('');
        $(document.body).append(studentToast);
        var OtherToast = [
            '<div id="gx12"  name="gx12" class="tan" style="display:none;">',
            '<div class="tan_closestu"><a href="javascript:void(0);"></a></div>',
            '<div class="gxcon1"></div>',
            '</div>'
        ].join('');
        $(document.body).append(OtherToast);
        var AlertToast = [
            '<div id="AlertToast" name="AlertToast" class="tan" style="display:none;">',
            '<div class="tan_close"><span>信息</span><a href="javascript:void(0);"></a></div>',
            '<div class="alertconment"><i class="error"></i></div>',
            '</div>'
        ].join('');
        $(document.body).append(AlertToast);
        var MsgToast = [
            '<div id="MsgToast" name="MsgToast" class="tan" style="display:none;">',
            '<div class="alertconment"></div>',
            '</div>'
        ].join('');
        $(document.body).append(MsgToast);
        var LoadToast = [
            '<div id="LoadToast" name="LoadToast" class="tan" style="display:none;">',
            '<i class="loading"></i>数据加载中......</div>'
        ].join('');
        $(document.body).append(LoadToast);
        $(".tan_closestu").click(function(){
            alertclose();
        });
        $(".tan_close").click(function(){
            alertclose();
        });

    },
alertpop=function(popid,conment,icon){//LoadToast:loading;AlertToast:有遮罩的不自动关闭的提示信息；MsgToast:没有遮罩的自动关闭的提示信息；
        if(popid=="AlertToast"){
            //显示遮罩层
            $(".mask").attr("style","display:block");
            $("#"+popid+" .alertconment").html("<i class='"+icon+"'></i>"+conment);
        }else if(popid=="MsgToast"){
            $("#"+popid+" .alertconment").html(conment);
            setTimeout(function(){
                $("#"+popid).css("display","none");
            },2000);
        }else if(popid=="LoadToast"){
            //显示遮罩层
            $(".mask").attr("style","display:block");
            conment=conment||"数据加载中......"
            $("#"+popid).html("<i class='loading'></i>"+conment);
        }
        $("#"+popid).attr("style","display:block");
    },
alertclose=function(){
        $(".mask").attr("style","display:none;");
        $(".tan").attr("style","display:none;");
    },
getUrlPara= function(m){
   var sValue = location.search.match(new RegExp("[\?\&]" + m + "=([^\&]*)(\&?)", "i"));
   return sValue ? sValue[1] : sValue;
};
//20170516 add by 文霞 获取用户信息
var _UserObject={
    user_id: "uid_test20171031",//"1",//用户id
    user_dlm: "",//""//用户登录名
    user_name: "",//"测试用户",//用户真实姓名
    user_role: "urole_test20171031",//"2",//角色值为数字；0无权限，1超级管理员，2教育局人员(教育局管理员),3教官中心人员(教官中心管理员),4校长（学校管理员）,5资料管理员(学校资料上传,量表填写),6教师,7学生
    server_id: null,//"sid_test20171031",//"652ffb6afea946c29ed29eda3dc0b579",// 人员所在集团id
    server_name: "",//"清华大学附属中学",// 人员所在集团名称,学校名称/教育局名称等
    user_sex: "",//"0",//  用户性别;
    grade_id: "",//"1",//  年级主键;
    class_id: "",//"1",//  班级主键;
    grade_name: "",//"一年级",//  年级名称;
    class_name: "",//"一班",//  班级名称
    user_img: "",//"http://scs.ganjistatic1.com/gjfs15/M08/06/44/CgEHQVYPQi3GOVq0AADKyBjz9NA161_600-0_6-0.jpg",// 用户头像;
    user_age: "",//"1",//  用户年龄;
    user_type: "",//"1",//  用户类型;0无类型，1老师，2学生，3家长
    user_phone: "",//"1",//  用户电话;
    user_email: "",//"1",//  用户邮件;
    state: "",//"1",//启用状态；0未启用，1启用
    xz: "",//"",//学制：1小学五年制，2小学六年制，3初中三年制，4初中四年制，5高中,6是完中(初中和高中共存),7幼儿园
    isanonymous:1,//1是匿名，0是非匿名，非匿名时user_id和bd_userinfo里的id相关联
    sub_sourcetype:2//提交来源，1是用户名密码登录，2是微信，3是邮箱，4是pc，5是移动设备
};

//$(window).on("load",function(){
//    //获取用户信息
//    _UserObject.user_id = getUrlPara("uid");
//    _UserObject.server_id = getUrlPara("xxid");
//    _UserObject.user_role = getUrlPara("role")?decodeURIComponent(getUrlPara("role")):null;
//    _UserObject.grade_id = getUrlPara("njid");
//    _UserObject.grade_name = getUrlPara("njmc")?decodeURIComponent(getUrlPara("njmc")):null;
//});

String.prototype.format = function() {
    var args = arguments;
    return this.replace(/\{(\d+)\}/g, function(s, i) {
        return args[i];
    });
};

var baseUrl ="http://localhost/QuestionnairePG/";//"http://192.168.1.73/QHPG-HN/";
var getdata = function (iter, p, _callback) {
    var obj;
    if (p) {
        obj = {JSONPARAM: JSON.stringify(p)};
    }
    $.ajax({
        type: iter.itype,
        url: baseUrl + iter.iname+"?_n="+Date.parse(new Date())/1000,
        data: obj,
        datatype:"JSON",
        success: function (res) {
            //后台返回的是json
            //res = JSON.parse(res);
            _callback(res);
        },
        error: function (e) {
        }
    });
};