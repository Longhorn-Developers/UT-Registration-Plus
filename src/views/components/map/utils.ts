import { graphNodes } from './mapUtils';
import type { Graph, MapNode, NodeCoordinates, NodeId } from './types';
import { isValidNode, NEIGHBOR_DISTANCE_THRESHOLD } from './types';

// Utils for distance calculations
export const calculateDistance = (point1: NodeCoordinates, point2: NodeCoordinates): number =>
    Math.sqrt((point2.x - point1.x) ** 2 + (point2.y - point1.y) ** 2);

// Helper function to find nearest nodes when no direct neighbors exist
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

// Helper to safely get midpoint coordinates
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
