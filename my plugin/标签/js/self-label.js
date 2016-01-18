$.fn.extend({
    labelEdit: function (obj){
        $(this).append('<ul class="label-ul"><li class="label-add">+</li></ul>');
        if(obj&&obj.recommendId&&obj.recommendLabel){
            var aHtml = [];
            aHtml.push('<ul class="recommend-ul">');
            var rArray = obj.recommendLabel;
            if(rArray.length>0) {
                for (var i=0;i<rArray.length;i++) {
                    aHtml.push('<li>'+rArray[i]+'</li>');
                }
            }
            aHtml.push('</ul>');
            $('#'+obj.recommendId).html(aHtml.join(''));

            $('.recommend-ul li').click(function(){
                if($(this).hasClass('selected')){
                    $(this).removeClass('selected');
                    var oLabels = $('input[name="labelName"]');
                    for(var i=0;i<oLabels.length;i++){
                        if($(oLabels[i]).val()==$(this).html()){
                            $(oLabels[i]).parent().remove();
                        }
                    }
                    return
                }

                var inputHtml = '<input type="text" name="labelName" maxlength="10" class="label-text" value="'+$(this).html()+'">';
                $('.label-add').before('<li>'+inputHtml+'<span class="label-del">✕</span></li>');
                isRecommend();
                $('.label-del').click(function(){
                    $(this).parent().remove();
                    isRecommend();
                });
            });

        }
        $('.label-add').click(function(){
            $(this).before('<li><input type="text" name="labelName" maxlength="10" class="label-text"><span class="label-del">✕</span></li>');
            $('.label-del').click(function(){
                $(this).parent().remove();
            });
        });

        function isRecommend(){
            var labelArray = getLabels();
            var oRecommend = $('.recommend-ul li');
            $('.recommend-ul li').removeClass('selected');
            for(var i=0;i<oRecommend.length;i++){
                var oLi = $(oRecommend[i]);
                if(labelArray.indexOf(oLi.html())>=0){
                    oLi.addClass('selected');
                }
            }
        }
        function getLabels(){
            var labelArray = [];
            var oLabels = $('input[name="labelName"]');
            for(var i=0;i<oLabels.length;i++){
                if($(oLabels[i]).val()!=null&&$(oLabels[i]).val()!=''){
                    labelArray.push($(oLabels[i]).val());
                }
            }
            return labelArray;
        }
    }
});