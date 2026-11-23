import { selectCluesForPuzzle } from './clueGenerator';
import { generateFloorPlan, sampleGroundTruth, scatterObjects } from './mapGenerator';
import { createSeedCode, SeededRNG } from './rng';
import { buildPeopleRoster, pickTheme } from './themes';
import { DIFFICULTY_CONFIG, type Clue, type Difficulty, type Person, type Puzzle } from './types';

function scoreDifficultyFit(
  difficulty: Difficulty,
  res: { maxLevel: number; stepCount: number; initialSingles: number; victimDepth: number },
  clues: Clue[]
): { score: number; ideal: boolean } {
  const inRoomCnt = clues.filter(
    (c) => c.kind === 'in_room' || c.kind === 'alone_in_room'
  ).length;
  const relCnt = clues.filter(
    (c) =>
      c.kind === 'same_room_as' ||
      c.kind === 'diff_room_from' ||
      c.kind === 'dir_from_person' ||
      c.kind === 'diagonal_to_person'
  ).length;

  switch (difficulty) {
    case 'starter': {
      const ideal = res.maxLevel === 1 && res.initialSingles >= 1;
      const score =
        (res.maxLevel === 1 ? 50 : 10) +
        (res.initialSingles >= 1 && res.initialSingles <= 3 ? 25 : 5);
      return { score, ideal };
    }
    case 'easy': {
      const ideal = res.maxLevel <= 2 && res.initialSingles >= 1 && res.initialSingles <= 2;
      const score =
        (res.maxLevel === 2 ? 35 : 25) +
        (res.initialSingles >= 1 && res.initialSingles <= 2 ? 25 : 5) +
        Math.min(10, relCnt * 4);
      return { score, ideal };
    }
    case 'medium': {
      const ideal = res.maxLevel >= 2 && res.initialSingles <= 1 && res.stepCount >= 5;
      const score =
        (res.maxLevel >= 2 ? 40 : 0) +
        (res.initialSingles <= 1 ? 25 : 0) +
        Math.min(20, relCnt * 6) +
        Math.min(15, res.stepCount * 2);
      return { score, ideal };
    }
    case 'hard': {
      const ideal =
        res.maxLevel >= 2 && res.initialSingles === 0 && res.stepCount >= 7 && relCnt >= 2;
      const score =
        (res.maxLevel === 3 ? 45 : res.maxLevel === 2 ? 28 : 0) +
        (res.initialSingles === 0 ? 35 : -20 * res.initialSingles) +
        Math.min(20, relCnt * 5) +
        (inRoomCnt <= 1 ? 10 : 0);
      return { score, ideal };
    }
    case 'expert': {
      const ideal =
        res.maxLevel === 3 &&
        res.initialSingles === 0 &&
        inRoomCnt <= 1 &&
        res.stepCount >= 8 &&
        relCnt >= 2;
      const score =
        (res.maxLevel === 3 ? 50 : res.maxLevel === 2 ? 20 : 0) +
        (res.initialSingles === 0 ? 40 : -25 * res.initialSingles) +
        (inRoomCnt <= 1 ? 15 : -10) +
        Math.min(20, relCnt * 5) +
        Math.min(15, res.stepCount);
      return { score, ideal };
    }
  }
}

/**
 * Generates a complete, uniquely solvable Murdoku puzzle deterministically from seed & difficulty.
 */
export function generatePuzzle(
  difficulty: Difficulty,
  seed?: string,
  themeId?: string
): Puzzle {
  const actualSeed = seed && seed.trim().length > 0 ? seed.trim().toUpperCase() : createSeedCode();
  const rootRng = new SeededRNG(`${actualSeed}::${difficulty}::${themeId ?? 'random'}`);
  const size = DIFFICULTY_CONFIG[difficulty].size;
  const theme = pickTheme(themeId, rootRng);

  // Build consistent cast & paired story for this seed
  const castSeed = `${actualSeed}::CAST`;
  const castRng = new SeededRNG(castSeed);
  const { people, victimId } = buildPeopleRoster(size, castRng);
  const story = theme.stories[castRng.int(0, theme.stories.length - 1)];
  const title = story.title;
  const premise = story.premise;
  const stolenItem = story.stolenItem;

  let bestPuzzle: Puzzle | null = null;
  let bestScore = -Infinity;

  const maxAttempts = difficulty === 'starter' ? 12 : difficulty === 'easy' ? 14 : 16;

  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    const attemptRng = new SeededRNG(`${actualSeed}::${difficulty}::${theme.id}::${attempt}`);
    const { rooms, grid } = generateFloorPlan(size, difficulty, theme, attemptRng);
    const truth = sampleGroundTruth(size, rooms, grid, people, victimId, attemptRng);
    if (!truth) continue;

    scatterObjects(grid, rooms, truth.solution, theme, difficulty, attemptRng);

    const clueRes = selectCluesForPuzzle(
      grid,
      rooms,
      people,
      victimId,
      truth.killerId,
      truth.solution,
      difficulty,
      attemptRng,
      false
    );
    if (!clueRes) continue;

    const { score, ideal } = scoreDifficultyFit(difficulty, clueRes, clueRes.clues);

    // Order clues cleanly: Case Notes first, then suspects A..H, then Victim V
    const orderedClues = orderCluesForDisplay(clueRes.clues, people);

    const candidatePuzzle: Puzzle = {
      seed: actualSeed,
      difficulty,
      size,
      themeId: theme.id,
      title,
      premise,
      stolenItem,
      rooms,
      grid,
      people,
      victimId,
      killerId: truth.killerId,
      clues: orderedClues,
      solution: truth.solution,
      metrics: {
        maxLevel: clueRes.maxLevel,
        stepCount: clueRes.stepCount,
        initialSingles: clueRes.initialSingles,
        victimDepth: clueRes.victimDepth,
      },
    };

    if (ideal) {
      return candidatePuzzle;
    }

    if (score > bestScore) {
      bestScore = score;
      bestPuzzle = candidatePuzzle;
    }
  }

  if (bestPuzzle) return bestPuzzle;

  // Safe deterministic fallback keeping the requested size & room density, with relaxed clue constraints
  for (let attempt = 0; attempt < 25; attempt++) {
    const attemptRng = new SeededRNG(`${actualSeed}::FALLBACK::${attempt}`);
    const { rooms, grid } = generateFloorPlan(size, difficulty, theme, attemptRng);
    const truth = sampleGroundTruth(size, rooms, grid, people, victimId, attemptRng);
    if (!truth) continue;
    scatterObjects(grid, rooms, truth.solution, theme, difficulty, attemptRng);
    const clueRes = selectCluesForPuzzle(
      grid,
      rooms,
      people,
      victimId,
      truth.killerId,
      truth.solution,
      difficulty,
      attemptRng,
      true
    );
    if (clueRes) {
      return {
        seed: actualSeed,
        difficulty,
        size,
        themeId: theme.id,
        title,
        premise,
        stolenItem,
        rooms,
        grid,
        people,
        victimId,
        killerId: truth.killerId,
        clues: orderCluesForDisplay(clueRes.clues, people),
        solution: truth.solution,
        metrics: {
          maxLevel: clueRes.maxLevel,
          stepCount: clueRes.stepCount,
          initialSingles: clueRes.initialSingles,
          victimDepth: clueRes.victimDepth,
        },
      };
    }
  }

  throw new Error(`Failed to generate valid puzzle for seed ${actualSeed}`);
}

function orderCluesForDisplay(clues: Clue[], people: Person[]): Clue[] {
  const order = new Map<string, number>();
  order.set('case', -1);
  people.forEach((p, idx) => order.set(p.id, idx));
  return clues.slice().sort((a, b) => {
    const oa = order.get(a.ownerId) ?? 99;
    const ob = order.get(b.ownerId) ?? 99;
    if (oa !== ob) return oa - ob;
    return a.id.localeCompare(b.id);
  });
}
