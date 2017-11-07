/**
 * Created by baiyuxi on 2017/3/29.
 */

var $util = require('../util/util');
var $http = require('./http');
var weixinApi = require("weixin-api");

function WeiXin() {
    /*接口中的token参数要与管理界面中填写的token一致,此方法的token已经配置到util.wxConfig 里*/
    this.initMsg = function () {
        // config 根据自己的实际配置填写
        weixinApi.token = $util.wxConfig.token;
    };
    //响应用户消息
    this.responseMsg = function () {
        //响应用户文本消息
        resTextMsg();
    };
    //获取accessToken
    this.getAccessToken = function () {
        initAccessToken();
        //accessToken 7200s过期，设置定时器自动更新
        var myTime = 1000 * 6600; // 1小时50分时间可自行设置
        setInterval(function () {
            //获取公众号s帐号access_token
            initAccessToken();
        }, myTime);
    }

}
//响应用户文本消息
function resTextMsg() {
    //文本消息
    weixinApi.textMsg(function (msg) {
        console.log("响应用户文本消息");
        console.log(JSON.stringify(msg));
        var content = "消息内容：" + msg.content + "\n";
        content = content + "toUserName:" + msg.toUserName + "\n";
        content = content + "fromUserName:" + msg.fromUserName + "\n";
        var resMsg = {};
        resMsg = {
            fromUserName: msg.toUserName,
            toUserName: msg.fromUserName,
            msgType: "text",
            content: content,
            funcFlag: 0
        };
        weixinApi.sendMsg(resMsg);
    });
}

//获取公众账号的access_token
function initAccessToken() {
    var url = "https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential" +
        "&appid=" + $util.wxConfig.appId + "&secret=" + $util.wxConfig.appsecret;
    var header = {};
    $http.myHttpGet(url, header, function (data) {
        $util.wxConfig.accessToken = JSON.parse(data).access_token;

        console.log("accessToken已经获取成功：" + $util.wxConfig.accessToken);
    });
}

module.exports = new WeiXin();