function render_grid(grid) {
	var width = global_canvas.width;
	var height = global_canvas.height;

	var node_width = (width / grid.cols);
	var node_height = (height / grid.rows);

	for(var y = 0; y < grid.rows; y++) {
		for(var x = 0; x < grid.cols; x++) {
			var pos_x = (x * node_width);
			var pos_y = (y * node_height);

			var node = get_node(grid.nodes[x + y * grid.cols]);

			global_context.beginPath();
			if(node.walkable) {
				global_context.fillStyle = "white";
				global_context.strokeStyle = "black";
				global_context.strokeRect(pos_x, pos_y, node_width, node_height);
			} else {
				global_context.fillStyle = "black";
				global_context.rect(pos_x, pos_y, node_width, node_height);
			}
			global_context.fill();
		}
	}

	global_context.stroke();
}

function render_path(grid, path) {
	var width = global_canvas.width;
	var height = global_canvas.height;

	var node_width = (width / grid.cols);
	var node_height = (height / grid.rows);

	global_context.beginPath();
	global_context.fillStyle = "green";
	for(var i = 0; i < path.length; i++) {
		var pos_x = (path[i].x * node_width) + (node_width / 4);
		var pos_y = (path[i].y * node_height) + (node_height / 4);

		global_context.rect(pos_x, pos_y, node_width / 2, node_height / 2);
	}
	global_context.fill();

	global_context.stroke();
}

function grid_create(cols, rows) {
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

function grid_node_coordinates(canvas_coordinates, grid) {
	var node_size_x = (global_canvas.width / grid.cols);
	var node_size_y = (global_canvas.height / grid.rows);
	var node_x = Math.floor(canvas_coordinates.x / node_size_x);
	var node_y = Math.floor(canvas_coordinates.y / node_size_y);
	return {x: node_x, y: node_y};
}

function grid_node_index(coordinates, grid) {
	var node_size_x = (global_canvas.width / grid.cols);
	var node_size_y = (global_canvas.height / grid.rows);
	var node_x = Math.floor(coordinates.x / node_size_x);
	var node_y = Math.floor(coordinates.y / node_size_y);

	return (node_x + node_y * grid.cols);
}

function grid_set_node(coordinates, grid, node_type) {
	var node_index = grid_node_index(coordinates, grid);
	if(node_index >= 0 && node_index < (grid.cols * grid.rows)) {
		grid.nodes[node_index] = node_type;
	}
}

function grid_get_node(coordinates, grid) {
	var node_index = grid_node_index(coordinates, grid);
	if(node_index >= 0 && node_index < (grid.cols * grid.rows)) {
		return grid.nodes[node_index];
	}
	return NODE_NONE;
}

function grid_get_neighbors(node_xy, grid) {
	var neighbors = [];
	var node_index = (node_xy.x + node_xy.y * grid.cols);
	if(node_xy.x > 0) neighbors.push(node_index - 1);
	if(node_xy.x < grid.cols - 1) neighbors.push(node_index + 1);
	if(node_xy.y > 0) neighbors.push(node_index - grid.cols);
	if(node_xy.y < grid.rows - 1) neighbors.push(node_index + grid.cols);

	return neighbors;
}

