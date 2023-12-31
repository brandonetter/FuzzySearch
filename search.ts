function levenshteinDistance(a: string, b: string): number {
    const m = a.length;
    const n = b.length;

    const dp: number[][] = [];
    for (let i = 0; i <= m; i++) {
      dp[i] = [i];
    }
    for (let j = 0; j <= n; j++) {
      dp[0][j] = j;
    }

    for (let i = 1; i <= m; i++) {
      for (let j = 1; j <= n; j++) {
        const cost = a[i - 1] === b[j - 1] ? 0 : 1;
        dp[i][j] = Math.min(
          dp[i - 1][j] + 1,
          dp[i][j - 1] + 1,
          dp[i - 1][j - 1] + cost
        );
      }
    }

    return dp[m][n];
  }

  function jaroWinklerDistance(a: string, b: string): number {
    const m = a.length;
    const n = b.length;

    const threshold = Math.floor(Math.max(m, n) / 2) - 1;

    const matchesA: boolean[] = Array(m).fill(false);
    const matchesB: boolean[] = Array(n).fill(false);

    let matches = 0;
    let transpositions = 0;

    for (let i = 0; i < m; i++) {
      const start = Math.max(0, i - threshold);
      const end = Math.min(i + threshold + 1, n);

      for (let j = start; j < end; j++) {
        if (b[j] === a[i] && !matchesB[j]) {
          matchesA[i] = true;
          matchesB[j] = true;
          matches++;
          break;
        }
      }
    }

    if (matches === 0) {
      return 0;
    }

    let k = 0;
    for (let i = 0; i < m; i++) {
      if (matchesA[i]) {
        while (!matchesB[k]) {
          k++;
        }
        if (a[i] !== b[k]) {
          transpositions++;
        }
        k++;
      }
    }

    const jaroDistance = (matches / m + matches / n + (matches - transpositions / 2) / matches) / 3;

    const p = 0.1;
    const jaroWinklerDistance = jaroDistance + Math.min(0.1, 1 / m) * p * (1 - jaroDistance);

    return jaroWinklerDistance;
  }

  function searchWords(input: string, words: string[], threshold: number, type: 'levenshtein' | 'jaro-winkler' = 'levenshtein'): string[] {
    const matches: string[] = [];

    input = input.toLowerCase();
    for (let i = 0; i < words.length; i++) {
      const word = words[i].toLowerCase();
      let distance: number;
      if (type === 'jaro-winkler') {
        distance = jaroWinklerDistance(input, word);
      } else {
        distance = levenshteinDistance(input, word);
      }
      if (input.length >= 1 && word.startsWith(input)) {
        matches.push(words[i]);
      } else if (type === 'levenshtein' && distance <= threshold) {
        matches.push(words[i]);
      } else if (type === 'jaro-winkler' && distance >= threshold) {
        matches.push(words[i]);
      }
    }

    return matches;
  }

  function searchWordsOrdered(input: string, words: string[], threshold: number): string[] {
    const matches: [string, number][] = [];
    const normalizedInput = input.toLowerCase();

    for (const word of words) {
      const normalizedWord = word.toLowerCase();
      const distance = jaroWinklerDistance(normalizedInput, normalizedWord);

      if (normalizedWord.startsWith(normalizedInput) || distance >= threshold) {
        matches.push([word, distance]);
      }
    }

    matches.sort((a, b) => b[1] - a[1]);

    return matches.map((match) => match[0]);
  }

export { searchWords, searchWordsOrdered };
