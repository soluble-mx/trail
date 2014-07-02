
// Los dos processings
var pApplet_juego;
var pApplet_patron;

// Modulos
var module = new Array(16);
var modulesLoaded = false;

var tileSize = 101;
var tiles;

// Resolucion del patron
var resPatternX, resPatternY;

// Patron objetivo
var target;
var targetLoaded = false;

// Dificultad
var difficulty = 1;

// Timer
var timerProgress = 1;
var timer = 0;

// Ganador
var winner = false;

// Malla o no
var renderGrid = false;

//////////////////////////////////
//			PATRON SKECTH		//
//			 PROCESSING			//
//////////////////////////////////

var resolutionXPattern = 0;
var resolutionYPattern = 0;

/*
 * patronSketch:
 *   Sketch de ProcessingJS que se encarga de
 * generar y dibujar el patrón objetivo del juego.
 */
function patronSketch(processing) {

	processing.setup = function() {
		processing.size(404, 404);

		resolutionXPattern = processing.floor(processing.width  / tileSize);
		resolutionYPattern = processing.floor(processing.height / tileSize);

		resetPattern(resolutionXPattern, resolutionYPattern, processing);

		// Hasta que todos los modulos esten generados
		while(!modulesLoaded) {}
	}

	processing.draw = function() {
		processing.background(0xE82239);
		processing.fill(232,34,57);
		processing.noStroke();
		drawModules(processing, target);

		if (renderGrid) {
			processing.noFill();
			processing.stroke(232, 34, 57);

			processing.rectMode(processing.CORNER);
			for (var i = 0; i < resolutionXPattern; i++) {
				for (var j = 0; j < resolutionYPattern; j++) {
					processing.rect(i * tileSize, j * tileSize, tileSize, tileSize);
				}
			}
		}
	}

}

//////////////////////////////////
//			JUEGO SKECTH		//
//			 PROCESSING			//
//////////////////////////////////

// Resolucion 
var resolutionXGame = 0;
var resolutionYGame = 0;

/*
 * juegoSketch:
 *   Sketch de ProcessingJS que se encarga de
 * la lógica del juego, así como de checar el timer.
 */
function juegoSketch(processing) {

	/*
	 * setup:
	 *   Función setup de este sketch.
	 */
	processing.setup = function() {
		processing.size(404, 404);

		resolutionXGame = processing.floor(processing.height / tileSize);
		resolutionYGame = processing.floor(processing.height / tileSize);

		// Load Shapes
		for (var i = 0; i < module.length; i++) {
			module[i] = processing.loadShape("data/" + processing.nf(i, 2) + ".svg");
			module[i].disableStyle();
		}
		modulesLoaded = true;

		// Init tiles
		tiles = new Array();
		for (var i = 0; i < resolutionXGame; i++) {
			tiles[i] = new Array();
			for (var j = 0; j < resolutionYGame; j++) {
				tiles[i][j] = 0;
			}
		}
	};

	/*
	 * draw:
	 *   Función draw de este sketch.
	 */
	processing.draw = function() {
		processing.background(0x90D0AE);
		
		processing.fill(0,208,174); 
		processing.noStroke();

		drawModules(processing, tiles);

		if (renderGrid) {
			processing.noFill();
			processing.stroke(0, 208, 174);

			processing.rectMode(processing.CORNER);
			for (var i = 0; i < resolutionXGame; i++) {
				for (var j = 0; j < resolutionYGame; j++) {
					processing.rect(i * tileSize, j * tileSize, tileSize, tileSize);
				}
			}
		}

		if(!winner) {			
			if(timer >= $("#timer_container").width()) {
				winner = true;

				// Mostramos la carita feliz
				$("#loser_face").show();

				setTimeout(function() {
					// Reseteamos el grid
					tiles = new Array();
					for (var i = 0; i < resolutionXGame; i++) {
						tiles[i] = new Array();

						for (var j = 0; j < resolutionYGame; j++) {
							tiles[i][j] = 0;
						}
					}

					// Reseteamos el patron
					resetPattern(resolutionXPattern, resolutionYPattern, pApplet_patron);

					// Ocultamos la carita feliz
					$("#loser_face").hide();

					// Reseteo de timmer
					timer = 0;

					// Empieza de nuevo
					winner = false;

					// cambiamos la nota 
					noteA = Math.round( Math.random() * 10 );
				}, 2500);
			} else {
				// Actualizamos el temporizador
				timer += timerProgress;

				$("#timer_juego").css({
					"width" : timer + "px"
				});
			}
		}
	};

	/*
	 * mouseDragged:
	 *   Evento de mouse arrastrado sobre este sketch.
	 */
	processing.mouseDragged = function() {
		if(processing.mouseButton == processing.LEFT) {
			setTile(processing.mouseX, processing.mouseY);
		} else {
			unsetTile(processing.mouseX, processing.mouseY);
		}
	}

	/*
	 * setTile:
	 *   Coloca un azulejo y manda a tocar un sonido
	 *  si es necesario.
	 */
	function setTile(mX, mY) {
		if(!winner) {
			var pos_x = processing.floor(mX / tileSize);
			var pos_y = processing.floor(mY / tileSize);

			// Solo tocamos cuando vamos a poner 1
			if(tiles[pos_x][pos_y] == 0) {
				var binaryResult = getBinaryNeighborhood(tiles, pos_x, pos_y);
				var decimalResult = processing.unbinary(binaryResult);

				composition();
			}

			tiles[pos_x][pos_y] = 1;

			// Verificamos el juego
			verifyGame();
		} else {
			return;
		}
	}

	/*
	 * unsetTile:
	 *   Quita azulejo y manda a tocar un sonido
	 *  si es necesario.
	 */
	function unsetTile(mX, mY) {
		if(!winner) {
			var pos_x = processing.floor(mX / tileSize);
			var pos_y = processing.floor(mY / tileSize);

			// Solo tocamos cuando vamos a quitar 1
			if(tiles[pos_x][pos_y] == 1) {
				composition();
			}

			tiles[pos_x][pos_y] = 0;

			// Verificamos el juego
			verifyGame();
		} else {
			return;
		}
	}
}

//////////////////////////////////
//		FUNCIONES AUXILIARES	//
//////////////////////////////////


/*
 * verifyGame:
 *   Verifica el Juego
 */
function verifyGame() {
	if(matchGrids(tiles, target)) {
		winner = true;

		// Mostramos la carita feliz
		$("#winner_face").show();

		setTimeout(function() {

			// Aumentamos la dificultad
			difficulty++;

			// Reseteamos el grid
			tiles = new Array();
			for (var i = 0; i < resolutionXGame; i++) {
				tiles[i] = new Array();

				for (var j = 0; j < resolutionYGame; j++) {
					tiles[i][j] = 0;
				}
			}

			// Reseteamos el patron
			resetPattern(resolutionXPattern, resolutionYPattern, pApplet_patron);

			// Ocultamos la carita feliz
			$("#winner_face").hide();

			// Reseteo de timmer
			timer = 0;

			// Empieza de nuevo
			winner = false;

			// cambiamos la nota 
			noteA = Math.round( Math.random() * 10 );
		}, 2500);
	}
}

/*
 * resetPattern:
 *   Resetea el patrón (y el juego)
 */
function resetPattern(resX, resY, processing) {
	// Incrementa en 2 por cada nivel de dificultad
	var n = difficulty * 2;

	// Se crea el patron
	target = generatePattern(resX, resY, processing, n);
	targetLoaded = true;

	timer = 0;
}

function resetTileSize(newTileSize) {
	tileSize = newTileSize;

	// Seteamos las resoluciones
	resolutionXPattern = pApplet_patron.floor(pApplet_patron.width  / tileSize);
	resolutionYPattern = pApplet_patron.floor(pApplet_patron.height / tileSize);

	resolutionXGame = pApplet_juego.floor(pApplet_juego.height / tileSize);
	resolutionYGame = pApplet_juego.floor(pApplet_juego.height / tileSize);

	// Genera un patron
	tiles = new Array();
	for (var i = 0; i < resolutionXGame; i++) {
		tiles[i] = new Array();
		for (var j = 0; j < resolutionYGame; j++) {
			tiles[i][j] = 0;
		}
	}

	resetGame();
}

/*
 * resetGame:
 *   Resetea el juego.
 */
function resetGame() {
	// Reseteamos el grid
	tiles = new Array();
	for (var i = 0; i < resolutionXGame; i++) {
		tiles[i] = new Array();
		for (var j = 0; j < resolutionYGame; j++) {
			tiles[i][j] = 0;
		}
	}
	
	// Se crea el patron
	target = generatePattern(resolutionXPattern, resolutionYPattern, pApplet_patron, difficulty);
	targetLoaded = true;

	timer = 0;

	winner = false;
}

/*
 * drawModules:
 *   Dibuja los azulejos como deben de ir
 *  en relación de sus vecinos.
 */
function drawModules(processing, grid) {
	processing.shapeMode(processing.CORNER);

	var w = grid.length;
	for (var i = 0; i < w; i++) {

		var h = grid[i].length;
		for (var j = 0; j < h; j++) {

			if(grid[i][j] == 1) {
				var binaryResult = getBinaryNeighborhood(grid, i, j);
				var decimalResult = processing.unbinary(binaryResult);
				var posX = tileSize * i;
				var posY = tileSize * j;

				processing.shape(module[decimalResult], posX, posY, tileSize, tileSize);
			}
		}
	}
}

/*
 * getBinaryNeighborhood:
 *    Regresa una cadena de un numero binario
 *  dependiendo de los vecinos de la celda indicada.
 *     Norte   Oeste   Sur   Este
 *      0|1     0|1    0|1   0|1
 */
function getBinaryNeighborhood(grid, i, j) {
	var w = grid.length;
	var h = grid[0].length;

	var binaryResult = "";

	// Norte
	if ((j - 1) < 0 || grid[i][j - 1] == undefined) {
		binaryResult = "0";
	} 
	else {
		binaryResult = ("" + grid[i][j - 1]);
	}

	// Oeste
	if ((i - 1) < 0 || grid[i - 1][j] == undefined) {
		binaryResult += "0";
	} 
	else {
		binaryResult += ("" + grid[i - 1][j]);
	}

	// Sur
	if ((j + 1) >= h || grid[i][j + 1] == undefined) {
		binaryResult += "0";
	} 
	else {
		binaryResult += ("" + grid[i][j + 1]);
	}

	// Este
	if ((i + 1) >= w || grid[i + 1][j] == undefined) {
		binaryResult += "0";
	} 
	else {
		binaryResult += ("" + grid[i + 1][j]);
	}

	return binaryResult;
}

/*
 * generatePattern:
 *   Genera un patron aleatorio.
 */
function generatePattern(w, h, processing, n) {
	// Inicializamos el patron
	var pattern = new Array();
	for (var i = 0; i < w; i++) {
		pattern[i] = new Array();
		for (var j = 0; j < h; j++) {
			pattern[i][j] = 0;
		}
	}

	// Punto de inicio
	var pos_x = processing.floor(w / 2);
	var pos_y = processing.floor(h / 2);

	for (var i = 0; i < n; i++) {
		var new_pos = processing.floor(processing.random(0, 4));
		
		switch(new_pos) {
			case 0:
				if((pos_y - 1) >= 0) {
					if(pattern[pos_x][pos_y - 1] == 0) {
						pattern[pos_x][pos_y - 1] = 1;

						pos_y = pos_y - 1;
					}
				}
				break;

			case 1:
				if((pos_x - 1) >= 0) {
					if(pattern[pos_x - 1][pos_y] == 0) {
						pattern[pos_x - 1][pos_y] = 1;

						pos_x = pos_x - 1;
					}
				}
				break;

			case 2:
				if((pos_y + 1) < h) {
					if(pattern[pos_x][pos_y + 1] == 0) {
						pattern[pos_x][pos_y + 1] = 1;

						pos_y = pos_y + 1;
					}
				}
				break;

			case 3:
				if((pos_x + 1) < w) {
					if(pattern[pos_x + 1][pos_y] == 0) {
						pattern[pos_x + 1][pos_y] = 1;

						pos_x = pos_x + 1;
					}
				}
				break;
		}
	}

	composition();
	return pattern;
}

/*
 * matchGrids:
 *   Checa el match de dos grids.
 */
function matchGrids(grid1, grid2) {
	// Bounding box
	var l1 = grid1.length;
	var r1 = 0;
	var t1 = grid1[0].length;
	var b1 = 0;
	var l2 = grid2.length;
	var r2 = 0;
	var t2 = grid2[0].length;
	var b2 = 0;

	// Determinando los dos bounding box
	for (var i = 0; i < grid1.length; i++) {
		for (var j = 0; j < grid1[i].length; j++) {
			if(grid1[i][j] == 1) {
				if(i < l1) {
					l1 = i;
				}
				if(i > r1) {
					r1 = i;
				}

				if(j < t1) {
					t1 = j;
				}
				if(j > b1) {
					b1 = j;
				}
			}
		}
	}

	for (var i = 0; i < grid2.length; i++) {
		for (var j = 0; j < grid2[i].length; j++) {
			if(grid2[i][j] == 1) {
				if(i < l2) {
					l2 = i;
				}
				if(i > r2) {
					r2 = i;
				}

				if(j < t2) {
					t2 = j;
				}
				if(j > b2) {
					b2 = j;
				}
			}
		}
	}

	// Sacando la anchura y la altura
	var w1 = r1 - l1, w2 = r2 - l2;
	var h1 = b1 - t1, h2 = b2 - t2;

	// Checando que sean positivos
	if(w1 < 0 || w2 < 0 || h1 < 0 || h2 < 0) {
		return false;
	}

	if(w1 == w2 && h1 == h2) {
		for (var i = 0; i <= w1; i++) {
			for (var j = 0; j <= h1; j++) {
				if(grid1[i + l1][j + t1] != grid2[i + l2][j + t2]) {
					return false;
				}
			}
		}
	} else {
		return false;
	}
	
	return true;
}
