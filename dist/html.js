
// Compatibility shim
navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

//cria um ID
var id = Math.floor((Math.random() * 1000) + 100);

// PeerJS object
var peer = new Peer(id, { host: 'server-alive.herokuapp.com', secure: true, port: 443, key: 'peerjs', debug: 3 });

peer.on('open', function () {
	console.log("index.html >> on open socket...");
	$('#my-id').text(peer.id);
});

// Receiving a call
peer.on('call', function (call) {
	call.answer(window.localStream);
	step3(call);
});

peer.on('error', function (err) {
	alert(err.message);
	step1();
	step2();
});

// Click handlers setup
$(function () {
	$('#make-call').click(function () {
		var call = peer.call($('#callto-id').val(), window.localStream);
		step3(call);
	});

	$('#end-call').click(function () {
		window.existingCall.close();
		step1();
		step2();
	});

	// Get things started
	step1();
	step2();
});

function step1() {

	// Get audio/video stream
	navigator.getUserMedia({ audio: true, video: true }, function (stream) {

		var video = document.createElement('video');
		video.muted = 'muted';
		video.srcObject = stream;

		$('#my-video').replaceWith(video);
		video.play();

		window.localStream = stream;
		step2();
	}, function () {});
}

function step2() {
	$('#step1, #step3').hide();
	$('#step2').show();
}

function step3(call) {

	// Hang up on an existing call if present
	if (window.existingCall) {
		window.existingCall.close();
	}

	// Wait for stream on the call, then set peer video display
	call.on('stream', function (stream) {
		var video = document.createElement('video');
		video.srcObject = stream;
		$('#their-video').replaceWith(video);
		video.play();
	});

	// UI stuff
	window.existingCall = call;
	call.on('close', step2);
	$('#step1, #step2').hide();
	$('#step3').show();
}

