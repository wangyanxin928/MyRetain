/*
 * Crypto-JS v1.1.0
 * http://code.google.com/p/crypto-js/
 * Copyright (c) 2009, Jeff Mott. All rights reserved.
 * http://code.google.com/p/crypto-js/wiki/License
 */
(function(){var b="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";window.Crypto={};var a=Crypto.util={rotl:function(d,c){return(d<<c)|(d>>>(32-c))},rotr:function(d,c){return(d<<(32-c))|(d>>>c)},endian:function(d){if(d.constructor==Number){return a.rotl(d,8)&16711935|a.rotl(d,24)&4278255360}for(var c=0;c<d.length;c++){d[c]=a.endian(d[c])}return d},randomBytes:function(d){for(var c=[];d>0;d--){c.push(Math.floor(Math.random()*256))}return c},stringToBytes:function(e){var c=[];for(var d=0;d<e.length;d++){c.push(e.charCodeAt(d))}return c},bytesToString:function(c){var e=[];for(var d=0;d<c.length;d++){e.push(String.fromCharCode(c[d]))}return e.join("")},stringToWords:function(f){var e=[];for(var g=0,d=0;g<f.length;g++,d+=8){e[d>>>5]|=f.charCodeAt(g)<<(24-d%32)}return e},bytesToWords:function(d){var f=[];for(var e=0,c=0;e<d.length;e++,c+=8){f[c>>>5]|=d[e]<<(24-c%32)}return f},wordsToBytes:function(e){var d=[];for(var c=0;c<e.length*32;c+=8){d.push((e[c>>>5]>>>(24-c%32))&255)}return d},bytesToHex:function(c){var e=[];for(var d=0;d<c.length;d++){e.push((c[d]>>>4).toString(16));e.push((c[d]&15).toString(16))}return e.join("")},hexToBytes:function(e){var d=[];for(var f=0;f<e.length;f+=2){d.push(parseInt(e.substr(f,2),16))}return d},bytesToBase64:function(d){if(typeof btoa=="function"){return btoa(a.bytesToString(d))}var c=[],f;for(var e=0;e<d.length;e++){switch(e%3){case 0:c.push(b.charAt(d[e]>>>2));f=(d[e]&3)<<4;break;case 1:c.push(b.charAt(f|(d[e]>>>4)));f=(d[e]&15)<<2;break;case 2:c.push(b.charAt(f|(d[e]>>>6)));c.push(b.charAt(d[e]&63));f=-1}}if(f!=undefined&&f!=-1){c.push(b.charAt(f))}while(c.length%4!=0){c.push("=")}return c.join("")},base64ToBytes:function(d){if(typeof atob=="function"){return a.stringToBytes(atob(d))}d=d.replace(/[^A-Z0-9+\/]/ig,"");var c=[];for(var e=0;e<d.length;e++){switch(e%4){case 1:c.push((b.indexOf(d.charAt(e-1))<<2)|(b.indexOf(d.charAt(e))>>>4));break;case 2:c.push(((b.indexOf(d.charAt(e-1))&15)<<4)|(b.indexOf(d.charAt(e))>>>2));break;case 3:c.push(((b.indexOf(d.charAt(e-1))&3)<<6)|(b.indexOf(d.charAt(e))));break}}return c}};Crypto.mode={}})();
/*
 * Crypto-JS v1.1.0
 * http://code.google.com/p/crypto-js/
 * Copyright (c) 2009, Jeff Mott. All rights reserved.
 * http://code.google.com/p/crypto-js/wiki/License
 */
(function(){var a=Crypto.util;Crypto.HMAC=function(g,h,f,d){f=f.length>g._blocksize*4?g(f,{asBytes:true}):a.stringToBytes(f);var c=f,j=f.slice(0);for(var e=0;e<g._blocksize*4;e++){c[e]^=92;j[e]^=54}var b=g(a.bytesToString(c)+g(a.bytesToString(j)+h,{asString:true}),{asBytes:true});return d&&d.asBytes?b:d&&d.asString?a.bytesToString(b):a.bytesToHex(b)}})();
/*
 * Crypto-JS v1.1.0
 * http://code.google.com/p/crypto-js/
 * Copyright (c) 2009, Jeff Mott. All rights reserved.
 * http://code.google.com/p/crypto-js/wiki/License
 */
(function(){var a=Crypto.util;var b=Crypto.SHA1=function(e,c){var d=a.wordsToBytes(b._sha1(e));return c&&c.asBytes?d:c&&c.asString?a.bytesToString(d):a.bytesToHex(d)};b._sha1=function(k){var u=a.stringToWords(k),v=k.length*8,o=[],q=1732584193,p=-271733879,h=-1732584194,g=271733878,f=-1009589776;u[v>>5]|=128<<(24-v%32);u[((v+64>>>9)<<4)+15]=v;for(var y=0;y<u.length;y+=16){var D=q,C=p,B=h,A=g,z=f;for(var x=0;x<80;x++){if(x<16){o[x]=u[y+x]}else{var s=o[x-3]^o[x-8]^o[x-14]^o[x-16];o[x]=(s<<1)|(s>>>31)}var r=((q<<5)|(q>>>27))+f+(o[x]>>>0)+(x<20?(p&h|~p&g)+1518500249:x<40?(p^h^g)+1859775393:x<60?(p&h|p&g|h&g)-1894007588:(p^h^g)-899497514);f=g;g=h;h=(p<<30)|(p>>>2);p=q;q=r}q+=D;p+=C;h+=B;g+=A;f+=z}return[q,p,h,g,f]};b._blocksize=16})();


    var Base64 = {

        // private property
        _keyStr : "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",

        // public method for encoding
        encode : function (input) {
            var output = "";
            var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
            var i = 0;

            input = Base64._utf8_encode(input);

            while (i < input.length) {

                chr1 = input.charCodeAt(i++);
                chr2 = input.charCodeAt(i++);
                chr3 = input.charCodeAt(i++);

                enc1 = chr1 >> 2;
                enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
                enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
                enc4 = chr3 & 63;

                if (isNaN(chr2)) {
                    enc3 = enc4 = 64;
                } else if (isNaN(chr3)) {
                    enc4 = 64;
                }

                output = output +
                this._keyStr.charAt(enc1) + this._keyStr.charAt(enc2) +
                this._keyStr.charAt(enc3) + this._keyStr.charAt(enc4);

            }

            return output;
        },

        // public method for decoding
        decode : function (input) {
            var output = "";
            var chr1, chr2, chr3;
            var enc1, enc2, enc3, enc4;
            var i = 0;

            input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");

            while (i < input.length) {

                enc1 = this._keyStr.indexOf(input.charAt(i++));
                enc2 = this._keyStr.indexOf(input.charAt(i++));
                enc3 = this._keyStr.indexOf(input.charAt(i++));
                enc4 = this._keyStr.indexOf(input.charAt(i++));

                chr1 = (enc1 << 2) | (enc2 >> 4);
                chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
                chr3 = ((enc3 & 3) << 6) | enc4;

                output = output + String.fromCharCode(chr1);

                if (enc3 != 64) {
                    output = output + String.fromCharCode(chr2);
                }
                if (enc4 != 64) {
                    output = output + String.fromCharCode(chr3);
                }

            }

            output = Base64._utf8_decode(output);

            return output;

        },

        // private method for UTF-8 encoding
        _utf8_encode : function (string) {
            string = string.replace(/\r\n/g,"\n");
            var utftext = "";

            for (var n = 0; n < string.length; n++) {

                var c = string.charCodeAt(n);

                if (c < 128) {
                    utftext += String.fromCharCode(c);
                }
                else if((c > 127) && (c < 2048)) {
                    utftext += String.fromCharCode((c >> 6) | 192);
                    utftext += String.fromCharCode((c & 63) | 128);
                }
                else {
                    utftext += String.fromCharCode((c >> 12) | 224);
                    utftext += String.fromCharCode(((c >> 6) & 63) | 128);
                    utftext += String.fromCharCode((c & 63) | 128);
                }

            }

            return utftext;
        },

        // private method for UTF-8 decoding
        _utf8_decode : function (utftext) {
            var string = "";
            var i = 0;
            var c = c1 = c2 = 0;

            while ( i < utftext.length ) {

                c = utftext.charCodeAt(i);

                if (c < 128) {
                    string += String.fromCharCode(c);
                    i++;
                }
                else if((c > 191) && (c < 224)) {
                    c2 = utftext.charCodeAt(i+1);
                    string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
                    i += 2;
                }
                else {
                    c2 = utftext.charCodeAt(i+1);
                    c3 = utftext.charCodeAt(i+2);
                    string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
                    i += 3;
                }

            }

            return string;
        }

    }
