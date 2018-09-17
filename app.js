if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i ['test'](navigator['userAgent'])) {
	$('#video')['css']({
		"\x64\x69\x73\x70\x6C\x61\x79": 'none'
	})
};
$(window)['load'](function() {
	$('.loader-icon')['delay'](500)['fadeOut']();
	$('#page-loader')['delay'](700)['fadeOut']('slow');
	setTimeout(function() {
		$('.social-icons')['delay'](1000)['css']({
			display: 'none'
		})['fadeIn'](1000);
		$('.actions')['delay'](1000)['css']({
			display: 'none'
		})['fadeIn'](1000);
		$('hr')['delay'](1000)['css']({
			display: 'none'
		})['fadeIn'](1000);
		$('p')['delay'](1000)['css']({
			display: 'none'
		})['fadeIn'](1000);
		$('.logo img')['delay'](1200)['css']({
			display: 'none'
		})['fadeIn'](1200)
	})
});
(function(_0x4e4fx1) {
	'use strict';
	window['sr'] = new scrollReveal({
		reset: true,
		move: '10px',
		mobile: false
	})
})();
$('header')['backstretch']('images/background4.jpg');
$(function() {
	var _0x4e4fx2 = 'Sep 24, 2018 00:00:00';
	$('.countdown')['countdown']({
		date: _0x4e4fx2,
		render: function(_0x4e4fx3) {
			$(this['el'])['html']('<div>' + this['leadingZeros'](_0x4e4fx3['days'], 3) + ' <span>days</span></div><div class=\'border_clock\'>' + this['leadingZeros'](_0x4e4fx3['hours'], 2) + ' <span>hours</span></div><div class=\'border_clock\'>' + this['leadingZeros'](_0x4e4fx3['min'], 2) + ' <span>minutes</span></div><div class=\'border_clock\'>' + this['leadingZeros'](_0x4e4fx3['sec'], 2) + ' <span>seconds</span></div>')
		}
	})
});
var video = $('#video')['data']('video');
var mute = $('#video')['data']('mute');
$('#video').YTPlayer({
	videoId: video,
	mute: mute,
	fitToBackground: true
});
var latitude = 52.5693876,
	longitude = 23.8007901,
	map_zoom = 10;
var is_internetExplorer11 = navigator['userAgent']['toLowerCase']()['indexOf']('trident') > -1;
var marker_url = (is_internetExplorer11) ? 'images/icon-location.png' : 'images/icon-location.png';
var main_color = '#2d313f',
	saturation_value = -20,
	brightness_value = 5;
var style = [{
	elementType: 'labels',
	stylers: [{
		saturation: saturation_value
	}]
}, {
	featureType: 'poi',
	elementType: 'labels',
	stylers: [{
		visibility: 'off'
	}]
}, {
	featureType: 'road.highway',
	elementType: 'labels',
	stylers: [{
		visibility: 'off'
	}]
}, {
	featureType: 'road.local',
	elementType: 'labels.icon',
	stylers: [{
		visibility: 'off'
	}]
}, {
	featureType: 'road.arterial',
	elementType: 'labels.icon',
	stylers: [{
		visibility: 'off'
	}]
}, {
	featureType: 'road',
	elementType: 'geometry.stroke',
	stylers: [{
		visibility: 'off'
	}]
}, {
	featureType: 'transit',
	elementType: 'geometry.fill',
	stylers: [{
		hue: main_color
	}, {
		visibility: 'on'
	}, {
		lightness: brightness_value
	}, {
		saturation: saturation_value
	}]
}, {
	featureType: 'poi',
	elementType: 'geometry.fill',
	stylers: [{
		hue: main_color
	}, {
		visibility: 'on'
	}, {
		lightness: brightness_value
	}, {
		saturation: saturation_value
	}]
}, {
	featureType: 'poi.government',
	elementType: 'geometry.fill',
	stylers: [{
		hue: main_color
	}, {
		visibility: 'on'
	}, {
		lightness: brightness_value
	}, {
		saturation: saturation_value
	}]
}, {
	featureType: 'poi.sport_complex',
	elementType: 'geometry.fill',
	stylers: [{
		hue: main_color
	}, {
		visibility: 'on'
	}, {
		lightness: brightness_value
	}, {
		saturation: saturation_value
	}]
}, {
	featureType: 'poi.attraction',
	elementType: 'geometry.fill',
	stylers: [{
		hue: main_color
	}, {
		visibility: 'on'
	}, {
		lightness: brightness_value
	}, {
		saturation: saturation_value
	}]
}, {
	featureType: 'poi.business',
	elementType: 'geometry.fill',
	stylers: [{
		hue: main_color
	}, {
		visibility: 'on'
	}, {
		lightness: brightness_value
	}, {
		saturation: saturation_value
	}]
}, {
	featureType: 'transit',
	elementType: 'geometry.fill',
	stylers: [{
		hue: main_color
	}, {
		visibility: 'on'
	}, {
		lightness: brightness_value
	}, {
		saturation: saturation_value
	}]
}, {
	featureType: 'transit.station',
	elementType: 'geometry.fill',
	stylers: [{
		hue: main_color
	}, {
		visibility: 'on'
	}, {
		lightness: brightness_value
	}, {
		saturation: saturation_value
	}]
}, {
	featureType: 'landscape',
	stylers: [{
		hue: main_color
	}, {
		visibility: 'on'
	}, {
		lightness: brightness_value
	}, {
		saturation: saturation_value
	}]
}, {
	featureType: 'road',
	elementType: 'geometry.fill',
	stylers: [{
		hue: main_color
	}, {
		visibility: 'on'
	}, {
		lightness: brightness_value
	}, {
		saturation: saturation_value
	}]
}, {
	featureType: 'road.highway',
	elementType: 'geometry.fill',
	stylers: [{
		hue: main_color
	}, {
		visibility: 'on'
	}, {
		lightness: brightness_value
	}, {
		saturation: saturation_value
	}]
}, {
	featureType: 'water',
	elementType: 'geometry',
	stylers: [{
		hue: main_color
	}, {
		visibility: 'on'
	}, {
		lightness: brightness_value
	}, {
		saturation: saturation_value
	}]
}];
var map_options = {
	center: new google['maps'].LatLng(latitude, longitude),
	zoom: map_zoom,
	panControl: false,
	zoomControl: false,
	mapTypeControl: false,
	streetViewControl: false,
	mapTypeId: google['maps']['MapTypeId']['ROADMAP'],
	scrollwheel: false,
	styles: style
};
var map = new google['maps'].Map(document['getElementById']('google-container'), map_options);
var marker = new google['maps'].Marker({
	position: new google['maps'].LatLng(latitude, longitude),
	map: map,
	title: 'Brest, Belarus',
	visible: true,
	icon: marker_url
});
google['maps']['event']['addDomListener'](window, 'resize', function() {
	var _0x4e4fx18 = map['getCenter']();
	google['maps']['event']['trigger'](map, 'resize');
	map['setCenter'](_0x4e4fx18)
});

function CustomZoomControl(_0x4e4fx1a, map) {
	var _0x4e4fx1b = document['getElementById']('zoom-in'),
		_0x4e4fx1c = document['getElementById']('zoom-out');
	_0x4e4fx1a['appendChild'](_0x4e4fx1b);
	_0x4e4fx1a['appendChild'](_0x4e4fx1c);
	google['maps']['event']['addDomListener'](_0x4e4fx1b, 'click', function() {
		map['setZoom'](map['getZoom']() + 1)
	});
	google['maps']['event']['addDomListener'](_0x4e4fx1c, 'click', function() {
		map['setZoom'](map['getZoom']() - 1)
	})
}
var zoomControlDiv = document['createElement']('div');
var zoomControl = new CustomZoomControl(zoomControlDiv, map);
map['controls'][google['maps']['ControlPosition']['LEFT_TOP']]['push'](zoomControlDiv)
