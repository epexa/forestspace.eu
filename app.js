initHtmlElements([ '#loading', '#start', '#video', '#map', '#fairytale-page', '#sound', '#btn-map', '#fullscreen-in-btn', '#fullscreen-out-btn', '#music-toggle-btn', '#team', '#authors-btn', '#btn-map-menu', '#logo', '#fairytale-text' ]);

let soundWidget = SC.Widget('sound');

let player;
let introVideo = true;
let loaded = false;
let loadVideoById;
var onYouTubeIframeAPIReady = () => {
	player = new YT.Player($video, {
		events: {
			onReady: (event) => {
				if (loadVideoById) player.loadVideoById(loadVideoById);
				//event.target.setPlaybackQuality('hd1080');
				event.target.playVideo();
			},
			onStateChange: (event) => {
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
						setTimeout(() => {
							//map.setZoom(12);
							animateMapZoomTo(map, 10);
						}, 3000);
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

let loader = new Vivus('start', {
	type: 'oneByOne',
	file: 'img/logo.svg',
	//start: 'autostart',
	//duration: 1000,
	onReady: () => {
		loader.play(1, () => {
			console.log('loader finish');
		});
		let $loader = document.getElementById('loader');
		$loader.addEventListener('click', () => {
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
		$loader.addEventListener('mouseover', () => {
			soundWidget.play();
		});
	}
});

let docElm = document.documentElement;

let fullScreen = () => {
	if (docElm.requestFullscreen) docElm.requestFullscreen();
	else if (docElm.msRequestFullscreen) {
		docElm = document.body;
		docElm.msRequestFullscreen();
	}
	else if (docElm.mozRequestFullScreen) docElm.mozRequestFullScreen();
	else if (docElm.webkitRequestFullScreen) docElm.webkitRequestFullScreen();
	$fullscreenOutBtn.style.display = 'block';
}

$fullscreenInBtn.addEventListener('click', () => {
	$fullscreenInBtn.style.display = 'none';
	fullScreen();
});

$fullscreenOutBtn.addEventListener('click', () => {
	$fullscreenOutBtn.style.display = 'none';
	if (document.exitFullscreen) document.exitFullscreen();
	else if (document.msExitFullscreen) document.msExitFullscreen();
	else if (document.mozCancelFullScreen) document.mozCancelFullScreen();
	else if (document.webkitCancelFullScreen) document.webkitCancelFullScreen();
	$fullscreenInBtn.style.display = 'block';
});

let initFullscreenInBtn = () => {
	if ( ! document.fullscreenElement && ! document.msFullscreenElement && ! document.mozFullScreen && ! document.webkitIsFullScreen) $fullscreenInBtn.style.display = 'block';
}

let mythAudio;
let mythVideo;

let map;

var initMap = () => {
	map = new google.maps.Map($map, {
		center: { lat: 52.68400095664496, lng: 23.93218827226301 },
		zoom: 16,
		mapTypeId: 'satellite',
		mapTypeControl: false,
		fullscreenControl: false,
		streetViewControl: false,
		zoomControl: false
	});
	map.data.loadGeoJson('fairytales.json?201810130100');
	map.data.setStyle(feature => {
		return {
			icon: {
				url: `img/myth_icons/${feature.getProperty('name')}.png`,
				scaledSize: new google.maps.Size(64, 64)
			}
		};
	});
	map.data.addListener('click', event => {
		const name = event.feature.getProperty('name');
		//const position = event.feature.getGeometry().get();
		mythAudio = event.feature.getProperty('audio');
		mythVideo = event.feature.getProperty('video');
		window.location.hash = 'fairytale/' + name;
	});
}

$musicToggleBtn.addEventListener('click', () => {
	soundWidget.isPaused((isPaused) => {
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

let playSound = (url, hide, callback) => {
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
		callback: () => {
			soundWidget.play();
			if (callback) callback();
		}
	});
	if (hide) $sound.classList.add('invis');
	else $sound.classList.remove('invis');
}

const teamAnimation = () => {
	$team.style.top = window.innerHeight + 'px';
	move('#team')
		.duration('60s')
		.sub('top', window.innerHeight + $team.clientHeight)
		.end(() => {
			teamAnimation();
		});
}

/* let fairytaleTextTypeStarted = false;
const fairytaleText = new Typed('#fairytale-text-output', {
	stringsElement: '#fairytale-text',
	typeSpeed: 50,
	showCursor: false,
	backDelay: 0
});
fairytaleText.stop(); */
let fairytaleText;

window.addEventListener('hashchange', () => {
	let hash = window.location.hash.substring(1);
	if (hash) {
		let params = hash.split('/');
		if (params[1]) {
			switch (params[0]) {
				case 'fairytale': {
					console.log('fairytale', params[1]);
					$map.style.display = 'none';
					$start.style.display = 'none';
					$logo.style.display = 'none';
					$authorsBtn.style.display = 'none';
					$team.style.display = 'none';
					$fairytalePage.style.display = 'block';
					$fairytaleText.innerHTML = '';
					if (player) player.loadVideoById(mythVideo);
					soundWidget.bind(SC.Widget.Events.READY, () => {
						playSound(mythAudio, false, () => {
							/* if ( ! fairytaleTextTypeStarted) {
								fairytaleTextTypeStarted = true;
								setTimeout(() => {
									fairytaleText.start();
								}, 1000);
							}
							else fairytaleText.reset(); */
							$fairytaleText.innerHTML = document.getElementById(params[1]).innerHTML;
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
					$btnMap.style.display = 'block';
					initFullscreenInBtn();
				}; break;
			}
		}
		else {
			switch (params[0]) {
				case 'map': {
					$authorsBtn.style.display = 'inline-block';
					$map.style.display = 'block';
					$logo.style.display = 'block';
					$logo.style.width = 'initial';
					$logo.style.left = '20px';
					$start.style.display = 'none';
					$team.style.display = 'none';
					$btnMap.style.display = 'none';
					$btnMapMenu.style.display = 'none';
					if (player) player.stopVideo();
					initFullscreenInBtn();
					soundWidget.bind(SC.Widget.Events.READY, () => {
						soundWidget.getCurrentSound((sound) => {
							if (sound.id != 499380882) playSound('499380882', true);
						});
					});
					$musicToggleBtn.style.display = 'block';
					$musicToggleBtn.innerText = 'Выкл. музыку';
				}; break;
				case 'team': {
					$team.style.display = 'block';
					$btnMapMenu.style.display = 'inline-block';
					$authorsBtn.style.display = 'none';
					$logo.style.display = 'none';
					$map.style.display = 'none';
					$start.style.display = 'none';
					$fairytalePage.style.display = 'none';
					$btnMap.style.display = 'none';
					if (player) player.stopVideo();
					initFullscreenInBtn();
					soundWidget.bind(SC.Widget.Events.READY, () => {
						soundWidget.getCurrentSound((sound) => {
							if (sound.id != 504406362) playSound('504406362', true);
						});
					});
					$musicToggleBtn.style.display = 'block';
					$musicToggleBtn.innerText = 'Выкл. музыку';
					$team.style.top = window.innerHeight + 'px';
					setTimeout(teamAnimation, 3000);
				}; break;
			}
		}
	}
	else {
	}
});
window.dispatchEvent(new CustomEvent('hashchange'));

$loading.style.display = 'none';

Array.from(document.getElementsByClassName('team-profile')).forEach((element) => {
	let oldPhoto;
	element.addEventListener('mouseover', () => {
		oldPhoto = element.querySelector('img').src;
		element.querySelector('img').src =  element.dataset.photo;
	});
	element.addEventListener('mouseout', () => {
		element.querySelector('img').src = oldPhoto;
	});
});