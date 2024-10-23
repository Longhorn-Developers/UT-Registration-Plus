import type { MainCampusBuildingsCode } from '@shared/types/MainCampusBuildings';
import React from 'react';

// Type definitions
type NodeType = 'building' | 'intersection';

interface Node {
    x: number;
    y: number;
    // connections: string[];
    type: NodeType;
}

interface GraphNodes {
    [key: string]: Node;
}

interface Path {
    id: string;
    points: string[]; // Array of node IDs representing the path
}

// Helper functions for path finding
export const findNearestIntersection = (buildingId: string, graph: GraphNodes): string => {
    const building = graph[buildingId];
    let nearestIntersection = '';
    let shortestDistance = Infinity;

    Object.entries(graph).forEach(([nodeId, node]) => {
        if (node.type === 'intersection' && building) {
            const distance = Math.sqrt((node.x - building.x) ** 2 + (node.y - building.y) ** 2);
            if (distance < shortestDistance) {
                shortestDistance = distance;
                nearestIntersection = nodeId;
            }
        }
    });

    return nearestIntersection;
};

// Get all buildings from the graph
export const getAllBuildings = (graph: GraphNodes): string[] =>
    Object.entries(graph)
        .filter(([_key, node]) => node.type === 'building')
        .map(([id]) => id);

// Generate all possible building-to-building paths
export const generateAllBuildingPaths = (): Path[] => {
    const buildings = getAllBuildings(graphNodes);
    const paths: Path[] = [];

    for (let i = 0; i < buildings.length; i++) {
        for (let j = i + 1; j < buildings.length; j++) {
            const building1 = buildings[i];
            const building2 = buildings[j];

            if (building1 && building2) {
                // Get nearest intersections for both buildings
                const int1 = findNearestIntersection(building1, graphNodes);
                const int2 = findNearestIntersection(building2, graphNodes);

                paths.push({
                    id: `${building1}-${building2}`,
                    points: [building1, int1, int2, building2],
                });
            }
        }
    }

    return paths;
};

// Draw a single path segment
export const PathSegment = ({
    start,
    end,
    isHighlighted,
}: {
    start: string;
    end: string;
    isHighlighted?: boolean;
}): JSX.Element | null => {
    const startNode = graphNodes[start];
    const endNode = graphNodes[end];

    if (!startNode || !endNode) return null;

    return (
        <line
            x1={startNode.x}
            y1={startNode.y}
            x2={endNode.x}
            y2={endNode.y}
            // stroke={isHighlighted ? '#FF8C00' : '#BF5700'}
            stroke={isHighlighted ? '#000' : '#BF5700'} // TODO
            // strokeWidth={isHighlighted ? '4' : '2'}
            strokeWidth={isHighlighted ? '10' : '2'}
            strokeLinecap='round'
            className={`opacity-60 ${isHighlighted ? 'z-1000' : ''}`}
        />
    );
};

export const graphNodes: GraphNodes = {
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
    GRE: {
        x: 260,
        y: 375,
        type: 'building',
    },
    MAI: {
        x: 167,
        y: 310,
        type: 'building',
    },
    WEL: {
        x: 216,
        y: 268,
        type: 'building',
    },
    BEL: {
        x: 365,
        y: 377,
        type: 'building',
    },
    WCP: {
        x: 260,
        y: 343,
        type: 'building',
    },
    RLP: {
        x: 300,
        y: 335,
        type: 'building',
    },
    UTC: {
        x: 197,
        y: 410,
        type: 'building',
    },
    CBA: {
        x: 232,
        y: 363,
        type: 'building',
    },
    GSB: {
        x: 208,
        y: 382,
        type: 'building',
    },
    PMA: {
        x: 255,
        y: 185,
        type: 'building',
    },
    PAT: {
        x: 258,
        y: 222,
        type: 'building',
    },
    EER: {
        x: 289,
        y: 208,
        type: 'building',
    },
    ECJ: {
        x: 289,
        y: 280,
        type: 'building',
    },
    UNB: {
        x: 105,
        y: 288,
        type: 'building',
    },
    FAC: {
        x: 133,
        y: 298,
        type: 'building',
    },
    HRC: {
        x: 112,
        y: 380,
        type: 'building',
    },
    COM: {
        x: 195,
        y: 318,
        type: 'building',
    },

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
    'speedway-e-mai-stairs': {
        x: 241,
        y: 315,
        type: 'intersection',
    },
    'speedway-w-eer': {
        x: 241,
        y: 208,
        type: 'intersection',
    },
    'guad-24th': {
        x: 89,
        y: 250,
        type: 'intersection',
    },
    'guad-21st': {
        x: 89,
        y: 400,
        type: 'intersection',
    },
    'guad-icd': {
        x: 89,
        y: 353,
        type: 'intersection',
    },
    'uni-ave-21st': {
        x: 166,
        y: 400,
        type: 'intersection',
    },
    'wichita-21st': {
        x: 187,
        y: 400,
        type: 'intersection',
    },
    'n-mai-24th': {
        x: 167,
        y: 250,
        type: 'intersection',
    },
    's-mai-stairs': {
        x: 167,
        y: 347,
        type: 'intersection',
    },
    'e-mai-stairs': {
        x: 215,
        y: 315,
        type: 'intersection',
    },
    'guad-w-mai': {
        x: 89,
        y: 317,
        type: 'intersection',
    },
    'n-mai-turtle-pond': {
        x: 167,
        y: 282,
        type: 'intersection',
    },
    'icd-ne': {
        x: 207,
        y: 289,
        type: 'intersection',
    },
    'icd-nne': {
        x: 190,
        y: 282,
        type: 'intersection',
    },
    'icd-se': {
        x: 212,
        y: 338,
        type: 'intersection',
    },
    'icd-sse': {
        x: 190,
        y: 347,
        type: 'intersection',
    },
    'san-jac-21th': {
        x: 354,
        y: 400,
        type: 'intersection',
    },
    'san-jac-24th': {
        x: 357,
        y: 250,
        type: 'intersection',
    },
    'san-jac-23rd': {
        x: 358,
        y: 318,
        type: 'intersection',
    },
    'mlk-jr-statue': {
        x: 280,
        y: 318,
        type: 'intersection',
    },
    'pcl-nw-21st-walkway': {
        x: 208,
        y: 400,
        type: 'intersection',
    },
    'pcl-w-speedway': {
        x: 241,
        y: 425,
        type: 'intersection',
    },
};
