/**
 * Created by wyx on 2017/6/21.
 */
//登陆
    // 必填项
var required = /[\S]+/;
//验证用户名手机号或者邮箱
var userPhoneMail = /(^[0-9A-Za-z_]{6,30}$)|(^1[0-9]{10}$)|^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
//用户名
var password = /^[0-9A-Za-z_]{6,15}$/;
// 手机正则
var phone = /^1\d{10}$/;
//email正则
var email = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
// 验证手号或者邮箱
var phoneMail = /(^1[0-9]{10}$)|^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
// url正则
var url = /(^#)|(^http(s*):\/\/[^\s]+\.[^\s]+)/;
//数字
var number = /^\d+$/;
// 日期
var date = /^(\d{4})[-\/](\d{1}|0\d{1}|1[0-2])([-\/](\d{1}|0\d{1}|[1-2][0-9]|3[0-1]))*$/;
//身份证号15或18位
var identity = /(^\d{15}$)|(^\d{17}(x|X|\d)$)/;


/*获取手机验证码倒计时  star*/
var wait = 60;

function time(o) {
    if (wait == 0) {
        o.removeAttribute("disabled");
        o.value = "重新发送";
        wait = 60;
        $(".setVerificationCodeBtn").css({"background-color": "#e8e8e8", "color": "#666", "cursor": "pointer"});
    } else {
        o.setAttribute("disabled", true);
        o.value =  "重新发送"+ wait + "s" ;
        wait--;
        setTimeout(function () {
            time(o)
        }, 1000);
        $(".setVerificationCodeBtn").css({"background-color": "#f1f1f1", "color": "#666", "cursor": "not-allowed"});
    }
}
//验证手机号是否正确并且发送验证码
$("#sendCheckCode").click(function () {
    var mobile = $("#expressive_phone").val();
    if (mobile == "") {
        alert('注册手机号不能为空!');
    } else if (mobile != "") {
        if (/^((\d{3}-\d{8}|\d{4}-\d{7,8})|(1[3|5|7|8][0-9]{9}))$/.test(mobile)) {
            time(this); // $.ajax({
            //     url: "${ctx}/api/b2b2c/storeApi!sendCheckCode.do?ajax=yes",
            //     type: "POST",
            //     data: "mobile=" + mobile,
            //     async: false,
            //     dataType: "json",
            //     success: function (json) {
            //         alert(json.message);
            //     }
            // });

        }
    }
});
/*获取手机验证码倒计时  end*/

//用户输入验证码
$('.verificationCode').blur(function () {
    var thisVal=$(this).val();
    if(thisVal !== "" && thisVal !== null){
        $('#loginFormBox').removeClass('data-btn-disabled').addClass('data-btn-star');
    }else {
        $('#loginFormBox').removeClass('data-btn-star').addClass('data-btn-disabled');
    }
});

// 登陆

//用户点击了登陆
$('#loginFormBox input').keypress(function (e) {
    if (e.which == 13) {
        userLogin();
    }
});

$("#loginFormBox").click(function () {
    if (($('#loginFormBox').is('.data-btn-star'))){
        userLogin()
    }

});

function userLogin() {
    var userName = $("#landingUserName").val();
    var password = $("#landingPassword").val();
    var verifyLanding = false;

    $("#loginForm .verify-input").each(function () {
        var _this = $(this);
        var thisVal = _this.val();
        if (thisVal == "" || thisVal == "null") {
            _this.focus();
            verifyLanding = false;
        } else {
            verifyLanding = true;
        }
    });
    // 密码加密
    // password = $.md5(password);
    if (verifyLanding) {
        if (phone.test(userName)) {
            $.ajax({
                url: 'http://www.axyredu.com/EduBasicData/page/eduapi/v1/AEduLogin',
                type: 'GET',
                dataType: 'JSON',
                data: {
                    DLM: userName,
                    DLMM: password,
                    ACTION: "LXDH"
                },
                success: function (res) {
                    console.log("发送请求成功");
                    if (res.resultnum == "0000") {
                        console.log("手机登陆成功");
                    } else {
                        console.log('手机登陆密码错误!请重新登陆！');
                    }
                }
            })
        }
    }
}



// 获取code值
var getURLParameter = function (code) {
    var searchString = window.location.search.substring(1),
        i, val, params = searchString.split("&");

    for (i = 0; i < params.length; i++) {
        val = params[i].split("=");
        if (val[0] == code) {
            return unescape(val[1]);
        }
    }
    return null;
};





