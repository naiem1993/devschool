# Chapter 4: CSS Colors ও Background

**লক্ষ্য:** রঙ নিয়ে পূর্ণ ধারণা — নাম, hex, rgb, আর background দিয়ে page সাজানো।

---

## 4.1 Color লেখার উপায়

### ১. সহজ পরিচয়
CSS-এ রঙ লেখার কয়েকটা উপায় আছে — নাম দিয়ে (`red`, `blue`), hex দিয়ে (`#FF0000`), RGB দিয়ে (`rgb(255, 0, 0)`), আর HSL দিয়ে। সবগুলোই একই রঙ বোঝায়, শুধু লেখার ধরন আলাদা।

### ২. বাস্তব জীবনের উদাহরণ
ভাবো তুমি রঙের দোকানে গেলে। কেউ বলে "লাল আনো", কেউ বলে "নম্বর ২ ফেরত", কেউ বলে "গাঢ় লাল"। তিনভাবেই একই রঙ পাওয়া যায়। CSS-এও তাই।

### ৩. Syntax

```
color: red;                /* নাম */
color: #ff0000;            /* hex */
color: rgb(255, 0, 0);     /* rgb */
color: hsl(0, 100%, 50%);  /* hsl */
```

### ৪. Code Example

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
  <p class="red-name">লাল — নাম দিয়ে</p>
  <p class="red-hex">লাল — hex দিয়ে</p>
  <p class="red-rgb">লাল — rgb দিয়ে</p>
  <p class="red-hsl">লাল — hsl দিয়ে</p>
</body>
</html>
```

### ৫. Output / Result
চারটা লেখা, প্রতিটাই আলাদা শেডের লাল। কেউ উজ্জ্বল, কেউ গাঢ় — কারণ প্রতিটার মান একটু একটু আলাদা।

### ৬. লাইন-বাই-লাইন ব্যাখ্যা
- `red` → CSS-এর built-in নাম, সবচেয়ে সহজ।
- `#e11d48` → ৬ অক্ষরের hex কোড; প্রথম দুইটা Red, তারপর Green, তারপর Blue।
- `rgb(220, 38, 38)` → R, G, B এর মান ০-২৫৫।
- `hsl(0, 75%, 50%)` → Hue (0-360), Saturation %, Lightness %।
- সবগুলোই color প্রপার্টির মান — যেকোনো একটা বেছে নেওয়া যায়।

### ৭. Try It Yourself

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
  <p class="a">DevSchool সবুজ — hex</p>
  <p class="b">DevSchool সবুজ — rgb</p>
  <p class="c">DevSchool সবুজ — hsl</p>
</body>
</html>
[[/tryit]]

তিনটাই আসলে একই রঙ — শুধু লেখার ধরন আলাদা।

### ৮. ছোট Quiz
১. `#ff0000` মানে কী? (ক) সবুজ (খ) নীল (গ) লাল
২. `rgb(0, 0, 0)` কোন রঙ? (ক) সাদা (খ) কালো (গ) ধূসর
৩. এক লাইনে: hex-এর ৬ অক্ষর কী কী বোঝায়?

<details>
<summary>উত্তর দেখো</summary>

১. (গ) লাল
২. (খ) কালো
৩. প্রথম ২ = Red, মাঝের ২ = Green, শেষ ২ = Blue।

</details>

### 🎯 Practice Task
একটা page বানাও যেখানে ৩টা paragraph থাকবে — একই রঙ তিনভাবে লেখা (নাম, hex, rgb)।
ইঙ্গিত: যেকোনো সবুজ রঙ বেছে নাও — তিনভাবে লেখো।

---

## 4.2 Background

### ১. সহজ পরিচয়
Background মানে পেছনের রঙ বা ছবি। এটা দিয়ে element-এর পিছনে যেকোনো রঙ বসানো যায়, অথবা ছবি দেওয়া যায়।

### ২. বাস্তব জীবনের উদাহরণ
ভাবো তুমি একটা কাগজে লেখার আগে তার উপর হালকা রঙের ছোপ দিলে। লেখা তো একই, কিন্তু পেছনের রঙটা আলাদা মেজাজ দেয়। Background-ও তেমন।

### ৩. Syntax

```
background-color: #f0fdf4;
background-image: url('photo.jpg');
background-size: cover;
```

### ৪. Code Example

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
  <div class="card">সবুজ background কার্ড</div>
  <div class="gradient">গ্রেডিয়েন্ট কার্ড</div>
</body>
</html>
```

### ৫. Output / Result
পুরো page হালকা ধূসর। উপরে সবুজ কার্ড, তার নিচে সবুজ থেকে নীলের গ্রেডিয়েন্ট কার্ড। দুইটাতেই সাদা লেখা, গোল কোণা।

### ৬. লাইন-বাই-লাইন ব্যাখ্যা
- `body { background-color: #f8fafc; }` → পুরো page-এর পেছনের রঙ।
- `background: #22C55E;` → কার্ডের background।
- `color: white;` → লেখা সাদা, যাতে সবুজের উপর পড়তে সুবিধা।
- `border-radius: 8px;` → চার কোণা গোল।
- `background: linear-gradient(...)` → দুই রঙের মিশ্রণ, ১৩৫ ডিগ্রি কোণে।

### ৭. Try It Yourself

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
  <div class="box">গ্রেডিয়েন্ট বাক্স</div>
</body>
</html>
[[/tryit]]

গ্রেডিয়েন্টের ডিগ্রি `45deg` কে `90deg` বা `180deg` করে দেখো।

### ৮. ছোট Quiz
১. `background-color` কী করে? (ক) লেখার রঙ (খ) পেছনের রঙ (গ) বর্ডার রঙ
২. গ্রেডিয়েন্ট মানে কী? (ক) এক রঙ (খ) দুই/বেশি রঙের মিশ্রণ (গ) ছবি
৩. এক লাইনে: সাদা লেখার জন্য সবুজ background-এ কী প্রপার্টি লাগবে?

<details>
<summary>উত্তর দেখো</summary>

১. (খ) পেছনের রঙ
২. (খ) দুই/বেশি রঙের মিশ্রণ
৩. `color: white;` — যাতে লেখা পড়া যায়।

</details>

### 🎯 Practice Task
তিনটা কার্ড বানাও — একটার solid background, একটার gradient, একটার হালকা opacity।
ইঙ্গিত: `linear-gradient(90deg, color1, color2)` ব্যবহার করো।

---

## 📌 Chapter 4 — সারসংক্ষেপ

এই chapter-এ শিখলে:
- রঙ লেখার ৪ উপায় — নাম, hex, rgb, hsl
- `background-color` দিয়ে পেছনের রঙ
- গ্রেডিয়েন্ট ও border-radius

পরের chapter-এ শিখবে CSS Text আর Font — লেখা সুন্দর করার সব টুল।
