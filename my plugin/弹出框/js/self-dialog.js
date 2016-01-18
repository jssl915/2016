$.extend({
    'dialogConfirm':function(obj){
        var title="温馨提示";
        var content = "确定要删除吗！";
        if(obj){
            title=obj.title;
            content=obj.content;
        }
        //创建弹出层遮罩
        var oDivFade = $('<div class="dialog-fade-hide"></div>');
        $('body').append(oDivFade);
        var aHtml = [];
        aHtml.push('<div class="dialog-div">');
        aHtml.push('<div class="dialog-header">'+title+'</div>');
        aHtml.push('<div class="dialog-center">'+content+'</div>');
        aHtml.push('<div class="dialog-footer"><button id="dialogConfirmBtn" class="dialog-btn submit">确定</button>');
        aHtml.push('<button id="dialogCancelBtn" class="dialog-btn cancel">取消</button></div></div>');
        $('body').append(aHtml.join(''));
        //动画效果
        $('.dialog-fade-hide').fadeIn('fast',function(){
            $('.dialog-div').animate({top:'50%',opacity:1},'fast');
        });
        //确定
        $('#dialogConfirmBtn').click(function(){
            $('.dialog-div').animate({top:-250,opacity:0},'fast',function(){
                oDivFade.remove();
                $('.dialog-div').remove();
                obj.onSubmit && obj.onSubmit();
            });

        });
        //取消
        $('#dialogCancelBtn').click(function(){
            $('.dialog-div').animate({top:-250,opacity:0},'fast',function(){
                oDivFade.remove();
                $('.dialog-div').remove();
                obj.onCancel && obj.onCancel();
            });
        });
        //点遮罩取消
        $('.dialog-fade-hide').click(function(){
            $('.dialog-div').animate({top:-250,opacity:0},'fast',function(){
                oDivFade.remove();
                $('.dialog-div').remove();
            });
        })
    },
    'dialogAlert':function(obj){
        var title="温馨提示";
        var content = "该字段不能为空！";
        if(obj){
            title=obj.title;
            content=obj.content;
        }
        //创建弹出层遮罩
        var oDivFade = $('<div class="dialog-fade-hide"></div>');
        $('body').append(oDivFade);
        var aHtml = [];
        aHtml.push('<div class="dialog-div">');
        aHtml.push('<div class="dialog-header">'+title+'</div>');
        aHtml.push('<div class="dialog-center">'+content+'</div>');
        aHtml.push('<div class="dialog-footer"><button id="dialogCloseBtn" class="dialog-btn close">关闭</button></div></div>');
        $('body').append(aHtml.join(''));
        //动画效果
        $('.dialog-fade-hide').fadeIn('fast',function(){
            $('.dialog-div').animate({top:'50%',opacity:1},'fast');
        });
        //取消
        $('#dialogCloseBtn').click(function(){
            $('.dialog-div').animate({top:-250,opacity:0},'fast',function(){
                oDivFade.remove();
                $('.dialog-div').remove();
            });
        });
        //点遮罩取消
        $('.dialog-fade-hide').click(function(){
            $('.dialog-div').animate({top:-250,opacity:0},'fast',function(){
                oDivFade.remove();
                $('.dialog-div').remove();
            });
        })
    }
});
