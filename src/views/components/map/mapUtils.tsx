import React, { memo } from 'react';

// Type definitions
type NodeType = 'building' | 'intersection';

type Node = {
    x: number;
    y: number;
    connections: string[];
    type: NodeType;
};

type BaseNode = {
    x: number;
    y: number;
    type: NodeType;
};

// Extended type for nodes with connections (after graph generation)
type ConnectedNode = BaseNode & {
    connections: string[];
};

// Graph types
type RawNodes = {
    [key: string]: BaseNode;
};

type GraphNodes = {
    [key: string]: ConnectedNode;
};

type PathfindingResult = {
    path: string[];
    distance: number;
};

/**
 * Configuration options for automatic connection generation
 */
type ConnectionConfig = {
    // Maximum distance for direct connections between intersections
    maxIntersectionDistance: number;
    // Maximum distance for building to nearest intersection connections
    maxBuildingToIntersectionDistance: number;
    // Maximum deviation from straight line to consider nodes aligned
    alignmentTolerance: number;
};

export const connectionConfig = {
    maxIntersectionDistance: 100, // Adjust based on your map scale
    maxBuildingToIntersectionDistance: 50, // Adjust based on your map scale
    alignmentTolerance: 10, // Adjust based on needed precision
} as const satisfies ConnectionConfig;

/**
 * Utility functions for graph building
 */
const GraphUtils = {
    calculateDistance(point1: Pick<BaseNode, 'x' | 'y'>, point2: Pick<BaseNode, 'x' | 'y'>): number {
        return Math.sqrt((point2.x - point1.x) ** 2 + (point2.y - point2.y) ** 2);
    },

    findNearestIntersections(buildingId: string, nodes: RawNodes, maxDistance: number): string[] {
        const building = nodes[buildingId];

        if (!building) {
            throw new Error(`Building ${buildingId} not found in graph`);
        }

        return Object.entries(nodes)
            .filter(([_, node]) => node.type === 'intersection')
            .map(([id, node]) => ({
                id,
                distance: this.calculateDistance(building, node),
            }))
            .filter(({ distance }) => distance <= maxDistance)
            .sort((a, b) => a.distance - b.distance)
            .map(i => i.id);
    },
};

// Function to generate connections
export function generateConnections(rawNodes: RawNodes, config: ConnectionConfig): GraphNodes {
    const nodes: GraphNodes = {};

    // Initialize nodes with empty connections
    for (const [id, node] of Object.entries(rawNodes)) {
        nodes[id] = {
            ...node,
            connections: [],
        };
    }

    // Generate connections
    for (const [id, node] of Object.entries(nodes)) {
        if (node.type === 'building') {
            // Connect buildings to nearest intersections
            const nearestIntersections = GraphUtils.findNearestIntersections(
                id,
                rawNodes,
                config.maxBuildingToIntersectionDistance
            );

            node.connections = nearestIntersections;

            // Add bidirectional connections
            nearestIntersections.forEach(intersectionId => {
                if (nodes[intersectionId] && !nodes[intersectionId].connections.includes(id)) {
                    nodes[intersectionId].connections.push(id);
                }
            });
        } else {
            // Connect intersections to other nearby intersections
            const otherIntersections = Object.entries(rawNodes)
                .filter(
                    ([otherId, otherNode]) =>
                        otherId !== id &&
                        otherNode.type === 'intersection' &&
                        GraphUtils.calculateDistance(node, otherNode) <= config.maxIntersectionDistance
                )
                .map(([otherId]) => otherId);

            node.connections = otherIntersections;

            // Add bidirectional connections
            otherIntersections.forEach(otherId => {
                if (nodes[otherId] && !nodes[otherId].connections.includes(id)) {
                    nodes[otherId].connections.push(id);
                }
            });
        }
    }

    return nodes;
}

/**
 * Explanation of the connections property:
 *
 * The connections property in the Node interface represents the graph edges in our map.
 * It's essential for pathfinding because:
 *
 * 1. It defines which nodes are directly connected to each other
 * 2. It represents actual walkable paths on campus
 * 3. It constrains the possible routes for the pathfinding algorithm
 *
 * How to determine connections:
 *
 * 1. For intersections:
 *    - Look at the actual walkways on the map
 *    - Connect to adjacent intersections that have direct paths
 *    - Connect to buildings that have entrances on that walkway
 *
 * 2. For buildings:
 *    - Connect to the nearest intersections that have direct walkway access
 *    - Connect to adjacent buildings only if there's a direct walkway
 *
 */
export const rawGraphNodes: RawNodes = {
    // Building nodes
    GDC: {
        x: 257,
        y: 283,
        type: 'building',
    },
    PCL: {
        x: 222,
        y: 430,
        type: 'building',
    },
    JES: {
        x: 260,
        y: 420,
        type: 'building',
    },
    // GRE: {
    //     x: 260,
    //     y: 375,
    //     type: 'building',
    // },
    // MAI: {
    //     x: 167,
    //     y: 310,
    //     type: 'building',
    // },
    // WEL: {
    //     x: 216,
    //     y: 268,
    //     type: 'building',
    // },
    // BEL: {
    //     x: 365,
    //     y: 377,
    //     type: 'building',
    // },
    // WCP: {
    //     x: 260,
    //     y: 343,
    //     type: 'building',
    // },
    // RLP: {
    //     x: 300,
    //     y: 335,
    //     type: 'building',
    // },
    // UTC: {
    //     x: 197,
    //     y: 410,
    //     type: 'building',
    // },
    // CBA: {
    //     x: 232,
    //     y: 363,
    //     type: 'building',
    // },
    // GSB: {
    //     x: 208,
    //     y: 382,
    //     type: 'building',
    // },
    // PMA: {
    //     x: 255,
    //     y: 185,
    //     type: 'building',
    // },
    // PAT: {
    //     x: 258,
    //     y: 222,
    //     type: 'building',
    // },
    // EER: {
    //     x: 289,
    //     y: 208,
    //     type: 'building',
    // },
    // ECJ: {
    //     x: 289,
    //     y: 280,
    //     type: 'building',
    // },
    // UNB: {
    //     x: 105,
    //     y: 288,
    //     type: 'building',
    // },
    // FAC: {
    //     x: 133,
    //     y: 298,
    //     type: 'building',
    // },
    // HRC: {
    //     x: 112,
    //     y: 380,
    //     type: 'building',
    // },
    // COM: {
    //     x: 195,
    //     y: 318,
    //     type: 'building',
    // },

    // Intersection nodes
    'speedway-24th': {
        x: 241,
        y: 250,
        type: 'intersection',
    },
    'speedway-21st': {
        x: 241,
        y: 400,
        type: 'intersection',
    },
    // 'speedway-e-mai-stairs': {
    //     x: 241,
    //     y: 315,
    //     type: 'intersection',
    // },
    // 'speedway-w-eer': {
    //     x: 241,
    //     y: 208,
    //     type: 'intersection',
    // },
    // 'guad-24th': {
    //     x: 89,
    //     y: 250,
    //     type: 'intersection',
    // },
    // 'guad-21st': {
    //     x: 89,
    //     y: 400,
    //     type: 'intersection',
    // },
    // 'guad-icd': {
    //     x: 89,
    //     y: 353,
    //     type: 'intersection',
    // },
    // 'uni-ave-21st': {
    //     x: 166,
    //     y: 400,
    //     type: 'intersection',
    // },
    // 'wichita-21st': {
    //     x: 187,
    //     y: 400,
    //     type: 'intersection',
    // },
    // 'n-mai-24th': {
    //     x: 167,
    //     y: 250,
    //     type: 'intersection',
    // },
    // 's-mai-stairs': {
    //     x: 167,
    //     y: 347,
    //     type: 'intersection',
    // },
    // 'e-mai-stairs': {
    //     x: 215,
    //     y: 315,
    //     type: 'intersection',
    // },
    // 'guad-w-mai': {
    //     x: 89,
    //     y: 317,
    //     type: 'intersection',
    // },
    // 'n-mai-turtle-pond': {
    //     x: 167,
    //     y: 282,
    //     type: 'intersection',
    // },
    // 'icd-ne': {
    //     x: 207,
    //     y: 289,
    //     type: 'intersection',
    // },
    // 'icd-nne': {
    //     x: 190,
    //     y: 282,
    //     type: 'intersection',
    // },
    // 'icd-se': {
    //     x: 212,
    //     y: 338,
    //     type: 'intersection',
    // },
    // 'icd-sse': {
    //     x: 190,
    //     y: 347,
    //     type: 'intersection',
    // },
    // 'san-jac-21th': {
    //     x: 354,
    //     y: 400,
    //     type: 'intersection',
    // },
    // 'san-jac-24th': {
    //     x: 357,
    //     y: 250,
    //     type: 'intersection',
    // },
    // 'san-jac-23rd': {
    //     x: 358,
    //     y: 318,
    //     type: 'intersection',
    // },
    // 'mlk-jr-statue': {
    //     x: 280,
    //     y: 318,
    //     type: 'intersection',
    // },
    // 'pcl-nw-21st-walkway': {
    //     x: 208,
    //     y: 400,
    //     type: 'intersection',
    // },
    'pcl-w-speedway': {
        x: 241,
        y: 425,
        type: 'intersection',
    },
};

// Type guard to ensure node exists
function assertNodeExists(node: Node | undefined, id: string): asserts node is Node {
    if (!node) throw new Error(`Node ${id} not found in graph`);
}

/**
 * Calculates distance between two points
 */
const calculateDistance = (point1: Pick<Node, 'x' | 'y'>, point2: Pick<Node, 'x' | 'y'>): number =>
    Math.sqrt((point2.x - point1.x) ** 2 + (point2.y - point1.y) ** 2);

/**
 * Implements Dijkstra's algorithm for finding shortest path between two nodes
 */
export function findShortestPath(
    start: string,
    end: string,
    graph: GraphNodes,
    allowThroughBuildings: boolean = false
): PathfindingResult {
    // Initialize data structures
    const distances = new Map<string, number>();
    const previous = new Map<string, string>();
    const unvisited = new Set<string>();

    // Setup initial distances
    Object.keys(graph).forEach(nodeId => {
        // Only add nodes that are valid for pathfinding
        if (allowThroughBuildings || graph[nodeId]?.type === 'intersection' || nodeId === start || nodeId === end) {
            distances.set(nodeId, Infinity);
            unvisited.add(nodeId);
        }
    });

    // Set start distance to 0
    distances.set(start, 0);

    while (unvisited.size > 0) {
        // Find unvisited node with smallest distance
        let current: string | null = null;
        let smallestDistance = Infinity;

        unvisited.forEach(nodeId => {
            const distance = distances.get(nodeId) ?? Infinity;
            if (distance < smallestDistance) {
                smallestDistance = distance;
                current = nodeId;
            }
        });

        if (!current || current === end) break;
        if (smallestDistance === Infinity) break;

        unvisited.delete(current);
        const currentNode = graph[current];

        if (!currentNode) {
            throw new Error(`Node ${current} not found in graph`);
        }

        // Process each neighbor
        currentNode.connections.forEach(neighborId => {
            const neighbor = graph[neighborId];

            if (!neighbor) {
                throw new Error(`Node ${neighborId} not found in graph`);
            }

            // Skip if this is a building we can't path through
            if (!allowThroughBuildings && neighbor.type === 'building' && neighborId !== end) {
                return;
            }

            // Calculate distance to neighbor
            const distance = Math.sqrt((neighbor.x - currentNode.x) ** 2 + (neighbor.y - currentNode.y) ** 2);

            const totalDistance = (distances.get(current!) ?? 0) + distance;

            if (totalDistance < (distances.get(neighborId) ?? Infinity)) {
                distances.set(neighborId, totalDistance);
                if (current) {
                    previous.set(neighborId, current);
                }
            }
        });
    }

    // Reconstruct path
    const path: string[] = [];
    let current: string | undefined = end;

    while (current !== undefined && current !== start) {
        path.unshift(current);
        current = previous.get(current);
    }

    if (current === start) {
        path.unshift(start);
    }

    return {
        path,
        distance: distances.get(end) ?? Infinity,
    };
}

// Get all buildings for the selection dropdowns
export const buildingOptions = Object.entries(rawGraphNodes)
    .filter(([_, node]) => node.type === 'building')
    .map(([id]) => id)
    .sort();

// Draw a path segment
// export const PathSegment = ({ start, end }: { start: string; end: string }): JSX.Element | null => {
//     const startNode = graphNodes[start];
//     const endNode = graphNodes[end];

//     if (!startNode || !endNode) return null;

//     return (
//         <line
//             x1={startNode.x}
//             y1={startNode.y}
//             x2={endNode.x}
//             y2={endNode.y}
//             stroke='#FF8C00'
//             strokeWidth='4'
//             strokeLinecap='round'
//             className='opacity-80'
//         />
//     );
// };

export const PathSegment = memo(({ start, end }: { start: string; end: string }): JSX.Element | null => {
    const startNode = rawGraphNodes[start];
    const endNode = rawGraphNodes[end];

    if (!startNode || !endNode) {
        console.warn(`Missing node data for path segment ${start} -> ${end}`);
        return null;
    }

    return (
        <line
            x1={startNode.x}
            y1={startNode.y}
            x2={endNode.x}
            y2={endNode.y}
            stroke='#FF8C00'
            strokeWidth='4'
            strokeLinecap='round'
            className='opacity-80'
        />
    );
});

// // Helper functions for path finding
// export const findNearestIntersection = (buildingId: string, graph: GraphNodes): string => {
//     const building = graph[buildingId];
//     let nearestIntersection = '';
//     let shortestDistance = Infinity;

//     Object.entries(graph).forEach(([nodeId, node]) => {
//         if (node.type === 'intersection' && building) {
//             const distance = Math.sqrt((node.x - building.x) ** 2 + (node.y - building.y) ** 2);
//             if (distance < shortestDistance) {
//                 shortestDistance = distance;
//                 nearestIntersection = nodeId;
//             }
//         }
//     });

//     return nearestIntersection;
// };

// // Get all buildings from the graph
// export const getAllBuildings = (graph: GraphNodes): string[] =>
//     Object.entries(graph)
//         .filter(([_key, node]) => node.type === 'building')
//         .map(([id]) => id);

// // Generate all possible building-to-building paths
// export const generateAllBuildingPaths = (): Path[] => {
//     const buildings = getAllBuildings(graphNodes);
//     const paths: Path[] = [];

//     for (let i = 0; i < buildings.length; i++) {
//         for (let j = i + 1; j < buildings.length; j++) {
//             const building1 = buildings[i];
//             const building2 = buildings[j];

//             if (building1 && building2) {
//                 // Get nearest intersections for both buildings
//                 const int1 = findNearestIntersection(building1, graphNodes);
//                 const int2 = findNearestIntersection(building2, graphNodes);

//                 paths.push({
//                     id: `${building1}-${building2}`,
//                     points: [building1, int1, int2, building2],
//                 });
//             }
//         }
//     }

//     return paths;
// };

// // Draw a single path segment
// export const PathSegment = ({
//     start,
//     end,
//     isHighlighted,
// }: {
//     start: string;
//     end: string;
//     isHighlighted?: boolean;
// }): JSX.Element | null => {
//     const startNode = graphNodes[start];
//     const endNode = graphNodes[end];

//     if (!startNode || !endNode) return null;

//     if (!isHighlighted) return null;

//     return (
//         <line
//             x1={startNode.x}
//             y1={startNode.y}
//             x2={endNode.x}
//             y2={endNode.y}
//             // stroke={isHighlighted ? '#FF8C00' : '#BF5700'}
//             stroke={isHighlighted ? '#000' : '#BF5700'} // TODO
//             // strokeWidth={isHighlighted ? '4' : '2'}
//             strokeWidth={isHighlighted ? '10' : '2'}
//             strokeLinecap='round'
//             className={`opacity-60 ${isHighlighted ? 'z-10000' : ''}`}
//         />
//     );
// };
