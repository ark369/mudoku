import { computeClueHighlights, formatClueText } from './predicates';
import type {
  BlockingKind,
  Cell,
  Clue,
  ClueDraft,
  Coord,
  Difficulty,
  OccupiableKind,
  Person,
  Puzzle,
  PuzzleMetrics,
  Room,
  RoomPattern,
} from './types';

export interface CuratedRoomSpec {
  id: number;
  name: string;
  colorKey: string;
  bgHex: string;
  borderHex: string;
  pattern: RoomPattern;
}

export interface CuratedObjectSpec {
  r: number;
  c: number;
  occupiable?: OccupiableKind;
  blocking?: BlockingKind;
}

export interface CuratedCaseSpec {
  id: string;
  caseNumber: number;
  difficulty: Difficulty;
  size: number;
  themeId: string;
  title: string;
  tagline: string;
  premise: string;
  stolenItem: string;
  patternBadge?: string;
  seed: string;
  rooms: CuratedRoomSpec[];
  roomGrid: number[][];
  objects: CuratedObjectSpec[];
  people: Person[];
  victimId: string;
  killerId: string;
  solution: Record<string, Coord>;
  clues: ClueDraft[];
  metrics: PuzzleMetrics;
}

export const CURATED_CASES: readonly CuratedCaseSpec[] = [
  {
    "id": "starter-1",
    "caseNumber": 1,
    "difficulty": "starter",
    "size": 5,
    "themeId": "bakery",
    "title": "The Missing Birthday Cake",
    "tagline": "Someone swiped the surprise party cake right before the candles went on.",
    "premise": "Ten minutes before the surprise birthday toast, the three-tier cake vanished from the bakery! Place every guest on the floor plan to catch who was alone with the victim.",
    "stolenItem": "the three-tier birthday cake",
    "seed": "STARTER-1",
    "rooms": [
      {
        "id": 0,
        "name": "Cafe Alcove",
        "colorKey": "sky",
        "bgHex": "#E3EEF7",
        "borderHex": "#638DB5",
        "pattern": "tile"
      },
      {
        "id": 1,
        "name": "Pastry Corner",
        "colorKey": "butter",
        "bgHex": "#FBF1D6",
        "borderHex": "#C8A85B",
        "pattern": "wood"
      },
      {
        "id": 2,
        "name": "Storage",
        "colorKey": "sage",
        "bgHex": "#E3EFE4",
        "borderHex": "#6E9A74",
        "pattern": "grass"
      },
      {
        "id": 3,
        "name": "Kitchen",
        "colorKey": "sky",
        "bgHex": "#E3EEF7",
        "borderHex": "#638DB5",
        "pattern": "tile"
      }
    ],
    "roomGrid": [
      [
        0,
        0,
        0,
        2,
        2
      ],
      [
        0,
        0,
        0,
        2,
        2
      ],
      [
        1,
        1,
        1,
        2,
        2
      ],
      [
        1,
        1,
        1,
        3,
        3
      ],
      [
        1,
        1,
        1,
        3,
        3
      ]
    ],
    "objects": [
      {
        "r": 0,
        "c": 0,
        "occupiable": "stool"
      },
      {
        "r": 0,
        "c": 1,
        "occupiable": "booth"
      },
      {
        "r": 0,
        "c": 4,
        "blocking": "display"
      },
      {
        "r": 1,
        "c": 0,
        "blocking": "oven"
      },
      {
        "r": 1,
        "c": 2,
        "occupiable": "chair"
      },
      {
        "r": 1,
        "c": 4,
        "occupiable": "booth"
      },
      {
        "r": 2,
        "c": 0,
        "occupiable": "stool"
      },
      {
        "r": 2,
        "c": 1,
        "occupiable": "chair"
      },
      {
        "r": 3,
        "c": 0,
        "blocking": "table"
      },
      {
        "r": 3,
        "c": 3,
        "occupiable": "stool"
      },
      {
        "r": 3,
        "c": 4,
        "blocking": "oven"
      },
      {
        "r": 4,
        "c": 0,
        "blocking": "table"
      }
    ],
    "people": [
      {
        "id": "A",
        "letter": "A",
        "name": "Alice",
        "gender": "F",
        "isVictim": false,
        "color": "#D64550",
        "portraitId": 1,
        "roleTitle": "Cake Decorator"
      },
      {
        "id": "B",
        "letter": "B",
        "name": "Beatrice",
        "gender": "F",
        "isVictim": false,
        "color": "#2B7A78",
        "portraitId": 3,
        "roleTitle": "Party Host"
      },
      {
        "id": "C",
        "letter": "C",
        "name": "Cedric",
        "gender": "M",
        "isVictim": false,
        "color": "#D97706",
        "portraitId": 4,
        "roleTitle": "Delivery Cyclist"
      },
      {
        "id": "D",
        "letter": "D",
        "name": "Dante",
        "gender": "M",
        "isVictim": false,
        "color": "#3B66B0",
        "portraitId": 6,
        "roleTitle": "Pastry Apprentice"
      },
      {
        "id": "V",
        "letter": "V",
        "name": "Victor",
        "gender": "M",
        "isVictim": true,
        "color": "#B8860B",
        "portraitId": 20,
        "roleTitle": "Birthday VIP"
      }
    ],
    "victimId": "V",
    "killerId": "D",
    "solution": {
      "V": {
        "r": 2,
        "c": 3
      },
      "D": {
        "r": 1,
        "c": 4
      },
      "A": {
        "r": 3,
        "c": 1
      },
      "B": {
        "r": 0,
        "c": 0
      },
      "C": {
        "r": 4,
        "c": 2
      }
    },
    "clues": [
      {
        "id": "beside_12",
        "ownerId": "A",
        "tier": 1,
        "kind": "beside_object",
        "personId": "A",
        "objectKind": "table"
      },
      {
        "id": "alone_rm_30",
        "ownerId": "B",
        "tier": 1,
        "kind": "alone_in_room",
        "personId": "B",
        "roomId": 0
      },
      {
        "id": "edge_67",
        "ownerId": "C",
        "tier": 1,
        "kind": "outer_edge",
        "personId": "C"
      },
      {
        "id": "in_rm_59",
        "ownerId": "C",
        "tier": 1,
        "kind": "in_room",
        "personId": "C",
        "roomId": 1
      },
      {
        "id": "only_on_89",
        "ownerId": "D",
        "tier": 1,
        "kind": "only_on_object",
        "personId": "D",
        "objectKind": "booth"
      },
      {
        "id": "vic_106",
        "ownerId": "V",
        "tier": 1,
        "kind": "victim_alone_with_killer",
        "victimId": "V"
      }
    ],
    "metrics": {
      "maxLevel": 1,
      "stepCount": 9,
      "initialSingles": 1,
      "victimDepth": 9
    }
  },
  {
    "id": "starter-2",
    "caseNumber": 2,
    "difficulty": "starter",
    "size": 5,
    "themeId": "garage",
    "title": "Sunday Tune-Up",
    "tagline": "A weekend wash-and-wax turns into a missing hood emblem mystery.",
    "premise": "During Sunday’s classic-car tune-up, the lucky chrome hood emblem disappeared from the counter! Map everyone in the garage to see who was alone with the victim.",
    "stolenItem": "the lucky chrome hood emblem",
    "seed": "STARTER-2",
    "rooms": [
      {
        "id": 0,
        "name": "Driveway",
        "colorKey": "butter",
        "bgHex": "#FBF1D6",
        "borderHex": "#C8A85B",
        "pattern": "wood"
      },
      {
        "id": 1,
        "name": "Main Bay",
        "colorKey": "sky",
        "bgHex": "#E3EEF7",
        "borderHex": "#638DB5",
        "pattern": "tile"
      },
      {
        "id": 2,
        "name": "Parts Room",
        "colorKey": "sky",
        "bgHex": "#E3EEF7",
        "borderHex": "#638DB5",
        "pattern": "tile"
      },
      {
        "id": 3,
        "name": "Paint Booth",
        "colorKey": "sage",
        "bgHex": "#E3EFE4",
        "borderHex": "#6E9A74",
        "pattern": "grass"
      }
    ],
    "roomGrid": [
      [
        2,
        2,
        3,
        3,
        3
      ],
      [
        2,
        2,
        3,
        3,
        3
      ],
      [
        0,
        0,
        0,
        1,
        1
      ],
      [
        0,
        0,
        0,
        1,
        1
      ],
      [
        0,
        0,
        0,
        1,
        1
      ]
    ],
    "objects": [
      {
        "r": 0,
        "c": 0,
        "occupiable": "bench"
      },
      {
        "r": 0,
        "c": 3,
        "blocking": "barrel"
      },
      {
        "r": 0,
        "c": 4,
        "occupiable": "bench"
      },
      {
        "r": 1,
        "c": 1,
        "blocking": "table"
      },
      {
        "r": 1,
        "c": 2,
        "occupiable": "oil"
      },
      {
        "r": 1,
        "c": 4,
        "occupiable": "oil"
      },
      {
        "r": 2,
        "c": 0,
        "blocking": "barrel"
      },
      {
        "r": 2,
        "c": 2,
        "occupiable": "car"
      },
      {
        "r": 2,
        "c": 4,
        "occupiable": "bench"
      },
      {
        "r": 3,
        "c": 1,
        "blocking": "plant"
      },
      {
        "r": 3,
        "c": 3,
        "blocking": "table"
      },
      {
        "r": 4,
        "c": 1,
        "occupiable": "car"
      }
    ],
    "people": [
      {
        "id": "A",
        "letter": "A",
        "name": "Alice",
        "gender": "F",
        "isVictim": false,
        "color": "#D64550",
        "portraitId": 1,
        "roleTitle": "Head Mechanic"
      },
      {
        "id": "B",
        "letter": "B",
        "name": "Barnaby",
        "gender": "M",
        "isVictim": false,
        "color": "#2B7A78",
        "portraitId": 2,
        "roleTitle": "Car Owner"
      },
      {
        "id": "C",
        "letter": "C",
        "name": "Cedric",
        "gender": "M",
        "isVictim": false,
        "color": "#D97706",
        "portraitId": 4,
        "roleTitle": "Detailer"
      },
      {
        "id": "D",
        "letter": "D",
        "name": "Dante",
        "gender": "M",
        "isVictim": false,
        "color": "#3B66B0",
        "portraitId": 6,
        "roleTitle": "Parts Clerk"
      },
      {
        "id": "V",
        "letter": "V",
        "name": "Vincent",
        "gender": "M",
        "isVictim": true,
        "color": "#B8860B",
        "portraitId": 22,
        "roleTitle": "Shop Manager"
      }
    ],
    "victimId": "V",
    "killerId": "A",
    "solution": {
      "V": {
        "r": 2,
        "c": 1
      },
      "A": {
        "r": 3,
        "c": 0
      },
      "C": {
        "r": 0,
        "c": 4
      },
      "D": {
        "r": 4,
        "c": 3
      },
      "B": {
        "r": 1,
        "c": 2
      }
    },
    "clues": [
      {
        "id": "dir_obj_10",
        "ownerId": "A",
        "tier": 1,
        "kind": "dir_of_object",
        "personId": "A",
        "objectKind": "barrel",
        "dir": "south"
      },
      {
        "id": "only_on_34",
        "ownerId": "B",
        "tier": 1,
        "kind": "only_on_object",
        "personId": "B",
        "objectKind": "oil"
      },
      {
        "id": "in_rm_48",
        "ownerId": "C",
        "tier": 1,
        "kind": "in_room",
        "personId": "C",
        "roomId": 3
      },
      {
        "id": "on_obj_55",
        "ownerId": "C",
        "tier": 1,
        "kind": "on_object",
        "personId": "C",
        "objectKind": "bench"
      },
      {
        "id": "edge_88",
        "ownerId": "D",
        "tier": 1,
        "kind": "outer_edge",
        "personId": "D"
      },
      {
        "id": "vic_101",
        "ownerId": "V",
        "tier": 1,
        "kind": "victim_alone_with_killer",
        "victimId": "V"
      }
    ],
    "metrics": {
      "maxLevel": 1,
      "stepCount": 7,
      "initialSingles": 1,
      "victimDepth": 6
    }
  },
  {
    "id": "starter-3",
    "caseNumber": 3,
    "difficulty": "starter",
    "size": 5,
    "themeId": "library",
    "title": "Quiet Hour at Maplewood",
    "tagline": "A signed comic book disappears right before the kids’ reading club.",
    "premise": "Just before afternoon story hour at Maplewood Library, the prized signed comic book vanished! Deduce where each reader was seated to find who was alone with the victim.",
    "stolenItem": "the signed comic book",
    "seed": "STARTER-3",
    "rooms": [
      {
        "id": 0,
        "name": "Map Room",
        "colorKey": "butter",
        "bgHex": "#FBF1D6",
        "borderHex": "#C8A85B",
        "pattern": "wood"
      },
      {
        "id": 1,
        "name": "Reading Hall",
        "colorKey": "sky",
        "bgHex": "#E3EEF7",
        "borderHex": "#638DB5",
        "pattern": "tile"
      },
      {
        "id": 2,
        "name": "Study Carrel",
        "colorKey": "sky",
        "bgHex": "#E3EEF7",
        "borderHex": "#638DB5",
        "pattern": "tile"
      },
      {
        "id": 3,
        "name": "Bookbindery",
        "colorKey": "sage",
        "bgHex": "#E3EFE4",
        "borderHex": "#6E9A74",
        "pattern": "grass"
      }
    ],
    "roomGrid": [
      [
        0,
        0,
        0,
        1,
        1
      ],
      [
        0,
        0,
        0,
        1,
        1
      ],
      [
        0,
        0,
        0,
        1,
        1
      ],
      [
        2,
        2,
        3,
        3,
        3
      ],
      [
        2,
        2,
        3,
        3,
        3
      ]
    ],
    "objects": [
      {
        "r": 0,
        "c": 2,
        "occupiable": "sofa"
      },
      {
        "r": 0,
        "c": 4,
        "blocking": "plant"
      },
      {
        "r": 1,
        "c": 2,
        "occupiable": "chair"
      },
      {
        "r": 2,
        "c": 0,
        "blocking": "table"
      },
      {
        "r": 2,
        "c": 1,
        "blocking": "table"
      },
      {
        "r": 2,
        "c": 2,
        "occupiable": "chair"
      },
      {
        "r": 3,
        "c": 0,
        "blocking": "globe"
      },
      {
        "r": 3,
        "c": 2,
        "occupiable": "rug"
      },
      {
        "r": 3,
        "c": 4,
        "blocking": "plant"
      },
      {
        "r": 4,
        "c": 0,
        "occupiable": "chair"
      },
      {
        "r": 4,
        "c": 3,
        "occupiable": "sofa"
      },
      {
        "r": 4,
        "c": 4,
        "occupiable": "rug"
      }
    ],
    "people": [
      {
        "id": "A",
        "letter": "A",
        "name": "Arthur",
        "gender": "M",
        "isVictim": false,
        "color": "#D64550",
        "portraitId": 0,
        "roleTitle": "Storyteller"
      },
      {
        "id": "B",
        "letter": "B",
        "name": "Beatrice",
        "gender": "F",
        "isVictim": false,
        "color": "#2B7A78",
        "portraitId": 3,
        "roleTitle": "Comic Collector"
      },
      {
        "id": "C",
        "letter": "C",
        "name": "Cedric",
        "gender": "M",
        "isVictim": false,
        "color": "#D97706",
        "portraitId": 4,
        "roleTitle": "Club Parent"
      },
      {
        "id": "D",
        "letter": "D",
        "name": "Daisy",
        "gender": "F",
        "isVictim": false,
        "color": "#3B66B0",
        "portraitId": 7,
        "roleTitle": "Bookbinder"
      },
      {
        "id": "V",
        "letter": "V",
        "name": "Vincent",
        "gender": "M",
        "isVictim": true,
        "color": "#B8860B",
        "portraitId": 22,
        "roleTitle": "Head Librarian"
      }
    ],
    "victimId": "V",
    "killerId": "B",
    "solution": {
      "V": {
        "r": 4,
        "c": 4
      },
      "B": {
        "r": 3,
        "c": 2
      },
      "C": {
        "r": 2,
        "c": 3
      },
      "A": {
        "r": 0,
        "c": 1
      },
      "D": {
        "r": 1,
        "c": 0
      }
    },
    "clues": [
      {
        "id": "in_rm_1",
        "ownerId": "A",
        "tier": 1,
        "kind": "in_room",
        "personId": "A",
        "roomId": 0
      },
      {
        "id": "no_edge_33",
        "ownerId": "B",
        "tier": 1,
        "kind": "not_outer_edge",
        "personId": "B"
      },
      {
        "id": "alone_rm_46",
        "ownerId": "C",
        "tier": 1,
        "kind": "alone_in_room",
        "personId": "C",
        "roomId": 1
      },
      {
        "id": "no_edge_55",
        "ownerId": "C",
        "tier": 1,
        "kind": "not_outer_edge",
        "personId": "C"
      },
      {
        "id": "edge_79",
        "ownerId": "D",
        "tier": 1,
        "kind": "outer_edge",
        "personId": "D"
      },
      {
        "id": "only_beside_77",
        "ownerId": "D",
        "tier": 1,
        "kind": "only_beside_object",
        "personId": "D",
        "objectKind": "table"
      },
      {
        "id": "vic_93",
        "ownerId": "V",
        "tier": 1,
        "kind": "victim_alone_with_killer",
        "victimId": "V"
      }
    ],
    "metrics": {
      "maxLevel": 1,
      "stepCount": 8,
      "initialSingles": 1,
      "victimDepth": 5
    }
  },
  {
    "id": "starter-4",
    "caseNumber": 4,
    "difficulty": "starter",
    "size": 5,
    "themeId": "garden",
    "title": "Greenhouse Ribbon Cutting",
    "tagline": "Every visitor claimed a seat or mat—yet the golden shears still vanished.",
    "premise": "Right before the spring flower show opened, the ceremonial golden garden shears disappeared! Use the seating clues around the conservatory to find who was alone with the victim.",
    "stolenItem": "the golden garden shears",
    "patternBadge": "Seating Chart",
    "seed": "STARTER-4",
    "rooms": [
      {
        "id": 0,
        "name": "Cactus Dome",
        "colorKey": "butter",
        "bgHex": "#FBF1D6",
        "borderHex": "#C8A85B",
        "pattern": "wood"
      },
      {
        "id": 1,
        "name": "Koi Terrace",
        "colorKey": "sky",
        "bgHex": "#E3EEF7",
        "borderHex": "#638DB5",
        "pattern": "tile"
      },
      {
        "id": 2,
        "name": "Herb Walk",
        "colorKey": "sky",
        "bgHex": "#E3EEF7",
        "borderHex": "#638DB5",
        "pattern": "tile"
      },
      {
        "id": 3,
        "name": "Orchid House",
        "colorKey": "sage",
        "bgHex": "#E3EFE4",
        "borderHex": "#6E9A74",
        "pattern": "grass"
      }
    ],
    "roomGrid": [
      [
        0,
        0,
        0,
        2,
        2
      ],
      [
        0,
        0,
        0,
        2,
        2
      ],
      [
        0,
        0,
        0,
        3,
        3
      ],
      [
        1,
        1,
        1,
        3,
        3
      ],
      [
        1,
        1,
        1,
        3,
        3
      ]
    ],
    "objects": [
      {
        "r": 0,
        "c": 1,
        "occupiable": "bench"
      },
      {
        "r": 0,
        "c": 2,
        "blocking": "fountain"
      },
      {
        "r": 0,
        "c": 3,
        "occupiable": "rug"
      },
      {
        "r": 1,
        "c": 3,
        "occupiable": "bench"
      },
      {
        "r": 1,
        "c": 4,
        "occupiable": "mat"
      },
      {
        "r": 2,
        "c": 1,
        "blocking": "statue"
      },
      {
        "r": 2,
        "c": 2,
        "occupiable": "mat"
      },
      {
        "r": 3,
        "c": 1,
        "occupiable": "mat"
      },
      {
        "r": 3,
        "c": 3,
        "blocking": "plant"
      },
      {
        "r": 3,
        "c": 4,
        "occupiable": "rug"
      },
      {
        "r": 4,
        "c": 0,
        "blocking": "fountain"
      }
    ],
    "people": [
      {
        "id": "A",
        "letter": "A",
        "name": "Arthur",
        "gender": "M",
        "isVictim": false,
        "color": "#D64550",
        "portraitId": 0,
        "roleTitle": "Orchid Grower"
      },
      {
        "id": "B",
        "letter": "B",
        "name": "Barnaby",
        "gender": "M",
        "isVictim": false,
        "color": "#2B7A78",
        "portraitId": 2,
        "roleTitle": "Landscape Painter"
      },
      {
        "id": "C",
        "letter": "C",
        "name": "Cedric",
        "gender": "M",
        "isVictim": false,
        "color": "#D97706",
        "portraitId": 4,
        "roleTitle": "Tea Server"
      },
      {
        "id": "D",
        "letter": "D",
        "name": "Dante",
        "gender": "M",
        "isVictim": false,
        "color": "#3B66B0",
        "portraitId": 6,
        "roleTitle": "Press Photographer"
      },
      {
        "id": "V",
        "letter": "V",
        "name": "Valerie",
        "gender": "F",
        "isVictim": true,
        "color": "#B8860B",
        "portraitId": 23,
        "roleTitle": "Garden Director"
      }
    ],
    "victimId": "V",
    "killerId": "A",
    "solution": {
      "V": {
        "r": 3,
        "c": 2
      },
      "A": {
        "r": 4,
        "c": 1
      },
      "B": {
        "r": 2,
        "c": 0
      },
      "C": {
        "r": 0,
        "c": 3
      },
      "D": {
        "r": 1,
        "c": 4
      }
    },
    "clues": [
      {
        "id": "dir_obj_13",
        "ownerId": "A",
        "tier": 1,
        "kind": "dir_of_object",
        "personId": "A",
        "objectKind": "mat",
        "dir": "south"
      },
      {
        "id": "edge_40",
        "ownerId": "B",
        "tier": 1,
        "kind": "outer_edge",
        "personId": "B"
      },
      {
        "id": "beside_62",
        "ownerId": "C",
        "tier": 1,
        "kind": "beside_object",
        "personId": "C",
        "objectKind": "bench"
      },
      {
        "id": "on_obj_60",
        "ownerId": "C",
        "tier": 1,
        "kind": "on_object",
        "personId": "C",
        "objectKind": "rug"
      },
      {
        "id": "beside_87",
        "ownerId": "D",
        "tier": 1,
        "kind": "beside_object",
        "personId": "D",
        "objectKind": "bench"
      },
      {
        "id": "vic_103",
        "ownerId": "V",
        "tier": 1,
        "kind": "victim_alone_with_killer",
        "victimId": "V"
      }
    ],
    "metrics": {
      "maxLevel": 1,
      "stepCount": 7,
      "initialSingles": 2,
      "victimDepth": 6
    }
  },
  {
    "id": "starter-5",
    "caseNumber": 5,
    "difficulty": "starter",
    "size": 5,
    "themeId": "manor",
    "title": "Rainy Day Game Night",
    "tagline": "A cozy family board-game afternoon with a missing heirloom dice cup.",
    "premise": "When rain kept everyone indoors at Rosehall Manor, someone hid the heirloom brass dice cup mid-tournament! Place all five players on the floor plan to expose the prankster.",
    "stolenItem": "the heirloom brass dice cup",
    "seed": "STARTER-5",
    "rooms": [
      {
        "id": 0,
        "name": "Gallery",
        "colorKey": "butter",
        "bgHex": "#FBF1D6",
        "borderHex": "#C8A85B",
        "pattern": "wood"
      },
      {
        "id": 1,
        "name": "Music Room",
        "colorKey": "sage",
        "bgHex": "#E3EFE4",
        "borderHex": "#6E9A74",
        "pattern": "grass"
      },
      {
        "id": 2,
        "name": "Conservatory",
        "colorKey": "sage",
        "bgHex": "#E3EFE4",
        "borderHex": "#6E9A74",
        "pattern": "grass"
      },
      {
        "id": 3,
        "name": "Parlor",
        "colorKey": "butter",
        "bgHex": "#FBF1D6",
        "borderHex": "#C8A85B",
        "pattern": "wood"
      }
    ],
    "roomGrid": [
      [
        0,
        0,
        0,
        2,
        2
      ],
      [
        0,
        0,
        0,
        2,
        2
      ],
      [
        1,
        1,
        1,
        3,
        3
      ],
      [
        1,
        1,
        1,
        3,
        3
      ],
      [
        1,
        1,
        1,
        3,
        3
      ]
    ],
    "objects": [
      {
        "r": 0,
        "c": 1,
        "occupiable": "rug"
      },
      {
        "r": 0,
        "c": 2,
        "blocking": "plant"
      },
      {
        "r": 0,
        "c": 4,
        "occupiable": "sofa"
      },
      {
        "r": 1,
        "c": 1,
        "occupiable": "bed"
      },
      {
        "r": 1,
        "c": 3,
        "blocking": "piano"
      },
      {
        "r": 2,
        "c": 1,
        "blocking": "shelf"
      },
      {
        "r": 2,
        "c": 3,
        "occupiable": "rug"
      },
      {
        "r": 3,
        "c": 1,
        "occupiable": "bed"
      },
      {
        "r": 3,
        "c": 2,
        "occupiable": "bed"
      },
      {
        "r": 3,
        "c": 4,
        "occupiable": "sofa"
      },
      {
        "r": 4,
        "c": 1,
        "blocking": "plant"
      },
      {
        "r": 4,
        "c": 4,
        "blocking": "piano"
      }
    ],
    "people": [
      {
        "id": "A",
        "letter": "A",
        "name": "Alice",
        "gender": "F",
        "isVictim": false,
        "color": "#D64550",
        "portraitId": 1,
        "roleTitle": "Chess Fanatic"
      },
      {
        "id": "B",
        "letter": "B",
        "name": "Barnaby",
        "gender": "M",
        "isVictim": false,
        "color": "#2B7A78",
        "portraitId": 2,
        "roleTitle": "Snack Chef"
      },
      {
        "id": "C",
        "letter": "C",
        "name": "Cedric",
        "gender": "M",
        "isVictim": false,
        "color": "#D97706",
        "portraitId": 4,
        "roleTitle": "Scorekeeper"
      },
      {
        "id": "D",
        "letter": "D",
        "name": "Dante",
        "gender": "M",
        "isVictim": false,
        "color": "#3B66B0",
        "portraitId": 6,
        "roleTitle": "Puzzle Champ"
      },
      {
        "id": "V",
        "letter": "V",
        "name": "Victor",
        "gender": "M",
        "isVictim": true,
        "color": "#B8860B",
        "portraitId": 20,
        "roleTitle": "Game Host"
      }
    ],
    "victimId": "V",
    "killerId": "D",
    "solution": {
      "V": {
        "r": 4,
        "c": 3
      },
      "D": {
        "r": 3,
        "c": 4
      },
      "A": {
        "r": 1,
        "c": 2
      },
      "C": {
        "r": 2,
        "c": 0
      },
      "B": {
        "r": 0,
        "c": 1
      }
    },
    "clues": [
      {
        "id": "beside_11",
        "ownerId": "A",
        "tier": 1,
        "kind": "beside_object",
        "personId": "A",
        "objectKind": "bed"
      },
      {
        "id": "not_rm_5",
        "ownerId": "A",
        "tier": 1,
        "kind": "not_in_room",
        "personId": "A",
        "roomId": 1
      },
      {
        "id": "dir_obj_37",
        "ownerId": "B",
        "tier": 1,
        "kind": "dir_of_object",
        "personId": "B",
        "objectKind": "plant",
        "dir": "west"
      },
      {
        "id": "only_on_35",
        "ownerId": "B",
        "tier": 1,
        "kind": "only_on_object",
        "personId": "B",
        "objectKind": "rug"
      },
      {
        "id": "edge_67",
        "ownerId": "C",
        "tier": 1,
        "kind": "outer_edge",
        "personId": "C"
      },
      {
        "id": "on_obj_87",
        "ownerId": "D",
        "tier": 1,
        "kind": "on_object",
        "personId": "D",
        "objectKind": "sofa"
      },
      {
        "id": "vic_104",
        "ownerId": "V",
        "tier": 1,
        "kind": "victim_alone_with_killer",
        "victimId": "V"
      }
    ],
    "metrics": {
      "maxLevel": 1,
      "stepCount": 9,
      "initialSingles": 1,
      "victimDepth": 6
    }
  },
  {
    "id": "easy-1",
    "caseNumber": 1,
    "difficulty": "easy",
    "size": 6,
    "themeId": "bakery",
    "title": "The Morning Espresso Rush",
    "tagline": "Amidst warm croissants and steaming mugs, the lucky silver dollar vanished.",
    "premise": "At the peak of Saturday’s breakfast rush, the café’s lucky silver dollar disappeared from the register! Trace each regular’s spot to uncover who was alone with the victim.",
    "stolenItem": "the lucky silver dollar",
    "seed": "EASY-1",
    "rooms": [
      {
        "id": 0,
        "name": "Pantry",
        "colorKey": "sage",
        "bgHex": "#E3EFE4",
        "borderHex": "#6E9A74",
        "pattern": "grass"
      },
      {
        "id": 1,
        "name": "Storage",
        "colorKey": "sage",
        "bgHex": "#E3EFE4",
        "borderHex": "#6E9A74",
        "pattern": "grass"
      },
      {
        "id": 2,
        "name": "Pastry Corner",
        "colorKey": "sky",
        "bgHex": "#E3EEF7",
        "borderHex": "#638DB5",
        "pattern": "tile"
      },
      {
        "id": 3,
        "name": "Front Counter",
        "colorKey": "sky",
        "bgHex": "#E3EEF7",
        "borderHex": "#638DB5",
        "pattern": "tile"
      },
      {
        "id": 4,
        "name": "Tasting Room",
        "colorKey": "butter",
        "bgHex": "#FBF1D6",
        "borderHex": "#C8A85B",
        "pattern": "wood"
      }
    ],
    "roomGrid": [
      [
        1,
        1,
        1,
        3,
        3,
        3
      ],
      [
        1,
        1,
        1,
        3,
        3,
        3
      ],
      [
        1,
        1,
        1,
        4,
        4,
        4
      ],
      [
        2,
        2,
        2,
        4,
        4,
        4
      ],
      [
        2,
        2,
        2,
        0,
        0,
        0
      ],
      [
        2,
        2,
        2,
        0,
        0,
        0
      ]
    ],
    "objects": [
      {
        "r": 0,
        "c": 1,
        "blocking": "display"
      },
      {
        "r": 0,
        "c": 2,
        "blocking": "table"
      },
      {
        "r": 0,
        "c": 3,
        "occupiable": "booth"
      },
      {
        "r": 0,
        "c": 4,
        "blocking": "display"
      },
      {
        "r": 0,
        "c": 5,
        "occupiable": "chair"
      },
      {
        "r": 1,
        "c": 1,
        "occupiable": "stool"
      },
      {
        "r": 1,
        "c": 2,
        "occupiable": "booth"
      },
      {
        "r": 1,
        "c": 4,
        "occupiable": "stool"
      },
      {
        "r": 2,
        "c": 1,
        "occupiable": "rug"
      },
      {
        "r": 2,
        "c": 3,
        "blocking": "oven"
      },
      {
        "r": 3,
        "c": 1,
        "blocking": "table"
      },
      {
        "r": 3,
        "c": 3,
        "blocking": "oven"
      },
      {
        "r": 4,
        "c": 1,
        "occupiable": "rug"
      },
      {
        "r": 4,
        "c": 3,
        "occupiable": "chair"
      },
      {
        "r": 5,
        "c": 0,
        "occupiable": "booth"
      },
      {
        "r": 5,
        "c": 1,
        "blocking": "plant"
      },
      {
        "r": 5,
        "c": 3,
        "blocking": "plant"
      },
      {
        "r": 5,
        "c": 5,
        "occupiable": "chair"
      }
    ],
    "people": [
      {
        "id": "A",
        "letter": "A",
        "name": "Arthur",
        "gender": "M",
        "isVictim": false,
        "color": "#D64550",
        "portraitId": 0,
        "roleTitle": "Head Barista"
      },
      {
        "id": "B",
        "letter": "B",
        "name": "Barnaby",
        "gender": "M",
        "isVictim": false,
        "color": "#2B7A78",
        "portraitId": 2,
        "roleTitle": "Croissant Baker"
      },
      {
        "id": "C",
        "letter": "C",
        "name": "Cedric",
        "gender": "M",
        "isVictim": false,
        "color": "#D97706",
        "portraitId": 4,
        "roleTitle": "Morning Commuter"
      },
      {
        "id": "D",
        "letter": "D",
        "name": "Daisy",
        "gender": "F",
        "isVictim": false,
        "color": "#3B66B0",
        "portraitId": 7,
        "roleTitle": "Food Critic"
      },
      {
        "id": "E",
        "letter": "E",
        "name": "Emilio",
        "gender": "M",
        "isVictim": false,
        "color": "#8B4593",
        "portraitId": 8,
        "roleTitle": "Deliverer"
      },
      {
        "id": "V",
        "letter": "V",
        "name": "Vivian",
        "gender": "F",
        "isVictim": true,
        "color": "#B8860B",
        "portraitId": 21,
        "roleTitle": "Café Owner"
      }
    ],
    "victimId": "V",
    "killerId": "E",
    "solution": {
      "V": {
        "r": 2,
        "c": 1
      },
      "E": {
        "r": 1,
        "c": 2
      },
      "D": {
        "r": 5,
        "c": 4
      },
      "B": {
        "r": 3,
        "c": 0
      },
      "A": {
        "r": 4,
        "c": 5
      },
      "C": {
        "r": 0,
        "c": 3
      }
    },
    "clues": [
      {
        "id": "case_empty_158",
        "ownerId": "case",
        "tier": 1,
        "kind": "room_empty",
        "roomId": 4
      },
      {
        "id": "edge_13",
        "ownerId": "A",
        "tier": 1,
        "kind": "outer_edge",
        "personId": "A"
      },
      {
        "id": "dir_p_47",
        "ownerId": "B",
        "tier": 2,
        "kind": "dir_from_person",
        "personId": "B",
        "otherId": "A",
        "dir": "west"
      },
      {
        "id": "in_rm_60",
        "ownerId": "C",
        "tier": 1,
        "kind": "in_room",
        "personId": "C",
        "roomId": 3
      },
      {
        "id": "dir_obj_105",
        "ownerId": "D",
        "tier": 1,
        "kind": "dir_of_object",
        "personId": "D",
        "objectKind": "plant",
        "dir": "east"
      },
      {
        "id": "either_127",
        "ownerId": "E",
        "tier": 1,
        "kind": "in_either_room",
        "personId": "E",
        "roomIds": [
          1,
          4
        ]
      },
      {
        "id": "on_obj_132",
        "ownerId": "E",
        "tier": 1,
        "kind": "on_object",
        "personId": "E",
        "objectKind": "booth"
      },
      {
        "id": "vic_153",
        "ownerId": "V",
        "tier": 1,
        "kind": "victim_alone_with_killer",
        "victimId": "V"
      }
    ],
    "metrics": {
      "maxLevel": 2,
      "stepCount": 12,
      "initialSingles": 1,
      "victimDepth": 11
    }
  },
  {
    "id": "easy-2",
    "caseNumber": 2,
    "difficulty": "easy",
    "size": 6,
    "themeId": "museum",
    "title": "School Field Trip",
    "tagline": "Between sketching statues and gallery talks, a bronze cloak clasp vanished.",
    "premise": "Right after the morning museum tour wrapped up, the docent’s antique bronze clasp went missing! Map every visitor across the galleries to catch who was alone with the victim.",
    "stolenItem": "the antique bronze clasp",
    "seed": "EASY-2",
    "rooms": [
      {
        "id": 0,
        "name": "Portrait Hall",
        "colorKey": "sky",
        "bgHex": "#E3EEF7",
        "borderHex": "#638DB5",
        "pattern": "tile"
      },
      {
        "id": 1,
        "name": "Sketch Studio",
        "colorKey": "butter",
        "bgHex": "#FBF1D6",
        "borderHex": "#C8A85B",
        "pattern": "wood"
      },
      {
        "id": 2,
        "name": "Curator Office",
        "colorKey": "sky",
        "bgHex": "#E3EEF7",
        "borderHex": "#638DB5",
        "pattern": "tile"
      },
      {
        "id": 3,
        "name": "Modern Room",
        "colorKey": "sage",
        "bgHex": "#E3EFE4",
        "borderHex": "#6E9A74",
        "pattern": "grass"
      }
    ],
    "roomGrid": [
      [
        2,
        2,
        3,
        3,
        0,
        0
      ],
      [
        2,
        2,
        3,
        3,
        0,
        0
      ],
      [
        2,
        2,
        3,
        3,
        0,
        0
      ],
      [
        2,
        2,
        3,
        3,
        0,
        0
      ],
      [
        1,
        1,
        1,
        1,
        0,
        0
      ],
      [
        1,
        1,
        1,
        1,
        0,
        0
      ]
    ],
    "objects": [
      {
        "r": 0,
        "c": 1,
        "occupiable": "mat"
      },
      {
        "r": 1,
        "c": 0,
        "occupiable": "bench"
      },
      {
        "r": 1,
        "c": 1,
        "blocking": "easel"
      },
      {
        "r": 1,
        "c": 5,
        "blocking": "plant"
      },
      {
        "r": 2,
        "c": 0,
        "occupiable": "mat"
      },
      {
        "r": 2,
        "c": 2,
        "blocking": "easel"
      },
      {
        "r": 3,
        "c": 0,
        "blocking": "display"
      },
      {
        "r": 3,
        "c": 2,
        "blocking": "display"
      },
      {
        "r": 3,
        "c": 3,
        "occupiable": "rug"
      },
      {
        "r": 3,
        "c": 4,
        "occupiable": "rug"
      },
      {
        "r": 3,
        "c": 5,
        "blocking": "statue"
      },
      {
        "r": 4,
        "c": 0,
        "occupiable": "chair"
      },
      {
        "r": 4,
        "c": 1,
        "blocking": "easel"
      },
      {
        "r": 4,
        "c": 3,
        "occupiable": "bench"
      },
      {
        "r": 4,
        "c": 4,
        "occupiable": "chair"
      },
      {
        "r": 4,
        "c": 5,
        "blocking": "plant"
      },
      {
        "r": 5,
        "c": 0,
        "blocking": "statue"
      },
      {
        "r": 5,
        "c": 2,
        "occupiable": "rug"
      },
      {
        "r": 5,
        "c": 5,
        "occupiable": "mat"
      }
    ],
    "people": [
      {
        "id": "A",
        "letter": "A",
        "name": "Alice",
        "gender": "F",
        "isVictim": false,
        "color": "#D64550",
        "portraitId": 1,
        "roleTitle": "Art Teacher"
      },
      {
        "id": "B",
        "letter": "B",
        "name": "Barnaby",
        "gender": "M",
        "isVictim": false,
        "color": "#2B7A78",
        "portraitId": 2,
        "roleTitle": "Museum Docent"
      },
      {
        "id": "C",
        "letter": "C",
        "name": "Cedric",
        "gender": "M",
        "isVictim": false,
        "color": "#D97706",
        "portraitId": 4,
        "roleTitle": "Sketch Artist"
      },
      {
        "id": "D",
        "letter": "D",
        "name": "Daisy",
        "gender": "F",
        "isVictim": false,
        "color": "#3B66B0",
        "portraitId": 7,
        "roleTitle": "Parent Chaperone"
      },
      {
        "id": "E",
        "letter": "E",
        "name": "Evelyn",
        "gender": "F",
        "isVictim": false,
        "color": "#8B4593",
        "portraitId": 9,
        "roleTitle": "Restorer"
      },
      {
        "id": "V",
        "letter": "V",
        "name": "Valerie",
        "gender": "F",
        "isVictim": true,
        "color": "#B8860B",
        "portraitId": 23,
        "roleTitle": "Gallery Curator"
      }
    ],
    "victimId": "V",
    "killerId": "E",
    "solution": {
      "V": {
        "r": 3,
        "c": 3
      },
      "E": {
        "r": 1,
        "c": 2
      },
      "B": {
        "r": 4,
        "c": 0
      },
      "D": {
        "r": 2,
        "c": 1
      },
      "C": {
        "r": 0,
        "c": 4
      },
      "A": {
        "r": 5,
        "c": 5
      }
    },
    "clues": [
      {
        "id": "on_obj_8",
        "ownerId": "A",
        "tier": 1,
        "kind": "on_object",
        "personId": "A",
        "objectKind": "mat"
      },
      {
        "id": "only_beside_11",
        "ownerId": "A",
        "tier": 1,
        "kind": "only_beside_object",
        "personId": "A",
        "objectKind": "plant"
      },
      {
        "id": "alone_rm_30",
        "ownerId": "B",
        "tier": 1,
        "kind": "alone_in_room",
        "personId": "B",
        "roomId": 1
      },
      {
        "id": "edge_69",
        "ownerId": "C",
        "tier": 1,
        "kind": "outer_edge",
        "personId": "C"
      },
      {
        "id": "either_62",
        "ownerId": "C",
        "tier": 1,
        "kind": "in_either_room",
        "personId": "C",
        "roomIds": [
          0,
          1
        ]
      },
      {
        "id": "beside_98",
        "ownerId": "D",
        "tier": 1,
        "kind": "beside_object",
        "personId": "D",
        "objectKind": "easel"
      },
      {
        "id": "in_rm_85",
        "ownerId": "D",
        "tier": 1,
        "kind": "in_room",
        "personId": "D",
        "roomId": 2
      },
      {
        "id": "bare_123",
        "ownerId": "E",
        "tier": 1,
        "kind": "on_empty_floor",
        "personId": "E"
      },
      {
        "id": "v_either_142",
        "ownerId": "V",
        "tier": 1,
        "kind": "in_either_room",
        "personId": "V",
        "roomIds": [
          3,
          0
        ]
      },
      {
        "id": "vic_141",
        "ownerId": "V",
        "tier": 1,
        "kind": "victim_alone_with_killer",
        "victimId": "V"
      }
    ],
    "metrics": {
      "maxLevel": 1,
      "stepCount": 8,
      "initialSingles": 1,
      "victimDepth": 5
    }
  },
  {
    "id": "easy-3",
    "caseNumber": 3,
    "difficulty": "easy",
    "size": 6,
    "themeId": "train",
    "title": "Boarding Call on Track 4",
    "tagline": "Five passengers, one conductor, and a missing vintage timetable.",
    "premise": "Just as the 8:15 Express pulled away from Track 4, the conductor’s vintage brass pocket timetable vanished! Place everyone in the rail cars to find who was alone with the victim.",
    "stolenItem": "the vintage pocket timetable",
    "seed": "EASY-3",
    "rooms": [
      {
        "id": 0,
        "name": "Dining Car",
        "colorKey": "sage",
        "bgHex": "#E3EFE4",
        "borderHex": "#6E9A74",
        "pattern": "grass"
      },
      {
        "id": 1,
        "name": "Ticket Booth",
        "colorKey": "sky",
        "bgHex": "#E3EEF7",
        "borderHex": "#638DB5",
        "pattern": "tile"
      },
      {
        "id": 2,
        "name": "Observation Deck",
        "colorKey": "sage",
        "bgHex": "#E3EFE4",
        "borderHex": "#6E9A74",
        "pattern": "grass"
      },
      {
        "id": 3,
        "name": "Caboose",
        "colorKey": "sky",
        "bgHex": "#E3EEF7",
        "borderHex": "#638DB5",
        "pattern": "tile"
      },
      {
        "id": 4,
        "name": "Lounge Car",
        "colorKey": "butter",
        "bgHex": "#FBF1D6",
        "borderHex": "#C8A85B",
        "pattern": "wood"
      }
    ],
    "roomGrid": [
      [
        3,
        3,
        3,
        0,
        0,
        0
      ],
      [
        3,
        3,
        3,
        0,
        0,
        0
      ],
      [
        4,
        4,
        4,
        0,
        0,
        0
      ],
      [
        4,
        4,
        4,
        1,
        1,
        1
      ],
      [
        2,
        2,
        2,
        1,
        1,
        1
      ],
      [
        2,
        2,
        2,
        1,
        1,
        1
      ]
    ],
    "objects": [
      {
        "r": 0,
        "c": 0,
        "occupiable": "bed"
      },
      {
        "r": 0,
        "c": 1,
        "blocking": "luggage"
      },
      {
        "r": 0,
        "c": 4,
        "occupiable": "booth"
      },
      {
        "r": 0,
        "c": 5,
        "blocking": "plant"
      },
      {
        "r": 1,
        "c": 0,
        "blocking": "globe"
      },
      {
        "r": 2,
        "c": 0,
        "occupiable": "sofa"
      },
      {
        "r": 2,
        "c": 2,
        "blocking": "luggage"
      },
      {
        "r": 2,
        "c": 3,
        "blocking": "plant"
      },
      {
        "r": 3,
        "c": 1,
        "occupiable": "rug"
      },
      {
        "r": 3,
        "c": 3,
        "blocking": "globe"
      },
      {
        "r": 3,
        "c": 5,
        "occupiable": "rug"
      },
      {
        "r": 4,
        "c": 2,
        "blocking": "table"
      },
      {
        "r": 4,
        "c": 3,
        "occupiable": "booth"
      },
      {
        "r": 4,
        "c": 4,
        "blocking": "table"
      },
      {
        "r": 5,
        "c": 0,
        "occupiable": "bed"
      },
      {
        "r": 5,
        "c": 1,
        "occupiable": "sofa"
      },
      {
        "r": 5,
        "c": 2,
        "occupiable": "sofa"
      },
      {
        "r": 5,
        "c": 3,
        "occupiable": "rug"
      },
      {
        "r": 5,
        "c": 4,
        "blocking": "luggage"
      }
    ],
    "people": [
      {
        "id": "A",
        "letter": "A",
        "name": "Arthur",
        "gender": "M",
        "isVictim": false,
        "color": "#D64550",
        "portraitId": 0,
        "roleTitle": "Ticket Inspector"
      },
      {
        "id": "B",
        "letter": "B",
        "name": "Barnaby",
        "gender": "M",
        "isVictim": false,
        "color": "#2B7A78",
        "portraitId": 2,
        "roleTitle": "Dining Steward"
      },
      {
        "id": "C",
        "letter": "C",
        "name": "Cedric",
        "gender": "M",
        "isVictim": false,
        "color": "#D97706",
        "portraitId": 4,
        "roleTitle": "Crossword Traveler"
      },
      {
        "id": "D",
        "letter": "D",
        "name": "Daisy",
        "gender": "F",
        "isVictim": false,
        "color": "#3B66B0",
        "portraitId": 7,
        "roleTitle": "Luggage Porter"
      },
      {
        "id": "E",
        "letter": "E",
        "name": "Evelyn",
        "gender": "F",
        "isVictim": false,
        "color": "#8B4593",
        "portraitId": 9,
        "roleTitle": "Journalist"
      },
      {
        "id": "V",
        "letter": "V",
        "name": "Vincent",
        "gender": "M",
        "isVictim": true,
        "color": "#B8860B",
        "portraitId": 22,
        "roleTitle": "Train Conductor"
      }
    ],
    "victimId": "V",
    "killerId": "D",
    "solution": {
      "V": {
        "r": 4,
        "c": 0
      },
      "D": {
        "r": 5,
        "c": 2
      },
      "A": {
        "r": 3,
        "c": 1
      },
      "E": {
        "r": 2,
        "c": 5
      },
      "B": {
        "r": 0,
        "c": 4
      },
      "C": {
        "r": 1,
        "c": 3
      }
    },
    "clues": [
      {
        "id": "no_edge_14",
        "ownerId": "A",
        "tier": 1,
        "kind": "not_outer_edge",
        "personId": "A"
      },
      {
        "id": "either_32",
        "ownerId": "B",
        "tier": 1,
        "kind": "in_either_room",
        "personId": "B",
        "roomIds": [
          0,
          2
        ]
      },
      {
        "id": "dir_obj_71",
        "ownerId": "C",
        "tier": 1,
        "kind": "dir_of_object",
        "personId": "C",
        "objectKind": "plant",
        "dir": "north"
      },
      {
        "id": "dir_obj_102",
        "ownerId": "D",
        "tier": 1,
        "kind": "dir_of_object",
        "personId": "D",
        "objectKind": "sofa",
        "dir": "east"
      },
      {
        "id": "bare_130",
        "ownerId": "E",
        "tier": 1,
        "kind": "on_empty_floor",
        "personId": "E"
      },
      {
        "id": "in_rm_121",
        "ownerId": "E",
        "tier": 1,
        "kind": "in_room",
        "personId": "E",
        "roomId": 0
      },
      {
        "id": "vic_147",
        "ownerId": "V",
        "tier": 1,
        "kind": "victim_alone_with_killer",
        "victimId": "V"
      }
    ],
    "metrics": {
      "maxLevel": 1,
      "stepCount": 12,
      "initialSingles": 1,
      "victimDepth": 11
    }
  },
  {
    "id": "easy-4",
    "caseNumber": 4,
    "difficulty": "easy",
    "size": 6,
    "themeId": "inn",
    "title": "Weekend Check-In",
    "tagline": "Nearly every guest stayed by themselves—except the culprit and the host.",
    "premise": "As families unpacked for the weekend at Gull Cove Inn, the front-desk brass room bell vanished! Use the solo alibis to deduce who was alone with the victim.",
    "stolenItem": "the brass front-desk bell",
    "patternBadge": "Solo Alibis",
    "seed": "EASY-4",
    "rooms": [
      {
        "id": 0,
        "name": "Deck Porch",
        "colorKey": "butter",
        "bgHex": "#FBF1D6",
        "borderHex": "#C8A85B",
        "pattern": "wood"
      },
      {
        "id": 1,
        "name": "Chart Room",
        "colorKey": "sage",
        "bgHex": "#E3EFE4",
        "borderHex": "#6E9A74",
        "pattern": "grass"
      },
      {
        "id": 2,
        "name": "Harbor Suite",
        "colorKey": "sky",
        "bgHex": "#E3EEF7",
        "borderHex": "#638DB5",
        "pattern": "tile"
      },
      {
        "id": 3,
        "name": "Sun Lounge",
        "colorKey": "sage",
        "bgHex": "#E3EFE4",
        "borderHex": "#6E9A74",
        "pattern": "grass"
      },
      {
        "id": 4,
        "name": "Chowder Bar",
        "colorKey": "sky",
        "bgHex": "#E3EEF7",
        "borderHex": "#638DB5",
        "pattern": "tile"
      }
    ],
    "roomGrid": [
      [
        3,
        3,
        0,
        0,
        1,
        1
      ],
      [
        3,
        3,
        0,
        0,
        1,
        1
      ],
      [
        4,
        4,
        0,
        0,
        1,
        1
      ],
      [
        4,
        4,
        0,
        0,
        2,
        2
      ],
      [
        4,
        4,
        0,
        0,
        2,
        2
      ],
      [
        4,
        4,
        0,
        0,
        2,
        2
      ]
    ],
    "objects": [
      {
        "r": 0,
        "c": 1,
        "blocking": "anchor"
      },
      {
        "r": 0,
        "c": 4,
        "occupiable": "chair"
      },
      {
        "r": 1,
        "c": 4,
        "occupiable": "booth"
      },
      {
        "r": 1,
        "c": 5,
        "blocking": "barrel"
      },
      {
        "r": 2,
        "c": 3,
        "blocking": "anchor"
      },
      {
        "r": 3,
        "c": 2,
        "occupiable": "bed"
      },
      {
        "r": 3,
        "c": 3,
        "occupiable": "bed"
      },
      {
        "r": 3,
        "c": 4,
        "occupiable": "mat"
      },
      {
        "r": 3,
        "c": 5,
        "blocking": "plant"
      },
      {
        "r": 4,
        "c": 0,
        "blocking": "table"
      },
      {
        "r": 4,
        "c": 1,
        "occupiable": "chair"
      },
      {
        "r": 4,
        "c": 2,
        "occupiable": "bed"
      },
      {
        "r": 4,
        "c": 3,
        "blocking": "table"
      },
      {
        "r": 4,
        "c": 4,
        "occupiable": "chair"
      },
      {
        "r": 5,
        "c": 0,
        "blocking": "plant"
      },
      {
        "r": 5,
        "c": 1,
        "occupiable": "booth"
      },
      {
        "r": 5,
        "c": 2,
        "occupiable": "mat"
      },
      {
        "r": 5,
        "c": 3,
        "blocking": "barrel"
      },
      {
        "r": 5,
        "c": 4,
        "blocking": "table"
      }
    ],
    "people": [
      {
        "id": "A",
        "letter": "A",
        "name": "Arthur",
        "gender": "M",
        "isVictim": false,
        "color": "#D64550",
        "portraitId": 0,
        "roleTitle": "Lighthouse Keeper"
      },
      {
        "id": "B",
        "letter": "B",
        "name": "Beatrice",
        "gender": "F",
        "isVictim": false,
        "color": "#2B7A78",
        "portraitId": 3,
        "roleTitle": "Kayak Guide"
      },
      {
        "id": "C",
        "letter": "C",
        "name": "Clara",
        "gender": "F",
        "isVictim": false,
        "color": "#D97706",
        "portraitId": 5,
        "roleTitle": "Pastry Guest"
      },
      {
        "id": "D",
        "letter": "D",
        "name": "Daisy",
        "gender": "F",
        "isVictim": false,
        "color": "#3B66B0",
        "portraitId": 7,
        "roleTitle": "Birdwatcher"
      },
      {
        "id": "E",
        "letter": "E",
        "name": "Emilio",
        "gender": "M",
        "isVictim": false,
        "color": "#8B4593",
        "portraitId": 8,
        "roleTitle": "Harbor Captain"
      },
      {
        "id": "V",
        "letter": "V",
        "name": "Vivian",
        "gender": "F",
        "isVictim": true,
        "color": "#B8860B",
        "portraitId": 21,
        "roleTitle": "Innkeeper"
      }
    ],
    "victimId": "V",
    "killerId": "B",
    "solution": {
      "V": {
        "r": 4,
        "c": 2
      },
      "B": {
        "r": 3,
        "c": 3
      },
      "D": {
        "r": 0,
        "c": 5
      },
      "C": {
        "r": 1,
        "c": 0
      },
      "A": {
        "r": 2,
        "c": 4
      },
      "E": {
        "r": 5,
        "c": 1
      }
    },
    "clues": [
      {
        "id": "case_empty_161",
        "ownerId": "case",
        "tier": 1,
        "kind": "room_empty",
        "roomId": 2
      },
      {
        "id": "dir_p_19",
        "ownerId": "A",
        "tier": 2,
        "kind": "dir_from_person",
        "personId": "A",
        "otherId": "C",
        "dir": "south"
      },
      {
        "id": "either_5",
        "ownerId": "A",
        "tier": 1,
        "kind": "in_either_room",
        "personId": "A",
        "roomIds": [
          1,
          4
        ]
      },
      {
        "id": "dir_obj_46",
        "ownerId": "B",
        "tier": 1,
        "kind": "dir_of_object",
        "personId": "B",
        "objectKind": "table",
        "dir": "north"
      },
      {
        "id": "alone_rm_64",
        "ownerId": "C",
        "tier": 1,
        "kind": "alone_in_room",
        "personId": "C",
        "roomId": 3
      },
      {
        "id": "bare_100",
        "ownerId": "D",
        "tier": 1,
        "kind": "on_empty_floor",
        "personId": "D"
      },
      {
        "id": "either_127",
        "ownerId": "E",
        "tier": 1,
        "kind": "in_either_room",
        "personId": "E",
        "roomIds": [
          4,
          2
        ]
      },
      {
        "id": "only_on_134",
        "ownerId": "E",
        "tier": 1,
        "kind": "only_on_object",
        "personId": "E",
        "objectKind": "booth"
      },
      {
        "id": "vic_156",
        "ownerId": "V",
        "tier": 1,
        "kind": "victim_alone_with_killer",
        "victimId": "V"
      }
    ],
    "metrics": {
      "maxLevel": 2,
      "stepCount": 12,
      "initialSingles": 1,
      "victimDepth": 3
    }
  },
  {
    "id": "easy-5",
    "caseNumber": 5,
    "difficulty": "easy",
    "size": 6,
    "themeId": "garden",
    "title": "Neighborhood Bonsai Contest",
    "tagline": "Judging day in the sunlit glasshouse—and the championship ribbon is gone.",
    "premise": "Minutes before the neighborhood bonsai trophy ceremony, the first-place blue ribbon disappeared! Map every contestant across the garden to spot who was alone with the victim.",
    "stolenItem": "the first-place blue ribbon",
    "seed": "EASY-5",
    "rooms": [
      {
        "id": 0,
        "name": "Potting Shed",
        "colorKey": "sky",
        "bgHex": "#E3EEF7",
        "borderHex": "#638DB5",
        "pattern": "tile"
      },
      {
        "id": 1,
        "name": "Orchid House",
        "colorKey": "butter",
        "bgHex": "#FBF1D6",
        "borderHex": "#C8A85B",
        "pattern": "wood"
      },
      {
        "id": 2,
        "name": "Herb Walk",
        "colorKey": "sage",
        "bgHex": "#E3EFE4",
        "borderHex": "#6E9A74",
        "pattern": "grass"
      },
      {
        "id": 3,
        "name": "Cactus Dome",
        "colorKey": "sky",
        "bgHex": "#E3EEF7",
        "borderHex": "#638DB5",
        "pattern": "tile"
      }
    ],
    "roomGrid": [
      [
        0,
        0,
        0,
        0,
        0,
        0
      ],
      [
        0,
        0,
        0,
        0,
        0,
        0
      ],
      [
        2,
        2,
        2,
        2,
        1,
        1
      ],
      [
        2,
        2,
        2,
        2,
        1,
        1
      ],
      [
        3,
        3,
        3,
        3,
        1,
        1
      ],
      [
        3,
        3,
        3,
        3,
        1,
        1
      ]
    ],
    "objects": [
      {
        "r": 0,
        "c": 2,
        "occupiable": "mat"
      },
      {
        "r": 0,
        "c": 3,
        "occupiable": "chair"
      },
      {
        "r": 0,
        "c": 5,
        "occupiable": "chair"
      },
      {
        "r": 1,
        "c": 0,
        "blocking": "fountain"
      },
      {
        "r": 1,
        "c": 1,
        "blocking": "statue"
      },
      {
        "r": 1,
        "c": 3,
        "blocking": "fountain"
      },
      {
        "r": 2,
        "c": 3,
        "occupiable": "rug"
      },
      {
        "r": 2,
        "c": 4,
        "blocking": "statue"
      },
      {
        "r": 2,
        "c": 5,
        "occupiable": "chair"
      },
      {
        "r": 3,
        "c": 0,
        "occupiable": "bench"
      },
      {
        "r": 3,
        "c": 2,
        "blocking": "plant"
      },
      {
        "r": 3,
        "c": 3,
        "blocking": "plant"
      },
      {
        "r": 3,
        "c": 4,
        "occupiable": "rug"
      },
      {
        "r": 4,
        "c": 0,
        "occupiable": "bench"
      },
      {
        "r": 4,
        "c": 1,
        "blocking": "statue"
      },
      {
        "r": 4,
        "c": 5,
        "blocking": "tree"
      },
      {
        "r": 5,
        "c": 0,
        "blocking": "tree"
      },
      {
        "r": 5,
        "c": 1,
        "occupiable": "bench"
      },
      {
        "r": 5,
        "c": 2,
        "occupiable": "mat"
      }
    ],
    "people": [
      {
        "id": "A",
        "letter": "A",
        "name": "Alice",
        "gender": "F",
        "isVictim": false,
        "color": "#D64550",
        "portraitId": 1,
        "roleTitle": "Bonsai Master"
      },
      {
        "id": "B",
        "letter": "B",
        "name": "Beatrice",
        "gender": "F",
        "isVictim": false,
        "color": "#2B7A78",
        "portraitId": 3,
        "roleTitle": "Terrarium Maker"
      },
      {
        "id": "C",
        "letter": "C",
        "name": "Cedric",
        "gender": "M",
        "isVictim": false,
        "color": "#D97706",
        "portraitId": 4,
        "roleTitle": "Tea Sommelier"
      },
      {
        "id": "D",
        "letter": "D",
        "name": "Daisy",
        "gender": "F",
        "isVictim": false,
        "color": "#3B66B0",
        "portraitId": 7,
        "roleTitle": "Seed Collector"
      },
      {
        "id": "E",
        "letter": "E",
        "name": "Emilio",
        "gender": "M",
        "isVictim": false,
        "color": "#8B4593",
        "portraitId": 8,
        "roleTitle": "Sketcher"
      },
      {
        "id": "V",
        "letter": "V",
        "name": "Valerie",
        "gender": "F",
        "isVictim": true,
        "color": "#B8860B",
        "portraitId": 23,
        "roleTitle": "Contest Judge"
      }
    ],
    "victimId": "V",
    "killerId": "C",
    "solution": {
      "V": {
        "r": 5,
        "c": 1
      },
      "C": {
        "r": 4,
        "c": 3
      },
      "B": {
        "r": 2,
        "c": 0
      },
      "D": {
        "r": 3,
        "c": 4
      },
      "E": {
        "r": 1,
        "c": 5
      },
      "A": {
        "r": 0,
        "c": 2
      }
    },
    "clues": [
      {
        "id": "only_on_9",
        "ownerId": "A",
        "tier": 1,
        "kind": "only_on_object",
        "personId": "A",
        "objectKind": "mat"
      },
      {
        "id": "dir_obj_40",
        "ownerId": "B",
        "tier": 1,
        "kind": "dir_of_object",
        "personId": "B",
        "objectKind": "bench",
        "dir": "north"
      },
      {
        "id": "bare_64",
        "ownerId": "C",
        "tier": 1,
        "kind": "on_empty_floor",
        "personId": "C"
      },
      {
        "id": "dir_p_74",
        "ownerId": "C",
        "tier": 2,
        "kind": "dir_from_person",
        "personId": "C",
        "otherId": "D",
        "dir": "west"
      },
      {
        "id": "no_edge_93",
        "ownerId": "D",
        "tier": 1,
        "kind": "not_outer_edge",
        "personId": "D"
      },
      {
        "id": "in_rm_109",
        "ownerId": "E",
        "tier": 1,
        "kind": "in_room",
        "personId": "E",
        "roomId": 0
      },
      {
        "id": "same_rm_120",
        "ownerId": "E",
        "tier": 2,
        "kind": "same_room_as",
        "personId": "E",
        "otherId": "A"
      },
      {
        "id": "v_either_136",
        "ownerId": "V",
        "tier": 1,
        "kind": "in_either_room",
        "personId": "V",
        "roomIds": [
          3,
          0
        ]
      },
      {
        "id": "vic_135",
        "ownerId": "V",
        "tier": 1,
        "kind": "victim_alone_with_killer",
        "victimId": "V"
      }
    ],
    "metrics": {
      "maxLevel": 2,
      "stepCount": 14,
      "initialSingles": 1,
      "victimDepth": 13
    }
  },
  {
    "id": "medium-1",
    "caseNumber": 1,
    "difficulty": "medium",
    "size": 7,
    "themeId": "bakery",
    "title": "The Great Bake-Off",
    "tagline": "Someone pocketed the secret cardamom jar ten minutes before final tasting.",
    "premise": "Ten minutes before the televised bake-off judging, the secret spiced cardamom jar vanished! Place all seven bakers and judges on the map to reveal who was alone with the victim.",
    "stolenItem": "the secret cardamom jar",
    "seed": "MEDIUM-1",
    "rooms": [
      {
        "id": 0,
        "name": "Patio",
        "colorKey": "sage",
        "bgHex": "#E3EFE4",
        "borderHex": "#6E9A74",
        "pattern": "grass"
      },
      {
        "id": 1,
        "name": "Storage",
        "colorKey": "sage",
        "bgHex": "#E3EFE4",
        "borderHex": "#6E9A74",
        "pattern": "grass"
      },
      {
        "id": 2,
        "name": "Kitchen",
        "colorKey": "sky",
        "bgHex": "#E3EEF7",
        "borderHex": "#638DB5",
        "pattern": "tile"
      },
      {
        "id": 3,
        "name": "Pantry",
        "colorKey": "sky",
        "bgHex": "#E3EEF7",
        "borderHex": "#638DB5",
        "pattern": "tile"
      },
      {
        "id": 4,
        "name": "Front Counter",
        "colorKey": "butter",
        "bgHex": "#FBF1D6",
        "borderHex": "#C8A85B",
        "pattern": "wood"
      }
    ],
    "roomGrid": [
      [
        1,
        1,
        1,
        2,
        2,
        2,
        2
      ],
      [
        1,
        1,
        1,
        2,
        2,
        2,
        2
      ],
      [
        1,
        1,
        1,
        2,
        2,
        2,
        2
      ],
      [
        3,
        3,
        4,
        4,
        4,
        4,
        4
      ],
      [
        3,
        3,
        4,
        4,
        4,
        4,
        4
      ],
      [
        0,
        0,
        0,
        0,
        0,
        0,
        0
      ],
      [
        0,
        0,
        0,
        0,
        0,
        0,
        0
      ]
    ],
    "objects": [
      {
        "r": 0,
        "c": 0,
        "occupiable": "stool"
      },
      {
        "r": 0,
        "c": 1,
        "blocking": "plant"
      },
      {
        "r": 0,
        "c": 3,
        "blocking": "display"
      },
      {
        "r": 0,
        "c": 5,
        "occupiable": "chair"
      },
      {
        "r": 1,
        "c": 0,
        "blocking": "oven"
      },
      {
        "r": 1,
        "c": 3,
        "occupiable": "rug"
      },
      {
        "r": 1,
        "c": 5,
        "occupiable": "rug"
      },
      {
        "r": 2,
        "c": 1,
        "blocking": "plant"
      },
      {
        "r": 2,
        "c": 2,
        "occupiable": "stool"
      },
      {
        "r": 2,
        "c": 3,
        "occupiable": "rug"
      },
      {
        "r": 2,
        "c": 4,
        "blocking": "display"
      },
      {
        "r": 2,
        "c": 5,
        "blocking": "oven"
      },
      {
        "r": 3,
        "c": 0,
        "occupiable": "chair"
      },
      {
        "r": 3,
        "c": 1,
        "blocking": "table"
      },
      {
        "r": 3,
        "c": 3,
        "blocking": "oven"
      },
      {
        "r": 3,
        "c": 4,
        "blocking": "oven"
      },
      {
        "r": 3,
        "c": 5,
        "occupiable": "booth"
      },
      {
        "r": 4,
        "c": 0,
        "occupiable": "chair"
      },
      {
        "r": 4,
        "c": 3,
        "occupiable": "booth"
      },
      {
        "r": 4,
        "c": 4,
        "blocking": "display"
      },
      {
        "r": 5,
        "c": 3,
        "occupiable": "booth"
      },
      {
        "r": 5,
        "c": 4,
        "occupiable": "stool"
      },
      {
        "r": 5,
        "c": 5,
        "blocking": "plant"
      },
      {
        "r": 6,
        "c": 3,
        "blocking": "table"
      },
      {
        "r": 6,
        "c": 6,
        "blocking": "table"
      }
    ],
    "people": [
      {
        "id": "A",
        "letter": "A",
        "name": "Alice",
        "gender": "F",
        "isVictim": false,
        "color": "#D64550",
        "portraitId": 1,
        "roleTitle": "Sourdough Pro"
      },
      {
        "id": "B",
        "letter": "B",
        "name": "Beatrice",
        "gender": "F",
        "isVictim": false,
        "color": "#2B7A78",
        "portraitId": 3,
        "roleTitle": "Tart Specialist"
      },
      {
        "id": "C",
        "letter": "C",
        "name": "Clara",
        "gender": "F",
        "isVictim": false,
        "color": "#D97706",
        "portraitId": 5,
        "roleTitle": "Glaze Expert"
      },
      {
        "id": "D",
        "letter": "D",
        "name": "Dante",
        "gender": "M",
        "isVictim": false,
        "color": "#3B66B0",
        "portraitId": 6,
        "roleTitle": "Timer Keeper"
      },
      {
        "id": "E",
        "letter": "E",
        "name": "Emilio",
        "gender": "M",
        "isVictim": false,
        "color": "#8B4593",
        "portraitId": 8,
        "roleTitle": "Guest Judge"
      },
      {
        "id": "F",
        "letter": "F",
        "name": "Felix",
        "gender": "M",
        "isVictim": false,
        "color": "#2F855A",
        "portraitId": 10,
        "roleTitle": "Pastry Stylist"
      },
      {
        "id": "V",
        "letter": "V",
        "name": "Vivian",
        "gender": "F",
        "isVictim": true,
        "color": "#B8860B",
        "portraitId": 21,
        "roleTitle": "Show Host"
      }
    ],
    "victimId": "V",
    "killerId": "A",
    "solution": {
      "V": {
        "r": 6,
        "c": 1
      },
      "A": {
        "r": 5,
        "c": 3
      },
      "E": {
        "r": 2,
        "c": 6
      },
      "B": {
        "r": 4,
        "c": 0
      },
      "C": {
        "r": 3,
        "c": 2
      },
      "D": {
        "r": 1,
        "c": 4
      },
      "F": {
        "r": 0,
        "c": 5
      }
    },
    "clues": [
      {
        "id": "on_obj_10",
        "ownerId": "A",
        "tier": 1,
        "kind": "on_object",
        "personId": "A",
        "objectKind": "booth"
      },
      {
        "id": "only_beside_21",
        "ownerId": "A",
        "tier": 1,
        "kind": "only_beside_object",
        "personId": "A",
        "objectKind": "table"
      },
      {
        "id": "either_45",
        "ownerId": "B",
        "tier": 1,
        "kind": "in_either_room",
        "personId": "B",
        "roomIds": [
          3,
          0
        ]
      },
      {
        "id": "dir_p_116",
        "ownerId": "C",
        "tier": 2,
        "kind": "dir_from_person",
        "personId": "C",
        "otherId": "E",
        "dir": "west"
      },
      {
        "id": "in_rm_83",
        "ownerId": "C",
        "tier": 1,
        "kind": "in_room",
        "personId": "C",
        "roomId": 4
      },
      {
        "id": "either_127",
        "ownerId": "D",
        "tier": 1,
        "kind": "in_either_room",
        "personId": "D",
        "roomIds": [
          2,
          4
        ]
      },
      {
        "id": "not_beside_181",
        "ownerId": "E",
        "tier": 1,
        "kind": "not_beside_object",
        "personId": "E",
        "objectKind": "rug"
      },
      {
        "id": "beside_218",
        "ownerId": "F",
        "tier": 1,
        "kind": "beside_object",
        "personId": "F",
        "objectKind": "rug"
      },
      {
        "id": "edge_222",
        "ownerId": "F",
        "tier": 1,
        "kind": "outer_edge",
        "personId": "F"
      },
      {
        "id": "vic_242",
        "ownerId": "V",
        "tier": 1,
        "kind": "victim_alone_with_killer",
        "victimId": "V"
      }
    ],
    "metrics": {
      "maxLevel": 2,
      "stepCount": 13,
      "initialSingles": 1,
      "victimDepth": 13
    }
  },
  {
    "id": "medium-2",
    "caseNumber": 2,
    "difficulty": "medium",
    "size": 7,
    "themeId": "library",
    "title": "Finals Week Blackout",
    "tagline": "When the reading lamps blinked out for thirty seconds, the vault key vanished.",
    "premise": "During a brief thirty-second blackout on finals study night, the special-collections key disappeared! Cross-reference the patrons’ clues to catch who was alone with the victim.",
    "stolenItem": "the special-collections key",
    "seed": "MEDIUM-2",
    "rooms": [
      {
        "id": 0,
        "name": "Children’s Nook",
        "colorKey": "sage",
        "bgHex": "#E3EFE4",
        "borderHex": "#6E9A74",
        "pattern": "grass"
      },
      {
        "id": 1,
        "name": "Reading Hall",
        "colorKey": "butter",
        "bgHex": "#FBF1D6",
        "borderHex": "#C8A85B",
        "pattern": "wood"
      },
      {
        "id": 2,
        "name": "Study Carrel",
        "colorKey": "sky",
        "bgHex": "#E3EEF7",
        "borderHex": "#638DB5",
        "pattern": "tile"
      },
      {
        "id": 3,
        "name": "Periodicals",
        "colorKey": "sage",
        "bgHex": "#E3EFE4",
        "borderHex": "#6E9A74",
        "pattern": "grass"
      },
      {
        "id": 4,
        "name": "Bookbindery",
        "colorKey": "sky",
        "bgHex": "#E3EEF7",
        "borderHex": "#638DB5",
        "pattern": "tile"
      },
      {
        "id": 5,
        "name": "Rotunda",
        "colorKey": "sage",
        "bgHex": "#E3EFE4",
        "borderHex": "#6E9A74",
        "pattern": "grass"
      }
    ],
    "roomGrid": [
      [
        3,
        3,
        1,
        1,
        5,
        5,
        5
      ],
      [
        3,
        3,
        1,
        1,
        5,
        5,
        5
      ],
      [
        3,
        3,
        1,
        1,
        2,
        2,
        2
      ],
      [
        4,
        4,
        1,
        1,
        2,
        2,
        2
      ],
      [
        4,
        4,
        1,
        1,
        2,
        2,
        2
      ],
      [
        4,
        4,
        0,
        0,
        0,
        0,
        0
      ],
      [
        4,
        4,
        0,
        0,
        0,
        0,
        0
      ]
    ],
    "objects": [
      {
        "r": 0,
        "c": 0,
        "occupiable": "chair"
      },
      {
        "r": 0,
        "c": 1,
        "blocking": "table"
      },
      {
        "r": 1,
        "c": 1,
        "occupiable": "stool"
      },
      {
        "r": 1,
        "c": 2,
        "occupiable": "rug"
      },
      {
        "r": 1,
        "c": 3,
        "blocking": "shelf"
      },
      {
        "r": 1,
        "c": 4,
        "occupiable": "sofa"
      },
      {
        "r": 1,
        "c": 5,
        "blocking": "plant"
      },
      {
        "r": 2,
        "c": 0,
        "blocking": "table"
      },
      {
        "r": 2,
        "c": 2,
        "blocking": "shelf"
      },
      {
        "r": 2,
        "c": 3,
        "occupiable": "rug"
      },
      {
        "r": 2,
        "c": 5,
        "occupiable": "stool"
      },
      {
        "r": 2,
        "c": 6,
        "occupiable": "sofa"
      },
      {
        "r": 3,
        "c": 1,
        "occupiable": "chair"
      },
      {
        "r": 3,
        "c": 3,
        "blocking": "shelf"
      },
      {
        "r": 3,
        "c": 5,
        "blocking": "globe"
      },
      {
        "r": 4,
        "c": 0,
        "blocking": "table"
      },
      {
        "r": 4,
        "c": 1,
        "occupiable": "sofa"
      },
      {
        "r": 4,
        "c": 4,
        "blocking": "table"
      },
      {
        "r": 4,
        "c": 5,
        "occupiable": "stool"
      },
      {
        "r": 5,
        "c": 0,
        "blocking": "globe"
      },
      {
        "r": 5,
        "c": 1,
        "occupiable": "rug"
      },
      {
        "r": 5,
        "c": 2,
        "occupiable": "chair"
      },
      {
        "r": 5,
        "c": 6,
        "blocking": "plant"
      },
      {
        "r": 6,
        "c": 4,
        "blocking": "globe"
      },
      {
        "r": 6,
        "c": 5,
        "blocking": "plant"
      }
    ],
    "people": [
      {
        "id": "A",
        "letter": "A",
        "name": "Alice",
        "gender": "F",
        "isVictim": false,
        "color": "#D64550",
        "portraitId": 1,
        "roleTitle": "Grad Student"
      },
      {
        "id": "B",
        "letter": "B",
        "name": "Barnaby",
        "gender": "M",
        "isVictim": false,
        "color": "#2B7A78",
        "portraitId": 2,
        "roleTitle": "Archivist"
      },
      {
        "id": "C",
        "letter": "C",
        "name": "Cedric",
        "gender": "M",
        "isVictim": false,
        "color": "#D97706",
        "portraitId": 4,
        "roleTitle": "History Prof"
      },
      {
        "id": "D",
        "letter": "D",
        "name": "Dante",
        "gender": "M",
        "isVictim": false,
        "color": "#3B66B0",
        "portraitId": 6,
        "roleTitle": "Tutor"
      },
      {
        "id": "E",
        "letter": "E",
        "name": "Evelyn",
        "gender": "F",
        "isVictim": false,
        "color": "#8B4593",
        "portraitId": 9,
        "roleTitle": "Rare Book Aide"
      },
      {
        "id": "F",
        "letter": "F",
        "name": "Fiona",
        "gender": "F",
        "isVictim": false,
        "color": "#2F855A",
        "portraitId": 11,
        "roleTitle": "Night Guard"
      },
      {
        "id": "V",
        "letter": "V",
        "name": "Valerie",
        "gender": "F",
        "isVictim": true,
        "color": "#B8860B",
        "portraitId": 23,
        "roleTitle": "Head Archivist"
      }
    ],
    "victimId": "V",
    "killerId": "B",
    "solution": {
      "V": {
        "r": 3,
        "c": 0
      },
      "B": {
        "r": 5,
        "c": 1
      },
      "F": {
        "r": 4,
        "c": 2
      },
      "A": {
        "r": 1,
        "c": 4
      },
      "C": {
        "r": 0,
        "c": 5
      },
      "D": {
        "r": 2,
        "c": 6
      },
      "E": {
        "r": 6,
        "c": 3
      }
    },
    "clues": [
      {
        "id": "in_rm_1",
        "ownerId": "A",
        "tier": 1,
        "kind": "in_room",
        "personId": "A",
        "roomId": 5
      },
      {
        "id": "no_edge_22",
        "ownerId": "A",
        "tier": 1,
        "kind": "not_outer_edge",
        "personId": "A"
      },
      {
        "id": "only_on_54",
        "ownerId": "B",
        "tier": 1,
        "kind": "only_on_object",
        "personId": "B",
        "objectKind": "rug"
      },
      {
        "id": "either_85",
        "ownerId": "C",
        "tier": 1,
        "kind": "in_either_room",
        "personId": "C",
        "roomIds": [
          5,
          0
        ]
      },
      {
        "id": "not_beside_146",
        "ownerId": "D",
        "tier": 1,
        "kind": "not_beside_object",
        "personId": "D",
        "objectKind": "sofa"
      },
      {
        "id": "dir_obj_190",
        "ownerId": "E",
        "tier": 1,
        "kind": "dir_of_object",
        "personId": "E",
        "objectKind": "globe",
        "dir": "west"
      },
      {
        "id": "dir_p_249",
        "ownerId": "F",
        "tier": 2,
        "kind": "dir_from_person",
        "personId": "F",
        "otherId": "V",
        "dir": "south"
      },
      {
        "id": "vic_251",
        "ownerId": "V",
        "tier": 1,
        "kind": "victim_alone_with_killer",
        "victimId": "V"
      }
    ],
    "metrics": {
      "maxLevel": 2,
      "stepCount": 15,
      "initialSingles": 1,
      "victimDepth": 11
    }
  },
  {
    "id": "medium-3",
    "caseNumber": 3,
    "difficulty": "medium",
    "size": 7,
    "themeId": "train",
    "title": "Snowbound Express",
    "tagline": "Follow the compass chain from car to car as snow drifts past the windows.",
    "premise": "While the winter express paused at Pine Ridge Crossing, the brass lantern clock went missing! Trace the directional clues linking passengers to find who was alone with the victim.",
    "stolenItem": "the brass lantern clock",
    "patternBadge": "Compass Chain",
    "seed": "MEDIUM-3",
    "rooms": [
      {
        "id": 0,
        "name": "Dining Car",
        "colorKey": "sage",
        "bgHex": "#E3EFE4",
        "borderHex": "#6E9A74",
        "pattern": "grass"
      },
      {
        "id": 1,
        "name": "Caboose",
        "colorKey": "butter",
        "bgHex": "#FBF1D6",
        "borderHex": "#C8A85B",
        "pattern": "wood"
      },
      {
        "id": 2,
        "name": "Observation Deck",
        "colorKey": "sage",
        "bgHex": "#E3EFE4",
        "borderHex": "#6E9A74",
        "pattern": "grass"
      },
      {
        "id": 3,
        "name": "Sleeper Cabin",
        "colorKey": "butter",
        "bgHex": "#FBF1D6",
        "borderHex": "#C8A85B",
        "pattern": "wood"
      },
      {
        "id": 4,
        "name": "Ticket Booth",
        "colorKey": "sage",
        "bgHex": "#E3EFE4",
        "borderHex": "#6E9A74",
        "pattern": "grass"
      },
      {
        "id": 5,
        "name": "Baggage Bay",
        "colorKey": "sky",
        "bgHex": "#E3EEF7",
        "borderHex": "#638DB5",
        "pattern": "tile"
      }
    ],
    "roomGrid": [
      [
        4,
        4,
        5,
        5,
        0,
        0,
        0
      ],
      [
        4,
        4,
        5,
        5,
        0,
        0,
        0
      ],
      [
        4,
        4,
        5,
        5,
        0,
        0,
        0
      ],
      [
        1,
        1,
        1,
        1,
        0,
        0,
        0
      ],
      [
        1,
        1,
        1,
        1,
        0,
        0,
        0
      ],
      [
        2,
        2,
        2,
        2,
        3,
        3,
        3
      ],
      [
        2,
        2,
        2,
        2,
        3,
        3,
        3
      ]
    ],
    "objects": [
      {
        "r": 0,
        "c": 0,
        "blocking": "globe"
      },
      {
        "r": 0,
        "c": 1,
        "occupiable": "sofa"
      },
      {
        "r": 0,
        "c": 2,
        "occupiable": "booth"
      },
      {
        "r": 0,
        "c": 4,
        "blocking": "table"
      },
      {
        "r": 0,
        "c": 6,
        "blocking": "luggage"
      },
      {
        "r": 1,
        "c": 1,
        "occupiable": "rug"
      },
      {
        "r": 1,
        "c": 2,
        "blocking": "plant"
      },
      {
        "r": 2,
        "c": 1,
        "occupiable": "bed"
      },
      {
        "r": 2,
        "c": 2,
        "blocking": "luggage"
      },
      {
        "r": 3,
        "c": 0,
        "occupiable": "sofa"
      },
      {
        "r": 3,
        "c": 1,
        "occupiable": "sofa"
      },
      {
        "r": 3,
        "c": 3,
        "blocking": "luggage"
      },
      {
        "r": 3,
        "c": 4,
        "blocking": "table"
      },
      {
        "r": 3,
        "c": 6,
        "occupiable": "booth"
      },
      {
        "r": 4,
        "c": 1,
        "blocking": "plant"
      },
      {
        "r": 4,
        "c": 4,
        "blocking": "globe"
      },
      {
        "r": 4,
        "c": 6,
        "occupiable": "bed"
      },
      {
        "r": 5,
        "c": 0,
        "blocking": "table"
      },
      {
        "r": 5,
        "c": 2,
        "occupiable": "rug"
      },
      {
        "r": 5,
        "c": 3,
        "blocking": "plant"
      },
      {
        "r": 5,
        "c": 4,
        "occupiable": "rug"
      },
      {
        "r": 5,
        "c": 6,
        "occupiable": "sofa"
      },
      {
        "r": 6,
        "c": 2,
        "occupiable": "bed"
      },
      {
        "r": 6,
        "c": 5,
        "occupiable": "booth"
      },
      {
        "r": 6,
        "c": 6,
        "blocking": "globe"
      }
    ],
    "people": [
      {
        "id": "A",
        "letter": "A",
        "name": "Arthur",
        "gender": "M",
        "isVictim": false,
        "color": "#D64550",
        "portraitId": 0,
        "roleTitle": "Ski Instructor"
      },
      {
        "id": "B",
        "letter": "B",
        "name": "Barnaby",
        "gender": "M",
        "isVictim": false,
        "color": "#2B7A78",
        "portraitId": 2,
        "roleTitle": "Car Chef"
      },
      {
        "id": "C",
        "letter": "C",
        "name": "Clara",
        "gender": "F",
        "isVictim": false,
        "color": "#D97706",
        "portraitId": 5,
        "roleTitle": "Photographer"
      },
      {
        "id": "D",
        "letter": "D",
        "name": "Dante",
        "gender": "M",
        "isVictim": false,
        "color": "#3B66B0",
        "portraitId": 6,
        "roleTitle": "Cellist"
      },
      {
        "id": "E",
        "letter": "E",
        "name": "Emilio",
        "gender": "M",
        "isVictim": false,
        "color": "#8B4593",
        "portraitId": 8,
        "roleTitle": "Ticket Clerk"
      },
      {
        "id": "F",
        "letter": "F",
        "name": "Fiona",
        "gender": "F",
        "isVictim": false,
        "color": "#2F855A",
        "portraitId": 11,
        "roleTitle": "Meteorologist"
      },
      {
        "id": "V",
        "letter": "V",
        "name": "Vivian",
        "gender": "F",
        "isVictim": true,
        "color": "#B8860B",
        "portraitId": 21,
        "roleTitle": "Chief Steward"
      }
    ],
    "victimId": "V",
    "killerId": "F",
    "solution": {
      "V": {
        "r": 2,
        "c": 4
      },
      "F": {
        "r": 0,
        "c": 5
      },
      "E": {
        "r": 5,
        "c": 6
      },
      "C": {
        "r": 1,
        "c": 0
      },
      "D": {
        "r": 4,
        "c": 3
      },
      "A": {
        "r": 6,
        "c": 2
      },
      "B": {
        "r": 3,
        "c": 1
      }
    },
    "clues": [
      {
        "id": "dir_p_36",
        "ownerId": "A",
        "tier": 2,
        "kind": "dir_from_person",
        "personId": "A",
        "otherId": "E",
        "dir": "south"
      },
      {
        "id": "on_obj_14",
        "ownerId": "A",
        "tier": 1,
        "kind": "on_object",
        "personId": "A",
        "objectKind": "bed"
      },
      {
        "id": "dir_p_77",
        "ownerId": "B",
        "tier": 2,
        "kind": "dir_from_person",
        "personId": "B",
        "otherId": "D",
        "dir": "west"
      },
      {
        "id": "not_rm_50",
        "ownerId": "B",
        "tier": 1,
        "kind": "not_in_room",
        "personId": "B",
        "roomId": 0
      },
      {
        "id": "dir_obj_102",
        "ownerId": "C",
        "tier": 1,
        "kind": "dir_of_object",
        "personId": "C",
        "objectKind": "globe",
        "dir": "south"
      },
      {
        "id": "either_131",
        "ownerId": "D",
        "tier": 1,
        "kind": "in_either_room",
        "personId": "D",
        "roomIds": [
          1,
          0
        ]
      },
      {
        "id": "same_rm_155",
        "ownerId": "D",
        "tier": 2,
        "kind": "same_room_as",
        "personId": "D",
        "otherId": "B"
      },
      {
        "id": "dir_p_211",
        "ownerId": "E",
        "tier": 2,
        "kind": "dir_from_person",
        "personId": "E",
        "otherId": "V",
        "dir": "east"
      },
      {
        "id": "dir_obj_230",
        "ownerId": "F",
        "tier": 1,
        "kind": "dir_of_object",
        "personId": "F",
        "objectKind": "luggage",
        "dir": "west"
      },
      {
        "id": "vic_252",
        "ownerId": "V",
        "tier": 1,
        "kind": "victim_alone_with_killer",
        "victimId": "V"
      }
    ],
    "metrics": {
      "maxLevel": 2,
      "stepCount": 19,
      "initialSingles": 1,
      "victimDepth": 19
    }
  },
  {
    "id": "medium-4",
    "caseNumber": 4,
    "difficulty": "medium",
    "size": 7,
    "themeId": "garage",
    "title": "Friday Lockup",
    "tagline": "Closing time at the neighborhood shop, and the mascot bobblehead is gone.",
    "premise": "Just as the garage bay doors were rolling down Friday evening, the shop’s prized dashboard mascot vanished! Place the whole crew on the map to uncover who was alone with the victim.",
    "stolenItem": "the dashboard mascot",
    "seed": "MEDIUM-4",
    "rooms": [
      {
        "id": 0,
        "name": "Driveway",
        "colorKey": "sky",
        "bgHex": "#E3EEF7",
        "borderHex": "#638DB5",
        "pattern": "tile"
      },
      {
        "id": 1,
        "name": "Waiting Area",
        "colorKey": "sage",
        "bgHex": "#E3EFE4",
        "borderHex": "#6E9A74",
        "pattern": "grass"
      },
      {
        "id": 2,
        "name": "Tool Shop",
        "colorKey": "sage",
        "bgHex": "#E3EFE4",
        "borderHex": "#6E9A74",
        "pattern": "grass"
      },
      {
        "id": 3,
        "name": "Office",
        "colorKey": "butter",
        "bgHex": "#FBF1D6",
        "borderHex": "#C8A85B",
        "pattern": "wood"
      },
      {
        "id": 4,
        "name": "Parts Room",
        "colorKey": "butter",
        "bgHex": "#FBF1D6",
        "borderHex": "#C8A85B",
        "pattern": "wood"
      },
      {
        "id": 5,
        "name": "Main Bay",
        "colorKey": "sky",
        "bgHex": "#E3EEF7",
        "borderHex": "#638DB5",
        "pattern": "tile"
      }
    ],
    "roomGrid": [
      [
        4,
        4,
        5,
        5,
        1,
        1,
        1
      ],
      [
        4,
        4,
        5,
        5,
        1,
        1,
        1
      ],
      [
        4,
        4,
        5,
        5,
        1,
        1,
        1
      ],
      [
        2,
        2,
        3,
        3,
        3,
        0,
        0
      ],
      [
        2,
        2,
        3,
        3,
        3,
        0,
        0
      ],
      [
        2,
        2,
        3,
        3,
        3,
        0,
        0
      ],
      [
        2,
        2,
        3,
        3,
        3,
        0,
        0
      ]
    ],
    "objects": [
      {
        "r": 0,
        "c": 3,
        "occupiable": "oil"
      },
      {
        "r": 0,
        "c": 6,
        "occupiable": "chair"
      },
      {
        "r": 1,
        "c": 1,
        "blocking": "table"
      },
      {
        "r": 1,
        "c": 2,
        "blocking": "table"
      },
      {
        "r": 1,
        "c": 3,
        "blocking": "table"
      },
      {
        "r": 1,
        "c": 6,
        "occupiable": "car"
      },
      {
        "r": 2,
        "c": 3,
        "occupiable": "chair"
      },
      {
        "r": 2,
        "c": 4,
        "occupiable": "car"
      },
      {
        "r": 2,
        "c": 5,
        "blocking": "plant"
      },
      {
        "r": 2,
        "c": 6,
        "blocking": "shelf"
      },
      {
        "r": 3,
        "c": 1,
        "blocking": "barrel"
      },
      {
        "r": 3,
        "c": 3,
        "blocking": "plant"
      },
      {
        "r": 3,
        "c": 5,
        "occupiable": "bench"
      },
      {
        "r": 3,
        "c": 6,
        "blocking": "shelf"
      },
      {
        "r": 4,
        "c": 0,
        "occupiable": "car"
      },
      {
        "r": 4,
        "c": 3,
        "blocking": "barrel"
      },
      {
        "r": 4,
        "c": 4,
        "blocking": "plant"
      },
      {
        "r": 4,
        "c": 6,
        "blocking": "shelf"
      },
      {
        "r": 5,
        "c": 1,
        "blocking": "barrel"
      },
      {
        "r": 5,
        "c": 2,
        "occupiable": "chair"
      },
      {
        "r": 5,
        "c": 3,
        "occupiable": "oil"
      },
      {
        "r": 5,
        "c": 4,
        "occupiable": "bench"
      },
      {
        "r": 6,
        "c": 0,
        "occupiable": "oil"
      },
      {
        "r": 6,
        "c": 3,
        "occupiable": "oil"
      },
      {
        "r": 6,
        "c": 6,
        "occupiable": "bench"
      }
    ],
    "people": [
      {
        "id": "A",
        "letter": "A",
        "name": "Alice",
        "gender": "F",
        "isVictim": false,
        "color": "#D64550",
        "portraitId": 1,
        "roleTitle": "Engine Tech"
      },
      {
        "id": "B",
        "letter": "B",
        "name": "Barnaby",
        "gender": "M",
        "isVictim": false,
        "color": "#2B7A78",
        "portraitId": 2,
        "roleTitle": "Tire Specialist"
      },
      {
        "id": "C",
        "letter": "C",
        "name": "Clara",
        "gender": "F",
        "isVictim": false,
        "color": "#D97706",
        "portraitId": 5,
        "roleTitle": "Paint Mixer"
      },
      {
        "id": "D",
        "letter": "D",
        "name": "Dante",
        "gender": "M",
        "isVictim": false,
        "color": "#3B66B0",
        "portraitId": 6,
        "roleTitle": "Bookkeeper"
      },
      {
        "id": "E",
        "letter": "E",
        "name": "Evelyn",
        "gender": "F",
        "isVictim": false,
        "color": "#8B4593",
        "portraitId": 9,
        "roleTitle": "Tow Driver"
      },
      {
        "id": "F",
        "letter": "F",
        "name": "Felix",
        "gender": "M",
        "isVictim": false,
        "color": "#2F855A",
        "portraitId": 10,
        "roleTitle": "Apprentice"
      },
      {
        "id": "V",
        "letter": "V",
        "name": "Vivian",
        "gender": "F",
        "isVictim": true,
        "color": "#B8860B",
        "portraitId": 21,
        "roleTitle": "Shop Owner"
      }
    ],
    "victimId": "V",
    "killerId": "E",
    "solution": {
      "V": {
        "r": 1,
        "c": 4
      },
      "E": {
        "r": 0,
        "c": 6
      },
      "C": {
        "r": 6,
        "c": 0
      },
      "F": {
        "r": 4,
        "c": 5
      },
      "B": {
        "r": 3,
        "c": 2
      },
      "A": {
        "r": 5,
        "c": 3
      },
      "D": {
        "r": 2,
        "c": 1
      }
    },
    "clues": [
      {
        "id": "only_beside_24",
        "ownerId": "A",
        "tier": 1,
        "kind": "only_beside_object",
        "personId": "A",
        "objectKind": "barrel"
      },
      {
        "id": "no_edge_69",
        "ownerId": "B",
        "tier": 1,
        "kind": "not_outer_edge",
        "personId": "B"
      },
      {
        "id": "not_rm_54",
        "ownerId": "B",
        "tier": 1,
        "kind": "not_in_room",
        "personId": "B",
        "roomId": 1
      },
      {
        "id": "in_rm_88",
        "ownerId": "C",
        "tier": 1,
        "kind": "in_room",
        "personId": "C",
        "roomId": 2
      },
      {
        "id": "either_132",
        "ownerId": "D",
        "tier": 1,
        "kind": "in_either_room",
        "personId": "D",
        "roomIds": [
          4,
          0
        ]
      },
      {
        "id": "only_on_184",
        "ownerId": "E",
        "tier": 1,
        "kind": "only_on_object",
        "personId": "E",
        "objectKind": "chair"
      },
      {
        "id": "either_219",
        "ownerId": "F",
        "tier": 1,
        "kind": "in_either_room",
        "personId": "F",
        "roomIds": [
          0,
          5
        ]
      },
      {
        "id": "no_edge_237",
        "ownerId": "F",
        "tier": 1,
        "kind": "not_outer_edge",
        "personId": "F"
      },
      {
        "id": "vic_256",
        "ownerId": "V",
        "tier": 1,
        "kind": "victim_alone_with_killer",
        "victimId": "V"
      }
    ],
    "metrics": {
      "maxLevel": 2,
      "stepCount": 13,
      "initialSingles": 0,
      "victimDepth": 13
    }
  },
  {
    "id": "medium-5",
    "caseNumber": 5,
    "difficulty": "medium",
    "size": 7,
    "themeId": "museum",
    "title": "Opening Night Preview",
    "tagline": "One wing was completely cordoned off—squeezing the whole reception tighter.",
    "premise": "During the VIP art preview, a silver sketching compass disappeared while one gallery was closed for prep! Use the wing notes and guest clues to find who was alone with the victim.",
    "stolenItem": "the silver sketching compass",
    "patternBadge": "Closed Wing",
    "seed": "MEDIUM-5",
    "rooms": [
      {
        "id": 0,
        "name": "Gift Gallery",
        "colorKey": "sage",
        "bgHex": "#E3EFE4",
        "borderHex": "#6E9A74",
        "pattern": "grass"
      },
      {
        "id": 1,
        "name": "Sculpture Court",
        "colorKey": "butter",
        "bgHex": "#FBF1D6",
        "borderHex": "#C8A85B",
        "pattern": "wood"
      },
      {
        "id": 2,
        "name": "Curator Office",
        "colorKey": "sky",
        "bgHex": "#E3EEF7",
        "borderHex": "#638DB5",
        "pattern": "tile"
      },
      {
        "id": 3,
        "name": "Modern Room",
        "colorKey": "sage",
        "bgHex": "#E3EFE4",
        "borderHex": "#6E9A74",
        "pattern": "grass"
      },
      {
        "id": 4,
        "name": "Portrait Hall",
        "colorKey": "sky",
        "bgHex": "#E3EEF7",
        "borderHex": "#638DB5",
        "pattern": "tile"
      }
    ],
    "roomGrid": [
      [
        2,
        2,
        2,
        1,
        1,
        3,
        3
      ],
      [
        2,
        2,
        2,
        1,
        1,
        3,
        3
      ],
      [
        2,
        2,
        2,
        1,
        1,
        4,
        4
      ],
      [
        0,
        0,
        0,
        1,
        1,
        4,
        4
      ],
      [
        0,
        0,
        0,
        1,
        1,
        4,
        4
      ],
      [
        0,
        0,
        0,
        1,
        1,
        4,
        4
      ],
      [
        0,
        0,
        0,
        1,
        1,
        4,
        4
      ]
    ],
    "objects": [
      {
        "r": 0,
        "c": 0,
        "blocking": "statue"
      },
      {
        "r": 0,
        "c": 4,
        "blocking": "display"
      },
      {
        "r": 0,
        "c": 5,
        "occupiable": "rug"
      },
      {
        "r": 1,
        "c": 0,
        "occupiable": "bench"
      },
      {
        "r": 1,
        "c": 5,
        "occupiable": "mat"
      },
      {
        "r": 1,
        "c": 6,
        "blocking": "statue"
      },
      {
        "r": 2,
        "c": 0,
        "blocking": "display"
      },
      {
        "r": 2,
        "c": 2,
        "blocking": "easel"
      },
      {
        "r": 2,
        "c": 3,
        "blocking": "plant"
      },
      {
        "r": 2,
        "c": 4,
        "occupiable": "chair"
      },
      {
        "r": 2,
        "c": 5,
        "blocking": "plant"
      },
      {
        "r": 3,
        "c": 2,
        "blocking": "easel"
      },
      {
        "r": 3,
        "c": 4,
        "occupiable": "chair"
      },
      {
        "r": 3,
        "c": 5,
        "occupiable": "bench"
      },
      {
        "r": 4,
        "c": 2,
        "blocking": "easel"
      },
      {
        "r": 4,
        "c": 3,
        "blocking": "plant"
      },
      {
        "r": 4,
        "c": 6,
        "blocking": "statue"
      },
      {
        "r": 5,
        "c": 0,
        "occupiable": "bench"
      },
      {
        "r": 5,
        "c": 1,
        "occupiable": "rug"
      },
      {
        "r": 5,
        "c": 2,
        "occupiable": "rug"
      },
      {
        "r": 5,
        "c": 4,
        "occupiable": "chair"
      },
      {
        "r": 5,
        "c": 5,
        "occupiable": "mat"
      },
      {
        "r": 5,
        "c": 6,
        "blocking": "display"
      },
      {
        "r": 6,
        "c": 1,
        "blocking": "statue"
      },
      {
        "r": 6,
        "c": 5,
        "occupiable": "mat"
      }
    ],
    "people": [
      {
        "id": "A",
        "letter": "A",
        "name": "Arthur",
        "gender": "M",
        "isVictim": false,
        "color": "#D64550",
        "portraitId": 0,
        "roleTitle": "Portraitist"
      },
      {
        "id": "B",
        "letter": "B",
        "name": "Barnaby",
        "gender": "M",
        "isVictim": false,
        "color": "#2B7A78",
        "portraitId": 2,
        "roleTitle": "Sculptor"
      },
      {
        "id": "C",
        "letter": "C",
        "name": "Cedric",
        "gender": "M",
        "isVictim": false,
        "color": "#D97706",
        "portraitId": 4,
        "roleTitle": "Art Critic"
      },
      {
        "id": "D",
        "letter": "D",
        "name": "Dante",
        "gender": "M",
        "isVictim": false,
        "color": "#3B66B0",
        "portraitId": 6,
        "roleTitle": "Patron"
      },
      {
        "id": "E",
        "letter": "E",
        "name": "Emilio",
        "gender": "M",
        "isVictim": false,
        "color": "#8B4593",
        "portraitId": 8,
        "roleTitle": "Lighting Tech"
      },
      {
        "id": "F",
        "letter": "F",
        "name": "Felix",
        "gender": "M",
        "isVictim": false,
        "color": "#2F855A",
        "portraitId": 10,
        "roleTitle": "Framemaker"
      },
      {
        "id": "V",
        "letter": "V",
        "name": "Vivian",
        "gender": "F",
        "isVictim": true,
        "color": "#B8860B",
        "portraitId": 21,
        "roleTitle": "Chief Curator"
      }
    ],
    "victimId": "V",
    "killerId": "D",
    "solution": {
      "V": {
        "r": 1,
        "c": 3
      },
      "D": {
        "r": 2,
        "c": 4
      },
      "B": {
        "r": 6,
        "c": 2
      },
      "A": {
        "r": 3,
        "c": 6
      },
      "C": {
        "r": 0,
        "c": 5
      },
      "E": {
        "r": 5,
        "c": 1
      },
      "F": {
        "r": 4,
        "c": 0
      }
    },
    "clues": [
      {
        "id": "case_empty_248",
        "ownerId": "case",
        "tier": 1,
        "kind": "room_empty",
        "roomId": 2
      },
      {
        "id": "beside_17",
        "ownerId": "A",
        "tier": 1,
        "kind": "beside_object",
        "personId": "A",
        "objectKind": "bench"
      },
      {
        "id": "dir_obj_53",
        "ownerId": "B",
        "tier": 1,
        "kind": "dir_of_object",
        "personId": "B",
        "objectKind": "statue",
        "dir": "east"
      },
      {
        "id": "edge_104",
        "ownerId": "C",
        "tier": 1,
        "kind": "outer_edge",
        "personId": "C"
      },
      {
        "id": "dir_p_162",
        "ownerId": "D",
        "tier": 2,
        "kind": "dir_from_person",
        "personId": "D",
        "otherId": "V",
        "dir": "south"
      },
      {
        "id": "dir_obj_180",
        "ownerId": "E",
        "tier": 1,
        "kind": "dir_of_object",
        "personId": "E",
        "objectKind": "bench",
        "dir": "east"
      },
      {
        "id": "diag_239",
        "ownerId": "F",
        "tier": 2,
        "kind": "diagonal_to_person",
        "personId": "F",
        "otherId": "E"
      },
      {
        "id": "vic_245",
        "ownerId": "V",
        "tier": 1,
        "kind": "victim_alone_with_killer",
        "victimId": "V"
      }
    ],
    "metrics": {
      "maxLevel": 3,
      "stepCount": 19,
      "initialSingles": 1,
      "victimDepth": 15
    }
  },
  {
    "id": "hard-1",
    "caseNumber": 1,
    "difficulty": "hard",
    "size": 8,
    "themeId": "inn",
    "title": "Coastal Gale Shelter",
    "tagline": "Guests watched the storm from outer walls—or huddled deep inside.",
    "premise": "As a coastal squall rattled the windows of Gull Cove Inn, the harbormaster’s storm barometer disappeared! Combine outer-wall clues and spatial logic to catch the culprit.",
    "stolenItem": "the storm barometer",
    "patternBadge": "Storm Shelter",
    "seed": "HARD-1",
    "rooms": [
      {
        "id": 0,
        "name": "Chowder Bar",
        "colorKey": "butter",
        "bgHex": "#FBF1D6",
        "borderHex": "#C8A85B",
        "pattern": "wood"
      },
      {
        "id": 1,
        "name": "Chart Room",
        "colorKey": "sage",
        "bgHex": "#E3EFE4",
        "borderHex": "#6E9A74",
        "pattern": "grass"
      },
      {
        "id": 2,
        "name": "Lobby",
        "colorKey": "butter",
        "bgHex": "#FBF1D6",
        "borderHex": "#C8A85B",
        "pattern": "wood"
      },
      {
        "id": 3,
        "name": "Boathouse",
        "colorKey": "butter",
        "bgHex": "#FBF1D6",
        "borderHex": "#C8A85B",
        "pattern": "wood"
      },
      {
        "id": 4,
        "name": "Crows Nest",
        "colorKey": "sage",
        "bgHex": "#E3EFE4",
        "borderHex": "#6E9A74",
        "pattern": "grass"
      },
      {
        "id": 5,
        "name": "Harbor Suite",
        "colorKey": "sky",
        "bgHex": "#E3EEF7",
        "borderHex": "#638DB5",
        "pattern": "tile"
      },
      {
        "id": 6,
        "name": "Deck Porch",
        "colorKey": "sky",
        "bgHex": "#E3EEF7",
        "borderHex": "#638DB5",
        "pattern": "tile"
      }
    ],
    "roomGrid": [
      [
        2,
        2,
        2,
        2,
        1,
        1,
        1,
        1
      ],
      [
        2,
        2,
        2,
        2,
        1,
        1,
        1,
        1
      ],
      [
        6,
        6,
        6,
        6,
        3,
        3,
        3,
        3
      ],
      [
        6,
        6,
        6,
        6,
        3,
        3,
        3,
        3
      ],
      [
        6,
        6,
        6,
        6,
        4,
        4,
        5,
        5
      ],
      [
        6,
        6,
        6,
        6,
        4,
        4,
        5,
        5
      ],
      [
        0,
        0,
        0,
        0,
        4,
        4,
        5,
        5
      ],
      [
        0,
        0,
        0,
        0,
        4,
        4,
        5,
        5
      ]
    ],
    "objects": [
      {
        "r": 0,
        "c": 0,
        "blocking": "table"
      },
      {
        "r": 0,
        "c": 2,
        "occupiable": "bed"
      },
      {
        "r": 0,
        "c": 3,
        "blocking": "anchor"
      },
      {
        "r": 0,
        "c": 4,
        "occupiable": "bed"
      },
      {
        "r": 0,
        "c": 6,
        "blocking": "barrel"
      },
      {
        "r": 1,
        "c": 2,
        "occupiable": "bed"
      },
      {
        "r": 1,
        "c": 3,
        "occupiable": "mat"
      },
      {
        "r": 1,
        "c": 5,
        "blocking": "barrel"
      },
      {
        "r": 1,
        "c": 6,
        "occupiable": "booth"
      },
      {
        "r": 2,
        "c": 0,
        "blocking": "barrel"
      },
      {
        "r": 2,
        "c": 3,
        "blocking": "plant"
      },
      {
        "r": 2,
        "c": 6,
        "occupiable": "chair"
      },
      {
        "r": 2,
        "c": 7,
        "occupiable": "bed"
      },
      {
        "r": 3,
        "c": 0,
        "occupiable": "chair"
      },
      {
        "r": 3,
        "c": 2,
        "occupiable": "booth"
      },
      {
        "r": 3,
        "c": 4,
        "occupiable": "booth"
      },
      {
        "r": 3,
        "c": 5,
        "blocking": "table"
      },
      {
        "r": 3,
        "c": 6,
        "occupiable": "chair"
      },
      {
        "r": 3,
        "c": 7,
        "blocking": "table"
      },
      {
        "r": 4,
        "c": 0,
        "occupiable": "chair"
      },
      {
        "r": 4,
        "c": 2,
        "occupiable": "mat"
      },
      {
        "r": 4,
        "c": 3,
        "blocking": "plant"
      },
      {
        "r": 4,
        "c": 4,
        "occupiable": "mat"
      },
      {
        "r": 4,
        "c": 5,
        "blocking": "anchor"
      },
      {
        "r": 4,
        "c": 6,
        "occupiable": "booth"
      },
      {
        "r": 5,
        "c": 1,
        "blocking": "table"
      },
      {
        "r": 5,
        "c": 5,
        "blocking": "anchor"
      },
      {
        "r": 5,
        "c": 6,
        "blocking": "plant"
      },
      {
        "r": 6,
        "c": 0,
        "blocking": "plant"
      },
      {
        "r": 6,
        "c": 3,
        "blocking": "barrel"
      },
      {
        "r": 7,
        "c": 2,
        "occupiable": "booth"
      },
      {
        "r": 7,
        "c": 5,
        "occupiable": "mat"
      },
      {
        "r": 7,
        "c": 7,
        "blocking": "anchor"
      }
    ],
    "people": [
      {
        "id": "A",
        "letter": "A",
        "name": "Arthur",
        "gender": "M",
        "isVictim": false,
        "color": "#D64550",
        "portraitId": 0,
        "roleTitle": "Sailing Coach"
      },
      {
        "id": "B",
        "letter": "B",
        "name": "Beatrice",
        "gender": "F",
        "isVictim": false,
        "color": "#2B7A78",
        "portraitId": 3,
        "roleTitle": "Weather Watcher"
      },
      {
        "id": "C",
        "letter": "C",
        "name": "Cedric",
        "gender": "M",
        "isVictim": false,
        "color": "#D97706",
        "portraitId": 4,
        "roleTitle": "Chef"
      },
      {
        "id": "D",
        "letter": "D",
        "name": "Daisy",
        "gender": "F",
        "isVictim": false,
        "color": "#3B66B0",
        "portraitId": 7,
        "roleTitle": "Pianist"
      },
      {
        "id": "E",
        "letter": "E",
        "name": "Emilio",
        "gender": "M",
        "isVictim": false,
        "color": "#8B4593",
        "portraitId": 8,
        "roleTitle": "Ferry Mate"
      },
      {
        "id": "F",
        "letter": "F",
        "name": "Felix",
        "gender": "M",
        "isVictim": false,
        "color": "#2F855A",
        "portraitId": 10,
        "roleTitle": "Botanist"
      },
      {
        "id": "G",
        "letter": "G",
        "name": "Gideon",
        "gender": "M",
        "isVictim": false,
        "color": "#C05621",
        "portraitId": 12,
        "roleTitle": "Guest Painter"
      },
      {
        "id": "V",
        "letter": "V",
        "name": "Vincent",
        "gender": "M",
        "isVictim": true,
        "color": "#B8860B",
        "portraitId": 22,
        "roleTitle": "Harbormaster"
      }
    ],
    "victimId": "V",
    "killerId": "F",
    "solution": {
      "V": {
        "r": 2,
        "c": 1
      },
      "F": {
        "r": 5,
        "c": 0
      },
      "D": {
        "r": 0,
        "c": 7
      },
      "B": {
        "r": 4,
        "c": 4
      },
      "A": {
        "r": 6,
        "c": 5
      },
      "C": {
        "r": 7,
        "c": 2
      },
      "G": {
        "r": 3,
        "c": 6
      },
      "E": {
        "r": 1,
        "c": 3
      }
    },
    "clues": [
      {
        "id": "case_cnt_336",
        "ownerId": "case",
        "tier": 2,
        "kind": "room_exact_count",
        "roomId": 4,
        "count": 2
      },
      {
        "id": "dir_p_29",
        "ownerId": "A",
        "tier": 2,
        "kind": "dir_from_person",
        "personId": "A",
        "otherId": "B",
        "dir": "east"
      },
      {
        "id": "no_edge_26",
        "ownerId": "A",
        "tier": 1,
        "kind": "not_outer_edge",
        "personId": "A"
      },
      {
        "id": "beside_64",
        "ownerId": "B",
        "tier": 1,
        "kind": "beside_object",
        "personId": "B",
        "objectKind": "anchor"
      },
      {
        "id": "either_98",
        "ownerId": "C",
        "tier": 1,
        "kind": "in_either_room",
        "personId": "C",
        "roomIds": [
          0,
          3
        ]
      },
      {
        "id": "not_beside_115",
        "ownerId": "C",
        "tier": 1,
        "kind": "not_beside_object",
        "personId": "C",
        "objectKind": "booth"
      },
      {
        "id": "dir_p_168",
        "ownerId": "D",
        "tier": 2,
        "kind": "dir_from_person",
        "personId": "D",
        "otherId": "A",
        "dir": "east"
      },
      {
        "id": "only_beside_205",
        "ownerId": "E",
        "tier": 1,
        "kind": "only_beside_object",
        "personId": "E",
        "objectKind": "bed"
      },
      {
        "id": "edge_260",
        "ownerId": "F",
        "tier": 1,
        "kind": "outer_edge",
        "personId": "F"
      },
      {
        "id": "dir_p_324",
        "ownerId": "G",
        "tier": 2,
        "kind": "dir_from_person",
        "personId": "G",
        "otherId": "E",
        "dir": "east"
      },
      {
        "id": "only_on_297",
        "ownerId": "G",
        "tier": 1,
        "kind": "only_on_object",
        "personId": "G",
        "objectKind": "chair"
      },
      {
        "id": "vic_331",
        "ownerId": "V",
        "tier": 1,
        "kind": "victim_alone_with_killer",
        "victimId": "V"
      }
    ],
    "metrics": {
      "maxLevel": 2,
      "stepCount": 21,
      "initialSingles": 0,
      "victimDepth": 19
    }
  },
  {
    "id": "hard-2",
    "caseNumber": 2,
    "difficulty": "hard",
    "size": 8,
    "themeId": "manor",
    "title": "The Estate Appraisal",
    "tagline": "Eight appraisers walk the halls—and Lot #1 vanishes before auction.",
    "premise": "While antiques dealers cataloged Rosehall Manor before Saturday’s charity auction, the wind-up porcelain music box vanished! Deduce all eight spots without a single guess.",
    "stolenItem": "the porcelain music box",
    "seed": "HARD-2",
    "rooms": [
      {
        "id": 0,
        "name": "Gallery",
        "colorKey": "sage",
        "bgHex": "#E3EFE4",
        "borderHex": "#6E9A74",
        "pattern": "grass"
      },
      {
        "id": 1,
        "name": "Music Room",
        "colorKey": "butter",
        "bgHex": "#FBF1D6",
        "borderHex": "#C8A85B",
        "pattern": "wood"
      },
      {
        "id": 2,
        "name": "Library",
        "colorKey": "sky",
        "bgHex": "#E3EEF7",
        "borderHex": "#638DB5",
        "pattern": "tile"
      },
      {
        "id": 3,
        "name": "Foyer",
        "colorKey": "sage",
        "bgHex": "#E3EFE4",
        "borderHex": "#6E9A74",
        "pattern": "grass"
      },
      {
        "id": 4,
        "name": "Sunroom",
        "colorKey": "butter",
        "bgHex": "#FBF1D6",
        "borderHex": "#C8A85B",
        "pattern": "wood"
      },
      {
        "id": 5,
        "name": "Study",
        "colorKey": "butter",
        "bgHex": "#FBF1D6",
        "borderHex": "#C8A85B",
        "pattern": "wood"
      },
      {
        "id": 6,
        "name": "Conservatory",
        "colorKey": "sky",
        "bgHex": "#E3EEF7",
        "borderHex": "#638DB5",
        "pattern": "tile"
      }
    ],
    "roomGrid": [
      [
        5,
        5,
        6,
        6,
        6,
        6,
        6,
        6
      ],
      [
        5,
        5,
        6,
        6,
        6,
        6,
        6,
        6
      ],
      [
        3,
        3,
        3,
        1,
        1,
        1,
        0,
        0
      ],
      [
        3,
        3,
        3,
        1,
        1,
        1,
        0,
        0
      ],
      [
        4,
        4,
        4,
        2,
        2,
        2,
        0,
        0
      ],
      [
        4,
        4,
        4,
        2,
        2,
        2,
        0,
        0
      ],
      [
        4,
        4,
        4,
        2,
        2,
        2,
        0,
        0
      ],
      [
        4,
        4,
        4,
        2,
        2,
        2,
        0,
        0
      ]
    ],
    "objects": [
      {
        "r": 0,
        "c": 1,
        "blocking": "plant"
      },
      {
        "r": 0,
        "c": 4,
        "blocking": "shelf"
      },
      {
        "r": 0,
        "c": 6,
        "blocking": "shelf"
      },
      {
        "r": 1,
        "c": 0,
        "occupiable": "chair"
      },
      {
        "r": 1,
        "c": 3,
        "occupiable": "bed"
      },
      {
        "r": 1,
        "c": 7,
        "blocking": "plant"
      },
      {
        "r": 2,
        "c": 1,
        "occupiable": "rug"
      },
      {
        "r": 2,
        "c": 3,
        "blocking": "shelf"
      },
      {
        "r": 2,
        "c": 5,
        "occupiable": "bed"
      },
      {
        "r": 2,
        "c": 6,
        "occupiable": "rug"
      },
      {
        "r": 2,
        "c": 7,
        "blocking": "plant"
      },
      {
        "r": 3,
        "c": 1,
        "blocking": "piano"
      },
      {
        "r": 3,
        "c": 2,
        "blocking": "shelf"
      },
      {
        "r": 3,
        "c": 3,
        "occupiable": "chair"
      },
      {
        "r": 3,
        "c": 4,
        "occupiable": "sofa"
      },
      {
        "r": 3,
        "c": 6,
        "blocking": "piano"
      },
      {
        "r": 4,
        "c": 0,
        "blocking": "piano"
      },
      {
        "r": 4,
        "c": 2,
        "occupiable": "sofa"
      },
      {
        "r": 4,
        "c": 3,
        "occupiable": "bed"
      },
      {
        "r": 4,
        "c": 5,
        "blocking": "piano"
      },
      {
        "r": 4,
        "c": 6,
        "occupiable": "bed"
      },
      {
        "r": 5,
        "c": 0,
        "occupiable": "sofa"
      },
      {
        "r": 5,
        "c": 2,
        "occupiable": "sofa"
      },
      {
        "r": 5,
        "c": 3,
        "blocking": "plant"
      },
      {
        "r": 5,
        "c": 5,
        "occupiable": "rug"
      },
      {
        "r": 5,
        "c": 6,
        "occupiable": "chair"
      },
      {
        "r": 6,
        "c": 1,
        "blocking": "table"
      },
      {
        "r": 6,
        "c": 2,
        "blocking": "table"
      },
      {
        "r": 6,
        "c": 4,
        "blocking": "table"
      },
      {
        "r": 6,
        "c": 6,
        "occupiable": "chair"
      },
      {
        "r": 7,
        "c": 3,
        "occupiable": "rug"
      },
      {
        "r": 7,
        "c": 4,
        "occupiable": "bed"
      },
      {
        "r": 7,
        "c": 6,
        "blocking": "table"
      }
    ],
    "people": [
      {
        "id": "A",
        "letter": "A",
        "name": "Alice",
        "gender": "F",
        "isVictim": false,
        "color": "#D64550",
        "portraitId": 1,
        "roleTitle": "Clock Appraiser"
      },
      {
        "id": "B",
        "letter": "B",
        "name": "Barnaby",
        "gender": "M",
        "isVictim": false,
        "color": "#2B7A78",
        "portraitId": 2,
        "roleTitle": "Silver Dealer"
      },
      {
        "id": "C",
        "letter": "C",
        "name": "Cedric",
        "gender": "M",
        "isVictim": false,
        "color": "#D97706",
        "portraitId": 4,
        "roleTitle": "Textile Expert"
      },
      {
        "id": "D",
        "letter": "D",
        "name": "Daisy",
        "gender": "F",
        "isVictim": false,
        "color": "#3B66B0",
        "portraitId": 7,
        "roleTitle": "Auctioneer"
      },
      {
        "id": "E",
        "letter": "E",
        "name": "Evelyn",
        "gender": "F",
        "isVictim": false,
        "color": "#8B4593",
        "portraitId": 9,
        "roleTitle": "Catalog Writer"
      },
      {
        "id": "F",
        "letter": "F",
        "name": "Fiona",
        "gender": "F",
        "isVictim": false,
        "color": "#2F855A",
        "portraitId": 11,
        "roleTitle": "Restorer"
      },
      {
        "id": "G",
        "letter": "G",
        "name": "Grace",
        "gender": "F",
        "isVictim": false,
        "color": "#C05621",
        "portraitId": 13,
        "roleTitle": "Estate Lawyer"
      },
      {
        "id": "V",
        "letter": "V",
        "name": "Vincent",
        "gender": "M",
        "isVictim": true,
        "color": "#B8860B",
        "portraitId": 22,
        "roleTitle": "Manor Host"
      }
    ],
    "victimId": "V",
    "killerId": "C",
    "solution": {
      "V": {
        "r": 7,
        "c": 2
      },
      "C": {
        "r": 4,
        "c": 1
      },
      "D": {
        "r": 0,
        "c": 3
      },
      "B": {
        "r": 1,
        "c": 0
      },
      "F": {
        "r": 2,
        "c": 6
      },
      "A": {
        "r": 6,
        "c": 7
      },
      "G": {
        "r": 3,
        "c": 4
      },
      "E": {
        "r": 5,
        "c": 5
      }
    },
    "clues": [
      {
        "id": "case_cnt_337",
        "ownerId": "case",
        "tier": 2,
        "kind": "room_exact_count",
        "roomId": 5,
        "count": 1
      },
      {
        "id": "dir_p_41",
        "ownerId": "A",
        "tier": 2,
        "kind": "dir_from_person",
        "personId": "A",
        "otherId": "G",
        "dir": "south"
      },
      {
        "id": "either_2",
        "ownerId": "A",
        "tier": 1,
        "kind": "in_either_room",
        "personId": "A",
        "roomIds": [
          0,
          1
        ]
      },
      {
        "id": "not_beside_65",
        "ownerId": "B",
        "tier": 1,
        "kind": "not_beside_object",
        "personId": "B",
        "objectKind": "chair"
      },
      {
        "id": "dir_p_138",
        "ownerId": "C",
        "tier": 2,
        "kind": "dir_from_person",
        "personId": "C",
        "otherId": "V",
        "dir": "west"
      },
      {
        "id": "only_beside_115",
        "ownerId": "C",
        "tier": 1,
        "kind": "only_beside_object",
        "personId": "C",
        "objectKind": "sofa"
      },
      {
        "id": "dir_p_181",
        "ownerId": "D",
        "tier": 2,
        "kind": "dir_from_person",
        "personId": "D",
        "otherId": "F",
        "dir": "north"
      },
      {
        "id": "only_beside_157",
        "ownerId": "D",
        "tier": 1,
        "kind": "only_beside_object",
        "personId": "D",
        "objectKind": "shelf"
      },
      {
        "id": "on_obj_204",
        "ownerId": "E",
        "tier": 1,
        "kind": "on_object",
        "personId": "E",
        "objectKind": "rug"
      },
      {
        "id": "dir_obj_252",
        "ownerId": "F",
        "tier": 1,
        "kind": "dir_of_object",
        "personId": "F",
        "objectKind": "plant",
        "dir": "west"
      },
      {
        "id": "dir_p_321",
        "ownerId": "G",
        "tier": 2,
        "kind": "dir_from_person",
        "personId": "G",
        "otherId": "D",
        "dir": "east"
      },
      {
        "id": "vic_331",
        "ownerId": "V",
        "tier": 1,
        "kind": "victim_alone_with_killer",
        "victimId": "V"
      }
    ],
    "metrics": {
      "maxLevel": 2,
      "stepCount": 21,
      "initialSingles": 0,
      "victimDepth": 21
    }
  },
  {
    "id": "hard-3",
    "caseNumber": 3,
    "difficulty": "hard",
    "size": 8,
    "themeId": "garden",
    "title": "Lantern Walk in the Glasshouse",
    "tagline": "Twilight shadows across eight botanical beds and one missing silver tag.",
    "premise": "During the twilight lantern walk, the rare silver botanical tag vanished from the prize fern! Use intersecting row, column, and neighbor clues to see who was alone with the victim.",
    "stolenItem": "the silver botanical tag",
    "seed": "HARD-3",
    "rooms": [
      {
        "id": 0,
        "name": "Tea Pavilion",
        "colorKey": "sage",
        "bgHex": "#E3EFE4",
        "borderHex": "#6E9A74",
        "pattern": "grass"
      },
      {
        "id": 1,
        "name": "Orchid House",
        "colorKey": "blush",
        "bgHex": "#F8E7E4",
        "borderHex": "#C0776E",
        "pattern": "carpet"
      },
      {
        "id": 2,
        "name": "Herb Walk",
        "colorKey": "butter",
        "bgHex": "#FBF1D6",
        "borderHex": "#C8A85B",
        "pattern": "wood"
      },
      {
        "id": 3,
        "name": "Fern Grotto",
        "colorKey": "sage",
        "bgHex": "#E3EFE4",
        "borderHex": "#6E9A74",
        "pattern": "grass"
      },
      {
        "id": 4,
        "name": "Potting Shed",
        "colorKey": "sky",
        "bgHex": "#E3EEF7",
        "borderHex": "#638DB5",
        "pattern": "tile"
      },
      {
        "id": 5,
        "name": "Cactus Dome",
        "colorKey": "sky",
        "bgHex": "#E3EEF7",
        "borderHex": "#638DB5",
        "pattern": "tile"
      },
      {
        "id": 6,
        "name": "Rose Courtyard",
        "colorKey": "butter",
        "bgHex": "#FBF1D6",
        "borderHex": "#C8A85B",
        "pattern": "wood"
      }
    ],
    "roomGrid": [
      [
        5,
        5,
        1,
        1,
        1,
        1,
        0,
        0
      ],
      [
        5,
        5,
        1,
        1,
        1,
        1,
        0,
        0
      ],
      [
        5,
        5,
        2,
        2,
        2,
        2,
        0,
        0
      ],
      [
        5,
        5,
        2,
        2,
        2,
        2,
        0,
        0
      ],
      [
        5,
        5,
        2,
        2,
        2,
        2,
        0,
        0
      ],
      [
        5,
        5,
        3,
        3,
        4,
        4,
        4,
        4
      ],
      [
        6,
        6,
        3,
        3,
        4,
        4,
        4,
        4
      ],
      [
        6,
        6,
        3,
        3,
        4,
        4,
        4,
        4
      ]
    ],
    "objects": [
      {
        "r": 0,
        "c": 1,
        "occupiable": "bench"
      },
      {
        "r": 0,
        "c": 4,
        "occupiable": "rug"
      },
      {
        "r": 0,
        "c": 5,
        "occupiable": "chair"
      },
      {
        "r": 0,
        "c": 7,
        "blocking": "tree"
      },
      {
        "r": 1,
        "c": 1,
        "blocking": "plant"
      },
      {
        "r": 1,
        "c": 2,
        "blocking": "statue"
      },
      {
        "r": 1,
        "c": 3,
        "blocking": "tree"
      },
      {
        "r": 1,
        "c": 4,
        "occupiable": "rug"
      },
      {
        "r": 1,
        "c": 6,
        "occupiable": "mat"
      },
      {
        "r": 2,
        "c": 2,
        "occupiable": "chair"
      },
      {
        "r": 2,
        "c": 3,
        "blocking": "fountain"
      },
      {
        "r": 2,
        "c": 4,
        "occupiable": "mat"
      },
      {
        "r": 2,
        "c": 7,
        "blocking": "fountain"
      },
      {
        "r": 3,
        "c": 1,
        "blocking": "plant"
      },
      {
        "r": 3,
        "c": 2,
        "blocking": "fountain"
      },
      {
        "r": 3,
        "c": 5,
        "occupiable": "mat"
      },
      {
        "r": 4,
        "c": 0,
        "occupiable": "bench"
      },
      {
        "r": 4,
        "c": 2,
        "blocking": "statue"
      },
      {
        "r": 4,
        "c": 7,
        "blocking": "tree"
      },
      {
        "r": 5,
        "c": 1,
        "blocking": "fountain"
      },
      {
        "r": 5,
        "c": 3,
        "occupiable": "rug"
      },
      {
        "r": 5,
        "c": 6,
        "occupiable": "mat"
      },
      {
        "r": 6,
        "c": 0,
        "blocking": "plant"
      },
      {
        "r": 6,
        "c": 1,
        "occupiable": "bench"
      },
      {
        "r": 6,
        "c": 4,
        "blocking": "statue"
      },
      {
        "r": 6,
        "c": 5,
        "occupiable": "rug"
      },
      {
        "r": 6,
        "c": 6,
        "occupiable": "bench"
      },
      {
        "r": 6,
        "c": 7,
        "blocking": "statue"
      },
      {
        "r": 7,
        "c": 0,
        "occupiable": "chair"
      },
      {
        "r": 7,
        "c": 3,
        "blocking": "tree"
      },
      {
        "r": 7,
        "c": 4,
        "blocking": "plant"
      },
      {
        "r": 7,
        "c": 5,
        "occupiable": "rug"
      },
      {
        "r": 7,
        "c": 7,
        "occupiable": "chair"
      }
    ],
    "people": [
      {
        "id": "A",
        "letter": "A",
        "name": "Arthur",
        "gender": "M",
        "isVictim": false,
        "color": "#D64550",
        "portraitId": 0,
        "roleTitle": "Fern Specialist"
      },
      {
        "id": "B",
        "letter": "B",
        "name": "Beatrice",
        "gender": "F",
        "isVictim": false,
        "color": "#2B7A78",
        "portraitId": 3,
        "roleTitle": "Beekeeper"
      },
      {
        "id": "C",
        "letter": "C",
        "name": "Clara",
        "gender": "F",
        "isVictim": false,
        "color": "#D97706",
        "portraitId": 5,
        "roleTitle": "Herbalist"
      },
      {
        "id": "D",
        "letter": "D",
        "name": "Dante",
        "gender": "M",
        "isVictim": false,
        "color": "#3B66B0",
        "portraitId": 6,
        "roleTitle": "Glassblower"
      },
      {
        "id": "E",
        "letter": "E",
        "name": "Evelyn",
        "gender": "F",
        "isVictim": false,
        "color": "#8B4593",
        "portraitId": 9,
        "roleTitle": "Night Guide"
      },
      {
        "id": "F",
        "letter": "F",
        "name": "Fiona",
        "gender": "F",
        "isVictim": false,
        "color": "#2F855A",
        "portraitId": 11,
        "roleTitle": "Watercolorist"
      },
      {
        "id": "G",
        "letter": "G",
        "name": "Gideon",
        "gender": "M",
        "isVictim": false,
        "color": "#C05621",
        "portraitId": 12,
        "roleTitle": "Seed Keeper"
      },
      {
        "id": "V",
        "letter": "V",
        "name": "Vivian",
        "gender": "F",
        "isVictim": true,
        "color": "#B8860B",
        "portraitId": 21,
        "roleTitle": "Park Curator"
      }
    ],
    "victimId": "V",
    "killerId": "C",
    "solution": {
      "V": {
        "r": 0,
        "c": 1
      },
      "C": {
        "r": 1,
        "c": 0
      },
      "B": {
        "r": 5,
        "c": 6
      },
      "F": {
        "r": 3,
        "c": 3
      },
      "G": {
        "r": 6,
        "c": 2
      },
      "D": {
        "r": 4,
        "c": 5
      },
      "E": {
        "r": 7,
        "c": 7
      },
      "A": {
        "r": 2,
        "c": 4
      }
    },
    "clues": [
      {
        "id": "case_empty_325",
        "ownerId": "case",
        "tier": 1,
        "kind": "room_empty",
        "roomId": 0
      },
      {
        "id": "dir_obj_23",
        "ownerId": "A",
        "tier": 1,
        "kind": "dir_of_object",
        "personId": "A",
        "objectKind": "fountain",
        "dir": "east"
      },
      {
        "id": "dir_p_40",
        "ownerId": "A",
        "tier": 2,
        "kind": "dir_from_person",
        "personId": "A",
        "otherId": "F",
        "dir": "east"
      },
      {
        "id": "on_obj_60",
        "ownerId": "B",
        "tier": 1,
        "kind": "on_object",
        "personId": "B",
        "objectKind": "mat"
      },
      {
        "id": "bare_106",
        "ownerId": "C",
        "tier": 1,
        "kind": "on_empty_floor",
        "personId": "C"
      },
      {
        "id": "only_beside_159",
        "ownerId": "D",
        "tier": 1,
        "kind": "only_beside_object",
        "personId": "D",
        "objectKind": "mat"
      },
      {
        "id": "dir_p_214",
        "ownerId": "E",
        "tier": 2,
        "kind": "dir_from_person",
        "personId": "E",
        "otherId": "B",
        "dir": "south"
      },
      {
        "id": "edge_209",
        "ownerId": "E",
        "tier": 1,
        "kind": "outer_edge",
        "personId": "E"
      },
      {
        "id": "same_rm_266",
        "ownerId": "F",
        "tier": 2,
        "kind": "same_room_as",
        "personId": "F",
        "otherId": "D"
      },
      {
        "id": "either_282",
        "ownerId": "G",
        "tier": 1,
        "kind": "in_either_room",
        "personId": "G",
        "roomIds": [
          3,
          1
        ]
      },
      {
        "id": "vic_324",
        "ownerId": "V",
        "tier": 1,
        "kind": "victim_alone_with_killer",
        "victimId": "V"
      }
    ],
    "metrics": {
      "maxLevel": 3,
      "stepCount": 21,
      "initialSingles": 0,
      "victimDepth": 13
    }
  },
  {
    "id": "hard-4",
    "caseNumber": 4,
    "difficulty": "hard",
    "size": 8,
    "themeId": "library",
    "title": "The Rare Donations Box",
    "tagline": "Zero easy giveaways—trace books, globes, and study rooms together.",
    "premise": "While volunteers unpacked a newly donated trunk of vintage maps, the 1920s celestial star chart disappeared! Lock down every volunteer’s location to unmask the culprit.",
    "stolenItem": "the vintage celestial star chart",
    "seed": "HARD-4",
    "rooms": [
      {
        "id": 0,
        "name": "Map Room",
        "colorKey": "sky",
        "bgHex": "#E3EEF7",
        "borderHex": "#638DB5",
        "pattern": "tile"
      },
      {
        "id": 1,
        "name": "Children’s Nook",
        "colorKey": "butter",
        "bgHex": "#FBF1D6",
        "borderHex": "#C8A85B",
        "pattern": "wood"
      },
      {
        "id": 2,
        "name": "Reading Hall",
        "colorKey": "sky",
        "bgHex": "#E3EEF7",
        "borderHex": "#638DB5",
        "pattern": "tile"
      },
      {
        "id": 3,
        "name": "Study Carrel",
        "colorKey": "butter",
        "bgHex": "#FBF1D6",
        "borderHex": "#C8A85B",
        "pattern": "wood"
      },
      {
        "id": 4,
        "name": "Rotunda",
        "colorKey": "sage",
        "bgHex": "#E3EFE4",
        "borderHex": "#6E9A74",
        "pattern": "grass"
      },
      {
        "id": 5,
        "name": "Archive Vault",
        "colorKey": "sky",
        "bgHex": "#E3EEF7",
        "borderHex": "#638DB5",
        "pattern": "tile"
      },
      {
        "id": 6,
        "name": "Bookbindery",
        "colorKey": "sage",
        "bgHex": "#E3EFE4",
        "borderHex": "#6E9A74",
        "pattern": "grass"
      }
    ],
    "roomGrid": [
      [
        5,
        5,
        5,
        5,
        6,
        6,
        6,
        6
      ],
      [
        5,
        5,
        5,
        5,
        6,
        6,
        6,
        6
      ],
      [
        3,
        3,
        4,
        4,
        1,
        1,
        0,
        0
      ],
      [
        3,
        3,
        4,
        4,
        1,
        1,
        0,
        0
      ],
      [
        3,
        3,
        4,
        4,
        1,
        1,
        0,
        0
      ],
      [
        3,
        3,
        4,
        4,
        1,
        1,
        0,
        0
      ],
      [
        2,
        2,
        2,
        2,
        1,
        1,
        0,
        0
      ],
      [
        2,
        2,
        2,
        2,
        1,
        1,
        0,
        0
      ]
    ],
    "objects": [
      {
        "r": 0,
        "c": 2,
        "occupiable": "chair"
      },
      {
        "r": 0,
        "c": 3,
        "occupiable": "sofa"
      },
      {
        "r": 0,
        "c": 4,
        "occupiable": "stool"
      },
      {
        "r": 0,
        "c": 5,
        "blocking": "globe"
      },
      {
        "r": 0,
        "c": 7,
        "occupiable": "rug"
      },
      {
        "r": 1,
        "c": 1,
        "blocking": "globe"
      },
      {
        "r": 1,
        "c": 3,
        "blocking": "plant"
      },
      {
        "r": 1,
        "c": 5,
        "blocking": "globe"
      },
      {
        "r": 2,
        "c": 0,
        "occupiable": "stool"
      },
      {
        "r": 2,
        "c": 2,
        "blocking": "plant"
      },
      {
        "r": 2,
        "c": 4,
        "occupiable": "chair"
      },
      {
        "r": 2,
        "c": 6,
        "occupiable": "chair"
      },
      {
        "r": 3,
        "c": 1,
        "blocking": "table"
      },
      {
        "r": 3,
        "c": 5,
        "occupiable": "sofa"
      },
      {
        "r": 3,
        "c": 6,
        "occupiable": "stool"
      },
      {
        "r": 4,
        "c": 0,
        "blocking": "shelf"
      },
      {
        "r": 4,
        "c": 1,
        "occupiable": "rug"
      },
      {
        "r": 4,
        "c": 3,
        "blocking": "globe"
      },
      {
        "r": 4,
        "c": 5,
        "blocking": "table"
      },
      {
        "r": 4,
        "c": 7,
        "blocking": "shelf"
      },
      {
        "r": 5,
        "c": 1,
        "occupiable": "sofa"
      },
      {
        "r": 5,
        "c": 2,
        "occupiable": "sofa"
      },
      {
        "r": 5,
        "c": 6,
        "occupiable": "stool"
      },
      {
        "r": 6,
        "c": 1,
        "occupiable": "chair"
      },
      {
        "r": 6,
        "c": 4,
        "occupiable": "stool"
      },
      {
        "r": 6,
        "c": 5,
        "blocking": "table"
      },
      {
        "r": 6,
        "c": 7,
        "blocking": "shelf"
      },
      {
        "r": 7,
        "c": 1,
        "blocking": "plant"
      },
      {
        "r": 7,
        "c": 2,
        "blocking": "table"
      },
      {
        "r": 7,
        "c": 3,
        "occupiable": "rug"
      },
      {
        "r": 7,
        "c": 4,
        "blocking": "plant"
      },
      {
        "r": 7,
        "c": 5,
        "occupiable": "rug"
      },
      {
        "r": 7,
        "c": 6,
        "blocking": "shelf"
      }
    ],
    "people": [
      {
        "id": "A",
        "letter": "A",
        "name": "Arthur",
        "gender": "M",
        "isVictim": false,
        "color": "#D64550",
        "portraitId": 0,
        "roleTitle": "Cartographer"
      },
      {
        "id": "B",
        "letter": "B",
        "name": "Barnaby",
        "gender": "M",
        "isVictim": false,
        "color": "#2B7A78",
        "portraitId": 2,
        "roleTitle": "Binder"
      },
      {
        "id": "C",
        "letter": "C",
        "name": "Clara",
        "gender": "F",
        "isVictim": false,
        "color": "#D97706",
        "portraitId": 5,
        "roleTitle": "Calligrapher"
      },
      {
        "id": "D",
        "letter": "D",
        "name": "Daisy",
        "gender": "F",
        "isVictim": false,
        "color": "#3B66B0",
        "portraitId": 7,
        "roleTitle": "Archivist"
      },
      {
        "id": "E",
        "letter": "E",
        "name": "Evelyn",
        "gender": "F",
        "isVictim": false,
        "color": "#8B4593",
        "portraitId": 9,
        "roleTitle": "Donor Liaison"
      },
      {
        "id": "F",
        "letter": "F",
        "name": "Fiona",
        "gender": "F",
        "isVictim": false,
        "color": "#2F855A",
        "portraitId": 11,
        "roleTitle": "Volunteer"
      },
      {
        "id": "G",
        "letter": "G",
        "name": "Grace",
        "gender": "F",
        "isVictim": false,
        "color": "#C05621",
        "portraitId": 13,
        "roleTitle": "Preservationist"
      },
      {
        "id": "V",
        "letter": "V",
        "name": "Vincent",
        "gender": "M",
        "isVictim": true,
        "color": "#B8860B",
        "portraitId": 22,
        "roleTitle": "Head Librarian"
      }
    ],
    "victimId": "V",
    "killerId": "E",
    "solution": {
      "V": {
        "r": 5,
        "c": 0
      },
      "E": {
        "r": 4,
        "c": 1
      },
      "B": {
        "r": 1,
        "c": 7
      },
      "C": {
        "r": 2,
        "c": 6
      },
      "A": {
        "r": 0,
        "c": 3
      },
      "D": {
        "r": 6,
        "c": 2
      },
      "G": {
        "r": 3,
        "c": 4
      },
      "F": {
        "r": 7,
        "c": 5
      }
    },
    "clues": [
      {
        "id": "beside_24",
        "ownerId": "A",
        "tier": 1,
        "kind": "beside_object",
        "personId": "A",
        "objectKind": "plant"
      },
      {
        "id": "dir_p_33",
        "ownerId": "A",
        "tier": 2,
        "kind": "dir_from_person",
        "personId": "A",
        "otherId": "C",
        "dir": "north"
      },
      {
        "id": "alone_rm_51",
        "ownerId": "B",
        "tier": 1,
        "kind": "alone_in_room",
        "personId": "B",
        "roomId": 6
      },
      {
        "id": "beside_70",
        "ownerId": "B",
        "tier": 1,
        "kind": "beside_object",
        "personId": "B",
        "objectKind": "rug"
      },
      {
        "id": "dir_p_143",
        "ownerId": "C",
        "tier": 2,
        "kind": "dir_from_person",
        "personId": "C",
        "otherId": "G",
        "dir": "east"
      },
      {
        "id": "on_obj_113",
        "ownerId": "C",
        "tier": 1,
        "kind": "on_object",
        "personId": "C",
        "objectKind": "chair"
      },
      {
        "id": "diff_rm_186",
        "ownerId": "D",
        "tier": 2,
        "kind": "diff_room_from",
        "personId": "D",
        "otherId": "F"
      },
      {
        "id": "either_154",
        "ownerId": "D",
        "tier": 1,
        "kind": "in_either_room",
        "personId": "D",
        "roomIds": [
          2,
          5
        ]
      },
      {
        "id": "no_edge_220",
        "ownerId": "E",
        "tier": 1,
        "kind": "not_outer_edge",
        "personId": "E"
      },
      {
        "id": "beside_261",
        "ownerId": "F",
        "tier": 1,
        "kind": "beside_object",
        "personId": "F",
        "objectKind": "plant"
      },
      {
        "id": "dir_obj_303",
        "ownerId": "G",
        "tier": 1,
        "kind": "dir_of_object",
        "personId": "G",
        "objectKind": "chair",
        "dir": "south"
      },
      {
        "id": "vic_334",
        "ownerId": "V",
        "tier": 1,
        "kind": "victim_alone_with_killer",
        "victimId": "V"
      }
    ],
    "metrics": {
      "maxLevel": 3,
      "stepCount": 19,
      "initialSingles": 0,
      "victimDepth": 16
    }
  },
  {
    "id": "hard-5",
    "caseNumber": 5,
    "difficulty": "hard",
    "size": 8,
    "themeId": "garage",
    "title": "Classic Car Concours",
    "tagline": "Vintage roadsters, fresh oil spots, and a missing championship stopwatch.",
    "premise": "Right before the classic roadster rally flag dropped, the brass rally stopwatch went missing! Piece together the showroom cars, oil slicks, and crew clues to catch the culprit.",
    "stolenItem": "the brass rally stopwatch",
    "patternBadge": "Showroom Floor",
    "seed": "HARD-5",
    "rooms": [
      {
        "id": 0,
        "name": "Parts Room",
        "colorKey": "butter",
        "bgHex": "#FBF1D6",
        "borderHex": "#C8A85B",
        "pattern": "wood"
      },
      {
        "id": 1,
        "name": "Main Bay",
        "colorKey": "sage",
        "bgHex": "#E3EFE4",
        "borderHex": "#6E9A74",
        "pattern": "grass"
      },
      {
        "id": 2,
        "name": "Driveway",
        "colorKey": "sage",
        "bgHex": "#E3EFE4",
        "borderHex": "#6E9A74",
        "pattern": "grass"
      },
      {
        "id": 3,
        "name": "Office",
        "colorKey": "butter",
        "bgHex": "#FBF1D6",
        "borderHex": "#C8A85B",
        "pattern": "wood"
      },
      {
        "id": 4,
        "name": "Waiting Area",
        "colorKey": "sky",
        "bgHex": "#E3EEF7",
        "borderHex": "#638DB5",
        "pattern": "tile"
      },
      {
        "id": 5,
        "name": "Paint Booth",
        "colorKey": "sage",
        "bgHex": "#E3EFE4",
        "borderHex": "#6E9A74",
        "pattern": "grass"
      }
    ],
    "roomGrid": [
      [
        4,
        4,
        4,
        4,
        4,
        5,
        5,
        5
      ],
      [
        4,
        4,
        4,
        4,
        4,
        5,
        5,
        5
      ],
      [
        2,
        2,
        2,
        2,
        0,
        0,
        0,
        0
      ],
      [
        2,
        2,
        2,
        2,
        0,
        0,
        0,
        0
      ],
      [
        2,
        2,
        2,
        2,
        0,
        0,
        0,
        0
      ],
      [
        3,
        3,
        3,
        3,
        1,
        1,
        1,
        1
      ],
      [
        3,
        3,
        3,
        3,
        1,
        1,
        1,
        1
      ],
      [
        3,
        3,
        3,
        3,
        1,
        1,
        1,
        1
      ]
    ],
    "objects": [
      {
        "r": 0,
        "c": 2,
        "blocking": "table"
      },
      {
        "r": 0,
        "c": 7,
        "blocking": "plant"
      },
      {
        "r": 1,
        "c": 0,
        "blocking": "barrel"
      },
      {
        "r": 1,
        "c": 1,
        "occupiable": "bench"
      },
      {
        "r": 1,
        "c": 2,
        "blocking": "barrel"
      },
      {
        "r": 1,
        "c": 5,
        "occupiable": "bench"
      },
      {
        "r": 2,
        "c": 0,
        "occupiable": "bench"
      },
      {
        "r": 2,
        "c": 2,
        "blocking": "table"
      },
      {
        "r": 2,
        "c": 5,
        "occupiable": "car"
      },
      {
        "r": 2,
        "c": 7,
        "occupiable": "chair"
      },
      {
        "r": 3,
        "c": 1,
        "blocking": "barrel"
      },
      {
        "r": 3,
        "c": 4,
        "occupiable": "car"
      },
      {
        "r": 3,
        "c": 5,
        "blocking": "shelf"
      },
      {
        "r": 3,
        "c": 7,
        "occupiable": "oil"
      },
      {
        "r": 4,
        "c": 0,
        "blocking": "shelf"
      },
      {
        "r": 4,
        "c": 3,
        "occupiable": "bench"
      },
      {
        "r": 4,
        "c": 4,
        "blocking": "barrel"
      },
      {
        "r": 4,
        "c": 5,
        "blocking": "shelf"
      },
      {
        "r": 4,
        "c": 7,
        "occupiable": "car"
      },
      {
        "r": 5,
        "c": 0,
        "blocking": "table"
      },
      {
        "r": 5,
        "c": 3,
        "occupiable": "oil"
      },
      {
        "r": 5,
        "c": 4,
        "occupiable": "oil"
      },
      {
        "r": 5,
        "c": 5,
        "occupiable": "car"
      },
      {
        "r": 5,
        "c": 6,
        "occupiable": "oil"
      },
      {
        "r": 6,
        "c": 0,
        "blocking": "table"
      },
      {
        "r": 6,
        "c": 2,
        "occupiable": "oil"
      },
      {
        "r": 6,
        "c": 3,
        "occupiable": "chair"
      },
      {
        "r": 6,
        "c": 5,
        "blocking": "plant"
      },
      {
        "r": 6,
        "c": 6,
        "occupiable": "chair"
      },
      {
        "r": 7,
        "c": 3,
        "blocking": "plant"
      },
      {
        "r": 7,
        "c": 4,
        "blocking": "shelf"
      },
      {
        "r": 7,
        "c": 5,
        "blocking": "plant"
      },
      {
        "r": 7,
        "c": 6,
        "occupiable": "chair"
      }
    ],
    "people": [
      {
        "id": "A",
        "letter": "A",
        "name": "Arthur",
        "gender": "M",
        "isVictim": false,
        "color": "#D64550",
        "portraitId": 0,
        "roleTitle": "Rally Driver"
      },
      {
        "id": "B",
        "letter": "B",
        "name": "Beatrice",
        "gender": "F",
        "isVictim": false,
        "color": "#2B7A78",
        "portraitId": 3,
        "roleTitle": "Pit Chief"
      },
      {
        "id": "C",
        "letter": "C",
        "name": "Cedric",
        "gender": "M",
        "isVictim": false,
        "color": "#D97706",
        "portraitId": 4,
        "roleTitle": "Upholsterer"
      },
      {
        "id": "D",
        "letter": "D",
        "name": "Daisy",
        "gender": "F",
        "isVictim": false,
        "color": "#3B66B0",
        "portraitId": 7,
        "roleTitle": "Chrome Polisher"
      },
      {
        "id": "E",
        "letter": "E",
        "name": "Emilio",
        "gender": "M",
        "isVictim": false,
        "color": "#8B4593",
        "portraitId": 8,
        "roleTitle": "Timekeeper"
      },
      {
        "id": "F",
        "letter": "F",
        "name": "Felix",
        "gender": "M",
        "isVictim": false,
        "color": "#2F855A",
        "portraitId": 10,
        "roleTitle": "Photographer"
      },
      {
        "id": "G",
        "letter": "G",
        "name": "Gideon",
        "gender": "M",
        "isVictim": false,
        "color": "#C05621",
        "portraitId": 12,
        "roleTitle": "Restorer"
      },
      {
        "id": "V",
        "letter": "V",
        "name": "Vincent",
        "gender": "M",
        "isVictim": true,
        "color": "#B8860B",
        "portraitId": 22,
        "roleTitle": "Rally Host"
      }
    ],
    "victimId": "V",
    "killerId": "E",
    "solution": {
      "V": {
        "r": 1,
        "c": 6
      },
      "E": {
        "r": 0,
        "c": 5
      },
      "A": {
        "r": 4,
        "c": 3
      },
      "B": {
        "r": 2,
        "c": 7
      },
      "F": {
        "r": 6,
        "c": 2
      },
      "G": {
        "r": 7,
        "c": 0
      },
      "D": {
        "r": 3,
        "c": 4
      },
      "C": {
        "r": 5,
        "c": 1
      }
    },
    "clues": [
      {
        "id": "dir_p_30",
        "ownerId": "A",
        "tier": 2,
        "kind": "dir_from_person",
        "personId": "A",
        "otherId": "C",
        "dir": "east"
      },
      {
        "id": "dir_obj_68",
        "ownerId": "B",
        "tier": 1,
        "kind": "dir_of_object",
        "personId": "B",
        "objectKind": "oil",
        "dir": "north"
      },
      {
        "id": "same_rm_76",
        "ownerId": "B",
        "tier": 2,
        "kind": "same_room_as",
        "personId": "B",
        "otherId": "D"
      },
      {
        "id": "no_edge_112",
        "ownerId": "C",
        "tier": 1,
        "kind": "not_outer_edge",
        "personId": "C"
      },
      {
        "id": "only_on_147",
        "ownerId": "D",
        "tier": 1,
        "kind": "only_on_object",
        "personId": "D",
        "objectKind": "car"
      },
      {
        "id": "beside_197",
        "ownerId": "E",
        "tier": 1,
        "kind": "beside_object",
        "personId": "E",
        "objectKind": "bench"
      },
      {
        "id": "edge_203",
        "ownerId": "E",
        "tier": 1,
        "kind": "outer_edge",
        "personId": "E"
      },
      {
        "id": "dir_obj_245",
        "ownerId": "F",
        "tier": 1,
        "kind": "dir_of_object",
        "personId": "F",
        "objectKind": "chair",
        "dir": "west"
      },
      {
        "id": "same_rm_299",
        "ownerId": "G",
        "tier": 2,
        "kind": "same_room_as",
        "personId": "G",
        "otherId": "C"
      },
      {
        "id": "vic_314",
        "ownerId": "V",
        "tier": 1,
        "kind": "victim_alone_with_killer",
        "victimId": "V"
      }
    ],
    "metrics": {
      "maxLevel": 2,
      "stepCount": 23,
      "initialSingles": 0,
      "victimDepth": 22
    }
  },
  {
    "id": "expert-1",
    "caseNumber": 1,
    "difficulty": "expert",
    "size": 9,
    "themeId": "train",
    "title": "The Grand Transcontinental",
    "tagline": "Nine travelers across midnight sleeper cars—pure chain deduction.",
    "premise": "Somewhere across the midnight canyon bridge, the Starlight Express’s gold-plated master key disappeared! Deduce all nine berths and seats to catch who was alone with the victim.",
    "stolenItem": "the gold-plated master key",
    "seed": "EXPERT-1",
    "rooms": [
      {
        "id": 0,
        "name": "Observation Deck",
        "colorKey": "butter",
        "bgHex": "#FBF1D6",
        "borderHex": "#C8A85B",
        "pattern": "wood"
      },
      {
        "id": 1,
        "name": "Dining Car",
        "colorKey": "butter",
        "bgHex": "#FBF1D6",
        "borderHex": "#C8A85B",
        "pattern": "wood"
      },
      {
        "id": 2,
        "name": "Ticket Booth",
        "colorKey": "sage",
        "bgHex": "#E3EFE4",
        "borderHex": "#6E9A74",
        "pattern": "grass"
      },
      {
        "id": 3,
        "name": "Caboose",
        "colorKey": "sage",
        "bgHex": "#E3EFE4",
        "borderHex": "#6E9A74",
        "pattern": "grass"
      },
      {
        "id": 4,
        "name": "Baggage Bay",
        "colorKey": "sky",
        "bgHex": "#E3EEF7",
        "borderHex": "#638DB5",
        "pattern": "tile"
      },
      {
        "id": 5,
        "name": "Tea Car",
        "colorKey": "sky",
        "bgHex": "#E3EEF7",
        "borderHex": "#638DB5",
        "pattern": "tile"
      },
      {
        "id": 6,
        "name": "Sleeper Cabin",
        "colorKey": "butter",
        "bgHex": "#FBF1D6",
        "borderHex": "#C8A85B",
        "pattern": "wood"
      },
      {
        "id": 7,
        "name": "Lounge Car",
        "colorKey": "sage",
        "bgHex": "#E3EFE4",
        "borderHex": "#6E9A74",
        "pattern": "grass"
      }
    ],
    "roomGrid": [
      [
        6,
        6,
        6,
        3,
        3,
        4,
        4,
        4,
        4
      ],
      [
        6,
        6,
        6,
        3,
        3,
        4,
        4,
        4,
        4
      ],
      [
        6,
        6,
        6,
        3,
        3,
        4,
        4,
        4,
        4
      ],
      [
        7,
        7,
        7,
        0,
        0,
        0,
        0,
        0,
        0
      ],
      [
        7,
        7,
        7,
        0,
        0,
        0,
        0,
        0,
        0
      ],
      [
        1,
        1,
        1,
        2,
        2,
        5,
        5,
        0,
        0
      ],
      [
        1,
        1,
        1,
        2,
        2,
        5,
        5,
        0,
        0
      ],
      [
        1,
        1,
        1,
        2,
        2,
        5,
        5,
        0,
        0
      ],
      [
        1,
        1,
        1,
        2,
        2,
        5,
        5,
        0,
        0
      ]
    ],
    "objects": [
      {
        "r": 0,
        "c": 0,
        "occupiable": "booth"
      },
      {
        "r": 0,
        "c": 1,
        "blocking": "globe"
      },
      {
        "r": 0,
        "c": 8,
        "blocking": "globe"
      },
      {
        "r": 1,
        "c": 0,
        "occupiable": "booth"
      },
      {
        "r": 1,
        "c": 1,
        "occupiable": "sofa"
      },
      {
        "r": 1,
        "c": 3,
        "occupiable": "booth"
      },
      {
        "r": 1,
        "c": 6,
        "blocking": "luggage"
      },
      {
        "r": 2,
        "c": 0,
        "blocking": "luggage"
      },
      {
        "r": 2,
        "c": 1,
        "blocking": "luggage"
      },
      {
        "r": 2,
        "c": 3,
        "blocking": "table"
      },
      {
        "r": 2,
        "c": 4,
        "blocking": "globe"
      },
      {
        "r": 2,
        "c": 5,
        "occupiable": "sofa"
      },
      {
        "r": 2,
        "c": 6,
        "occupiable": "rug"
      },
      {
        "r": 2,
        "c": 8,
        "blocking": "plant"
      },
      {
        "r": 3,
        "c": 0,
        "blocking": "table"
      },
      {
        "r": 3,
        "c": 1,
        "blocking": "luggage"
      },
      {
        "r": 3,
        "c": 5,
        "blocking": "globe"
      },
      {
        "r": 3,
        "c": 8,
        "blocking": "luggage"
      },
      {
        "r": 4,
        "c": 1,
        "occupiable": "bed"
      },
      {
        "r": 4,
        "c": 2,
        "occupiable": "rug"
      },
      {
        "r": 4,
        "c": 4,
        "occupiable": "rug"
      },
      {
        "r": 4,
        "c": 5,
        "blocking": "plant"
      },
      {
        "r": 4,
        "c": 8,
        "blocking": "table"
      },
      {
        "r": 5,
        "c": 0,
        "occupiable": "rug"
      },
      {
        "r": 5,
        "c": 2,
        "occupiable": "sofa"
      },
      {
        "r": 5,
        "c": 3,
        "blocking": "plant"
      },
      {
        "r": 5,
        "c": 4,
        "occupiable": "booth"
      },
      {
        "r": 5,
        "c": 6,
        "blocking": "globe"
      },
      {
        "r": 5,
        "c": 7,
        "occupiable": "bed"
      },
      {
        "r": 6,
        "c": 5,
        "occupiable": "rug"
      },
      {
        "r": 6,
        "c": 6,
        "blocking": "luggage"
      },
      {
        "r": 7,
        "c": 0,
        "occupiable": "bed"
      },
      {
        "r": 7,
        "c": 1,
        "blocking": "table"
      },
      {
        "r": 7,
        "c": 2,
        "blocking": "table"
      },
      {
        "r": 7,
        "c": 3,
        "occupiable": "sofa"
      },
      {
        "r": 7,
        "c": 4,
        "blocking": "plant"
      },
      {
        "r": 7,
        "c": 5,
        "occupiable": "bed"
      },
      {
        "r": 7,
        "c": 7,
        "blocking": "plant"
      },
      {
        "r": 8,
        "c": 2,
        "blocking": "table"
      },
      {
        "r": 8,
        "c": 4,
        "occupiable": "booth"
      },
      {
        "r": 8,
        "c": 5,
        "occupiable": "sofa"
      },
      {
        "r": 8,
        "c": 8,
        "occupiable": "bed"
      }
    ],
    "people": [
      {
        "id": "A",
        "letter": "A",
        "name": "Alice",
        "gender": "F",
        "isVictim": false,
        "color": "#D64550",
        "portraitId": 1,
        "roleTitle": "Engineer"
      },
      {
        "id": "B",
        "letter": "B",
        "name": "Barnaby",
        "gender": "M",
        "isVictim": false,
        "color": "#2B7A78",
        "portraitId": 2,
        "roleTitle": "Violinist"
      },
      {
        "id": "C",
        "letter": "C",
        "name": "Cedric",
        "gender": "M",
        "isVictim": false,
        "color": "#D97706",
        "portraitId": 4,
        "roleTitle": "Chef"
      },
      {
        "id": "D",
        "letter": "D",
        "name": "Daisy",
        "gender": "F",
        "isVictim": false,
        "color": "#3B66B0",
        "portraitId": 7,
        "roleTitle": "Novelist"
      },
      {
        "id": "E",
        "letter": "E",
        "name": "Evelyn",
        "gender": "F",
        "isVictim": false,
        "color": "#8B4593",
        "portraitId": 9,
        "roleTitle": "Diplomacy Aide"
      },
      {
        "id": "F",
        "letter": "F",
        "name": "Fiona",
        "gender": "F",
        "isVictim": false,
        "color": "#2F855A",
        "portraitId": 11,
        "roleTitle": "Ticket Agent"
      },
      {
        "id": "G",
        "letter": "G",
        "name": "Gideon",
        "gender": "M",
        "isVictim": false,
        "color": "#C05621",
        "portraitId": 12,
        "roleTitle": "Astronomer"
      },
      {
        "id": "H",
        "letter": "H",
        "name": "Hazel",
        "gender": "F",
        "isVictim": false,
        "color": "#4C51BF",
        "portraitId": 15,
        "roleTitle": "Porter"
      },
      {
        "id": "V",
        "letter": "V",
        "name": "Vincent",
        "gender": "M",
        "isVictim": true,
        "color": "#B8860B",
        "portraitId": 22,
        "roleTitle": "Train Captain"
      }
    ],
    "victimId": "V",
    "killerId": "D",
    "solution": {
      "V": {
        "r": 3,
        "c": 7
      },
      "D": {
        "r": 4,
        "c": 4
      },
      "F": {
        "r": 0,
        "c": 6
      },
      "B": {
        "r": 6,
        "c": 3
      },
      "E": {
        "r": 5,
        "c": 2
      },
      "H": {
        "r": 2,
        "c": 5
      },
      "A": {
        "r": 8,
        "c": 1
      },
      "G": {
        "r": 7,
        "c": 0
      },
      "C": {
        "r": 1,
        "c": 8
      }
    },
    "clues": [
      {
        "id": "edge_27",
        "ownerId": "A",
        "tier": 1,
        "kind": "outer_edge",
        "personId": "A"
      },
      {
        "id": "dir_obj_80",
        "ownerId": "B",
        "tier": 1,
        "kind": "dir_of_object",
        "personId": "B",
        "objectKind": "plant",
        "dir": "south"
      },
      {
        "id": "either_111",
        "ownerId": "C",
        "tier": 1,
        "kind": "in_either_room",
        "personId": "C",
        "roomIds": [
          4,
          3
        ]
      },
      {
        "id": "either_164",
        "ownerId": "D",
        "tier": 1,
        "kind": "in_either_room",
        "personId": "D",
        "roomIds": [
          0,
          5
        ]
      },
      {
        "id": "only_on_175",
        "ownerId": "D",
        "tier": 1,
        "kind": "only_on_object",
        "personId": "D",
        "objectKind": "rug"
      },
      {
        "id": "either_211",
        "ownerId": "E",
        "tier": 1,
        "kind": "in_either_room",
        "personId": "E",
        "roomIds": [
          1,
          2
        ]
      },
      {
        "id": "beside_277",
        "ownerId": "F",
        "tier": 1,
        "kind": "beside_object",
        "personId": "F",
        "objectKind": "luggage"
      },
      {
        "id": "same_rm_302",
        "ownerId": "F",
        "tier": 2,
        "kind": "same_room_as",
        "personId": "F",
        "otherId": "H"
      },
      {
        "id": "dir_p_346",
        "ownerId": "G",
        "tier": 2,
        "kind": "dir_from_person",
        "personId": "G",
        "otherId": "D",
        "dir": "south"
      },
      {
        "id": "on_obj_323",
        "ownerId": "G",
        "tier": 1,
        "kind": "on_object",
        "personId": "G",
        "objectKind": "bed"
      },
      {
        "id": "no_edge_386",
        "ownerId": "H",
        "tier": 1,
        "kind": "not_outer_edge",
        "personId": "H"
      },
      {
        "id": "vic_411",
        "ownerId": "V",
        "tier": 1,
        "kind": "victim_alone_with_killer",
        "victimId": "V"
      }
    ],
    "metrics": {
      "maxLevel": 3,
      "stepCount": 21,
      "initialSingles": 0,
      "victimDepth": 16
    }
  },
  {
    "id": "expert-2",
    "caseNumber": 2,
    "difficulty": "expert",
    "size": 9,
    "themeId": "museum",
    "title": "After-Hours Security Sweep",
    "tagline": "Interlocking room pairs and diagonal sightings across seven wings.",
    "premise": "Just as the night security sweep began at the Art Museum, the miniature gilded crown went missing! Untangle the paired sightings and gallery diagonals to reveal the culprit.",
    "stolenItem": "the miniature gilded crown",
    "patternBadge": "Paired Alibis",
    "seed": "EXPERT-2",
    "rooms": [
      {
        "id": 0,
        "name": "Curator Office",
        "colorKey": "butter",
        "bgHex": "#FBF1D6",
        "borderHex": "#C8A85B",
        "pattern": "wood"
      },
      {
        "id": 1,
        "name": "Sketch Studio",
        "colorKey": "sky",
        "bgHex": "#E3EEF7",
        "borderHex": "#638DB5",
        "pattern": "tile"
      },
      {
        "id": 2,
        "name": "Atrium",
        "colorKey": "sage",
        "bgHex": "#E3EFE4",
        "borderHex": "#6E9A74",
        "pattern": "grass"
      },
      {
        "id": 3,
        "name": "Modern Room",
        "colorKey": "sky",
        "bgHex": "#E3EEF7",
        "borderHex": "#638DB5",
        "pattern": "tile"
      },
      {
        "id": 4,
        "name": "Gift Gallery",
        "colorKey": "sage",
        "bgHex": "#E3EFE4",
        "borderHex": "#6E9A74",
        "pattern": "grass"
      },
      {
        "id": 5,
        "name": "Portrait Hall",
        "colorKey": "sky",
        "bgHex": "#E3EEF7",
        "borderHex": "#638DB5",
        "pattern": "tile"
      },
      {
        "id": 6,
        "name": "Sculpture Court",
        "colorKey": "butter",
        "bgHex": "#FBF1D6",
        "borderHex": "#C8A85B",
        "pattern": "wood"
      }
    ],
    "roomGrid": [
      [
        3,
        3,
        3,
        0,
        0,
        1,
        1,
        1,
        1
      ],
      [
        3,
        3,
        3,
        0,
        0,
        1,
        1,
        1,
        1
      ],
      [
        4,
        4,
        4,
        0,
        0,
        1,
        1,
        1,
        1
      ],
      [
        4,
        4,
        4,
        0,
        0,
        2,
        2,
        2,
        2
      ],
      [
        4,
        4,
        4,
        0,
        0,
        2,
        2,
        2,
        2
      ],
      [
        4,
        4,
        4,
        0,
        0,
        2,
        2,
        2,
        2
      ],
      [
        4,
        4,
        4,
        0,
        0,
        2,
        2,
        2,
        2
      ],
      [
        5,
        5,
        5,
        5,
        5,
        6,
        6,
        6,
        6
      ],
      [
        5,
        5,
        5,
        5,
        5,
        6,
        6,
        6,
        6
      ]
    ],
    "objects": [
      {
        "r": 0,
        "c": 1,
        "blocking": "plant"
      },
      {
        "r": 0,
        "c": 2,
        "occupiable": "mat"
      },
      {
        "r": 0,
        "c": 3,
        "occupiable": "rug"
      },
      {
        "r": 0,
        "c": 4,
        "occupiable": "mat"
      },
      {
        "r": 0,
        "c": 7,
        "occupiable": "rug"
      },
      {
        "r": 1,
        "c": 0,
        "blocking": "easel"
      },
      {
        "r": 1,
        "c": 3,
        "occupiable": "bench"
      },
      {
        "r": 1,
        "c": 4,
        "occupiable": "chair"
      },
      {
        "r": 1,
        "c": 6,
        "blocking": "plant"
      },
      {
        "r": 2,
        "c": 3,
        "occupiable": "rug"
      },
      {
        "r": 2,
        "c": 6,
        "blocking": "statue"
      },
      {
        "r": 2,
        "c": 8,
        "blocking": "easel"
      },
      {
        "r": 3,
        "c": 1,
        "blocking": "statue"
      },
      {
        "r": 3,
        "c": 3,
        "blocking": "easel"
      },
      {
        "r": 3,
        "c": 6,
        "blocking": "display"
      },
      {
        "r": 3,
        "c": 7,
        "occupiable": "rug"
      },
      {
        "r": 4,
        "c": 0,
        "blocking": "display"
      },
      {
        "r": 4,
        "c": 2,
        "occupiable": "chair"
      },
      {
        "r": 5,
        "c": 1,
        "blocking": "statue"
      },
      {
        "r": 5,
        "c": 2,
        "occupiable": "mat"
      },
      {
        "r": 5,
        "c": 3,
        "occupiable": "bench"
      },
      {
        "r": 5,
        "c": 6,
        "occupiable": "bench"
      },
      {
        "r": 5,
        "c": 7,
        "occupiable": "rug"
      },
      {
        "r": 5,
        "c": 8,
        "blocking": "display"
      },
      {
        "r": 6,
        "c": 1,
        "occupiable": "bench"
      },
      {
        "r": 6,
        "c": 3,
        "blocking": "easel"
      },
      {
        "r": 6,
        "c": 4,
        "blocking": "display"
      },
      {
        "r": 6,
        "c": 6,
        "blocking": "display"
      },
      {
        "r": 6,
        "c": 8,
        "blocking": "statue"
      },
      {
        "r": 7,
        "c": 0,
        "blocking": "plant"
      },
      {
        "r": 7,
        "c": 3,
        "blocking": "plant"
      },
      {
        "r": 7,
        "c": 5,
        "blocking": "statue"
      },
      {
        "r": 7,
        "c": 8,
        "occupiable": "mat"
      },
      {
        "r": 8,
        "c": 0,
        "occupiable": "chair"
      },
      {
        "r": 8,
        "c": 1,
        "occupiable": "mat"
      },
      {
        "r": 8,
        "c": 2,
        "occupiable": "bench"
      },
      {
        "r": 8,
        "c": 3,
        "blocking": "easel"
      },
      {
        "r": 8,
        "c": 4,
        "occupiable": "chair"
      },
      {
        "r": 8,
        "c": 6,
        "blocking": "plant"
      },
      {
        "r": 8,
        "c": 7,
        "occupiable": "chair"
      },
      {
        "r": 8,
        "c": 8,
        "occupiable": "chair"
      }
    ],
    "people": [
      {
        "id": "A",
        "letter": "A",
        "name": "Arthur",
        "gender": "M",
        "isVictim": false,
        "color": "#D64550",
        "portraitId": 0,
        "roleTitle": "Night Guard"
      },
      {
        "id": "B",
        "letter": "B",
        "name": "Barnaby",
        "gender": "M",
        "isVictim": false,
        "color": "#2B7A78",
        "portraitId": 2,
        "roleTitle": "Conservator"
      },
      {
        "id": "C",
        "letter": "C",
        "name": "Cedric",
        "gender": "M",
        "isVictim": false,
        "color": "#D97706",
        "portraitId": 4,
        "roleTitle": "Curator"
      },
      {
        "id": "D",
        "letter": "D",
        "name": "Daisy",
        "gender": "F",
        "isVictim": false,
        "color": "#3B66B0",
        "portraitId": 7,
        "roleTitle": "Lighting Lead"
      },
      {
        "id": "E",
        "letter": "E",
        "name": "Evelyn",
        "gender": "F",
        "isVictim": false,
        "color": "#8B4593",
        "portraitId": 9,
        "roleTitle": "Sculptor"
      },
      {
        "id": "F",
        "letter": "F",
        "name": "Felix",
        "gender": "M",
        "isVictim": false,
        "color": "#2F855A",
        "portraitId": 10,
        "roleTitle": "Archivist"
      },
      {
        "id": "G",
        "letter": "G",
        "name": "Grace",
        "gender": "F",
        "isVictim": false,
        "color": "#C05621",
        "portraitId": 13,
        "roleTitle": "Registrar"
      },
      {
        "id": "H",
        "letter": "H",
        "name": "Hugo",
        "gender": "M",
        "isVictim": false,
        "color": "#4C51BF",
        "portraitId": 14,
        "roleTitle": "Art Historian"
      },
      {
        "id": "V",
        "letter": "V",
        "name": "Victor",
        "gender": "M",
        "isVictim": true,
        "color": "#B8860B",
        "portraitId": 20,
        "roleTitle": "Museum Director"
      }
    ],
    "victimId": "V",
    "killerId": "E",
    "solution": {
      "V": {
        "r": 1,
        "c": 3
      },
      "E": {
        "r": 5,
        "c": 4
      },
      "G": {
        "r": 7,
        "c": 6
      },
      "A": {
        "r": 3,
        "c": 5
      },
      "C": {
        "r": 8,
        "c": 7
      },
      "H": {
        "r": 4,
        "c": 2
      },
      "B": {
        "r": 0,
        "c": 8
      },
      "F": {
        "r": 2,
        "c": 0
      },
      "D": {
        "r": 6,
        "c": 1
      }
    },
    "clues": [
      {
        "id": "dir_obj_25",
        "ownerId": "A",
        "tier": 1,
        "kind": "dir_of_object",
        "personId": "A",
        "objectKind": "display",
        "dir": "west"
      },
      {
        "id": "beside_69",
        "ownerId": "B",
        "tier": 1,
        "kind": "beside_object",
        "personId": "B",
        "objectKind": "rug"
      },
      {
        "id": "diff_rm_98",
        "ownerId": "B",
        "tier": 2,
        "kind": "diff_room_from",
        "personId": "B",
        "otherId": "V"
      },
      {
        "id": "beside_121",
        "ownerId": "C",
        "tier": 1,
        "kind": "beside_object",
        "personId": "C",
        "objectKind": "chair"
      },
      {
        "id": "diag_142",
        "ownerId": "C",
        "tier": 2,
        "kind": "diagonal_to_person",
        "personId": "C",
        "otherId": "G"
      },
      {
        "id": "dir_obj_172",
        "ownerId": "D",
        "tier": 1,
        "kind": "dir_of_object",
        "personId": "D",
        "objectKind": "statue",
        "dir": "south"
      },
      {
        "id": "dir_p_185",
        "ownerId": "D",
        "tier": 2,
        "kind": "dir_from_person",
        "personId": "D",
        "otherId": "E",
        "dir": "south"
      },
      {
        "id": "not_beside_220",
        "ownerId": "E",
        "tier": 1,
        "kind": "not_beside_object",
        "personId": "E",
        "objectKind": "chair"
      },
      {
        "id": "diff_rm_292",
        "ownerId": "F",
        "tier": 2,
        "kind": "diff_room_from",
        "personId": "F",
        "otherId": "V"
      },
      {
        "id": "either_298",
        "ownerId": "G",
        "tier": 1,
        "kind": "in_either_room",
        "personId": "G",
        "roomIds": [
          6,
          2
        ]
      },
      {
        "id": "no_edge_319",
        "ownerId": "G",
        "tier": 1,
        "kind": "not_outer_edge",
        "personId": "G"
      },
      {
        "id": "either_348",
        "ownerId": "H",
        "tier": 1,
        "kind": "in_either_room",
        "personId": "H",
        "roomIds": [
          4,
          2
        ]
      },
      {
        "id": "only_beside_361",
        "ownerId": "H",
        "tier": 1,
        "kind": "only_beside_object",
        "personId": "H",
        "objectKind": "mat"
      },
      {
        "id": "vic_394",
        "ownerId": "V",
        "tier": 1,
        "kind": "victim_alone_with_killer",
        "victimId": "V"
      }
    ],
    "metrics": {
      "maxLevel": 3,
      "stepCount": 24,
      "initialSingles": 0,
      "victimDepth": 18
    }
  },
  {
    "id": "expert-3",
    "caseNumber": 3,
    "difficulty": "expert",
    "size": 9,
    "themeId": "manor",
    "title": "Holiday Manor Reunion",
    "tagline": "Nine family members, bustling parlors, and a missing grandfather clock key.",
    "premise": "During the snowy holiday reunion at Rosehall Manor, someone hid the grand clock’s winding key! Use pure deduction across rows, columns, and family clues to expose the culprit.",
    "stolenItem": "the grand clock winding key",
    "seed": "EXPERT-3",
    "rooms": [
      {
        "id": 0,
        "name": "Study",
        "colorKey": "sky",
        "bgHex": "#E3EEF7",
        "borderHex": "#638DB5",
        "pattern": "tile"
      },
      {
        "id": 1,
        "name": "Sunroom",
        "colorKey": "sky",
        "bgHex": "#E3EEF7",
        "borderHex": "#638DB5",
        "pattern": "tile"
      },
      {
        "id": 2,
        "name": "Parlor",
        "colorKey": "butter",
        "bgHex": "#FBF1D6",
        "borderHex": "#C8A85B",
        "pattern": "wood"
      },
      {
        "id": 3,
        "name": "Dining Hall",
        "colorKey": "sage",
        "bgHex": "#E3EFE4",
        "borderHex": "#6E9A74",
        "pattern": "grass"
      },
      {
        "id": 4,
        "name": "Conservatory",
        "colorKey": "sage",
        "bgHex": "#E3EFE4",
        "borderHex": "#6E9A74",
        "pattern": "grass"
      },
      {
        "id": 5,
        "name": "Music Room",
        "colorKey": "sky",
        "bgHex": "#E3EEF7",
        "borderHex": "#638DB5",
        "pattern": "tile"
      },
      {
        "id": 6,
        "name": "Gallery",
        "colorKey": "sky",
        "bgHex": "#E3EEF7",
        "borderHex": "#638DB5",
        "pattern": "tile"
      },
      {
        "id": 7,
        "name": "Foyer",
        "colorKey": "butter",
        "bgHex": "#FBF1D6",
        "borderHex": "#C8A85B",
        "pattern": "wood"
      }
    ],
    "roomGrid": [
      [
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        4,
        4
      ],
      [
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        4,
        4
      ],
      [
        2,
        2,
        2,
        2,
        2,
        2,
        2,
        4,
        4
      ],
      [
        2,
        2,
        2,
        2,
        2,
        2,
        2,
        4,
        4
      ],
      [
        0,
        0,
        3,
        3,
        6,
        6,
        6,
        4,
        4
      ],
      [
        0,
        0,
        3,
        3,
        6,
        6,
        6,
        4,
        4
      ],
      [
        0,
        0,
        3,
        3,
        7,
        7,
        7,
        4,
        4
      ],
      [
        0,
        0,
        3,
        3,
        7,
        7,
        7,
        5,
        5
      ],
      [
        0,
        0,
        3,
        3,
        7,
        7,
        7,
        5,
        5
      ]
    ],
    "objects": [
      {
        "r": 0,
        "c": 1,
        "occupiable": "chair"
      },
      {
        "r": 0,
        "c": 2,
        "blocking": "piano"
      },
      {
        "r": 0,
        "c": 4,
        "occupiable": "bed"
      },
      {
        "r": 0,
        "c": 6,
        "blocking": "piano"
      },
      {
        "r": 0,
        "c": 8,
        "occupiable": "chair"
      },
      {
        "r": 1,
        "c": 1,
        "blocking": "plant"
      },
      {
        "r": 1,
        "c": 2,
        "blocking": "shelf"
      },
      {
        "r": 1,
        "c": 7,
        "blocking": "plant"
      },
      {
        "r": 1,
        "c": 8,
        "occupiable": "rug"
      },
      {
        "r": 2,
        "c": 1,
        "occupiable": "rug"
      },
      {
        "r": 2,
        "c": 2,
        "blocking": "piano"
      },
      {
        "r": 2,
        "c": 4,
        "blocking": "table"
      },
      {
        "r": 2,
        "c": 7,
        "blocking": "plant"
      },
      {
        "r": 3,
        "c": 0,
        "blocking": "table"
      },
      {
        "r": 3,
        "c": 3,
        "occupiable": "bed"
      },
      {
        "r": 3,
        "c": 5,
        "occupiable": "sofa"
      },
      {
        "r": 3,
        "c": 8,
        "blocking": "table"
      },
      {
        "r": 4,
        "c": 0,
        "blocking": "shelf"
      },
      {
        "r": 4,
        "c": 1,
        "blocking": "plant"
      },
      {
        "r": 4,
        "c": 2,
        "occupiable": "chair"
      },
      {
        "r": 4,
        "c": 4,
        "occupiable": "rug"
      },
      {
        "r": 4,
        "c": 5,
        "occupiable": "sofa"
      },
      {
        "r": 4,
        "c": 6,
        "occupiable": "sofa"
      },
      {
        "r": 4,
        "c": 7,
        "blocking": "plant"
      },
      {
        "r": 5,
        "c": 1,
        "occupiable": "bed"
      },
      {
        "r": 5,
        "c": 5,
        "blocking": "shelf"
      },
      {
        "r": 5,
        "c": 6,
        "occupiable": "rug"
      },
      {
        "r": 6,
        "c": 0,
        "occupiable": "sofa"
      },
      {
        "r": 6,
        "c": 2,
        "occupiable": "chair"
      },
      {
        "r": 6,
        "c": 5,
        "blocking": "table"
      },
      {
        "r": 6,
        "c": 6,
        "blocking": "piano"
      },
      {
        "r": 7,
        "c": 0,
        "occupiable": "bed"
      },
      {
        "r": 7,
        "c": 2,
        "blocking": "shelf"
      },
      {
        "r": 7,
        "c": 3,
        "occupiable": "chair"
      },
      {
        "r": 7,
        "c": 5,
        "blocking": "shelf"
      },
      {
        "r": 7,
        "c": 6,
        "occupiable": "sofa"
      },
      {
        "r": 8,
        "c": 0,
        "blocking": "plant"
      },
      {
        "r": 8,
        "c": 2,
        "blocking": "piano"
      },
      {
        "r": 8,
        "c": 4,
        "occupiable": "bed"
      },
      {
        "r": 8,
        "c": 7,
        "occupiable": "rug"
      },
      {
        "r": 8,
        "c": 8,
        "blocking": "table"
      }
    ],
    "people": [
      {
        "id": "A",
        "letter": "A",
        "name": "Arthur",
        "gender": "M",
        "isVictim": false,
        "color": "#D64550",
        "portraitId": 0,
        "roleTitle": "Family Chef"
      },
      {
        "id": "B",
        "letter": "B",
        "name": "Beatrice",
        "gender": "F",
        "isVictim": false,
        "color": "#2B7A78",
        "portraitId": 3,
        "roleTitle": "Botanist Aunt"
      },
      {
        "id": "C",
        "letter": "C",
        "name": "Cedric",
        "gender": "M",
        "isVictim": false,
        "color": "#D97706",
        "portraitId": 4,
        "roleTitle": "Storyteller Uncle"
      },
      {
        "id": "D",
        "letter": "D",
        "name": "Daisy",
        "gender": "F",
        "isVictim": false,
        "color": "#3B66B0",
        "portraitId": 7,
        "roleTitle": "Violinist Cousin"
      },
      {
        "id": "E",
        "letter": "E",
        "name": "Evelyn",
        "gender": "F",
        "isVictim": false,
        "color": "#8B4593",
        "portraitId": 9,
        "roleTitle": "Architect Cousin"
      },
      {
        "id": "F",
        "letter": "F",
        "name": "Fiona",
        "gender": "F",
        "isVictim": false,
        "color": "#2F855A",
        "portraitId": 11,
        "roleTitle": "Chess Uncle"
      },
      {
        "id": "G",
        "letter": "G",
        "name": "Grace",
        "gender": "F",
        "isVictim": false,
        "color": "#C05621",
        "portraitId": 13,
        "roleTitle": "Historian Aunt"
      },
      {
        "id": "H",
        "letter": "H",
        "name": "Hugo",
        "gender": "M",
        "isVictim": false,
        "color": "#4C51BF",
        "portraitId": 14,
        "roleTitle": "Pianist Cousin"
      },
      {
        "id": "V",
        "letter": "V",
        "name": "Vivian",
        "gender": "F",
        "isVictim": true,
        "color": "#B8860B",
        "portraitId": 21,
        "roleTitle": "Family Host"
      }
    ],
    "victimId": "V",
    "killerId": "G",
    "solution": {
      "V": {
        "r": 8,
        "c": 3
      },
      "G": {
        "r": 6,
        "c": 2
      },
      "A": {
        "r": 0,
        "c": 7
      },
      "F": {
        "r": 3,
        "c": 5
      },
      "E": {
        "r": 2,
        "c": 0
      },
      "H": {
        "r": 1,
        "c": 4
      },
      "D": {
        "r": 5,
        "c": 1
      },
      "B": {
        "r": 4,
        "c": 6
      },
      "C": {
        "r": 7,
        "c": 8
      }
    },
    "clues": [
      {
        "id": "case_cnt_423",
        "ownerId": "case",
        "tier": 2,
        "kind": "room_exact_count",
        "roomId": 5,
        "count": 1
      },
      {
        "id": "not_rm_11",
        "ownerId": "A",
        "tier": 1,
        "kind": "not_in_room",
        "personId": "A",
        "roomId": 0
      },
      {
        "id": "dir_p_104",
        "ownerId": "B",
        "tier": 2,
        "kind": "dir_from_person",
        "personId": "B",
        "otherId": "H",
        "dir": "east"
      },
      {
        "id": "either_58",
        "ownerId": "B",
        "tier": 1,
        "kind": "in_either_room",
        "personId": "B",
        "roomIds": [
          6,
          1
        ]
      },
      {
        "id": "dir_obj_133",
        "ownerId": "C",
        "tier": 1,
        "kind": "dir_of_object",
        "personId": "C",
        "objectKind": "table",
        "dir": "north"
      },
      {
        "id": "dir_obj_183",
        "ownerId": "D",
        "tier": 1,
        "kind": "dir_of_object",
        "personId": "D",
        "objectKind": "plant",
        "dir": "south"
      },
      {
        "id": "bare_228",
        "ownerId": "E",
        "tier": 1,
        "kind": "on_empty_floor",
        "personId": "E"
      },
      {
        "id": "dir_p_251",
        "ownerId": "E",
        "tier": 2,
        "kind": "dir_from_person",
        "personId": "E",
        "otherId": "D",
        "dir": "west"
      },
      {
        "id": "on_obj_279",
        "ownerId": "F",
        "tier": 1,
        "kind": "on_object",
        "personId": "F",
        "objectKind": "sofa"
      },
      {
        "id": "same_rm_301",
        "ownerId": "F",
        "tier": 2,
        "kind": "same_room_as",
        "personId": "F",
        "otherId": "E"
      },
      {
        "id": "only_beside_335",
        "ownerId": "G",
        "tier": 1,
        "kind": "only_beside_object",
        "personId": "G",
        "objectKind": "shelf"
      },
      {
        "id": "only_on_329",
        "ownerId": "G",
        "tier": 1,
        "kind": "only_on_object",
        "personId": "G",
        "objectKind": "chair"
      },
      {
        "id": "either_368",
        "ownerId": "H",
        "tier": 1,
        "kind": "in_either_room",
        "personId": "H",
        "roomIds": [
          1,
          2
        ]
      },
      {
        "id": "vic_417",
        "ownerId": "V",
        "tier": 1,
        "kind": "victim_alone_with_killer",
        "victimId": "V"
      }
    ],
    "metrics": {
      "maxLevel": 3,
      "stepCount": 29,
      "initialSingles": 0,
      "victimDepth": 24
    }
  },
  {
    "id": "expert-4",
    "caseNumber": 4,
    "difficulty": "expert",
    "size": 9,
    "themeId": "inn",
    "title": "Regatta Eve at Gull Cove",
    "tagline": "Rival sailing crews under one roof—zero instant clues, pure logic.",
    "premise": "On the eve of the annual harbor regatta, the engraved silver starting horn vanished from the inn! Map all nine sailors and hosts to discover who was alone with the victim.",
    "stolenItem": "the silver starting horn",
    "seed": "EXPERT-4",
    "rooms": [
      {
        "id": 0,
        "name": "Chart Room",
        "colorKey": "sage",
        "bgHex": "#E3EFE4",
        "borderHex": "#6E9A74",
        "pattern": "grass"
      },
      {
        "id": 1,
        "name": "Lobby",
        "colorKey": "sky",
        "bgHex": "#E3EEF7",
        "borderHex": "#638DB5",
        "pattern": "tile"
      },
      {
        "id": 2,
        "name": "Boathouse",
        "colorKey": "butter",
        "bgHex": "#FBF1D6",
        "borderHex": "#C8A85B",
        "pattern": "wood"
      },
      {
        "id": 3,
        "name": "Harbor Suite",
        "colorKey": "butter",
        "bgHex": "#FBF1D6",
        "borderHex": "#C8A85B",
        "pattern": "wood"
      },
      {
        "id": 4,
        "name": "Sun Lounge",
        "colorKey": "sage",
        "bgHex": "#E3EFE4",
        "borderHex": "#6E9A74",
        "pattern": "grass"
      },
      {
        "id": 5,
        "name": "Deck Porch",
        "colorKey": "butter",
        "bgHex": "#FBF1D6",
        "borderHex": "#C8A85B",
        "pattern": "wood"
      },
      {
        "id": 6,
        "name": "Crows Nest",
        "colorKey": "sage",
        "bgHex": "#E3EFE4",
        "borderHex": "#6E9A74",
        "pattern": "grass"
      },
      {
        "id": 7,
        "name": "Chowder Bar",
        "colorKey": "sky",
        "bgHex": "#E3EEF7",
        "borderHex": "#638DB5",
        "pattern": "tile"
      }
    ],
    "roomGrid": [
      [
        1,
        1,
        2,
        2,
        6,
        6,
        6,
        3,
        3
      ],
      [
        1,
        1,
        2,
        2,
        6,
        6,
        6,
        3,
        3
      ],
      [
        1,
        1,
        2,
        2,
        6,
        6,
        6,
        3,
        3
      ],
      [
        1,
        1,
        2,
        2,
        7,
        7,
        7,
        3,
        3
      ],
      [
        1,
        1,
        2,
        2,
        7,
        7,
        7,
        3,
        3
      ],
      [
        1,
        1,
        2,
        2,
        0,
        0,
        0,
        0,
        0
      ],
      [
        1,
        1,
        2,
        2,
        0,
        0,
        0,
        0,
        0
      ],
      [
        4,
        4,
        4,
        4,
        5,
        5,
        5,
        5,
        5
      ],
      [
        4,
        4,
        4,
        4,
        5,
        5,
        5,
        5,
        5
      ]
    ],
    "objects": [
      {
        "r": 0,
        "c": 0,
        "occupiable": "chair"
      },
      {
        "r": 0,
        "c": 1,
        "occupiable": "mat"
      },
      {
        "r": 0,
        "c": 3,
        "occupiable": "booth"
      },
      {
        "r": 0,
        "c": 4,
        "blocking": "barrel"
      },
      {
        "r": 1,
        "c": 5,
        "blocking": "plant"
      },
      {
        "r": 1,
        "c": 6,
        "blocking": "barrel"
      },
      {
        "r": 1,
        "c": 7,
        "occupiable": "bed"
      },
      {
        "r": 1,
        "c": 8,
        "occupiable": "chair"
      },
      {
        "r": 2,
        "c": 1,
        "occupiable": "booth"
      },
      {
        "r": 2,
        "c": 2,
        "blocking": "barrel"
      },
      {
        "r": 2,
        "c": 3,
        "blocking": "anchor"
      },
      {
        "r": 2,
        "c": 6,
        "occupiable": "chair"
      },
      {
        "r": 2,
        "c": 8,
        "blocking": "plant"
      },
      {
        "r": 3,
        "c": 1,
        "occupiable": "bed"
      },
      {
        "r": 3,
        "c": 2,
        "blocking": "table"
      },
      {
        "r": 3,
        "c": 3,
        "blocking": "anchor"
      },
      {
        "r": 3,
        "c": 4,
        "occupiable": "chair"
      },
      {
        "r": 3,
        "c": 5,
        "blocking": "plant"
      },
      {
        "r": 3,
        "c": 7,
        "blocking": "anchor"
      },
      {
        "r": 3,
        "c": 8,
        "blocking": "table"
      },
      {
        "r": 4,
        "c": 2,
        "occupiable": "mat"
      },
      {
        "r": 4,
        "c": 3,
        "occupiable": "bed"
      },
      {
        "r": 4,
        "c": 4,
        "occupiable": "mat"
      },
      {
        "r": 4,
        "c": 7,
        "occupiable": "mat"
      },
      {
        "r": 4,
        "c": 8,
        "occupiable": "chair"
      },
      {
        "r": 5,
        "c": 0,
        "blocking": "table"
      },
      {
        "r": 5,
        "c": 1,
        "blocking": "barrel"
      },
      {
        "r": 5,
        "c": 5,
        "blocking": "anchor"
      },
      {
        "r": 5,
        "c": 7,
        "blocking": "table"
      },
      {
        "r": 6,
        "c": 0,
        "blocking": "plant"
      },
      {
        "r": 6,
        "c": 1,
        "occupiable": "mat"
      },
      {
        "r": 6,
        "c": 3,
        "occupiable": "booth"
      },
      {
        "r": 6,
        "c": 8,
        "occupiable": "booth"
      },
      {
        "r": 7,
        "c": 3,
        "blocking": "barrel"
      },
      {
        "r": 7,
        "c": 4,
        "blocking": "anchor"
      },
      {
        "r": 7,
        "c": 6,
        "occupiable": "bed"
      },
      {
        "r": 7,
        "c": 7,
        "occupiable": "bed"
      },
      {
        "r": 8,
        "c": 0,
        "occupiable": "booth"
      },
      {
        "r": 8,
        "c": 3,
        "blocking": "plant"
      },
      {
        "r": 8,
        "c": 5,
        "blocking": "barrel"
      },
      {
        "r": 8,
        "c": 8,
        "blocking": "table"
      }
    ],
    "people": [
      {
        "id": "A",
        "letter": "A",
        "name": "Arthur",
        "gender": "M",
        "isVictim": false,
        "color": "#D64550",
        "portraitId": 0,
        "roleTitle": "Skipper"
      },
      {
        "id": "B",
        "letter": "B",
        "name": "Beatrice",
        "gender": "F",
        "isVictim": false,
        "color": "#2B7A78",
        "portraitId": 3,
        "roleTitle": "Navigator"
      },
      {
        "id": "C",
        "letter": "C",
        "name": "Cedric",
        "gender": "M",
        "isVictim": false,
        "color": "#D97706",
        "portraitId": 4,
        "roleTitle": "Sailmaker"
      },
      {
        "id": "D",
        "letter": "D",
        "name": "Dante",
        "gender": "M",
        "isVictim": false,
        "color": "#3B66B0",
        "portraitId": 6,
        "roleTitle": "Rigging Tech"
      },
      {
        "id": "E",
        "letter": "E",
        "name": "Emilio",
        "gender": "M",
        "isVictim": false,
        "color": "#8B4593",
        "portraitId": 8,
        "roleTitle": "Race Marshal"
      },
      {
        "id": "F",
        "letter": "F",
        "name": "Fiona",
        "gender": "F",
        "isVictim": false,
        "color": "#2F855A",
        "portraitId": 11,
        "roleTitle": "Dockmaster"
      },
      {
        "id": "G",
        "letter": "G",
        "name": "Grace",
        "gender": "F",
        "isVictim": false,
        "color": "#C05621",
        "portraitId": 13,
        "roleTitle": "Chef"
      },
      {
        "id": "H",
        "letter": "H",
        "name": "Hazel",
        "gender": "F",
        "isVictim": false,
        "color": "#4C51BF",
        "portraitId": 15,
        "roleTitle": "Chronicler"
      },
      {
        "id": "V",
        "letter": "V",
        "name": "Victor",
        "gender": "M",
        "isVictim": true,
        "color": "#B8860B",
        "portraitId": 20,
        "roleTitle": "Regatta Host"
      }
    ],
    "victimId": "V",
    "killerId": "A",
    "solution": {
      "V": {
        "r": 2,
        "c": 0
      },
      "A": {
        "r": 4,
        "c": 1
      },
      "D": {
        "r": 1,
        "c": 7
      },
      "H": {
        "r": 8,
        "c": 2
      },
      "B": {
        "r": 3,
        "c": 4
      },
      "E": {
        "r": 7,
        "c": 5
      },
      "C": {
        "r": 6,
        "c": 8
      },
      "F": {
        "r": 0,
        "c": 3
      },
      "G": {
        "r": 5,
        "c": 6
      }
    },
    "clues": [
      {
        "id": "either_5",
        "ownerId": "A",
        "tier": 1,
        "kind": "in_either_room",
        "personId": "A",
        "roomIds": [
          1,
          4
        ]
      },
      {
        "id": "no_edge_27",
        "ownerId": "A",
        "tier": 1,
        "kind": "not_outer_edge",
        "personId": "A"
      },
      {
        "id": "only_on_69",
        "ownerId": "B",
        "tier": 1,
        "kind": "only_on_object",
        "personId": "B",
        "objectKind": "chair"
      },
      {
        "id": "dir_p_141",
        "ownerId": "C",
        "tier": 2,
        "kind": "dir_from_person",
        "personId": "C",
        "otherId": "E",
        "dir": "north"
      },
      {
        "id": "edge_130",
        "ownerId": "C",
        "tier": 1,
        "kind": "outer_edge",
        "personId": "C"
      },
      {
        "id": "either_110",
        "ownerId": "C",
        "tier": 1,
        "kind": "in_either_room",
        "personId": "C",
        "roomIds": [
          0,
          4
        ]
      },
      {
        "id": "only_on_173",
        "ownerId": "D",
        "tier": 1,
        "kind": "only_on_object",
        "personId": "D",
        "objectKind": "bed"
      },
      {
        "id": "dir_obj_234",
        "ownerId": "E",
        "tier": 1,
        "kind": "dir_of_object",
        "personId": "E",
        "objectKind": "bed",
        "dir": "west"
      },
      {
        "id": "on_obj_280",
        "ownerId": "F",
        "tier": 1,
        "kind": "on_object",
        "personId": "F",
        "objectKind": "booth"
      },
      {
        "id": "dir_p_356",
        "ownerId": "G",
        "tier": 2,
        "kind": "dir_from_person",
        "personId": "G",
        "otherId": "E",
        "dir": "east"
      },
      {
        "id": "only_beside_339",
        "ownerId": "G",
        "tier": 1,
        "kind": "only_beside_object",
        "personId": "G",
        "objectKind": "table"
      },
      {
        "id": "not_rm_379",
        "ownerId": "H",
        "tier": 1,
        "kind": "not_in_room",
        "personId": "H",
        "roomId": 3
      },
      {
        "id": "vic_418",
        "ownerId": "V",
        "tier": 1,
        "kind": "victim_alone_with_killer",
        "victimId": "V"
      }
    ],
    "metrics": {
      "maxLevel": 3,
      "stepCount": 18,
      "initialSingles": 0,
      "victimDepth": 18
    }
  },
  {
    "id": "expert-5",
    "caseNumber": 5,
    "difficulty": "expert",
    "size": 9,
    "themeId": "garden",
    "title": "The Botanical Summit",
    "tagline": "Nine visiting botanists and one vanished rare Moonflower cutting.",
    "premise": "At the close of the international botanical summit, the prized Blue Moonflower cutting went missing from its glass dome! Solve the full 9×9 floor plan to identify the culprit.",
    "stolenItem": "the Blue Moonflower cutting",
    "seed": "EXPERT-5",
    "rooms": [
      {
        "id": 0,
        "name": "Potting Shed",
        "colorKey": "sage",
        "bgHex": "#E3EFE4",
        "borderHex": "#6E9A74",
        "pattern": "grass"
      },
      {
        "id": 1,
        "name": "Cactus Dome",
        "colorKey": "sage",
        "bgHex": "#E3EFE4",
        "borderHex": "#6E9A74",
        "pattern": "grass"
      },
      {
        "id": 2,
        "name": "Koi Terrace",
        "colorKey": "sage",
        "bgHex": "#E3EFE4",
        "borderHex": "#6E9A74",
        "pattern": "grass"
      },
      {
        "id": 3,
        "name": "Fern Grotto",
        "colorKey": "sky",
        "bgHex": "#E3EEF7",
        "borderHex": "#638DB5",
        "pattern": "tile"
      },
      {
        "id": 4,
        "name": "Orchid House",
        "colorKey": "sky",
        "bgHex": "#E3EEF7",
        "borderHex": "#638DB5",
        "pattern": "tile"
      },
      {
        "id": 5,
        "name": "Tea Pavilion",
        "colorKey": "butter",
        "bgHex": "#FBF1D6",
        "borderHex": "#C8A85B",
        "pattern": "wood"
      }
    ],
    "roomGrid": [
      [
        2,
        2,
        2,
        2,
        2,
        3,
        3,
        1,
        1
      ],
      [
        2,
        2,
        2,
        2,
        2,
        3,
        3,
        1,
        1
      ],
      [
        2,
        2,
        2,
        2,
        2,
        3,
        3,
        1,
        1
      ],
      [
        2,
        2,
        2,
        2,
        2,
        3,
        3,
        1,
        1
      ],
      [
        4,
        4,
        5,
        5,
        5,
        5,
        5,
        5,
        5
      ],
      [
        4,
        4,
        5,
        5,
        5,
        5,
        5,
        5,
        5
      ],
      [
        4,
        4,
        5,
        5,
        5,
        5,
        5,
        5,
        5
      ],
      [
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0
      ],
      [
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0
      ]
    ],
    "objects": [
      {
        "r": 0,
        "c": 0,
        "occupiable": "rug"
      },
      {
        "r": 0,
        "c": 2,
        "occupiable": "rug"
      },
      {
        "r": 0,
        "c": 3,
        "blocking": "tree"
      },
      {
        "r": 0,
        "c": 6,
        "occupiable": "chair"
      },
      {
        "r": 1,
        "c": 0,
        "occupiable": "mat"
      },
      {
        "r": 1,
        "c": 1,
        "occupiable": "rug"
      },
      {
        "r": 1,
        "c": 4,
        "blocking": "tree"
      },
      {
        "r": 1,
        "c": 6,
        "occupiable": "chair"
      },
      {
        "r": 1,
        "c": 7,
        "blocking": "fountain"
      },
      {
        "r": 1,
        "c": 8,
        "occupiable": "chair"
      },
      {
        "r": 2,
        "c": 3,
        "blocking": "fountain"
      },
      {
        "r": 2,
        "c": 4,
        "blocking": "statue"
      },
      {
        "r": 2,
        "c": 5,
        "blocking": "plant"
      },
      {
        "r": 2,
        "c": 6,
        "blocking": "plant"
      },
      {
        "r": 2,
        "c": 7,
        "blocking": "tree"
      },
      {
        "r": 3,
        "c": 0,
        "occupiable": "bench"
      },
      {
        "r": 3,
        "c": 3,
        "blocking": "tree"
      },
      {
        "r": 3,
        "c": 7,
        "occupiable": "mat"
      },
      {
        "r": 4,
        "c": 2,
        "occupiable": "rug"
      },
      {
        "r": 4,
        "c": 6,
        "occupiable": "bench"
      },
      {
        "r": 4,
        "c": 7,
        "occupiable": "bench"
      },
      {
        "r": 4,
        "c": 8,
        "blocking": "plant"
      },
      {
        "r": 5,
        "c": 1,
        "occupiable": "mat"
      },
      {
        "r": 5,
        "c": 2,
        "occupiable": "rug"
      },
      {
        "r": 5,
        "c": 6,
        "occupiable": "mat"
      },
      {
        "r": 5,
        "c": 8,
        "blocking": "tree"
      },
      {
        "r": 6,
        "c": 1,
        "blocking": "statue"
      },
      {
        "r": 6,
        "c": 2,
        "occupiable": "mat"
      },
      {
        "r": 6,
        "c": 3,
        "blocking": "statue"
      },
      {
        "r": 6,
        "c": 5,
        "blocking": "fountain"
      },
      {
        "r": 6,
        "c": 6,
        "occupiable": "bench"
      },
      {
        "r": 6,
        "c": 8,
        "blocking": "plant"
      },
      {
        "r": 7,
        "c": 0,
        "occupiable": "mat"
      },
      {
        "r": 7,
        "c": 2,
        "occupiable": "bench"
      },
      {
        "r": 7,
        "c": 7,
        "occupiable": "chair"
      },
      {
        "r": 8,
        "c": 0,
        "blocking": "statue"
      },
      {
        "r": 8,
        "c": 2,
        "occupiable": "chair"
      },
      {
        "r": 8,
        "c": 3,
        "blocking": "statue"
      },
      {
        "r": 8,
        "c": 5,
        "blocking": "fountain"
      },
      {
        "r": 8,
        "c": 7,
        "blocking": "plant"
      }
    ],
    "people": [
      {
        "id": "A",
        "letter": "A",
        "name": "Alice",
        "gender": "F",
        "isVictim": false,
        "color": "#D64550",
        "portraitId": 1,
        "roleTitle": "Orchidist"
      },
      {
        "id": "B",
        "letter": "B",
        "name": "Beatrice",
        "gender": "F",
        "isVictim": false,
        "color": "#2B7A78",
        "portraitId": 3,
        "roleTitle": "Soil Chemist"
      },
      {
        "id": "C",
        "letter": "C",
        "name": "Clara",
        "gender": "F",
        "isVictim": false,
        "color": "#D97706",
        "portraitId": 5,
        "roleTitle": "Fern Curator"
      },
      {
        "id": "D",
        "letter": "D",
        "name": "Daisy",
        "gender": "F",
        "isVictim": false,
        "color": "#3B66B0",
        "portraitId": 7,
        "roleTitle": "Botanical Artist"
      },
      {
        "id": "E",
        "letter": "E",
        "name": "Emilio",
        "gender": "M",
        "isVictim": false,
        "color": "#8B4593",
        "portraitId": 8,
        "roleTitle": "Seed Archivist"
      },
      {
        "id": "F",
        "letter": "F",
        "name": "Felix",
        "gender": "M",
        "isVictim": false,
        "color": "#2F855A",
        "portraitId": 10,
        "roleTitle": "Greenhouse Lead"
      },
      {
        "id": "G",
        "letter": "G",
        "name": "Gideon",
        "gender": "M",
        "isVictim": false,
        "color": "#C05621",
        "portraitId": 12,
        "roleTitle": "Horticulturist"
      },
      {
        "id": "H",
        "letter": "H",
        "name": "Hazel",
        "gender": "F",
        "isVictim": false,
        "color": "#4C51BF",
        "portraitId": 15,
        "roleTitle": "Ecologist"
      },
      {
        "id": "V",
        "letter": "V",
        "name": "Vincent",
        "gender": "M",
        "isVictim": true,
        "color": "#B8860B",
        "portraitId": 22,
        "roleTitle": "Summit Chair"
      }
    ],
    "victimId": "V",
    "killerId": "B",
    "solution": {
      "V": {
        "r": 4,
        "c": 7
      },
      "B": {
        "r": 6,
        "c": 4
      },
      "D": {
        "r": 3,
        "c": 0
      },
      "A": {
        "r": 0,
        "c": 6
      },
      "C": {
        "r": 2,
        "c": 2
      },
      "E": {
        "r": 1,
        "c": 3
      },
      "F": {
        "r": 5,
        "c": 1
      },
      "G": {
        "r": 7,
        "c": 5
      },
      "H": {
        "r": 8,
        "c": 8
      }
    },
    "clues": [
      {
        "id": "case_empty_382",
        "ownerId": "case",
        "tier": 1,
        "kind": "room_empty",
        "roomId": 1
      },
      {
        "id": "on_obj_14",
        "ownerId": "A",
        "tier": 1,
        "kind": "on_object",
        "personId": "A",
        "objectKind": "chair"
      },
      {
        "id": "beside_67",
        "ownerId": "B",
        "tier": 1,
        "kind": "beside_object",
        "personId": "B",
        "objectKind": "fountain"
      },
      {
        "id": "diag_129",
        "ownerId": "C",
        "tier": 2,
        "kind": "diagonal_to_person",
        "personId": "C",
        "otherId": "E"
      },
      {
        "id": "edge_164",
        "ownerId": "D",
        "tier": 1,
        "kind": "outer_edge",
        "personId": "D"
      },
      {
        "id": "only_beside_203",
        "ownerId": "E",
        "tier": 1,
        "kind": "only_beside_object",
        "personId": "E",
        "objectKind": "tree"
      },
      {
        "id": "either_246",
        "ownerId": "F",
        "tier": 1,
        "kind": "in_either_room",
        "personId": "F",
        "roomIds": [
          4,
          5
        ]
      },
      {
        "id": "dir_obj_305",
        "ownerId": "G",
        "tier": 1,
        "kind": "dir_of_object",
        "personId": "G",
        "objectKind": "fountain",
        "dir": "north"
      },
      {
        "id": "not_rm_344",
        "ownerId": "H",
        "tier": 1,
        "kind": "not_in_room",
        "personId": "H",
        "roomId": 5
      },
      {
        "id": "same_rm_374",
        "ownerId": "H",
        "tier": 2,
        "kind": "same_room_as",
        "personId": "H",
        "otherId": "G"
      },
      {
        "id": "vic_380",
        "ownerId": "V",
        "tier": 1,
        "kind": "victim_alone_with_killer",
        "victimId": "V"
      }
    ],
    "metrics": {
      "maxLevel": 3,
      "stepCount": 24,
      "initialSingles": 0,
      "victimDepth": 24
    }
  }
] as unknown as readonly CuratedCaseSpec[];

export function getCuratedCasesByDifficulty(difficulty: Difficulty): CuratedCaseSpec[] {
  return CURATED_CASES.filter((c) => c.difficulty === difficulty).sort(
    (a, b) => a.caseNumber - b.caseNumber
  );
}

export function getCuratedPuzzle(caseId: string): Puzzle | null {
  const spec = CURATED_CASES.find((c) => c.id === caseId);
  if (!spec) return null;

  const roomCellsMap = new Map<number, Coord[]>();
  const grid: Cell[][] = spec.roomGrid.map((row, r) =>
    row.map((roomId, c) => {
      const list = roomCellsMap.get(roomId) ?? [];
      list.push({ r, c });
      roomCellsMap.set(roomId, list);
      return {
        r,
        c,
        roomId,
        occupiable: null,
        blocking: null,
      };
    })
  );

  for (const obj of spec.objects) {
    if (obj.occupiable) grid[obj.r][obj.c].occupiable = obj.occupiable;
    if (obj.blocking) grid[obj.r][obj.c].blocking = obj.blocking;
  }

  const rooms: Room[] = spec.rooms.map((rm) => ({
    ...rm,
    cells: roomCellsMap.get(rm.id) ?? [],
  }));

  const clues: Clue[] = spec.clues.map((draft) => ({
    ...draft,
    text: formatClueText(draft, rooms, spec.people),
    highlights: computeClueHighlights(draft, grid),
  })) as Clue[];

  return {
    seed: spec.seed,
    difficulty: spec.difficulty,
    size: spec.size,
    themeId: spec.themeId,
    title: spec.title,
    premise: spec.premise,
    stolenItem: spec.stolenItem,
    curatedId: spec.id,
    caseNumber: spec.caseNumber,
    tagline: spec.tagline,
    patternBadge: spec.patternBadge,
    rooms,
    grid,
    people: spec.people.map((p) => ({ ...p })),
    victimId: spec.victimId,
    killerId: spec.killerId,
    clues,
    solution: { ...spec.solution },
    metrics: { ...spec.metrics },
  };
}

export function getNextCuratedCaseId(currentId: string): string | null {
  const cur = CURATED_CASES.find((c) => c.id === currentId);
  if (!cur) return null;
  const next = CURATED_CASES.find(
    (c) => c.difficulty === cur.difficulty && c.caseNumber === cur.caseNumber + 1
  );
  return next ? next.id : null;
}
