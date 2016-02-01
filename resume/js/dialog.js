// 获取id, class, tagName
var get = {
	byId: function(id) {
		return typeof id === "string" ? document.getElementById(id) : id;
	},
	byClass: function(sClass, oParent) {
		var aClass = [];
		var reClass = new RegExp("(^| )" + sClass + "( |$)");
		var aElem = this.byTagName("*", oParent);
		for (var i=0;i< aElem.length; i++){
			reClass.test(aElem[i].className) && aClass.push(aElem[i]);
		}
		return aClass;
	},
	byTagName: function(elem, obj) {
		return (obj || document).getElementsByTagName(elem)
	}
}

//窗口拖拽
function DialogDrag(oDrag,oTitle,oSizeDrag){
	var posX=posY=0;
	var oMin = get.byClass("min",oDrag)[0];
	var oMax = get.byClass("max",oDrag)[0];
	var oRevert = get.byClass("revert",oDrag)[0];
	var oClose = get.byClass("close",oDrag)[0];
	var RevertWidth=600;
	var RevertHeight=400;
	oDrag.style.width=RevertWidth+'px';
	oDrag.style.height=RevertHeight+'px';
	oDrag.style.left=(document.documentElement.clientWidth-oDrag.offsetWidth)/2+"px";
	oDrag.style.top=(document.documentElement.clientHeight-oDrag.offsetHeight)/2+"px";
	
	oTitle.onmousedown=function(event){
		oTitle.style.cursor = "move";
		var event = event || window.event;
		var disX=event.clientX-oDrag.offsetLeft;
		var disY=event.clientY-oDrag.offsetTop;
		//鼠标移动，窗口随之移动     onmousemove在有物体移动是才执行alert事件；
		document.onmousemove=function(event){
			var event = event || window.event;
			maxW=document.documentElement.clientWidth-oDrag.offsetWidth;
			maxH=document.documentElement.clientHeight-oDrag.offsetHeight;
			posX=event.clientX-disX;
			posY=event.clientY-disY;
			if(posX<0){
				posX=0;
			}else if(posX>maxW){
				posX=maxW;
			}
			if(posY<0){
				posY=0;
			}else if(posY>maxH){
				posY=maxH;
			}
			oDrag.style.left=posX+'px';
			oDrag.style.top=posY+'px';
		 }
			//鼠标松开，窗口将不再移动
			document.onmouseup=function(){
			document.onmousemove=null;
			document.onmouseup=null;
		}
	 }
	 
	 oSizeDrag.onmousedown=function (ev){
		var oEvent=ev||event;
		var disX=oEvent.clientX-oSizeDrag.offsetLeft;
		var disY=oEvent.clientY-oSizeDrag.offsetTop;
		document.onmousemove=function (ev){
			var oEvent=ev||event;		
			var w = oEvent.clientX; 
			if(w>=window.innerWidth-10){w = window.innerWidth-10}
			var h = oEvent.clientY;
			if(h>=window.innerHeight-10){h = window.innerHeight-10}	
			var iW = w-disX+oSizeDrag.offsetWidth;
			var iH = h-disY+oSizeDrag.offsetHeight;
			if(iW<=300){iW=300}
			if(iH<=200){iH=200}
			oDrag.style.width=iW+'px';
			oDrag.style.height=iH+'px';
			
		};	
		document.onmouseup=function (){
			document.onmousemove=null;
			document.onmouseup=null;
		};
	};
	 
	//最小化按钮
	oMin.onclick=function(){
		oDrag.style.display='none';
		var obut=document.createElement('a');
		obut.className='open';
		obut.href='javascript:;';
		obut.title='还原';
		document.body.appendChild(obut);
		obut.onclick=function(){
			oDrag.style.display='block';
			document.body.removeChild(this);
			this.onclick=null;
		}
	}
	
	//最大化按钮
	oMax.onclick=function(){
		oDrag.style.left=oDrag.style.top=0;
		oDrag.style.width=document.documentElement.clientWidth-2+'px';
		oDrag.style.height=document.documentElement.clientHeight-2+'px';
		this.style.display='none';
		oRevert.style.display='block';
	}
	
	//还原按钮
	oRevert.onclick=function(){
		oDrag.style.width=RevertWidth+'px';
		oDrag.style.height=RevertHeight+'px';
		oDrag.style.left=(document.documentElement.clientWidth-oDrag.offsetWidth)/2+"px";
		oDrag.style.top=(document.documentElement.clientHeight-oDrag.offsetHeight)/2+"px";
		this.style.display='none';
		oMax.style.display='block';
	}
	//点击关闭按钮
	oClose.onclick=function(){
		oDrag.style.display='none';
		this.onclick=null;
		$Page.page3.init('blogId',page3Obj);
	}
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
		console.log(options.url);
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