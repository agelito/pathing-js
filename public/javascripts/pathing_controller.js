var global_canvas;
var global_context;
var global_grid;
var global_path = {};

function find_path(start, end, grid) {
	var pathInitBegin = performance.now();
	var dijkstra = path_dijkstra_init(grid);
	var pathSearchBegin = performance.now();
	var path = path_dijkstra_search(dijkstra, start, end);
	var pathSearchEnd = performance.now();

	var pathFindTotalTime = (pathSearchEnd - pathInitBegin);
	var pathFindInitTime = (pathSearchBegin - pathInitBegin);
	var pathFindSearchTime = (pathSearchEnd - pathSearchBegin);
	console.log("(" + start.x + ", " + start.y + ") -> (" + end.x + ", " + end.y + ")");
	console.log("\tinit: " + pathFindInitTime + "ms");
	console.log("\tsearch: " + pathFindSearchTime + "ms");

	return path;
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

function pathing_init(canvas) {
	global_canvas = canvas; 
	global_context = global_canvas.getContext("2d");

	global_canvas.oncontextmenu = (e) => {
		return false;
	};

	global_grid = grid_create(25, 25);

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

