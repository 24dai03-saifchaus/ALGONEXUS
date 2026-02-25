import { AlgorithmType, AlgorithmCategory, AlgorithmInfo, CodeSnippets } from "./types";

export const ALGORITHMS: AlgorithmInfo[] = [
  {
    id: AlgorithmType.BUBBLE_SORT,
    category: AlgorithmCategory.SORTING,
    name: "Bubble Sort",
    description: "A simple sorting algorithm that repeatedly steps through the list, compares adjacent elements and swaps them if they are in the wrong order.",
    timeComplexity: "O(n²)",
    spaceComplexity: "O(1)",
  },
  {
    id: AlgorithmType.BINARY_SEARCH,
    category: AlgorithmCategory.SEARCHING,
    name: "Binary Search",
    description: "A fast search algorithm with run-time complexity of O(log n). This search algorithm works on the principle of divide and conquer.",
    timeComplexity: "O(log n)",
    spaceComplexity: "O(1)",
  },
];

export const CODE_SNIPPETS: Record<AlgorithmType, CodeSnippets> = {
  [AlgorithmType.BUBBLE_SORT]: {
    cpp: `void bubbleSort(int arr[], int n) {
  for (int i = 0; i < n-1; i++) {
    for (int j = 0; j < n-i-1; j++) {
      if (arr[j] > arr[j+1]) {
        swap(arr[j], arr[j+1]);
      }
    }
  }
}`,
    java: `public void bubbleSort(int[] arr) {
  int n = arr.length;
  for (int i = 0; i < n-1; i++) {
    for (int j = 0; j < n-i-1; j++) {
      if (arr[j] > arr[j+1]) {
        int temp = arr[j];
        arr[j] = arr[j+1];
        arr[j+1] = temp;
      }
    }
  }
}`,
    python: `def bubble_sort(arr):
    n = len(arr)
    for i in range(n):
        for j in range(0, n-i-1):
            if arr[j] > arr[j+1]:
                arr[j], arr[j+1] = arr[j+1], arr[j]`,
  },
  [AlgorithmType.BINARY_SEARCH]: {
    cpp: `int binarySearch(int arr[], int l, int r, int x) {
  while (l <= r) {
    int m = l + (r - l) / 2;
    if (arr[m] == x) return m;
    if (arr[m] < x) l = m + 1;
    else r = m - 1;
  }
  return -1;
}`,
    java: `int binarySearch(int arr[], int x) {
  int l = 0, r = arr.length - 1;
  while (l <= r) {
    int m = l + (r - l) / 2;
    if (arr[m] == x) return m;
    if (arr[m] < x) l = m + 1;
    else r = m - 1;
  }
  return -1;
}`,
    python: `def binary_search(arr, x):
    l, r = 0, len(arr) - 1
    while l <= r:
        m = l + (r - l) // 2
        if arr[m] == x: return m
        if arr[m] < x: l = m + 1
        else: r = m - 1
    return -1`,
  },
  [AlgorithmType.SELECTION_SORT]: { cpp: "", java: "", python: "" },
  [AlgorithmType.INSERTION_SORT]: { cpp: "", java: "", python: "" },
  [AlgorithmType.MERGE_SORT]: { cpp: "", java: "", python: "" },
  [AlgorithmType.QUICK_SORT]: { cpp: "", java: "", python: "" },
  [AlgorithmType.LINEAR_SEARCH]: { cpp: "", java: "", python: "" },
};

// Line mappings for highlighting (simplified for demo)
export const LINE_MAPPINGS: Record<AlgorithmType, number[]> = {
  [AlgorithmType.BUBBLE_SORT]: [1, 2, 3, 4, 5, 6], // Map internal step logic to code lines
  [AlgorithmType.BINARY_SEARCH]: [1, 2, 3, 4, 5, 6, 7],
  [AlgorithmType.SELECTION_SORT]: [],
  [AlgorithmType.INSERTION_SORT]: [],
  [AlgorithmType.MERGE_SORT]: [],
  [AlgorithmType.QUICK_SORT]: [],
  [AlgorithmType.LINEAR_SEARCH]: [],
};
