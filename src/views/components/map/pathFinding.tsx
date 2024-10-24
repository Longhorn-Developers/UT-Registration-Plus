/* eslint-disable max-classes-per-file */
import React from 'react';

// Constants
export const DIRECT_PATH_THRESHOLD = 25; // Units for direct path calculation
export const NEIGHBOR_DISTANCE_THRESHOLD = 75; // Increased threshold for neighbor connections

export type NodeType = 'building' | 'intersection';

export type NodeCoordinates = {
    x: number;
    y: number;
};

export type MapNode = NodeCoordinates & {
    type: NodeType;
};

export type Graph = Record<string, MapNode>;

export type Distance = number;
export type NodeId = string;

export type DistanceMap = Record<NodeId, Distance>;
export type PreviousMap = Record<NodeId, NodeId | null>;

// Custom error class for path finding errors
export class PathFindingError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'PathFindingError';
    }
}

// Type guard to check if a node exists in the graph
const isValidNode = (node: MapNode | undefined): node is MapNode =>
    node !== undefined &&
    typeof node.x === 'number' &&
    typeof node.y === 'number' &&
    (node.type === 'building' || node.type === 'intersection');

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

// Main path finding implementation
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

// React component for rendering paths
type PathProps = {
    startId: NodeId;
    endId: NodeId;
    graph: Graph;
    className?: string;
};

export const Path = ({ startId, endId, graph, className = '' }: PathProps): JSX.Element | null => {
    try {
        const pathFinder = new PathFinder(graph);
        const path = pathFinder.findPath(startId, endId);

        return (
            <>
                {path.slice(0, -1).map((nodeId, index) => {
                    const nextNodeId = path[index + 1];
                    if (!nextNodeId) return null;

                    const start = graph[nodeId];
                    const end = graph[nextNodeId];

                    if (!isValidNode(start) || !isValidNode(end)) return null;

                    return (
                        <line
                            key={`${nodeId}-${nextNodeId}`}
                            x1={start.x}
                            y1={start.y}
                            x2={end.x}
                            y2={end.y}
                            strokeLinecap='round'
                            // TODO: use clsx
                            className={`stroke-8 stroke-ut-burntorange ${className} opacity-50`}
                        />
                    );
                })}
            </>
        );
    } catch (error) {
        console.error('Error rendering path:', error instanceof Error ? error.message : 'Unknown error');
        return null;
    }
};
