/**
 * Created by wyx on 2017/6/20.
 */
/* 此文件用与验证，
 * 在引入此验证前必须先引入jquery
 * 在引入此验证前必须先引入layer.js
 * 在input中增加一个 class="verify-input" 和 自定义属性 myVerify="phone"
 * */
window.onload = function () {
    //验证输框的文本
    $(".verify-input").blur(function () {
        // 必填项
        var required = /[\S]+/;
        //验证用户名手机号或者邮箱
        var userPhoneMail = /(^[0-9A-Za-z_]{6,30}$)|(^1[0-9]{10}$)|^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
        //验证密码
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
        // 获取页面当前input 自定义属性的值；
        var attrVal = $(this).attr("myVerify");
        // 获取页面当前input的值；
        var inputVal = $(this).val();
        // 验证必填项
        if (attrVal === "required") {
            if (inputVal == "" || inputVal == null) {
                layer.tips("此项为必填项", this, {
                    tips: 3
                });
                $(this).focus();
            } else if (required.test(inputVal)) {
                console.log("verify输入的是" + inputVal);
            }
        }
        // 验证密码
        if (attrVal === "password") {
            if (inputVal == "" || inputVal == null) {
                layer.tips('此项为必填项', this, {
                    tips: 3
                });
                $(this).focus();
            } else if (password.test(inputVal)) {
                console.log("输入的密码为" + inputVal)
            } else {
                layer.tips("密码输入有误请重新输入", this, {
                    tips: 3
                });
                $(this).focus();
            }

        }
        //验证路径
        if (attrVal === "url") {
            if (inputVal == "" || inputVal == null) {
                layer.tips('此项为必填项', this, {
                    tips: 3
                });
                $(this).focus();
            } else if (url.test(inputVal)) {
                // 这里发起ajax验证
                 console.log(inputVal)
            } else {
                layer.tips("输入的链接格式有误请重新输入", this, {
                    tips: 3
                });
                $(this).focus();
            }

        }
        //验证number
        if (attrVal === "number") {
            if (inputVal == "" || inputVal == null) {
                layer.tips('此项为必填项', this, {
                    tips: 3
                });
                $(this).focus();
            } else if (number.test(inputVal)) {
                // 这里发起ajax验证
                 console.log(inputVal)
            } else {
                layer.tips("此处只能填写数字", this, {
                    tips: 3
                });
                $(this).focus();
            }

        }
        //验证date 例子2017-02-20
        if (attrVal === "date") {
            if (inputVal == "" || inputVal == null) {
                layer.tips('此项为必填项', this, {
                    tips: 3
                });
                $(this).focus();
            } else if (date.test(inputVal)) {
                // 这里发起ajax验证
                 console.log(inputVal)
            } else {
                layer.tips("日期格式不正确", this, {
                    tips: 3
                });
                $(this).focus();
            }

        }
        //验证身份证号
        if (attrVal === "identity") {
            if (inputVal == "" || inputVal == null) {
                layer.tips('此项为必填项', this, {
                    tips: 3
                });
                $(this).focus();
            } else if (identity.test(inputVal)) {
                // 这里发起ajax验证
                 console.log(inputVal)
            } else {
                layer.tips("请输入正确的身份证号", this, {
                    tips: 3
                });
                $(this).focus();
            }

        }


        //验证手机号是否存在完成密码找回
        if (attrVal === "phone") {
            if (inputVal == "" || inputVal == null) {
                layer.tips('此项为必填项', this, {
                    tips: 3
                });
                $(this).focus();
            } else if (phone.test(inputVal)) {
                // 这里发起ajax验证
                $.ajax({
                    url: 'http://192.168.1.12:8080/EduBasicData/page/eduapi/v1/AEduJudgePhone',
                    type: 'GET',
                    data: {phone: inputVal},
                    dataType: 'JSON',
                    success: function (res) {
                        console.log("发送请求成功");
                       if (res.resultnum == "0000") {
                            console.log(inputVal + '可以进行密码找回');
                            // 手机号验证通过
                        }else{
                            console.log(inputVal + '不存在不可以进行密码找回');
                        }
                            },
                    error: function (res) {

                    }
                })

            } else {
                layer.tips("输入的手机号有误请重新输入", this, {
                    tips: 3
                });
                $(this).focus();
            }

        }
        //验证邮箱是否存在完成密码找回
        if (attrVal === "email") {
            if (inputVal == "" || inputVal == null) {
                layer.tips('此项为必填项', this, {
                    tips: 3
                });
                $(this).focus();
            } else if (email.test(inputVal)) {
                // 这里发起ajax验证
                console.log(inputVal);
                $.ajax({
                    url:'http://192.168.1.12:8080/EduBasicData/page/eduapi/v1/AEduJudgeMail',
                    type:'GET',
                    dataType:'JSON',
                    data:{mail:inputVal},
                    success: function (res) {
                        console.log("发送请求成功");
                        if (res.resultnum == "0000") {
                            console.log(inputVal + '可以进行密码找回');
                            // 手机号验证通过
                        }else{
                            console.log(inputVal + '不存在不可以进行密码找回');
                        }
                    },
                    error: function (res) {

                    }
                })
            } else {
                layer.tips("输入的邮箱有误请重新输入", this, {
                    tips: 3
                });
                $(this).focus();
            }
        }
        //注册 验证手机号或者邮箱
        if (attrVal === "phoneMail") {
            if (inputVal == "" || inputVal == null) {
                layer.tips('此项为必填项', this, {
                    tips: 3
                });
                $(this).focus();
            } else if (phoneMail.test(inputVal)) {
                if (phone.test(inputVal)) {
                    console.log("输入的是手机号")
                    $.ajax({
                        url: 'http://192.168.1.12:8080/EduBasicData/page/eduapi/v1/AEduJudgePhone',
                        type: 'GET',
                        data: {phone: inputVal},
                        dataType: 'JSON',
                        success: function (res) {
                            console.log("发送请求成功");
                            if (res.resultnum == "0000") {
                                console.log('此手机号已经注册' + inputVal);
                                // 手机号验证通过
                            } else {
                                console.log('此手机号还没有注册可以免费注册' + inputVal);
                                // layer.msg('此手机号还没有注册请点击免费注册' + inputVal);
                            }
                        },
                        error: function (res) {

                        }
                    })

                } else if (email.test(inputVal)) {
                    console.log("输入的是邮箱");
                    $.ajax({
                        url: 'http://192.168.1.12:8080/EduBasicData/page/eduapi/v1/AEduJudgeMail',
                        type: 'GET',
                        data: {mail: inputVal},
                        dataType: 'JSON',
                        success: function (res) {
                            if (res.resultnum == "0000") {
                                console.log("此邮箱已经存在请直接登陆！" + inputVal);
                            } else {
                                console.log("此邮箱不存在" + inputVal);
                            }

                        }
                    })

                } else {
                    layer.tips("手机号或邮箱已经存在请直接登陆！", this, {
                        tips: 3
                    });
                }
                // 这里发起ajax验证
            } else {
                layer.tips("请输入正确的手机号或邮箱", this, {
                    tips: 3
                });
                $(this).focus();
            }

        }

        // 登陆 验证用户名、手机、邮箱、数据是否在数据库中
        if (attrVal === "userPhoneMail") {
            if (inputVal == "" || inputVal == null) {
                layer.tips('此项为必填项', this, {
                    tips: 3
                });
                $(this).focus();
            } else if (userPhoneMail.test(inputVal)) {
                if (phone.test(inputVal)) {
                    $.ajax({
                        url: 'http://192.168.1.12:8080/EduBasicData/page/eduapi/v1/AEduJudgePhone',
                        type: 'GET',
                        data: {phone: inputVal},
                        dataType: 'JSON',
                        success: function (res) {
                            console.log("发送请求成功");
                            if (res.resultnum == "0000") {
                                console.log('此手机号已经注册' + inputVal);
                                verifyLanding = true;

                                // 手机号验证通过
                            } else {
                                // layer.msg('此手机号还没有注册请点击免费注册');
                                layer.msg('此手机号还没有注册请点击免费注册' + inputVal);
                                verifyLanding = false;
                            }
                        },
                        error: function (res) {

                        }
                    })

                } else if (email.test(inputVal)) {
                    $.ajax({
                        url: 'http://192.168.1.12:8080/EduBasicData/page/eduapi/v1/AEduJudgeMail',
                        type: 'GET',
                        data: {mail: inputVal},
                        dataType: 'JSON',
                        success: function (res) {
                            if (res.resultnum == "0000") {
                                console.log("此邮箱存在" + inputVal);
                                verifyLanding = true;

                            } else {
                                console.log("此邮箱不存在" + inputVal);
                                verifyLanding = false;

                            }

                        }
                    })

                } else {
                    console.log("verify输入的是用户名" + inputVal);
                    $.ajax({
                        url: 'http://192.168.1.12:8080/EduBasicData/page/eduapi/v1/AEduJudgeDLM',
                        type: 'GET',
                        data: {dlm: inputVal},
                        dataTYpe: 'JSON',
                        success: function (res) {
                            console.log('发送请求成功');
                            if (res.resultnum == "0000") {
                                console.log("此用户名在" + inputVal);
                                verifyLanding = true;

                            } else {
                                console.log("此用户名不在数据库总" + inputVal)
                                verifyLanding = false;

                            }
                        }
                    })

                }
            } else {
                layer.tips("请输入正确的用户名、手机号或邮箱", this, {
                    tips: 3
                });
                $(this).focus();
            }
        }
    });
};