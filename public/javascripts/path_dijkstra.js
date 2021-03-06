function path_dijkstra_init(grid) {
	var dijkstra = { 
		cols: grid.cols,
		rows: grid.rows,
		nodes: [] 
	};

	var node_count = (grid.cols * grid.rows);
	for(var y = 0; y < grid.rows; y++) {
		for(var x = 0; x < grid.cols; x++) {
			var node_index = (x + y * grid.cols);
			var world_node = get_node(grid.nodes[node_index]);
		
			dijkstra.nodes[node_index] = {
				location: {x: x, y: y},
				walkable: world_node.walkable,
				neighbors: grid_get_neighbors({x: x, y: y}, grid, true), 
				cost_to_enter: 1,
				tentative_cost: Infinity,
				visited: false,
				previous: -1 
			};
		}
   	}

	return dijkstra;
}

function path_dijkstra_distance_est(a, b) {
	if(a.x == b.x || a.y == b.y) return 1;
	else return 1.44;
}

function path_dijkstra_search(dijkstra, start, end) {
	var unvisited = [];
	
	var current_node_index = (start.x + start.y * dijkstra.cols);
	var current_node = dijkstra.nodes[current_node_index];
	if(!current_node.walkable) return [];

	var final_node = dijkstra.nodes[end.x + end.y * dijkstra.cols];

	current_node.tentative_cost = 0;
	current_node.visited = true;

	var node_count = (dijkstra.cols * dijkstra.rows);
	for(var i = 0; i < node_count; i++) {
		var node = dijkstra.nodes[i];
		if(node != current_node) {
			node.tentative_cost = Infinity;
			node.visited = false;
			node.previous = -1;
			unvisited.push(i);
		}
	}

	while(1) {
		for(var ni = 0; ni < current_node.neighbors.length; ni++) {
			var neighbor = dijkstra.nodes[current_node.neighbors[ni]];
			if(neighbor.visited == false && neighbor.walkable) {
				var tentative_cost = (current_node.tentative_cost + neighbor.cost_to_enter + 
					path_dijkstra_distance_est(current_node.location, neighbor.location));
				if(tentative_cost < neighbor.tentative_cost) {
					neighbor.tentative_cost = tentative_cost;
					neighbor.previous = current_node_index;
				}
			}
		}

		current_node.visited = true;

		var current_unvisited = unvisited.findIndex((unvisited_node_index) => {
			return (unvisited_node_index == current_node_index);
		});

		if(current_unvisited != -1) {
			unvisited.splice(current_unvisited, 1);
		}

		if(final_node.visited) {
			break;
		}

		var lowest_unvisited_index = 0;
		var lowest_unvisited_cost = Infinity;
		for(var ui = 0; ui < unvisited.length; ui++) {
			var unvisited_node = dijkstra.nodes[unvisited[ui]];
			if(unvisited_node.tentative_cost < lowest_unvisited_cost) {
				lowest_unvisited_cost = unvisited_node.tentative_cost;
				lowest_unvisited_index = ui
			}
		}

		if(lowest_unvisited_cost == Infinity) {
			return [];
		}

		current_node_index = unvisited[lowest_unvisited_index];
		current_node = dijkstra.nodes[current_node_index];
	}

	var path = [];

	var path_node = final_node;
	while(path_node) {
		path.push(path_node.location);
		path_node = dijkstra.nodes[path_node.previous];
	}

	path.reverse();

	return path;
}
