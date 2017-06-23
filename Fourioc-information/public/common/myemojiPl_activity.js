var touser=[];
$("#info-show").on('touchstart','a>div>img',function(e){

	var obj = new Object()
	var info_name=$(this).attr('name');
	$(".Input_text").html("@"+info_name);
	//alert("1114");
//alert($(this).parent().parent().attr('id'));
	var id_b=$(this).parent().parent().attr('id');
	//    alert($(this).attr('name'));
	var name_b=$(this).attr('name');
	//    alert($(this).next().html());
	var identity_b=$(this).next().html();
	//    alert($(this).next().next().html());
	var  ext_b=$(this).next().next().html();

	obj.userid=id_b;
	obj.name=name_b;
	obj.identity=identity_b;
	obj.ext=ext_b;

	touser.push(obj)
	//   alert(touser);
//alert(JSON.stringify(touser));






//alert($(this).attr('id'));

	//timeOutEvent = setTimeout("longPress()",1500);

	//	 	e.preventDefault();
	//});

});
function getParameterByName(name) {
	var match = RegExp('[?&]' + name + '=([^&]*)')
		.exec(window.location.search);
	return match && decodeURIComponent(match[1].replace(/\+/g, ' '));
}
var user_name = getParameterByName('user_name');
var corpid=getParameterByName('corp_id');
var userid=getParameterByName('user_id');

var sid=getParameterByName('sid');
if(sid==""||sid==null||sid==undefined){
	var identity = 2;
	var ext = 0;

}else {
	identity = 1;
	ext = sid;
}



//

(function($, window, document, undefined) {
	var avatar = '';
	var username = '';
	$.ajax({
		url:'/api/v1/personal_info/info?'+'corpId=' + corpid + '&userid=' + userid,
		type: 'get',
		contentType: "application/json",
		dataType:'json',
		success: function (data) {
			if(data.success==0){
				avatar = data.data.info.avatar;
				username = data.data.info.name;
			}else {
			}
		},
		error:function(){
		}

	});
	num();
	'use strict';
	$.fn.myEmoji = function(options) {
		var defaults = {
			emojiconfig: {
				tieba: {
					name: "贴吧表情",
					path: "../common/img/tieba/",
					maxNum: 50,
					file: ".jpg",
					placeholder: ":{alias}:",
					alias: {
						1: "hehe",
						2: "haha",
						3: "tushe",
						4: "a",
						5: "ku",
						6: "lu",
						7: "kaixin",
						8: "han",
						9: "lei",
						10: "heixian",
						11: "bishi",
						12: "bugaoxing",
						13: "zhenbang",
						14: "qian",
						15: "yiwen",
						16: "yinxian",
						17: "tu",
						18: "yi",
						19: "weiqu",
						20: "huaxin",
						21: "hu",
						22: "xiaonian",
						23: "neng",
						24: "taikaixin",
						25: "huaji",
						26: "mianqiang",
						27: "kuanghan",
						28: "guai",
						29: "shuijiao",
						30: "jinku",
						31: "shengqi",
						32: "jinya",
						33: "pen",
						34: "aixin",
						35: "xinsui",
						36: "meigui",
						37: "liwu",
						38: "caihong",
						39: "xxyl",
						40: "taiyang",
						41: "qianbi",
						42: "dnegpao",
						43: "chabei",
						44: "dangao",
						45: "yinyue",
						46: "haha2",
						47: "shenli",
						48: "damuzhi",
						49: "ruo",
						50: "OK"
					},
					title: {
						1: "呵呵",
						2: "哈哈",
						3: "吐舌",
						4: "啊",
						5: "酷",
						6: "怒",
						7: "开心",
						8: "汗",
						9: "泪",
						10: "黑线",
						11: "鄙视",
						12: "不高兴",
						13: "真棒",
						14: "钱",
						15: "疑问",
						16: "阴脸",
						17: "吐",
						18: "咦",
						19: "委屈",
						20: "花心",
						21: "呼~",
						22: "笑脸",
						23: "冷",
						24: "太开心",
						25: "滑稽",
						26: "勉强",
						27: "狂汗",
						28: "乖",
						29: "睡觉",
						30: "惊哭",
						31: "生气",
						32: "惊讶",
						33: "喷",
						34: "爱心",
						35: "心碎",
						36: "玫瑰",
						37: "礼物",
						38: "彩虹",
						39: "星星月亮",
						40: "太阳",
						41: "钱币",
						42: "灯泡",
						43: "茶杯",
						44: "蛋糕",
						45: "音乐",
						46: "haha",
						47: "胜利",
						48: "大拇指",
						49: "弱",
						50: "OK"
					}
				}
				//, AcFun: {
				// 	name: "AcFun表情",
				// 	path: "img/AcFun/",
				// 	maxNum: 54,
				// 	file: ".png"
				// }
			},
			postFunction: function() {

				//	alert(homework_id);
				//	alert(corp_id);
				//	alert(userid);
				//	alert(identity);
				//	alert(ext);
				//alert($("#person_name").html());

				var text=InputText.html()
				//alert(InputText.html());
				var person_name=$("#create_person_name").html();


//alert(JSON.stringify(touser));


				$.ajax({

					url:'/wxqyh/reply/activity/'+activity_id,
					type: 'post',
					contentType: "application/json",
					dataType:'json',
					data:JSON.stringify({
						corpid:corp_id,
						userid:userid,
						identity:identity,
						ext:ext,
						name:username,
						touser:touser,
						message:text//消息里面不包括@xxx,@xxx
					}),
					success: function (data) {
if(data.success==0){

}else {
	alert(data.desc);
	$.toast("发表失败");
}
					},
					error:function(){
						$.toast("发表失败2");
					}

				})


				//alert($("#info-show a").find("div").next().find("div").html());
				num2();
		//	alert($("#info-show a").length);

				var time= new Date().format('yyyy-mm-dd');
	//alert("现在是"+time);

				//alert("1111111");
				//获取info-show ul，添加.append(),添加动态内容的函数reply(),
				//把输入框获取的内容InputText.html()传入到函数reply()里面
				$('#info-show').append(reply(InputText.html()));
				//声明变量html，用于动态显示
				var html;
				//函数reply()可穿入参数一个，参数变量content
		function reply(content){
			var	img_b=$("#create_person_pic").attr("src");
			var	name_b=$("#create_person_name").html();



			html ='<a href="javascript:void(0);"  id="'+userid+'" class="weui_media_box weui_media_appmsg">';
			html +='<div class="weui_media_hd" id="touchArea">';
			html +='<img  name="'+name+'" class="weui_media_appmsg_thumb" src="'+avatar+'"  alt="">';
			html +='<p class="weui_media_desc" style="display: none">'+identity+'</p>';
			html +='<p class="weui_media_desc" style="display: none">'+ext+'</p>';
			html +='</div>';
			html +='<div class="weui_media_bd">';
			html +='<h4 class="weui_media_title"><span class="name_box">'+username+'</span><p class="time_box">'+time+'<p></h4>';
			//html +='<p class="weui_media_desc">'+message+'</p>';
			html +='<p class="weui_media_desc">'+content+'</p>';
			//html +='<div class=""><span class="weui_btn weui_btn_mini weui_btn_warn delete_button" onclick="delete_button(&quot;'+userid+'&quot;)">删除</span></div>';


			html +='</div>';
			html +='</a>';

			return html;
		}
				//alert(InputText.html());
				//获取的输入框的值，填入"",为空
				InputText.html("");
				//console.log(InputText.html());



			}
		};
		var opts = $.extend(defaults, options);
		var emojiconfig = opts.emojiconfig;
		var plBox = $(this);
		var InputBox = plBox.find('.Input_Box');
		var faceDiv = plBox.find('.faceDiv');
		var InputText = InputBox.find('.Input_text');
		var InputFoot = InputBox.find('.Input_Foot');
		var imgBtn = InputFoot.find('.imgBtn');

		imgBtn.click(
			function() {
			InputFoot.css('position','relative');
				var emojiContainer = faceDiv.find('.emoji_container');
				if (emojiContainer.children().length <= 0) {

					faceDiv.css({
						//width: Math.floor(InputText.width() / 30) * 30 + 'px',
						display: 'block'
					});
					for (var emojilist in emojiconfig) {
						emojiContainer.append('<section class="for_' + emojilist + '"></section>');
						faceDiv.find('.emoji_tab').append('<a href="#!" data-target="for_' + emojilist + '"></a>');
						for (var i = 1; i <= emojiconfig[emojilist].maxNum; i++) {
							if (emojiContainer.find('.for_' + emojilist) !== undefined) {
								emojiContainer.find('.for_' + emojilist).append('<a href="#!" class="_img"><img src="' + emojiconfig[emojilist].path + i + emojiconfig[emojilist].file + '" alt="" data-alias="'+(emojiconfig[emojilist].alias == undefined ? (i+emojiconfig[emojilist].file) : emojiconfig[emojilist].alias[i])+'" title="' + (emojiconfig[emojilist].title == undefined ? '' : emojiconfig[emojilist].title[i]) + '" /></a>');
							}
						}
					}
						$('.Input_text').focus(function(){

					faceDiv.css({

						//width: Math.floor(InputText.width() / 30) * 30 + 'px',
						display: 'none'
					});

					})
					faceDiv.find('.emoji_container section')[0].style.display = 'block';
					faceDiv.find('.emoji_tab a')[0].className += 'active';
					faceDiv.find('.emoji_container ._img').on('click', function() {
						if (InputText[0].nodeName === 'DIV') {
							InputText.append(this.innerHTML);
						} else {
							InputText.append('[' + $(this).find('img').attr('data-alias')+']');
						}

					});
					faceDiv.find('.emoji_tab a').on('click', function() {
						$(this).parent().prev().find('section').hide();
						faceDiv.find('.emoji_container .' + $(this).attr('data-target')).show();
						faceDiv.find('.emoji_tab a').removeClass('active');
						this.className += ' active';
					});
				} else {
					faceDiv.toggle();
				}
			}
		);

		InputFoot.find('.postBtn').on('click', opts.postFunction);
		$(document).on('click', function(e) {

			if ((faceDiv.find($(e.target)).length) <= 0 && (InputBox.find($(e.target)).length <= 0)) {
				InputFoot.css('position','fixed');
				faceDiv.hide();
			}
		});
	};
})(jQuery, window, document);
Date.prototype.format = function(format) {
		if (isNaN(this)) return '';
		var o = {
			'm+': this.getMonth() + 1,
			'd+': this.getDate(),
			'h+': this.getHours(),
			'n+': this.getMinutes(),
			's+': this.getSeconds(),
			'S': this.getMilliseconds(),
			'W': ["日", "一", "二", "三", "四", "五", "六"][this.getDay()],
			'q+': Math.floor((this.getMonth() + 3) / 3)
		};
		if (format.indexOf('am/pm') >= 0) {
			format = format.replace('am/pm', (o['h+'] >= 12) ? '下午' : '上午');
			if (o['h+'] >= 12) o['h+'] -= 12;
		}
		if (/(y+)/.test(format)) {
			format = format.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
		}
		for (var k in o) {
			if (new RegExp("(" + k + ")").test(format)) {
				format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
			}
		}
		return format;
	}
	
function num(){
	
	
var a=eval($("#info-show a").length);
var c=$(".info_num").html();
c=eval(a+0);
$(".info_num").html(c);
	//for(i=0;i<a.lenght;i++){
		
//		}
	}
	
	
function num2(){
	
	
var a=eval($("#info-show a").length);
var c=$(".info_num").html();
c=eval(a+1);
$(".info_num").html(c);
	//for(i=0;i<a.lenght;i++){
		
//		}
	}
		
	
		

		
		
	
	function aaa(id,time99){
		var time= new Date().format('yyyy-mm-dd hh：nn：ss');
		
		for(i<0;i<a.lenght;i++){
			alert(a[i].id);
			alert(a[i].time99);
			
			
			}
		
		
		
		
		}