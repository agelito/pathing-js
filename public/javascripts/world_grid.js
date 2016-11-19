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

function node_index_at_coordinates(coordinates, grid) {
	var node_size_x = (global_canvas.width / grid.cols);
	var node_size_y = (global_canvas.height / grid.rows);
	var node_x = Math.floor(coordinates.x / node_size_x);
	var node_y = Math.floor(coordinates.y / node_size_y);

	return (node_x + node_y * grid.cols);
}

function set_node_at_coordinates(coordinates, grid, node_type) {
	var node_index = node_index_at_coordinates(coordinates, grid);
	if(node_index >= 0 && node_index < (grid.cols * grid.rows)) {
		grid.nodes[node_index] = node_type;
	}
}

function get_node_at_coordinates(coordinates, grid) {
	var node_index = node_index_at_coordinates(coordinates, grid);
	if(node_index >= 0 && node_index < (grid.cols * grid.rows)) {
		return grid.nodes[node_index];
	}
	return NODE_NONE;
}

