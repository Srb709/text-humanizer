export type RewriteMode = "casual" | "professional" | "shorter";

const roboticReplacements: Array<[RegExp, string]> = [
  [/\butilize\b/gi, "use"],
  [/\bin order to\b/gi, "to"],
  [/\bdue to the fact that\b/gi, "because"],
  [/\bendeavor to\b/gi, "try to"],
  [/\bsynergy\b/gi, "teamwork"],
  [/\bcommence\b/gi, "start"],
  [/\bterminate\b/gi, "end"],
  [/\btherefore\b/gi, "so"],
  [/\bhowever\b/gi, "but"],
  [/\badditionally\b/gi, "also"],
  [/\bplease be advised that\b/gi, "note that"],
  [/\bit is important to note that\b/gi, "note"],
  [/\bwith regard to\b/gi, "about"],
];

const casualReplacements: Array<[RegExp, string]> = [
  [/\bdo not\b/gi, "don't"],
  [/\bcannot\b/gi, "can't"],
  [/\bi am\b/gi, "I'm"],
  [/\bwe are\b/gi, "we're"],
  [/\byou are\b/gi, "you're"],
  [/\bthat is\b/gi, "that's"],
  [/\bit is\b/gi, "it's"],
];

const professionalReplacements: Array<[RegExp, string]> = [
  [/\bkind of\b/gi, "somewhat"],
  [/\ba lot of\b/gi, "many"],
  [/\bget\b/gi, "obtain"],
  [/\bfix\b/gi, "resolve"],
  [/\bhelp\b/gi, "assist"],
  [/\bshow\b/gi, "demonstrate"],
];

const shorterReplacements: Array<[RegExp, string]> = [
  [/\bin the event that\b/gi, "if"],
  [/\bat this point in time\b/gi, "now"],
  [/\bfor the purpose of\b/gi, "for"],
  [/\bwith the intention of\b/gi, "to"],
  [/\bI would like to\b/gi, "I want to"],
];

function tightenSentences(text: string): string {
  return text
    .replace(/\s{2,}/g, " ")
    .replace(/\s+,/g, ",")
    .replace(/\s+\./g, ".")
    .replace(/\s+!/g, "!")
    .replace(/\s+\?/g, "?")
    .replace(/,\s*(and|but|so)\s*,/gi, ", $1 ")
    .replace(/\bvery\s+/gi, "")
    .replace(/\breally\s+/gi, "")
    .trim();
}

function splitLongSentences(text: string): string {
  return text
    .split(/(?<=[.!?])\s+/)
    .map((sentence) => {
      if (sentence.length <= 140) return sentence;
      return sentence.replace(/,\s+/g, ". ");
    })
    .join(" ");
}

function applyRules(input: string, rules: Array<[RegExp, string]>): string {
  return rules.reduce((output, [pattern, replacement]) => output.replace(pattern, replacement), input);
}

export function humanizeText(input: string, mode: RewriteMode): string {
  const cleanInput = input.trim();
  if (!cleanInput) return "";

  let output = applyRules(cleanInput, roboticReplacements);

  if (mode === "casual") output = applyRules(output, casualReplacements);
  if (mode === "professional") output = applyRules(output, professionalReplacements);
  if (mode === "shorter") output = applyRules(output, shorterReplacements);

  output = splitLongSentences(output);
  output = tightenSentences(output);

  return output.charAt(0).toUpperCase() + output.slice(1);
}
