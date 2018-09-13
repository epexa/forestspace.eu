initHtmlElements([ '#start', '#video', '#map', '#fairytale-page', '#sound', '#btn-map', '#fullscreen-in-btn', '#fullscreen-out-btn' ]);

let player;
let introVideo = true;
let loaded = false;
let loadVideoById;
var onYouTubeIframeAPIReady = () => {
	player = new YT.Player($video, {
		events: {
			onReady: (event) => {
				if (loadVideoById) player.loadVideoById(loadVideoById);
				event.target.playVideo();
				//event.target.setPlaybackQuality('hd1080');
			},
			onStateChange: (event) => {
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
						$sound.style.display = 'block';
					}
					else player.playVideo();
				}
			}
		}
	});
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
		document.getElementById('loader').addEventListener('click', () => {
			//loader.reset().play();
			$start.style.display = 'none';
			loaded = true;
			player.playVideo();
			fullScreen();
			$fairytalePage.style.display = 'none';
			$sound.style.display = 'none';
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

var initMap = () => {
	const map = new google.maps.Map($map, {
		center: { lat: 52.68400095664496, lng: 23.93218827226301 },
		zoom: 16,
		mapTypeId: 'satellite',
		mapTypeControl: false,
		fullscreenControl: false,
		streetViewControl: false,
		zoomControl: false
	});
	map.data.loadGeoJson('fairytales.json');
	map.data.setStyle(feature => {
		return {
			icon: {
				url: `img/icon_${feature.getProperty('name')}.png`,
				scaledSize: new google.maps.Size(64, 64)
			}
		};
	});
	map.data.addListener('click', event => {
		const name = event.feature.getProperty('name');
		//const position = event.feature.getGeometry().get();
		window.location.hash = 'fairytale/' + name;
	});
}

let fairytaleTextTypeStarted = false;
const fairytaleText = new Typed('#fairytale-text-output', {
	stringsElement: '#fairytale-text',
	typeSpeed: 50,
	showCursor: false,
	backDelay: 0
});
fairytaleText.stop();

$start.addEventListener('mouseover', () => {
	SC.Widget('sound').play();
});

let soundParams = {
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
		SC.Widget('sound').play();
	}
};

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
					$fairytalePage.style.display = 'block';
					loadVideoById = 'UhN744j0jvQ';
					if (player) player.loadVideoById(loadVideoById);
					SC.Widget('sound').load('https://api.soundcloud.com/tracks/498936516?secret_token=s-fWkrC&color=%232A9FD6', soundParams);
					$btnMap.style.display = 'block';
					if ( ! fairytaleTextTypeStarted) {
						fairytaleTextTypeStarted = true;
						setTimeout(() => {
							fairytaleText.start();
						}, 1000);
					}
					else fairytaleText.reset();
					initFullscreenInBtn();
				}; break;
			}
		}
		else {
			switch (params[0]) {
				case 'map': {
					$map.style.display = 'block';
					$start.style.display = 'none';
					$btnMap.style.display = 'none';
					if (player) player.stopVideo();
					initFullscreenInBtn();
					SC.Widget('sound').load('https://api.soundcloud.com/playlists/602264412%3Fsecret_token%3Ds-7lP7c&color=%232A9FD6', soundParams);
				}; break;
			}
		}
	}
	else {
	}
});
window.dispatchEvent(new CustomEvent('hashchange'));