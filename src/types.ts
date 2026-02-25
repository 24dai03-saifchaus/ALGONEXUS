import { Type } from "@google/genai";

export enum AlgorithmCategory {
  SORTING = "Sorting",
  SEARCHING = "Searching",
}

export enum AlgorithmType {
  BUBBLE_SORT = "Bubble Sort",
  SELECTION_SORT = "Selection Sort",
  INSERTION_SORT = "Insertion Sort",
  MERGE_SORT = "Merge Sort",
  QUICK_SORT = "Quick Sort",
  LINEAR_SEARCH = "Linear Search",
  BINARY_SEARCH = "Binary Search",
}

export interface AlgorithmInfo {
  id: AlgorithmType;
  category: AlgorithmCategory;
  name: string;
  description: string;
  timeComplexity: string;
  spaceComplexity: string;
}

export interface Step {
  array: number[];
  highlights: number[]; // Indices to highlight (e.g., being compared)
  swaps: number[]; // Indices being swapped
  found?: number; // Index found (for searching)
  line: number; // Line number in code to highlight
  description: string;
}

export type Language = "cpp" | "java" | "python";

export interface CodeSnippets {
  cpp: string;
  java: string;
  python: string;
}
