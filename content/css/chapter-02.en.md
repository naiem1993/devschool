# Chapter 2: CSS Selectors

**Goal:** Learn the three ways to target exactly which element you want to style — element, class, and id.

---

## 2.1 Element Selector

### 1. Simple intro
The element selector is the simplest — just write the tag name, and every element of that tag is styled together.

### 2. Real-life example
Imagine you told every boy in a school — "everyone bring one umbrella". That means all of them. The element selector is the same — every element of that tag.

### 3. Syntax

```
tagname {
  property: value;
}
```

### 4. Code Example

```css
p {
  color: #333;
}

h2 {
  color: darkgreen;
}
```

### 5. Output / Result
Every `<p>` on the page becomes gray-black, and every `<h2>` becomes dark green.

### 6. Line-by-line explanation
- `p { }` → targets every `<p>` tag.
- `h2 { }` → targets every `<h2>` tag.
- `color: #333;` → `#333` is a gray-black hex code (three pairs of R, G, B).
- Two separate selectors — two separate styles.

### 7. Try It Yourself

[[tryit]]
<!DOCTYPE html>
<html>
<head>
  <style>
    p { color: #333; }
    h2 { color: darkgreen; }
  </style>
</head>
<body>
  <h2>First heading</h2>
  <p>First paragraph.</p>
  <h2>Second heading</h2>
  <p>Second paragraph.</p>
</body>
</html>
[[/tryit]]

Both headings and both paragraphs pick up their styles — because the selector says "every one of this tag".

### 8. Small Quiz
1. What does `p { color: #333; }` target? (a) only the first `<p>` (b) every `<p>` (c) every tag
2. What does `#333` represent? (a) red (b) dark gray-black (c) green
3. In one line: what does the element selector match?

<details>
<summary>Show answers</summary>

1. (b) every `<p>`
2. (b) dark gray-black
3. Every element of that tag name.

</details>

### 🎯 Practice Task
Build a page with two different tags — style both with element selectors.
Hint: one tag one color, another tag another color.

---

## 2.2 Class and ID Selectors

### 1. Simple intro
When you do not want to style *every* element of a tag, use a class (`.name`) or an id (`#name`). A class can be reused on many elements; an id should be used only once on a page.

### 2. Real-life example
Think of a school. "Grade 5" (class) is a group — many students can be in it. "Roll number 12" (id) is one specific student.

### 3. Syntax

```
/* class — many elements */
.classname { property: value; }

/* id — one element */
#idname { property: value; }
```

In HTML:

```html
<p class="note">...</p>
<p id="intro">...</p>
```

### 4. Code Example

```html
<!DOCTYPE html>
<html>
<head>
  <style>
    .note  { color: #d97706; font-style: italic; }
    #intro { color: #16a34a; font-size: 20px; }
  </style>
</head>
<body>
  <p id="intro">I am the intro — one specific paragraph.</p>
  <p class="note">I am a note — many paragraphs can share this class.</p>
  <p class="note">I am also a note.</p>
</body>
</html>
```

### 5. Output / Result
The intro paragraph is green and slightly large. Both note paragraphs are orange and italic.

### 6. Line-by-line explanation
- `.note { ... }` → a class selector (starts with a dot).
- `#intro { ... }` → an id selector (starts with a hash).
- `class="note"` in HTML → adds that class to the element.
- `id="intro"` in HTML → gives that element a unique id.
- One element can have multiple classes — `class="note big"` — both apply.

### 7. Try It Yourself

[[tryit]]
<!DOCTYPE html>
<html>
<head>
  <style>
    .highlight { background: #fef3c7; padding: 2px 6px; }
    #main-title { color: #0ea5e9; font-size: 28px; }
  </style>
</head>
<body>
  <h1 id="main-title">Page Title</h1>
  <p>Some text with <span class="highlight">highlighted</span> words.</p>
</body>
</html>
[[/tryit]]

Change the color in `#main-title` to `#22C55E` and see the difference.

### 8. Small Quiz
1. In CSS, how does a class selector start? (a) `#` (b) `.` (c) `@`
2. How many times should an id appear on a page? (a) once (b) any number of times (c) never
3. In one line: what is the difference between a class and an id?

<details>
<summary>Show answers</summary>

1. (b) `.`
2. (a) once
3. A class can be reused on many elements; an id is for one unique element.

</details>

### 🎯 Practice Task
Build a page with one id-styled heading and three class-styled paragraphs.
Hint: reuse the same class on all three paragraphs.

---

## 📌 Chapter 2 — Summary

In this chapter you learned:
- The element selector — every tag of that name
- The class selector (`.name`) — reusable on many elements
- The id selector (`#name`) — for one unique element
- How to add class and id in HTML

In the next chapter you will learn the CSS Box Model — how every element is a box with padding, border, and margin.
