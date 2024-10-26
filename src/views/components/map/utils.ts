import { graphNodes } from './graphNodes';
import type { Graph, MapNode, NodeCoordinates, NodeId } from './types';
import { isValidNode, NEIGHBOR_DISTANCE_THRESHOLD } from './types';

/**
 * Calculates the Euclidean distance between two points.
 *
 * @param point1 - The coordinates of the first point.
 * @param point2 - The coordinates of the second point.
 * @returns The distance between the two points.
 */
export const calculateDistance = (point1: NodeCoordinates, point2: NodeCoordinates): number =>
    Math.sqrt((point2.x - point1.x) ** 2 + (point2.y - point1.y) ** 2);

/**
 * Finds the nearest nodes to a given node in a graph.
 *
 * @param nodeId - The ID of the node for which to find the nearest nodes.
 * @param graph - The graph containing all nodes.
 * @returns An array of node IDs representing the nearest nodes.
 *
 * The function first checks if the current node is valid. If not, it returns an empty array.
 * It then calculates the distances to all other valid nodes in the graph.
 * The nodes are sorted by distance, and the function first attempts to connect to the nearest intersections.
 * If no intersections are found, it connects to the nearest buildings.
 */
const findNearestNodes = (nodeId: NodeId, graph: Graph): NodeId[] => {
    const currentNode = graph[nodeId];
    if (!isValidNode(currentNode)) return [];

    // Calculate distances to all other nodes
    const distances = Object.entries(graph)
        .filter((entry): entry is [string, MapNode] => {
            const [id, node] = entry;
            return id !== nodeId && isValidNode(node);
        })
        .map(([id, node]) => ({
            id,
            distance: calculateDistance(currentNode, node),
            isIntersection: node.type === 'intersection',
        }))
        .sort((a, b) => a.distance - b.distance);

    // First try to connect to nearest intersections
    const nearestIntersections = distances
        .filter(node => node.isIntersection)
        .slice(0, 2)
        .map(node => node.id);

    if (nearestIntersections.length > 0) {
        return nearestIntersections;
    }

    // If no intersections found, connect to nearest buildings
    return distances.slice(0, 2).map(node => node.id);
};

/**
 * Retrieves the neighboring nodes of a given node within a graph.
 *
 * @param nodeId - The ID of the node for which neighbors are to be found.
 * @param graph - The graph containing all nodes and their connections.
 * @returns An array of node IDs representing the neighbors of the given node.
 *
 * This function first checks if the current node is valid. If not, it returns an empty array.
 * It then filters the graph to find all valid neighboring nodes within a specified distance threshold.
 * If no direct neighbors are found, it attempts to connect to the nearest intersection or building.
 */
export const getNeighbors = (nodeId: NodeId, graph: Graph): NodeId[] => {
    const currentNode = graph[nodeId];
    if (!isValidNode(currentNode)) return [];

    // Get all possible neighbors within the increased threshold
    const neighbors = Object.entries(graph)
        .filter((entry): entry is [string, MapNode] => {
            const [id, node] = entry;
            if (!isValidNode(node) || id === nodeId) return false;
            const distance = calculateDistance(currentNode, node);
            return distance < NEIGHBOR_DISTANCE_THRESHOLD;
        })
        .map(([id]) => id);

    // If no direct neighbors found, connect to the nearest intersection or building
    if (neighbors.length === 0) {
        const nearestNodes = findNearestNodes(nodeId, graph);
        return nearestNodes;
    }

    return neighbors;
};

/**
 * Calculates the midpoint between two nodes identified by their IDs.
 *
 * @param startId - The ID of the starting node.
 * @param endId - The ID of the ending node.
 * @returns An object containing the x and y coordinates of the midpoint, or null if either node is invalid.
 */
export const getMidpoint = (startId: string, endId: string) => {
    const startNode = graphNodes[startId];
    const endNode = graphNodes[endId];

    if (!isValidNode(startNode) || !isValidNode(endNode)) {
        return null;
    }

    return {
        x: (startNode.x + endNode.x) / 2,
        y: (startNode.y + endNode.y) / 2,
    };
};
