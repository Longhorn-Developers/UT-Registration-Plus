// Constants
export const WALKING_SPEED = 246.4; // ~2.8 mph in feet per minute
export const PIXELS_TO_FEET = 9.3895; // Approximate scale factor

export const DIRECT_PATH_THRESHOLD = 50; // Units for direct path calculation
export const NEIGHBOR_DISTANCE_THRESHOLD = 25; // Increased threshold for neighbor connections

/**
 * Represents the type of a node in the map.
 *
 * - 'building': A node representing a building.
 * - 'intersection': A node representing an intersection.
 * - 'walkway': A node representing a walkway.
 */
export type NodeType = 'building' | 'intersection' | 'walkway';

/**
 * Represents the coordinates of a node on a map.
 *
 * @typeparam x - The x-coordinate of the node.
 * @typeparam y - The y-coordinate of the node.
 */
export type NodeCoordinates = {
    x: number;
    y: number;
};

/**
 * Represents a map node with specific coordinates and a type.
 *
 * @typeparam type - The type of the node.
 */
export type MapNode = NodeCoordinates & {
    type: NodeType;
};

/**
 * Represents a graph structure where each key is a string identifier
 * and the value is a MapNode. This type is used to define the overall
 * structure of a graph in the application.
 */
export type Graph = Record<string, MapNode>;

/**
 * Represents a distance measurement.
 */
export type Distance = number;

/**
 * Represents the unique identifier for a node in the map.
 */
export type NodeId = string;

/**
 * A map that associates a node identifier with a distance.
 *
 * @typeparam NodeId - The unique identifier for a node.
 * @typeparam Distance - The distance associated with the node.
 */
export type DistanceMap = Record<NodeId, Distance>;

/**
 * A type representing a mapping of node identifiers to their previous node identifiers.
 *
 * @typeparam NodeId - The identifier of the current node.
 * @typeparam NodeId - The identifier of the previous node, or null if there is no previous node.
 */
export type PreviousMap = Record<NodeId, NodeId | null>;

/**
 * type guard to check if the given node is a valid MapNode.
 *
 * A valid MapNode is defined as:
 * - Not undefined
 * - Has numeric `x` and `y` properties
 * - Has a `type` property that is either 'building', 'intersection', or 'walkway'
 *
 * @param node - The node to validate.
 * @returns True if the node is a valid MapNode, false otherwise.
 */
export const isValidNode = (node: MapNode | undefined): node is MapNode =>
    node !== undefined &&
    typeof node.x === 'number' &&
    typeof node.y === 'number' &&
    (node.type === 'building' || node.type === 'intersection' || node.type === 'walkway');

/**
 * Represents the code for a day of the week.
 *
 * - 'M'   : Monday
 * - 'T'   : Tuesday
 * - 'W'   : Wednesday
 * - 'TH' : Thursday
 * - 'F'   : Friday
 */
export type DayCode = 'M' | 'T' | 'W' | 'TH' | 'F';

/**
 * An array of strings representing the days of the week.
 * The days are ordered starting from Monday to Sunday.
 */
export const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'] as const;

/**
 * Represents a day of the week.
 *
 * @remarks
 * This type is derived from the `DAYS` array, representing one of its elements.
 * It is used to ensure that only valid days of the week are assigned to variables of this type.
 */
export type DAY = (typeof DAYS)[number];

type DayMapping = Record<DayCode, DAY>;

/**
 * A constant object that maps single-letter day abbreviations to their full names.
 */
export const DAY_MAPPING = {
    M: 'Monday',
    T: 'Tuesday',
    W: 'Wednesday',
    TH: 'Thursday',
    F: 'Friday',
} as const satisfies DayMapping;
