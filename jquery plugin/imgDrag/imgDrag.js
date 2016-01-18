$.extend({
  imgDrag: function(obj){
		//初始化
		var oDiv = document.getElementById(obj.id);
		oDiv.innerHTML="";
		var oUl = document.createElement('ul');
		var iWidth = obj.width||160;
		var iHight = obj.height||120;
		var iRowNum = obj.rowNum||4;
		oUl.className = 'imgUl';
		oUl.style.width = (iWidth+20)*iRowNum+'px';
		var aLiHtml = []; 
		for(var i=0;i<obj.aImg.length;i++){
			aLiHtml.push('<li style="width:'+iWidth+'px;height:'+iHight+'px"><img src="'+obj.aImg[i]+'" /></li>');
		}
		oUl.innerHTML = aLiHtml.join('');	
		oDiv.appendChild(oUl);
		
		//布局转换
		var aLi=oUl.getElementsByTagName('li');
		var aPos=[];
		var iMinZindex=2;
		var i=0;	
		for(i=0;i<aLi.length;i++){
			aPos[i]={left: aLi[i].offsetLeft, top: aLi[i].offsetTop};
		}
		for(i=0;i<aLi.length;i++){
			aLi[i].style.left=aPos[i].left+'px';
			aLi[i].style.top=aPos[i].top+'px';
			aLi[i].style.position='absolute';
			aLi[i].style.margin='0';
			aLi[i].index=i;
		}
		
		//拖拽
		for(i=0;i<aLi.length;i++){
			setDrag(aLi[i]);
		}
		
		function setDrag(obj){
			obj.onmousedown=function (ev){
				var oEvent=ev||event;
				obj.style.zIndex=iMinZindex++;
				var disX=oEvent.clientX-obj.offsetLeft;
				var disY=oEvent.clientY-obj.offsetTop;
				document.onmousemove=function (ev){
					var oEvent=ev||event;			
					obj.style.left=oEvent.clientX-disX+'px';
					obj.style.top=oEvent.clientY-disY+'px';
					for(i=0;i<aLi.length;i++){
						aLi[i].className='';
					}
					var oNear=findNearest(obj);
					if(oNear){
						oNear.className='active';
					}
				};
				document.onmouseup=function (){
					document.onmousemove=null;
					document.onmouseup=null;
					var oNear=findNearest(obj);
					if(oNear){
						oNear.className='';
						oNear.style.zIndex=iMinZindex++;
						obj.style.zIndex=iMinZindex++;
						startMove(oNear, aPos[obj.index]);
						startMove(obj, aPos[oNear.index]);
						var tmp=0;
						tmp=obj.index;
						obj.index=oNear.index;
						oNear.index=tmp;
					}else{
						startMove(obj, aPos[obj.index]);
					}
				};
				clearInterval(obj.timer);
				return false;
			};
		}
		
		//碰撞检测
		function cdTest(obj1, obj2){
			var l1=obj1.offsetLeft;
			var r1=obj1.offsetLeft+obj1.offsetWidth;
			var t1=obj1.offsetTop;
			var b1=obj1.offsetTop+obj1.offsetHeight;
			
			var l2=obj2.offsetLeft;
			var r2=obj2.offsetLeft+obj2.offsetWidth;
			var t2=obj2.offsetTop;
			var b2=obj2.offsetTop+obj2.offsetHeight;
			
			if(r1<l2 || l1>r2 || b1<t2 || t1>b2){
				return false;
			}else{
				return true;
			}
		}
		
		function getDis(obj1, obj2){
			var a=obj1.offsetLeft-obj2.offsetLeft;
			var b=obj1.offsetTop-obj2.offsetTop;
			return Math.sqrt(a*a+b*b);
		}
		//找到碰上的，并且最近的
		function findNearest(obj){
			var iMin=999999999;
			var iMinIndex=-1;
			for(i=0;i<aLi.length;i++){
				if(obj==aLi[i])continue;
				if(cdTest(obj, aLi[i])){
					var dis=getDis(obj, aLi[i]);
					if(iMin>dis){
						iMin=dis;
						iMinIndex=i;
					}
				}
			}
			
			if(iMinIndex==-1){
				return null;
			}else{
				return aLi[iMinIndex];
			}
		}
		
		function getStyle(obj, attr){
			if(obj.currentStyle){
				return obj.currentStyle[attr];
			}else{
				return getComputedStyle(obj, false)[attr];
			}
		}

		function startMove(obj, json, fn){
			clearInterval(obj.timer);
			obj.timer=setInterval(function (){
				var bStop=true;		//这一次运动就结束了——所有的值都到达了
				for(var attr in json){
					//1.取当前的值
					var iCur=0;
					if(attr=='opacity'){
						iCur=parseInt(parseFloat(getStyle(obj, attr))*100);
					}else{
						iCur=parseInt(getStyle(obj, attr));
					}
					
					//2.算速度
					var iSpeed=(json[attr]-iCur)/8;
					iSpeed=iSpeed>0?Math.ceil(iSpeed):Math.floor(iSpeed);
					
					//3.检测停止
					if(iCur!=json[attr]){
						bStop=false;
					}
					
					if(attr=='opacity'){
						obj.style.filter='alpha(opacity:'+(iCur+iSpeed)+')';
						obj.style.opacity=(iCur+iSpeed)/100;
					}else{
						obj.style[attr]=iCur+iSpeed+'px';
					}
				}
				if(bStop){
					clearInterval(obj.timer);
					if(fn){
						fn();
					}
				}
			}, 30)
		} 
  }
});