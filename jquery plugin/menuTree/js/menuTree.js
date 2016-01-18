$.fn.extend({
	menuTree : function(data) {
		var htmlArray = [];
		var oneMenus = data[0].children;
		htmlArray.push('<div class="west-menu-content"><ul>');
		for (var i = 0; i < oneMenus.length; i++) {
			var oneMenu = oneMenus[i];
			var oneMenuName = oneMenu.text;
			var twoMenus = oneMenu.children;
			htmlArray.push('<li><div class="one-li-div">'
					+ '<span class="one-left-icon"></span>'
					+ '<span class="one-left-title">' + oneMenuName
					+ '</span>'
					+ '<span class="one-right-icon-minus"></span>'
					+ '</div>');
			if (twoMenus != undefined) {
				htmlArray.push('<ul class="two-ul">'
						+ '<div class="tow-ul-background"></div>');
				for (var j = 0; j < twoMenus.length; j++) {
					var twoMenu = twoMenus[j];
					var twoMenuName = twoMenu.text;
					htmlArray
							.push('<li onclick="openTab('
									+ twoMenu.id
									+ ')"><span class="two-left-icon"></span><span class="two-left-title">'
									+ twoMenuName + '</span></li>');
				}
				htmlArray.push('</ul>');
			}
		}
		htmlArray.push('</ul></div>');
		this.html(htmlArray.join(''));
		var allLi = $('.west-menu-content').find('li');
		$('.one-li-div').click(function() {
			var $span = $(this).children(".one-right-icon-minus");
			if ($span.length) {
				$span.attr('class', 'one-right-icon-add');
				$(this).next().slideUp();
			} else {
				$span = $(this).children(".one-right-icon-add");
				$span.attr('class', 'one-right-icon-minus');
				$(this).next().slideDown();
			}
		})
		$('.two-ul li').click(function() {
			allLi.filter('.selected').removeClass('selected');
			$(this).addClass('selected');
		})
	}
});
function openTab(menuId){
	alert("menuId="+menuId);
}
