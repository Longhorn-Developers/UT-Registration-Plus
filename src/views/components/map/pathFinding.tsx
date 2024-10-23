/* eslint-disable max-classes-per-file */
import React from 'react';

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

// Constants
export const DIRECT_PATH_THRESHOLD = 50; // Units for direct path calculation

// Utils for distance calculations
export const calculateDistance = (point1: NodeCoordinates, point2: NodeCoordinates): number =>
    Math.sqrt((point2.x - point1.x) ** 2 + (point2.y - point1.y) ** 2);

export const getNeighbors = (nodeId: NodeId, graph: Graph): NodeId[] => {
    const currentNode = graph[nodeId];
    if (!isValidNode(currentNode)) return [];

    return Object.entries(graph)
        .filter(([id, node]) => {
            if (!isValidNode(node) || id === nodeId) return false;
            const distance = calculateDistance(currentNode, node);
            // Consider nodes as neighbors if they're within reasonable walking distance
            return distance < 50;
        })
        .map(([id]) => id);
};

// Main path finding implementation
export class PathFinder {
    private graph: Graph;

    constructor(graph: Graph) {
        this.graph = graph;
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

        // Initialize data structures for Dijkstra's algorithm
        const distances = Object.keys(this.graph).reduce<DistanceMap>((acc, nodeId) => {
            acc[nodeId] = nodeId === startId ? 0 : Infinity;
            return acc;
        }, {});

        const previous = Object.keys(this.graph).reduce<PreviousMap>((acc, nodeId) => {
            acc[nodeId] = null;
            return acc;
        }, {});

        const unvisited = new Set(Object.keys(this.graph));

        while (unvisited.size > 0) {
            // Find the unvisited node with the smallest distance
            const current = this.getMinDistanceNode(distances, unvisited);
            if (current === null) break;

            if (current === endId) break; // Found our destination

            unvisited.delete(current);

            // Update distances to neighbors
            const neighbors = getNeighbors(current, this.graph);
            for (const neighbor of neighbors) {
                if (!unvisited.has(neighbor)) continue;

                const currentNode = this.graph[current];
                const neighborNode = this.graph[neighbor];

                if (!isValidNode(currentNode) || !isValidNode(neighborNode)) continue;

                const distance = calculateDistance(currentNode, neighborNode);

                const currentDistance = distances[current];
                if (currentDistance === undefined) continue;
                const totalDistance = currentDistance + distance;

                const neighborDistance = distances[neighbor];
                if (neighborDistance === undefined) continue;

                if (totalDistance < neighborDistance) {
                    distances[neighbor] = totalDistance;
                    previous[neighbor] = current;
                }
            }
        }

        // Reconstruct path
        return this.reconstructPath(previous, startId, endId);
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

export const Path: React.FC<PathProps> = ({ startId, endId, graph, className = '' }) => {
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
                            className={`stroke-2 stroke-ut-burntorange ${className}`}
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
