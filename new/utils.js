let camelCase = (str) => {
	str = str.replace(/(#)/g, '').replace(/\./g, '');
	str = str.replace(/-([a-z])/g, (_m, l) => {
		return l.toUpperCase();
	});
	return str.replace(/ ([a-z])/g, (_m, l) => {
		return l.toUpperCase();
	});
}

let initHtmlElements = ($htmlElements) => {
	/*document.addEventListener('DOMContentLoaded', () => {
	});*/
	for (let name in $htmlElements) {
		let nameConst = $htmlElements[name];
		nameConst = camelCase(nameConst);
		eval('window.$' + nameConst + ' = document.querySelector("' + $htmlElements[name] + '");');
	}
};