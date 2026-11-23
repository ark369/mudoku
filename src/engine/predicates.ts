import { OBJECT_INFO, pronounFor } from './themes';
import type { Cell, Clue, ClueDraft, Coord, Direction, ObjectKind, Person, Room } from './types';

export function isSameRoom(a: Coord, b: Coord, grid: Cell[][]): boolean {
  return grid[a.r][a.c].roomId === grid[b.r][b.c].roomId;
}

/**
 * In Murdoku, "beside" strictly means orthogonally adjacent (N/S/E/W)
 * AND within the same room (never across a wall, never diagonal).
 */
export function isBesideCell(a: Coord, b: Coord, grid: Cell[][]): boolean {
  if (!isSameRoom(a, b, grid)) return false;
  return Math.abs(a.r - b.r) + Math.abs(a.c - b.c) === 1;
}

/**
 * Checks whether `personPos` is immediately one step `dir` of `objPos`
 * within the same room.
 */
export function isDirectlyDirOf(
  personPos: Coord,
  objPos: Coord,
  dir: Direction,
  grid: Cell[][]
): boolean {
  if (!isSameRoom(personPos, objPos, grid)) return false;
  switch (dir) {
    case 'north':
      return personPos.r === objPos.r - 1 && personPos.c === objPos.c;
    case 'south':
      return personPos.r === objPos.r + 1 && personPos.c === objPos.c;
    case 'west':
      return personPos.r === objPos.r && personPos.c === objPos.c - 1;
    case 'east':
      return personPos.r === objPos.r && personPos.c === objPos.c + 1;
  }
}

/**
 * Checks global directional relation ("somewhere north/south/east/west of other").
 */
export function isDirFromPerson(pPos: Coord, qPos: Coord, dir: Direction): boolean {
  switch (dir) {
    case 'north':
      return pPos.r < qPos.r;
    case 'south':
      return pPos.r > qPos.r;
    case 'west':
      return pPos.c < qPos.c;
    case 'east':
      return pPos.c > qPos.c;
  }
}

/**
 * Diagonal adjacency within the same room.
 */
export function isDiagonalSameRoom(a: Coord, b: Coord, grid: Cell[][]): boolean {
  if (!isSameRoom(a, b, grid)) return false;
  return Math.abs(a.r - b.r) === 1 && Math.abs(a.c - b.c) === 1;
}

export function isOuterEdge(pos: Coord, size: number): boolean {
  return pos.r === 0 || pos.r === size - 1 || pos.c === 0 || pos.c === size - 1;
}

export function cellHasObject(cell: Cell, objectKind: ObjectKind): boolean {
  return cell.blocking === objectKind || cell.occupiable === objectKind;
}

export function isCellBesideObjectKind(
  pos: Coord,
  objectKind: ObjectKind,
  grid: Cell[][]
): boolean {
  const size = grid.length;
  const dirs = [
    [-1, 0],
    [1, 0],
    [0, -1],
    [0, 1],
  ];
  for (const [dr, dc] of dirs) {
    const nr = pos.r + dr;
    const nc = pos.c + dc;
    if (nr < 0 || nr >= size || nc < 0 || nc >= size) continue;
    if (!isSameRoom(pos, { r: nr, c: nc }, grid)) continue;
    if (cellHasObject(grid[nr][nc], objectKind)) return true;
  }
  return false;
}

export function isCellDirectlyDirOfObjectKind(
  pos: Coord,
  objectKind: ObjectKind,
  dir: Direction,
  grid: Cell[][]
): boolean {
  const size = grid.length;
  // If person is `dir` of object, then object is in the opposite step from person
  const offset: Record<Direction, [number, number]> = {
    north: [1, 0],
    south: [-1, 0],
    west: [0, 1],
    east: [0, -1],
  };
  const [dr, dc] = offset[dir];
  const or = pos.r + dr;
  const oc = pos.c + dc;
  if (or < 0 || or >= size || oc < 0 || oc >= size) return false;
  if (!isSameRoom(pos, { r: or, c: oc }, grid)) return false;
  return cellHasObject(grid[or][oc], objectKind);
}

/**
 * Returns the boolean set of allowed cell indices (`r * size + c`) for a unary clue's owner.
 * For non-unary relational clues, returns all walkable cells.
 */
export function getUnaryAllowedCellMask(clue: Clue, grid: Cell[][]): Uint8Array {
  const size = grid.length;
  const total = size * size;
  const mask = new Uint8Array(total);

  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      const cell = grid[r][c];
      if (cell.blocking !== null) continue;
      const pos = { r, c };
      const idx = r * size + c;
      let ok = true;

      switch (clue.kind) {
        case 'in_room':
        case 'alone_in_room':
          ok = cell.roomId === clue.roomId;
          break;
        case 'not_in_room':
          ok = cell.roomId !== clue.roomId;
          break;
        case 'in_either_room':
          ok = cell.roomId === clue.roomIds[0] || cell.roomId === clue.roomIds[1];
          break;
        case 'on_object':
        case 'only_on_object':
          ok = cell.occupiable === clue.objectKind;
          break;
        case 'not_on_object':
          ok = cell.occupiable !== clue.objectKind;
          break;
        case 'on_empty_floor':
          ok = cell.occupiable === null;
          break;
        case 'beside_object':
        case 'only_beside_object':
          ok = isCellBesideObjectKind(pos, clue.objectKind, grid);
          break;
        case 'not_beside_object':
          ok = !isCellBesideObjectKind(pos, clue.objectKind, grid);
          break;
        case 'dir_of_object':
          ok = isCellDirectlyDirOfObjectKind(pos, clue.objectKind, clue.dir, grid);
          break;
        case 'outer_edge':
          ok = isOuterEdge(pos, size);
          break;
        case 'not_outer_edge':
          ok = !isOuterEdge(pos, size);
          break;
        default:
          ok = true;
          break;
      }

      if (ok) mask[idx] = 1;
    }
  }

  return mask;
}

/**
 * Authoritatively evaluates whether a complete assignment satisfies a single clue.
 */
export function evaluateClueOnAssignment(
  clue: Clue,
  assignment: Record<string, Coord>,
  grid: Cell[][]
): boolean {
  const getRoom = (pid: string): number => {
    const pos = assignment[pid];
    return grid[pos.r][pos.c].roomId;
  };
  const roomCount = (roomId: number): number => {
    let count = 0;
    for (const pos of Object.values(assignment)) {
      if (grid[pos.r][pos.c].roomId === roomId) count++;
    }
    return count;
  };

  switch (clue.kind) {
    case 'in_room':
      return getRoom(clue.personId) === clue.roomId;
    case 'not_in_room':
      return getRoom(clue.personId) !== clue.roomId;
    case 'in_either_room': {
      const rid = getRoom(clue.personId);
      return rid === clue.roomIds[0] || rid === clue.roomIds[1];
    }
    case 'on_object': {
      const pos = assignment[clue.personId];
      return grid[pos.r][pos.c].occupiable === clue.objectKind;
    }
    case 'not_on_object': {
      const pos = assignment[clue.personId];
      return grid[pos.r][pos.c].occupiable !== clue.objectKind;
    }
    case 'on_empty_floor': {
      const pos = assignment[clue.personId];
      return grid[pos.r][pos.c].occupiable === null;
    }
    case 'beside_object':
      return isCellBesideObjectKind(assignment[clue.personId], clue.objectKind, grid);
    case 'not_beside_object':
      return !isCellBesideObjectKind(assignment[clue.personId], clue.objectKind, grid);
    case 'dir_of_object':
      return isCellDirectlyDirOfObjectKind(
        assignment[clue.personId],
        clue.objectKind,
        clue.dir,
        grid
      );
    case 'outer_edge':
      return isOuterEdge(assignment[clue.personId], grid.length);
    case 'not_outer_edge':
      return !isOuterEdge(assignment[clue.personId], grid.length);
    case 'alone_in_room':
      return getRoom(clue.personId) === clue.roomId && roomCount(clue.roomId) === 1;
    case 'alone_somewhere':
      return roomCount(getRoom(clue.personId)) === 1;
    case 'only_on_object': {
      const pPos = assignment[clue.personId];
      if (grid[pPos.r][pPos.c].occupiable !== clue.objectKind) return false;
      for (const [pid, pos] of Object.entries(assignment)) {
        if (pid !== clue.personId && grid[pos.r][pos.c].occupiable === clue.objectKind) {
          return false;
        }
      }
      return true;
    }
    case 'only_beside_object': {
      if (!isCellBesideObjectKind(assignment[clue.personId], clue.objectKind, grid)) return false;
      for (const [pid, pos] of Object.entries(assignment)) {
        if (pid !== clue.personId && isCellBesideObjectKind(pos, clue.objectKind, grid)) {
          return false;
        }
      }
      return true;
    }
    case 'room_empty':
      return roomCount(clue.roomId) === 0;
    case 'room_exact_count':
      return roomCount(clue.roomId) === clue.count;
    case 'same_room_as':
      return getRoom(clue.personId) === getRoom(clue.otherId);
    case 'diff_room_from':
      return getRoom(clue.personId) !== getRoom(clue.otherId);
    case 'dir_from_person':
      return isDirFromPerson(assignment[clue.personId], assignment[clue.otherId], clue.dir);
    case 'diagonal_to_person':
      return isDiagonalSameRoom(assignment[clue.personId], assignment[clue.otherId], grid);
    case 'victim_alone_with_killer':
      return roomCount(getRoom(clue.victimId)) === 2;
  }
}

export function formatClueText(
  clue: ClueDraft,
  rooms: Room[],
  people: Person[]
): string {
  const byId = new Map(people.map((p) => [p.id, p]));
  const roomName = (rid: number) => rooms[rid]?.name ?? `Room ${rid + 1}`;

  if (clue.kind === 'room_empty') {
    return `Nobody was in the ${roomName(clue.roomId)}.`;
  }
  if (clue.kind === 'room_exact_count') {
    const noun = clue.count === 1 ? 'person was' : 'people were';
    return `Exactly ${clue.count} ${noun} in the ${roomName(clue.roomId)}.`;
  }
  if (clue.kind === 'victim_alone_with_killer') {
    const victim = byId.get(clue.victimId)!;
    return `${victim.name} was alone in a room with the culprit.`;
  }

  const person = byId.get(clue.personId)!;
  const pr = pronounFor(person);

  switch (clue.kind) {
    case 'in_room':
      return `${pr.subj} was in the ${roomName(clue.roomId)}.`;
    case 'not_in_room':
      return `${pr.subj} was not in the ${roomName(clue.roomId)}.`;
    case 'in_either_room':
      return `${pr.subj} was in either the ${roomName(clue.roomIds[0])} or the ${roomName(clue.roomIds[1])}.`;
    case 'on_object':
      return `${pr.subj} was ${OBJECT_INFO[clue.objectKind].onPhrase}.`;
    case 'not_on_object':
      return `${pr.subj} was not ${OBJECT_INFO[clue.objectKind].onPhrase}.`;
    case 'on_empty_floor':
      return `${pr.subj} was standing on bare floor.`;
    case 'beside_object':
      return `${pr.subj} was beside ${OBJECT_INFO[clue.objectKind].besideNoun}.`;
    case 'not_beside_object':
      return `${pr.subj} was not beside ${OBJECT_INFO[clue.objectKind].besideNoun}.`;
    case 'dir_of_object':
      return `${pr.subj} was directly ${clue.dir} of ${OBJECT_INFO[clue.objectKind].besideNoun} in the same room.`;
    case 'outer_edge':
      return `${pr.subj} was along an outer wall.`;
    case 'not_outer_edge':
      return `${pr.subj} was not along an outer wall.`;
    case 'alone_in_room':
      return `${pr.subj} was alone in the ${roomName(clue.roomId)}.`;
    case 'alone_somewhere':
      return `${pr.subj} was alone in a room.`;
    case 'only_on_object':
      return `${pr.subj} was the only person ${OBJECT_INFO[clue.objectKind].onPhrase}.`;
    case 'only_beside_object':
      return `${pr.subj} was the only person beside ${OBJECT_INFO[clue.objectKind].besideNoun}.`;
    case 'same_room_as': {
      const other = byId.get(clue.otherId)!;
      return `${pr.subj} was in the same room as ${other.name}.`;
    }
    case 'diff_room_from': {
      const other = byId.get(clue.otherId)!;
      return `${pr.subj} was in a different room from ${other.name}.`;
    }
    case 'dir_from_person': {
      const other = byId.get(clue.otherId)!;
      return `${pr.subj} was somewhere ${clue.dir} of ${other.name}.`;
    }
    case 'diagonal_to_person': {
      const other = byId.get(clue.otherId)!;
      return `${pr.subj} was diagonally next to ${other.name} in the same room.`;
    }
  }
}

export function computeClueHighlights(
  clue: ClueDraft,
  _grid: Cell[][]
): Clue['highlights'] {
  switch (clue.kind) {
    case 'in_room':
    case 'alone_in_room':
    case 'room_empty':
    case 'room_exact_count':
      return { roomIds: [clue.roomId] };
    case 'not_in_room':
      return { negRoomIds: [clue.roomId] };
    case 'in_either_room':
      return { roomIds: [clue.roomIds[0], clue.roomIds[1]] };
    case 'on_object':
    case 'only_on_object':
    case 'beside_object':
    case 'only_beside_object':
    case 'dir_of_object':
      return { objectKinds: [clue.objectKind] };
    case 'not_on_object':
    case 'not_beside_object':
      return { negObjectKinds: [clue.objectKind] };
    case 'outer_edge':
      return { outerEdge: true };
    case 'not_outer_edge':
      return { negOuterEdge: true };
    case 'same_room_as':
    case 'diff_room_from':
    case 'dir_from_person':
    case 'diagonal_to_person':
      return { personIds: [clue.personId, clue.otherId] };
    case 'victim_alone_with_killer':
      return { personIds: [clue.victimId] };
    default:
      return {};
  }
}
