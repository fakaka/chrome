var _audioPlayer = function () {
	var audio = document.createElement('audio');
	audio.setAttribute('controls', 'controls');
	audio.style.display = 'none';
	document.body.appendChild(audio);
	return audio;
};

var _audio = _audioPlayer();

function _playSound(url) {
	_stopSound();
	_audio.setAttribute('src', url);
	_audio.play();
}

function _stopSound() {
	if (_audio.pause) {
		_audio.pause();
		_audio.currentTime = 0;
	}
}

var playAudio = function () {
	_playSound(arguments[0]);
};

var stopAudio = function () {
	_stopSound();
};