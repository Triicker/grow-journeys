import type { AssessmentQuestion } from "./types";

// Conteúdo separado da interface para facilitar revisão pedagógica e futuras versões.
export const ASSESSMENT_QUESTIONS: AssessmentQuestion[] = [
  {
    id: "vocab-a1",
    category: "vocabulary",
    prompt: 'Choose the best word: "I drink ___ every morning."',
    options: [
      { id: "a", label: "coffee" },
      { id: "b", label: "chair" },
      { id: "c", label: "window" },
      { id: "d", label: "shoe" },
    ],
    correctOptionId: "a",
    weight: 1,
  },
  {
    id: "grammar-a1",
    category: "grammar",
    prompt: 'Complete: "She ___ from Brazil."',
    options: [
      { id: "a", label: "am" },
      { id: "b", label: "is" },
      { id: "c", label: "are" },
      { id: "d", label: "be" },
    ],
    correctOptionId: "b",
    weight: 1,
  },
  {
    id: "vocab-a2",
    category: "vocabulary",
    prompt: 'What does "crowded" mean in "The bus was crowded"?',
    options: [
      { id: "a", label: "Late" },
      { id: "b", label: "Full of people" },
      { id: "c", label: "Very clean" },
      { id: "d", label: "Expensive" },
    ],
    correctOptionId: "b",
    weight: 2,
  },
  {
    id: "grammar-a2",
    category: "grammar",
    prompt: "Choose the correct sentence about yesterday.",
    options: [
      { id: "a", label: "I go to the office." },
      { id: "b", label: "I have go to the office." },
      { id: "c", label: "I went to the office." },
      { id: "d", label: "I going to the office." },
    ],
    correctOptionId: "c",
    weight: 2,
  },
  {
    id: "reading-b1",
    category: "reading",
    prompt:
      'Read: "Mia missed the train, so she called her manager to explain she would be late." Why did Mia call?',
    options: [
      { id: "a", label: "To buy a ticket" },
      { id: "b", label: "To explain a delay" },
      { id: "c", label: "To cancel the train" },
      { id: "d", label: "To invite her manager" },
    ],
    correctOptionId: "b",
    weight: 3,
  },
  {
    id: "grammar-b1",
    category: "grammar",
    prompt: 'Complete: "If it rains tomorrow, we ___ at home."',
    options: [
      { id: "a", label: "stayed" },
      { id: "b", label: "stay" },
      { id: "c", label: "will stay" },
      { id: "d", label: "would stayed" },
    ],
    correctOptionId: "c",
    weight: 3,
  },
  {
    id: "context-b2",
    category: "context",
    prompt: 'A colleague says, "I might be able to move the deadline." What do they mean?',
    options: [
      { id: "a", label: "The deadline has definitely changed." },
      { id: "b", label: "Changing it is impossible." },
      { id: "c", label: "There is a possibility of changing it." },
      { id: "d", label: "They forgot the deadline." },
    ],
    correctOptionId: "c",
    weight: 4,
  },
  {
    id: "grammar-b2",
    category: "grammar",
    prompt: 'Complete: "By the time we arrived, the presentation ___."',
    options: [
      { id: "a", label: "already started" },
      { id: "b", label: "has already started" },
      { id: "c", label: "had already started" },
      { id: "d", label: "was already start" },
    ],
    correctOptionId: "c",
    weight: 4,
  },
  {
    id: "reading-c1",
    category: "reading",
    prompt:
      'Read: "The proposal is not without merit; nevertheless, its assumptions warrant closer scrutiny." What is the writer saying?',
    options: [
      { id: "a", label: "The proposal is perfect." },
      { id: "b", label: "The proposal has value, but should be examined carefully." },
      { id: "c", label: "The proposal has no value." },
      { id: "d", label: "The assumptions are irrelevant." },
    ],
    correctOptionId: "b",
    weight: 5,
  },
  {
    id: "context-c1",
    category: "context",
    prompt: 'Choose the most natural formal alternative to "We need to look into this problem."',
    options: [
      { id: "a", label: "We need to investigate this issue." },
      { id: "b", label: "We need to see at this trouble." },
      { id: "c", label: "We need looking this problem." },
      { id: "d", label: "We must watch into it." },
    ],
    correctOptionId: "a",
    weight: 5,
  },
];
