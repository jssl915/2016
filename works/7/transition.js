var lj = {};
lj.pageHtml =[];
lj.changePage = function(url,obj){
	if(url.charAt(0) == '#'){
		newPageId = url.substring(1)
		lj[obj==undefined || obj.transition==undefined?'slide':obj.transition]();	
	}else{			
		$.ajax( {
			url : url,
			type : 'GET',
			dataType : "html",
			async : false,
			success : function(html, textStatus, xhr){	
				lj.pageHtml.push($('#mainPage').html());				
				$('#mainPage').append($(".tv_pages", $("<code></code>").append($(html))));
				//var oDiv = document.createElement('div');
				//oDiv.innerHTML = html;				
				//document.getElementById('mainPage').appendChild(oDiv.querySelector(".tv_pages"))
			 	lj[obj==undefined || obj.transition==undefined?'slide':obj.transition]();				
			}
		});
	}	
}

lj.changeReturn = function(){
	$('#mainPage').append(lj.pageHtml[lj.pageHtml.length-1]);	
	lj.pageHtml.length = lj.pageHtml.length-1;
	lj.slideReturn();
}

lj.slide = function(){	
	var oPage = $("div[data-type='tv_page']");
	var oldPage = oPage.get(0).id,newPage = oPage.get(1).id;			 
	$('#'+newPage).show();
	$('#'+oldPage).addClass('slideouttoleft');
	$('#'+newPage).addClass('slideinfromright');	
	setTimeout(function(){		
		$('#'+oldPage).removeClass('slideouttoleft'); 
		$('#'+newPage).removeClass('slideinfromright'); 	
		$('#'+oldPage).parent(".tv_pages").remove();		
	},350);
}

lj.slideReturn = function(){
	var oPage = $("div[data-type='tv_page']");
	var oldPage = oPage.get(1).id,newPage = oPage.get(0).id;	
	$('#'+newPage).show();
	$('#'+oldPage).addClass('slideinfromleft');
	$('#'+newPage).addClass('slideouttoright');
	setTimeout(function(){		
		$('#'+oldPage).removeClass('slideinfromleft'); 
		$('#'+newPage).removeClass('slideouttoright');  
		$('#'+newPage).parent(".tv_pages").remove();	
	},350);	
}

lj.slideup = function(){	
	var oPage = $("div[data-type='tv_page']");
	var oldPage = oPage.get(0).id,newPage = oPage.get(1).id;			 
	$('#'+newPage).show();
	$('#'+oldPage).addClass('slideouttoup');
	$('#'+newPage).addClass('slideinfromdown');	
	setTimeout(function(){		
		$('#'+oldPage).removeClass('slideouttoup'); 
		$('#'+newPage).removeClass('slideinfromdown'); 	
		$('#'+oldPage).parent(".tv_pages").remove();		
	},350);
}

lj.slidedown = function(){	
	var oPage = $("div[data-type='tv_page']");
	var oldPage = oPage.get(1).id,newPage = oPage.get(0).id;			 
	$('#'+newPage).show();
	$('#'+oldPage).addClass('slideinfromup');
	$('#'+newPage).addClass('slideouttodown');	
	setTimeout(function(){		
		$('#'+oldPage).removeClass('slideinfromup'); 
		$('#'+newPage).removeClass('slideouttodown'); 	
		$('#'+newPage).parent(".tv_pages").remove();		
	},350);
}

lj.fade = function(){	
	var oPage = $("div[data-type='tv_page']");
	var oldPage = oPage.get(0).id,newPage = oPage.get(1).id;			 
	$('#'+newPage).show();
	$('#'+oldPage).addClass('fadeout');
	$('#'+newPage).addClass('fadein');
	setTimeout(function(){		
		$('#'+oldPage).removeClass('fadeout'); 
		$('#'+newPage).removeClass('fadein');  
		$('#'+oldPage).parent(".tv_pages").remove();		
	},350);	
}

lj.popin = function(){	
	var oPage = $("div[data-type='tv_page']");
	var oldPage = oPage.get(0).id,newPage = oPage.get(1).id;			 
	$('#'+newPage).show();
	$('#'+oldPage).addClass('popout');
	$('#'+newPage).addClass('popin');
	setTimeout(function(){		
		$('#'+oldPage).removeClass('popout'); 
		$('#'+newPage).removeClass('popin');  
		$('#'+oldPage).parent(".tv_pages").remove();		
	},350);	
}