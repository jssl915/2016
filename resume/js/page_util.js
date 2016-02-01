function getClass(tagName,className) //获得标签名为tagName,类名className的元素
{
    if(document.getElementsByClassName) //支持这个函数
     {        return document.getElementsByClassName(className);
     }
     else
     {       var tags=document.getElementsByTagName(tagName);//获取标签
         var tagArr=[];//用于返回类名为className的元素
         for(var i=0;i < tags.length; i++)
         {
             if(tags[i].class == className)
             {
                 tagArr[tagArr.length] = tags[i];//保存满足条件的元素
             }
         }
         return tagArr;
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


function ajax(options) {
	options = options || {};
	options.type = (options.type || "GET").toUpperCase();
	options.dataType = options.dataType || "json";
	var params = formatParams(options.data);	
	if (window.XMLHttpRequest) {//创建 - 非IE6 - 第一步
		var xhr = new XMLHttpRequest();
	} else { //IE6及其以下版本浏览器
		var xhr = new ActiveXObject('Microsoft.XMLHTTP');
	}
	xhr.onreadystatechange = function () {	//接收 - 第三步
		if (xhr.readyState == 4) {
			var status = xhr.status;
			if (status >= 200 && status < 300) {
				options.success && options.success(options.dataType=="json"?JSON.parse(xhr.responseText):xhr.responseText, xhr.responseXML);
			} else {
				options.fail && options.fail(status);
			}
		}
	}	
	if (options.type == "GET") {//连接 和 发送 - 第二步
		xhr.open("GET", options.url + "?" + params, true);
		xhr.send(null);
	} else if (options.type == "POST") {
		xhr.open("POST", options.url, true);		
		xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");//设置表单提交时的内容类型
		xhr.send(params);
	}	
	function formatParams(data) {
		var arr = [];
		for (var name in data) {
			arr.push(encodeURIComponent(name) + "=" + encodeURIComponent(data[name]));
		}
		arr.push(("v=" + Math.random()).replace("."));
		return arr.join("&");
	}
}

function Drag(id)
{
	var _this=this;
	
	this.disX=0;
	this.disY=0;
	this.oDiv=document.getElementById(id);
	
	this.oDiv.onmousedown=function (ev)
	{
		_this.fnDown(ev);
		
		return false;
	};
}

Drag.prototype.fnDown=function (ev)
{
	var _this=this;
	var oEvent=ev||event;
	this.disX=oEvent.clientX-this.oDiv.offsetLeft;
	this.disY=oEvent.clientY-this.oDiv.offsetTop;
	
	document.onmousemove=function (ev)
	{
		_this.fnMove(ev);
	};
	
	document.onmouseup=function ()
	{
		_this.fnUp();
	};
};

Drag.prototype.fnMove=function (ev)
{
	var oEvent=ev||event;
	
	this.oDiv.style.left=oEvent.clientX-this.disX+'px';
	this.oDiv.style.top=oEvent.clientY-this.disY+'px';
};

Drag.prototype.fnUp=function ()
{
	document.onmousemove=null;
	document.onmouseup=null;
};

function LimitDrag(id)
{
	Drag.call(this, id);
}

//LimitDrag.prototype=Drag.prototype;

for(var i in Drag.prototype)
{
	LimitDrag.prototype[i]=Drag.prototype[i];
}

LimitDrag.prototype.fnMove=function (ev)
{
	var oEvent=ev||event;
	var l=oEvent.clientX-this.disX;
	var t=oEvent.clientY-this.disY;
	
	if(l<0)
	{
		l=0;
	}
	else if(l>document.documentElement.clientWidth-this.oDiv.offsetWidth)
	{
		l=document.documentElement.clientWidth-this.oDiv.offsetWidth;
	}
	
	if(t<0)
	{
		t=0;
	}
	else if(t>document.documentElement.clientHeight-this.oDiv.offsetHeight)
	{
		t=document.documentElement.clientHeight-this.oDiv.offsetHeight;
	}
	
	this.oDiv.style.left=l+'px';
	this.oDiv.style.top=t+'px';
};

function miaovNext(aMotionData)
{
	var motion=null;
	var i=0;
	var complete=true;
	
	for(i=0;i<aMotionData.length;i++)
	{
		motion=aMotionData[i];
		
		//计算速度
		motion.speed=(motion.target-motion.cur)/8;
		motion.speed=motion.speed>0?Math.ceil(motion.speed):-Math.ceil(-motion.speed);
		
		//最大速度
		if(Math.abs(motion.speed)>motion.speedMax)
		{
			motion.speed=(motion.speed>0)?motion.speedMax:-motion.speedMax;
		}
		motion.cur+=motion.speed;
		
		if(motion.cur!=motion.target)
		{
			complete=false;
		}
	}
	
	if(complete)
	{
		for(i=0;i<aMotionData.length;i++)
		{
			aMotionData[i].cur=aMotionData[i].target;
			aMotionData[i].speed=0;
		}
		
		return true;
	}
	
	return false;
};

function MiaovMoveLib(aCur, aSpeedMax, fnDoMove, fnMoveEnd)
{
	var i=0;
	
	this.motionDatas=[];
	
	for(i=0;i<aCur.length;i++)
	{
		this.motionDatas[i]={target: aCur[i], speed:0, speedMax: aSpeedMax[i], cur:aCur[i]};
	}
	
	this.fnDoMove=fnDoMove;
	this.fnMoveEnd=fnMoveEnd;
	
	this.interval=40;
	
	this.timer=null;
	
	this.enabled=true;
}

MiaovMoveLib.prototype.setTarget=function (aValue)
{
	var t=(new Date()).getTime();
	var allSame=true;
	var i=0;

	for(i=0;i<aValue.length;i++)
	{
		this.motionDatas[i].target=parseInt(aValue[i]);
		if(this.motionDatas[i].target!=this.motionDatas[i].cur)
		{
			allSame=false;
		}
	}
	
	if(allSame)
	{
		if(!this.timer)
		{
			this.start();
		}
		return;
	}
	
	if(this.enabled)
	{
		if(!this.timer)
		{
			this.start();
		}
	}
};

MiaovMoveLib.prototype.setCurrent=function (aValue)
{
	var i=0;
	
	for(i=0;i<aValue.length;i++)
	{
		this.motionDatas[i].cur=parseInt(aValue[i]);
	}
};

MiaovMoveLib.prototype.start=function ()
{
	var obj=this;
	
	if(!this.enabled)
	{
		return;
	}
	
	if(this.timer)
	{
		clearInterval(this.timer);
	}
	else
	{
		this.timer=setInterval
		(
		 	function ()
			{
				obj.__timerHandler__();
			},
			this.interval
		);
	}
	
	this.iStartTime=((new Date()).getTime());
	this.iCounter=0;
};

MiaovMoveLib.prototype.stop=function ()
{
	if(this.timer)
	{
		clearInterval(this.timer);
		this.timer=null;
	}
};

MiaovMoveLib.prototype.__timerHandler__=function ()
{
	var bEnd=false;
	
	bEnd=miaovNext(this.motionDatas);
	
	if(bEnd)
	{
		if(this.fnMoveEnd)
		{
			this.fnMoveEnd(this.motionDatas);
		}
		
		this.fnDoMove(this.motionDatas);
		this.stop();
	}
	else
	{
		this.iCounter++;
		this.fnDoMove(this.motionDatas);
	}
};

function MiaovQuirkyPopup(oEleMove, oEleDrag, oEleBtn, oCloseBtn, oMaxSize, fnGetPos, fnGetSize, fnDoMove, fnDoResize, fnOnShowEnd, fnOnHideEnd)
{
	var obj=this;
	
	var oSize=fnGetSize();
	var oPos=fnGetPos();
	
	//保存信息
	this.__oEleMove__=oEleMove;
	this.__oEleDrag__=oEleDrag;
	this.__oEleBtn__=oEleBtn;
	
	this.__oMaxSize__=oMaxSize;
	
	this.__fnGetPos__=fnGetPos;
	this.__fnGetSize__=fnGetSize;
	this.__fnDoMove__=fnDoMove;
	this.__fnDoResize__=fnDoResize;
	
	this.__fnOnShowEnd__=fnOnShowEnd;
	this.__fnOnHideEnd__=fnOnHideEnd;
	
	//初始化内部对象
	this.__oDivOuter__=document.createElement('div');
	this.__oDivOuter__.style.display='none';
	this.__oDivOuter__.style.background='white';
	this.__oDivOuter__.style.width='100%';
	this.__oDivOuter__.style.filter='alpha(opacity=0)';
	this.__oDivOuter__.style.opacity='0';
	this.__oDivOuter__.style.top='0px';
	this.__oDivOuter__.style.left='0px';
	this.__oDivOuter__.style.position='absolute';
	this.__oDivOuter__.style.zIndex='3003';
	this.__oDivOuter__.style.overflow='hidden';
	this.__oDivOuter__.style.height=document.body.offsetHeight+"px";
	
	document.body.appendChild(this.__oDivOuter__);
	
	this.__oDrag__=new MiaovPerfectDrag
	(
		oEleDrag, fnGetPos,
		function (x, y)
		{
			var top=document.body.scrollTop || document.documentElement.scrollTop;
			
			if(x<0)
			{
				x=0;
			}
			else if(x+obj.__oMaxSize__.x>document.body.offsetWidth)
			{
				x=document.body.offsetWidth-obj.__oMaxSize__.x;
			}
			
			if(y<top)
			{
				y=top;
			}
			else if(y+obj.__oMaxSize__.y>top+document.documentElement.clientHeight)
			{
				y=top+document.documentElement.clientHeight-obj.__oMaxSize__.y;
			}
			
			
			oEleMove.style.left=x+'px';
			oEleMove.style.top=y+'px';
			
			obj.__oSpeed__.x=x-obj.__oLastPos__.x;
			obj.__oSpeed__.y=y-obj.__oLastPos__.y;
			
			obj.__oLastPos__.x=x;
			obj.__oLastPos__.y=y;
		},
		function ()	//开始拖拽时
		{
			obj.__oLastPos__=obj.__fnGetPos__();
			obj.stopMove();
			obj.__oDivOuter__.style.display='block';
		},
		function ()	//结束拖拽时
		{
			obj.startMove();
			obj.__oDivOuter__.style.display='none';
		}
	);
	this.__oDrag__.disable();
	
	this.__oLastPos__={x:0, y:0};
	this.__oSpeed__={x:0, y:0};
	this.__oMoveTimer__=null;
	
	this.__oMLResize__=new MiaovMoveLib
	(
		[oSize.x, oSize.y], [60, 60],
		function (arr)
		{
			obj.__fnDoMove__(oPos.x, oPos.y-arr[1].cur/2);
			obj.__fnDoResize__(arr[0].cur, arr[1].cur);
		},
		function ()
		{
			obj.__oDrag__.enable();
			obj.startMove();
			
			oCloseBtn.onmousedown=function ()
			{
				obj.hide();
			};
		}
	);
	
	this.__oMLMove__=new MiaovMoveLib
	(
		[0, 0], [40, 40],
		function (arr)
		{
			obj.__fnDoMove__(arr[0].cur, arr[1].cur);
		},
		function ()
		{
			obj.startShowBtn();
			obj.__oDock__.fnOnResizeOrScroll=function (oPos)
			{
				obj.__oEleMove__.left=-obj.__oMaxSize__.x+'px';
			};
		}
	);
	
	this.__oMLBtn__=new MiaovMoveLib
	(
		[0], [40],
		function (arr)
		{
			obj.__oDock__.move({left:arr[0].cur, top:0});
		},
		function ()	//特效结束时
		{
			if(this.isOpening)
			{
				obj.__oSpeed__.x=150+Math.ceil(Math.random()*150);
				obj.__oSpeed__.y=0;
				
				obj.startMove();
				obj.__oDrag__.enable();
				this.isOpening=false;
			}
		}
	);
	this.__oMLBtn__.isOpening=false;
	
	this.iAcc=3;
	this.fScale=-0.7;
	
	this.__oEleBtn__.style.display='block';
	this.__oDock__=new Dock(oEleBtn, DockType.LEFT|DockType.TOP, {left:-oEleBtn.offsetWidth, top:0}, null, null);
	
	this.__oEleBtn__.onclick=function ()
	{
		var top=document.body.scrollTop || document.documentElement.scrollTop;
		
		oEleMove.style.top=top+'px';
		obj.show();
	};
}

MiaovQuirkyPopup.prototype.initShow=function ()
{
	var obj=this;
	
	this.__oMLResize__.setTarget([this.__oMaxSize__.x, this.__oMaxSize__.y]);
};

MiaovQuirkyPopup.prototype.show=function ()
{
	this.__oDrag__.disable();
	this.stopMove();
	
	this.__oMLBtn__.setCurrent([0]);
	this.__oMLBtn__.setTarget([-this.__oEleBtn__.offsetWidth]);
	
	this.__oMLBtn__.isOpening=true;
};

MiaovQuirkyPopup.prototype.hide=function ()
{
	var obj=this;
	var oPos=this.__fnGetPos__();
	var oSize=this.__oDock__.getScreen();
	var top=document.body.scrollTop || document.documentElement.scrollTop;
	
	this.__oDrag__.disable();
	this.stopMove();
	
	this.__oMLMove__.setCurrent([oPos.x, oPos.y]);
	this.__oMLMove__.setTarget([-this.__oMaxSize__.x, oSize.top]);
	
	this.__oDock__.fnOnResizeOrScroll=function (oSize)
	{
		obj.__oMLMove__.setTarget([-obj.__oMaxSize__.x, oSize.top]);
	};
};

MiaovQuirkyPopup.prototype.startShowBtn=function ()
{
	this.__oMLBtn__.setCurrent([-this.__oEleBtn__.offsetWidth]);
	this.__oMLBtn__.setTarget([0]);
};

MiaovQuirkyPopup.prototype.startMove=function ()
{
	var obj=this;
	
	if(this.__oMoveTimer__)
	{
		clearInterval(this.__oMoveTimer__);
	}
	
	this.__oMoveTimer__=setInterval
	(
		function ()
		{
			obj.__doMove__();
		},
		30
	);
};

MiaovQuirkyPopup.prototype.stopMove=function ()
{
	clearInterval(this.__oMoveTimer__);
	this.__oMoveTimer__=null;
};

MiaovQuirkyPopup.prototype.__doMove__=function ()
{
	var oPos=this.__fnGetPos__();
	var r=document.body.offsetWidth-this.__oMaxSize__.x;
	var t=document.body.scrollTop || document.documentElement.scrollTop;
	var b=t+document.documentElement.clientHeight-this.__oMaxSize__.y;
	
	this.__oSpeed__.y+=this.iAcc;
	
	/*if(Math.abs(this.__oSpeed__.y)>10)
	{
		this.__oSpeed__.y=this.__oSpeed__.y>0?10:-10;
	}*/
	
	oPos.x+=this.__oSpeed__.x;
	oPos.y+=this.__oSpeed__.y;
	
	if(Math.abs(this.__oSpeed__.x)<1)
	{
		this.__oSpeed__.x=0;
	}
	
	if(Math.abs(this.__oSpeed__.y)<1)
	{
		this.__oSpeed__.y=0;
	}
	
	if(oPos.x<=0)
	{
		oPos.x=0;
		this.__oSpeed__.x*=this.fScale;
	}
	else if(oPos.x>=r)
	{
		oPos.x=r;
		this.__oSpeed__.x*=this.fScale;
	}
	
	if(oPos.y<=t)
	{
		oPos.y=t;
		this.__oSpeed__.y*=this.fScale;
	}
	else if(oPos.y>=b)
	{
		oPos.y=b;
		this.__oSpeed__.y*=this.fScale;
		this.__oSpeed__.x*=-this.fScale;
	}
	
	if(Math.abs(this.__oSpeed__.x)>0 || Math.abs(this.__oSpeed__.y)>0)
	{
		this.__fnDoMove__(oPos.x, oPos.y);
	}
};

if(typeof DockType == "undefined")
{
	DockType = 
	{
		LEFT:1,
		RIGHT:2,
		TOP:4,
		BOTTOM:8
	};
}


function Dock(oEle, iDirection, oDistance, fnOnBrowserChecked, fnOnResizeOrScroll)
{
	var bIsIe6=false;
	var obj=this;
	
	this.__oEle__=oEle;
	this.__iDir__=iDirection;
	this.__oDis__=oDistance;
	
	this.fnOnResizeOrScroll=fnOnResizeOrScroll;
	
	//check browser
	if(-1!=window.navigator.userAgent.indexOf('MSIE 6.0'))
	{
		if(-1!=window.navigator.userAgent.indexOf('MSIE 7.0') || -1!=window.navigator.userAgent.indexOf('MSIE 8.0'))
		{
			bIsIe6=false;
		}
		else
		{
			bIsIe6=true;
		}
	}
	else
	{
		bIsIe6=false;
	}
	
	this.bIsIe6=bIsIe6;
	
	if(fnOnBrowserChecked)
	{
		fnOnBrowserChecked(bIsIe6);
	}
	
	//change position
	if(bIsIe6)
	{
		oEle.style.position='absolute';
	}
	else
	{
		oEle.style.position='absolute';
	}
	
	//bind event
	if(bIsIe6)
	{
		miaovAppendEventListener
		(
			window, "scroll",
			function ()
			{
				obj.fixItem();
			}
		);
	}
	
	miaovAppendEventListener
	(
		window, "resize",
		function ()
		{
			obj.fixItem();
		}
	);
	
	this.fixItem();
}

Dock.prototype.getScreen=function ()
{
	var t=document.body.scrollTop || document.documentElement.scrollTop;
	
	return {left:0, right:document.documentElement.clientWidth, top:t, bottom:t+document.documentElement.clientHeight};
};

Dock.prototype.move=function (oDistance)
{
	this.__oDis__=oDistance;
	this.fixItem();
};

Dock.prototype.fixItem=function ()
{
	var t=document.body.scrollTop || document.documentElement.scrollTop;
	
	if(this.__iDir__&DockType.LEFT)
	{
		this.__oEle__.style.left=this.__oDis__.left+'px';
	}
	else if(this.__iDir__&DockType.RIGHT)
	{
		this.__oEle__.style.left=document.documentElement.clientWidth-this.__oDis__.right-this.__oEle__.offsetWidth+'px';
	}
	else if(this.__iDir__&DockType.BOTTOM)
	{
		if(this.bIsIe6)
		{
			this.__oEle__.style.top=t+document.documentElement.clientHeight-this.__oDis__.bottom-this.__oEle__.offsetHeight;
		}
		else
		{
			this.__oEle__.style.top=document.documentElement.clientHeight-this.__oDis__.bottom-this.__oEle__.offsetHeight;
		}
	}
	else if(this.__iDir__&DockType.TOP)
	{
		if(this.bIsIe6)
		{
			this.__oEle__.style.top=t+this.__oDis__.top+'px';
		}
		else
		{
			this.__oEle__.style.top=this.__oDis__.top+'px';
		}
	}
	
	if(this.fnOnResizeOrScroll)
	{
		this.fnOnResizeOrScroll({left:0, right:document.documentElement.clientWidth, top:t, bottom:t+document.documentElement.clientHeight});
	}
};

function MiaovPerfectDrag(oElementDrag, fnGetPos, fnDoMove, fnOnDragStart, fnOnDragEnd)
{
	var obj=this;
	
	this.oElement=oElementDrag;
	
	this.oElement.style.overflow='hidden';
	
	this.fnGetPos=fnGetPos;
	this.fnDoMove=fnDoMove;
	this.fnOnDragStart=fnOnDragStart;
	this.fnOnDragEnd=fnOnDragEnd;
	
	this.__oStartOffset__={x:0, y:0};
	
	this.oElement.onmousedown=function (ev)
	{
		obj.startDrag(window.event || ev);
	};
	
	this.fnOnMouseUp=function (ev)
	{
		obj.stopDrag(window.event || ev);
	};
	
	this.fnOnMouseMove=function (ev)
	{
		obj.doDrag(window.event || ev);
	};
}

MiaovPerfectDrag.prototype.enable=function ()
{
	var obj=this;
	
	this.oElement.onmousedown=function (ev)
	{
		obj.startDrag(window.event || ev);
	};
};

MiaovPerfectDrag.prototype.disable=function ()
{
	this.oElement.onmousedown=null;
};

MiaovPerfectDrag.prototype.startDrag=function (oEvent)
{
	var oPos=this.fnGetPos();
	
	var x=oEvent.clientX;
	var y=oEvent.clientY;
	
	if(this.fnOnDragStart)
	{
		this.fnOnDragStart();
	}
	
	this.__oStartOffset__.x=x-oPos.x;
	this.__oStartOffset__.y=y-oPos.y;
	
	if(this.oElement.setCapture)
	{
		this.oElement.setCapture();
		
		this.oElement.onmouseup=this.fnOnMouseUp;
		this.oElement.onmousemove=this.fnOnMouseMove;
	}
	else
	{
		document.addEventListener("mouseup", this.fnOnMouseUp, true);
		document.addEventListener("mousemove", this.fnOnMouseMove, true);
		
		window.captureEvents(Event.MOUSEMOVE | Event.MOUSEUP);
	}
};

MiaovPerfectDrag.prototype.stopDrag=function (oEvent)
{
	if(this.oElement.releaseCapture)
	{
		this.oElement.releaseCapture();
		
		this.oElement.onmouseup=null;
		this.oElement.onmousemove=null;
	}
	else
	{
		document.removeEventListener("mouseup", this.fnOnMouseUp, true);
		document.removeEventListener("mousemove", this.fnOnMouseMove, true);
		
		window.releaseEvents(Event.MOUSE_MOVE | Event.MOUSE_UP);
	}
	
	if(this.fnOnDragEnd)
	{
		if(oEvent.clientX==this.__oStartOffset__.x && oEvent.clientY==this.__oStartOffset__.y)
		{
			this.fnOnDragEnd(false);
		}
		else
		{
			this.fnOnDragEnd(true);
		}
	}
};

MiaovPerfectDrag.prototype.doDrag=function (oEvent)
{
	var x=oEvent.clientX;
	var y=oEvent.clientY;
	
	this.fnDoMove(x-this.__oStartOffset__.x, y-this.__oStartOffset__.y);
};

//事件辅助函数
function miaovAppendEventListener(obj, sEventName, fnEvent)
{
	if(obj.attachEvent)
	{
		obj.attachEvent('on'+sEventName, fnEvent);
	}
	else
	{
		obj.addEventListener(sEventName, fnEvent, false);
	}
}
