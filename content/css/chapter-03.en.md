# Chapter 3: CSS Box Model

**Goal:** Every element is actually a box — learn how to control the space inside and outside that box.

---

## 3.1 Introduction to Box Model

### 1. Simple intro
In CSS every element is a rectangular box. That box has four layers — Content (the actual text or image), Padding (the space inside), Border (the boundary), Margin (the space outside). This is the Box Model.

### 2. Real-life example
Imagine you are mailing a book. Inside is the book (Content), wrapped with bubble wrap (Padding), placed in a box (Border), and the box leaves some empty space between it and the wall (Margin). A CSS element is exactly the same.

### 3. Syntax

```
selector {
  padding: 20px;
  border: 2px solid green;
  margin: 10px;
}
```

### 4. Code Example

```css
.box {
  width: 200px;
  padding: 20px;
  border: 3px solid #22C55E;
  margin: 15px;
  background: #f0fdf4;
}
```

### 5. Output / Result
A box with a green border, 20px space between the text and the border, and 15px outer space around the box.

### 6. Line-by-line explanation
- `width: 200px;` → the content's width (before adding padding and border).
- `padding: 20px;` → inside space, 20px on all sides.
- `border: 3px solid #22C55E;` → a 3px green border; solid means a continuous line.
- `margin: 15px;` → outside space, 15px on all sides.
- `background` → the color inside the box (it also spreads under the padding).

### 7. Try It Yourself

[[tryit]]
<!DOCTYPE html>
<html>
<head>
  <style>
    .box {
      width: 200px;
      padding: 20px;
      border: 3px solid #22C55E;
      margin: 15px;
      background: #f0fdf4;
    }
  </style>
</head>
<body>
  <div class="box">I am a box.</div>
</body>
</html>
[[/tryit]]

Change `padding: 20px` to `padding: 40px` and see how much bigger the box becomes.

### 8. Small Quiz
1. What is the space between the content and the border called? (a) margin (b) padding (c) border
2. In `border: 3px solid green;`, what does `solid` mean? (a) dotted (b) continuous line (c) double
3. In one line: name the four layers of the box model.

<details>
<summary>Show answers</summary>

1. (b) padding
2. (b) continuous line
3. Content → Padding → Border → Margin (from inside to outside).

</details>

### 🎯 Practice Task
Build a box — 300px wide, 25px padding, 2px dashed border, 20px margin.
Hint: using `dashed` gives you a dash-dash border.

---

## 3.2 Padding, Border, Margin in Detail

### 1. Simple intro
Padding, border, and margin can each be set on separate sides (top, right, bottom, left). CSS also has shortcut rules — one value means all sides, two values mean top-bottom and left-right, and so on.

### 2. Real-life example
Imagine you are sticking a poster on the wall. 5cm space at the top, 5cm at the bottom, 10cm on the left and right — you can give each side its own instructions. CSS works the same way.

### 3. Syntax

```
/* all sides same */
padding: 20px;

/* top-bottom 10px, left-right 20px */
padding: 10px 20px;

/* top, right, bottom, left — clockwise */
padding: 10px 20px 15px 5px;

/* one specific side */
padding-top: 10px;
border-left: 3px solid red;
margin-bottom: 20px;
```

### 4. Code Example

```html
<!DOCTYPE html>
<html>
<head>
  <style>
    .card {
      padding: 20px 30px;
      border: 2px solid #ddd;
      border-left: 5px solid #22C55E;
      margin-bottom: 20px;
      background: white;
    }
  </style>
</head>
<body>
  <div class="card">
    <h2>First card</h2>
    <p>There is text here.</p>
  </div>
  <div class="card">
    <h2>Second card</h2>
  </div>
</body>
</html>
```

### 5. Output / Result
Two cards, one below the other. Each has a light gray border all around, a thick green accent border on the left, and 20px of space between the cards.

### 6. Line-by-line explanation
- `padding: 20px 30px;` → top-bottom 20px, left-right 30px.
- `border: 2px solid #ddd;` → light gray 2px border all around.
- `border-left: 5px solid #22C55E;` → replaces the left side with a 5px green border.
- `margin-bottom: 20px;` → space below, so the next card looks separate.

### 7. Try It Yourself

[[tryit]]
<!DOCTYPE html>
<html>
<head>
  <style>
    .card {
      padding: 20px 30px;
      border: 2px solid #ddd;
      border-left: 5px solid #22C55E;
      margin-bottom: 20px;
    }
  </style>
</head>
<body>
  <div class="card"><h2>First</h2></div>
  <div class="card"><h2>Second</h2></div>
</body>
</html>
[[/tryit]]

Change the `border-left` color to `red` and see how it looks.

### 8. Small Quiz
1. What does `padding: 10px 20px;` mean? (a) 10px all around (b) top-bottom 10px, left-right 20px (c) 20px top, 10px bottom
2. Which one adds space only below? (a) `margin-top` (b) `margin-bottom` (c) `padding-top`
3. In one line: in what order do four values sit?

<details>
<summary>Show answers</summary>

1. (b) top-bottom 10px, left-right 20px
2. (b) `margin-bottom`
3. top → right → bottom → left (clockwise).

</details>

### 🎯 Practice Task
Build three cards — each with a different colored accent border on the left (green, orange, red).
Hint: set `border-left` separately and just change the color.

---

## 📌 Chapter 3 — Summary

In this chapter you learned:
- The four layers of the box model — content, padding, border, margin
- Shortcut value rules (1/2/4 values)
- Setting padding, border, and margin on specific sides

In the next chapter you will learn CSS Color and Background — all experiments with color.
