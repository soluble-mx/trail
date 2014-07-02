
//////////////////////////////////////
//				MAIN				//
//////////////////////////////////////

$(document).ready(function() {

	// Ocultamos los canvas y el timer
	$("canvas").hide();
	$("#timer_container").hide();
	$("#winner_face").hide();
	$("#diseno_procedural").hide();
	$("#loser_face").hide();

	$(".boton").hide();

	/*****************************
	 *      INICIA SONIDO         *
	 *****************************/

	init_trail_sound();

	/*****************************
	 *   INICIA LOGICA Y RENDER   *
	 *****************************/

	// Iniciamos processing
	pApplet_juego  = new Processing (  $("#juego_canvas")[0],  juegoSketch );
	pApplet_juego.noLoop();
	pApplet_patron = new Processing ( $("#patron_canvas")[0], patronSketch );
	pApplet_patron.noLoop();

	/*****************************
	 * CONFIGURAMOS LOS EVENTOS  *
	 *****************************/
	
	// Click sobre la portada
	$("#portada").click( function() {
		// Ocultamos la portada y mostramos los canvas
		$(this).hide();
		$(".boton").show();
		$("canvas").fadeIn(400, function() {
			pApplet_juego.loop();
			pApplet_patron.loop();

			$("#timer_container").show();
		});
	});

	// Click sobre el toggle del grid
	$("#onOffGrid").click( function() {
		renderGrid = !renderGrid;
 	});

 	// Click sobre el boton de resetear patrón
	$("#resetPattern").click( function() {
		resetGame();
	});

	var procedural = false;
	$("#procedural_toggle").click( function() {
		procedural = !procedural;
		if(procedural) {
			$("canvas").hide();
			$("#diseno_procedural").show();

			pApplet_juego.noLoop();
			pApplet_patron.noLoop();
			$("#timer_container").hide();
		} else {
			$("canvas").show();
			$("#diseno_procedural").hide();
			
			pApplet_juego.loop();
			pApplet_patron.loop();
			$("#timer_container").show();
		}
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

 	$(".b_grid").click( function(){
 		$(".b_grid").attr("src", $(this).attr("out") )
 		$(this).attr("src", $(this).attr("click") )
 	})

});
