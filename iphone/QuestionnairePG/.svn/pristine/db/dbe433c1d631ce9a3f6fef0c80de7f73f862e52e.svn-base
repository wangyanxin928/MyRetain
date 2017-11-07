/**
 * http接口调用 get请求 和 post 请求
 * Created by baiyuxi on 2017/3/29.
 */
var http = require('http');
var querystring = require('querystring');

module.exports = {
    /**
     * https/http get请求
     * @param url:url地址(若参数有中文，需使用encodeURI(url)转码)
     * @param header:请求头
     * @param fn:回调函数得出结果
     */
    myHttpGet: function (url, header, fn) {
        var parse_u = require('url').parse(url, true);
        var isHttp = parse_u.protocol == 'http:';
        var options = {
            host: parse_u.hostname,
            port: parse_u.port || (isHttp ? 80 : 443),
            path: parse_u.path,
            method: 'GET',
            headers: header
        };

        require(isHttp ? 'http' : 'https').get(options, function (res) {
            var _data = '';
            res.on('data', function (chunk) {
                _data += chunk;
            });
            res.on('end', function () {
                fn != undefined && fn(_data);
            });
        });
    },

    /**
     * https/http post请求
     * @param url
     * @param data
     * @param fn
     */
    myHttpPost: function (url, data, fn) {
        data = data || {};
        //var content = querystring.stringify(data);
        //var content = JSON.stringify(data);
        console.log(url);
        var parse_u = require('url').parse(url, true);
        console.log(data);
        var isHttp = parse_u.protocol == 'http:';
        var options = {
            host: parse_u.hostname,
            port: parse_u.port || (isHttp ? 80 : 443),
            path: parse_u.path,
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(data, 'utf8'),
                'user-agent': 'nodejs rest client'
            }
        };
        var req = require(isHttp ? 'http' : 'https').request(options, function (res) {
            var _data = '';
            res.on('data', function (chunk) {
                _data += chunk;
            });
            res.on('end', function () {
                fn != undefined && fn(_data);
            });
        });
        req.write(url);
        req.end();
    }

}