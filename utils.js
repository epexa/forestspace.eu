var camelCase = function(str) {
	str = str.replace(/(#)/g, '').replace(/\./g, '');
	str = str.replace(/-([a-z])/g, function(_m, l) {
		return l.toUpperCase();
	});
	return str.replace(/ ([a-z])/g, function(_m, l) {
		return l.toUpperCase();
	});
}

var initHtmlElements = function($htmlElements) {
	/*document.addEventListener('DOMContentLoaded', () => {
	});*/
	for (var name in $htmlElements) {
		var nameConst = $htmlElements[name];
		nameConst = camelCase(nameConst);
		eval('window.$' + nameConst + ' = document.querySelector("' + $htmlElements[name] + '");');
	}
};