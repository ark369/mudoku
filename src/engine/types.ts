export type Difficulty = 'starter' | 'easy' | 'medium' | 'hard' | 'expert';

export interface DifficultyConfig {
  size: number;
  label: string;
  subtitle: string;
  badgeColor: string;
  targetRooms: [number, number];
}

export const DIFFICULTY_CONFIG: Record<Difficulty, DifficultyConfig> = {
  starter: {
    size: 5,
    label: 'Starter',
    subtitle: '5×5 • Quick & Cozy',
    badgeColor: '#1E7E6C',
    targetRooms: [4, 4],
  },
  easy: {
    size: 6,
    label: 'Easy',
    subtitle: '6×6 • Gentle Warmup',
    badgeColor: '#2E7D32',
    targetRooms: [4, 5],
  },
  medium: {
    size: 7,
    label: 'Medium',
    subtitle: '7×7 • Classic Case',
    badgeColor: '#D97706',
    targetRooms: [5, 6],
  },
  hard: {
    size: 8,
    label: 'Hard',
    subtitle: '8×8 • Clever Twist',
    badgeColor: '#C94A38',
    targetRooms: [6, 7],
  },
  expert: {
    size: 9,
    label: 'Expert',
    subtitle: '9×9 • Master Sleuth',
    badgeColor: '#6D28D9',
    targetRooms: [6, 8],
  },
};

export type Direction = 'north' | 'south' | 'east' | 'west';

export type OccupiableKind =
  | 'chair'
  | 'rug'
  | 'sofa'
  | 'bed'
  | 'booth'
  | 'stool'
  | 'bench'
  | 'car'
  | 'oil'
  | 'mat';

export type BlockingKind =
  | 'plant'
  | 'table'
  | 'shelf'
  | 'piano'
  | 'oven'
  | 'display'
  | 'fountain'
  | 'tree'
  | 'globe'
  | 'statue'
  | 'easel'
  | 'barrel'
  | 'anchor'
  | 'luggage';

export type ObjectKind = OccupiableKind | BlockingKind;

export type RoomPattern =
  | 'wood'
  | 'tile'
  | 'herringbone'
  | 'dots'
  | 'grass'
  | 'stone'
  | 'carpet'
  | 'stripes';

export interface Coord {
  r: number;
  c: number;
}

export interface Room {
  id: number;
  name: string;
  colorKey: string;
  bgHex: string;
  borderHex: string;
  pattern: RoomPattern;
  cells: Coord[];
}

export interface Cell {
  r: number;
  c: number;
  roomId: number;
  occupiable: OccupiableKind | null;
  blocking: BlockingKind | null;
}

export interface Person {
  id: string;
  letter: string;
  name: string;
  gender: 'M' | 'F';
  isVictim: boolean;
  color: string;
  portraitId: number;
  roleTitle: string;
}

export interface ClueHighlight {
  roomIds?: number[];
  negRoomIds?: number[];
  objectKinds?: ObjectKind[];
  negObjectKinds?: ObjectKind[];
  personIds?: string[];
  outerEdge?: boolean;
  negOuterEdge?: boolean;
  cells?: Coord[];
}

export interface ClueBase {
  id: string;
  ownerId: string; // personId or 'case'
  text: string;
  tier: 1 | 2 | 3;
  highlights: ClueHighlight;
}

export type Clue =
  | (ClueBase & { kind: 'in_room'; personId: string; roomId: number })
  | (ClueBase & { kind: 'not_in_room'; personId: string; roomId: number })
  | (ClueBase & { kind: 'in_either_room'; personId: string; roomIds: [number, number] })
  | (ClueBase & { kind: 'on_object'; personId: string; objectKind: OccupiableKind })
  | (ClueBase & { kind: 'not_on_object'; personId: string; objectKind: OccupiableKind })
  | (ClueBase & { kind: 'on_empty_floor'; personId: string })
  | (ClueBase & { kind: 'beside_object'; personId: string; objectKind: ObjectKind })
  | (ClueBase & { kind: 'not_beside_object'; personId: string; objectKind: ObjectKind })
  | (ClueBase & { kind: 'dir_of_object'; personId: string; objectKind: ObjectKind; dir: Direction })
  | (ClueBase & { kind: 'outer_edge'; personId: string })
  | (ClueBase & { kind: 'not_outer_edge'; personId: string })
  | (ClueBase & { kind: 'alone_in_room'; personId: string; roomId: number })
  | (ClueBase & { kind: 'alone_somewhere'; personId: string })
  | (ClueBase & { kind: 'only_on_object'; personId: string; objectKind: OccupiableKind })
  | (ClueBase & { kind: 'only_beside_object'; personId: string; objectKind: ObjectKind })
  | (ClueBase & { kind: 'room_empty'; roomId: number })
  | (ClueBase & { kind: 'room_exact_count'; roomId: number; count: number })
  | (ClueBase & { kind: 'same_room_as'; personId: string; otherId: string })
  | (ClueBase & { kind: 'diff_room_from'; personId: string; otherId: string })
  | (ClueBase & { kind: 'dir_from_person'; personId: string; otherId: string; dir: Direction })
  | (ClueBase & { kind: 'diagonal_to_person'; personId: string; otherId: string })
  | (ClueBase & { kind: 'victim_alone_with_killer'; victimId: string });

export type DistributiveOmit<T, K extends PropertyKey> = T extends unknown ? Omit<T, K> : never;
export type ClueDraft = DistributiveOmit<Clue, 'text' | 'highlights'>;

export interface DeductionStep {
  level: 1 | 2 | 3;
  rule: string;
  explanation: string;
  nudge: string;
  involvedClueIds: string[];
  highlightCells: Coord[];
  targetPersonId?: string;
  placement?: { personId: string; r: number; c: number };
  eliminations?: { personId: string; r: number; c: number }[];
  survivingCells?: Coord[];
}

export interface PuzzleMetrics {
  maxLevel: number;
  stepCount: number;
  initialSingles: number;
  victimDepth: number;
}

export interface Puzzle {
  seed: string;
  difficulty: Difficulty;
  size: number;
  themeId: string;
  title: string;
  premise: string;
  stolenItem: string;
  curatedId?: string;
  caseNumber?: number;
  tagline?: string;
  patternBadge?: string;
  rooms: Room[];
  grid: Cell[][];
  people: Person[];
  victimId: string;
  killerId: string;
  clues: Clue[];
  solution: Record<string, Coord>;
  metrics: PuzzleMetrics;
}
