// Constants
export const WALKING_SPEED = 246.4; // ~2.8 mph in feet per minute
export const PIXELS_TO_FEET = 9.3895; // Approximate scale factor

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

// Type guard to check if a node exists in the graph
export const isValidNode = (node: MapNode | undefined): node is MapNode =>
    node !== undefined &&
    typeof node.x === 'number' &&
    typeof node.y === 'number' &&
    (node.type === 'building' || node.type === 'intersection');

export type DayCode = 'M' | 'T' | 'W' | 'TTH' | 'F';

export const DAY_MAPPING: Record<DayCode, string> = {
    M: 'Monday',
    T: 'Tuesday',
    W: 'Wednesday',
    TTH: 'Thursday',
    F: 'Friday',
} as const;
