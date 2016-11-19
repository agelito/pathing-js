var global_canvas;
var global_context;

function handle_input_event(grid, e, buttonDown, buttonUp){
	var canvas_coordinates = canvas_input_coordinate(global_canvas, e);

	if(e.buttons != 0) {
		var current_node_type = get_node_at_coordinates(canvas_coordinates, grid);

		var node_type = current_node_type; 
		if(e.buttons == 1) {
			if(current_node_type != NODE_FLOOR) {
				node_type = NODE_FLOOR;
			} else if(buttonDown) {
				// TODO: Mark path begin or end depending on current pathing state.
			}
		}
		
		if(e.buttons == 2 && current_node_type != NODE_WALL) {
			node_type = NODE_WALL;
		}

		if(node_type != current_node_type) {
			set_node_at_coordinates(canvas_coordinates, grid, node_type);
			render_grid(grid);
		}
	}
}

function pathing_init(canvas) {
	global_canvas = canvas; 
	global_context = global_canvas.getContext("2d");

	global_canvas.oncontextmenu = (e) => {
		return false;
	};

	var grid = create_grid(15, 15);

	global_canvas.onmousemove = (e) => {
		handle_input_event(grid, e, false, false);
	};
	global_canvas.onmousedown= (e) => {
		handle_input_event(grid, e, true, false);
	};
	global_canvas.onmouseup= (e) => {
		handle_input_event(grid, e, false, true);
	};

	render_grid(grid);
}

