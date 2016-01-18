//失去焦点验证方法
function validate(data){
    //加鼠标事件
    for(var key in data) {
        (function(id){
            var oDom = $('#' + id);
            oDom.focusout(function(){
                if(data[id]['required']){
                    //如果不为空的话，再判断类型
                    if(errorEmpty(id)){
                        errorType(id);
                    };
                }else{
                    errorType(id);
                }
            });
        }(key));
    }

    function errorType(id){
        //判断手机号
        if(data[id]['mobile']) {
            errorMobile(id);
        }
        //判断最小长度
        if(data[id]['minLength']) {
            if(errorMinLength(id,data[id]['minLength'])){
                if(data[id]['maxLength']) {
                    errorMaxLength(id, data[id]['maxLength']);
                }
            }
        }else{
            if(data[id]['maxLength']) {
                errorMaxLength(id, data[id]['maxLength']);
            }
        }
        //判断正整数
        if(data[id]['integer']) {
            errorInteger(id);
        }
        //判断金额
        if(data[id]['mount']) {
            errorMount(id);
        }
        //判断用户名
        if(data[id]['username']) {
            errorUserName(id);
        }
        //判断名称
        if(data[id]['name']) {
            errorName(id);
        }
    }
}

//提交验证方法
function validateSubmit(data){
    var flag = true;
    for(var id in data){
        if(data[id]['required']) {
            if (errorEmpty(id)) {
                //判断手机号码
                if(data[id]['mobile']) {
                    if(!errorMobile(id)){
                        flag = false;
                    }
                }
                //判断最小长度
                if(data[id]['minLength']) {
                    if(errorMinLength(id,data[id]['minLength'])){
                        //判断最大长度
                        if(data[id]['maxLength']) {
                            if(!errorMaxLength(id,data[id]['maxLength'])){
                                flag = false;
                            }
                        }
                    }else{
                        flag = false;
                    }
                }else{
                    if(data[id]['maxLength']) {
                        if(!errorMaxLength(id,data[id]['maxLength'])){
                            flag = false;
                        }
                    }
                }
                //判断正整数
                if(data[id]['integer']) {
                    if(!errorInteger(id)){
                        flag = false;
                    }
                }
                //判断金额
                if(data[id]['mount']) {
                    if(!errorMount(id)){
                        flag = false;
                    }
                }
                //判断名称
                if(data[id]['name']) {
                    if(!errorName(id)){
                        flag = false;
                    }
                }
            }else{
                flag = false;
            }
        }
    }
    return flag
}

//判断是否为空
function errorEmpty(id){
    var name = $.trim($('#'+id).val());
    if(name==''||name==null){
        $('#'+id).parent().find('.error-msg').html('不能为空');
        $('#'+id).addClass('error');
        return false;
    }else{
        $('#'+id).parent().find('.error-msg').html('');
        $('#'+id).removeClass('error');
    }
    return true
}
//判断手机号码是否正确
function errorMobile(id){
    var name = $.trim($('#'+id).val());
    if(!/^(12|13|14|15|17|18)\d{9}$/.test(name)){
        $('#'+id).parent().find('.error-msg').html('请输入11位手机号码');
        $('#'+id).addClass('error');
        return false;
    }else{
        $('#'+id).parent().find('.error-msg').html('');
        $('#'+id).removeClass('error');
    }
    return true;
}
//判断是不是身份证号
function errorIdCard(id){
    var name = $.trim($('#'+id).val());
    if(!/^\d{15}(\d{2}[A-Za-z0-9])?$/.test(name)){
        $('#'+id).parent().find('.error-msg').html('请输入正确的身份证号码');
        $('#'+id).addClass('error');
        return false;
    }else{
        $('#'+id).parent().find('.error-msg').html('');
        $('#'+id).removeClass('error');
    }
    return true
}
//判断是不是金额
function errorMount(id){
    var name = $.trim($('#'+id).val());
    if(!/^([-+]?\d{1,10})(\.\d{1,2})?$/.test(name)){
        $('#'+id).parent().find('.error-msg').html('请输入正确的金额');
        $('#'+id).addClass('error');
        return false;
    }else{
        $('#'+id).parent().find('.error-msg').html('');
        $('#'+id).removeClass('error');
    }
    return true
}
//判断是不是数字
function errorInteger(id){
    var name = $.trim($('#'+id).val());
    if(!/^([1-9]\d*)$/i.test(name)){
        $('#'+id).parent().find('.error-msg').html('请输入正整数');
        $('#'+id).addClass('error');
        return false;
    }else{
        $('#'+id).parent().find('.error-msg').html('');
        $('#'+id).removeClass('error');
    }
    return true
}
//判断不能小于num位
function errorMinLength(id,num){
    var name = $.trim($('#'+id).val());
    if(name.length<num){
        $('#'+id).parent().find('.error-msg').html('不能小于'+num+'位');
        $('#'+id).addClass('error');
        return false;
    }else{
        $('#'+id).parent().find('.error-msg').html('');
        $('#'+id).removeClass('error');
    }
    return true
}
//判断不能大于num位
function errorMaxLength(id,num){
    var name = $.trim($('#'+id).val());
    if(name.length>num){
        $('#'+id).parent().find('.error-msg').html('不能大于'+num+'位');
        $('#'+id).addClass('error');
        return false;
    }else{
        $('#'+id).parent().find('.error-msg').html('');
        $('#'+id).removeClass('error');
    }
    return true
}
//判断密码是否相同
function errorPasswordSame(id,compareId){
    var name = $.trim($('#'+id).val());
    var newName = $.trim($('#'+compareId).val());
    if(name!=newName){
        $('#'+id).parent().find('.error-msg').html('两次输入的密码不相同');
        $('#'+id).addClass('error');
        return false;
    }else{
        $('#'+id).parent().find('.error-msg').html('');
        $('#'+id).removeClass('error');
    }
    return true
}
//判断中文英文字母下划线
function errorName(id){
    var name = $.trim($('#'+id).val());
    if(!/^[\u4E00-\u9FA5A-Za-z0-9_\ ]{1,32}$/i.test(name)){
        $('#'+id).parent().find('.error-msg').html('请输入中文、字母、数字和下划线。');
        $('#'+id).addClass('error');
        return false;
    }else{
        $('#'+id).parent().find('.error-msg').html('');
        $('#'+id).removeClass('error');
    }
    return true
}

