const TURKISH_CHAR_MAP: Record<string, string> = {
  '\u00e7': 'c',
  '\u011f': 'g',
  '\u0131': 'i',
  '\u00f6': 'o',
  '\u015f': 's',
  '\u00fc': 'u',
};

const stripDiacritics = (value: string) =>
  value.normalize('NFD').replace(/[\u0300-\u036f]/g, '');

export const slugify = (value: string) => {
  const lowered = value
    .trim()
    .toLocaleLowerCase('tr-TR')
    .replace(/[\u00e7\u011f\u0131\u00f6\u015f\u00fc]/g, (char) => TURKISH_CHAR_MAP[char] ?? char);

  return stripDiacritics(lowered)
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .replace(/-{2,}/g, '-');
};

export const createUniqueSlugger = () => {
  const used = new Set<string>();
  const counters = new Map<string, number>();

  return (base: string) => {
    const safeBase = base || 'item';

    if (!used.has(safeBase)) {
      used.add(safeBase);
      counters.set(safeBase, 1);
      return safeBase;
    }

    let index = counters.get(safeBase) ?? 1;
    let candidate = `${safeBase}-${index}`;

    while (used.has(candidate)) {
      index += 1;
      candidate = `${safeBase}-${index}`;
    }

    used.add(candidate);
    counters.set(safeBase, index + 1);
    return candidate;
  };
};
