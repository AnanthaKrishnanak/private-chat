import { customAlphabet } from "nanoid";

const CHARACTERS = [
  "Neo",
  "Trinity",
  "Morpheus",
  "JohnWick",
  "EllenRipley",
  "SarahConnor",
  "TheTerminator",
  "Yoda",
  "DarthVader",
  "LukeSkywalker",
  "Frodo",
  "Gandalf",
  "Aragorn",
  "Hermione",
  "Voldemort",
  "TonyStark",
  "BlackWidow",
  "Thor",
  "LaraCroft",
  "JamesBond",
];

const hex = customAlphabet("0123456789abcdef", 12);

export function generateUserName(): string {
  const character = CHARACTERS[Math.floor(Math.random() * CHARACTERS.length)];

  const randomHash = hex();

  return `anonymous-${character}-${randomHash}`;
}
