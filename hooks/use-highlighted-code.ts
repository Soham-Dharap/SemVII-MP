import * as React from "react";

import { loadHighlighter } from "@/lib/highlighter";

type Highlighter = Awaited<ReturnType<typeof loadHighlighter>>;

/**
 * Returns one React node per source line, syntax-highlighted with Shiki.
 *
 * Design notes:
 * - Highlighting runs on a deferred copy of the code so the textarea never
 *   waits for tokenization — typing stays perfectly responsive.
 * - The highlighter is loaded once per language asynchronously; until it is
 *   ready we render plain text lines, which keeps the overlay aligned.
 * - Every tokenization call is guarded: a grammar failure falls back to
 *   plain text instead of throwing into the React tree.
 * - The returned array ALWAYS has the same number of entries as the
 *   textarea has rendered lines, so the highlight layer can never drift
 *   vertically from the caret ("typing on one line, edit on another").
 */
export function useHighlightedCode(value: string, language: string) {
  const code = value.endsWith("\n") ? value.slice(0, -1) : value;
  const deferredCode = React.useDeferredValue(code);

  const [highlighter, setHighlighter] = React.useState<Highlighter>(null);

  React.useEffect(() => {
    let cancelled = false;
    loadHighlighter(language)
      .then((next) => {
        if (!cancelled) setHighlighter(next);
      })
      .catch(() => {
        if (!cancelled) setHighlighter(null);
      });
    return () => {
      cancelled = true;
    };
  }, [language]);

  const plainLines = React.useMemo(
    () => deferredCode.split("\n"),
    [deferredCode],
  );

  const highlightedLines = React.useMemo(() => {
    if (!highlighter) return null;
    try {
      return highlighter.highlight(deferredCode).lines;
    } catch {
      return null;
    }
  }, [highlighter, deferredCode]);

  return React.useMemo(() => {
    if (!highlightedLines) return plainLines;
    // Never let the token layer disagree with the textarea on line count.
    if (highlightedLines.length === plainLines.length) {
      return highlightedLines;
    }
    return plainLines;
  }, [highlightedLines, plainLines]);
}
