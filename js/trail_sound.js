// 11 octavas y 12 notas, la matriz de octavas es modulo de 12
var matrizOctavesNotes = new Array(11);
var indexContinueNotes = 0;

for (var oc = 0; oc < 11; oc++) {
	matrizOctavesNotes[oc] = new Array(12);
	for (note = 0; note < 12; note++) {
		matrizOctavesNotes[oc][note] = indexContinueNotes;
		indexContinueNotes++;
	}
}

var noteA = 2;
var octava = 4;

function init_trail_sound() {

	// back
	var pattern = new sc.Pshuf(sc.series(120), Infinity);
	var scale   = new sc.Scale.major();
	
	// acordes
	var chords  = [
	  [0, 1, 4], [0, 1, 5], [0, 1, 6],
	  [0, 2, 6], [0, 2, 5], [0, 2, 4],
	  [0, 3, 6], [0, 3, 5], [0, 3, 4]
	];
	
	var msec = timbre.timevalue("BPM120 L4");
	var osc  = T("saw");
	var env  = T("env", {table:[0.2, [1, msec * 48], [0.2, msec * 16]]});
	var gen  = T("OscGen", {osc:osc, env:env, mul:0.2});

	var pan   = T("pan", gen);
	var synth = pan;

	synth = T("+saw", {freq:(msec * 2)+"ms", add:0.5, mul:0.5}, synth);
	synth = T("lpf" , {cutoff:800, Q:12}, synth);
	synth = T("reverb", {room:0.95, damp:0.1, mix:0.75}, synth);

	/*T("interval", {interval:msec * 64}, function() {
	  	var root = pattern.next();
	  	chords.choose().forEach(function(i) {
	    	gen.noteOn(scale.wrapAt(root + i) +60, 80); 
	  	});
	  	pan.pos.value = Math.random() * 2 - 1;
  	}).set({buddies:synth}).start();*/

  	// tonos
	var instrumento = 32;
	
	timbre.soundfont.setInstrument(instrumento);

	for (octava = 0; octava < 10; octava++) {
		for (note = 0; note < 12; note++) {
			timbre.soundfont.preload(matrizOctavesNotes[octava]);
		}
	}
	
	$( document ).keydown(function(e) {
		noteA = Math.round( Math.random()*10 )
	});

}

function composition() {
	var deltaOctava = Math.round( Math.random() );
	if (deltaOctava == 1) {
		if ( octava < 8 ) { 
			octava++;
		} else {
			octava--;
		}
	} else{
		if ( octava > 3 ) {
			octava--;
		} else {
			octava++;
		}
	}

	timbre.soundfont.play(matrizOctavesNotes[octava][noteA]);
}