# Chapter 5: CSS Text ও Font

**লক্ষ্য:** লেখা সাজানো — font, আকার, বেধ, spacing, alignment — সব কিছুর হাতিয়ার।

---

## 5.1 Font Properties

### ১. সহজ পরিচয়
Font মানে লেখার চেহারা। CSS-এ আমরা বদলাতে পারি — কোন font family, কত বড়, কত মোটা, কত হালকা, কত italic।

### ২. বাস্তব জীবনের উদাহরণ
ভাবো তুমি একটা চিঠি লিখছো — কখনো pencil দিয়ে, কখনো বলপেন দিয়ে, কখনো মোটা মার্কার দিয়ে। CSS-এ font পরিবার, বেধ, স্টাইল — সবই বদলানো যায়।

### ৩. Syntax

```
font-family: Arial, sans-serif;
font-size: 18px;
font-weight: bold;
font-style: italic;
```

### ৪. Code Example

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
  <p class="large">বড় লেখা</p>
  <p class="bold">মোটা লেখা</p>
  <p class="italic">বাঁকা লেখা</p>
  <p class="light">হালকা লেখা</p>
</body>
</html>
```

### ৫. Output / Result
চারটা paragraph — একটা বড়, একটা মোটা, একটা বাঁকা (italic), একটা হালকা (thin)।

### ৬. লাইন-বাই-লাইন ব্যাখ্যা
- `font-family: Arial, sans-serif;` → প্রথমে Arial চেষ্টা করবে, না পেলে sans-serif।
- `font-size: 32px;` → লেখার আকার ৩২px।
- `font-weight: bold;` → মোটা। সংখ্যায় 700 বা 900 মানেও মোটা।
- `font-style: italic;` → বাঁকা।
- `font-weight: 300;` → হালকা (light)।

### ৭. Try It Yourself

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
  <p class="big">বড় মোটা লেখা</p>
  <p>ছোট সাধারণ লেখা</p>
</body>
</html>
[[/tryit]]

`font-family`-তে `serif` বদলে `sans-serif` করে দেখো — কেমন লাগে।

### ৮. ছোট Quiz
১. `font-weight: bold;` লেখাকে কী করে? (ক) বাঁকা (খ) মোটা (গ) বড়
২. `font-family: Arial, sans-serif;` এখানে fallback কোনটা? (ক) Arial (খ) sans-serif (গ) দুটোই
৩. এক লাইনে: italic করতে কোন প্রপার্টি?

<details>
<summary>উত্তর দেখো</summary>

১. (খ) মোটা
২. (খ) sans-serif
৩. `font-style: italic;`

</details>

### 🎯 Practice Task
একটা paragraph বানাও — font Georgia, size 20px, weight 500, italic।
ইঙ্গিত: চারটা প্রপার্টি একসাথে লেখো।

---

## 5.2 Text Alignment ও Spacing

### ১. সহজ পরিচয়
Text alignment দিয়ে লেখা বামে-ডানে-মাঝে সাজানো যায়। আর letter-spacing, line-height দিয়ে অক্ষর আর লাইনের মাঝে ফাঁক বদলানো যায়।

### ২. বাস্তব জীবনের উদাহরণ
ভাবো তুমি একটা পোস্টার বানাচ্ছো। শিরোনাম বড় মাঝখানে, লেখা নিচে বাম দিকে — এভাবে সাজানো। line-height বাড়ালে লেখা পড়তে আরাম হয়।

### ৩. Syntax

```
text-align: left | center | right | justify;
line-height: 1.6;
letter-spacing: 2px;
text-decoration: underline;
text-transform: uppercase;
```

### ৪. Code Example

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
  <h1>আমার ব্লগ</h1>
  <p>লেখাটা দুই দিক থেকেই সোজা করে বসানো, আর লাইনের মাঝে যথেষ্ট ফাঁক। এটা পড়তে আরাম।</p>
</body>
</html>
```

### ৫. Output / Result
শিরোনাম মাঝখানে, বড় হাতের অক্ষরে, নিচে দাগ দেওয়া, আর অক্ষরের মাঝে ফাঁক। নিচের paragraph দুই প্রান্ত থেকে সোজা, লাইনের মাঝে বড় ফাঁক।

### ৬. লাইন-বাই-লাইন ব্যাখ্যা
- `text-align: center;` → লেখা মাঝখানে।
- `text-transform: uppercase;` → সব বড় হাতের অক্ষর।
- `letter-spacing: 2px;` → অক্ষরের মাঝে ২px ফাঁক।
- `text-decoration: underline;` → নিচে দাগ।
- `text-align: justify;` → দুই প্রান্ত থেকে সমান, magazine-এর মতো।
- `line-height: 1.8;` → লাইনগুলোর মাঝে ১.৮ গুণ ফাঁক।

### ৭. Try It Yourself

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
  <h1>মাঝখানে শিরোনাম</h1>
  <p>এই paragraph-এ লাইনের মাঝে বেশি ফাঁক আছে। পড়তে আরাম লাগে কিনা দেখো।</p>
</body>
</html>
[[/tryit]]

`line-through` কে `overline` বা `none` করে দেখো — কেমন হয়।

### ৮. ছোট Quiz
১. `text-align: center;` কী করে? (ক) লেখা বামে (খ) মাঝে (গ) ডানে
২. `line-height` বেশি হলে কী হয়? (ক) লেখা মোটা (খ) লাইনের মাঝে ফাঁক বাড়ে (গ) লেখা বড়
৩. এক লাইনে: সব বড় হাতের অক্ষর করতে কোন প্রপার্টি?

<details>
<summary>উত্তর দেখো</summary>

১. (খ) মাঝে
২. (খ) লাইনের মাঝে ফাঁক বাড়ে
৩. `text-transform: uppercase;`

</details>

### 🎯 Practice Task
একটা page বানাও — h1 মাঝখানে, uppercase, letter-spacing 3px; paragraph justify, line-height 1.8।
ইঙ্গিত: প্রতিটা selector-এ একাধিক প্রপার্টি।

---

## 📌 Chapter 5 — সারসংক্ষেপ

এই chapter-এ শিখলে:
- Font পরিবার, আকার, বেধ, italic
- Text alignment — left, center, right, justify
- line-height, letter-spacing, text-decoration, text-transform

পরের chapter-এ শিখবে Flexbox — element সাজানোর সবচেয়ে জনপ্রিয় হাতিয়ার।
