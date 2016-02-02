/**
*自执行函数量
*/
(function(){
	var freeKeyDown= function(flag){
		if($.isAndroid()===false){return}
		var reg = /Android\s{0,10}2\.2\.1/;//安卓2.2.1不支持 JS调用APK 
		if(reg.test(navigator.userAgent)){
			var _cmd = flag ? "cypayott://freeKeyDown=true" : "cypayott://freeKeyDown=false" ;
			window.setTimeout(function(){
				window.location.href = _cmd ; 
			},500); 
		}else{		
			window.cykj.freeKeyDown(flag ? true : false);  
		}  		
	}
	window.freeKeyDown = freeKeyDown; 
}());

/**
*初始化方法
*/
$(function(){
	freeKeyDown(true);//默认支持安卓		
	if($.isAndroid()){			
		window.grepKeyDown = function(keyStr){keyBoardMethod(keyStr)}
		return
	}
	var keyStr = "";
	$(window).keydown(function(event){
		  var key = event.keyCode;
		  switch(key) {
				case  38:keyStr="up";break;
				case  40:keyStr="down";break;
				case  37:keyStr="left";break;
				case  39:keyStr="right";break;
				case  13:keyStr="ok";break;
				case  8: keyStr="delete";break;
				case  27:keyStr="back";break;
				default:keyStr=""
		  }
		  key>=65 && key<=90 && (keyStr = $.letterMap[key]);//字母a-z
		  key>=48 && key<=57 && (keyStr = ''+(key-48));//键盘数字0-9
		  key>=96 && key<=105 && (keyStr=''+(key-96));//键盘锁打开小键盘数字
		  keyBoardMethod(keyStr);
		  return false;
	});	
	function keyBoardMethod(keyStr){
		switch (keyStr){
			case "ok": $.tvOk();return;	
			case "delete": $.tvDelete();return;		
			case "back": $.goBack();return;
			case "right": $.move('right');return;
			case "left": $.move('left');return;
			case "up":$.move('up');return;
			case "down": $.move('down');return;
		}			
		var reg1 = /^[0-9]{1}$/,reg2 = /^[a-z]{1}$/ ;//匹配数字,匹配字母
		(reg1.test(keyStr) || reg2.test(keyStr)) && ($.tvInput(keyStr));		
	}	
});

/**
*存放常量和全局变量
*/
$.extend({
	//设置常量,组件类型	 
	'tvBaseType':['tvButton','tvText','tvPassword','tvSelect','tvCheckbox','tvRadio'],
	 //键盘数字
	'letterMap':{
		'65' : 'a', '66' : 'b', '67' : 'c',	'68' : 'd',	'69' : 'e',	'70' : 'f',	'71' : 'g',		
		'72' : 'h', '73' : 'i', '74' : 'j', '75' : 'k',	'76' : 'l',	'77' : 'm',	'78' : 'n',		
		'79' : 'o', '80' : 'p', '81' : 'q',	 '82' : 'r','83' : 's',	'84' : 't',	
		'85' : 'u', '86' : 'v', '87' : 'w',	 '88' : 'x','89' : 'y',	'90' : 'z'		
	},	
	'tvPage':[],//将所有的page对象存于该数组
	'tvPageById':{},//根据id取当前page
	'tvFocus':'',//当前焦点元素，存的是jQuery对象
	'tvValue':{},//存各个组件的值
	'isAndroid':function(){var str= navigator.userAgent;return str.indexOf("Android")>=0 || str.indexOf("android")>=0}	
});

/**
*存放TV焦点移动核心方法
*/
$.extend({
	//初始化当前page方法
	'tvPageInit':function(id){
		var $page = $('#'+id);		
		$page.data('tvAll',[]);	
		addTvType();
		$.removePage(id);
		$.tvPage.push($page);
		$.setMouseEnable(true);//默认支持鼠标事件		
		function addTvType(){
			var aDoms = $('#'+id+' *');	
			for(var i=0;i<aDoms.length;i++){
				var oE = $(aDoms[i]),tvType = oE.data('role');		
				if(oE.is(":hidden")){continue}//隐藏的元素不写入移动框架
				if($.inArray(tvType, $.tvBaseType)!==-1){						
					$page.data('tvAll').push(oE);
					$.tvPageById[oE[0].id] = $page;
				}	
			}
		}
	},
	'setMouseEnable':function(flag){
		var aPages = $.tvPage;		
		for(var i=0;i<aPages.length;i++){
			var aPage = $(aPages[i]).data('tvAll');
			for(var j=0;j<aPage.length;j++){
				var oE = aPage[j];
				flag?bindMouse(oE):removeMouse(oE);
			}
		}		
		function bindMouse(oE){		
			oE[0].onmouseover = function (){oE.tvSetMouseFocus()};
			oE[0].onclick = function (){$.tvOk()};
		}
		function removeMouse(oE){
			oE[0].onmouseover = null;
			oE[0].onclick = null;	
		}
	},
	'removePage':function(id){
		for(var i=0;i<$.tvPage.length;i++){			
			if($.tvPage[i][0].id===id){
				$.tvPage.splice(i,1);
			}
		}				
	},
	'tvRemoveFocus':function(){
		if($.tvFocus === ''){return}
		var fn = $.tvFocus.data('tv_lose_focus');
		fn && fn();	
		var sCss = $.tvFocus.data('css');
		if(!sCss){return}
		var aCss = $.tvFocus.data('css').split(',');		
		if(aCss[3] && $.tvFocus.attr('class') === aCss[3]){		
			$.tvFocus.attr('class',aCss[2]);	
		}else{
			$.tvFocus.attr('class',aCss[0]);	
		}		
	},
	'tvOk':function(keyStr){
		if($.tvFocus.data('role') === 'tvRadio' || $.tvFocus.data('role') === 'tvCheckbox'){
			$[$.tvFocus.data('role')].init();
		}
		var fn = $.tvFocus.data('tv_ok');
		fn && fn();
	},
	'tvInput':function(keyStr){
		$.tvInputById(keyStr,$.tvFocus[0].id);
		var fn = $.tvFocus.data('tv_keydown');
		fn && fn(keyStr);
	},
	'tvInputById':function(keyStr,id){
		var $dom = $('#'+id);
		var sTvType= $dom.data('role')		
		if(sTvType!=='tvText' && sTvType!=='tvPassword'){return}
		if(sTvType==='tvText'){
			$dom.html($dom.html()+keyStr);
			$.tvValue[$dom[0].id] = $dom.html();
		}else if(sTvType==='tvPassword'){
			$dom.html($dom.html()+'*');			
			var s = $.tvValue[$dom[0].id] || '';
			$.tvValue[$dom[0].id] = s+keyStr;			
		}
	},
	'tvDelete':function(){
		$.tvDeleteById($.tvFocus[0].id);
	},
	'tvDeleteById':function(id){
		var $dom = $('#'+id);
		var sTvType= $dom.data('role')		
		if(sTvType!=='tvText' && sTvType!=='tvPassword'){return}
		if(sTvType==='tvText'){
			var s = $.tvValue[$dom[0].id]+'';
			var s=s.substr(s.length-5)=='&amp;' ? s.substring(0,(s).length-5) : s.substring(0,(s).length-1);
			$dom.html(s);
			$.tvValue[$dom[0].id] = s;
		}else if(sTvType==='tvPassword'){
			var s = $.tvValue[$dom[0].id]+'';
			var s=s.substr(s.length-5)=='&amp;' ? s.substring(0,(s).length-5) : s.substring(0,(s).length-1);
			$.tvValue[$dom[0].id] = s;
			$dom.html(s.replace(/[\w\.\/]/ig,'*'));
		}	
	},
	'goBack':function(){
		goBack && goBack();
	},
	'move':function(direction){
		var fn = $.tvFocus.data('tv_'+direction);
		if(fn){
			var flag = fn();
			if(typeof flag !== 'undefined' && flag===false){return}
		}		
		$.tvMoveTo(direction);
	},	
	'tvMoveTo':function(flag){
		var aOffsetDom = getOffsetDoms(flag);	
		var nextDom = getDistanceDoms(aOffsetDom,flag);
		nextDom !=='' && nextDom.tvSetFocus();		
		//根据当前位置取适合的DOM,比如向左移，只取左边的dom
		function getOffsetDoms(flag){
			var aDoms = [];
			var $focus = $.tvFocus;	
			var aPage = $.tvPageById[$focus[0].id].data('tvAll');
			for(var i=0;i<aPage.length;i++){
				var oE = aPage[i];
				var oE_left = oE.offset().left;
				var oE_top = oE.offset().top;
				var oE_width = oE.width();
				var oE_height = oE.height();				
				var $focus_left = $focus.offset().left;
				var $focus_top = $focus.offset().top;
				var $focus_width = $focus.width();
				var $focus_height = $focus.height();
				switch (flag){
					case 'left' :{
						//左移必须在一条水平线上才能移动，即有重合的部分
						//判断在左边
						if(oE_left+oE_width<=$focus_left){
							//判断有重合部分
							if($focus_top <= oE_top && oE_top<$focus_top+$focus_height){
								aDoms.push(oE);
							}else if(oE_top <= $focus_top && oE_top+oE_height>$focus_top){
								aDoms.push(oE);
							}							
						}
						break;	
					}
					case 'right' :{
						//判断在右边
						if($focus_left+$focus_width<=oE_left){
							//判断有重合部分
							if($focus_top <= oE_top && oE_top<$focus_top+$focus_height){
								aDoms.push(oE);
							}else if(oE_top <= $focus_top && oE_top+oE_height>$focus_top){
								aDoms.push(oE);
							}	
						}
						break;
					}
					case 'up' :{
						//上移可以移到第1、2区域
						(oE_top+oE_height<=$focus_top) && aDoms.push(oE);
						break;
					}
					case 'down' :{
						//下移只能移到第3、4区域
						($focus_top+$focus_height<=oE_top) && aDoms.push(oE);
						break;
					}
				}
			}
			return aDoms;
		}
		
		//根据勾股定理要取合适的dom
		function getDistanceDoms(aOffsetDom,flag){
			var $focus = $.tvFocus;
			var iSize = 999999;
			var oDom = "";			
			for(var i =0;i<aOffsetDom.length;i++){
				var oE = aOffsetDom[i];
				var oE_left = oE.offset().left;
				var oE_top = oE.offset().top;
				var oE_width = oE.width();
				var oE_height = oE.height();				
				var $focus_left = $focus.offset().left;
				var $focus_top = $focus.offset().top;
				var $focus_width = $focus.width();
				var $focus_height = $focus.height();
				var x1,y1,x2,y2;
				switch (flag){
					case 'left' :{
						x1 = oE_left + oE_width;
						y1 = oE_top;
						x2 = $focus_left + $focus_width
						y2 = $focus_top;						
						break;	
					}
					case 'right' :{
						x1 = oE_left;
						y1 = oE_top;
						x2 = $focus_left;
						y2 = $focus_top;						
						break;	
					}
					case 'up' :{
						x1 = oE_left;
						y1 = oE_top+oE_height;
						x2 = $focus_left;
						y2 = $focus_top;						
						break;	
					}	
					case 'down' :{
						x1 = oE_left;
						y1 = oE_top;
						x2 = $focus_left;
						y2 = $focus_top+$focus_height;					
						break;	
					}	
				}
				var distanceSize = Math.sqrt((y1-y2)*(y1-y2)+(x1-x2)*(x1-x2));
				if(distanceSize<iSize){
					iSize = distanceSize;	
					oDom = oE;
				}				
			}			
			return iSize===999999 ? '' : oDom;
		}				
	}
});

//DOM元素插件
$.fn.extend({
	'tvSetMouseFocus':function(){	
		var $focus = $.tvFocus;
		var $page = $.tvPageById[$focus[0].id];//原焦点面板
		this.tvSetFocus();	
		var $newfocus = $.tvFocus;
		var $newPage = $.tvPageById[$newfocus[0].id];//现焦点面板
		var display = $page.data('display');
		if(display && display === 'none' && $newPage[0].id !== $page[0].id){
			$page.remove();//如果之前已经创建了则remove掉			
			$.removePage($page[0].id);
		}				
	},
	'tvSetFocus':function(){
		var fn = this.data('tv_get_focus');
		fn && fn();	
		if(this.length===0){alert("该元素不存在！");return}
		var oPage = $.tvPageById[this[0].id];		
		$.tvRemoveFocus();
		var sCss = this.data('css');
		if(!sCss){return}
		var aCss = this.data('css').split(',');		
		if(aCss[2] && this.attr('class')===aCss[2]){			
			this.attr('class',aCss[3]);			
		}else{
			this.attr('class',aCss[1]);
		}	
		$.tvFocus = this;		
	},
	'tvUp':function(fn){
		this.data('tv_up',fn);
	},
	'tvRight':function(fn){
		this.data('tv_right',fn);
	},
	'tvDown':function(fn){
		this.data('tv_down',fn);
	},
	'tvLeft':function(fn){
		this.data('tv_left',fn);
	},
	'tvGetFocus':function(fn){
		this.data('tv_get_focus',fn);
	},
	'tvLoseFocus':function(fn){
		this.data('tv_lose_focus',fn);
	},
	'tvOk':function(fn){
		this.data('tv_ok',fn);
	},
	'tvKeydown':function(fn){
		this.data('tv_keydown',fn);	
	}
});

$.extend({
	'tvRadio':{
		'init':function(){
			var $focus =  $.tvFocus;
			var value = $focus.data('value');
			var name = $focus.data('name');
			var aCss = $focus.data('css').split(',');		
			$('div[data-name='+name+']').tvSetValue(value);
			$focus.attr('class',aCss[3]);
		}		
	},		 		 
	'tvCheckbox':{
		'init':function(){
			var $focus = $.tvFocus;
			var aCss = $focus.data('css').split(',');
			$focus.attr('class',$focus.attr('class')===aCss[1]?aCss[3]:aCss[1]);				
			var sName = $focus.data('name');//取值
			var aValue=[];
			var aCheckbox = $('div[data-name='+sName+']');
			for(var i=0;i<aCheckbox.length;i++){		
				var $checkbox = $(aCheckbox[i]);
				if($checkbox.attr('class')===aCss[2]||$checkbox.attr('class')===aCss[3]){
					aValue.push($checkbox.data('value'));
				}
			}
			$.tvValue[sName] = aValue;	
		},
		'chooseAll':function(sName){
			var aCheckbox = $('div[data-name='+sName+']');
			var aCss = aCheckbox.data('css').split(',');
			var aValue=[];
			for(var i=0;i<aCheckbox.length;i++){		
				$(aCheckbox[i]).attr('class',aCss[2]);
				aValue.push($(aCheckbox[i]).data('value'));
			}
			$.tvValue[sName] = aValue;	
		},
		'chooseNone':function(sName){
			var aCheckbox = $('div[data-name='+sName+']');
			var aCss = aCheckbox.data('css').split(',');
			for(var i=0;i<aCheckbox.length;i++){		
				$(aCheckbox[i]).attr('class',aCss[0]);
			}
			$.tvValue[sName] = [];		
		}
	},
	'tvPassword':function(){
		var aCss = ["pass-num-0","pass-num-1","pass-num-2","pass-num-3","pass-num-4","pass-num-5","pass-num-6","pass-num-7","pass-num-8","pass-num-9"];
		var aIds = ['tv_pass_key_0','tv_pass_key_1','tv_pass_key_2','tv_pass_key_3','tv_pass_key_4','tv_pass_key_5',
			  'tv_pass_key_6','tv_pass_key_7','tv_pass_key_8','tv_pass_key_9','tv_pass_key_10','tv_pass_key_11'];		
		var oldFocus = $.tvFocus,aSpan = [],$passwordBoard;
		bulidPassBoard();
		bindOk();
		function bulidPassBoard(){
			aCss.sort(function(a, b){return Math.random()>.5 ? -1 : 1});
			var passBoardId = oldFocus[0].id+'_board';	
			$passwordBoard = $('<div id = '+passBoardId+' class="tv_pass_keyboard" data-role="tvPage" data-display="none"></div>');
			var oldFocusHeight = oldFocus.height();
			var oldFocusLeft = oldFocus.offset().left;
			var oldFocusTop = oldFocus.offset().top;
			$passwordBoard .css('left',oldFocusLeft+'px');
			$passwordBoard .css('top',oldFocusTop+oldFocusHeight+'px');
			$('body').append($passwordBoard);		
			var oSname = $('<span class="tv_pass_keyBoardName">密码软键盘</span>');	
			$passwordBoard.append(oSname);			
			for(var i =0;i<12;i++){				
				var sTop = "",sLeft = "";
				var sCss = aCss[i]+','+aCss[i]+'-focus';
				var oSpan = $('<span data-role="tvButton" class='+aCss[i]+' data-css='+sCss+'></span>');				
				if(i<4){			
					sTop = '35px',sLeft = (50*i+7)+'px';					
				}else if(i>=4&&i<8){			
					sTop = '85px',sLeft = (50*(i-4)+7)+'px';					
				}else if(i>=8){			
					sTop = '135px',sLeft = (50*(i-8)+7)+'px';	
					i===10 && (oSpan = $('<span data-role="tvButton" class="pass-num-del" data-css="pass-num-del,pass-num-del-focus"></span>'));
					i===11 && (oSpan = $('<span data-role="tvButton" class="pass-num-close" data-css="pass-num-close,pass-num-close-focus"></span>'));
				}
				oSpan.attr('id',aIds[i]);
				oSpan.css('top',sTop);
				oSpan.css('left',sLeft);
				$passwordBoard.append(oSpan);
				aSpan.push(oSpan);
			}
			$.tvPageInit(passBoardId);
			aSpan[11].tvSetFocus();	
		}		
		function bindOk(){
			for(var i=0;i<aSpan.length;i++){
				(function(num){
					aSpan[num].tvOk(function(){
						tvOk(aSpan[num]);			  
					});						
				}(i))				
			}	
		}	
		function tvOk(oSpan){
			var key = oSpan.attr('class').split('-')[2];			
			if(key<=9){					
				oldFocus.html(oldFocus.html()+'*');
				var s = $.tvValue[oldFocus[0].id] || '';
				$.tvValue[oldFocus[0].id] = s+key;	
			}else if(key=="del"){
				$.tvDeleteById(oldFocus[0].id);
			}else if(key=="close"){				
				oldFocus.tvSetMouseFocus();
				$.removePage($passwordBoard[0].id);
			}		
		}
		
	},
	'tvSelect':function(){
		var oldFocus = $.tvFocus,aSpan=[],$selectBoard,start=0;		
		var aData = oldFocus.data('option');		
		bulidSelectBoard();
		bindMethod();
		function bulidSelectBoard(){			
			var length = oldFocus.data('length') || 10; //如果没有定义下拉选项个数，则默认为10
			aData.length<length && (length = aData.length); //如果定义的选项个数小于10,则显示定义的个数
			var selectBoardId = oldFocus[0].id+'_board';			
			$selectBoard = $('<div id = '+selectBoardId+' class="tv_select_board" data-role="tvPage" data-display="none"></div>');
			var oldFocusWidth = oldFocus.width();
			var oldFocusHeight = oldFocus.height();
			var oldFocusLeft = oldFocus.offset().left;
			var oldFocusTop = oldFocus.offset().top;
			$selectBoard .css('left',oldFocusLeft+'px');
			$selectBoard .css('top',oldFocusTop+oldFocusHeight+'px');
			$selectBoard .css('width',oldFocusWidth+'px');
			$selectBoard .css('height',oldFocusHeight*length+'px');	
			$('body').append($selectBoard);			
			var selected = oldFocus.data('selected') || 0;//显示下拉框时，如果没有定义了某一行获取焦点，则默认第一行
			selected>length-1 && (selected = 0);
			for(var i = 0;i<length;i++){
				var $span = $('<span id='+selectBoardId+'_span_'+i+' class="tv_select_span1" data-role="tvButton" data-css="tv_select_span1,tv_select_span2"></span>');
				$span.html(aData[i].text);
				$span.css('width',oldFocusWidth+'px');
				$span.css('height',oldFocusHeight+'px');
				$span.css('line-height',oldFocusHeight+'px');
				$span.css('left',0);
				$span.css('top',oldFocusHeight*i+'px');
				(i==0) && ($span.css('borderTop','1px solid #000000'));	
				$selectBoard.append($span);	
				aSpan.push($span);
			}		
			$.tvPageInit($selectBoard[0].id);			
			aSpan[selected].tvSetFocus();			
		}
		function bindMethod(){
			for(var i=0;i<aSpan.length;i++){
				(function(num){
					aSpan[num].tvOk(function(){
						tvOk(num);			  
					});	 
					aSpan[num].tvDown(function(){						
						tvDown(num);	
					});	
					aSpan[num].tvUp(function(){						
						tvUp(num);	
					});	
				}(i))				
			}
		}
		function tvOk(i){						
			oldFocus.html(aData[i+start].text);
			oldFocus.tvSetMouseFocus();
			$.tvValue[oldFocus[0].id] = aData[i+start].value;	
			oldFocus.data('selected',i+start);		
			$.removePage($selectBoard[0].id);
		}
		function tvDown(num){
			if(num<aSpan.length-1||aSpan.length+start===aData.length){				
				return;
			}
			start++;			
			for(var i=0;i<aSpan.length;i++){
				$(aSpan[i]).html(aData[i+start].text);
			}		
		}
		function tvUp(num){
			if(num>0||start==0){return;}
			start--;		
			for(var i=0;i<aSpan.length;i++){
				$(aSpan[i]).html(aData[i+start].text);
			}			
		}		
	}
});

$.extend({
	'tvAlert':function(content){
		var oDivFade = $('<div class="alert_fade"></div>');
		$('body').append(oDivFade);
		var oDivBoard = $('<div id="alert_div" class="alert_div" data-role="tvPage"></div>');
		var confirmArray = [];
		confirmArray.push('<div class="wrapOut"><div class="wrapBar"><div class="wrap_title">提示对话框</div></div>');
		confirmArray.push('<div class="wrapBody">'+content+'</div>');
		confirmArray.push('<div id="alert_close" data-role="tvButton" class="css1" data-css="css1,css2" style="position:absolute;bottom:20px;left:0;right:0;margin:auto;">关闭</div>');
		oDivBoard.html(confirmArray.join(''));
		$('body').append(oDivBoard);
		$.tvPageInit('alert_div');
		var oldFocus = $.tvFocus;
		$('#alert_close').tvSetFocus();
		$('#alert_close').tvOk(function(){
			oDivBoard.remove();
			oDivFade.remove();
			oldFocus.tvSetFocus();
			$.removePage('alert_div');
		});		
	},
	'tvConfirm':function(obj){
		var oDivFade = $('<div class="alert_fade"></div>');
		$('body').append(oDivFade);
		var oDivBoard = $('<div id="alert_div" class="alert_div" data-role="tvPage"></div>');
		var confirmArray = [];
		confirmArray.push('<div class="wrapOut"><div class="wrapBar"><div class="wrap_title">确认对话框</div></div>');
		confirmArray.push('<div class="wrapBody">'+obj.content+'</div>');
		confirmArray.push('<div id="confirm_close" data-role="tvButton" class="css1" data-css="css1,css2" style="position:absolute;bottom:20px;left:10%;">确认</div>');
		confirmArray.push('<div id="confirm_cancel" data-role="tvButton" class="css1" data-css="css1,css2" style="position:absolute;bottom:20px;right:10%;">取消</div></div>')
		oDivBoard.html(confirmArray.join(''));
		$('body').append(oDivBoard);
		$.tvPageInit('alert_div');
		var oldFocus = $.tvFocus;
		$('#confirm_close').tvSetFocus();
		$('#confirm_close').tvOk(function(){
			oDivBoard.remove();
			oDivFade.remove();
			oldFocus.tvSetFocus();	
			obj.onClose(true);
			$.removePage('alert_div');
		});	
		$('#confirm_cancel').tvOk(function(){
			oDivBoard.remove();
			oDivFade.remove();
			oldFocus.tvSetFocus();	
			obj.onClose(false);
			$.removePage('alert_div');
		});	
	},
	'aPageList':[],
	'changePage':function(url,obj){
		$.ajax({
			url : url,
			type : 'GET',
			dataType : "html",
			async : false,
			success : function(html, textStatus, xhr){
				$.tvRemoveFocus();
				$.aPageList.push($("<p></p>").append($($('div[data-role=tvPage]')[0]).clone()).html());
				$('body').append($("<code></code>").append($(html)).find('div[data-role=tvPage]'));
				var oPage = $('div[data-role=tvPage]');
				var oldPage = oPage[0].id,newPage = oPage[1].id;
				$('#'+oldPage).remove();	
				$.removePage(oldPage);	
				init && init();
			}
		});		
	},
	'changeReturn':function(){		
		if($.aPageList.length===0){return}
		$('body').append($.aPageList.pop());
		var oPage = $('div[data-role=tvPage]');
		var oldPage = oPage[0].id,newPage = oPage[1].id;
		$('#'+oldPage).remove();	
		$.removePage(oldPage);	
		init && init();
	}
});

//取值和赋值方法
$.fn.extend({
	'tvSetValue':function(value){
		var tvType = this.data('role');
		switch (tvType){
			case 'tvText' :{
				var id = this[0].id;
				$.tvValue[id] = value;
				this.html(value);
				break;	
			}
			case 'tvPassword':{
				var id = this[0].id;				
				$.tvValue[id] = value;
				this.html((value+'').replace(/[\w\.\/]/ig,'*'));	
				break;	
			}
			case 'tvSelect' :{
				var aData = this.data('option');
				if(!aData){alert('该下拉框尚未定义下拉选项，请先定义下拉选项，再赋值!');return}
				for(var i=0;i<aData.length;i++){
					if(value==aData[i].value){
						this.html(aData[i].text);
						this.data('selected',i);
						break;
					}
				}
				var id = this[0].id;
				$.tvValue[id] = value;		
				break;
			}
			case 'tvRadio' :{	
				var name = this.data('name');
				var aCss = this.data('css').split(',');
				for(var i=0;i<this.length;i++){					
					if(value == $(this[i]).data('value')){						
						$(this[i]).attr('class',aCss[2]);
					}else{
						$(this[i]).attr('class',aCss[0]);
					}
				}				
				$.tvValue[name] = value;								
				break;
			}
			case 'tvCheckbox' :{
				var name = this.data('name');
				var aCss = this.data('css').split(',');	
				var aValue = value.split(',');				
				for(var i=0;i<this.length;i++){	
					if($.inArray($(this[i]).data('value'),aValue)!==-1){				
						$(this[i]).attr('class',aCss[2]);
					}else{
						$(this[i]).attr('class',aCss[0]);
					}
				}				
				$.tvValue[name] = value.split(',');	
			}
		}	
	},
	'tvGetValue':function(){
		var value = "";
		var tvType = this.data('role');
		if(tvType === 'tvText'||tvType === 'tvPassword'||tvType === 'tvSelect'){
			return $.tvValue[this[0].id];
		}else if(tvType === 'tvRadio'||tvType === 'tvCheckbox'){
			return $.tvValue[this.data('name')];
		}		
	}
});