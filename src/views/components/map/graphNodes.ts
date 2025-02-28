import type { Graph, NodeCoordinates } from './types';

/**
 * A constant object representing the graph nodes for a map.
 *
 * The graph nodes are categorized into two types: buildings and intersections.
 * Each node has coordinates (x, y) and a type indicating whether it is a building or an intersection.
 */
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
    WAG: {
        x: 230,
        y: 330,
        type: 'building',
    },
    BEL: {
        x: 365,
        y: 377,
        type: 'building',
    },
    NEZ: {
        x: 403,
        y: 335,
        type: 'building',
    },
    SEZ: {
        x: 403,
        y: 408,
        type: 'building',
    },
    STD: {
        x: 430,
        y: 377,
        type: 'building',
    },
    MNC: {
        x: 405,
        y: 430,
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
    POB: {
        x: 258,
        y: 265,
        type: 'building',
    },
    PPE: {
        x: 282,
        y: 265,
        type: 'building',
    },
    PPL: {
        x: 302,
        y: 280,
        type: 'building',
    },
    CS6: {
        x: 287,
        y: 280,
        type: 'building',
    },
    JGB: {
        x: 287,
        y: 298,
        type: 'building',
    },
    LTH: {
        x: 305,
        y: 296,
        type: 'building',
    },
    PPA: {
        x: 330,
        y: 258,
        type: 'building',
    },
    WIN: {
        x: 330,
        y: 295,
        type: 'building',
    },
    EPS: {
        x: 258,
        y: 308,
        type: 'building',
    },
    BRB: {
        x: 258,
        y: 328,
        type: 'building',
    },
    UTX: {
        x: 337,
        y: 358,
        type: 'building',
    },
    MHD: {
        x: 308,
        y: 388,
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
        y: 180,
        type: 'building',
    },
    GLT: {
        x: 285,
        y: 237,
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
    CAL: {
        x: 147,
        y: 370,
        type: 'building',
    },
    HRH: {
        x: 147,
        y: 387,
        type: 'building',
    },
    BAT: {
        x: 187,
        y: 355,
        type: 'building',
    },
    MEZ: {
        x: 187,
        y: 370,
        type: 'building',
    },
    BEN: {
        x: 187,
        y: 387,
        type: 'building',
    },
    BTL: {
        x: 137,
        y: 327,
        type: 'building',
    },
    WMB: {
        x: 128,
        y: 335,
        type: 'building',
    },
    GOL: {
        x: 105,
        y: 330,
        type: 'building',
    },
    SUT: {
        x: 122,
        y: 352,
        type: 'building',
    },
    HMA: {
        x: 122,
        y: 278,
        type: 'building',
    },
    GEB: {
        x: 190,
        y: 290,
        type: 'building',
    },
    WCH: {
        x: 200,
        y: 300,
        type: 'building',
    },
    GAR: {
        x: 198,
        y: 335,
        type: 'building',
    },
    BOT: {
        x: 141,
        y: 270,
        type: 'building',
    },
    BIO: {
        x: 148,
        y: 258,
        type: 'building',
    },
    PAI: {
        x: 183,
        y: 258,
        type: 'building',
    },
    GEA: {
        x: 166,
        y: 235,
        type: 'building',
    },
    GWB: {
        x: 142,
        y: 238,
        type: 'building',
    },
    NHB: {
        x: 205,
        y: 235,
        type: 'building',
    },
    FNT: {
        x: 205,
        y: 227,
        type: 'building',
    },
    AHG: {
        x: 212,
        y: 212,
        type: 'building',
    },
    PHR: {
        x: 186,
        y: 224,
        type: 'building',
    },
    MBB: {
        x: 230,
        y: 200,
        type: 'building',
    },
    NMS: {
        x: 215,
        y: 175,
        type: 'building',
    },
    BUR: {
        x: 189,
        y: 187,
        type: 'building',
    },
    BME: {
        x: 175,
        y: 175,
        type: 'building',
    },
    WWH: {
        x: 75,
        y: 185,
        type: 'building',
    },
    CMB: {
        x: 98,
        y: 189,
        type: 'building',
    },
    CMA: {
        x: 112,
        y: 180,
        type: 'building',
    },
    HSM: {
        x: 112,
        y: 199,
        type: 'building',
    },
    LCH: {
        x: 111,
        y: 213,
        type: 'building',
    },
    LFH: {
        x: 114,
        y: 230,
        type: 'building',
    },
    AND: {
        x: 143,
        y: 221,
        type: 'building',
    },
    BLD: {
        x: 156,
        y: 202,
        type: 'building',
    },
    CRD: {
        x: 132,
        y: 201,
        type: 'building',
    },
    LTD: {
        x: 142,
        y: 177,
        type: 'building',
    },
    KIN: {
        x: 148,
        y: 140,
        type: 'building',
    },
    // JCD has two places on the map so we will use the center of the two
    JCD: {
        x: 280,
        y: 440,
        type: 'building',
    },
    LDH: {
        x: 285,
        y: 425,
        type: 'building',
    },
    BHD: {
        x: 293,
        y: 405,
        type: 'building',
    },
    RHD: {
        x: 312,
        y: 405,
        type: 'building',
    },
    PHD: {
        x: 322,
        y: 432,
        type: 'building',
    },
    SJH: {
        x: 348,
        y: 425,
        type: 'building',
    },
    CCF: {
        x: 348,
        y: 471,
        type: 'building',
    },
    BMA: {
        x: 249,
        y: 491,
        type: 'building',
    },
    BMS: {
        x: 222,
        y: 488,
        type: 'building',
    },
    SZB: {
        x: 202,
        y: 470,
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
    'wichita-mlk-jr': {
        x: 187,
        y: 498,
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
    'san-jac-mlk-jr': {
        x: 310,
        y: 527,
        type: 'intersection',
    },
    'robert-dedman-mlk-jr': {
        x: 423,
        y: 552,
        type: 'intersection',
    },
    'robert-dedman-23rd': {
        x: 460,
        y: 318,
        type: 'intersection',
    },
    '23rd-circle': {
        x: 340,
        y: 318,
        type: 'intersection',
    },
} as const;

type LinearWalkway = {
    type: 'linear';
    start: NodeCoordinates;
    end: NodeCoordinates;
    namePrefix: string;
};

type BezierWalkway = {
    type: 'bezier';
    start: NodeCoordinates;
    end: NodeCoordinates;
    control1: NodeCoordinates;
    control2: NodeCoordinates;
    namePrefix: string;
};

type CircularWalkway = {
    type: 'circular';
    center: NodeCoordinates;
    radius: number;
    startAngle?: number; // in radians, default 0
    endAngle?: number; // in radians, default 2π
    namePrefix: string;
};

type Walkway = LinearWalkway | BezierWalkway | CircularWalkway;

const WALKWAY_INTERVAL = 10;

const walkways: Walkway[] = [
    // Linear walkways
    {
        type: 'linear',
        start: { x: 241, y: 83 },
        end: { x: 241, y: 468 },
        namePrefix: 'speedway-walkway',
    },
    {
        type: 'linear',
        start: { x: 89, y: 250 },
        end: { x: 357, y: 250 },
        namePrefix: '24st-walkway',
    },
    {
        type: 'linear',
        start: { x: 89, y: 400 },
        end: { x: 354, y: 400 },
        namePrefix: '21st-walkway',
    },
    {
        type: 'linear',
        start: { x: 89, y: 83 },
        end: { x: 89, y: 477 },
        namePrefix: 'guad-walkway',
    },
    {
        type: 'linear',
        start: { x: 165, y: 255 },
        end: { x: 165, y: 168 },
        namePrefix: 'university-ave-walkway',
    },
    {
        type: 'linear',
        start: { x: 167, y: 310 },
        end: { x: 166, y: 400 },
        namePrefix: 's-mall-walkway',
    },
    {
        type: 'linear',
        start: { x: 167, y: 310 },
        end: { x: 315, y: 318 },
        namePrefix: 'e-mall-walkway',
    },
    {
        type: 'linear',
        start: { x: 167, y: 310 },
        end: { x: 89, y: 317 },
        namePrefix: 'w-mall-walkway',
    },
    {
        type: 'linear',
        start: { x: 89, y: 168 },
        end: { x: 315, y: 168 },
        namePrefix: 'dean-keeton-walkway',
    },
    {
        type: 'linear',
        start: { x: 36, y: 83 },
        end: { x: 241, y: 83 },
        namePrefix: '27th-walkway',
    },
    {
        type: 'linear',
        start: { x: 89, y: 477 },
        end: { x: 423, y: 552 },
        namePrefix: 'mlk-jr-walkway',
    },
    {
        type: 'linear',
        start: { x: 187, y: 400 },
        end: { x: 187, y: 498 },
        namePrefix: 'wichita-walkway',
    },
    {
        type: 'linear',
        start: { x: 273, y: 468 },
        end: { x: 273, y: 518 },
        namePrefix: 'brazos-walkway',
    },
    {
        type: 'linear',
        start: { x: 460, y: 318 },
        end: { x: 423, y: 552 },
        namePrefix: 'robert-dedman-walkway',
    },
    {
        type: 'linear',
        start: { x: 340, y: 318 },
        end: { x: 460, y: 318 },
        namePrefix: '23rd-walkway',
    },

    // Bezier curves
    {
        type: 'bezier',
        start: { x: 190, y: 282 },
        end: { x: 190, y: 347 },
        control1: { x: 218, y: 282 },
        control2: { x: 233, y: 347 },
        namePrefix: 'inner-campus-drive-curve',
    },
    {
        type: 'bezier',
        start: { x: 315, y: 168 },
        end: { x: 357, y: 250 },
        control1: { x: 310, y: 200 },
        control2: { x: 363, y: 223 },
        namePrefix: 'san-jac-bezier-curve-1',
    },
    {
        type: 'bezier',
        start: { x: 357, y: 250 },
        end: { x: 354, y: 400 },
        control1: { x: 367, y: 296 },
        control2: { x: 348, y: 360 },
        namePrefix: 'san-jac-bezier-curve-2',
    },
    {
        type: 'bezier',
        start: { x: 354, y: 400 },
        end: { x: 357, y: 510 },
        control1: { x: 400, y: 460 },
        control2: { x: 389, y: 487 },
        namePrefix: 'san-jac-bezier-curve-3',
    },
    {
        type: 'bezier',
        start: { x: 371, y: 498 },
        end: { x: 310, y: 527 },
        control1: { x: 330, y: 527 },
        control2: { x: 322, y: 505 },
        namePrefix: 'san-jac-bezier-curve-4',
    },
    {
        type: 'bezier',
        start: { x: 241, y: 468 },
        end: { x: 325, y: 449 },
        control1: { x: 317, y: 472 },
        control2: { x: 313, y: 468 },
        namePrefix: 'jester-circle-curve',
    },

    // Circular walkways
    {
        type: 'circular',
        center: { x: 330, y: 318 },
        radius: 10,
        namePrefix: '23rd-circle',
    },
];

/**
 * Calculates a point on a cubic Bézier curve.
 *
 * @param t - The time value between 0 and 1.
 * @param start - The starting point of the curve.
 * @param end - The ending point of the curve.
 * @param control1 - The first control point of the curve.
 * @param control2 - The second control point of the curve.
 *
 * @returns The calculated point on the curve.
 */
const getBezierPoint = (
    t: number,
    start: NodeCoordinates,
    end: NodeCoordinates,
    control1: NodeCoordinates,
    control2: NodeCoordinates
): NodeCoordinates => {
    const oneMinusT = 1 - t;
    const oneMinusTSquared = oneMinusT * oneMinusT;
    const oneMinusTCubed = oneMinusTSquared * oneMinusT;
    const tSquared = t * t;
    const tCubed = tSquared * t;

    return {
        x: Math.round(
            oneMinusTCubed * start.x +
                3 * oneMinusTSquared * t * control1.x +
                3 * oneMinusT * tSquared * control2.x +
                tCubed * end.x
        ),
        y: Math.round(
            oneMinusTCubed * start.y +
                3 * oneMinusTSquared * t * control1.y +
                3 * oneMinusT * tSquared * control2.y +
                tCubed * end.y
        ),
    };
};

/**
 * Estimates the length of a cubic Bézier curve.
 *
 * @param start - The starting point of the curve.
 * @param end - The ending point of the curve.
 * @param control1 - The first control point of the curve.
 * @param control2 - The second control point of the curve.
 * @param segments - The number of segments to use for the estimation.
 *
 * @returns The estimated length of the curve.
 */
const estimateBezierLength = (
    start: NodeCoordinates,
    end: NodeCoordinates,
    control1: NodeCoordinates,
    control2: NodeCoordinates,
    segments: number = 100
): number => {
    let length = 0;
    let previousPoint = start;

    for (let i = 1; i <= segments; i++) {
        const t = i / segments;
        const currentPoint = getBezierPoint(t, start, end, control1, control2);

        const dx = currentPoint.x - previousPoint.x;
        const dy = currentPoint.y - previousPoint.y;
        length += Math.sqrt(dx * dx + dy * dy);

        previousPoint = currentPoint;
    }

    return length;
};

/**
 * Calculates a point on a circle given a center, radius, and angle.
 *
 * @param center - The center of the circle.
 * @param radius - The radius of the circle.
 * @param angle - The angle in radians.
 *
 * @returns The calculated point on the circle.
 */
const getCirclePoint = (center: NodeCoordinates, radius: number, angle: number): NodeCoordinates => ({
    x: Math.round(center.x + radius * Math.cos(angle)),
    y: Math.round(center.y + radius * Math.sin(angle)),
});

/**
 * Generates nodes for a linear walkway.
 *
 * @param config - The configuration object for the walkway.
 *
 * @returns The generated nodes for the walkway.
 */
const generateLinearWalkwayNodes = (config: LinearWalkway): Graph => {
    const { start, end, namePrefix } = config;
    const nodes: Graph = {};

    const dx = end.x - start.x;
    const dy = end.y - start.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    const numPoints = Math.floor(distance / WALKWAY_INTERVAL);

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

/**
 * Generates nodes for a Bézier walkway.
 *
 * @param config - The configuration object for the walkway.
 *
 * @returns The generated nodes for the walkway.
 */
const generateBezierWalkwayNodes = (config: BezierWalkway): Graph => {
    const { start, end, control1, control2, namePrefix } = config;
    const nodes: Graph = {};

    // Estimate the curve length to determine number of points
    const approximateLength = estimateBezierLength(start, end, control1, control2);
    const numPoints = Math.floor(approximateLength / WALKWAY_INTERVAL);

    for (let i = 1; i < numPoints; i++) {
        const t = i / numPoints;
        const point = getBezierPoint(t, start, end, control1, control2);

        const nodeName = `${namePrefix}-${i}` as keyof Graph;
        nodes[nodeName] = {
            x: point.x,
            y: point.y,
            type: 'walkway',
        };
    }

    return nodes;
};

/**
 * Generates nodes for a circular walkway.
 *
 * @param config - The configuration object for the walkway.
 *
 * @returns The generated nodes for the walkway.
 */
const generateCircularWalkwayNodes = (config: CircularWalkway): Graph => {
    const { center, radius, namePrefix, startAngle = 0, endAngle = 2 * Math.PI } = config;
    const nodes: Graph = {};

    // Calculate circumference to determine number of points
    const arcLength = radius * (endAngle - startAngle);
    const numPoints = Math.floor(arcLength / WALKWAY_INTERVAL);

    // Generate points along the circle
    for (let i = 0; i < numPoints; i++) {
        const angle = startAngle + (endAngle - startAngle) * (i / numPoints);
        const point = getCirclePoint(center, radius, angle);

        const nodeName = `${namePrefix}-${i}` as keyof Graph;
        nodes[nodeName] = {
            x: point.x,
            y: point.y,
            type: 'walkway',
        };
    }

    return nodes;
};

/**
 * Generates all walkway nodes for the map.
 *
 * @param config - The configuration object for the walkway.
 *
 * @returns The combined graph with walkway nodes.
 */
const generateWalkwayNodes = (config: Walkway): Graph => {
    switch (config.type) {
        case 'bezier':
            return generateBezierWalkwayNodes(config);
        case 'circular':
            return generateCircularWalkwayNodes(config);
        default:
            return generateLinearWalkwayNodes(config);
    }
};

/**
 * Generates all walkway nodes for the map.
 *
 * @returns The combined graph with all walkway nodes.
 */
const generateAllWalkwayNodes = (): Graph => {
    const generatedNodes = walkways.reduce((acc, config) => {
        const nodes = generateWalkwayNodes(config);
        return { ...acc, ...nodes };
    }, {} as Graph);

    return {
        ...rawGraphNodes,
        ...generatedNodes,
    };
};

// Export the combined graph with walkway nodes
export const graphNodes = generateAllWalkwayNodes();
