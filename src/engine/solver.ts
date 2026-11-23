import {
  cellHasObject,
  evaluateClueOnAssignment,
  getUnaryAllowedCellMask,
  isCellBesideObjectKind,
  isDiagonalSameRoom,
  isDirFromPerson,
} from './predicates';
import type { Cell, Clue, Coord, DeductionStep, Person, Puzzle, Room } from './types';

export interface SolverOptions {
  maxLevel?: 1 | 2 | 3;
  initialPlacements?: Record<string, Coord>;
}

export interface SolverResult {
  solved: boolean;
  contradiction: boolean;
  solution: Record<string, Coord> | null;
  steps: DeductionStep[];
  maxLevelUsed: number;
  initialSingles: number;
  victimDepth: number;
  remainingCandidateCount: number;
  candMasks?: Uint8Array[];
}

interface SolverState {
  size: number;
  totalCells: number;
  roomCount: number;
  people: Person[];
  personIdxById: Map<string, number>;
  victimIdx: number;
  grid: Cell[][];
  rooms: Room[];
  clues: Clue[];
  cand: Uint8Array[]; // [personIdx][cellIdx] -> 0 or 1
  placed: Int16Array; // [personIdx] -> cellIdx or -1
}

function cloneState(st: SolverState): SolverState {
  return {
    ...st,
    cand: st.cand.map((arr) => arr.slice()),
    placed: st.placed.slice(),
  };
}

function countCand(arr: Uint8Array): number {
  let cnt = 0;
  for (let i = 0; i < arr.length; i++) cnt += arr[i];
  return cnt;
}

function firstCandIdx(arr: Uint8Array): number {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] === 1) return i;
  }
  return -1;
}

function idxToCoord(idx: number, size: number): Coord {
  return { r: Math.floor(idx / size), c: idx % size };
}

function coordLabel(pos: Coord): string {
  return `R${pos.r + 1}C${pos.c + 1}`;
}

function createInitialState(
  grid: Cell[][],
  rooms: Room[],
  people: Person[],
  victimId: string,
  clues: Clue[],
  initialPlacements?: Record<string, Coord>
): SolverState | null {
  const size = grid.length;
  const totalCells = size * size;
  const personIdxById = new Map<string, number>();
  people.forEach((p, idx) => personIdxById.set(p.id, idx));
  const victimIdx = personIdxById.get(victimId) ?? people.length - 1;

  const walkableMask = new Uint8Array(totalCells);
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      if (grid[r][c].blocking === null) walkableMask[r * size + c] = 1;
    }
  }

  const cand = people.map(() => walkableMask.slice());
  const placed = new Int16Array(people.length).fill(-1);

  // Apply unary clue restrictions and immediate global exclusions
  for (const clue of clues) {
    if (clue.kind === 'room_empty') {
      for (const cell of rooms[clue.roomId].cells) {
        const idx = cell.r * size + cell.c;
        for (let pi = 0; pi < people.length; pi++) cand[pi][idx] = 0;
      }
      continue;
    }

    if (
      clue.kind === 'in_room' ||
      clue.kind === 'not_in_room' ||
      clue.kind === 'in_either_room' ||
      clue.kind === 'on_object' ||
      clue.kind === 'not_on_object' ||
      clue.kind === 'on_empty_floor' ||
      clue.kind === 'beside_object' ||
      clue.kind === 'not_beside_object' ||
      clue.kind === 'dir_of_object' ||
      clue.kind === 'outer_edge' ||
      clue.kind === 'not_outer_edge' ||
      clue.kind === 'alone_in_room' ||
      clue.kind === 'only_on_object' ||
      clue.kind === 'only_beside_object'
    ) {
      const pi = personIdxById.get(clue.personId);
      if (pi === undefined) continue;
      const allowed = getUnaryAllowedCellMask(clue, grid);
      for (let idx = 0; idx < totalCells; idx++) {
        if (allowed[idx] === 0) cand[pi][idx] = 0;
      }

      if (clue.kind === 'alone_in_room') {
        for (const cell of rooms[clue.roomId].cells) {
          const idx = cell.r * size + cell.c;
          for (let pj = 0; pj < people.length; pj++) {
            if (pj !== pi) cand[pj][idx] = 0;
          }
        }
      } else if (clue.kind === 'only_on_object') {
        for (let idx = 0; idx < totalCells; idx++) {
          if (allowed[idx] === 1) {
            for (let pj = 0; pj < people.length; pj++) {
              if (pj !== pi) cand[pj][idx] = 0;
            }
          }
        }
      } else if (clue.kind === 'only_beside_object') {
        for (let idx = 0; idx < totalCells; idx++) {
          if (allowed[idx] === 1) {
            for (let pj = 0; pj < people.length; pj++) {
              if (pj !== pi) cand[pj][idx] = 0;
            }
          }
        }
      }
    }
  }

  // Apply initial player placements if provided
  if (initialPlacements) {
    for (const [pid, pos] of Object.entries(initialPlacements)) {
      const pi = personIdxById.get(pid);
      if (pi === undefined) continue;
      if (pos.r < 0 || pos.r >= size || pos.c < 0 || pos.c >= size) return null;
      const cellIdx = pos.r * size + pos.c;
      if (cand[pi][cellIdx] === 0) return null;
      placed[pi] = cellIdx;
      for (let i = 0; i < totalCells; i++) {
        if (i !== cellIdx) cand[pi][i] = 0;
      }
      for (let pj = 0; pj < people.length; pj++) {
        if (pj === pi) continue;
        for (let c = 0; c < size; c++) cand[pj][pos.r * size + c] = 0;
        for (let r = 0; r < size; r++) cand[pj][r * size + pos.c] = 0;
      }
    }
  }

  // Verify nobody has 0 candidates
  for (let pi = 0; pi < people.length; pi++) {
    if (countCand(cand[pi]) === 0) return null;
  }

  return {
    size,
    totalCells,
    roomCount: rooms.length,
    people,
    personIdxById,
    victimIdx,
    grid,
    rooms,
    clues,
    cand,
    placed,
  };
}

function getAllowedRoomsForPerson(st: SolverState, pi: number): Set<number> {
  const set = new Set<number>();
  for (let idx = 0; idx < st.totalCells; idx++) {
    if (st.cand[pi][idx] === 1) {
      const r = Math.floor(idx / st.size);
      const c = idx % st.size;
      set.add(st.grid[r][c].roomId);
    }
  }
  return set;
}

function getSureRoom(st: SolverState, pi: number): number | null {
  let rid = -1;
  for (let idx = 0; idx < st.totalCells; idx++) {
    if (st.cand[pi][idx] === 1) {
      const cellRid = st.grid[Math.floor(idx / st.size)][idx % st.size].roomId;
      if (rid === -1) rid = cellRid;
      else if (rid !== cellRid) return null;
    }
  }
  return rid === -1 ? null : rid;
}

function placeInState(st: SolverState, pi: number, cellIdx: number): boolean {
  if (st.cand[pi][cellIdx] === 0) return false;
  const r = Math.floor(cellIdx / st.size);
  const c = cellIdx % st.size;
  st.placed[pi] = cellIdx;
  for (let i = 0; i < st.totalCells; i++) {
    if (i !== cellIdx) st.cand[pi][i] = 0;
  }
  for (let pj = 0; pj < st.people.length; pj++) {
    if (pj === pi) continue;
    for (let cc = 0; cc < st.size; cc++) st.cand[pj][r * st.size + cc] = 0;
    for (let rr = 0; rr < st.size; rr++) st.cand[pj][rr * st.size + c] = 0;
  }
  for (let pj = 0; pj < st.people.length; pj++) {
    if (countCand(st.cand[pj]) === 0) return false;
  }
  return true;
}

function findCluesForPerson(clues: Clue[], pid: string): string[] {
  return clues
    .filter(
      (c) =>
        c.ownerId === pid ||
        (c.kind === 'same_room_as' && (c.personId === pid || c.otherId === pid)) ||
        (c.kind === 'diff_room_from' && (c.personId === pid || c.otherId === pid)) ||
        (c.kind === 'dir_from_person' && (c.personId === pid || c.otherId === pid)) ||
        (c.kind === 'diagonal_to_person' && (c.personId === pid || c.otherId === pid))
    )
    .map((c) => c.id);
}

function tryLevel1Step(st: SolverState): DeductionStep | 'contradiction' | null {
  const { size, people, cand, placed, grid, rooms, clues, victimIdx } = st;
  const P = people.length;

  // 1. Naked single person
  for (let pi = 0; pi < P; pi++) {
    if (placed[pi] !== -1) continue;
    if (countCand(cand[pi]) === 1) {
      const idx = firstCandIdx(cand[pi]);
      const pos = idxToCoord(idx, size);
      const roomName = rooms[grid[pos.r][pos.c].roomId].name;
      if (!placeInState(st, pi, idx)) return 'contradiction';
      return {
        level: 1,
        rule: 'Only Remaining Spot',
        targetPersonId: people[pi].id,
        placement: { personId: people[pi].id, r: pos.r, c: pos.c },
        highlightCells: [pos],
        involvedClueIds: findCluesForPerson(clues, people[pi].id),
        nudge: `Check ${people[pi].name}'s clues — only one square on the floor plan works!`,
        explanation: `${people[pi].name} only has one valid square left: ${coordLabel(pos)} in the ${roomName}. Placing ${people[pi].name} also eliminates the rest of Row ${pos.r + 1} and Column ${pos.c + 1}.`,
      };
    }
  }

  // 2. Hidden single person in a Row
  for (let r = 0; r < size; r++) {
    const alivePeople: number[] = [];
    for (let pi = 0; pi < P; pi++) {
      let hasInRow = false;
      for (let c = 0; c < size; c++) {
        if (cand[pi][r * size + c] === 1) {
          hasInRow = true;
          break;
        }
      }
      if (hasInRow) alivePeople.push(pi);
    }
    if (alivePeople.length === 0) return 'contradiction';
    if (alivePeople.length === 1) {
      const pi = alivePeople[0];
      if (placed[pi] === -1) {
        const eliminations: { personId: string; r: number; c: number }[] = [];
        const keepCells: Coord[] = [];
        for (let rr = 0; rr < size; rr++) {
          for (let cc = 0; cc < size; cc++) {
            const idx = rr * size + cc;
            if (rr === r) {
              if (cand[pi][idx] === 1) keepCells.push({ r: rr, c: cc });
            } else if (cand[pi][idx] === 1) {
              cand[pi][idx] = 0;
              eliminations.push({ personId: people[pi].id, r: rr, c: cc });
            }
          }
        }
        if (eliminations.length > 0) {
          if (countCand(cand[pi]) === 0) return 'contradiction';
          return {
            level: 1,
            rule: 'Hidden Single in Row',
            targetPersonId: people[pi].id,
            eliminations,
            highlightCells: keepCells,
            involvedClueIds: findCluesForPerson(clues, people[pi].id),
            nudge: `Look closely at Row ${r + 1}. Who is the only person who can stand there?`,
            explanation: `Row ${r + 1} needs exactly one person, and ${people[pi].name} is the only one with available squares in Row ${r + 1}. So ${people[pi].name} cannot be in any other row!`,
          };
        }
      }
    }
  }

  // 3. Hidden single person in a Column
  for (let c = 0; c < size; c++) {
    const alivePeople: number[] = [];
    for (let pi = 0; pi < P; pi++) {
      let hasInCol = false;
      for (let r = 0; r < size; r++) {
        if (cand[pi][r * size + c] === 1) {
          hasInCol = true;
          break;
        }
      }
      if (hasInCol) alivePeople.push(pi);
    }
    if (alivePeople.length === 0) return 'contradiction';
    if (alivePeople.length === 1) {
      const pi = alivePeople[0];
      if (placed[pi] === -1) {
        const eliminations: { personId: string; r: number; c: number }[] = [];
        const keepCells: Coord[] = [];
        for (let rr = 0; rr < size; rr++) {
          for (let cc = 0; cc < size; cc++) {
            const idx = rr * size + cc;
            if (cc === c) {
              if (cand[pi][idx] === 1) keepCells.push({ r: rr, c: cc });
            } else if (cand[pi][idx] === 1) {
              cand[pi][idx] = 0;
              eliminations.push({ personId: people[pi].id, r: rr, c: cc });
            }
          }
        }
        if (eliminations.length > 0) {
          if (countCand(cand[pi]) === 0) return 'contradiction';
          return {
            level: 1,
            rule: 'Hidden Single in Column',
            targetPersonId: people[pi].id,
            eliminations,
            highlightCells: keepCells,
            involvedClueIds: findCluesForPerson(clues, people[pi].id),
            nudge: `Scan Column ${c + 1} — only one character can still fit in that column!`,
            explanation: `Column ${c + 1} must hold one person, and ${people[pi].name} is the only character who can still stand in Column ${c + 1}. Therefore ${people[pi].name} can be crossed out from all other columns.`,
          };
        }
      }
    }
  }

  // 4. Sole remaining cell in a Row (someone MUST occupy (r, c), blocking rest of Col c)
  for (let r = 0; r < size; r++) {
    const aliveCols: number[] = [];
    for (let c = 0; c < size; c++) {
      const idx = r * size + c;
      if (cand.some((arr) => arr[idx] === 1)) aliveCols.push(c);
    }
    if (aliveCols.length === 0) return 'contradiction';
    if (aliveCols.length === 1) {
      const c = aliveCols[0];
      const eliminations: { personId: string; r: number; c: number }[] = [];
      for (let rr = 0; rr < size; rr++) {
        if (rr === r) continue;
        for (let pi = 0; pi < P; pi++) {
          if (cand[pi][rr * size + c] === 1) {
            cand[pi][rr * size + c] = 0;
            eliminations.push({ personId: people[pi].id, r: rr, c });
          }
        }
      }
      if (eliminations.length > 0) {
        for (let pi = 0; pi < P; pi++) {
          if (countCand(cand[pi]) === 0) return 'contradiction';
        }
        return {
          level: 1,
          rule: 'Sole Open Cell in Row',
          eliminations,
          highlightCells: [{ r, c }],
          involvedClueIds: [],
          nudge: `Look at Row ${r + 1}: only one square isn't blocked for everyone!`,
          explanation: `Every square in Row ${r + 1} except ${coordLabel({ r, c })} is impossible for everyone. That means someone must stand at ${coordLabel({ r, c })}, which blocks the rest of Column ${c + 1} for all other rows!`,
        };
      }
    }
  }

  // 5. Sole remaining cell in a Column
  for (let c = 0; c < size; c++) {
    const aliveRows: number[] = [];
    for (let r = 0; r < size; r++) {
      const idx = r * size + c;
      if (cand.some((arr) => arr[idx] === 1)) aliveRows.push(r);
    }
    if (aliveRows.length === 0) return 'contradiction';
    if (aliveRows.length === 1) {
      const r = aliveRows[0];
      const eliminations: { personId: string; r: number; c: number }[] = [];
      for (let cc = 0; cc < size; cc++) {
        if (cc === c) continue;
        for (let pi = 0; pi < P; pi++) {
          if (cand[pi][r * size + cc] === 1) {
            cand[pi][r * size + cc] = 0;
            eliminations.push({ personId: people[pi].id, r, c: cc });
          }
        }
      }
      if (eliminations.length > 0) {
        for (let pi = 0; pi < P; pi++) {
          if (countCand(cand[pi]) === 0) return 'contradiction';
        }
        return {
          level: 1,
          rule: 'Sole Open Cell in Column',
          eliminations,
          highlightCells: [{ r, c }],
          involvedClueIds: [],
          nudge: `Check Column ${c + 1} — only a single square can hold someone!`,
          explanation: `Only ${coordLabel({ r, c })} remains available in Column ${c + 1}. Someone must occupy it, which clears out the rest of Row ${r + 1} for everyone else.`,
        };
      }
    }
  }

  // 6. Alone somewhere room exclusion
  for (const clue of clues) {
    if (clue.kind !== 'alone_somewhere') continue;
    const pi = st.personIdxById.get(clue.personId);
    if (pi === undefined) continue;
    const sureRid = getSureRoom(st, pi);
    if (sureRid !== null) {
      // Eliminate this room from everyone else
      const eliminations: { personId: string; r: number; c: number }[] = [];
      for (const cell of rooms[sureRid].cells) {
        const idx = cell.r * size + cell.c;
        for (let pj = 0; pj < P; pj++) {
          if (pj !== pi && cand[pj][idx] === 1) {
            cand[pj][idx] = 0;
            eliminations.push({ personId: people[pj].id, r: cell.r, c: cell.c });
          }
        }
      }
      if (eliminations.length > 0) {
        for (let pj = 0; pj < P; pj++) {
          if (countCand(cand[pj]) === 0) return 'contradiction';
        }
        return {
          level: 1,
          rule: 'Alone in Room',
          targetPersonId: people[pi].id,
          eliminations,
          highlightCells: rooms[sureRid].cells,
          involvedClueIds: [clue.id],
          nudge: `${people[pi].name} is confirmed in the ${rooms[sureRid].name} and was alone!`,
          explanation: `Since ${people[pi].name} must be in the ${rooms[sureRid].name} and was alone there, nobody else (not even the victim) can be in the ${rooms[sureRid].name}.`,
        };
      }
    }
    // Also, if any OTHER person pj is surely in room R, pi cannot be in R
    for (let pj = 0; pj < P; pj++) {
      if (pj === pi) continue;
      const otherSure = getSureRoom(st, pj);
      if (otherSure !== null) {
        const eliminations: { personId: string; r: number; c: number }[] = [];
        for (const cell of rooms[otherSure].cells) {
          const idx = cell.r * size + cell.c;
          if (cand[pi][idx] === 1) {
            cand[pi][idx] = 0;
            eliminations.push({ personId: people[pi].id, r: cell.r, c: cell.c });
          }
        }
        if (eliminations.length > 0) {
          if (countCand(cand[pi]) === 0) return 'contradiction';
          return {
            level: 1,
            rule: 'Cannot Share Occupied Room',
            targetPersonId: people[pi].id,
            eliminations,
            highlightCells: rooms[otherSure].cells,
            involvedClueIds: [clue.id, ...findCluesForPerson(clues, people[pj].id)],
            nudge: `${people[pj].name} is already in the ${rooms[otherSure].name}, so ${people[pi].name} couldn't be alone there!`,
            explanation: `Because ${people[pj].name} must be in the ${rooms[otherSure].name} and ${people[pi].name} was alone in a room, ${people[pi].name} cannot be in the ${rooms[otherSure].name}.`,
          };
        }
      }
    }
  }

  // 7. Victim alone with culprit (Level 1 room capacity & count checks)
  const victimClue = clues.find((c) => c.kind === 'victim_alone_with_killer');
  if (victimClue) {
    const vAllowedRooms = getAllowedRoomsForPerson(st, victimIdx);
    for (const rid of vAllowedRooms) {
      let sureSuspects = 0;
      const sureSuspectIds: number[] = [];
      const possibleSuspectIds: number[] = [];
      for (let pi = 0; pi < P; pi++) {
        if (pi === victimIdx) continue;
        const sr = getSureRoom(st, pi);
        if (sr === rid) {
          sureSuspects++;
          sureSuspectIds.push(pi);
        }
        const ar = getAllowedRoomsForPerson(st, pi);
        if (ar.has(rid)) possibleSuspectIds.push(pi);
      }

      // Check geometric capacity: do all alive cells in this room lie on 1 row or 1 col?
      const aliveRowsInRoom = new Set<number>();
      const aliveColsInRoom = new Set<number>();
      for (const cell of rooms[rid].cells) {
        const idx = cell.r * size + cell.c;
        if (cand.some((arr) => arr[idx] === 1)) {
          aliveRowsInRoom.add(cell.r);
          aliveColsInRoom.add(cell.c);
        }
      }

      const tooManySure = sureSuspects >= 2;
      const zeroPossible = possibleSuspectIds.length === 0;
      const singleLineRoom = aliveRowsInRoom.size <= 1 || aliveColsInRoom.size <= 1;

      if (tooManySure || zeroPossible || singleLineRoom) {
        const eliminations: { personId: string; r: number; c: number }[] = [];
        for (const cell of rooms[rid].cells) {
          const idx = cell.r * size + cell.c;
          if (cand[victimIdx][idx] === 1) {
            cand[victimIdx][idx] = 0;
            eliminations.push({ personId: people[victimIdx].id, r: cell.r, c: cell.c });
          }
        }
        if (eliminations.length > 0) {
          if (countCand(cand[victimIdx]) === 0) return 'contradiction';
          const reason = tooManySure
            ? `At least ${sureSuspects} suspects are already confirmed in the ${rooms[rid].name}, so ${people[victimIdx].name} could not have been alone with just one culprit there.`
            : zeroPossible
              ? `No suspect can be in the ${rooms[rid].name}, so ${people[victimIdx].name} couldn't meet the culprit there.`
              : `All remaining valid squares in the ${rooms[rid].name} share a single row or column, so two people cannot both fit there!`;
          return {
            level: 1,
            rule: 'Victim Room Rule',
            targetPersonId: people[victimIdx].id,
            eliminations,
            highlightCells: rooms[rid].cells,
            involvedClueIds: [victimClue.id],
            nudge: `Think about whether ${people[victimIdx].name} can actually be alone with one suspect in the ${rooms[rid].name}.`,
            explanation: reason,
          };
        }
      }
    }

    const vSureRoom = getSureRoom(st, victimIdx);
    if (vSureRoom !== null) {
      const sureInVRoom: number[] = [];
      const possibleInVRoom: number[] = [];
      for (let pi = 0; pi < P; pi++) {
        if (pi === victimIdx) continue;
        if (getSureRoom(st, pi) === vSureRoom) sureInVRoom.push(pi);
        if (getAllowedRoomsForPerson(st, pi).has(vSureRoom)) possibleInVRoom.push(pi);
      }

      if (sureInVRoom.length === 1) {
        const killerIdx = sureInVRoom[0];
        const eliminations: { personId: string; r: number; c: number }[] = [];
        for (const cell of rooms[vSureRoom].cells) {
          const idx = cell.r * size + cell.c;
          for (let pi = 0; pi < P; pi++) {
            if (pi !== victimIdx && pi !== killerIdx && cand[pi][idx] === 1) {
              cand[pi][idx] = 0;
              eliminations.push({ personId: people[pi].id, r: cell.r, c: cell.c });
            }
          }
        }
        if (eliminations.length > 0) {
          for (let pi = 0; pi < P; pi++) {
            if (countCand(cand[pi]) === 0) return 'contradiction';
          }
          return {
            level: 1,
            rule: 'Culprit Identified in Room',
            eliminations,
            highlightCells: rooms[vSureRoom].cells,
            involvedClueIds: [victimClue.id],
            nudge: `${people[victimIdx].name} and ${people[killerIdx].name} are both in the ${rooms[vSureRoom].name} — nobody else can be there!`,
            explanation: `${people[victimIdx].name} was alone with the culprit in the ${rooms[vSureRoom].name}, and ${people[killerIdx].name} is already confirmed there. So nobody else can occupy the ${rooms[vSureRoom].name}.`,
          };
        }
      } else if (sureInVRoom.length === 0 && possibleInVRoom.length === 1) {
        const killerIdx = possibleInVRoom[0];
        const eliminations: { personId: string; r: number; c: number }[] = [];
        for (let idx = 0; idx < st.totalCells; idx++) {
          const pos = idxToCoord(idx, size);
          if (grid[pos.r][pos.c].roomId !== vSureRoom && cand[killerIdx][idx] === 1) {
            cand[killerIdx][idx] = 0;
            eliminations.push({ personId: people[killerIdx].id, r: pos.r, c: pos.c });
          }
        }
        if (eliminations.length > 0) {
          if (countCand(cand[killerIdx]) === 0) return 'contradiction';
          return {
            level: 1,
            rule: 'Only Suspect Left for Victim’s Room',
            targetPersonId: people[killerIdx].id,
            eliminations,
            highlightCells: rooms[vSureRoom].cells,
            involvedClueIds: [victimClue.id],
            nudge: `${people[victimIdx].name} is in the ${rooms[vSureRoom].name} — who is the only suspect left who could join them?`,
            explanation: `${people[victimIdx].name} must share the ${rooms[vSureRoom].name} with one culprit, and ${people[killerIdx].name} is the only suspect who can still enter that room!`,
          };
        }
      }
    }
  }

  return null;
}

function tryLevel2Step(st: SolverState): DeductionStep | 'contradiction' | null {
  const { size, totalCells, people, cand, placed, grid, rooms, clues, victimIdx } = st;
  const P = people.length;

  // 1. Row / Column Pointing: if all candidates of person `pi` lie in one row/col, eliminate that row/col from others
  for (let pi = 0; pi < P; pi++) {
    if (placed[pi] !== -1) continue;
    const rows = new Set<number>();
    const cols = new Set<number>();
    const aliveCells: Coord[] = [];
    for (let idx = 0; idx < totalCells; idx++) {
      if (cand[pi][idx] === 1) {
        const pos = idxToCoord(idx, size);
        rows.add(pos.r);
        cols.add(pos.c);
        aliveCells.push(pos);
      }
    }
    if (rows.size === 1) {
      const r = Array.from(rows)[0];
      const eliminations: { personId: string; r: number; c: number }[] = [];
      for (let pj = 0; pj < P; pj++) {
        if (pj === pi) continue;
        for (let c = 0; c < size; c++) {
          if (cand[pj][r * size + c] === 1) {
            cand[pj][r * size + c] = 0;
            eliminations.push({ personId: people[pj].id, r, c });
          }
        }
      }
      if (eliminations.length > 0) {
        for (let pj = 0; pj < P; pj++) {
          if (countCand(cand[pj]) === 0) return 'contradiction';
        }
        return {
          level: 2,
          rule: 'Row Pointing',
          targetPersonId: people[pi].id,
          eliminations,
          highlightCells: aliveCells,
          involvedClueIds: findCluesForPerson(clues, people[pi].id),
          nudge: `Notice that all of ${people[pi].name}'s remaining spots lie on the same row!`,
          explanation: `All remaining valid squares for ${people[pi].name} are in Row ${r + 1}. Since ${people[pi].name} claims Row ${r + 1}, nobody else can stand in Row ${r + 1}.`,
        };
      }
    }
    if (cols.size === 1) {
      const c = Array.from(cols)[0];
      const eliminations: { personId: string; r: number; c: number }[] = [];
      for (let pj = 0; pj < P; pj++) {
        if (pj === pi) continue;
        for (let r = 0; r < size; r++) {
          if (cand[pj][r * size + c] === 1) {
            cand[pj][r * size + c] = 0;
            eliminations.push({ personId: people[pj].id, r, c });
          }
        }
      }
      if (eliminations.length > 0) {
        for (let pj = 0; pj < P; pj++) {
          if (countCand(cand[pj]) === 0) return 'contradiction';
        }
        return {
          level: 2,
          rule: 'Column Pointing',
          targetPersonId: people[pi].id,
          eliminations,
          highlightCells: aliveCells,
          involvedClueIds: findCluesForPerson(clues, people[pi].id),
          nudge: `Look at ${people[pi].name}'s remaining spots — they all line up in one column!`,
          explanation: `${people[pi].name}'s only remaining candidates are all inside Column ${c + 1}. That reserves Column ${c + 1} for ${people[pi].name}, eliminating Column ${c + 1} for everyone else.`,
        };
      }
    }
  }

  // 2. Relational & Case Note propagation (AC-3)
  for (const clue of clues) {
    if (clue.kind === 'room_exact_count') {
      const sureIn: number[] = [];
      const possibleIn: number[] = [];
      for (let pi = 0; pi < P; pi++) {
        if (getSureRoom(st, pi) === clue.roomId) sureIn.push(pi);
        if (getAllowedRoomsForPerson(st, pi).has(clue.roomId)) possibleIn.push(pi);
      }
      if (sureIn.length > clue.count || possibleIn.length < clue.count) {
        return 'contradiction';
      }
      if (sureIn.length === clue.count) {
        const eliminations: { personId: string; r: number; c: number }[] = [];
        for (const cell of rooms[clue.roomId].cells) {
          const idx = cell.r * size + cell.c;
          for (let pi = 0; pi < P; pi++) {
            if (!sureIn.includes(pi) && cand[pi][idx] === 1) {
              cand[pi][idx] = 0;
              eliminations.push({ personId: people[pi].id, r: cell.r, c: cell.c });
            }
          }
        }
        if (eliminations.length > 0) {
          for (let pi = 0; pi < P; pi++) {
            if (countCand(cand[pi]) === 0) return 'contradiction';
          }
          return {
            level: 2,
            rule: 'Room Headcount Filled',
            eliminations,
            highlightCells: rooms[clue.roomId].cells,
            involvedClueIds: [clue.id],
            nudge: `The ${rooms[clue.roomId].name} already has all ${clue.count} of its people accounted for!`,
            explanation: `The Case Note states exactly ${clue.count} ${clue.count === 1 ? 'person was' : 'people were'} in the ${rooms[clue.roomId].name}, and those spots are already claimed. Everyone else can be ruled out of that room.`,
          };
        }
      }
      if (possibleIn.length === clue.count) {
        const eliminations: { personId: string; r: number; c: number }[] = [];
        for (const pi of possibleIn) {
          for (let idx = 0; idx < totalCells; idx++) {
            const pos = idxToCoord(idx, size);
            if (grid[pos.r][pos.c].roomId !== clue.roomId && cand[pi][idx] === 1) {
              cand[pi][idx] = 0;
              eliminations.push({ personId: people[pi].id, r: pos.r, c: pos.c });
            }
          }
        }
        if (eliminations.length > 0) {
          for (const pi of possibleIn) {
            if (countCand(cand[pi]) === 0) return 'contradiction';
          }
          return {
            level: 2,
            rule: 'Room Headcount Required',
            eliminations,
            highlightCells: rooms[clue.roomId].cells,
            involvedClueIds: [clue.id],
            nudge: `Only ${clue.count} people can even reach the ${rooms[clue.roomId].name} — they must all be inside!`,
            explanation: `The ${rooms[clue.roomId].name} must hold ${clue.count} people, and only ${possibleIn.map((i) => people[i].name).join(' and ')} can still occupy it. So none of them can be outside that room.`,
          };
        }
      }
    }

    if (clue.kind === 'same_room_as') {
      const p1 = st.personIdxById.get(clue.personId);
      const p2 = st.personIdxById.get(clue.otherId);
      if (p1 === undefined || p2 === undefined) continue;

      const eliminations: { personId: string; r: number; c: number }[] = [];
      for (const [a, b] of [
        [p1, p2],
        [p2, p1],
      ]) {
        for (let idxA = 0; idxA < totalCells; idxA++) {
          if (cand[a][idxA] === 0) continue;
          const posA = idxToCoord(idxA, size);
          const rA = grid[posA.r][posA.c].roomId;
          let hasPartner = false;
          for (let idxB = 0; idxB < totalCells; idxB++) {
            if (cand[b][idxB] === 0) continue;
            const posB = idxToCoord(idxB, size);
            if (grid[posB.r][posB.c].roomId === rA && posA.r !== posB.r && posA.c !== posB.c) {
              hasPartner = true;
              break;
            }
          }
          if (!hasPartner) {
            cand[a][idxA] = 0;
            eliminations.push({ personId: people[a].id, r: posA.r, c: posA.c });
          }
        }
      }
      if (eliminations.length > 0) {
        if (countCand(cand[p1]) === 0 || countCand(cand[p2]) === 0) return 'contradiction';
        return {
          level: 2,
          rule: 'Same Room Deduction',
          targetPersonId: people[p1].id,
          eliminations,
          highlightCells: eliminations.map((e) => ({ r: e.r, c: e.c })),
          involvedClueIds: [clue.id],
          nudge: `Compare which rooms both ${people[p1].name} and ${people[p2].name} can share without clashing rows or columns.`,
          explanation: `${people[p1].name} and ${people[p2].name} must share the same room (on different rows and columns). Removing unmatched rooms/cells narrows their positions.`,
        };
      }
    }

    if (clue.kind === 'diff_room_from') {
      const p1 = st.personIdxById.get(clue.personId);
      const p2 = st.personIdxById.get(clue.otherId);
      if (p1 === undefined || p2 === undefined) continue;

      for (const [fixed, other] of [
        [p1, p2],
        [p2, p1],
      ]) {
        const sureR = getSureRoom(st, fixed);
        if (sureR !== null) {
          const eliminations: { personId: string; r: number; c: number }[] = [];
          for (const cell of rooms[sureR].cells) {
            const idx = cell.r * size + cell.c;
            if (cand[other][idx] === 1) {
              cand[other][idx] = 0;
              eliminations.push({ personId: people[other].id, r: cell.r, c: cell.c });
            }
          }
          if (eliminations.length > 0) {
            if (countCand(cand[other]) === 0) return 'contradiction';
            return {
              level: 2,
              rule: 'Different Room Exclusion',
              targetPersonId: people[other].id,
              eliminations,
              highlightCells: rooms[sureR].cells,
              involvedClueIds: [clue.id],
              nudge: `${people[fixed].name} is locked into the ${rooms[sureR].name}, so ${people[other].name} cannot be there!`,
              explanation: `Because ${people[fixed].name} must be in the ${rooms[sureR].name} and ${people[other].name} was in a different room, we can cross out the ${rooms[sureR].name} for ${people[other].name}.`,
            };
          }
        }
      }
    }

    if (clue.kind === 'dir_from_person') {
      const p1 = st.personIdxById.get(clue.personId);
      const p2 = st.personIdxById.get(clue.otherId);
      if (p1 === undefined || p2 === undefined) continue;

      const eliminations: { personId: string; r: number; c: number }[] = [];
      for (let idx1 = 0; idx1 < totalCells; idx1++) {
        if (cand[p1][idx1] === 0) continue;
        const pos1 = idxToCoord(idx1, size);
        let ok = false;
        for (let idx2 = 0; idx2 < totalCells; idx2++) {
          if (cand[p2][idx2] === 0) continue;
          const pos2 = idxToCoord(idx2, size);
          if (pos1.r !== pos2.r && pos1.c !== pos2.c && isDirFromPerson(pos1, pos2, clue.dir)) {
            ok = true;
            break;
          }
        }
        if (!ok) {
          cand[p1][idx1] = 0;
          eliminations.push({ personId: people[p1].id, r: pos1.r, c: pos1.c });
        }
      }

      for (let idx2 = 0; idx2 < totalCells; idx2++) {
        if (cand[p2][idx2] === 0) continue;
        const pos2 = idxToCoord(idx2, size);
        let ok = false;
        for (let idx1 = 0; idx1 < totalCells; idx1++) {
          if (cand[p1][idx1] === 0) continue;
          const pos1 = idxToCoord(idx1, size);
          if (pos1.r !== pos2.r && pos1.c !== pos2.c && isDirFromPerson(pos1, pos2, clue.dir)) {
            ok = true;
            break;
          }
        }
        if (!ok) {
          cand[p2][idx2] = 0;
          eliminations.push({ personId: people[p2].id, r: pos2.r, c: pos2.c });
        }
      }

      if (eliminations.length > 0) {
        if (countCand(cand[p1]) === 0 || countCand(cand[p2]) === 0) return 'contradiction';
        return {
          level: 2,
          rule: 'Compass Direction Clue',
          targetPersonId: people[p1].id,
          eliminations,
          highlightCells: eliminations.map((e) => ({ r: e.r, c: e.c })),
          involvedClueIds: [clue.id],
          nudge: `Check the compass! ${people[p1].name} must be ${clue.dir} of ${people[p2].name}.`,
          explanation: `Since ${people[p1].name} is somewhere ${clue.dir} of ${people[p2].name}, any cells that leave no valid partner in that direction can be eliminated.`,
        };
      }
    }

    if (clue.kind === 'diagonal_to_person') {
      const p1 = st.personIdxById.get(clue.personId);
      const p2 = st.personIdxById.get(clue.otherId);
      if (p1 === undefined || p2 === undefined) continue;

      const eliminations: { personId: string; r: number; c: number }[] = [];
      for (const [a, b] of [
        [p1, p2],
        [p2, p1],
      ]) {
        for (let idxA = 0; idxA < totalCells; idxA++) {
          if (cand[a][idxA] === 0) continue;
          const posA = idxToCoord(idxA, size);
          let ok = false;
          for (let idxB = 0; idxB < totalCells; idxB++) {
            if (cand[b][idxB] === 0) continue;
            const posB = idxToCoord(idxB, size);
            if (isDiagonalSameRoom(posA, posB, grid)) {
              ok = true;
              break;
            }
          }
          if (!ok) {
            cand[a][idxA] = 0;
            eliminations.push({ personId: people[a].id, r: posA.r, c: posA.c });
          }
        }
      }
      if (eliminations.length > 0) {
        if (countCand(cand[p1]) === 0 || countCand(cand[p2]) === 0) return 'contradiction';
        return {
          level: 2,
          rule: 'Diagonal Neighbor Clue',
          targetPersonId: people[p1].id,
          eliminations,
          highlightCells: eliminations.map((e) => ({ r: e.r, c: e.c })),
          involvedClueIds: [clue.id],
          nudge: `${people[p1].name} and ${people[p2].name} must be diagonally touching inside the same room.`,
          explanation: `Only squares that have a valid diagonal partner in the same room can work for ${people[p1].name} and ${people[p2].name}.`,
        };
      }
    }
  }

  // 3. Pairwise Victim compatibility check (can V actually pair with a non-conflicting suspect in that cell/room?)
  const victimClue = clues.find((c) => c.kind === 'victim_alone_with_killer');
  if (victimClue) {
    const alonePeople = new Set<number>();
    for (const c of clues) {
      if (c.kind === 'alone_somewhere') {
        const pi = st.personIdxById.get(c.personId);
        if (pi !== undefined) alonePeople.add(pi);
      }
    }

    const eliminations: { personId: string; r: number; c: number }[] = [];
    for (let idxV = 0; idxV < totalCells; idxV++) {
      if (cand[victimIdx][idxV] === 0) continue;
      const posV = idxToCoord(idxV, size);
      const rid = grid[posV.r][posV.c].roomId;
      let hasPartner = false;
      for (let pi = 0; pi < P; pi++) {
        if (pi === victimIdx || alonePeople.has(pi)) continue;
        for (const cell of rooms[rid].cells) {
          if (cell.r === posV.r || cell.c === posV.c) continue;
          if (cand[pi][cell.r * size + cell.c] === 1) {
            hasPartner = true;
            break;
          }
        }
        if (hasPartner) break;
      }
      if (!hasPartner) {
        cand[victimIdx][idxV] = 0;
        eliminations.push({ personId: people[victimIdx].id, r: posV.r, c: posV.c });
      }
    }
    if (eliminations.length > 0) {
      if (countCand(cand[victimIdx]) === 0) return 'contradiction';
      return {
        level: 2,
        rule: 'Victim Pairing Check',
        targetPersonId: people[victimIdx].id,
        eliminations,
        highlightCells: eliminations.map((e) => ({ r: e.r, c: e.c })),
        involvedClueIds: [victimClue.id],
        nudge: `Check which remaining spots for ${people[victimIdx].name} actually allow a suspect to join them in the same room!`,
        explanation: `If ${people[victimIdx].name} stood in ${eliminations.map((e) => coordLabel(e)).join(', ')}, no suspect could share that room without sharing a row or column.`,
      };
    }
  }

  return null;
}

function popcount(n: number): number {
  let c = 0;
  let x = n;
  while (x) {
    x &= x - 1;
    c++;
  }
  return c;
}

function hasPerfectMatching(
  edges: number[][],
  leftActive: number[],
  rightForbiddenMask: number,
  forcedLeft: number,
  forcedRight: number
): boolean {
  const n = leftActive.length;
  const matchR = new Map<number, number>();

  function dfs(uIdx: number, visitedR: Set<number>): boolean {
    const u = leftActive[uIdx];
    for (const v of edges[u]) {
      if ((rightForbiddenMask & (1 << v)) !== 0) continue;
      if (visitedR.has(v)) continue;
      visitedR.add(v);
      const prev = matchR.get(v);
      if (prev === undefined || dfs(prev, visitedR)) {
        matchR.set(v, uIdx);
        return true;
      }
    }
    return false;
  }

  let matched = 0;
  for (let i = 0; i < n; i++) {
    if (leftActive[i] === forcedLeft) continue;
    if (dfs(i, new Set())) matched++;
  }
  const needed = forcedLeft === -1 ? n : n - 1;
  void forcedRight;
  return matched === needed;
}

function tryLevel3Step(
  st: SolverState,
  allowContradictionProbe: boolean
): DeductionStep | 'contradiction' | null {
  const { size, totalCells, people, cand, placed, clues } = st;
  const P = people.length;

  // Build rowMask[pi] and colMask[pi] for unplaced people
  const unplaced: number[] = [];
  const rowMasks = new Array<number>(P).fill(0);
  const colMasks = new Array<number>(P).fill(0);
  for (let pi = 0; pi < P; pi++) {
    if (placed[pi] === -1) unplaced.push(pi);
    for (let idx = 0; idx < totalCells; idx++) {
      if (cand[pi][idx] === 1) {
        const r = Math.floor(idx / size);
        const c = idx % size;
        rowMasks[pi] |= 1 << r;
        colMasks[pi] |= 1 << c;
      }
    }
  }

  // 1. Naked Pairs/Triples on Rows
  for (const subsetSize of [2, 3]) {
    if (unplaced.length <= subsetSize) continue;
    for (let i = 0; i < unplaced.length; i++) {
      for (let j = i + 1; j < unplaced.length; j++) {
        if (subsetSize === 2) {
          const pA = unplaced[i];
          const pB = unplaced[j];
          const union = rowMasks[pA] | rowMasks[pB];
          if (popcount(union) === 2) {
            const eliminations: { personId: string; r: number; c: number }[] = [];
            for (const pk of unplaced) {
              if (pk === pA || pk === pB) continue;
              for (let r = 0; r < size; r++) {
                if ((union & (1 << r)) === 0) continue;
                for (let c = 0; c < size; c++) {
                  if (cand[pk][r * size + c] === 1) {
                    cand[pk][r * size + c] = 0;
                    eliminations.push({ personId: people[pk].id, r, c });
                  }
                }
              }
            }
            if (eliminations.length > 0) {
              for (let pi = 0; pi < P; pi++) {
                if (countCand(cand[pi]) === 0) return 'contradiction';
              }
              const rowNums: number[] = [];
              for (let r = 0; r < size; r++) if (union & (1 << r)) rowNums.push(r + 1);
              return {
                level: 3,
                rule: 'Naked Row Pair',
                eliminations,
                highlightCells: eliminations.map((e) => ({ r: e.r, c: e.c })),
                involvedClueIds: [],
                nudge: `${people[pA].name} and ${people[pB].name} are both limited to the same two rows!`,
                explanation: `${people[pA].name} and ${people[pB].name} can only occupy Rows ${rowNums.join(' and ')}. Those two people claim those two rows completely, ruling everyone else out of Rows ${rowNums.join(' and ')}.`,
              };
            }
          }
        } else {
          for (let k = j + 1; k < unplaced.length; k++) {
            const pA = unplaced[i];
            const pB = unplaced[j];
            const pC = unplaced[k];
            const union = rowMasks[pA] | rowMasks[pB] | rowMasks[pC];
            if (popcount(union) === 3) {
              const eliminations: { personId: string; r: number; c: number }[] = [];
              for (const pk of unplaced) {
                if (pk === pA || pk === pB || pk === pC) continue;
                for (let r = 0; r < size; r++) {
                  if ((union & (1 << r)) === 0) continue;
                  for (let c = 0; c < size; c++) {
                    if (cand[pk][r * size + c] === 1) {
                      cand[pk][r * size + c] = 0;
                      eliminations.push({ personId: people[pk].id, r, c });
                    }
                  }
                }
              }
              if (eliminations.length > 0) {
                for (let pi = 0; pi < P; pi++) {
                  if (countCand(cand[pi]) === 0) return 'contradiction';
                }
                const rowNums: number[] = [];
                for (let r = 0; r < size; r++) if (union & (1 << r)) rowNums.push(r + 1);
                return {
                  level: 3,
                  rule: 'Naked Row Triple',
                  eliminations,
                  highlightCells: eliminations.map((e) => ({ r: e.r, c: e.c })),
                  involvedClueIds: [],
                  nudge: `Three characters (${people[pA].name}, ${people[pB].name}, ${people[pC].name}) share the exact same three rows!`,
                  explanation: `${people[pA].name}, ${people[pB].name}, and ${people[pC].name} are restricted to Rows ${rowNums.join(', ')}. Nobody else can occupy those three rows.`,
                };
              }
            }
          }
        }
      }
    }
  }

  // 2. Naked Pairs/Triples on Columns
  for (const subsetSize of [2, 3]) {
    if (unplaced.length <= subsetSize) continue;
    for (let i = 0; i < unplaced.length; i++) {
      for (let j = i + 1; j < unplaced.length; j++) {
        if (subsetSize === 2) {
          const pA = unplaced[i];
          const pB = unplaced[j];
          const union = colMasks[pA] | colMasks[pB];
          if (popcount(union) === 2) {
            const eliminations: { personId: string; r: number; c: number }[] = [];
            for (const pk of unplaced) {
              if (pk === pA || pk === pB) continue;
              for (let c = 0; c < size; c++) {
                if ((union & (1 << c)) === 0) continue;
                for (let r = 0; r < size; r++) {
                  if (cand[pk][r * size + c] === 1) {
                    cand[pk][r * size + c] = 0;
                    eliminations.push({ personId: people[pk].id, r, c });
                  }
                }
              }
            }
            if (eliminations.length > 0) {
              for (let pi = 0; pi < P; pi++) {
                if (countCand(cand[pi]) === 0) return 'contradiction';
              }
              const colNums: number[] = [];
              for (let c = 0; c < size; c++) if (union & (1 << c)) colNums.push(c + 1);
              return {
                level: 3,
                rule: 'Naked Column Pair',
                eliminations,
                highlightCells: eliminations.map((e) => ({ r: e.r, c: e.c })),
                involvedClueIds: [],
                nudge: `${people[pA].name} and ${people[pB].name} can only stand in two columns!`,
                explanation: `${people[pA].name} and ${people[pB].name} are confined to Columns ${colNums.join(' and ')}. So everyone else can be eliminated from Columns ${colNums.join(' and ')}.`,
              };
            }
          }
        } else {
          for (let k = j + 1; k < unplaced.length; k++) {
            const pA = unplaced[i];
            const pB = unplaced[j];
            const pC = unplaced[k];
            const union = colMasks[pA] | colMasks[pB] | colMasks[pC];
            if (popcount(union) === 3) {
              const eliminations: { personId: string; r: number; c: number }[] = [];
              for (const pk of unplaced) {
                if (pk === pA || pk === pB || pk === pC) continue;
                for (let c = 0; c < size; c++) {
                  if ((union & (1 << c)) === 0) continue;
                  for (let r = 0; r < size; r++) {
                    if (cand[pk][r * size + c] === 1) {
                      cand[pk][r * size + c] = 0;
                      eliminations.push({ personId: people[pk].id, r, c });
                    }
                  }
                }
              }
              if (eliminations.length > 0) {
                for (let pi = 0; pi < P; pi++) {
                  if (countCand(cand[pi]) === 0) return 'contradiction';
                }
                const colNums: number[] = [];
                for (let c = 0; c < size; c++) if (union & (1 << c)) colNums.push(c + 1);
                return {
                  level: 3,
                  rule: 'Naked Column Triple',
                  eliminations,
                  highlightCells: eliminations.map((e) => ({ r: e.r, c: e.c })),
                  involvedClueIds: [],
                  nudge: `Three people share the exact same three columns!`,
                  explanation: `${people[pA].name}, ${people[pB].name}, and ${people[pC].name} are confined to Columns ${colNums.join(', ')}. Nobody else can occupy those columns.`,
                };
              }
            }
          }
        }
      }
    }
  }

  // 3. Bipartite Matching Arc Consistency on Person-to-Row and Person-to-Col
  const allPeopleIndices = Array.from({ length: P }, (_, i) => i);
  const rowEdges: number[][] = Array.from({ length: P }, (_, pi) => {
    const rows: number[] = [];
    for (let r = 0; r < size; r++) if (rowMasks[pi] & (1 << r)) rows.push(r);
    return rows;
  });
  for (const pi of unplaced) {
    for (const r of rowEdges[pi]) {
      if (!hasPerfectMatching(rowEdges, allPeopleIndices, 1 << r, pi, r)) {
        const eliminations: { personId: string; r: number; c: number }[] = [];
        for (let c = 0; c < size; c++) {
          if (cand[pi][r * size + c] === 1) {
            cand[pi][r * size + c] = 0;
            eliminations.push({ personId: people[pi].id, r, c });
          }
        }
        if (eliminations.length > 0) {
          if (countCand(cand[pi]) === 0) return 'contradiction';
          return {
            level: 3,
            rule: 'Row Matching Chain',
            targetPersonId: people[pi].id,
            eliminations,
            highlightCells: eliminations.map((e) => ({ r: e.r, c: e.c })),
            involvedClueIds: findCluesForPerson(clues, people[pi].id),
            nudge: `Test what happens to the other suspects' rows if ${people[pi].name} goes in Row ${r + 1}!`,
            explanation: `Placing ${people[pi].name} in Row ${r + 1} would leave too few available rows for the remaining characters. Therefore ${people[pi].name} cannot be in Row ${r + 1}.`,
          };
        }
      }
    }
  }

  const colEdges: number[][] = Array.from({ length: P }, (_, pi) => {
    const cols: number[] = [];
    for (let c = 0; c < size; c++) if (colMasks[pi] & (1 << c)) cols.push(c);
    return cols;
  });
  for (const pi of unplaced) {
    for (const c of colEdges[pi]) {
      if (!hasPerfectMatching(colEdges, allPeopleIndices, 1 << c, pi, c)) {
        const eliminations: { personId: string; r: number; c: number }[] = [];
        for (let r = 0; r < size; r++) {
          if (cand[pi][r * size + c] === 1) {
            cand[pi][r * size + c] = 0;
            eliminations.push({ personId: people[pi].id, r, c });
          }
        }
        if (eliminations.length > 0) {
          if (countCand(cand[pi]) === 0) return 'contradiction';
          return {
            level: 3,
            rule: 'Column Matching Chain',
            targetPersonId: people[pi].id,
            eliminations,
            highlightCells: eliminations.map((e) => ({ r: e.r, c: e.c })),
            involvedClueIds: findCluesForPerson(clues, people[pi].id),
            nudge: `See what happens to everyone else's columns if ${people[pi].name} stands in Column ${c + 1}!`,
            explanation: `If ${people[pi].name} took Column ${c + 1}, the remaining characters couldn't all fit into distinct columns. So ${people[pi].name} can be ruled out of Column ${c + 1}.`,
          };
        }
      }
    }
  }

  // 4. Bounded 1-step hypothesis check (if-then contradiction) for Expert cases
  if (allowContradictionProbe && unplaced.length > 0) {
    // Sort unplaced people by fewest candidates
    const sorted = unplaced
      .map((pi) => ({ pi, cnt: countCand(cand[pi]) }))
      .sort((a, b) => a.cnt - b.cnt);

    for (const { pi, cnt } of sorted) {
      if (cnt > 2) break;
      for (let idx = 0; idx < totalCells; idx++) {
        if (cand[pi][idx] === 0) continue;
        const probe = cloneState(st);
        let boom = !placeInState(probe, pi, idx);
        if (!boom) {
          for (let iter = 0; iter < 40; iter++) {
            const s1 = tryLevel1Step(probe);
            if (s1 === 'contradiction') {
              boom = true;
              break;
            }
            if (s1 !== null) continue;
            const s2 = tryLevel2Step(probe);
            if (s2 === 'contradiction') {
              boom = true;
              break;
            }
            if (s2 !== null) continue;
            const s3 = tryLevel3Step(probe, false);
            if (s3 === 'contradiction') {
              boom = true;
              break;
            }
            if (s3 === null) break;
          }
        }

        if (boom) {
          const pos = idxToCoord(idx, size);
          cand[pi][idx] = 0;
          if (countCand(cand[pi]) === 0) return 'contradiction';
          return {
            level: 3,
            rule: 'Chain Deduction',
            targetPersonId: people[pi].id,
            eliminations: [{ personId: people[pi].id, r: pos.r, c: pos.c }],
            highlightCells: [pos],
            involvedClueIds: findCluesForPerson(clues, people[pi].id),
            nudge: `Try imagining ${people[pi].name} at ${coordLabel(pos)} — follow the chain to see why it breaks!`,
            explanation: `If ${people[pi].name} were placed at ${coordLabel(pos)}, the row/column and clue constraints create a contradiction down the line. Therefore ${coordLabel(pos)} can be crossed out for ${people[pi].name}.`,
          };
        }
      }
    }
  }

  return null;
}

export function solveDeductively(
  grid: Cell[][],
  rooms: Room[],
  people: Person[],
  victimId: string,
  clues: Clue[],
  options: SolverOptions = {}
): SolverResult {
  const maxLevel = options.maxLevel ?? 3;
  const st = createInitialState(grid, rooms, people, victimId, clues, options.initialPlacements);
  if (!st) {
    return {
      solved: false,
      contradiction: true,
      solution: null,
      steps: [],
      maxLevelUsed: 1,
      initialSingles: 0,
      victimDepth: 0,
      remainingCandidateCount: 0,
    };
  }

  let initialSingles = 0;
  for (let pi = 0; pi < st.people.length; pi++) {
    if (st.placed[pi] === -1 && countCand(st.cand[pi]) === 1) initialSingles++;
  }

  const steps: DeductionStep[] = [];
  let maxLevelUsed = 1;
  let victimDepth = -1;
  let contradictionProbesUsed = 0;

  const attachSurvivingCells = (step: DeductionStep) => {
    if (step.targetPersonId && !step.placement) {
      const pi = st.personIdxById.get(step.targetPersonId);
      if (pi !== undefined) {
        const surviving: Coord[] = [];
        for (let idx = 0; idx < st.totalCells; idx++) {
          if (st.cand[pi][idx] === 1) surviving.push(idxToCoord(idx, st.size));
        }
        step.survivingCells = surviving;
      }
    }
  };

  while (true) {
    let allPlaced = true;
    for (let pi = 0; pi < st.people.length; pi++) {
      if (st.placed[pi] === -1) {
        allPlaced = false;
        break;
      }
    }
    if (allPlaced) break;

    const s1 = tryLevel1Step(st);
    if (s1 === 'contradiction') {
      return {
        solved: false,
        contradiction: true,
        solution: null,
        steps,
        maxLevelUsed,
        initialSingles,
        victimDepth: victimDepth === -1 ? steps.length : victimDepth,
        remainingCandidateCount: st.cand.reduce((acc, a) => acc + countCand(a), 0),
      };
    }
    if (s1 !== null) {
      attachSurvivingCells(s1);
      steps.push(s1);
      if (victimDepth === -1 && st.placed[st.victimIdx] !== -1) victimDepth = steps.length;
      continue;
    }

    if (maxLevel < 2) break;
    const s2 = tryLevel2Step(st);
    if (s2 === 'contradiction') {
      return {
        solved: false,
        contradiction: true,
        solution: null,
        steps,
        maxLevelUsed,
        initialSingles,
        victimDepth: victimDepth === -1 ? steps.length : victimDepth,
        remainingCandidateCount: st.cand.reduce((acc, a) => acc + countCand(a), 0),
      };
    }
    if (s2 !== null) {
      maxLevelUsed = Math.max(maxLevelUsed, 2);
      attachSurvivingCells(s2);
      steps.push(s2);
      if (victimDepth === -1 && st.placed[st.victimIdx] !== -1) victimDepth = steps.length;
      continue;
    }

    if (maxLevel < 3) break;
    const s3 = tryLevel3Step(st, contradictionProbesUsed < 3);
    if (s3 === 'contradiction') {
      return {
        solved: false,
        contradiction: true,
        solution: null,
        steps,
        maxLevelUsed,
        initialSingles,
        victimDepth: victimDepth === -1 ? steps.length : victimDepth,
        remainingCandidateCount: st.cand.reduce((acc, a) => acc + countCand(a), 0),
      };
    }
    if (s3 !== null) {
      if (s3.rule === 'Chain Deduction') contradictionProbesUsed++;
      maxLevelUsed = Math.max(maxLevelUsed, 3);
      attachSurvivingCells(s3);
      steps.push(s3);
      if (victimDepth === -1 && st.placed[st.victimIdx] !== -1) victimDepth = steps.length;
      continue;
    }

    break;
  }

  let remainingCandidateCount = 0;
  let allPlaced = true;
  for (let pi = 0; pi < st.people.length; pi++) {
    remainingCandidateCount += countCand(st.cand[pi]);
    if (st.placed[pi] === -1) allPlaced = false;
  }

  if (!allPlaced) {
    return {
      solved: false,
      contradiction: false,
      solution: null,
      steps,
      maxLevelUsed,
      initialSingles,
      victimDepth: victimDepth === -1 ? steps.length : victimDepth,
      remainingCandidateCount,
      candMasks: st.cand,
    };
  }

  const solution: Record<string, Coord> = {};
  for (let pi = 0; pi < st.people.length; pi++) {
    solution[st.people[pi].id] = idxToCoord(st.placed[pi], st.size);
  }

  // Final authoritative verification of every clue
  for (const clue of clues) {
    if (!evaluateClueOnAssignment(clue, solution, grid)) {
      return {
        solved: false,
        contradiction: true,
        solution: null,
        steps,
        maxLevelUsed,
        initialSingles,
        victimDepth: victimDepth === -1 ? steps.length : victimDepth,
        remainingCandidateCount,
      };
    }
  }

  return {
    solved: true,
    contradiction: false,
    solution,
    steps,
    maxLevelUsed,
    initialSingles,
    victimDepth: victimDepth === -1 ? steps.length : victimDepth,
    remainingCandidateCount,
    candMasks: st.cand,
  };
}

/**
 * Authoritative backtracking solver that counts distinct valid solutions up to `limit`.
 */
export function countSolutions(
  grid: Cell[][],
  rooms: Room[],
  people: Person[],
  victimId: string,
  clues: Clue[],
  limit = 2
): { count: number; firstSolution: Record<string, Coord> | null } {
  const st = createInitialState(grid, rooms, people, victimId, clues);
  if (!st) return { count: 0, firstSolution: null };

  // Run fast Level 1-2 deductive pruning before backtracking
  for (let iter = 0; iter < 120; iter++) {
    const s1 = tryLevel1Step(st);
    if (s1 === 'contradiction') return { count: 0, firstSolution: null };
    if (s1 !== null) continue;
    const s2 = tryLevel2Step(st);
    if (s2 === 'contradiction') return { count: 0, firstSolution: null };
    if (s2 === null) break;
  }

  const P = people.length;
  const size = grid.length;
  let count = 0;
  let firstSolution: Record<string, Coord> | null = null;

  // Prepare initial assignment + row/col masks
  const assignment: Record<string, Coord> = {};
  let usedRows = 0;
  let usedCols = 0;
  const unplacedIndices: number[] = [];

  for (let pi = 0; pi < P; pi++) {
    if (st.placed[pi] !== -1) {
      const pos = idxToCoord(st.placed[pi], size);
      assignment[people[pi].id] = pos;
      if ((usedRows & (1 << pos.r)) !== 0 || (usedCols & (1 << pos.c)) !== 0) {
        return { count: 0, firstSolution: null };
      }
      usedRows |= 1 << pos.r;
      usedCols |= 1 << pos.c;
    } else {
      unplacedIndices.push(pi);
    }
  }

  // Sort unplaced by fewest candidate cells (MRV)
  const candLists = new Map<number, Coord[]>();
  for (const pi of unplacedIndices) {
    const list: Coord[] = [];
    for (let idx = 0; idx < st.totalCells; idx++) {
      if (st.cand[pi][idx] === 1) list.push(idxToCoord(idx, size));
    }
    candLists.set(pi, list);
  }
  unplacedIndices.sort((a, b) => (candLists.get(a)?.length ?? 0) - (candLists.get(b)?.length ?? 0));

  function backtrack(depth: number, rMask: number, cMask: number): void {
    if (count >= limit) return;
    if (depth === unplacedIndices.length) {
      for (const clue of clues) {
        if (!evaluateClueOnAssignment(clue, assignment, grid)) return;
      }
      count++;
      if (!firstSolution) firstSolution = { ...assignment };
      return;
    }

    // Dynamic MRV among remaining unplaced people
    let bestPos = depth;
    let bestAvail: Coord[] | null = null;
    for (let i = depth; i < unplacedIndices.length; i++) {
      const pi = unplacedIndices[i];
      const avail = (candLists.get(pi) ?? []).filter(
        (pos) => (rMask & (1 << pos.r)) === 0 && (cMask & (1 << pos.c)) === 0
      );
      if (avail.length === 0) return;
      if (bestAvail === null || avail.length < bestAvail.length) {
        bestAvail = avail;
        bestPos = i;
        if (avail.length === 1) break;
      }
    }

    // Swap chosen variable to `depth`
    if (bestPos !== depth) {
      const tmp = unplacedIndices[depth];
      unplacedIndices[depth] = unplacedIndices[bestPos];
      unplacedIndices[bestPos] = tmp;
    }

    const pi = unplacedIndices[depth];
    const pid = people[pi].id;
    for (const pos of bestAvail!) {
      assignment[pid] = pos;
      backtrack(depth + 1, rMask | (1 << pos.r), cMask | (1 << pos.c));
      if (count >= limit) break;
    }
    delete assignment[pid];

    if (bestPos !== depth) {
      const tmp = unplacedIndices[depth];
      unplacedIndices[depth] = unplacedIndices[bestPos];
      unplacedIndices[bestPos] = tmp;
    }
  }

  backtrack(0, usedRows, usedCols);
  return { count, firstSolution };
}

export interface ClueCheckResult {
  validSoFar: boolean;
  violatedClueIds: string[];
  rowColConflicts: Coord[];
  message: string;
}

/**
 * Checks the player's current partial or complete placements for row/col collisions
 * or clue violations without leaking unplaced answers.
 */
export function checkPlayerPlacements(
  puzzle: Puzzle,
  placements: Record<string, Coord>
): ClueCheckResult {
  const { grid, people, clues, rooms, size } = puzzle;
  const entries = Object.entries(placements);
  const violatedClueIds: string[] = [];
  const rowColConflicts: Coord[] = [];

  // 1. Check row/col duplicates & blocking cells
  const rowMap = new Map<number, Coord[]>();
  const colMap = new Map<number, Coord[]>();
  for (const [pid, pos] of entries) {
    if (grid[pos.r][pos.c].blocking !== null) {
      rowColConflicts.push(pos);
    }
    const rArr = rowMap.get(pos.r) ?? [];
    rArr.push(pos);
    rowMap.set(pos.r, rArr);
    const cArr = colMap.get(pos.c) ?? [];
    cArr.push(pos);
    colMap.set(pos.c, cArr);
    void pid;
  }
  for (const arr of rowMap.values()) {
    if (arr.length > 1) rowColConflicts.push(...arr);
  }
  for (const arr of colMap.values()) {
    if (arr.length > 1) rowColConflicts.push(...arr);
  }

  // 2. Check clues whose relevant people are placed (or room occupancy exceeded)
  const roomPlacedCounts = new Array<number>(rooms.length).fill(0);
  for (const pos of Object.values(placements)) {
    roomPlacedCounts[grid[pos.r][pos.c].roomId]++;
  }

  for (const clue of clues) {
    if (clue.kind === 'room_empty') {
      if (roomPlacedCounts[clue.roomId] > 0) violatedClueIds.push(clue.id);
      continue;
    }
    if (clue.kind === 'room_exact_count') {
      if (roomPlacedCounts[clue.roomId] > clue.count) violatedClueIds.push(clue.id);
      if (entries.length === size && roomPlacedCounts[clue.roomId] !== clue.count) {
        violatedClueIds.push(clue.id);
      }
      continue;
    }
    if (clue.kind === 'victim_alone_with_killer') {
      const vPos = placements[clue.victimId];
      if (vPos) {
        const vRoom = grid[vPos.r][vPos.c].roomId;
        if (roomPlacedCounts[vRoom] > 2) violatedClueIds.push(clue.id);
        if (entries.length === size && roomPlacedCounts[vRoom] !== 2) {
          violatedClueIds.push(clue.id);
        }
      }
      continue;
    }

    if (
      clue.kind === 'in_room' ||
      clue.kind === 'not_in_room' ||
      clue.kind === 'in_either_room' ||
      clue.kind === 'on_object' ||
      clue.kind === 'not_on_object' ||
      clue.kind === 'on_empty_floor' ||
      clue.kind === 'beside_object' ||
      clue.kind === 'not_beside_object' ||
      clue.kind === 'dir_of_object' ||
      clue.kind === 'outer_edge' ||
      clue.kind === 'not_outer_edge'
    ) {
      const pos = placements[clue.personId];
      if (!pos) continue;
      const mask = getUnaryAllowedCellMask(clue, grid);
      if (mask[pos.r * size + pos.c] === 0) violatedClueIds.push(clue.id);
      continue;
    }

    if (clue.kind === 'alone_in_room') {
      const pos = placements[clue.personId];
      if (pos) {
        const rid = grid[pos.r][pos.c].roomId;
        if (rid !== clue.roomId || roomPlacedCounts[clue.roomId] > 1) {
          violatedClueIds.push(clue.id);
        }
      } else if (roomPlacedCounts[clue.roomId] > 0) {
        violatedClueIds.push(clue.id);
      }
      continue;
    }

    if (clue.kind === 'alone_somewhere') {
      const pos = placements[clue.personId];
      if (pos && roomPlacedCounts[grid[pos.r][pos.c].roomId] > 1) {
        violatedClueIds.push(clue.id);
      }
      continue;
    }

    if (clue.kind === 'only_on_object') {
      const pPos = placements[clue.personId];
      if (pPos && grid[pPos.r][pPos.c].occupiable !== clue.objectKind) {
        violatedClueIds.push(clue.id);
      }
      for (const [pid, pos] of entries) {
        if (pid !== clue.personId && grid[pos.r][pos.c].occupiable === clue.objectKind) {
          violatedClueIds.push(clue.id);
        }
      }
      continue;
    }

    if (clue.kind === 'only_beside_object') {
      const pPos = placements[clue.personId];
      if (pPos && !isCellBesideObjectKind(pPos, clue.objectKind, grid)) {
        violatedClueIds.push(clue.id);
      }
      for (const [pid, pos] of entries) {
        if (pid !== clue.personId && isCellBesideObjectKind(pos, clue.objectKind, grid)) {
          violatedClueIds.push(clue.id);
        }
      }
      continue;
    }

    if (
      clue.kind === 'same_room_as' ||
      clue.kind === 'diff_room_from' ||
      clue.kind === 'dir_from_person' ||
      clue.kind === 'diagonal_to_person'
    ) {
      const p1 = placements[clue.personId];
      const p2 = placements[clue.otherId];
      if (!p1 || !p2) continue;
      const room1 = grid[p1.r][p1.c].roomId;
      const room2 = grid[p2.r][p2.c].roomId;
      if (clue.kind === 'same_room_as' && room1 !== room2) violatedClueIds.push(clue.id);
      if (clue.kind === 'diff_room_from' && room1 === room2) violatedClueIds.push(clue.id);
      if (clue.kind === 'dir_from_person' && !isDirFromPerson(p1, p2, clue.dir)) {
        violatedClueIds.push(clue.id);
      }
      if (clue.kind === 'diagonal_to_person' && !isDiagonalSameRoom(p1, p2, grid)) {
        violatedClueIds.push(clue.id);
      }
    }
  }

  const uniqueViolated = Array.from(new Set(violatedClueIds));
  const validSoFar = rowColConflicts.length === 0 && uniqueViolated.length === 0;

  let message = '';
  if (entries.length === 0) {
    message = 'Place suspects on the map first, then tap Check Clues anytime!';
  } else if (validSoFar) {
    message =
      entries.length === people.length
        ? 'Every single clue holds true! Now tap the suspect alone with the victim to accuse them!'
        : `Everything placed so far (${entries.length}/${people.length}) matches all clues cleanly!`;
  } else if (rowColConflicts.length > 0 && uniqueViolated.length === 0) {
    message = 'Watch out: two characters share the same row or column!';
  } else {
    message = `Found ${uniqueViolated.length} clue conflict${uniqueViolated.length > 1 ? 's' : ''} (highlighted in amber).`;
  }

  return {
    validSoFar,
    violatedClueIds: uniqueViolated,
    rowColConflicts,
    message,
  };
}

export interface LiveHint {
  hasConflict: boolean;
  conflictWarning?: string;
  step: DeductionStep | null;
  totalSteps: number;
  stepIndex: number;
  nextPlacementStep: DeductionStep | null;
}

/**
 * Generates the next logical deduction step from the player's current board state.
 */
export function getNextHint(
  puzzle: Puzzle,
  playerPlacements: Record<string, Coord>,
  playerCrossouts?: Set<string>,
  stepOffset = 0
): LiveHint {
  // Check if any placed suspect disagrees with the unique true solution
  const wrongPlacements: string[] = [];
  for (const [pid, pos] of Object.entries(playerPlacements)) {
    const truth = puzzle.solution[pid];
    if (truth && (truth.r !== pos.r || truth.c !== pos.c)) {
      const person = puzzle.people.find((p) => p.id === pid);
      if (person) wrongPlacements.push(person.name);
    }
  }
  if (wrongPlacements.length > 0) {
    return {
      hasConflict: true,
      conflictWarning: `Wait — ${wrongPlacements.join(', ')} ${wrongPlacements.length > 1 ? 'are' : 'is'} placed on a square that leads to a dead end! Try moving or removing ${wrongPlacements.length > 1 ? 'them' : 'them'} first.`,
      step: null,
      totalSteps: 0,
      stepIndex: 0,
      nextPlacementStep: null,
    };
  }

  if (playerCrossouts && playerCrossouts.size > 0) {
    for (const [pid, truth] of Object.entries(puzzle.solution)) {
      if (!playerPlacements[pid] && playerCrossouts.has(`${truth.r},${truth.c}`)) {
        void pid;
      }
    }
  }

  const res = solveDeductively(
    puzzle.grid,
    puzzle.rooms,
    puzzle.people,
    puzzle.victimId,
    puzzle.clues,
    { maxLevel: 3, initialPlacements: playerPlacements }
  );

  if (res.steps.length > 0) {
    const stepIndex = Math.min(Math.max(0, stepOffset), res.steps.length - 1);
    const nextPlacementStep =
      res.steps.slice(stepIndex).find((s) => Boolean(s.placement)) ?? null;
    return {
      hasConflict: false,
      step: res.steps[stepIndex],
      totalSteps: res.steps.length,
      stepIndex,
      nextPlacementStep,
    };
  }

  // If all people are placed, tell player to accuse the killer!
  if (Object.keys(playerPlacements).length === puzzle.people.length) {
    const victim = puzzle.people.find((p) => p.id === puzzle.victimId)!;
    const vPos = puzzle.solution[puzzle.victimId];
    const roomName = puzzle.rooms[puzzle.grid[vPos.r][vPos.c].roomId].name;
    const accuseStep: DeductionStep = {
      level: 1,
      rule: 'Ready to Accuse!',
      involvedClueIds: puzzle.clues
        .filter((c) => c.kind === 'victim_alone_with_killer')
        .map((c) => c.id),
      highlightCells: [vPos, puzzle.solution[puzzle.killerId]],
      nudge: `Everyone is placed! Look inside the ${roomName} with ${victim.name}.`,
      explanation: `Everyone is correctly on the board! Check who shares the ${roomName} alone with ${victim.name} and select them in the Accuse panel.`,
    };
    return {
      hasConflict: false,
      step: accuseStep,
      totalSteps: 1,
      stepIndex: 0,
      nextPlacementStep: null,
    };
  }

  return {
    hasConflict: false,
    step: null,
    totalSteps: 0,
    stepIndex: 0,
    nextPlacementStep: null,
  };
}

export function isWalkableCell(cell: Cell): boolean {
  return cell.blocking === null;
}

export function getObjectKindsOnMap(grid: Cell[][]): Set<string> {
  const set = new Set<string>();
  for (const row of grid) {
    for (const cell of row) {
      if (cell.occupiable) set.add(cell.occupiable);
      if (cell.blocking) set.add(cell.blocking);
    }
  }
  return set;
}

export { cellHasObject };
