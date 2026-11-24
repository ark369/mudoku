import type { Coord, Difficulty } from '../engine/types';

export type PlayMode = 'pure' | 'assisted';

export interface AppSettings {
  playMode: PlayMode;
  autoGuides: boolean;
  clueHighlights: boolean;
  autoPruneNotes: boolean;
  soundEnabled: boolean;
  printIncludeKey: boolean;
}

export interface CuratedSolveRecord {
  bestTime?: number;
  hintsUsed: number;
}

export interface SolvedStats {
  totalSolved: number;
  byDifficulty: Record<Difficulty, number>;
  bestTimes?: Partial<Record<Difficulty, number>>;
  solvedCurated: Record<string, CuratedSolveRecord>;
}

export interface SavedBoardState {
  seed: string;
  difficulty: Difficulty;
  themeId: string;
  curatedId?: string;
  placements: Record<string, Coord>;
  crossouts: string[];
  notes: Record<string, string[]>;
  checkedOwners: string[];
  elapsedSeconds?: number;
  hintsUsed: number;
  solved: boolean;
}

const SETTINGS_KEY = 'murdoku_studio_settings_v1';
const STATS_KEY = 'murdoku_studio_stats_v1';
const BOARD_KEY = 'murdoku_studio_active_board_v1';

export const DEFAULT_SETTINGS: AppSettings = {
  playMode: 'pure',
  autoGuides: true,
  clueHighlights: true,
  autoPruneNotes: true,
  soundEnabled: true,
  printIncludeKey: true,
};

export const DEFAULT_STATS: SolvedStats = {
  totalSolved: 0,
  byDifficulty: {
    starter: 0,
    easy: 0,
    medium: 0,
    hard: 0,
    expert: 0,
  },
  solvedCurated: {},
};

export function loadSettings(): AppSettings {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (!raw) return DEFAULT_SETTINGS;
    return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export function saveSettings(settings: AppSettings): void {
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  } catch {
    // ignore storage quota errors
  }
}

export function loadStats(): SolvedStats {
  try {
    const raw = localStorage.getItem(STATS_KEY);
    if (!raw) return DEFAULT_STATS;
    const parsed = JSON.parse(raw);
    return {
      totalSolved: parsed.totalSolved ?? 0,
      byDifficulty: { ...DEFAULT_STATS.byDifficulty, ...(parsed.byDifficulty ?? {}) },
      solvedCurated: parsed.solvedCurated ?? {},
    };
  } catch {
    return DEFAULT_STATS;
  }
}

export function recordSolve(
  difficulty: Difficulty,
  curatedId?: string,
  hintsUsed = 0
): SolvedStats {
  const cur = loadStats();
  const nextCurated = { ...(cur.solvedCurated ?? {}) };
  if (curatedId) {
    const prevRec = nextCurated[curatedId];
    nextCurated[curatedId] = {
      hintsUsed: prevRec ? Math.min(prevRec.hintsUsed, hintsUsed) : hintsUsed,
    };
  }
  const next: SolvedStats = {
    totalSolved: cur.totalSolved + 1,
    byDifficulty: {
      ...cur.byDifficulty,
      [difficulty]: (cur.byDifficulty[difficulty] ?? 0) + 1,
    },
    solvedCurated: nextCurated,
  };
  try {
    localStorage.setItem(STATS_KEY, JSON.stringify(next));
  } catch {
    // ignore
  }
  return next;
}

export function loadSavedBoard(): SavedBoardState | null {
  try {
    const raw = localStorage.getItem(BOARD_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as SavedBoardState;
  } catch {
    return null;
  }
}

export function saveBoardState(state: SavedBoardState): void {
  try {
    localStorage.setItem(BOARD_KEY, JSON.stringify(state));
  } catch {
    // ignore
  }
}
