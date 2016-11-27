function path_astar_init(grid) {
	var astar = { 
		cols: grid.cols,
		rows: grid.rows,
		nodes: [] 
	};

	var node_count = (grid.cols * grid.rows);
	for(var y = 0; y < grid.rows; y++) {
		for(var x = 0; x < grid.cols; x++) {
			var node_index = (x + y * grid.cols);
			var world_node = get_node(grid.nodes[node_index]);
		
			astar.nodes[node_index] = {
				location: {x: x, y: y},
				walkable: world_node.walkable,
				neighbors: grid_get_neighbors({x: x, y: y}, grid), 
				cost_to_enter: 1,
				tentative_cost: Infinity,
				g_score: Infinity,
				f_score: Infinity,
				closed: false,
				previous: -1 
			};
		}
   	}

	return astar;
}

function path_astar_distance(a, b) {
	var x = (b.x - a.x);
	var y = (b.y - a.y);
	return Math.sqrt(x * x + y * y);
}

function path_astar_heurestic(start, end) {
	return ((end.x - start.x) + (end.y - start.y));
}

function path_astar_cost(node_a, node_b) {
	var base_cost = node_b.cost_to_enter;
	var dist_cost = path_astar_distance(node_a.location, node_b.location);
	return base_cost + dist_cost;
}

function path_astar_construct_path(astar, from_node_index) {
	var path = [];

	var current_node = astar.nodes[from_node_index]; 
	while(current_node != null) {
		path.push(current_node.location);
		if(current_node.previous != -1) {
			current_node = astar.nodes[current_node.previous];
		} else {
			current_node = null;
		}
	}

	path.reverse();

	return path;
}

function path_astar_search(astar, start, end) {
	var start_node_index = start.x + start.y * astar.cols;
	var start_node = astar.nodes[start_node_index];

	if(!start_node.walkable) return [];

	var end_node_index = end.x + end.y * astar.cols;
	if(!astar.nodes[end_node_index].walkable) return [];

	var open_set = [start_node_index];

	var node_count = astar.cols * astar.rows;
	for(var i = 0; i < node_count; i++) {
		astar.nodes[i].previous = -1;
		astar.nodes[i].closed = false;
		astar.nodes[i].g_score = Infinity;
		astar.nodes[i].f_score = Infinity;
	}

	start_node.g_score = 0;
	start_node.f_score = path_astar_heurestic(start, end);

	while(open_set.length > 0) {
		var lowest_open_fscore = Infinity;
		var lowest_open_fscore_index = 0;

		for(var i = 0; i < open_set.length; i++) {
			var check_node_index = open_set[i];
			var check_node = astar.nodes[check_node_index];
			if(check_node.f_score < lowest_open_fscore) {
				lowest_open_fscore = check_node.f_score;
				lowest_open_fscore_index = i;
			}
		}

		var current_node_index = open_set[lowest_open_fscore_index];
		var current_node = astar.nodes[current_node_index];

		if(current_node_index == end_node_index) {
			// NOTE: Successfully found path.
			return path_astar_construct_path(astar, current_node_index);
		}

		open_set.splice(lowest_open_fscore_index, 1);

		current_node.closed = true;

		for(var ni = 0; ni < current_node.neighbors.length; ni++) {
			var neighbor_index = current_node.neighbors[ni];

			var neighbor = astar.nodes[neighbor_index];
			if(neighbor.closed || !neighbor.walkable) continue;

			var tentative_g_score = current_node.g_score + path_astar_cost(current_node, neighbor);

			if(open_set.lastIndexOf(neighbor_index) == -1) {
				open_set.push(neighbor_index);
			} else if(tentative_g_score >= neighbor.g_score) {
				continue;
			}

			neighbor.previous = current_node_index;
			neighbor.g_score = tentative_g_score;
			neighbor.f_score = tentative_g_score + path_astar_heurestic(neighbor.location, end);
		}
	}

	// NOTE: Failure to find path.
	return [];
}

