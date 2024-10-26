import type { Graph, NodeCoordinates } from './types';

const rawGraphNodes: Graph = {
    // // Debug nodes
    // dn1: {
    //     x: 89,
    //     y: 83,
    //     type: 'building',
    // },
    // dn2: {
    //     x: 89,
    //     y: 445,
    //     type: 'building',
    // },

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
    CPE: {
        x: 262,
        y: 135,
        type: 'building',
    },
    ETC: {
        x: 287,
        y: 145,
        type: 'building',
    },
    PAR: {
        x: 147,
        y: 355,
        type: 'building',
    },
    MEZ: {
        x: 187,
        y: 370,
        type: 'building',
    },

    // Intersection nodes
    'speedway-dean-keeton': {
        x: 241,
        y: 168,
        type: 'intersection',
    },
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
    'speedway-jester-circle': {
        x: 241,
        y: 468,
        type: 'intersection',
    },
    'guad-dean-keeton': {
        x: 89,
        y: 168,
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
    'guad-27th': {
        x: 89,
        y: 83,
        type: 'intersection',
    },
    'guad-mlk-jr': {
        x: 89,
        y: 477,
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
    'san-jac-dean-keeton': {
        x: 315,
        y: 168,
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
    'speedway-27th': {
        x: 241,
        y: 83,
        type: 'intersection',
    },
    'nueces-27th': {
        x: 36,
        y: 83,
        type: 'intersection',
    },
} as const;

type Walkway = {
    start: NodeCoordinates;
    end: NodeCoordinates;
    namePrefix: string;
};

const WalkwayInterval = 20;

const walkways: Walkway[] = [
    {
        start: { x: 241, y: 83 },
        end: { x: 241, y: 468 },
        namePrefix: 'speedway-walkway',
    },
    {
        start: { x: 89, y: 250 },
        end: { x: 357, y: 250 },
        namePrefix: '24st-walkway',
    },
    {
        start: { x: 89, y: 400 },
        end: { x: 354, y: 400 },
        namePrefix: '21st-walkway',
    },
    {
        start: { x: 89, y: 83 },
        end: { x: 89, y: 477 },
        namePrefix: 'guad-walkway',
    },
    {
        start: { x: 89, y: 168 },
        end: { x: 315, y: 168 },
        namePrefix: 'dean-keeton-walkway',
    },
    {
        start: { x: 36, y: 83 },
        end: { x: 241, y: 83 },
        namePrefix: '27th-walkway',
    },
];

const generateWalkwayNodes = (config: Walkway): Graph => {
    const { start, end, namePrefix } = config;
    const nodes: Graph = {};

    // Calculate the total distance
    const dx = end.x - start.x;
    const dy = end.y - start.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    // Calculate number of points to generate (excluding start and end)
    const numPoints = Math.floor(distance / WalkwayInterval);

    // Generate points along the line
    for (let i = 1; i < numPoints; i++) {
        const t = i / numPoints;
        const x = Math.round(start.x + dx * t);
        const y = Math.round(start.y + dy * t);

        const nodeName = `${namePrefix}-${i}` as keyof Graph;
        nodes[nodeName] = {
            x,
            y,
            type: 'walkway',
        };
    }

    return nodes;
};

const generateAllWalkwayNodes = (): Graph => {
    // Generate nodes for each walkway and combine them
    const generatedNodes = walkways.reduce((acc, config) => {
        const nodes = generateWalkwayNodes(config);
        return { ...acc, ...nodes };
    }, {} as Graph);

    // Merge with original nodes
    return {
        ...rawGraphNodes,
        ...generatedNodes,
    };
};

// Export the combined graph with walkway nodes
export const graphNodes = generateAllWalkwayNodes();
