(function() {
    var a = ['section', 'article', 'nav', 'header', 'footer' /* 其他HTML5元素 */];
    for (var i = 0, j = a.length; i < j; i++) {
        document.createElement(a[i]);
    }
})();