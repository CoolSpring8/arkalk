/**
 * Generates combinations of a given set of elements.
 *
 * Inspired by https://lowrey.me/es6-javascript-combination-generator/
 */
export function* combinations<T>(arr: T[], length: number): Generator<T[], void, undefined> {
  for (let i = 0; i < arr.length; i++) {
    if (length === 1) {
      yield [arr[i]]
      continue
    }
    for (const v of combinations(arr.slice(i + 1), length - 1))
      yield [arr[i], ...v]
  }
}

/**
 * Returns all possible combinations of a given set of elements.
 *
 * The orders of tags in a combination is deterministic (sorted).
 */
export function combinationsAll<T>(arr: T[]): T[][] {
  return arr.flatMap(
    (_v, i, a) => [...combinations(a, i + 1)].map(combination => combination.sort()),
  )
}
