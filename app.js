initHtmlElements([ '#loading', '#start', '#video', '#map', '#myth-page', '#sound', '#map-myths-btn', '#fullscreen-in-btn', '#fullscreen-out-btn', '#music-off-btn', '#music-on-btn', '#team', '#authors-btn', '#map-myths-menu-btn', '#logo', '#myth-text', '#about', '#about-btn', '#langs', '#map360-btn', '#video-layer-block', '#add-menu', '#stats-btn', '#stats', '#arch-photos-btn', '#photo', '#photo img', '#photo h2', '#places-power-btn', '#donate-btn', '#donate', '#test-btn', '#test' ]);

var soundWidget = SC.Widget('sound');

$sound.classList.add('invis');

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
						window.location.hash = 'myths';
						setTimeout(function() {
							//map.setZoom(12);
							animateMapZoomTo(map, 10);
						}, 2000);
						//$sound.style.display = 'block';
					}
					else player.playVideo();
				}
			}
		}
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
			$mythPage.style.display = 'none';
			//$sound.style.display = 'none';
			soundWidget.bind(SC.Widget.Events.READY, function() {
				playSound('499380882', true);
			});
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
var photoUrl;

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
		map.data.loadGeoJson('geo.json?201811031800');
		mapSetStyle();
		map.data.addListener('click', function(event) {
			switch (event.feature.getProperty('type')) {
				case 'myth': {
					const name = event.feature.getProperty('name');
					//const position = event.feature.getGeometry().get();
					mythAudio = event.feature.getProperty('audio')[currentLang];
					mythVideo = event.feature.getProperty('video');
					window.location.hash = 'myth/' + name;
				} break;
				case 'power': {
					const name = event.feature.getProperty('name');
					mythAudio = event.feature.getProperty('audio')[currentLang];
					mythVideo = event.feature.getProperty('video');
					window.location.hash = 'place-power/' + name;
				} break;
				case 'video': {
					mythVideo = event.feature.getProperty('video');
					window.location.hash = 'video360/' + mythVideo;
				} break;
				case 'photo': {
					const name = event.feature.getProperty('name');
					photoUrl = event.feature.getProperty('photo');
					window.location.hash = 'photo/' + name;
				} break;
			}
		});
	//});
}

var mapTypeShow = 'myths';

var mapSetStyle = function() {
	if (map) {
		map.data.setStyle(function(feature) {
			var markerStyle = {
				icon: {
					scaledSize: new google.maps.Size(64, 64)
				}
			};
			switch (feature.getProperty('type')) {
				case 'myth': {
					if (mapTypeShow != 'myths') markerStyle.visible = false;
					markerStyle.icon.url = 'img/myth_icons/' + feature.getProperty('name') + '.png';
				} break;
				case 'power': {
					if (mapTypeShow != 'places-power') markerStyle.visible = false;
					markerStyle.icon.url = 'img/places-power_icons/' + feature.getProperty('name') + '.png';
				} break;
				case 'video': {
					if (mapTypeShow != '360') markerStyle.visible = false;
					markerStyle.icon.url = 'img/video_360.png';
				} break;
				case 'photo': {
					if (mapTypeShow != 'photo') markerStyle.visible = false;
					markerStyle.icon.url = 'img/photo_360.png';
				} break;
			}
			return markerStyle;
		});
	}
}

$musicOffBtn.addEventListener('click', function() {
	soundWidget.isPaused(function(isPaused) {
		if ( ! isPaused) {
			soundWidget.pause();
			$musicOffBtn.style.display = 'none';
			$musicOnBtn.style.display = 'inline-block';
		}
	});
});
$musicOnBtn.addEventListener('click', function() {
	soundWidget.isPaused(function(isPaused) {
		if (isPaused) {
			soundWidget.play();
			$musicOnBtn.style.display = 'none';
			$musicOffBtn.style.display = 'inline-block';
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

/* var mythTextTypeStarted = false;
const mythText = new Typed('#myth-text-output', {
	stringsElement: '#myth-text',
	typeSpeed: 50,
	showCursor: false,
	backDelay: 0
});
mythText.stop(); */
var mythText;

window.addEventListener('hashchange', function() {
	var hash = window.location.hash.substring(1);
	if (hash) {
		var params = hash.split('/');
		if (params[1]) {
			switch (params[0]) {
				case 'myth': case 'place-power': {
					console.log('myth', params[1]);
					$videoLayerBlock.style.display = 'block';
					$map.style.display = 'none';
					$archPhotosBtn.style.display = 'none';
					if (params[0] == 'myth') {
						$placesPowerBtn.style.display = 'none';
						$mapMythsBtn.style.display = 'inline-block';
					}
					else {
						$placesPowerBtn.style.display = 'inline-block';
						$mapMythsBtn.style.display = 'none';
					}
					$start.style.display = 'none';
					$logo.style.display = 'none';
					$team.style.display = 'none';
					$donate.style.display = 'none';
					$about.style.display = 'none';
					$photo.style.display = 'none';
					$addMenu.style.display = 'none';
					$map360Btn.style.display = 'none';
					$stats.style.display = 'none';
					$test.style.display = 'none';
					$statsBtn.style.display = 'none';
					$testBtn.style.display = 'none';
					$mythPage.style.display = 'block';
					$mythText.innerHTML = '';
					if (player) player.loadVideoById(mythVideo);
					soundWidget.bind(SC.Widget.Events.READY, function() {
						playSound(mythAudio, false, function() {
							/* if ( ! mythTextTypeStarted) {
								mythTextTypeStarted = true;
								setTimeout(function() {
									mythText.start();
								}, 1000);
							}
							else mythText.reset(); */
							//$mythText.innerHTML = document.getElementById(params[1]).innerHTML;
							$mythText.innerHTML = i18next.t(params[1]);
							if (mythText) mythText.destroy();
							mythText = new Typed('#myth-text-output', {
								stringsElement: '#myth-text',
								typeSpeed: 50,
								showCursor: false,
								backDelay: 0
							});
							mythText.reset();
						});
					});
					$musicOffBtn.style.display = 'none';
					$musicOnBtn.style.display = 'none';
					$mapMythsMenuBtn.style.display = 'none';
					initFullscreenInBtn();
				}; break;
				case 'video360': {
					console.log('video360', params[1]);
					$videoLayerBlock.style.display = 'none';
					$map.style.display = 'none';
					$start.style.display = 'none';
					$logo.style.display = 'none';
					$team.style.display = 'none';
					$donate.style.display = 'none';
					$placesPowerBtn.style.display = 'none';
					$archPhotosBtn.style.display = 'none';
					$about.style.display = 'none';
					$photo.style.display = 'none';
					$addMenu.style.display = 'none';
					$mythPage.style.display = 'none';
					if (player) player.loadVideoById(mythVideo);
					soundWidget.bind(SC.Widget.Events.READY, function() {
						soundWidget.pause();
					});
					$musicOffBtn.style.display = 'none';
					$musicOnBtn.style.display = 'none';
					$mapMythsMenuBtn.style.display = 'none';
					$map360Btn.style.display = 'inline-block';
					$stats.style.display = 'none';
					$test.style.display = 'none';
					$statsBtn.style.display = 'none';
					$testBtn.style.display = 'none';
					initFullscreenInBtn();
				}; break;
				case 'photo': {
					console.log('photo', params[1]);
					$archPhotosBtn.style.display = 'inline-block';
					$videoLayerBlock.style.display = 'none';
					$map.style.display = 'none';
					$start.style.display = 'none';
					$logo.style.display = 'none';
					$team.style.display = 'none';
					$donate.style.display = 'none';
					$placesPowerBtn.style.display = 'none';
					$about.style.display = 'none';
					$addMenu.style.display = 'none';
					$mythPage.style.display = 'none';
					$photo.style.display = 'block';
					$photoImg.src = 'img/archival-photos/' + photoUrl;
					$photoH2.innerHTML = i18next.t(params[1]);;
					soundWidget.bind(SC.Widget.Events.READY, function() {
						soundWidget.pause();
					});
					$musicOffBtn.style.display = 'none';
					$musicOnBtn.style.display = 'none';
					$mapMythsMenuBtn.style.display = 'none';
					$map360Btn.style.display = 'none';
					$stats.style.display = 'none';
					$test.style.display = 'none';
					$statsBtn.style.display = 'none';
					$testBtn.style.display = 'none';
					initFullscreenInBtn();
				}; break;
			}
		}
		else {
			switch (params[0]) {
				case 'myths': case '360': case 'archival-photos': case 'places-power': {
					//map.setCenter({ lat: 52.7, lng: 23.9 });
					if (params[0] == 'myths') {
						mapTypeShow = 'myths';
						mapSetStyle();
						$map360Btn.style.display = 'inline-block';
						$archPhotosBtn.style.display = 'inline-block';
						$mapMythsMenuBtn.style.display = 'none';
					}
					else if (params[0] == 'places-power') {
						mapTypeShow = 'places-power';
						mapSetStyle();
						$map360Btn.style.display = 'inline-block';
						$archPhotosBtn.style.display = 'inline-block';
						$mapMythsMenuBtn.style.display = 'none';
					}
					else if (params[0] == '360') {
						mapTypeShow = '360';
						mapSetStyle();
						$mapMythsMenuBtn.style.display = 'inline-block';
						$archPhotosBtn.style.display = 'inline-block';
						$map360Btn.style.display = 'none';
					}
					else {
						mapTypeShow = 'photo';
						mapSetStyle();
						$mapMythsMenuBtn.style.display = 'inline-block';
						$map360Btn.style.display = 'inline-block';
						$archPhotosBtn.style.display = 'none';
					}
					$placesPowerBtn.style.display = 'inline-block';
					$addMenu.style.display = 'block';
					$authorsBtn.style.display = 'inline-block';
					$aboutBtn.style.display = 'inline-block';
					$statsBtn.style.display = 'inline-block';
					$testBtn.style.display = 'inline-block';
					$donateBtn.style.display = 'inline-block';
					$map.style.display = 'block';
					$logo.style.display = 'block';
					$logo.style.width = 'initial';
					$logo.style.left = '20px';
					$videoLayerBlock.style.display = 'none';
					$start.style.display = 'none';
					$team.style.display = 'none';
					$donate.style.display = 'none';
					$about.style.display = 'none';
					$photo.style.display = 'none';
					$stats.style.display = 'none';
					$test.style.display = 'none';
					$mapMythsBtn.style.display = 'none';
					if (player) player.stopVideo();
					initFullscreenInBtn();
					soundWidget.bind(SC.Widget.Events.READY, function() {
						soundWidget.getCurrentSound(function(sound) {
							if (sound.id != 499380882) playSound(499380882, true);
						});
					});
					$musicOffBtn.style.display = 'inline-block';
				}; break;
				case 'team': {
					$team.style.display = 'block';
					$mapMythsMenuBtn.style.display = 'inline-block';
					$addMenu.style.display = 'block';
					$aboutBtn.style.display = 'inline-block';
					$map360Btn.style.display = 'inline-block';
					$donateBtn.style.display = 'inline-block';
					$statsBtn.style.display = 'inline-block';
					$testBtn.style.display = 'inline-block';
					$videoLayerBlock.style.display = 'none';
					$about.style.display = 'none';
					$donate.style.display = 'none';
					$photo.style.display = 'none';
					$authorsBtn.style.display = 'none';
					$logo.style.display = 'none';
					$map.style.display = 'none';
					$start.style.display = 'none';
					$mythPage.style.display = 'none';
					$mapMythsBtn.style.display = 'none';
					$stats.style.display = 'none';
					$test.style.display = 'none';
					if (player) player.stopVideo();
					initFullscreenInBtn();
					soundWidget.bind(SC.Widget.Events.READY, function() {
						soundWidget.getCurrentSound(function(sound) {
							if (sound.id != 504406362) playSound(504406362, true);
						});
					});
					$musicOffBtn.style.display = 'inline-block';
					$team.style.top = window.innerHeight + 'px';
					setTimeout(teamAnimation, 3000);
				}; break;
				case 'about': {
					$about.style.display = 'block';
					$mapMythsMenuBtn.style.display = 'inline-block';
					$addMenu.style.display = 'block';
					$authorsBtn.style.display = 'inline-block';
					$map360Btn.style.display = 'inline-block';
					$donateBtn.style.display = 'inline-block';
					$statsBtn.style.display = 'inline-block';
					$testBtn.style.display = 'inline-block';
					$videoLayerBlock.style.display = 'none';
					$team.style.display = 'none';
					$donate.style.display = 'none';
					$photo.style.display = 'none';
					$aboutBtn.style.display = 'none';
					$logo.style.display = 'none';
					$map.style.display = 'none';
					$start.style.display = 'none';
					$mythPage.style.display = 'none';
					$mapMythsBtn.style.display = 'none';
					$stats.style.display = 'none';
					$test.style.display = 'none';
					if (player) player.stopVideo();
					initFullscreenInBtn();
					soundWidget.bind(SC.Widget.Events.READY, function() {
						soundWidget.getCurrentSound(function(sound) {
							if (sound.id != 513805107) playSound(513805107, true);
						});
					});
					$musicOffBtn.style.display = 'inline-block';
				}; break;
				case 'statistics': {
					$stats.style.display = 'block';
					$test.style.display = 'none';
					$about.style.display = 'none';
					$mapMythsMenuBtn.style.display = 'inline-block';
					$addMenu.style.display = 'block';
					$authorsBtn.style.display = 'inline-block';
					$map360Btn.style.display = 'inline-block';
					$aboutBtn.style.display = 'inline-block';
					$donateBtn.style.display = 'inline-block';
					$testBtn.style.display = 'inline-block';
					$videoLayerBlock.style.display = 'none';
					$team.style.display = 'none';
					$donate.style.display = 'none';
					$photo.style.display = 'none';
					$logo.style.display = 'none';
					$map.style.display = 'none';
					$start.style.display = 'none';
					$mythPage.style.display = 'none';
					$mapMythsBtn.style.display = 'none';
					$statsBtn.style.display = 'none';
					if (player) player.stopVideo();
					initFullscreenInBtn();
					/* soundWidget.bind(SC.Widget.Events.READY, function() {
						soundWidget.getCurrentSound(function(sound) {
							if (sound.id != 513805107) playSound(513805107, true);
						});
					}); */
					$musicOffBtn.style.display = 'inline-block';
				}; break;
				case 'test': {
					$test.style.display = 'block';
					$stats.style.display = 'none';
					$about.style.display = 'none';
					$mapMythsMenuBtn.style.display = 'inline-block';
					$addMenu.style.display = 'block';
					$authorsBtn.style.display = 'inline-block';
					$map360Btn.style.display = 'inline-block';
					$aboutBtn.style.display = 'inline-block';
					$donateBtn.style.display = 'inline-block';
					$statsBtn.style.display = 'inline-block';
					$videoLayerBlock.style.display = 'none';
					$team.style.display = 'none';
					$donate.style.display = 'none';
					$photo.style.display = 'none';
					$logo.style.display = 'none';
					$map.style.display = 'none';
					$start.style.display = 'none';
					$mythPage.style.display = 'none';
					$mapMythsBtn.style.display = 'none';
					$testBtn.style.display = 'none';
					if (player) player.stopVideo();
					initFullscreenInBtn();
					soundWidget.bind(SC.Widget.Events.READY, function() {
						soundWidget.getCurrentSound(function(sound) {
							if (sound.id != 499380882) playSound(499380882, true);
						});
					});
					$musicOffBtn.style.display = 'inline-block';
				}; break;
				case 'donate': {
					$donate.style.display = 'block';
					$about.style.display = 'none';
					$mapMythsMenuBtn.style.display = 'inline-block';
					$addMenu.style.display = 'block';
					$authorsBtn.style.display = 'inline-block';
					$map360Btn.style.display = 'inline-block';
					$aboutBtn.style.display = 'inline-block';
					$statsBtn.style.display = 'inline-block';
					$archPhotosBtn.style.display = 'inline-block';
					$placesPowerBtn.style.display = 'inline-block';
					$testBtn.style.display = 'inline-block';
					$videoLayerBlock.style.display = 'none';
					$donateBtn.style.display = 'none';
					$team.style.display = 'none';
					$photo.style.display = 'none';
					$logo.style.display = 'none';
					$map.style.display = 'none';
					$start.style.display = 'none';
					$mythPage.style.display = 'none';
					$mapMythsBtn.style.display = 'none';
					$stats.style.display = 'none';
					$test.style.display = 'none';
					if (player) player.stopVideo();
					initFullscreenInBtn();
					soundWidget.bind(SC.Widget.Events.READY, function() {
						soundWidget.getCurrentSound(function(sound) {
							if (sound.id != 513805107) playSound(513805107, true);
						});
					});
					$musicOffBtn.style.display = 'inline-block';
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

var currentLang;

i18next.on('languageChanged', function() {
	//var currentLang = i18next.languages.toString(); // i18next.language
	currentLang = i18next.languages[0];
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
	$donate.innerHTML = i18next.t('donate');
});