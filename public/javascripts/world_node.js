var NODE_NONE = 0;
var NODE_FLOOR = 1;
var NODE_WALL = 2;

var global_nodes = [];
global_nodes[NODE_FLOOR] = { walkable: 1};
global_nodes[NODE_WALL] = { walkable: 0};

function get_node(node_type) {
	return global_nodes[node_type];
}
