// JavaScript Document

(function($){

    $.fn.extend({

        "youcolor":function(addclass,list){
alert("4444");
            initDiv(addclass);
           // $(this).css("background", "#588600");
            $(this).addClass(addclass);
            //取消当前div的mouseout和mouseover事件
           // $(this).unbind("mouseout");
          //  $(this).unbind("mouseover");
            function initDiv(value) {
                $(list).removeClass(addclass);
                //$(list).mouseover(function () {
                //     $(this).addClass(addclass);
                //  })
                //      .mouseout(function () {
                //          $(this).removeClass(addclass);
                //      })
            }
        },

        "border":function(value){

            //插件代码

        },

        "background":function(value){

        //插件代码

    }

});

})(jQuery);






var youtu = {
//异步请求
    ajax:function(murl,mdata,method,success){

        $.ajax({
			 url: murl,
            type: method,
            dataType : "json",
           data: mdata,
           // data: JSON.stringify(
           //     mdata
           // ),
           // beforeSend: function () {
           //     alert('请求之前');
           // },
            success: function (data) {
                //console.log(data);
                success?success(data):function(){};
            },
			  error: function (data){
             //   console.log(data);
                alert("请求失败");
            }
        });
    },
	
	//弹框
	dialog:function(src,width,height) {
	  var browsewidth = $(window).width();
            var browseheight = $(window).height();
            var cwinwidth = width;
            var cwinheight = height;
            var scrollLeft = $(window).scrollLeft();
            var scrollheight = $(window).scrollTop();
            var left = scrollLeft + (browsewidth - cwinwidth) / 2;
            var top = scrollheight + (browseheight - cwinheight) / 2;
			
               // create('Tspage/' + $(this).attr('id')+'.html');
			   create(src,width,height,top,left);
            },
	
	
}


       function create(src,width,height,top,left) {
		    
            $("body").append("<div id='bg'></div><div id='bgiframe' width='"+ width + "' height='"+ height + "'><iframe scrolling='no' frameborder='0' src='" + src + " ' width='"+ width + "' height='"+ height + "'></iframe>");
   $("#bgiframe").css('top',top);
   $("#bgiframe").css('left',left);
            $('.back').click(function () {
                deleteiframe();
                $(window).scrollTop(0);
            });
        }
		function SetHeight(value) {
            $("iframe").height(value + 2);
            $("#bgiframe").height(value + 2);
        }
		  function deleteiframe() {
            $('#bg,#bgiframe').remove();
            $('.mainContent').show();
        }
        

