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

  	// tonos
	var instrumento = 32;
	
	timbre.soundfont.setInstrument(instrumento);

	for (octava = 0; octava < 10; octava++) {
		for (note = 0; note < 12; note++) {
			timbre.soundfont.preload(matrizOctavesNotes[octava]);
		}
	}
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

	if(BrowserDetect.browser != "Safari") {
		timbre.soundfont.play(matrizOctavesNotes[octava][noteA], false);
	}
}