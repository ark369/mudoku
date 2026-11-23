import type { BlockingKind, ObjectKind, OccupiableKind, Person, RoomPattern } from './types';
import { SeededRNG } from './rng';

export interface ObjectDescriptor {
  kind: ObjectKind;
  label: string;
  singular: string;
  onPhrase?: string; // e.g., "sitting on a chair", "in a vintage car"
  besideNoun: string; // e.g., "a potted fern"
  isOccupiable: boolean;
}

export const OBJECT_INFO: Record<ObjectKind, ObjectDescriptor> = {
  // Occupiable
  chair: {
    kind: 'chair',
    label: 'Armchair',
    singular: 'an armchair',
    onPhrase: 'sitting on a chair',
    besideNoun: 'a chair',
    isOccupiable: true,
  },
  rug: {
    kind: 'rug',
    label: 'Woven Rug',
    singular: 'a woven rug',
    onPhrase: 'standing on a rug',
    besideNoun: 'a rug',
    isOccupiable: true,
  },
  sofa: {
    kind: 'sofa',
    label: 'Velvet Sofa',
    singular: 'a sofa',
    onPhrase: 'resting on a sofa',
    besideNoun: 'a sofa',
    isOccupiable: true,
  },
  bed: {
    kind: 'bed',
    label: 'Four-Poster Bed',
    singular: 'a bed',
    onPhrase: 'on a bed',
    besideNoun: 'a bed',
    isOccupiable: true,
  },
  booth: {
    kind: 'booth',
    label: 'Cafe Booth',
    singular: 'a booth',
    onPhrase: 'sitting in a booth',
    besideNoun: 'a booth',
    isOccupiable: true,
  },
  stool: {
    kind: 'stool',
    label: 'Bar Stool',
    singular: 'a stool',
    onPhrase: 'perched on a stool',
    besideNoun: 'a stool',
    isOccupiable: true,
  },
  bench: {
    kind: 'bench',
    label: 'Wooden Bench',
    singular: 'a bench',
    onPhrase: 'sitting on a bench',
    besideNoun: 'a bench',
    isOccupiable: true,
  },
  car: {
    kind: 'car',
    label: 'Vintage Car',
    singular: 'a car',
    onPhrase: 'inside a car',
    besideNoun: 'a car',
    isOccupiable: true,
  },
  oil: {
    kind: 'oil',
    label: 'Oil Slick',
    singular: 'an oil slick',
    onPhrase: 'on an oil slick',
    besideNoun: 'an oil slick',
    isOccupiable: true,
  },
  mat: {
    kind: 'mat',
    label: 'Welcome Mat',
    singular: 'a floor mat',
    onPhrase: 'standing on a mat',
    besideNoun: 'a mat',
    isOccupiable: true,
  },

  // Blocking
  plant: {
    kind: 'plant',
    label: 'Potted Plant',
    singular: 'a plant',
    besideNoun: 'a plant',
    isOccupiable: false,
  },
  table: {
    kind: 'table',
    label: 'Side Table',
    singular: 'a table',
    besideNoun: 'a table',
    isOccupiable: false,
  },
  shelf: {
    kind: 'shelf',
    label: 'Bookshelf',
    singular: 'a shelf',
    besideNoun: 'a shelf',
    isOccupiable: false,
  },
  piano: {
    kind: 'piano',
    label: 'Grand Piano',
    singular: 'a piano',
    besideNoun: 'a piano',
    isOccupiable: false,
  },
  oven: {
    kind: 'oven',
    label: 'Brick Oven',
    singular: 'an oven',
    besideNoun: 'an oven',
    isOccupiable: false,
  },
  display: {
    kind: 'display',
    label: 'Display Case',
    singular: 'a display case',
    besideNoun: 'a display case',
    isOccupiable: false,
  },
  fountain: {
    kind: 'fountain',
    label: 'Stone Fountain',
    singular: 'a fountain',
    besideNoun: 'a fountain',
    isOccupiable: false,
  },
  tree: {
    kind: 'tree',
    label: 'Topiary Tree',
    singular: 'a tree',
    besideNoun: 'a tree',
    isOccupiable: false,
  },
  globe: {
    kind: 'globe',
    label: 'Brass Globe',
    singular: 'a globe',
    besideNoun: 'a globe',
    isOccupiable: false,
  },
  statue: {
    kind: 'statue',
    label: 'Marble Bust',
    singular: 'a statue',
    besideNoun: 'a statue',
    isOccupiable: false,
  },
  easel: {
    kind: 'easel',
    label: 'Painter Easel',
    singular: 'an easel',
    besideNoun: 'an easel',
    isOccupiable: false,
  },
  barrel: {
    kind: 'barrel',
    label: 'Oak Barrel',
    singular: 'a barrel',
    besideNoun: 'a barrel',
    isOccupiable: false,
  },
  anchor: {
    kind: 'anchor',
    label: 'Brass Anchor',
    singular: 'an anchor',
    besideNoun: 'an anchor',
    isOccupiable: false,
  },
  luggage: {
    kind: 'luggage',
    label: 'Steamer Trunk',
    singular: 'a trunk',
    besideNoun: 'a trunk',
    isOccupiable: false,
  },
};

export interface RoomPalette {
  colorKey: string;
  bgHex: string;
  borderHex: string;
  pattern: RoomPattern;
}

export const ROOM_PALETTES: RoomPalette[] = [
  { colorKey: 'butter', bgHex: '#FBF1D6', borderHex: '#C8A85B', pattern: 'wood' },
  { colorKey: 'sage', bgHex: '#E3EFE4', borderHex: '#6E9A74', pattern: 'grass' },
  { colorKey: 'sky', bgHex: '#E3EEF7', borderHex: '#638DB5', pattern: 'tile' },
  { colorKey: 'blush', bgHex: '#F8E7E4', borderHex: '#C0776E', pattern: 'carpet' },
  { colorKey: 'lavender', bgHex: '#ECE8F6', borderHex: '#8778B8', pattern: 'dots' },
  { colorKey: 'peach', bgHex: '#FAEAD9', borderHex: '#C78A52', pattern: 'herringbone' },
  { colorKey: 'mint', bgHex: '#DFF1EE', borderHex: '#57968E', pattern: 'stone' },
  { colorKey: 'linen', bgHex: '#F0ECE3', borderHex: '#928876', pattern: 'stripes' },
];

export interface MysteryStory {
  title: string;
  premise: string;
  stolenItem: string;
}

export interface MysteryTheme {
  id: string;
  name: string;
  seedTag: string;
  subtitle: string;
  stories: MysteryStory[];
  rooms: string[];
  occupiables: OccupiableKind[];
  blockings: BlockingKind[];
}

export const MYSTERY_THEMES: MysteryTheme[] = [
  {
    id: 'manor',
    name: 'Grand Manor',
    seedTag: 'MANOR',
    subtitle: 'Velvet parlors & heirloom secrets',
    stories: [
      {
        title: 'The Vanished Pocket Watch',
        premise:
          'Right as the grandfather clock struck nine, the prized gold pocket watch disappeared! Place every guest on the manor floor plan to uncover who was alone with the victim.',
        stolenItem: 'the gold pocket watch',
      },
      {
        title: 'Midnight Tea Caper',
        premise:
          'During the stormy evening tea party, someone swiped the silver manor key. Map every suspect across the estate to find who was alone in a room with the victim.',
        stolenItem: 'the silver manor key',
      },
      {
        title: 'The Sapphire Brooch Caper',
        premise:
          'Just before the parlor lights flickered back on, the heirloom sapphire brooch vanished from its velvet case! Deduce every guest’s spot to catch the culprit.',
        stolenItem: 'the heirloom sapphire brooch',
      },
      {
        title: 'Secrets of Rosehall Manor',
        premise:
          'Someone slipped away with the secret family recipe box during dinner! Use the clues to locate everyone on the manor map and unmask the culprit.',
        stolenItem: 'the secret recipe box',
      },
    ],
    rooms: [
      'Parlor',
      'Library',
      'Dining Hall',
      'Conservatory',
      'Foyer',
      'Study',
      'Music Room',
      'Gallery',
      'Sunroom',
    ],
    occupiables: ['chair', 'rug', 'sofa', 'bed'],
    blockings: ['plant', 'table', 'piano', 'shelf'],
  },
  {
    id: 'bakery',
    name: 'Sunny Bakery',
    seedTag: 'BAKERY',
    subtitle: 'Warm croissants & missing recipes',
    stories: [
      {
        title: 'The Missing Sourdough Starter',
        premise:
          'Someone swapped the prized heirloom sourdough starter right before the morning bake! Deduce every baker’s spot to see who was alone with the victim.',
        stolenItem: 'the heirloom sourdough starter',
      },
      {
        title: 'Tarts & Troubles',
        premise:
          'The blue-ribbon berry tart vanished from its cooling rack! Trace the clues across the bakery to uncover who was alone with the victim.',
        stolenItem: 'the blue-ribbon berry tart',
      },
      {
        title: 'The Golden Whisk Mystery',
        premise:
          'Right before the town bake-off, the trophy golden whisk went missing! Map every guest in the bakery to reveal the culprit.',
        stolenItem: 'the trophy golden whisk',
      },
      {
        title: 'Frosting on the Floor',
        premise:
          'Someone pocketed the secret cinnamon glaze notebook during rush hour! Place everyone on the floor plan to see who was alone with the victim.',
        stolenItem: 'the cinnamon glaze notebook',
      },
    ],
    rooms: [
      'Front Counter',
      'Kitchen',
      'Pastry Corner',
      'Patio',
      'Pantry',
      'Cafe Alcove',
      'Tasting Room',
      'Storage',
    ],
    occupiables: ['booth', 'stool', 'rug', 'chair'],
    blockings: ['oven', 'table', 'display', 'plant'],
  },
  {
    id: 'garden',
    name: 'Botanical Garden',
    seedTag: 'GARDEN',
    subtitle: 'Glasshouses, Koi ponds & sunlit paths',
    stories: [
      {
        title: 'The Moonflower Heist',
        premise:
          'Just before the ribbon cutting, the rare Blue Moonflower pot went missing! Place every visitor on the garden map to spot who was alone with the victim.',
        stolenItem: 'the rare Blue Moonflower',
      },
      {
        title: 'Trouble in the Glasshouse',
        premise:
          'Someone took the golden watering can right during the garden tour! Use the spatial clues to locate everyone and reveal the culprit.',
        stolenItem: 'the golden watering can',
      },
      {
        title: 'The Prize Orchid Mystery',
        premise:
          'The championship white orchid disappeared before the judges arrived! Map every visitor on the grounds to find who was alone with the victim.',
        stolenItem: 'the championship white orchid',
      },
      {
        title: 'Petals & Footprints',
        premise:
          'A mischievous guest nabbed the antique sundial pointer between garden beds! Deduce where everyone stood to catch the culprit.',
        stolenItem: 'the antique sundial pointer',
      },
    ],
    rooms: [
      'Orchid House',
      'Rose Courtyard',
      'Fern Grotto',
      'Koi Terrace',
      'Tea Pavilion',
      'Potting Shed',
      'Cactus Dome',
      'Herb Walk',
    ],
    occupiables: ['bench', 'mat', 'chair', 'rug'],
    blockings: ['plant', 'fountain', 'tree', 'statue'],
  },
  {
    id: 'library',
    name: 'Cozy Library',
    seedTag: 'LIBRARY',
    subtitle: 'Oak stacks, reading lamps & rare folios',
    stories: [
      {
        title: 'The Bookmark Riddle',
        premise:
          'Someone hid the library’s gilded dragon bookmark during quiet hour! Place all patrons on the floor plan to expose who was alone with the victim.',
        stolenItem: 'the gilded dragon bookmark',
      },
      {
        title: 'Silence in Stack Four',
        premise:
          'A prized signed storybook vanished from the reading table! Deduce where every reader was seated to find who was alone with the victim.',
        stolenItem: 'the signed storybook',
      },
      {
        title: 'The First-Edition Folio',
        premise:
          'Before closing bell, the treasured explorer’s atlas disappeared from its shelf! Map every visitor to find who was alone with the victim.',
        stolenItem: 'the explorer’s atlas',
      },
      {
        title: 'Whispers by the Globe',
        premise:
          'Someone borrowed the librarian’s golden brass stamp without signing it out! Place every guest on the map to uncover the culprit.',
        stolenItem: 'the golden brass stamp',
      },
    ],
    rooms: [
      'Reading Hall',
      'Archive Vault',
      'Map Room',
      'Children’s Nook',
      'Periodicals',
      'Study Carrel',
      'Rotunda',
      'Bookbindery',
    ],
    occupiables: ['chair', 'sofa', 'rug', 'stool'],
    blockings: ['shelf', 'globe', 'table', 'plant'],
  },
  {
    id: 'museum',
    name: 'Art Museum',
    seedTag: 'MUSEUM',
    subtitle: 'Sculpture courts & starry canvases',
    stories: [
      {
        title: 'The Clockwork Sketch',
        premise:
          'Someone swapped the museum’s favorite miniature painting with a clever doodle! Place every guest in the galleries to find who was alone with the victim.',
        stolenItem: 'the miniature painting',
      },
      {
        title: 'Gallery After Hours',
        premise:
          'The velvet ropes parted when the curator’s bronze medal disappeared! Map each suspect’s spot to catch who was alone with the victim.',
        stolenItem: 'the bronze medal',
      },
      {
        title: 'The Missing Marble Crown',
        premise:
          'Right before the evening gala, the tiny marble crown vanished from its pedestal! Use the clues to locate everyone on the gallery map.',
        stolenItem: 'the marble crown',
      },
      {
        title: 'Palette of Clues',
        premise:
          'Someone spirited away the master painter’s silver palette! Place every visitor across the wings to see who was alone with the victim.',
        stolenItem: 'the silver palette',
      },
    ],
    rooms: [
      'East Wing',
      'Sculpture Court',
      'Portrait Hall',
      'Atrium',
      'Sketch Studio',
      'Modern Room',
      'Gift Gallery',
      'Curator Office',
    ],
    occupiables: ['bench', 'rug', 'chair', 'mat'],
    blockings: ['statue', 'easel', 'display', 'plant'],
  },
  {
    id: 'inn',
    name: 'Seaside Inn',
    seedTag: 'HARBOR',
    subtitle: 'Salty breezes & lighthouse lanterns',
    stories: [
      {
        title: 'The Lighthouse Key',
        premise:
          'Right before the harbor lantern parade, the brass lighthouse key disappeared! Place every guest inside the inn to discover who was alone with the victim.',
        stolenItem: 'the brass lighthouse key',
      },
      {
        title: 'Fog at Gull Cove',
        premise:
          'The seaside inn’s lucky ship-in-a-bottle went missing at teatime! Map all guests to pinpoint who was alone with the victim.',
        stolenItem: 'the ship-in-a-bottle',
      },
      {
        title: 'The Captain’s Compass',
        premise:
          'Someone pocketed the antique brass compass while the tide rolled in! Deduce every traveler’s spot to unmask the culprit.',
        stolenItem: 'the antique brass compass',
      },
      {
        title: 'Tidepool Treasure',
        premise:
          'A prized pearl seashell vanished from the parlor shelf! Place every guest on the inn floor plan to find who was alone with the victim.',
        stolenItem: 'the pearl seashell',
      },
    ],
    rooms: [
      'Lobby',
      'Deck Porch',
      'Chart Room',
      'Chowder Bar',
      'Harbor Suite',
      'Sun Lounge',
      'Boathouse',
      'Crows Nest',
    ],
    occupiables: ['bed', 'chair', 'booth', 'mat'],
    blockings: ['anchor', 'barrel', 'table', 'plant'],
  },
  {
    id: 'garage',
    name: 'Neighborhood Garage',
    seedTag: 'GARAGE',
    subtitle: 'Classic roadsters & shiny chrome',
    stories: [
      {
        title: 'The Missing Hood Ornament',
        premise:
          'Before the town classic car parade, the prized silver hood ornament vanished! Place everyone in the shop to see who was alone with the victim.',
        stolenItem: 'the silver hood ornament',
      },
      {
        title: 'Checkered Flag Caper',
        premise:
          'Someone swiped the signed checkered race flag right off the wall! Deduce every mechanic’s and visitor’s spot to catch the culprit.',
        stolenItem: 'the signed checkered flag',
      },
      {
        title: 'Mystery on Lift Two',
        premise:
          'The vintage roadster’s spare brass hubcap disappeared during tune-up hour! Map everyone in the garage to find who was alone with the victim.',
        stolenItem: 'the brass hubcap',
      },
      {
        title: 'The Golden Wrench',
        premise:
          'Someone pocketed the shop’s lucky golden wrench! Use the spatial clues to locate the crew and reveal the culprit.',
        stolenItem: 'the lucky golden wrench',
      },
    ],
    rooms: [
      'Main Bay',
      'Waiting Area',
      'Tool Shop',
      'Paint Booth',
      'Office',
      'Parts Room',
      'Driveway',
      'Wash Stall',
    ],
    occupiables: ['car', 'oil', 'chair', 'bench'],
    blockings: ['shelf', 'barrel', 'table', 'plant'],
  },
  {
    id: 'train',
    name: 'Starlight Express',
    seedTag: 'EXPRESS',
    subtitle: 'Velvet sleeper cars & brass bells',
    stories: [
      {
        title: 'Ticket to Puzzleburg',
        premise:
          'Someone hid the golden express punch ticket before the Mountain Pass! Place every passenger on the train map to uncover who was alone with the victim.',
        stolenItem: 'the golden express ticket',
      },
      {
        title: 'Midnight in Car Four',
        premise:
          'Someone borrowed the gilded dining car bell without asking! Deduce each passenger’s spot to find who was alone with the victim.',
        stolenItem: 'the gilded dining bell',
      },
      {
        title: 'The Conductor’s Whistle',
        premise:
          'As the train glided through Firefly Tunnel, the conductor’s silver whistle went missing! Place every passenger across the rail cars to catch the culprit.',
        stolenItem: 'the silver whistle',
      },
      {
        title: 'Mystery on the Rails',
        premise:
          'A velvet dispatch pouch vanished between stations! Map all travelers aboard the Starlight Express to expose who was alone with the victim.',
        stolenItem: 'the velvet dispatch pouch',
      },
    ],
    rooms: [
      'Dining Car',
      'Sleeper Cabin',
      'Lounge Car',
      'Baggage Bay',
      'Observation Deck',
      'Ticket Booth',
      'Tea Car',
      'Caboose',
    ],
    occupiables: ['booth', 'bed', 'sofa', 'rug'],
    blockings: ['luggage', 'table', 'globe', 'plant'],
  },
];

interface CharacterTemplate {
  letter: string;
  names: { name: string; gender: 'M' | 'F'; role: string }[];
  color: string;
}

const SUSPECT_ROSTER: CharacterTemplate[] = [
  {
    letter: 'A',
    color: '#D64550',
    names: [
      { name: 'Alice', gender: 'F', role: 'Botanist' },
      { name: 'Arthur', gender: 'M', role: 'Clockmaker' },
    ],
  },
  {
    letter: 'B',
    color: '#2B7A78',
    names: [
      { name: 'Barnaby', gender: 'M', role: 'Chef' },
      { name: 'Beatrice', gender: 'F', role: 'Violinist' },
    ],
  },
  {
    letter: 'C',
    color: '#D97706',
    names: [
      { name: 'Clara', gender: 'F', role: 'Painter' },
      { name: 'Cedric', gender: 'M', role: 'Librarian' },
    ],
  },
  {
    letter: 'D',
    color: '#3B66B0',
    names: [
      { name: 'Dante', gender: 'M', role: 'Architect' },
      { name: 'Daisy', gender: 'F', role: 'Florist' },
    ],
  },
  {
    letter: 'E',
    color: '#8B4593',
    names: [
      { name: 'Evelyn', gender: 'F', role: 'Historian' },
      { name: 'Emilio', gender: 'M', role: 'Mechanic' },
    ],
  },
  {
    letter: 'F',
    color: '#2F855A',
    names: [
      { name: 'Felix', gender: 'M', role: 'Journalist' },
      { name: 'Fiona', gender: 'F', role: 'Sculptor' },
    ],
  },
  {
    letter: 'G',
    color: '#C05621',
    names: [
      { name: 'Grace', gender: 'F', role: 'Astronomer' },
      { name: 'Gideon', gender: 'M', role: 'Captain' },
    ],
  },
  {
    letter: 'H',
    color: '#4C51BF',
    names: [
      { name: 'Hugo', gender: 'M', role: 'Pianist' },
      { name: 'Hazel', gender: 'F', role: 'Baker' },
    ],
  },
];

const VICTIM_POOL: { name: string; gender: 'M' | 'F'; role: string }[] = [
  { name: 'Victor', gender: 'M', role: 'Host' },
  { name: 'Vivian', gender: 'F', role: 'Curator' },
  { name: 'Vincent', gender: 'M', role: 'Collector' },
  { name: 'Valerie', gender: 'F', role: 'Patron' },
];

export function pickTheme(themeId: string | undefined, rng: SeededRNG): MysteryTheme {
  if (themeId && themeId !== 'random') {
    const found = MYSTERY_THEMES.find((t) => t.id === themeId);
    if (found) return found;
  }
  return rng.pick(MYSTERY_THEMES);
}

export function buildPeopleRoster(size: number, rng: SeededRNG): { people: Person[]; victimId: string } {
  const suspectCount = size - 1;
  const templates = SUSPECT_ROSTER.slice(0, suspectCount);
  const people: Person[] = templates.map((tpl, idx) => {
    const chosen = rng.pick(tpl.names);
    return {
      id: tpl.letter,
      letter: tpl.letter,
      name: chosen.name,
      gender: chosen.gender,
      isVictim: false,
      color: tpl.color,
      portraitId: idx * 2 + (chosen.gender === 'F' ? 1 : 0),
      roleTitle: chosen.role,
    };
  });

  const victimChoice = rng.pick(VICTIM_POOL);
  const victim: Person = {
    id: 'V',
    letter: 'V',
    name: victimChoice.name,
    gender: victimChoice.gender,
    isVictim: true,
    color: '#B8860B',
    portraitId: 20 + VICTIM_POOL.indexOf(victimChoice),
    roleTitle: victimChoice.role,
  };
  people.push(victim);

  return { people, victimId: 'V' };
}

export function pronounFor(person: Person): { subj: string; obj: string; poss: string } {
  return person.gender === 'M'
    ? { subj: 'He', obj: 'him', poss: 'his' }
    : { subj: 'She', obj: 'her', poss: 'her' };
}
