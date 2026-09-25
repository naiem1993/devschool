# Chapter 4: CSS Colors and Background

**Goal:** A full understanding of color — names, hex, rgb — and using background to style a page.

---

## 4.1 Ways to Write Color

### 1. Simple intro
CSS offers several ways to write a color — by name (`red`, `blue`), by hex (`#FF0000`), by RGB (`rgb(255, 0, 0)`), and by HSL. They all mean the same color; only the way you write it differs.

### 2. Real-life example
Imagine you went to a paint shop. Someone says "bring red", someone says "number 2 please", someone says "deep red". All three get you the same red. CSS works the same way.

### 3. Syntax

```
color: red;                /* name */
color: #ff0000;            /* hex */
color: rgb(255, 0, 0);     /* rgb */
color: hsl(0, 100%, 50%);  /* hsl */
```

### 4. Code Example

```html
<!DOCTYPE html>
<html>
<head>
  <style>
    .red-name  { color: red; }
    .red-hex   { color: #e11d48; }
    .red-rgb   { color: rgb(220, 38, 38); }
    .red-hsl   { color: hsl(0, 75%, 50%); }
  </style>
</head>
<body>
  <p class="red-name">Red — by name</p>
  <p class="red-hex">Red — by hex</p>
  <p class="red-rgb">Red — by rgb</p>
  <p class="red-hsl">Red — by hsl</p>
</body>
</html>
```

### 5. Output / Result
Four lines of text, each a slightly different shade of red. Some brighter, some darker — because each value is a little different.

### 6. Line-by-line explanation
- `red` → a built-in CSS name, the easiest way.
- `#e11d48` → a six-character hex code; the first two are Red, then Green, then Blue.
- `rgb(220, 38, 38)` → the R, G, B values, each 0–255.
- `hsl(0, 75%, 50%)` → Hue (0–360), Saturation %, Lightness %.
- All of them are values for the `color` property — pick any one.

### 7. Try It Yourself

[[tryit]]
<!DOCTYPE html>
<html>
<head>
  <style>
    .a { color: #22C55E; }
    .b { color: rgb(34, 197, 94); }
    .c { color: hsl(142, 71%, 45%); }
  </style>
</head>
<body>
  <p class="a">DevSchool green — hex</p>
  <p class="b">DevSchool green — rgb</p>
  <p class="c">DevSchool green — hsl</p>
</body>
</html>
[[/tryit]]

All three are actually the same color — only the way of writing differs.

### 8. Small Quiz
1. What does `#ff0000` mean? (a) green (b) blue (c) red
2. What color is `rgb(0, 0, 0)`? (a) white (b) black (c) gray
3. In one line: what do the six characters of hex represent?

<details>
<summary>Show answers</summary>

1. (c) red
2. (b) black
3. First 2 = Red, middle 2 = Green, last 2 = Blue.

</details>

### 🎯 Practice Task
Build a page with 3 paragraphs — write the same color three ways (name, hex, rgb).
Hint: pick any green and write it three ways.

---

## 4.2 Background

### 1. Simple intro
Background means the color or image behind. It lets you place any color behind an element, or even an image.

### 2. Real-life example
Imagine you tint a sheet of paper with a light color before writing on it. The writing is the same, but the background gives a different mood. Background works the same way.

### 3. Syntax

```
background-color: #f0fdf4;
background-image: url('photo.jpg');
background-size: cover;
```

### 4. Code Example

```html
<!DOCTYPE html>
<html>
<head>
  <style>
    body { background-color: #f8fafc; }
    .card {
      background: #22C55E;
      color: white;
      padding: 20px;
      border-radius: 8px;
    }
    .gradient {
      background: linear-gradient(135deg, #22C55E, #0ea5e9);
      color: white;
      padding: 20px;
      border-radius: 8px;
      margin-top: 10px;
    }
  </style>
</head>
<body>
  <div class="card">Green background card</div>
  <div class="gradient">Gradient card</div>
</body>
</html>
```

### 5. Output / Result
The whole page is light gray. On top is a green card, below it a card that fades from green to blue. Both have white text and rounded corners.

### 6. Line-by-line explanation
- `body { background-color: #f8fafc; }` → the background of the whole page.
- `background: #22C55E;` → the card's background.
- `color: white;` → white text, so it is easy to read on green.
- `border-radius: 8px;` → the four corners become rounded.
- `background: linear-gradient(...)` → a mix of two colors at a 135-degree angle.

### 7. Try It Yourself

[[tryit]]
<!DOCTYPE html>
<html>
<head>
  <style>
    body { background-color: #0a0f0c; color: white; }
    .box {
      background: linear-gradient(45deg, #22C55E, #eab308);
      padding: 30px;
      border-radius: 12px;
      margin: 20px;
    }
  </style>
</head>
<body>
  <div class="box">Gradient box</div>
</body>
</html>
[[/tryit]]

Change the gradient angle from `45deg` to `90deg` or `180deg` and see the difference.

### 8. Small Quiz
1. What does `background-color` do? (a) text color (b) background color (c) border color
2. What is a gradient? (a) a single color (b) a mix of two or more colors (c) an image
3. In one line: what property do you need for white text on a green background?

<details>
<summary>Show answers</summary>

1. (b) background color
2. (b) a mix of two or more colors
3. `color: white;` — so the text is readable.

</details>

### 🎯 Practice Task
Build three cards — one with a solid background, one with a gradient, one with light opacity.
Hint: use `linear-gradient(90deg, color1, color2)`.

---

## 📌 Chapter 4 — Summary

In this chapter you learned:
- The 4 ways to write color — name, hex, rgb, hsl
- `background-color` for the color behind
- Gradients and border-radius

In the next chapter you will learn CSS Text and Font — every tool for making writing beautiful.
