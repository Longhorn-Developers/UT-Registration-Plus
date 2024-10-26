/* eslint-disable max-classes-per-file */
import {
    DIRECT_PATH_THRESHOLD,
    type DistanceMap,
    type Graph,
    isValidNode,
    type MapNode,
    NEIGHBOR_DISTANCE_THRESHOLD,
    type NodeId,
    type PreviousMap,
} from './types';
import { calculateDistance, getNeighbors } from './utils';

/**
 * Custom error class for handling pathfinding errors.
 */
export class PathFindingError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'PathFindingError';
    }
}

/**
 * The `PathFinder` class is responsible for finding the shortest path between nodes in a graph.
 * It uses Dijkstra's algorithm to compute the shortest path and supports bidirectional connections.
 */
export class PathFinder {
    private graph: Graph;
    private nodeConnections: Map<NodeId, Set<NodeId>>;

    constructor(graph: Graph) {
        this.graph = graph;
        this.nodeConnections = this.buildNodeConnections();
    }

    private buildNodeConnections(): Map<NodeId, Set<NodeId>> {
        const connections = new Map<NodeId, Set<NodeId>>();

        // Initialize connections for each node
        Object.keys(this.graph).forEach(nodeId => {
            connections.set(nodeId, new Set<NodeId>());
        });

        // Build bidirectional connections
        Object.keys(this.graph).forEach(nodeId => {
            const neighbors = getNeighbors(nodeId, this.graph);
            neighbors.forEach(neighbor => {
                connections.get(nodeId)?.add(neighbor);
                connections.get(neighbor)?.add(nodeId);
            });
        });

        return connections;
    }

    public findPath(startId: NodeId, endId: NodeId): NodeId[] {
        const startNode = this.graph[startId];
        const endNode = this.graph[endId];

        // Validate input
        if (!isValidNode(startNode)) {
            throw new PathFindingError(`Invalid start node: ${startId}`);
        }
        if (!isValidNode(endNode)) {
            throw new PathFindingError(`Invalid end node: ${endId}`);
        }

        // Check for direct path possibility
        if (this.shouldUseDirectPath(startNode, endNode)) {
            return [startId, endId];
        }

        // Initialize Dijkstra's algorithm data structures
        const distances = Object.keys(this.graph).reduce<DistanceMap>((acc, nodeId) => {
            acc[nodeId] = nodeId === startId ? 0 : Infinity;
            return acc;
        }, {});

        const previous = Object.keys(this.graph).reduce<PreviousMap>((acc, nodeId) => {
            acc[nodeId] = null;
            return acc;
        }, {});

        const unvisited = new Set(Object.keys(this.graph));

        // Main Dijkstra's algorithm loop
        while (unvisited.size > 0) {
            const current = this.getMinDistanceNode(distances, unvisited);
            if (current === null) break;

            if (current === endId) break;

            unvisited.delete(current);

            // Use pre-computed connections
            const neighbors = this.nodeConnections.get(current) ?? new Set<NodeId>();
            neighbors.forEach(neighbor => {
                if (!unvisited.has(neighbor)) return;

                const currentNode = this.graph[current];
                const neighborNode = this.graph[neighbor];

                if (!isValidNode(currentNode) || !isValidNode(neighborNode)) return;

                const distance = calculateDistance(currentNode, neighborNode);
                const totalDistance = distances[current]! + distance;

                if (totalDistance < distances[neighbor]!) {
                    distances[neighbor] = totalDistance;
                    previous[neighbor] = current;
                }
            });
        }

        // Reconstruct and validate path
        const path = this.reconstructPath(previous, startId, endId);

        // Verify path distance is reasonable
        const totalPathDistance = this.calculatePathDistance(path);
        if (totalPathDistance > NEIGHBOR_DISTANCE_THRESHOLD * path.length) {
            console.warn(`Long path detected (${totalPathDistance.toFixed(2)} units) from ${startId} to ${endId}`);
        }

        return path;
    }

    private calculatePathDistance(path: NodeId[]): number {
        let totalDistance = 0;
        for (let i = 0; i < path.length - 1; i++) {
            const currentNode = this.graph[path[i]!];
            const nextNode = this.graph[path[i + 1]!];
            if (isValidNode(currentNode) && isValidNode(nextNode)) {
                totalDistance += calculateDistance(currentNode, nextNode);
            }
        }
        return totalDistance;
    }

    private shouldUseDirectPath(start: MapNode, end: MapNode): boolean {
        const distance = calculateDistance(start, end);
        return distance <= DIRECT_PATH_THRESHOLD;
    }

    private getMinDistanceNode(distances: DistanceMap, unvisited: Set<NodeId>): NodeId | null {
        let minDistance = Infinity;
        let minNode: NodeId | null = null;

        unvisited.forEach(nodeId => {
            const distance = distances[nodeId] ?? Infinity;
            if (distance < minDistance) {
                minDistance = distance;
                minNode = nodeId;
            }
        });

        return minNode;
    }

    private reconstructPath(previous: PreviousMap, startId: NodeId, endId: NodeId): NodeId[] {
        const path: NodeId[] = [];
        let currentNode: NodeId | null = endId;

        // Keep track of visited nodes to prevent infinite loops
        const visited = new Set<NodeId>();

        while (currentNode !== null) {
            // Prevent infinite loops
            if (visited.has(currentNode)) {
                throw new PathFindingError('Circular path detected during reconstruction');
            }
            visited.add(currentNode);

            path.unshift(currentNode);
            const prevNode: NodeId | null = previous[currentNode] ?? null;

            // If we can't find the previous node and we haven't reached the start,
            // then the path is broken
            if (prevNode === undefined) {
                throw new PathFindingError('Path reconstruction failed: broken path chain');
            }

            currentNode = prevNode;
        }

        // Verify that we actually found a path to the start
        if (path[0] !== startId) {
            throw new PathFindingError('No valid path found between the specified nodes');
        }

        return path;
    }
}
