// linkify.ts
type MatchType = "url" | "email";

interface MatchResult {
  start: number;
  end: number;
  type: MatchType;
  text: string;
}

const URL_SCHEMES = ["http://", "https://", "ftp://", "ftps://", "mailto:"];

const DOMAIN_REGEX = /(?:[\p{L}\p{N}\-]+\.)+[\p{L}]{2,}/u; // Unicode domain
const EMAIL_REGEX = /[\p{L}\p{N}\.\-_]+@(?:[\p{L}\p{N}\-]+\.)+[\p{L}]{2,}/u; // Unicode email

const PATH_QUERY_FRAGMENT_CHARS = new Set(["/", "?", "#"]);

const HARD_TERMINATORS = new Set([
  " ", "\n", "\t", "\r",
  ...["\u200E", "\u200F", "\u202A", "\u202B", "\u202C", "\u202D", "\u202E"] // common formatting characters
]);

const SOFT_TERMINATORS = new Set([
  ".", ",", ":", ";", "?", "!", "'", "\"", "«", "»", "‘", "’", "“", "”", "‚", "„", "‹", "›"
]);

const OPENING = new Map([
  [")", "("],
  ["]", "["],
  ["}", "{"],
]);

function isHardTerminator(ch: string) {
  return HARD_TERMINATORS.has(ch);
}

function isSoftTerminator(ch: string) {
  return SOFT_TERMINATORS.has(ch);
}

function linkifyText(text: string): MatchResult[] {
  const matches: MatchResult[] = [];
  const n = text.length;
  let i = 0;

  while (i < n) {
    

    // Check for Email
    const emailMatch = text.slice(i).match(EMAIL_REGEX);
    if (emailMatch?.index === 0) {
      const email = emailMatch[0];
      matches.push({ start: i, end: i + email.length, type: "email", text: email });
      i += email.length;
      continue;
    }

    // Check for Domain/URL
    let foundScheme = "";
    for (const scheme of URL_SCHEMES) {
      if (text.startsWith(scheme, i)) {
        foundScheme = scheme;
        break;
      }
    }

    let domainMatch: RegExpMatchArray | null = null;
    let domainOffset = 0;
    if (foundScheme) {
      domainOffset = foundScheme.length;
      domainMatch = text.slice(i + domainOffset).match(DOMAIN_REGEX);
    } else {
      domainMatch = text.slice(i).match(DOMAIN_REGEX);
    }

    if (domainMatch?.index === 0) {
      const domain = domainMatch[0];
      let end = i + domainOffset + domain.length;
      let openStack: string[] = [];
      let lastSafe = end;

      // Handle Path/Query/Fragment carefully
      for (let j = end; j < n; j++) {
        const ch = text[j];

        if (isHardTerminator(ch)) break;

        if (PATH_QUERY_FRAGMENT_CHARS.has(ch)) {
          lastSafe = j + 1;
          continue;
        }

        if (isSoftTerminator(ch)) {
          if (j + 1 === n || isHardTerminator(text[j + 1]) || isSoftTerminator(text[j + 1])) {
            break;
          } else {
            lastSafe = j + 1;
            continue;
          }
        }

        if (OPENING.has(ch)) {
          const expectedOpen = OPENING.get(ch)!;
          if (openStack.length && openStack[openStack.length - 1] === expectedOpen) {
            openStack.pop();
            lastSafe = j + 1;
          } else {
            break;
          }
        } else if ([...OPENING.values()].includes(ch)) {
          openStack.push(ch);
          lastSafe = j + 1;
        } else {
          lastSafe = j + 1;
        }
      }

      const fullLink = text.slice(i, lastSafe);

      matches.push({
        start: i,
        end: lastSafe,
        type: "url",
        text: foundScheme ? fullLink : "http://" + fullLink, // auto-add http if missing
      });

      i = lastSafe;
      continue;
    }

    // Otherwise move forward
    i++;
  }

  return matches;
}

export { linkifyText };    export type { MatchResult };

