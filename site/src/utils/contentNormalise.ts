/**
 * Normalises report markdown content before rendering:
 * 1. Replaces all em dashes (— U+2014) and en dashes (– U+2013) with spaced hyphens ( - )
 * 2. Ensures job field lines (**Field:** value) are separated by blank lines so each
 *    renders as its own paragraph rather than collapsing into a single inline block.
 */

const EM_DASH = /\u2014/g;
const EN_DASH = /\u2013/g;

/**
 * Replace em dashes and en dashes with spaced hyphens.
 */
function replaceEmDashes(text: string): string {
  return text.replace(EM_DASH, ' - ').replace(EN_DASH, ' - ');
}

/**
 * The job markdown files use consecutive lines like:
 *   **Company:** Foo
 *   **Location:** Bar
 *   **Day Rate:** £400/day
 *
 * Markdown treats single-newline-separated lines as one paragraph, so all fields
 * collapse into one inline run. This function ensures each **Field:** line is
 * preceded by a blank line so ReactMarkdown renders each as a separate <p>.
 *
 * Pattern: a line that starts with optional whitespace then **SomeLabel:** (bold colon)
 */
function ensureJobFieldsOnSeparateLines(text: string): string {
  const lines = text.split('\n');
  const result: string[] = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();

    // Detect a job field line: starts with **SomeLabel:**
    const isJobField = /^\*\*[A-Za-z][^*\n]*:\*\*/.test(trimmed);

    if (isJobField) {
      // If previous line was non-empty and not already a blank line, insert blank
      if (i > 0 && result[result.length - 1]?.trim() !== '') {
        result.push('');
      }
      result.push(line);
      // If next line is also a job field, we'll handle it next iteration
      // If next line is non-empty non-field content (continuation), leave it
    } else {
      result.push(line);
    }
  }

  return result.join('\n');
}

/**
 * Normalise content for safe rendering:
 * - Em/en dash replacement
 * - Job field line separation
 */
export function normaliseContent(content: string): string {
  let out = replaceEmDashes(content);
  out = ensureJobFieldsOnSeparateLines(out);
  return out;
}


