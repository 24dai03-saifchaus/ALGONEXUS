import { Step, AlgorithmType } from "./types";

export const generateBubbleSortSteps = (initialArray: number[]): Step[] => {
  const steps: Step[] = [];
  const arr = [...initialArray];
  const n = arr.length;

  steps.push({
    array: [...arr],
    highlights: [],
    swaps: [],
    line: 1,
    description: "Initializing Bubble Sort: We will iterate through the array multiple times, pushing the largest unsorted element to its correct position at the end in each pass.",
  });

  for (let i = 0; i < n - 1; i++) {
    for (let j = 0; j < n - i - 1; j++) {
      // Comparison
      steps.push({
        array: [...arr],
        highlights: [j, j + 1],
        swaps: [],
        line: 4,
        description: `Pass ${i + 1}: Comparing elements at index ${j} (${arr[j]}) and index ${j+1} (${arr[j+1]}). If the left element is greater, they will be swapped.`,
      });

      if (arr[j] > arr[j + 1]) {
        const left = arr[j];
        const right = arr[j + 1];
        // Swap
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
        steps.push({
          array: [...arr],
          highlights: [],
          swaps: [j, j + 1],
          line: 5,
          description: `Swap triggered: ${left} > ${right}. Moving ${left} to the right and ${right} to the left to maintain ascending order.`,
        });
      } else {
        steps.push({
          array: [...arr],
          highlights: [j, j + 1],
          swaps: [],
          line: 4,
          description: `No swap needed: ${arr[j]} <= ${arr[j+1]}. The elements are already in the correct relative order for this comparison.`,
        });
      }
    }
    steps.push({
      array: [...arr],
      highlights: Array.from({ length: i + 1 }, (_, k) => n - 1 - k),
      swaps: [],
      line: 2,
      description: `End of Pass ${i + 1}: The largest element in the current unsorted portion has 'bubbled up' to index ${n - 1 - i}.`,
    });
  }

  steps.push({
    array: [...arr],
    highlights: Array.from({ length: n }, (_, k) => k),
    swaps: [],
    line: 0,
    description: "Algorithm Complete: The array is now fully sorted. Every element has been compared and placed in its correct relative position.",
  });

  return steps;
};

export const generateBinarySearchSteps = (initialArray: number[], target: number): Step[] => {
  const steps: Step[] = [];
  const arr = [...initialArray].sort((a, b) => a - b);
  let l = 0;
  let r = arr.length - 1;

  steps.push({
    array: [...arr],
    highlights: [],
    swaps: [],
    line: 1,
    description: `Initializing Binary Search: Looking for target value ${target} in a sorted array. We will repeatedly divide the search interval in half.`,
  });

  while (l <= r) {
    const m = Math.floor(l + (r - l) / 2);
    
    steps.push({
      array: [...arr],
      highlights: [m],
      swaps: [],
      line: 3,
      description: `Calculating midpoint: Low=${l}, High=${r}. Midpoint is index ${m} with value ${arr[m]}. Comparing ${arr[m]} with target ${target}.`,
    });

    if (arr[m] === target) {
      steps.push({
        array: [...arr],
        highlights: [m],
        swaps: [],
        found: m,
        line: 4,
        description: `Match found! The value at index ${m} is exactly ${target}. Search successful.`,
      });
      return steps;
    }

    if (arr[m] < target) {
      const oldL = l;
      l = m + 1;
      steps.push({
        array: [...arr],
        highlights: [l, r],
        swaps: [],
        line: 5,
        description: `${arr[m]} is less than ${target}. Since the array is sorted, the target must be in the right half. Updating Low from ${oldL} to ${l}.`,
      });
    } else {
      const oldR = r;
      r = m - 1;
      steps.push({
        array: [...arr],
        highlights: [l, r],
        swaps: [],
        line: 6,
        description: `${arr[m]} is greater than ${target}. Since the array is sorted, the target must be in the left half. Updating High from ${oldR} to ${r}.`,
      });
    }
  }

  steps.push({
    array: [...arr],
    highlights: [],
    swaps: [],
    line: 8,
    description: `Search failed: Low (${l}) has exceeded High (${r}). The target value ${target} does not exist in this array.`,
  });

  return steps;
};
