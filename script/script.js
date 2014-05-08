// var CURL = document.referrer;   //获取来路 URL
// var Chref = CURL.substr(0,CURL.lastIndexOf("/"))+'/';  //截取来路的目录
var URL = window.location.href; //获取主域名
// var PATH = window.location.pathname;    //获取文件夹
var PID = window.location.hash;   //获取问号之后的部分
var href = URL.substr(0,URL.lastIndexOf("/"))+'/';  //截取项目的目录
var LID = PID.substr(2);    //截取#!
var WebTitle = $('title').html();   //获取主页标题
var edition = "0_0_1";  //设置版本号（对应文件夹）

jQuery(document).ready(function($) {   
    //当页面框架载入完成后运行打括号内的代码
    var MainBox = $('#Main>.centerbox');    // 设置主要内容的容器
    var loadingbar = $("#loadingbar");  //进度条

    // 输出菜单，对应 json 存放在 list.js 中，页面已经引用！
    if (list[0]) {  
        //如果载入的内容并非空白运行下面代码
        for (i = 0; i < list.length; i++) { 
            //设置始起的值是 0，每循环一次加1，当循环次数等于 list 中数组数量相同时候停止循环（因为 i 第一次为0，所以 i 最大值等于数组的数量减去1）
            $('#list>#list-box>ol').append('<li><a id="'+list[i].LoadID+'" data-listid="'+i+'" href="'+href+'#!'+list[i].LoadID+'">'+list[i].title+'</a></li>');    //循环输出 li 菜单
        };
    };
    function retinaImg (ajaxBox) {
        if (ajaxBox) {
            var Img = $(ajaxBox+' img');
        } else{
            var Img = $('img');
        };
        if (window.devicePixelRatio && window.devicePixelRatio > 1) {
            //判断是否 Retina 屏幕
            Img.attr('',function () {
                var retina = $(this).data('retina');
                var imgSrc = $(this).attr('src');
                if (retina && imgSrc != retina) {
                    // 如果需要 Retina src 则替换
                    $(this).attr("src",retina);
                };
            });
        };
    };
    retinaImg('body');

    function errorText () {
        $('body').append('<div id="warn" class="center"><div><div class="e-mark"></div><br />網路連接有誤，無法載入內容！</div></div>');
        $('#warn').hide();
        $('#warn').fadeIn("1000");
    }

    function LoadData(LoadPage,go,Home) {   
        //载入页面内容的函数
        if ($('#warn').length > 0) {
            //  判断之前提示框是否存在
            $('#warn').fadeOut("1000",function(){
                $('#warn').detach();   //先淡出再删除提示框
            });
        };

        if (Home) {
            //如果是首页则显示封面
            $('header').fadeIn('300');
            $('#list-box>ol>li>a').removeClass('current-cat');
            $('title').html('制作一个简单的网页');
        // } else {
        //     $('header').fadeOut('300');
        };

        if (!Home) {
            $.ajax({
                url: edition+"/"+LoadPage+".html",  //设置载入文件路径
                cache: false,
                // type: "post",
                beforeSend: function(){
                    //发送 Ajax 之前运行
                    loadingbar.addClass('op1'); //显示进度条
                },

                success: function(page){
                    //接受返回数据成功之后运行
                    LID = LoadPage;   //更新固定值

                    $('#list-box>ol>li>a').removeClass('current-cat');  // 清除目录的状态
                    $('#'+LID).addClass('current-cat'); //给当前目录中的当前条目添加状态

                    for (i = 0; i < list.length; i++) {
                        if (list[i].LoadID===LoadPage) {
                            $('title').html(list[i].title+' - '+WebTitle); // 遍历 json 设置对应标题
                            if (go) {
                                // 判断 go 的值是否为空，如果不为空就修改 URL
                                title = list[i].title;  //获取上面 json 对应的标题
                                window.history.pushState(null, title, "#!"+LoadPage);  //修改 url
                                $("html,body").animate({scrollTop: $("#Main").offset().top}, 500);  //跳转到内容顶部
                            };
                            break;  //终止循环
                        };
                    };

                    MainBox.css("opacity","0");   //替换内容前先隐藏容器
                    setTimeout(function(){
                        //延时执行内容替换和显示
                        MainBox.html(page); // 替换主内容
                        retinaImg('#Main>.centerbox');
                        MainBox.css('opacity','1')  //显示主内容
                        $('#loadingbar').removeClass('op1')
                        $('header').fadeOut('300'); //载入内容成功之后才隐藏封面
                    },300);
                },

                error: function(){
                    //载入内容失败时候运行

                    loadingbar.addClass('warn');    //进度条变为橘色
                    setTimeout(function(){
                        errorText (); // 弹出错误提示筐
                        $('#loadingbar').removeClass('op1') //隐藏进度条
                    },700);
                    setTimeout(function(){
                        loadingbar.removeClass('warn'); //保证进度条不是橘色
                    },3000);
                }
            });
        };
    }

    /*  判断 url 载入内容，有下面的 window.addEventListener 就不需要这里了!
    *   但是 Firefox 和 IE 不能直接用 window.addEventListener 载入内容所以判断一下浏览器。
    *   navigator.userAgent.match("MSIE")||navigator.userAgent.match("Firefox")
    */
    if (navigator.userAgent.match("MSIE")||navigator.userAgent.match("Firefox")) {
        if (PID) {
            LoadData(LID);
        }else {
            LoadData('','','home');
        };
    };


    setTimeout(function(){
        $("#list").addClass('hidden'); //隐藏菜单
    },1500);

    // 菜单操作
    $('#list').on("click", "#list-button", function() { 
        // #list 中的 #list-button 点击
        $("#list").toggleClass('hidden');   //点击收缩菜单
    });
    $('#list-box>ol').on("click", "a", function(){  
        //使用 on 是可以让 jQuery 后来载入的内容也可以支持点击动作
    	var href = $(this).attr("href");   //获取a标签 URL
    	var PageID = href.substring(href.lastIndexOf("#!"));    // 获取 URL 问号之后的字符
    	var LoadID = PageID.substr(2); //截取前面的问号
    	if (PageID) {  
            //如果 PageID 存在运行下面的内容
            if (LoadID!=LID) {  
                //判断点击连接是否当前页面，不是的话就载入内容
        		LoadData(LoadID,'go'); //载入页面内容，后面的 'go' 告诉函数这个是点击向前的操作。
            };
            return false; //阻止a标签跳转
    	};
	}); 

    // 提示框
    $('body').on("click", "#warn", function() { 
        $(this).fadeOut("1000",function(){
            $(this).detach();   //先淡出再删除提示框
        });
    });


    $('#btc-key').hover(function() {
        $(this).select();
    });
    $('#btc>span').click(function() {
        $("#btc>ul").toggleClass('block');
    });
    
	// 浏览器前进后退按钮
	window.addEventListener('popstate', function(e){   
        //当点击浏览器前进后退按钮时候
		if (history.pushState){
            var PID = window.location.hash; //重新获取对应的值
            LID = PID.substr(2);    //设置当前页面的值
            if (PID) {
                LoadData(LID);
            } else{
                LoadData('','','home');
            };
		}
	}, false);				
});