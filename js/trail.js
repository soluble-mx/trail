
//////////////////////////////////////
//				MAIN				//
//////////////////////////////////////

$(document).ready(function() {

	// Ocultamos los canvas y el timer
	$("canvas").hide();
	$("#nav_incompatible").hide();
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
		if ( renderGrid ) {
			$(this).attr("src", $(this).attr("click") );
		} else {
			$(this).attr("src", $(this).attr("out"));
		}
 	});

 	// Click sobre el boton de resetear patrón
	$("#resetPattern").click( function() {
		resetGame();
	});

	var procedural = false;
	$("#procedural_toggle").click( function() {
		procedural = !procedural;
		var thisObj = this;
		if(procedural) {
			$("canvas").hide();
			$("#diseno_procedural").show();

			pApplet_juego.noLoop();
			pApplet_patron.noLoop();
			$("#timer_container").hide();
			$(thisObj).attr("src", $(thisObj).attr("click") );
		} else {
			$("canvas").show();
			$("#diseno_procedural").hide();
			
			pApplet_juego.loop();
			pApplet_patron.loop();
			$("#timer_container").show();
			$(thisObj).attr("src", $(thisObj).attr("out"));
		}
 	});	

	$("#grid4").click( function() {
		resetTileSize(101);
 	});

 	$("#grid8").click( function() {
 		resetTileSize(44.8);
 	});

 	$("#grid16").click( function() {
 		resetTileSize(23.7);
 	});

 	$(".b_grid").click( function(){
 		var that = this;
 		$(".b_grid").each(function() {
 			if(that == this) {
 				$(this).attr("src", $(this).attr("click") );
 			} else {
				$(this).attr("src", $(this).attr("out"));
 			}
 		});
 	})

});
