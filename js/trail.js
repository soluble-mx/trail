
//////////////////////////////////////
//				MAIN				//
//////////////////////////////////////

$(document).ready(function() {

	// Ocultamos los canvas
	$("canvas").hide();

	/*****************************
	 *      INICIA SONIDO         *
	 *****************************/

	init_trail_sound();

	/*****************************
	 *   INICIA LOGICA Y RENDER   *
	 *****************************/

	// Iniciamos processing
	pApplet_juego  = new Processing (  $("#juego_canvas")[0],  juegoSketch );
	pApplet_patron = new Processing ( $("#patron_canvas")[0], patronSketch );

	/*****************************
	 * CONFIGURAMOS LOS EVENTOS  *
	 *****************************/
	
	// Click sobre la portada
	$("#portada").click( function() {
		// Ocultamos la portada y mostramos los canvas
		$(this).fadeOut();
		$("canvas").fadeIn();
	});

	// Click sobre el toggle del grid
	$("#onOffGrid").click( function() {
		renderGrid = !renderGrid;
 	});

 	// Click sobre el boton de resetear patrón
	$("#resetPattern").click( function() {
		resetGame();
	});

	$("#grid4").click( function() {
		resetTileSize(101);
 	});

 	$("#grid8").click( function() {
 		resetTileSize(51);
 	});

 	$("#grid16").click( function() {
 		resetTileSize(25);
 	});

});
