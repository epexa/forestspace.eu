initHtmlElements([ '#loading', '#start', '#video', '#map', '#fairytale-page', '#sound', '#btn-map', '#fullscreen-in-btn', '#fullscreen-out-btn', '#music-toggle-btn', '#team', '#authors-btn', '#btn-map-menu', '#logo', '#fairytale-text', '#about', '#about-btn', '#langs' ]);

var soundWidget = SC.Widget('sound');

var player;
var introVideo = true;
var loaded = false;
var loadVideoById;
var onYouTubeIframeAPIReady = function() {
	player = new YT.Player($video, {
		events: {
			onReady: function(event) {
				if (loadVideoById) player.loadVideoById(loadVideoById);
				//event.target.setPlaybackQuality('hd1080');
				event.target.playVideo();
			},
			onStateChange: function(event) {
				$loading.style.display = 'none';
				if (event.data == YT.PlayerState.PLAYING) {
					if (event.target.j.videoData.video_id == 'YG25qmmSEHg') introVideo = true; else introVideo = false;
					if ( ! loaded && introVideo) {
						loaded = true;
						player.pauseVideo();
					}
					else $video.style.display = 'block';
				}
				if (event.data == YT.PlayerState.CUED) {
					$video.style.display = 'none';
				}
				if (event.data == YT.PlayerState.ENDED) {
					if (introVideo) {
						window.location.hash = 'map';
						setTimeout(function() {
							//map.setZoom(12);
							animateMapZoomTo(map, 10);
						}, 2000);
						//$sound.style.display = 'block';
					}
					else player.playVideo();
				}
			}
		},
		host: 'https://www.youtube-nocookie.com',
		origin: 'https://forestspace.eu',
		widget_referrer: 'https://forestspace.eu'
	});
}

// https://stackoverflow.com/a/34007969/2823865
function animateMapZoomTo(map, targetZoom) {
	var currentZoom = arguments[2] || map.getZoom();
	if (currentZoom != targetZoom) {
		google.maps.event.addListenerOnce(map, 'zoom_changed', function (event) {
			animateMapZoomTo(map, targetZoom, currentZoom + (targetZoom > currentZoom ? 1 : -1));
		});
		setTimeout(function(){ map.setZoom(currentZoom) }, 80);
	}
}

var loader = new Vivus('start', {
	type: 'oneByOne',
	file: 'img/logo.svg',
	//start: 'autostart',
	//duration: 1000,
	onReady: function() {
		loader.play(1, function() {
			console.log('loader finish');
		});
		var $loader = document.getElementById('loader');
		$loader.addEventListener('click', function() {
			$loading.style.display = 'block';
			//loader.reset().play();
			$start.style.display = 'none';
			if (loaded) player.playVideo(); else loaded = true;
			fullScreen();
			$fairytalePage.style.display = 'none';
			//$sound.style.display = 'none';
			playSound('499380882', true);
			$logo.style.width = 'initial';
			$logo.style.left = '20px';
		});
		$loader.addEventListener('mouseover', function() {
			soundWidget.play();
		});
	}
});

var docElm = document.documentElement;

var fullScreen = function() {
	if (docElm.requestFullscreen) docElm.requestFullscreen();
	else if (docElm.msRequestFullscreen) {
		docElm = document.body;
		docElm.msRequestFullscreen();
	}
	else if (docElm.mozRequestFullScreen) docElm.mozRequestFullScreen();
	else if (docElm.webkitRequestFullScreen) docElm.webkitRequestFullScreen();
	$fullscreenOutBtn.style.display = 'inline-block';
}

$fullscreenInBtn.addEventListener('click', function() {
	$fullscreenInBtn.style.display = 'none';
	fullScreen();
});

$fullscreenOutBtn.addEventListener('click', function() {
	$fullscreenOutBtn.style.display = 'none';
	if (document.exitFullscreen) document.exitFullscreen();
	else if (document.msExitFullscreen) document.msExitFullscreen();
	else if (document.mozCancelFullScreen) document.mozCancelFullScreen();
	else if (document.webkitCancelFullScreen) document.webkitCancelFullScreen();
	$fullscreenInBtn.style.display = 'inline-block';
});

var initFullscreenInBtn = function() {
	if ( ! document.fullscreenElement && ! document.msFullscreenElement && ! document.mozFullScreen && ! document.webkitIsFullScreen) $fullscreenInBtn.style.display = 'inline-block';
}

var mythAudio;
var mythVideo;

var map;

var initMap = function() {
	//document.addEventListener('DOMContentLoaded', function() {
		map = new google.maps.Map($map, {
			center: { lat: 52.68400095664496, lng: 23.93218827226301 },
			zoom: 16,
			mapTypeId: 'satellite',
			mapTypeControl: false,
			fullscreenControl: false,
			streetViewControl: false,
			zoomControl: false
		});
		map.data.loadGeoJson('fairytales.json?201810151230');
		map.data.setStyle(function(feature) {
			return {
				icon: {
					url: 'img/myth_icons/' + feature.getProperty('name') + '.png',
					scaledSize: new google.maps.Size(64, 64)
				}
			};
		});
		map.data.addListener('click', function(event) {
			const name = event.feature.getProperty('name');
			//const position = event.feature.getGeometry().get();
			mythAudio = event.feature.getProperty('audio');
			mythVideo = event.feature.getProperty('video');
			window.location.hash = 'fairytale/' + name;
		});
	//});
}

$musicToggleBtn.addEventListener('click', function() {
	soundWidget.isPaused(function(isPaused) {
		if ( ! isPaused) {
			soundWidget.pause();
			$musicToggleBtn.innerText = 'Вкл. музыку';
		}
		else {
			soundWidget.play();
			$musicToggleBtn.innerText = 'Выкл. музыку';
		}
	});
});

var playSound = function(url, hide, callback) {
	soundWidget.load('https://api.soundcloud.com/tracks/' + url + '&color=%232A9FD6', {
		//color: '%232A9FD6',
		auto_play: false,
		hide_related: true,
		show_comments: false,
		show_user: false,
		show_reposts: false,
		show_teaser: false,
		visual: false,
		show_artwork: false,
		callback: function() {
			soundWidget.play();
			if (callback) callback();
		}
	});
	if (hide) $sound.classList.add('invis');
	else $sound.classList.remove('invis');
}

const teamAnimation = function() {
	$team.style.top = window.innerHeight + 'px';
	move('#team')
		.duration('60s')
		.sub('top', window.innerHeight + $team.clientHeight)
		.end(function() {
			teamAnimation();
		});
}

/* var fairytaleTextTypeStarted = false;
const fairytaleText = new Typed('#fairytale-text-output', {
	stringsElement: '#fairytale-text',
	typeSpeed: 50,
	showCursor: false,
	backDelay: 0
});
fairytaleText.stop(); */
var fairytaleText;

window.addEventListener('hashchange', function() {
	var hash = window.location.hash.substring(1);
	if (hash) {
		var params = hash.split('/');
		if (params[1]) {
			switch (params[0]) {
				case 'fairytale': {
					console.log('fairytale', params[1]);
					$map.style.display = 'none';
					$start.style.display = 'none';
					$logo.style.display = 'none';
					$authorsBtn.style.display = 'none';
					$aboutBtn.style.display = 'none';
					$team.style.display = 'none';
					$about.style.display = 'none';
					$fairytalePage.style.display = 'block';
					$fairytaleText.innerHTML = '';
					if (player) player.loadVideoById(mythVideo);
					soundWidget.bind(SC.Widget.Events.READY, function() {
						playSound(mythAudio, false, function() {
							/* if ( ! fairytaleTextTypeStarted) {
								fairytaleTextTypeStarted = true;
								setTimeout(function() {
									fairytaleText.start();
								}, 1000);
							}
							else fairytaleText.reset(); */
							//$fairytaleText.innerHTML = document.getElementById(params[1]).innerHTML;
							$fairytaleText.innerHTML = i18next.t(params[1]);
							if (fairytaleText) fairytaleText.destroy();
							fairytaleText = new Typed('#fairytale-text-output', {
								stringsElement: '#fairytale-text',
								typeSpeed: 50,
								showCursor: false,
								backDelay: 0
							});
							fairytaleText.reset();
						});
					});
					$musicToggleBtn.style.display = 'none';
					$btnMapMenu.style.display = 'none';
					$btnMap.style.display = 'inline-block';
					initFullscreenInBtn();
				}; break;
			}
		}
		else {
			switch (params[0]) {
				case 'map': {
					$authorsBtn.style.display = 'inline-block';
					$aboutBtn.style.display = 'inline-block';
					$map.style.display = 'block';
					$logo.style.display = 'block';
					$logo.style.width = 'initial';
					$logo.style.left = '20px';
					$start.style.display = 'none';
					$team.style.display = 'none';
					$about.style.display = 'block';
					$btnMap.style.display = 'none';
					$btnMapMenu.style.display = 'none';
					if (player) player.stopVideo();
					initFullscreenInBtn();
					soundWidget.bind(SC.Widget.Events.READY, function() {
						soundWidget.getCurrentSound(function(sound) {
							if (sound.id != 499380882) playSound(499380882, true);
						});
					});
					$musicToggleBtn.style.display = 'inline-block';
					$musicToggleBtn.innerText = 'Выкл. музыку';
				}; break;
				case 'team': {
					$team.style.display = 'block';
					$btnMapMenu.style.display = 'inline-block';
					$aboutBtn.style.display = 'inline-block';
					$about.style.display = 'none';
					$authorsBtn.style.display = 'none';
					$logo.style.display = 'none';
					$map.style.display = 'none';
					$start.style.display = 'none';
					$fairytalePage.style.display = 'none';
					$btnMap.style.display = 'none';
					if (player) player.stopVideo();
					initFullscreenInBtn();
					soundWidget.bind(SC.Widget.Events.READY, function() {
						soundWidget.getCurrentSound(function(sound) {
							if (sound.id != 504406362) playSound(504406362, true);
						});
					});
					$musicToggleBtn.style.display = 'inline-block';
					$musicToggleBtn.innerText = 'Выкл. музыку';
					$team.style.top = window.innerHeight + 'px';
					setTimeout(teamAnimation, 3000);
				}; break;
				case 'about': {
					$about.style.display = 'block';
					$btnMapMenu.style.display = 'inline-block';
					$authorsBtn.style.display = 'inline-block';
					$team.style.display = 'none';
					$aboutBtn.style.display = 'none';
					$logo.style.display = 'none';
					$map.style.display = 'none';
					$start.style.display = 'none';
					$fairytalePage.style.display = 'none';
					$btnMap.style.display = 'none';
					if (player) player.stopVideo();
					initFullscreenInBtn();
					soundWidget.bind(SC.Widget.Events.READY, function() {
						soundWidget.getCurrentSound(function(sound) {
							if (sound.id != 513805107) playSound(513805107, true);
						});
					});
					$musicToggleBtn.style.display = 'inline-block';
					$musicToggleBtn.innerText = 'Выкл. музыку';
				}; break;
			}
		}
	}
	else {
	}
});

window.dispatchEvent(new CustomEvent('hashchange'));

$loading.style.display = 'none';

Array.from(document.getElementsByClassName('team-profile')).forEach(function(element) {
	var oldPhoto;
	element.addEventListener('mouseover', function() {
		oldPhoto = element.querySelector('img').src;
		element.querySelector('img').src =  element.dataset.photo;
	});
	element.addEventListener('mouseout', function() {
		element.querySelector('img').src = oldPhoto;
	});
});

const langList = [
	{lang: 'ru', name: 'Русский'}, 
	{lang: 'pl', name: 'Polski'}
];

var langListArr = [];

for (var key in langList) {
	var $langBtn = document.createElement('img');
	$langBtn.src = 'img/' + langList[key].lang + '.svg';
	$langBtn.dataset.lang = langList[key].lang;
	$langBtn.addEventListener('click', function() {
		i18next.changeLanguage(this.dataset.lang);
	});
	$langs.appendChild($langBtn);
	langListArr.push(langList[key].lang);
}

$langsList = Array.from($langs.getElementsByTagName('img'));

i18next
	.use(i18nextXHRBackend)
	.use(i18nextBrowserLanguageDetector)
	.init({
		backend: {
			loadPath: 'locales/{{lng}}.json'
		},
		fallbackLng: 'ru',
		load: 'languageOnly',
		whitelist: langListArr,
	}/* , function(err) {
	}*/);

var translationsDom = {};

i18next.on('languageChanged', function() {
	//var currentLang = i18next.languages.toString(); // i18next.language
	var currentLang = i18next.languages[0];
	$langsList.forEach(function(item) {
		if (item.dataset.lang != currentLang) item.style.display = 'inline'; else item.style.display = 'none';
	});
	var words = i18next.services.resourceStore.data[currentLang].translation;
	for (var key in words) {
		if (translationsDom[key]) translationsDom[key].revert();
		translationsDom[key] = findAndReplaceDOMText(document.body, {
			find: key,
			//replace: words[key]
			replace: i18next.t(key)
		});
	}
	$about.innerHTML = i18next.t('about');
});