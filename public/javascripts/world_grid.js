var global_canvas;
var global_context;

function render_grid(grid) {
	var width = global_canvas.width;
	var height = global_canvas.height;

	global_context.clearRect(0, 0, width, height);

	var node_width = (width / grid.cols);
	var node_height = (height / grid.rows);

	for(var y = 0; y < grid.rows; y++) {
		for(var x = 0; x < grid.cols; x++) {
			var pos_x = (x * node_width);
			var pos_y = (y * node_height);

			var node = get_node(grid.nodes[x + y * grid.cols]);

			if(node.walkable) {
				global_context.rect(pos_x, pos_y, node_width, node_height);
			} else {
				global_context.fillRect(pos_x, pos_y, node_width, node_height);
			}
		}
	}

	global_context.stroke();
}

function create_grid(cols, rows) {
	var grid = {};
	grid.cols = cols;
	grid.rows = rows;
	grid.nodes = [];
	
	var length = cols * rows;
	for(var i = 0; i < length; i++) {
		grid.nodes.push(NODE_FLOOR);
	}

	return grid;
}

function set_node_at_coordinates(coordinates, grid, node_type) {
	var node_size_x = (global_canvas.width / grid.cols);
	var node_size_y = (global_canvas.height / grid.rows);
	var node_x = Math.floor(coordinates.x / node_size_x);
	var node_y = Math.floor(coordinates.y / node_size_y);

	if(node_x >= 0 && node_x < grid.cols &&
		node_y >= 0 && node_y < grid.rows) {
			grid.nodes[node_x + node_y * grid.cols] = node_type;
		}
}

function handle_input_event(grid, e) {
	var canvas_coordinates = canvas_input_coordinate(global_canvas, e);

	if(e.buttons != 0) {
		var node_type = NODE_NONE;
		if(e.buttons == 1) {
			node_type = NODE_FLOOR;
		} else if(e.buttons == 2) {
			node_type = NODE_WALL;
		}

		if(node_type != NODE_NONE) {
			set_node_at_coordinates(canvas_coordinates, grid, node_type);
			render_grid(grid);
		}
	}
}

function init_canvas(canvas) {
	global_canvas = canvas; 
	global_context = global_canvas.getContext("2d");

	global_canvas.oncontextmenu = (e) => {
		return false;
	};

	var grid = create_grid(15, 15);

	global_canvas.onmousemove = (e) => {
		handle_input_event(grid, e);
	};
	global_canvas.onmousedown= (e) => {
		handle_input_event(grid, e);
	};

	render_grid(grid);
}

