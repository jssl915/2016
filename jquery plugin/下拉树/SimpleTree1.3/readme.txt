(注：SimpleTree 各版本改进均向前兼容)

1.3 版本改进：
	1 修正 li 标签和 a 标签之间多余标签的扰乱问题，如<li><span><a></a></span></li>，执行无异常

1.2 版本改进：
	1 消除 ul 标签右侧填充空间
	2 添加菜单项鼠标经过高亮显示效果

1.1 版本改进：
	1 增加 click 事件回调函数参数 a 的非 undefined 验证。如果 a 等于 undefined，不再执行 click 的回调方法
