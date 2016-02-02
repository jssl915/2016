$.softkey = function(obj){$.softkey.method.init(obj);	}
$.softkey.method = {
	'oldFocus':'',
	'$boardDiv':'',
	'keyStatus':1,//默认为1：中文输入（1中文输入2小写字母输入3大写字母输入）
	'obj':'',
	'init':function(obj){		
		this.oldFocus = $.tvFocus;	
		this.$boardDiv = $('<div id="key_board" class="key_board" data-role="tvPage" data-display="none"></div>');
		if(obj){this.obj = obj;for(var o in obj){this.$boardDiv[0].style[o] = obj[o]}}	
		$('body').append(this.$boardDiv);
		this.softBoard.init();
	},
	'signboard':{
		'$lis':'',
		'init':function(){
			var $boardDiv = $.softkey.method.$boardDiv;
			$boardDiv.empty();
			var $ul=$('<ul id="sign_ul" class="sign_board" style="display:block"><li>1</li><li>2</li><li>3</li><li>4</li><li>5</li><li>6</li><li>7</li><li>8</li><li>9</li><li>0</li><li>!</li><li>@</li><li>#</li><li>$</li><li>%</li><li>^</li><li>&</li><li>*</li><li>(</li><li>)</li><li>"</li><li>"</li><li>=</li><li>.</li><li>、</li><li>:</li><li>;</li><li>?</li><li>~</li><li>,</li><li>关闭</li><li>返回</li><li>DEL</li><li>空格</li><li>+</li><li>-</li><li>*</li><li>/</li><li>_</li></ul>');
			$boardDiv.append($ul);
			var $lis = this.$lis = $('#sign_ul li');
			$lis.attr('class','css1');
			$lis.data('css','css1,css2');
			$lis.data('role','tvRadio');
			for(var i=0;i<$lis.length;i++){
				var $li = $($lis[i]);
				$li.attr('id','tv_sign_'+i);
			}
			$.tvPageInit($boardDiv[0].id);
			$('#tv_sign_31').tvSetFocus();
			var _this = this;
			$lis.tvOk(function(){
				_this.signOk();					   
			});
		},
		'signOk':function(){
			var $focus = $.tvFocus;
			var keyStr = $focus.html();
			var oldFocus = $.softkey.method.oldFocus;
			var keyStatus = $.softkey.method.keyStatus;	
			var $lis = this.$lis;
			switch(keyStr){
				case '关闭':oldFocus.tvSetMouseFocus();break;
				case '返回':{
					$.softkey.method.softBoard.init();		
					break;
				}
				case 'DEL':$.tvDeleteById(oldFocus[0].id);break;
				case '空格':$.tvInputById(" ",oldFocus[0].id);break;				
				default:$.tvInputById(keyStr,oldFocus[0].id);
			}	
		}
	},
	'softBoard':{
		'$lis':'',
		'keyStrJson' :{'a':65,'b':66,'c':67,'d':68,'e':69,'f':70,'g':71,'h':72,'i':73,'j':74,'k':75,'l':76,'m':77,'n':78,
				'o':79,'p':80,'q':81,'r':82,'s':83,'t':84,'u':85,'v':86,'w':87,'x':88,'y':89,'z':90,'下页':187,'上页':189,
				'CapsLock':20,'DEL':8,'拼音':32,'English':32,'中/英':20,'Clear':20},
		'init':function(){
			$.softkey.method.keyStatus = 1;
			var $boardDiv = $.softkey.method.$boardDiv;
			$boardDiv.empty();
			var $div = $('<div id="chooseInput"></div><div id="chooseBoard"></div></div><ul id="soft_ul" class="soft_board" style="display: block;"><li>q</li><li>w</li><li>e</li><li>r</li><li>t</li><li>y</li><li>u</li><li>i</li><li>o</li><li>p</li><li>a</li><li>s</li><li>d</li><li>f</li><li>g</li><li>h</li><li>j</li><li>k</li><li>l</li><li>CapsLock</li><li>z</li><li>x</li><li>c</li><li>v</li><li>b</li><li>n</li><li>m</li><li>DEL</li><li>关闭</li><li>?123</li><li>中/英</li><li>拼音</li><li>上页</li><li>下页</li><li>Clear</li></ul>');		
			$boardDiv.append($div);
			var $lis = this.$lis = $('#soft_ul li');
			$lis.attr('class','css1');
			$lis.data('css','css1,css2');
			$lis.data('role','tvRadio');
			for(var i=0;i<$lis.length;i++){
				var $li = $($lis[i]);
				$li.attr('id','tv_soft_'+i);
				i===19 && ($li.data('css','css19_1,css19_2,css19_3,css19_4'));
			}
			$.tvPageInit($boardDiv[0].id);
			$('#tv_soft_28').tvSetFocus();
			var _this = this;
			$lis.tvOk(function(){
				_this.softOk();					   
			});
		},
		'softOk':function(keyStr){
			var $focus = $.tvFocus;
			var keyStr = $focus.html();
			var oldFocus = $.softkey.method.oldFocus;
			var keyStatus = $.softkey.method.keyStatus;	
			var $lis = this.$lis;
			switch(keyStr){
				case '关闭':oldFocus.tvSetMouseFocus();return
				case 'CapsLock':{					
					for(var i=0;i<27;i++){
						if(i===19) continue;
						var $li = $($lis[i]);	
						$li.html(keyStatus!==3?$li.html().toUpperCase():$li.html().toLowerCase());
					}
					if(keyStatus!==3){
						$.softkey.method.keyStatus = 3;
						$($lis[31]).html('English');
						$($lis[19]).attr('class','css19_4');
					}else{
						$.softkey.method.keyStatus = 1;
						$($lis[31]).html('拼音');
						$($lis[19]).attr('class','css19_2');
					}
					break;
				}
				case '中/英':{
					if(keyStatus===3){return}
					if($($lis[31]).html()==='English'){
						$($lis[31]).html('拼音');
						$.softkey.method.keyStatus = 1;
					}else{
						$($lis[31]).html('English');
						$.softkey.method.keyStatus = 2;
					}					
					break;
				}	
				case 'Clear':oldFocus.html('');$.tvValue[oldFocus[0].id]='';break;
				case '?123':{
					$.softkey.method.signboard.init();
					return
				}
			}
			keyStatus!==1?this.englishInput():this.chineseInput();		
		},
		'englishInput':function(){
			var $focus = $.tvFocus;
			var keyStr = $focus.html();
			var oldFocus = $.softkey.method.oldFocus;
			switch(keyStr){
				case '上页':break;
				case '下页':break;
				case 'CapsLock':break;
				case '中/英':break;
				case 'DEL':$.tvDeleteById(oldFocus[0].id);break;
				case 'English':$.tvInputById(" ",oldFocus[0].id);break;					
				default:$.tvInputById(keyStr,oldFocus[0].id);
			}
		},
		'chineseInput':function(){
			var $focus = $.tvFocus;
			var keyStr = $focus.html();			
			this.keyDown(this.keyStrJson[keyStr]);
			var $lis = this.$lis;
			var _this = this;
			$lis.tvKeydown(function(keyStr){
				_this.keyDown(parseInt(keyStr)+48)			
			});
		},
		'TestTmp':'',
		'LRkey':0,
		'keyDown':function(iekey){
			var oldFocus = $.softkey.method.oldFocus;
			var oInput = document.getElementById('chooseInput');
			var oBoard = document.getElementById('chooseBoard');
			var KeyCode =String.fromCharCode(iekey)//返回一个由参数中 ASCII 值表示的字符组成的字符串
			var PyKeyCodeNo=oInput.innerHTML.length;	
			var _this = this;
			switch (iekey) {
				case 8: //删除
					_this.LRkey=0;
					if(oInput.innerHTML!=""){
						oInput.innerHTML=oInput.innerHTML.substring(0,PyKeyCodeNo-1);
					}else{
						$.tvDeleteById(oldFocus[0].id);			
					}
					break;	
				case 20: //CapsLock 大小写切换
					_this.LRkey=0;oBoard.innerHTML = _this.TestTmp = oInput.innerHTML = "";break;		
				case 32: //空格
					_this.TestTmp!="" && ($.tvInputById(_this.TestTmp.substring(_this.LRkey*10,_this.LRkey*10+1),oldFocus[0].id))//选中第一个		
					_this.LRkey=0;oBoard.innerHTML=_this.TestTmp=oInput.innerHTML="";break;	
				case 189: //- 上一页
					_this.TestTmp!="" && (LeftChars(_this.TestTmp));break;
				case 187: //+ 下一页
					_this.TestTmp!="" && (RightChars(_this.TestTmp));break;	
				default:	
					if (iekey>=48 && iekey<=57){ //数字键选字					
						if(KeyCode==0){KeyCode=10;iekey =58;} 
						var letter = _this.TestTmp.substring(_this.LRkey*10+iekey-48-1,_this.LRkey*10+iekey-48);
						oInput.innerHTML!="" && ($.tvInputById(letter,oldFocus[0].id));					
						oBoard.innerHTML=_this.TestTmp=oInput.innerHTML="";					
						_this.LRkey=0;
					}else if(iekey>=65 && iekey<=90){			
						if(PyKeyCodeNo>6){return;}				
						oInput.innerHTML=oInput.innerHTML+KeyCode.toLowerCase();
					}				
			}		
			var CharIndex=Dict.indexOf(oInput.innerHTML); //输入字符在字典位置		
			if(CharIndex < 0){			
				oBoard.innerHTML="没有此字";_this.TestTmp="";//如果字典找不到则没有此字
			}else if(oInput.innerHTML==""){
				oBoard.innerHTML=""; //输入字符为空时，将字体选择面板清空
			}else{			
				var char = Dict.substring(CharIndex-1,CharIndex).toLowerCase().charCodeAt(0); //检测输入字符前（）...:ai前）是否字母		
				if(char>=97 && char<=122){ //说明是字母			
					var SeekChar=Dict;
					var SeekCharNum=CharIndex;
					do{
						SeekChar=SeekChar.substring(SeekCharNum+oInput.innerHTML.length);
						SeekCharNum=SeekChar.indexOf(oInput.innerHTML);	
						char=SeekChar.substring(SeekCharNum-1,SeekCharNum).toLowerCase().charCodeAt(0);; //检测下个...:ai前是否字母
						if(char<97||char>122){break}//直到不是字母	
					}while(char>0){
						if(char>0){
							var seeks = SeekChar.substring(SeekCharNum+oInput.innerHTML.length,SeekCharNum+oInput.innerHTML.length+1).charCodeAt(0);
							if(seeks>=97 && seeks<=122){
								for(var i=0;i<=7;i++){ //处理声母后面多的韵母
									var ss=SeekChar.substring(SeekCharNum+i,SeekCharNum+i+1).charCodeAt(0);
									if(ss<97||ss>122){i=i-1;break}	
								}
							}else{
								i=0;	
							}					
							GetTest(SeekChar,SeekCharNum+oInput.innerHTML.length+i)	
						}else{						
							oBoard.innerHTML="没有此字";_this.TestTmp="";
						}		
					}
				}else{
					var sLetter = Dict.substring(CharIndex+oInput.innerHTML.length,CharIndex+oInput.innerHTML.length+1).charCodeAt(0);
					if(sLetter>=97 && sLetter<=122){ //如果后面是字母
						for(var i=0;i<=7;i++){ //处理声母后面多出的韵母
							var s = Dict.substring(CharIndex+i,CharIndex+i+1).charCodeAt(0);
							if(s<97||s>122){i=i-1;break}					
						}
					}else{
						i=0;
					}	
					GetTest(Dict,CharIndex+oInput.innerHTML.length+i);
				}		
			}
			//内部函数
			function GetTest(CharDict,StartIndex){		
				_this.TestTmp="";
				var TenChar="",i=0;
				do{
					i++;
					_this.TestTmp=_this.TestTmp+CharDict.substring(StartIndex+i-1,StartIndex+i);
				}while((CharDict.substring(StartIndex+i-1,StartIndex+i)).charCodeAt(0)<97||(CharDict.substring(StartIndex+i-1,StartIndex+i)).charCodeAt(0)>122){//如果不是字母
					_this.TestTmp=_this.TestTmp.substring(0,_this.TestTmp.length-1);
					if (_this.LRkey==0){
						for(i=1;i<=10;i++){
							Ci=i-1;
							Vi=i;
							(i==10)&&(Vi=0);
							var sChar = _this.TestTmp.substring(Ci+_this.LRkey*10,Ci+_this.LRkey*10+1);					
							sChar!="" && (TenChar=TenChar+Vi+"."+sChar+" ");					
						}			
						oBoard.innerHTML=TenChar;
					}
				}	
				return
			}		
			function LeftChars(TestTmp){
				var i=0,Ci="",Vi="",TenChar="";
				if (_this.LRkey>0){
					_this.LRkey=_this.LRkey-1;
					for(i=1;i<=10;i++){
						Ci=i-1;
						Vi=i;
						i==10 && (Vi=0);				
						var sChar = TestTmp.substring(Ci+_this.LRkey*10,Ci+_this.LRkey*10+1);					
						sChar!="" && (TenChar=TenChar+Vi+"."+sChar+" ");
					}
					oBoard.innerHTML=TenChar;
				}
				return
			}		
			function RightChars(TestTmp){
				var i=0,Ci="",Vi="",TenChar="";
				if ((_this.LRkey*10)<=TestTmp.length-1){
					if(((_this.LRkey+1)*10)<=TestTmp.length-1 ){_this.LRkey=_this.LRkey+1}	
					for(i=1;i<=10;i++){	
						Ci=i-1;
						Vi=i;
						i==10 && (Vi=0);			
						var sChar = TestTmp.substring(Ci+_this.LRkey*10,Ci+_this.LRkey*10+1);					
						sChar!="" && (TenChar=TenChar+Vi+"."+sChar+" ");			
					}
					oBoard.innerHTML=TenChar;	
				}
				return
			}	
		}
	}
}