# Chapter 5: CSS Text and Font

**Goal:** Styling text — font, size, weight, spacing, alignment — the full toolkit.

---

## 5.1 Font Properties

### 1. Simple intro
Font means the look of the text. In CSS we can change — which font family, how big, how bold, how light, how italic.

### 2. Real-life example
Imagine you are writing a letter — sometimes with a pencil, sometimes with a ballpoint pen, sometimes with a thick marker. In CSS, font family, weight, and style can all be changed.

### 3. Syntax

```
font-family: Arial, sans-serif;
font-size: 18px;
font-weight: bold;
font-style: italic;
```

### 4. Code Example

```html
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; }
    .large  { font-size: 32px; }
    .bold   { font-weight: bold; }
    .italic { font-style: italic; }
    .light  { font-weight: 300; }
  </style>
</head>
<body>
  <p class="large">Large text</p>
  <p class="bold">Bold text</p>
  <p class="italic">Italic text</p>
  <p class="light">Light text</p>
</body>
</html>
```

### 5. Output / Result
Four paragraphs — one large, one bold, one italic, one thin.

### 6. Line-by-line explanation
- `font-family: Arial, sans-serif;` → tries Arial first, falls back to sans-serif.
- `font-size: 32px;` → the text size, 32px.
- `font-weight: bold;` → thick. The numbers 700 or 900 also mean bold.
- `font-style: italic;` → slanted.
- `font-weight: 300;` → light.

### 7. Try It Yourself

[[tryit]]
<!DOCTYPE html>
<html>
<head>
  <style>
    p { font-family: Georgia, serif; }
    .big { font-size: 48px; font-weight: 900; color: #22C55E; }
  </style>
</head>
<body>
  <p class="big">Big bold text</p>
  <p>Small normal text</p>
</body>
</html>
[[/tryit]]

In `font-family`, change `serif` to `sans-serif` and see how it looks.

### 8. Small Quiz
1. What does `font-weight: bold;` do to the text? (a) italic (b) bold (c) larger
2. In `font-family: Arial, sans-serif;`, which is the fallback? (a) Arial (b) sans-serif (c) both
3. In one line: which property makes text italic?

<details>
<summary>Show answers</summary>

1. (b) bold
2. (b) sans-serif
3. `font-style: italic;`

</details>

### 🎯 Practice Task
Build a paragraph — font Georgia, size 20px, weight 500, italic.
Hint: write all four properties together.

---

## 5.2 Text Alignment and Spacing

### 1. Simple intro
Text alignment lets you place the text left, right, or center. And letter-spacing, line-height change the space between letters and between lines.

### 2. Real-life example
Imagine you are making a poster. Big title in the middle, text below on the left — arranged like that. Increasing line-height makes the text easier to read.

### 3. Syntax

```
text-align: left | center | right | justify;
line-height: 1.6;
letter-spacing: 2px;
text-decoration: underline;
text-transform: uppercase;
```

### 4. Code Example

```html
<!DOCTYPE html>
<html>
<head>
  <style>
    h1 {
      text-align: center;
      text-transform: uppercase;
      letter-spacing: 2px;
      text-decoration: underline;
    }
    p {
      text-align: justify;
      line-height: 1.8;
    }
  </style>
</head>
<body>
  <h1>My Blog</h1>
  <p>The text is set straight on both sides, with plenty of space between the lines. It is comfortable to read.</p>
</body>
</html>
```

### 5. Output / Result
The heading is centered, in uppercase, underlined, with letter spacing. The paragraph is justified on both sides, with a big line-height.

### 6. Line-by-line explanation
- `text-align: center;` → text in the middle.
- `text-transform: uppercase;` → all capital letters.
- `letter-spacing: 2px;` → 2px of extra space between letters.
- `text-decoration: underline;` → a line under the text.
- `text-align: justify;` → equal on both sides, magazine style.
- `line-height: 1.8;` → 1.8 times the spacing between lines.

### 7. Try It Yourself

[[tryit]]
<!DOCTYPE html>
<html>
<head>
  <style>
    h1 { text-align: center; text-decoration: line-through; }
    p  { line-height: 2; letter-spacing: 1px; }
  </style>
</head>
<body>
  <h1>Centered heading</h1>
  <p>This paragraph has more space between the lines. See if it feels comfortable to read.</p>
</body>
</html>
[[/tryit]]

Try changing `line-through` to `overline` or `none`.

### 8. Small Quiz
1. What does `text-align: center;` do? (a) text on the left (b) in the middle (c) on the right
2. What happens when `line-height` is bigger? (a) text is bold (b) more space between lines (c) text is larger
3. In one line: which property makes all text uppercase?

<details>
<summary>Show answers</summary>

1. (b) in the middle
2. (b) more space between lines
3. `text-transform: uppercase;`

</details>

### 🎯 Practice Task
Build a page — h1 centered, uppercase, letter-spacing 3px; paragraph justified, line-height 1.8.
Hint: multiple properties inside each selector.

---

## 📌 Chapter 5 — Summary

In this chapter you learned:
- Font family, size, weight, italic
- Text alignment — left, center, right, justify
- line-height, letter-spacing, text-decoration, text-transform

In the next chapter you will learn Flexbox — the most popular tool for arranging elements.
