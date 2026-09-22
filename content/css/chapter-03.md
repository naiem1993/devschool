# Chapter 3: CSS Box Model

**লক্ষ্য:** প্রতিটা element আসলে একটা বাক্স — সেই বাক্সের ভেতরে-বাইরে জায়গা কীভাবে নিয়ন্ত্রণ করতে হয়, শেখা।

---

## 3.1 Box Model পরিচিতি

### ১. সহজ পরিচয়
CSS-এ প্রতিটা element হলো একটা আয়তাকার বাক্স। এই বাক্সের চারটা স্তর থাকে — Content (আসল লেখা/ছবি), Padding (ভেতরের ফাঁক), Border (সীমানা), Margin (বাইরের ফাঁক)। এটাই Box Model।

### ২. বাস্তব জীবনের উদাহরণ
ভাবো তুমি একটা বই পাঠাচ্ছো ডাকযোগে। ভেতরে বইটা (Content), বইয়ের চারপাশে বুদল দিয়ে মোড়া (Padding), তার বাইরে একটা বাক্স (Border), আর বাক্স আর দেয়ালের মাঝে খালি জায়গা (Margin)। CSS-এ element-ও ঠিক এমন।

### ৩. Syntax

```
selector {
  padding: 20px;
  border: 2px solid green;
  margin: 10px;
}
```

### ৪. Code Example

```css
.box {
  width: 200px;
  padding: 20px;
  border: 3px solid #22C55E;
  margin: 15px;
  background: #f0fdf4;
}
```

### ৫. Output / Result
একটা সবুজ বর্ডারের বাক্স, ভেতরে লেখা থেকে বর্ডার পর্যন্ত ২০px ফাঁক, আর বাক্সটার চারপাশে ১৫px বাইরের ফাঁক।

### ৬. লাইন-বাই-লাইন ব্যাখ্যা
- `width: 200px;` → content-এর প্রস্থ (padding+border এর আগে)।
- `padding: 20px;` → ভেতরের ফাঁক, চারপাশে ২০px।
- `border: 3px solid #22C55E;` → ৩px মোটা সবুজ বর্ডার, solid মানে টানা লাইন।
- `margin: 15px;` → বাইরের ফাঁক, চারপাশে ১৫px।
- `background` → বাক্সের ভেতরের রঙ (padding-এও ছড়ায়)।

### ৭. Try It Yourself

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
  <div class="box">আমি একটা বাক্স।</div>
</body>
</html>
[[/tryit]]

`padding: 20px` কে `padding: 40px` করে দেখো — বাক্স কত বড় হয়।

### ৮. ছোট Quiz
১. Content আর Border-এর মাঝের ফাঁককে কী বলে? (ক) margin (খ) padding (গ) border
২. `border: 3px solid green;` — `solid` মানে কী? (ক) ডটেড (খ) টানা লাইন (গ) ডাবল
৩. এক লাইনে: box model-এর চারটা স্তরের নাম লেখো।

<details>
<summary>উত্তর দেখো</summary>

১. (খ) padding
২. (খ) টানা লাইন
৩. Content → Padding → Border → Margin (ভেতর থেকে বাইরে)।

</details>

### 🎯 Practice Task
একটা বাক্স বানাও — ৩০০px চওড়া, ২৫px padding, ২px dashed বর্ডার, ২০px margin।
ইঙ্গিত: `dashed` ব্যবহার করলে ড্যাশ-ড্যাশ বর্ডার হবে।

---

## 3.2 Padding, Border, Margin বিস্তারিত

### ১. সহজ পরিচয়
Padding, border, margin — তিনটাই আলাদা আলাদা দিক দিয়ে সেট করা যায় (top, right, bottom, left)। CSS-এ শর্টকাট নিয়মও আছে — একটা মান দিলে চারদিকে, দুইটা মান দিলে উপর-নিচ আর বাম-ডান ইত্যাদি।

### ২. বাস্তব জীবনের উদাহরণ
ভাবো তুমি দেয়ালে পোস্টার লাগাচ্ছো। উপরে ৫cm ফাঁক, নিচে ৫cm ফাঁক, ডানে-বামে ১০cm ফাঁক — এভাবে আলাদা আলাদা নির্দেশ দেওয়া যায়। CSS-এও তাই।

### ৩. Syntax

```
/* চারদিকে একই */
padding: 20px;

/* উপরে-নিচে ১০px, বামে-ডানে ২০px */
padding: 10px 20px;

/* উপরে, ডানে, নিচে, বামে — clockwise */
padding: 10px 20px 15px 5px;

/* একদিক নির্দিষ্ট */
padding-top: 10px;
border-left: 3px solid red;
margin-bottom: 20px;
```

### ৪. Code Example

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
    <h2>প্রথম কার্ড</h2>
    <p>এখানে লেখা আছে।</p>
  </div>
  <div class="card">
    <h2>দ্বিতীয় কার্ড</h2>
  </div>
</body>
</html>
```

### ৫. Output / Result
দুইটা কার্ড একটার নিচে একটা। প্রতিটার চারপাশে হালকা ধূসর বর্ডার, বামপাশে সবুজ মোটা বর্ডার (accent), আর কার্ডগুলোর মাঝে ২০px ফাঁক।

### ৬. লাইন-বাই-লাইন ব্যাখ্যা
- `padding: 20px 30px;` → উপরে-নিচে ২০px, ডানে-বামে ৩০px।
- `border: 2px solid #ddd;` → চারপাশে হালকা ধূসর ২px বর্ডার।
- `border-left: 5px solid #22C55E;` → বাম দিকটা replace করে ৫px সবুজ বর্ডার।
- `margin-bottom: 20px;` → নিচে ফাঁক, তাই পরের কার্ডটা আলাদা দেখায়।

### ৭. Try It Yourself

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
  <div class="card"><h2>প্রথম</h2></div>
  <div class="card"><h2>দ্বিতীয়</h2></div>
</body>
</html>
[[/tryit]]

`border-left`-এর রঙ `red` করে দেখো — কেমন লাগে।

### ৮. ছোট Quiz
১. `padding: 10px 20px;` মানে কী? (ক) সব দিকে ১০px (খ) উপরে-নিচে ১০px, ডানে-বামে ২০px (গ) উপরে ২০px, নিচে ১০px
২. শুধু নিচে ফাঁক দিতে কোনটা? (ক) `margin-top` (খ) `margin-bottom` (গ) `padding-top`
৩. এক লাইনে: চারটা মান দিলে কোন ক্রমে বসে?

<details>
<summary>উত্তর দেখো</summary>

১. (খ) উপরে-নিচে ১০px, ডানে-বামে ২০px
২. (খ) `margin-bottom`
৩. উপরে → ডানে → নিচে → বামে (ঘড়ির কাঁটার দিকে)।

</details>

### 🎯 Practice Task
তিনটা কার্ড বানাও — প্রতিটার বাম দিকে আলাদা রঙের accent border (সবুজ, কমলা, লাল)।
ইঙ্গিত: `border-left` আলাদা করে দাও, শুধু রঙ বদলাও।

---

## 📌 Chapter 3 — সারসংক্ষেপ

এই chapter-এ শিখলে:
- Box model-এর চারটা স্তর — content, padding, border, margin
- শর্টকাট মান লেখার নিয়ম (১/২/৪ মান)
- একদিক নির্দিষ্ট করে padding/border/margin দেওয়া

পরের chapter-এ শিখবে CSS Color ও Background — রঙ নিয়ে সব পরীক্ষা।
