/**
 * Deterministic PRNG based on FNV-1a 32-bit string hashing + Mulberry32.
 */
export function fnv1a32(str: string): number {
  let hash = 0x811c9dc5;
  for (let i = 0; i < str.length; i++) {
    hash ^= str.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193);
  }
  return hash >>> 0;
}

export class SeededRNG {
  private state: number;

  constructor(seed: string | number) {
    const raw = typeof seed === 'number' ? seed >>> 0 : fnv1a32(seed);
    this.state = raw === 0 ? 0x9e3779b9 : raw;
  }

  /** Returns float in [0, 1). */
  next(): number {
    let t = (this.state += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  }

  /** Returns integer in [min, max] inclusive. */
  int(min: number, max: number): number {
    if (max <= min) return min;
    return min + Math.floor(this.next() * (max - min + 1));
  }

  /** Returns true with probability p. */
  chance(p: number): boolean {
    return this.next() < p;
  }

  /** Picks one random element from non-empty array. */
  pick<T>(arr: readonly T[]): T {
    if (arr.length === 0) {
      throw new Error('SeededRNG.pick called on empty array');
    }
    return arr[Math.floor(this.next() * arr.length)];
  }

  /** Returns a new Fisher-Yates shuffled copy of the array. */
  shuffle<T>(arr: readonly T[]): T[] {
    const copy = arr.slice();
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(this.next() * (i + 1));
      const tmp = copy[i];
      copy[i] = copy[j];
      copy[j] = tmp;
    }
    return copy;
  }
}

export function createSeedCode(prefix = 'CASE'): string {
  const clean = prefix.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 8) || 'CASE';
  const digits = Math.floor(1000 + Math.random() * 9000);
  return `${clean}-${digits}`;
}

export function getDailySeed(difficulty: string, date = new Date()): string {
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  return `DAILY-${yyyy}${mm}${dd}-${difficulty.toUpperCase()}`;
}
