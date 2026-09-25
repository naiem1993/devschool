# Chapter 1: Introduction to CSS — The Start of Style

**Goal:** Understand what CSS is and why it matters — then change a color on your own for the first time.

---

## 1.1 What is CSS?

### 1. Simple intro
CSS is the language that makes an HTML page look beautiful. HTML builds the structure (text, images, buttons), and CSS adds the color, size, and spacing.

### 2. Real-life example
Imagine you built a new house — walls, doors, windows (that is HTML). But whether the house looks nice depends on the paint, curtains, and furniture (that is CSS). The house stays the same — the look changes.

### 3. Syntax

```
selector {
  property: value;
}
```

### 4. Code Example

```css
h1 {
  color: red;
}
```

### 5. Output / Result
This small piece of CSS turns every `<h1>` heading on the page red.

### 6. Line-by-line explanation
- `h1` → the selector; which element we want to style.
- `{ }` → everything inside is style rules.
- `color` → what to change (here, the text color).
- `red` → what to change it to.
- `;` → every rule ends with a semicolon.

### 7. Try It Yourself

[[tryit]]
<h1>My Name</h1>
<p>I am learning CSS.</p>

<style>
  h1 { color: red; }
  p { color: blue; }
</style>
[[/tryit]]

Change `red` to `green` or `#22C55E` and see what happens.

### 8. Small Quiz
1. What does HTML build, and what does CSS do? (a) structure, style (b) style, structure (c) both structure
2. What goes at the end of a CSS rule? (a) `,` (b) `;` (c) `.`
3. In one line: what does the `color` property change?

<details>
<summary>Show answers</summary>

1. (a) structure, style
2. (b) `;`
3. The text color.

</details>

### 🎯 Practice Task
Build a small page with 3 different headings, each in a different color.
Hint: `h1 { color: red; }`, `h2 { color: green; }` — and so on.

---

## 1.2 The 3 ways to write CSS

### 1. Simple intro
There are three places to write CSS — Inline (inside a tag), Internal (inside a `<style>` tag), and External (in a separate `.css` file). In a large project, External is best.

### 2. Real-life example
Imagine writing a letter to a friend. You can write it right inside the envelope (Inline), on the same sheet (Internal), or on a separate attached sheet (External).

### 3. Syntax

```
<!-- Inline -->
<p style="color: red;">text</p>

<!-- Internal -->
<style>
  p { color: red; }
</style>

<!-- External -->
<link rel="stylesheet" href="style.css">
```

### 4. Code Example

```html
<!DOCTYPE html>
<html>
<head>
  <style>
    h1 { color: purple; }
    p  { font-size: 20px; }
  </style>
</head>
<body>
  <h1>Internal CSS</h1>
  <p style="color: red;">Inline CSS here</p>
</body>
</html>
```

### 5. Output / Result
The heading appears in purple (Internal style), and the paragraph appears in red (Inline style — because inline has higher priority).

### 6. Line-by-line explanation
- `<style>` → internal CSS inside the head.
- `h1 { color: purple; }` → every h1 becomes purple.
- `style="color: red;"` → only this one paragraph becomes red.
- Inline always beats every other style (the highest priority).

### 7. Try It Yourself

[[tryit]]
<!DOCTYPE html>
<html>
<head>
  <style>
    p { color: blue; }
  </style>
</head>
<body>
  <p>I am blue.</p>
  <p style="color: red;">I am red.</p>
</body>
</html>
[[/tryit]]

Both are `<p>` — yet the second one is red. That is the magic of inline.

### 8. Small Quiz
1. Where is Inline CSS written? (a) inside a `<style>` tag (b) in the tag's `style` attribute (c) in a separate file
2. Which has the highest priority? (a) Inline (b) Internal (c) External
3. In one line: which is best for a large project?

<details>
<summary>Show answers</summary>

1. (b) in the `style` attribute
2. (a) Inline
3. External — because all styles live in one file and are reused across pages.

</details>

### 🎯 Practice Task
Build a page where you style 3 elements with internal CSS, and give one element a different color with inline.
Hint: whatever inline gives, it always wins.

---

## 1.3 CSS Syntax and Selector Basics

### 1. Simple intro
The core shape of CSS — a selector plus a declaration block. The selector says who we are styling, the declaration says what to change.

### 2. Real-life example
Imagine you are giving orders to a class of students. "Those in grade 5" (the selector) — "wear black shirts" (the declaration). CSS works the same way.

### 3. Syntax

```
selector {
  property: value;
  property2: value2;
}
```

### 4. Code Example

```css
h1 {
  color: darkblue;
  font-size: 32px;
  text-align: center;
}

p {
  color: gray;
  line-height: 1.6;
}
```

### 5. Output / Result
Every `<h1>` is dark blue, 32px in size, centered. Every `<p>` is gray, with good spacing between lines.

### 6. Line-by-line explanation
- `h1` → an element selector, applies to every `h1`.
- `color: darkblue;` → the text color.
- `font-size: 32px;` → the text size (px = pixel).
- `text-align: center;` → text sits in the middle.
- `line-height: 1.6;` → spacing between lines (easier to read).

### 7. Try It Yourself

[[tryit]]
<!DOCTYPE html>
<html>
<head>
  <style>
    h1 { color: darkblue; text-align: center; }
    p  { color: gray; line-height: 1.6; }
  </style>
</head>
<body>
  <h1>My Blog</h1>
  <p>This is a paragraph styled with CSS.</p>
</body>
</html>
[[/tryit]]

Change `darkblue` to `#22C55E` — that is the hex value of green.

### 8. Small Quiz
1. In `font-size: 32px;`, what is `32px`? (a) property (b) value (c) selector
2. What does `text-align: center;` do? (a) changes color (b) centers the text (c) makes it bigger
3. In one line: why do we use `line-height`?

<details>
<summary>Show answers</summary>

1. (b) value
2. (b) centers the text
3. To add spacing between lines, so reading is easier.

</details>

### 🎯 Practice Task
Build a page where h1 is centered, p is gray, and line-height is 1.8.
Hint: write multiple properties inside one selector.

---

## 📌 Chapter 1 — Summary

In this chapter you learned:
- What CSS is and why it matters
- The 3 ways to write CSS — Inline, Internal, External
- CSS syntax — selector, property, value
- Common properties — color, font-size, text-align, line-height

In the next chapter you will learn selectors in more depth — element, class, id — and how to target a specific element on its own.
