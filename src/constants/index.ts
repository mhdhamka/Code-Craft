import type { Monaco } from "@monaco-editor/react";
import type { Language, Theme } from "../types";

export const LANGUAGE_CONFIG: Record<string, Language> = {
  javascript: {
    id: "javascript",
    label: "JavaScript",
    logoPath: "/javascript.png",
    fileName: "main.js",
    runtime: { language: "javascript", version: "Node.js 22.08", judge0Id: 102, fileExtension: "js" },
    monacoLanguage: "javascript",
    defaultCode: `// JavaScript Playground
const numbers = [1, 2, 3, 4, 5];

// Map numbers to their squares
const squares = numbers.map(n => n * n);
console.log('Original numbers:', numbers);
console.log('Squared numbers:', squares);

// Filter for even numbers
const evenNumbers = numbers.filter(n => n % 2 === 0);
console.log('Even numbers:', evenNumbers);

// Calculate sum using reduce
const sum = numbers.reduce((acc, curr) => acc + curr, 0);
console.log('Sum of numbers:', sum);
`,
  },
  typescript: {
    id: "typescript",
    label: "TypeScript",
    logoPath: "/typescript.png",
    fileName: "main.ts",
    runtime: { language: "typescript", version: "TS 5.6.2", judge0Id: 101, fileExtension: "ts" },
    monacoLanguage: "typescript",
    defaultCode: `// TypeScript Playground
interface NumberArray {
  numbers: number[];
  sum(): number;
  squares(): number[];
  evenNumbers(): number[];
}

class MathOperations implements NumberArray {
  constructor(public numbers: number[]) {}

  sum(): number {
    return this.numbers.reduce((acc, curr) => acc + curr, 0);
  }

  squares(): number[] {
    return this.numbers.map((n) => n * n);
  }

  evenNumbers(): number[] {
    return this.numbers.filter((n) => n % 2 === 0);
  }
}

const math = new MathOperations([1, 2, 3, 4, 5]);
console.log("Original numbers:", math.numbers);
console.log("Squared numbers:", math.squares());
console.log("Even numbers:", math.evenNumbers());
console.log("Sum of numbers:", math.sum());
`,
  },
  python: {
    id: "python",
    label: "Python",
    logoPath: "/python.png",
    fileName: "main.py",
    runtime: { language: "python", version: "Python 3.12.5", judge0Id: 100, fileExtension: "py" },
    monacoLanguage: "python",
    defaultCode: `# Python Playground
numbers = [1, 2, 3, 4, 5]

# Calculate squares using list comprehension
squares = [n ** 2 for n in numbers]
print(f"Original numbers: {numbers}")
print(f"Squared numbers: {squares}")

# Filter even numbers
even_numbers = [n for n in numbers if n % 2 == 0]
print(f"Even numbers: {even_numbers}")

# Calculate sum
total = sum(numbers)
print(f"Sum of numbers: {total}")
`,
  },
  java: {
    id: "java",
    label: "Java",
    logoPath: "/java.png",
    fileName: "Main.java",
    runtime: { language: "java", version: "JDK 17.0.6", judge0Id: 91, fileExtension: "java" },
    monacoLanguage: "java",
    defaultCode: `import java.util.Arrays;

public class Main {
    public static void main(String[] args) {
        int[] numbers = {1, 2, 3, 4, 5};

        System.out.println("Original numbers: " + Arrays.toString(numbers));

        int[] squares = Arrays.stream(numbers).map(n -> n * n).toArray();
        System.out.println("Squared numbers: " + Arrays.toString(squares));

        int[] evenNumbers = Arrays.stream(numbers).filter(n -> n % 2 == 0).toArray();
        System.out.println("Even numbers: " + Arrays.toString(evenNumbers));

        int sum = Arrays.stream(numbers).sum();
        System.out.println("Sum of numbers: " + sum);
    }
}
`,
  },
  cpp: {
    id: "cpp",
    label: "C++",
    logoPath: "/cpp.png",
    fileName: "main.cpp",
    runtime: { language: "cpp", version: "GCC 14.1.0", judge0Id: 105, fileExtension: "cpp" },
    monacoLanguage: "cpp",
    defaultCode: `#include <iostream>
#include <vector>
#include <numeric>
#include <algorithm>

int main() {
    std::vector<int> numbers = {1, 2, 3, 4, 5};

    std::cout << "Original numbers: ";
    for (int n : numbers) std::cout << n << " ";
    std::cout << "\\n";

    std::vector<int> squares;
    for (int n : numbers) squares.push_back(n * n);

    std::cout << "Squared numbers: ";
    for (int n : squares) std::cout << n << " ";
    std::cout << "\\n";

    int sum = std::accumulate(numbers.begin(), numbers.end(), 0);
    std::cout << "Sum of numbers: " << sum << "\\n";

    return 0;
}
`,
  },
  csharp: {
    id: "csharp",
    label: "C#",
    logoPath: "/csharp.png",
    fileName: "Program.cs",
    runtime: { language: "csharp", version: "Mono 6.6", judge0Id: 51, fileExtension: "cs" },
    monacoLanguage: "csharp",
    defaultCode: `using System;
using System.Linq;

class Program {
    static void Main() {
        int[] numbers = { 1, 2, 3, 4, 5 };

        Console.WriteLine($"Original numbers: {string.Join(" ", numbers)}");

        var squares = numbers.Select(n => n * n);
        Console.WriteLine($"Squared numbers: {string.Join(" ", squares)}");

        var evenNumbers = numbers.Where(n => n % 2 == 0);
        Console.WriteLine($"Even numbers: {string.Join(" ", evenNumbers)}");

        var sum = numbers.Sum();
        Console.WriteLine($"Sum of numbers: {sum}");
    }
}
`,
  },
  go: {
    id: "go",
    label: "Go",
    logoPath: "/go.png",
    fileName: "main.go",
    runtime: { language: "go", version: "Go 1.22", judge0Id: 106, fileExtension: "go" },
    monacoLanguage: "go",
    defaultCode: `package main

import "fmt"

func main() {
    numbers := []int{1, 2, 3, 4, 5}
    fmt.Println("Original numbers:", numbers)

    squares := make([]int, len(numbers))
    sum := 0
    var evens []int

    for i, n := range numbers {
        squares[i] = n * n
        sum += n
        if n%2 == 0 {
            evens = append(evens, n)
        }
    }

    fmt.Println("Squared numbers:", squares)
    fmt.Println("Even numbers:", evens)
    fmt.Println("Sum of numbers:", sum)
}
`,
  },
  rust: {
    id: "rust",
    label: "Rust",
    logoPath: "/rust.png",
    fileName: "main.rs",
    runtime: { language: "rust", version: "Rust 1.85", judge0Id: 108, fileExtension: "rs" },
    monacoLanguage: "rust",
    defaultCode: `fn main() {
    let numbers = vec![1, 2, 3, 4, 5];
    println!("Original numbers: {:?}", numbers);

    let squares: Vec<i32> = numbers.iter().map(|&n| n * n).collect();
    println!("Squared numbers: {:?}", squares);

    let evens: Vec<i32> = numbers.iter().filter(|&&n| n % 2 == 0).cloned().collect();
    println!("Even numbers: {:?}", evens);

    let sum: i32 = numbers.iter().sum();
    println!("Sum of numbers: {}", sum);
}
`,
  },
  ruby: {
    id: "ruby",
    label: "Ruby",
    logoPath: "/ruby.png",
    fileName: "main.rb",
    runtime: { language: "ruby", version: "Ruby 2.7", judge0Id: 72, fileExtension: "rb" },
    monacoLanguage: "ruby",
    defaultCode: `numbers = [1, 2, 3, 4, 5]
puts "Original numbers: #{numbers.join(' ')}"

squares = numbers.map { |n| n * n }
puts "Squared numbers: #{squares.join(' ')}"

even_numbers = numbers.select { |n| n.even? }
puts "Even numbers: #{even_numbers.join(' ')}"

sum = numbers.sum
puts "Sum of numbers: #{sum}"
`,
  },
  swift: {
    id: "swift",
    label: "Swift",
    logoPath: "/swift.png",
    fileName: "main.swift",
    runtime: { language: "swift", version: "Swift 5.2", judge0Id: 83, fileExtension: "swift" },
    monacoLanguage: "swift",
    defaultCode: `let numbers = [1, 2, 3, 4, 5]
print("Original numbers: \\(numbers)")

let squares = numbers.map { $0 * $0 }
print("Squared numbers: \\(squares)")

let evenNumbers = numbers.filter { $0 % 2 == 0 }
print("Even numbers: \\(evenNumbers)")

let sum = numbers.reduce(0, +)
print("Sum of numbers: \\(sum)")
`,
  },
  bash: {
    id: "bash",
    label: "Bash",
    logoPath: "/bash.png",
    fileName: "main.sh",
    runtime: { language: "bash", version: "Bash 5.0", judge0Id: 46, fileExtension: "sh" },
    monacoLanguage: "shell",
    defaultCode: `#!/usr/bin/env bash

numbers=(1 2 3 4 5)
echo "Original numbers: \${numbers[@]}"

echo -n "Squared numbers: "
sum=0
for n in "\${numbers[@]}"; do
  echo -n "$((n * n)) "
  sum=$((sum + n))
done
echo ""
echo "Sum of numbers: $sum"
`,
  },
};

export const THEMES: Theme[] = [
  { id: "vs-dark", label: "VS Dark", color: "#1e1e1e" },
  { id: "vs-light", label: "VS Light", color: "#ffffff" },
  { id: "github-dark", label: "GitHub Dark", color: "#0d1117" },
  { id: "monokai", label: "Monokai", color: "#272822" },
  { id: "solarized-dark", label: "Solarized Dark", color: "#002b36" },
];

export const THEME_DEFINITONS = {
  "github-dark": {
    base: "vs-dark" as const,
    inherit: true,
    rules: [
      { token: "comment", foreground: "6e7681" },
      { token: "string", foreground: "a5d6ff" },
      { token: "keyword", foreground: "ff7b72" },
      { token: "number", foreground: "79c0ff" },
      { token: "type", foreground: "ffa657" },
      { token: "class", foreground: "ffa657" },
      { token: "function", foreground: "d2a8ff" },
      { token: "variable", foreground: "ffa657" },
      { token: "operator", foreground: "ff7b72" },
    ],
    colors: {
      "editor.background": "#0d1117",
      "editor.foreground": "#c9d1d9",
      "editor.lineHighlightBackground": "#161b22",
      "editorLineNumber.foreground": "#6e7681",
      "editorIndentGuide.background": "#21262d",
      "editor.selectionBackground": "#264f78",
      "editor.inactiveSelectionBackground": "#264f7855",
    },
  },
  monokai: {
    base: "vs-dark" as const,
    inherit: true,
    rules: [
      { token: "comment", foreground: "75715E" },
      { token: "string", foreground: "E6DB74" },
      { token: "keyword", foreground: "F92672" },
      { token: "number", foreground: "AE81FF" },
      { token: "type", foreground: "66D9EF" },
      { token: "class", foreground: "A6E22E" },
      { token: "function", foreground: "A6E22E" },
      { token: "variable", foreground: "F8F8F2" },
      { token: "operator", foreground: "F92672" },
    ],
    colors: {
      "editor.background": "#272822",
      "editor.foreground": "#F8F8F2",
      "editorLineNumber.foreground": "#75715E",
      "editor.selectionBackground": "#49483E",
      "editor.lineHighlightBackground": "#3E3D32",
      "editorCursor.foreground": "#F8F8F2",
      "editor.selectionHighlightBackground": "#49483E",
    },
  },
  "solarized-dark": {
    base: "vs-dark" as const,
    inherit: true,
    rules: [
      { token: "comment", foreground: "586e75" },
      { token: "string", foreground: "2aa198" },
      { token: "keyword", foreground: "859900" },
      { token: "number", foreground: "d33682" },
      { token: "type", foreground: "b58900" },
      { token: "class", foreground: "b58900" },
      { token: "function", foreground: "268bd2" },
      { token: "variable", foreground: "b58900" },
      { token: "operator", foreground: "859900" },
    ],
    colors: {
      "editor.background": "#002b36",
      "editor.foreground": "#839496",
      "editorLineNumber.foreground": "#586e75",
      "editor.selectionBackground": "#073642",
      "editor.lineHighlightBackground": "#073642",
      "editorCursor.foreground": "#839496",
      "editor.selectionHighlightBackground": "#073642",
    },
  },
};

export const defineMonacoThemes = (monaco: Monaco) => {
  Object.entries(THEME_DEFINITONS).forEach(([themeName, themeData]) => {
    monaco.editor.defineTheme(themeName, {
      base: themeData.base,
      inherit: themeData.inherit,
      rules: themeData.rules.map((rule) => ({
        ...rule,
        foreground: rule.foreground,
      })),
      colors: themeData.colors,
    });
  });
};

export const CHEAT_SHEETS = [
  {
    language: "python",
    title: "Python",
    tips: [
      { title: "List Comprehension", code: "[x**2 for x in range(10) if x % 2 == 0]" },
      { title: "Dictionary Unpacking", code: "merged = {**dict1, **dict2}" },
      { title: "Context Manager", code: "with open('file.txt', 'r') as f:\n    content = f.read()" },
      { title: "Lambda Functions", code: "sort_key = lambda item: item['score']" },
    ],
  },
  {
    language: "javascript",
    title: "JavaScript",
    tips: [
      { title: "Destructuring & Defaults", code: "const { name = 'Anonymous', age } = user;" },
      { title: "Nullish Coalescing", code: "const port = process.env.PORT ?? 3000;" },
      { title: "Async / Await with Promise.all", code: "const [user, posts] = await Promise.all([fetchUser(), fetchPosts()]);" },
      { title: "Array Operations", code: "const total = items.reduce((acc, curr) => acc + curr.price, 0);" },
    ],
  },
  {
    language: "rust",
    title: "Rust",
    tips: [
      { title: "Pattern Matching", code: "match result {\n    Ok(v) => println!(\"Value: {}\", v),\n    Err(e) => eprintln!(\"Error: {}\", e),\n}" },
      { title: "Option Unwrapping with ?", code: "let value = maybe_val?;" },
      { title: "Vector Iteration", code: "let evens: Vec<_> = numbers.into_iter().filter(|x| x % 2 == 0).collect();" },
    ],
  },
  {
    language: "go",
    title: "Go",
    tips: [
      { title: "Goroutine + Channel", code: "ch := make(chan string)\ngo func() { ch <- \"done\" }()\nmsg := <-ch" },
      { title: "Error Checking Idiom", code: "if err != nil {\n    return fmt.Errorf(\"failed: %w\", err)\n}" },
      { title: "Defer Cleanup", code: "file, _ := os.Open(\"test.txt\")\ndefer file.Close()" },
    ],
  },
];
