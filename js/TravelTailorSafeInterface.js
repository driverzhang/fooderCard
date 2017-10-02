function toDecimal2(x) { 
var f = parseFloat(x); 
if (isNaN(f)) { 
return false; 
} 
var f = Math.round(x*100)/100; 
var s = f.toString(); 
var rs = s.indexOf('.'); 
if (rs < 0) { 
rs = s.length; 
 s += '.'; 
} 
while (s.length <= rs + 1) { 
s += '0'; 
} 
return s; 
} 
function bodyResize() {

    var creenHerght = $(window).height();
    $('body').height(creenHerght);


}
//var httppp = "http://hx.fuyou.sc.cn";
var map="";
var httppp = "http://wzk.fuyou.sc.cn";

 $.extend($.fn, {
        waitimg: function (Element, isPaste, showMask) {
            var left = ($("body").width() - 200) / 2;
            var top = ($("body").height() - 200) / 2;
            var html = '';
            html += '<div style="position: fixed; left: 0px; top: 0; width: 100%; height: 100%; opacity: 0.4; filter: alpha(opacity=40);z-index:9999;" class="' + Element + '">';
            html += ' <div style="width:100%;height:100%;background-color:#070707;position: absolute; opacity: 0.4; filter: alpha(opacity=40);" ></div>';
            html += '<div style="position: fixed; left: ' + left + 'px; top: ' + top + 'px; width: 200px; height: 200px;" id="hiwait">';
            html += '<img src="wait.gif" />';
            html += '</div>';
            html += '</div>';
            if ($('.' + Element).size() > 0) {
                $('.' + Element).click();
            }
            else {
                $("body").append(html);
                $('.' + Element).click(function () {//可要可不要
                    $('.' + Element).toggle();
                });
            }
        }
    });
     function CurentTimeBydata(fengefu, now, IsHasHM) {
				var year = now.getFullYear(); //年
				var month = now.getMonth() + 1; //月
				var day = now.getDate(); //日
				var hh = now.getHours(); //时
				var mm = now.getMinutes(); //分
				var clock = year + fengefu;
				if(month < 10)
					clock += "0";
				clock += month + fengefu;
				if(day < 10)
					clock += "0";
				if(IsHasHM) {
					clock += day + " ";

					if(hh < 10)
						clock += "0";

					clock += hh + ":";
					if(mm < 10) clock += '0';
					clock += mm;
				} else {
					clock += day;
				}
				return clock;
			}
function CurentTime(fengefu, IsHasHM) {
    var now = new Date();
    var year = now.getFullYear();       //年
    var month = now.getMonth() + 1;     //月
    var day = now.getDate();            //日
    var hh = now.getHours();            //时
    var mm = now.getMinutes();          //分
    var clock = year + fengefu;
    if (month < 10)
        clock += "0";
    clock += month + fengefu;
    if (day < 10)
        clock += "0";
    if (IsHasHM) {
        clock += day + " ";

        if (hh < 10)
            clock += "0";

        clock += hh + ":";
        if (mm < 10) clock += '0';
        clock += mm;
    }
    else {
        clock += day;
    }
    return (clock);
}

//转json数组
function JsonToStrByArray(o) {
    var arr = [];
    var isArr = function (v) {
        return toString.apply(v[0]) === '[object Array]' || toString.apply(v[0]) === '[object Object]' || toString.apply(v[0]) === '[object String]';
    }
    var fmt = function (s) {
        if (typeof s == 'object' && s != null)
            return JsonToStrByArray(s);
        return /^(string|number)$/.test(typeof s) ? "'" + s + "'" : s;
    }
    if (isArr(o)) {
        for (var i in o) {//如果O是数组 I第一次为实体
            if (i != "contains") {
                arr.push(fmt(o[i]));//实体传入后等待遍历执行完毕返回参数
            }
        }
        return '[' + arr.join(',') + ']';
    }
    for (var i in o) {
        if (i != "contains") {
            arr.push("'" + i + "':" + fmt(o[i]));
        }
    }
    return '{' + arr.join(',') + '}';
}

//转Json
function TojSON(ar) {
    var aesko = '';//参数加密后的aes字符串
    var time = CurentTime('-', false)
    var look = ar.InterfaceAddress + "&" + time + "&zhihuimanager";
    var OKEy = hex_md5(look);
    ar.Handshake_Time = time;
    ar.Handshake_Key = OKEy;
    return JsonToStrByArray(ar);
}
///获取AES字符串
function aes(ar, aes, TorF) {
	i99999++;
	
    var aesko = '';//参数加密后的aes字符串
    var time = CurentTime('-', true)
    var look = ar.InterfaceAddress + "&" + time + "&zhihuimanager";
    var OKEy = hex_md5(look);
    ar.Handshake_Time = time;
    ar.Handshake_Key = OKEy;
    var pd = JsonToStrByArray(ar);
    var json = "";
    $.ajax({
        type: "post",
        url: httppp+"/api/SearchAES?" + i99999,
        data: {
            json: pd, // 将 ar中的参数统一转化成JSON数组。
        },
        success: function (rs) {
            aesko = rs;
            setTimeout('safeInterFace("' + aesko + '","' + aes + '","' + TorF + '")', 200);
        },
        error: function () {
        }
    });
}
var i99999 = 0;
//访问接口
//aes回调方法
function safeInterFace(aesko, aes, TorF) {
	i99999++;
    $.ajax({
        type: "post",
        url: httppp + "/api/SafeInfoTest?" + i99999,
        data: {
            value: aesko,
        },
        success: function (rs) {
            eval('' + aes + '(rs)');
        },
        error: function () {
        }
    });
}
        function IdentityCodeValid(code) { 
            var city={11:"北京",12:"天津",13:"河北",14:"山西",15:"内蒙古",21:"辽宁",22:"吉林",23:"黑龙江 ",31:"上海",32:"江苏",33:"浙江",34:"安徽",35:"福建",36:"江西",37:"山东",41:"河南",42:"湖北 ",43:"湖南",44:"广东",45:"广西",46:"海南",50:"重庆",51:"四川",52:"贵州",53:"云南",54:"西藏 ",61:"陕西",62:"甘肃",63:"青海",64:"宁夏",65:"新疆",71:"台湾",81:"香港",82:"澳门",91:"国外 "};
            var tip = "";
            var pass= true;
            
            if(!city[code.substr(0,2)]){
                tip = "身份证号地址编码错误";
                pass = false;
            }
            else{
                //18位身份证需要验证最后一位校验位
                if(code.length == 18){
                	if(code.substring("654124")>=0){
                		return true;
                	}
                    code = code.split('');
                    //∑(ai×Wi)(mod 11)
                    //加权因子
                    var factor = [ 7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2 ];
                    //校验位
                    var parity = [ 1, 0, 'X', 9, 8, 7, 6, 5, 4, 3, 2 ];
                    var sum = 0;
                    var ai = 0;
                    var wi = 0;
                    for (var i = 0; i < 17; i++)
                    {
                        ai = code[i];
                        wi = factor[i];
                        sum += ai * wi;
                    }
                    var last = parity[sum % 11];
                    if(parity[sum % 11] != code[17]){
                        tip = "身份证号校验位错误";
                        pass =false;
                    }
                }else {
                	pass=false;tip="身份证位数错误 ";
                }
            }
            if(!pass) alert(tip);
            return pass;
        }

(function ($) {
    $.extend($.fn, {
        gclClear: function (Element, HtmlElement) {
            $("" + Element + " " + HtmlElement).val();
        },
        POPUP: function (Element, isPaste, showMask, CloseBackFun, openBackFun, RVToID) {
            //$('#popuptocss').POPUP("ClosenRepassPOPUP", "repassID");调用方式
            //Element 参数需要转换为弹出层的元素(限制外部节点 并且需要设置弹出层widht与height)
            //isPaste 触发弹出层的元素 事件为click
            var $this = $(this);
            var POPhtml = "";
            bodyW = document.documentElement.clientWidth;
            bodyH = document.documentElement.clientHeight;
            var left = $(this).width();
            var top = $(this).height();
            var zleft = (bodyW - left) / 2;
            var ztop = (bodyH - top) / 2;
            var popcshtml = $(this).html();
            $(this).attr("style", "display:block");
            if (ztop < 0) { ztop = 0; }
            if (zleft < 0) { zleft = 0; }
            POPhtml += '<div style="position:fixed;left:0;top:0;width:100%;height:100%;z-index:1000;display:none;" class="' + Element + ' GCLAllPopup">';
            POPhtml += '<div style="width:100%;height:100%;position: absolute; opacity: 0.4; filter: alpha(opacity=40);background-color:#070707;"  ></div>';
            POPhtml += '<div style="position: absolute;margin:auto auto; left: ' + zleft + 'px; top: ' + ztop + 'px;z-index:10000;"  tabIndex="1" class="GCLPOP ' + isPaste + '">';
            POPhtml += '<input type="text" style="display:none;">';
            POPhtml += popcshtml;
            //POPhtml += '<input type="button" value="关闭" class="btClose"></div>';
            POPhtml += '</div>';
            POPhtml += '</div>';
            $(this).html(POPhtml);

            var $index = 0;
            $('.' + Element + ' input[type=text]').addClass("gclInput");
            $('.' + Element + ' input[type=password]').addClass("gclInput");
            $('.' + Element + ' .gclInput').each(function () {//避免Input元素无ID，给无Id的Input元素赋值，格式为转换元素id+Input索引
                var $t = $(this);
                if ($t.attr("id") == undefined) {
                    $t.attr("id", $this.attr("id") + $index);
                    $index++;
                }
            });

            $('.' + Element + ' .gclInput').click(function () {//Input元素必须包含ID
                $this.bind("keydown", function (kd) {
                    if (kd.keyCode == 13) {
                        var $this = $(this);
                        var i = 0;
                        $('.' + Element + ' .gclInput').each(function () {
                            i++;
                            if ($(this).attr("id") == $this.attr("id")) {
                                var $index = i;
                                if ($index == $('.' + Element + ' .gclInput').size()) {
                                    if ($('.' + Element + ' .gclInput').size() > 0)
                                        $('.' + Element + ' .GclSubmit')[0].click();
                                }
                                else {
                                    $('.' + Element + ' .gclInput')[$index].focus();
                                }
                            }
                        });
                        $('body').unbind("keydown");
                        return false;
                        //$('.btn-primary').click();
                    }
                    else if (kd.keyCode == 27) {
                        if ($('.' + Element + ' .gclCancleButton').size() > 0)
                            $('.' + Element + ' .gclCancleButton').click();
                        else
                            $('#' + isPaste).click();
                        $('body').unbind("keydown");
                        //$(this).css("style", "none");
                        return false;
                    }

                });

            });
            $('#' + Element + '').click(function () {
                $('.' + Element + '').toggle();
                isCancleButton = false;
                if ($('.' + Element + ' .gclInput').size() > 0) {
                    $('.' + Element + ' .gclInput')[0].click();

                }
                if (thisIsOpen) thisIsOpen = false;
                else thisIsOpen = true;
                if (openBackFun != undefined)
                    if (!thisIsOpen) {
                        if (RVToID == undefined)
                            eval('' + openBackFun + '(thisIsOpen)');
                        else
                            eval('' + openBackFun + '(' + RVToID + ')');
                    }
            });
            $('#' + isPaste + '').click(function () {
                $('.' + Element + '').toggle();
                isCancleButton = true;
                if ($('.' + Element + ' .gclInput').size() > 0) {
                    $('.' + Element + ' .gclInput')[0].click();

                }
                if (thisIsOpen) thisIsOpen = false;
                else thisIsOpen = true;
                if (CloseBackFun != undefined)
                    eval('' + CloseBackFun + '(thisIsOpen)');
            });

            $(showMask).drag('.' + isPaste);
        },
        Calculator: function (Element) {
            ///只需要前面的元素为你需要返回值的元素就ok
            if ($('#calcuatorBod').size() > 0) {

            }
            else {
                var CalHtml = '';
                CalHtml += ' <div id="calcuatorBod" style="width: 200px;height: 245px;">';
                CalHtml += ' <div id="calcuator">';
                CalHtml += ' <input type="text" id="input-box" value="0" size="21" maxlength="21" readonly="readonly" name="type">';
                CalHtml += ' <div id="btn-list">';
                CalHtml += ' <div class=" btn-30 btn-radius color-red clear-marginleft">C</div>';
                CalHtml += ' <div class=" btn-30 btn-radius color-blue">+/-</div>';
                CalHtml += ' <div class=" btn-30 btn-radius color-blue">%</div>';
                CalHtml += ' <div class=" btn-70 btn-radius color-red font-14">←</div>';
                CalHtml += ' <div class=" btn-30 btn-radius clear-marginleft">7</div>';
                CalHtml += ' <div class=" btn-30 btn-radius">8</div>';
                CalHtml += ' <div class=" btn-30 btn-radius">9</div>';
                CalHtml += ' <div class=" btn-30 btn-radius color-blue font-14">+</div>';
                CalHtml += ' <div class=" btn-30 btn-radius color-blue font-14">-</div>';
                CalHtml += ' <div class=" btn-30 btn-radius clear-marginleft">4</div>';
                CalHtml += ' <div class=" btn-30 btn-radius">5</div>';
                CalHtml += ' <div class=" btn-30 btn-radius">6</div>';
                CalHtml += ' <div class=" btn-30 btn-radius color-blue font-14">×</div>';
                CalHtml += ' <div class=" btn-30 btn-radius color-blue font-12">÷</div>';
                CalHtml += ' <div class=" btn-30 btn-radius clear-marginleft">1</div>';
                CalHtml += ' <div class=" btn-30 btn-radius">2</div>';
                CalHtml += ' <div class=" btn-30 btn-radius">3</div>';
                CalHtml += ' <div class=" btn-30 btn-radius color-blue font-14">×²</div>';
                CalHtml += ' <div class=" btn-30 btn-radius color-blue font-12" id="calcuatorYES">√</div>';
                CalHtml += ' <div class=" btn-70 btn-radius clear-marginleft">0</div>';
                CalHtml += ' <div class=" btn-30 btn-radius">.</div>';
                CalHtml += ' <div class=" btn-70 btn-radius color-red font-14">=</div>';
                CalHtml += ' <div id="Mock" style="display:none"></div></div>';
                CalHtml += ' </div>';
                CalHtml += ' </div>';
                $("body").append(CalHtml);
                $('#calcuatorBod').POPUP("Mock", "", "");

            }
            var LastNum = 0;
            var LastSign = "";
            var InventSign = "";
            var $Tthis = $(this);
            $('.btn-radius').unbind("click");
            $('.btn-radius').click(function () {
                var $this = $(this).text();
                var reg = /^[\.0-9]+$/;
                var numm = $('#input-box').val() == "0" ? "" : $('#input-box').val();//当前屏幕显示
                var boole = false;
                if ($this == "√") {
                    var doDocumentType = document.getElementById($Tthis.attr("Id")).nodeName;
                    $Tthis.focus();
                    if (doDocumentType == "INPUT") {
                        $Tthis.val(parseFloat($('#input-box').val()));
                    }
                    else {
                        $Tthis.text(parseFloat($('#input-box').val()));
                    }
                    $('#Mock').click();
                }
                else {
                    if ($this == "=") {

                    }
                    else if ($this == "C") {
                        LastSign = "";
                        LastNum = 0; boole = true;
                    }
                    else if ($this == "←") {
                        numm = numm.substring(0, numm.length - 1);
                        LastNum = numm; boole = true;
                    }
                    else {
                        if (!reg.test(numm.substring(numm.length - 1)) && !reg.test($this)) {
                            numm = numm.substring(0, numm.length - 1);
                        }
                        LastNum = numm + $this;
                    }
                    if (!reg.test($this)) //输入不为数字
                        if (!reg.test(numm)) //当前框不为数字
                            $('#input-box').val(MathToSign(LastNum, LastSign, $this));
                        else
                            $('#input-box').val(MathToSign(LastNum, LastSign, $this));
                    else//输入为数字
                        $('#input-box').val(LastNum);
                    if (!reg.test($this) && !boole) {//输入不为数字
                        LastSign = $this;
                    }
                }
            });//注册事件

        },
        showimgToBig: function (Element, isPaste, showMask) {
            //$("body").waitimg();
            var left = (bodyW - 200) / 2;
            var top = (bodyH - 200) / 2;
            var winW = $(window).width();
            var winH = $(window).height();
            var html = '';
            html += '<div style="position: fixed; left: 0; top: 0; width: 100%; height: 100%;z-index:10001" class="GCLShowimg">';
            html += ' <div style="width:100%;height:100%;position: absolute; opacity: 0.4; filter: alpha(opacity=40);background-color:#070707;" ></div>';
            html += '<div style="position: absolute;margin:auto auto; left: ' + left + 'px; top: ' + top + 'px;z-index:10000;" id="GCLhiShow">';
            html += ' <img src="/Content/imgs/imgLoading.gif?1=1" class="gclwaitingImg" />';
            html += '<img src="' + Element + '?temp=' + (new Date().getTime().toString()) + '" style="display:none;max-width:' + (winW - 10) + 'px;max-height:' + (winH - 10) + 'px" id="gclshowImg" />';
            html += '</div>';
            html += '</div>';
            $("body").append(html);
            $('.GCLShowimg').on("click", function () {
                $(this).remove();
            });
            $('#GCLhiShow').on("click", function () {
                return false;
            });
            left = ((bodyW - $('#gclshowImg').width()) / 2);
            top = ((bodyH - $('#gclshowImg').height()) / 2);
            //$('img').on("onload", function () {
            //    $('#GCLhiShow').css("left", left);
            //    $('#GCLhiShow').css("top", (top > 0 ? top + "px" : $('#GCLhiShow').css("top")));
            //});
            GCLShowOption("gclshowImg");
        },
        GCLH5UploadFile: function (imgData, success) {
            if ($('#gCLH5UploadFiles').size() == 0) {
                var h5UploadFile = '<div id="gCLH5UploadFiles" style="width: 580px; display: none; height: 400px; position: fixed;">';
                h5UploadFile += '<div style="width: 580px; height: 470px; border-radius: 8px; border: 1px solid; background-color: #64b7f6; margin: auto auto;">';
                h5UploadFile += '<div style="height: 4%; min-height: 34px; width: 100%; font-size: 30px; color: #ffffff; cursor: pointer;" id="gCLH5UploadFilesHeader">&nbsp;文件上传</div>';
                h5UploadFile += '<div style="background-color: #e0eef9; width: 99%; height: 89%; margin: auto auto;">';
                h5UploadFile += '   <div class="row">';
                h5UploadFile += '       <label for="fileToUpload">Select a File to Upload</label><br />';
                h5UploadFile += '       <input type="file" name="fileToUpload" multiple id="fileToUpload" onchange="fileSelected();" />';
                h5UploadFile += '    </div>';
                h5UploadFile += '   <div id="list"></div>';
                h5UploadFile += '   <div id="fileSize"></div>';
                h5UploadFile += '   <div id="fileType"></div>';
                h5UploadFile += '   <div class="row">';
                h5UploadFile += '       <input type="button" onclick="uploadFile()" value="Upload" />';
                h5UploadFile += '       <input type="button" id="gCLH5UploadFilesOpen" class="gclCancleButton" style="display: none;"  onclick="uploadFile()" value="Upload" />';
                h5UploadFile += '   </div>';
                h5UploadFile += '   <div id="progressNumber"></div>';
                h5UploadFile += '   <div id="gCLH5UploadFilesOpen"></div>';
                h5UploadFile += ' </div>';
                h5UploadFile += ' </div>';
                h5UploadFile += '</div>';
                $('body').append(h5UploadFile);
                $('#gCLH5UploadFiles').POPUP("gCLH5UploadFilesOpen", "", "#gCLH5UploadFilesHeader");
            } else {
                uploadComplete(imgData);
                $('#gCLH5UploadFilesOpen').click();
            }

        }
    });
    $.extend($.fn, {
        waitimg: function (Element, isPaste, showMask) {
            var left = ($("body").width() - 200) / 2;
            var top = ($("body").height() - 200) / 2;
            var html = '';
            html += '<div style="position: fixed; left: 0px; top: 0; width: 100%; height: 100%; opacity: 0.4; filter: alpha(opacity=40);z-index:9999;" class="' + Element + '">';
            html += ' <div style="width:100%;height:100%;background-color:#070707;position: absolute; opacity: 0.4; filter: alpha(opacity=40);" ></div>';
            html += '<div style="position: fixed; left: ' + left + 'px; top: ' + top + 'px; width: 200px; height: 200px;" id="hiwait">';
            html += '<img src="/Content/themes/gcl/Img/wait.gif" />';
            html += '</div>';
            html += '</div>';
            if ($('.' + Element).size() > 0) {
                $('.' + Element).click();
            }
            else {
                $("body").append(html);
                $('.' + Element).click(function () {//可要可不要
                    $('.' + Element).toggle();
                });
            }
        }
    });
    $.extend($.fn, {
        waitimgToDiv: function (Element, isPaste, showMask) {
            var width = $(this).eq(0).width();
            var heigth = $(this).eq(0).height();
            var margintop = $(this).eq(0).css("margin-top");
            var marginright = $(this).eq(0).css("margin-right");
            if (!(margintop.indexOf("px") || margintop.indexOf("PX"))) { margintop += "px"; }
            if (width < 200) { width = 200; }
            if (heigth < 200) { heigth = 200; }
            var left = (width - 200) / 2;
            var top = (heigth - 200) / 2;
            if (top < 0) { top = 0; }
            var cshtml = $(this).eq(0).html();
            var html = '';
            html += ' <div style="position: absolute;width:' + width + 'px;height:' + heigth + 'px;margin-top:' + margintop + '; opacity: 0.4; filter: alpha(opacity=40);" class="GCLwaitimg">';
            html += '  <div style="width:100%;height:100%;background-color:#070707;position: absolute; opacity: 0.4; filter: alpha(opacity=40);" ></div>';
            html += '<div style="position: absolute; left: ' + left + 'px; top: ' + top + 'px; width: 200px; height: 200px;" id="hiwait">';
            html += ' <img src="/Content/themes/gcl/Img/wait.gif" />';
            html += '</div>';
            html += '</div>';
            $(this).before(html);
            GCLCloseImgToDiv(this);
        }
    });

})(jQuery);

