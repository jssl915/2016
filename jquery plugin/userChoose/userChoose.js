$.fn.extend({'userChoose':function(data,sUserRoleList){
	var aLetter = ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'];	
	var aCheckId = [];
	var _this = this;
	loadHtml(data);
	function loadHtml(data){
		var htmlArray = [];
		htmlArray.push('<div class="firstLetter">按拼音首字母选择<input type="text" id="search" name="search" class="search-text" placeholder="请输入登录名拼音首字母"></div>');
		htmlArray.push('<ul id="oneUl" class="oneUl">');
			for(var i=0;i<aLetter.length;i++){
				var aData = data[aLetter[i]];
				if(aData!=undefined&&aData.length>0){
					var line = aData.length%5==0?Math.floor(aData.length/5):(Math.floor(aData.length/5)+1);
					var iHeight = line*40;
					htmlArray.push(' <li class="oneLi" style="height:'+iHeight+'px"><div class="userDiv"><div class="letterDiv">'+aLetter[i]+'</div><ul class="twoUl">');
					for(var j=0;j<aData.length;j++){
						htmlArray.push('<li><input type="checkbox" value='+aData[j].id+' name="userId"');
						for(var k=0;k<sUserRoleList.length;k++){
							if(sUserRoleList[k].userId == aData[j].id){
								htmlArray.push('checked="checked"');
							}
						} 
						htmlArray.push('/>&nbsp;'+aData[j].name+'</li>');
					}
					htmlArray.push('</ul></div></li>');
				}
			}
		htmlArray.push('</ul>');
		$(_this).html(htmlArray.join(''));
	}
	function addIds(){
		$('input[name="userId"]:checked').each(function(){ 
			aCheckId.push($(this).val()); 
		}); 
	}
	function searchHtml(data,userName){
		var ulArray = [];
		for(var i=0;i<aLetter.length;i++){
			var aData = data[aLetter[i]];
			if(aData!=undefined&&aData.length>0){
				var line = aData.length%5==0?Math.floor(aData.length/5):(Math.floor(aData.length/5)+1);
				var iHeight = line*40;
				ulArray.push(' <li class="oneLi" style="height:'+iHeight+'px"><div class="userDiv"><div class="letterDiv">'+aLetter[i]+'</div><ul class="twoUl">');
				for(var j=0;j<aData.length;j++){					
					ulArray.push('<li><input type="checkbox" value='+aData[j].id+' name="userId"');
					if(aCheckId.indexOf(aData[j].id)!=-1){
						ulArray.push('checked="checked"');
					}
					ulArray.push('/>&nbsp;'+aData[j].name+'</li>');
				}
				ulArray.push('</ul></div></li>');
			}
		}
		$('#oneUl').html(ulArray.join(''));
	}
	$('#search').keyup(function(){
		addIds();
		var letter = $(this).val();
		if(letter.length == 0){
			searchHtml(data);
			return
		}
		var newData = {};
		if(data[letter.toUpperCase()]!=undefined||letter.length>0){
			newData[letter.toUpperCase()] =  data[letter.toUpperCase()];
			searchHtml(newData);
		}
	});
}});