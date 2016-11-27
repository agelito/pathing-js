var global_canvas;
var global_context;
var global_grid;
var global_path = {};

var global_pathfind_init = path_dijkstra_init;
var global_pathfind_search = path_dijkstra_search;

function find_path(start, end, grid) {
	var pathInitBegin = performance.now();
	var pathfind_data = global_pathfind_init(grid);
	var pathSearchBegin = performance.now();
	var path = global_pathfind_search(pathfind_data, start, end);
	var pathSearchEnd = performance.now();

	var pathFindTotalTime = (pathSearchEnd - pathInitBegin);
	var pathFindInitTime = (pathSearchBegin - pathInitBegin);
	var pathFindSearchTime = (pathSearchEnd - pathSearchBegin);

	var statsText = "[" + start.x + ", " + start.y + "] -> [" + end.x + ", " + end.y + "]" + "<br /><br />";
	statsText += "init path:<br /> " + pathFindInitTime + "ms" + "<br /><br />";
	statsText += "search path:<br/> " + pathFindSearchTime + "ms" + "<br />";
	document.getElementById("path-find-stats").innerHTML = statsText;

	return path;
}

function find_path_performance_test(grid, count) {
	var totalInitTime = 0;
	var totalSearchTime = 0;
	var totalTime = 0;

	var totalPathLength = 0;

	var pathResult = [];
	
	for(var i = 0; i < count; i++) {
		var start = {x: Math.floor(Math.random() * grid.cols), y: Math.floor(Math.random() * grid.rows)};
		var end = {x: Math.floor(Math.random() * grid.cols), y: Math.floor(Math.random() * grid.rows)};

		var pathInitBegin = performance.now();
		var pathfind_data = global_pathfind_init(grid);
		var pathSearchBegin = performance.now();
		var path = global_pathfind_search(pathfind_data, start, end);
		var pathSearchEnd = performance.now();

		totalPathLength += path.length;
		pathResult = pathResult.concat(path);

		var pathFindTotalTime = (pathSearchEnd - pathInitBegin);
		var pathFindInitTime = (pathSearchBegin - pathInitBegin);
		var pathFindSearchTime = (pathSearchEnd - pathSearchBegin);

		totalInitTime += pathFindInitTime;
		totalSearchTime += pathFindSearchTime;
		totalTime += pathFindTotalTime;
	}

	var statsText = "[performance test<br /> (" + count + ") iterations]<br /><br />";
	statsText += "init path:<br /> " + (totalInitTime / count) + "ms" + "<br />";
	statsText += totalInitTime + "ms" + "<br /><br />";
	statsText += "search path:<br/> " + (totalSearchTime / count) + "ms" + "<br />";
	statsText += totalSearchTime + "ms" + "<br /><br />";
	statsText += "avg path length:<br />" + (totalPathLength / count) + "<br /><br />";
	document.getElementById("path-find-stats").innerHTML = statsText;
	
	return pathResult;
}

function do_benchmark() {
	global_path.path = find_path_performance_test(global_grid, 200);

	redraw_canvas();
}

function do_clear() {
	grid_set_all_nodes(global_grid, NODE_FLOOR);
	global_path.path = [];
	global_path.start = null; 
	global_path.end = null;
	
	redraw_canvas();	
}

function handle_input_event(grid, e, buttonDown, buttonUp){
	var canvas_coordinates = canvas_input_coordinate(global_canvas, e);

	if(e.buttons != 0) {
		var node_coordinates = grid_node_coordinates(canvas_coordinates, grid);
		var current_node_type = grid_get_node(canvas_coordinates, grid);

		var node_type = current_node_type; 
		if(e.buttons == 1) {
			if(current_node_type != NODE_FLOOR) {
				node_type = NODE_FLOOR;
			} else if(buttonDown) {
				if(!global_path.start) {
					global_path.start = node_coordinates; 
				} else if(!global_path.end) {
					global_path.end = node_coordinates; 

					global_path.path = find_path(global_path.start, global_path.end, global_grid); 
					global_path.start = null;
					global_path.end = null;

					redraw_canvas();
				} 
			}
		}
		
		if(e.buttons == 2 && current_node_type != NODE_WALL) {
			node_type = NODE_WALL;
		}

		if(node_type != current_node_type) {
			grid_set_node(canvas_coordinates, grid, node_type);
			global_path = {};
			redraw_canvas();
		}
	}
}

function set_pathing_algorithm(algorithm) {
	if(algorithm == "astar") {
		global_pathfind_init = path_astar_init;
		global_pathfind_search = path_astar_search;
	} else if(algorithm == "dijkstra") {
		global_pathfind_init = path_dijkstra_init;
		global_pathfind_search = path_dijkstra_search;
	} else {
		console.log("algorithm: " + algorithm + " not supported.");
	}
}

function update_content_size() {
	var contentWrapper = document.getElementById("content-wrapper");
	var contentHeight = Math.max(document.documentElement.clientHeight, window.innerHeight || 0) - contentWrapper.offsetTop;

	contentWrapper.style.height = contentHeight + "px";

	var padding = 32;

	var content = document.getElementById("content");
	content.style.height = contentHeight - padding + "px"; 

	var contentWidth = (contentWrapper.offsetWidth - padding); 
	var canvasSize = Math.min(contentWidth, (contentHeight - padding));

	content.style.width = canvasSize + "px";

	var settings = document.getElementById("settings");
	settings.style.height = contentHeight - padding + "px";
	var settingsWidth = (contentWidth - canvasSize - (padding * 2));	
	if(settingsWidth > 300) settingsWidth = 300;
	settings.style.width =  settingsWidth + "px";

	var canvas = document.getElementById("path-view");

	canvas.width = canvasSize;
	canvas.height = canvasSize;
}

function pathing_init(canvas) {
	global_canvas = canvas; 
	global_context = global_canvas.getContext("2d");

	update_content_size();

	window.onresize = (event) => {
		update_content_size();
		redraw_canvas();
	};

	document.onready = () => {
		redraw_canvas();
	};

	global_canvas.oncontextmenu = (e) => {
		return false;
	};

	var algorithm_radios = document.settings.algorithm;
	for(var ri = 0; ri < algorithm_radios.length; ri++) {
		if(algorithm_radios[ri].checked) {
			set_pathing_algorithm(algorithm_radios[ri].value);
		}
	}

	global_grid = grid_create(45, 45);

	global_canvas.onmousemove = (e) => {
		handle_input_event(global_grid, e, false, false);
	};
	global_canvas.onmousedown= (e) => {
		handle_input_event(global_grid, e, true, false);
	};
	global_canvas.onmouseup= (e) => {
		handle_input_event(global_grid, e, false, true);
	};

	redraw_canvas();
}

function canvas_clear() {
	var width = global_canvas.width;
	var height = global_canvas.height;

	global_context.clearRect(0, 0, width, height);
}

function redraw_canvas() {
	canvas_clear();

	render_grid(global_grid);

	if(global_path.path) {
		render_path(global_grid, global_path.path);
	}
}

