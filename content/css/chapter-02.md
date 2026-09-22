# Chapter 2: CSS Selectors

**লক্ষ্য:** কোন element-কে সাজাবে — সেটা নির্দিষ্ট করে ধরার তিনটা উপায় শেখা: element, class আর id।

---

## 2.1 Element Selector

### ১. সহজ পরিচয়
Element selector হলো সবচেয়ে সহজ — tag-এর নাম লিখলেই ওই tag-এর সব element একসাথে সাজে।

### ২. বাস্তব জীবনের উদাহরণ
ভাবো তুমি স্কুলের সব ছেলেকে বললে — "সবাই একটা করে ছাতা নিয়ে আসো"। মানে যত ছেলে, সবাই। Element selector-ও তাই — যতগুলো ওই tag, সবগুলো।

### ৩. Syntax

```
tagname {
  property: value;
}
```

### ৪. Code Example

```css
p {
  color: #333;
}

h2 {
  color: darkgreen;
}
```

### ৫. Output / Result
page-এর সব `<p>` ধূসর-কালো রঙে, আর সব `<h2>` গাঢ় সবুজ রঙে হবে।

### ৬. লাইন-বাই-লাইন ব্যাখ্যা
- `p { }` → সব `<p>` tag ধরে।
- `h2 { }` → সব `<h2>` tag ধরে।
- `color: #333;` → `#333` হলো ধূসর-কালোর hex কোড (৩টা করে R, G, B)।
- দুই selector আলাদা block — আলাদা স্টাইল।

### ৭. Try It Yourself

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
  <h2>প্রথম শিরোনাম</h2>
  <p>প্রথম paragraph।</p>
  <h2>দ্বিতীয় শিরোনাম</h2>
  <p>দ্বিতীয় paragraph।</p>
</body>
</html>
[[/tryit]]

দেখো — দুইটাই h2, দুইটাই একই রঙ পেল। Element selector-এর ক্ষমতা।

### ৮. ছোট Quiz
১. `p { ... }` কতগুলো paragraph-এ কাজ করে? (ক) প্রথমটা (খ) শেষটা (গ) সবগুলো
২. `#333` কী ধরনের মান? (ক) RGB নাম (খ) hex color (গ) সংখ্যা
৩. এক লাইনে: Element selector-এর অসুবিধা কী?

<details>
<summary>উত্তর দেখো</summary>

১. (গ) সবগুলো
২. (খ) hex color
৩. ওই tag-এর সবগুলোতে একসাথে কাজ করে — একটা নির্দিষ্ট element-কে আলাদা করা যায় না।

</details>

### 🎯 Practice Task
একটা page-এ ৩টা h2 আর ৩টা p রাখো। Element selector দিয়ে h2 সবুজ আর p ধূসর করো।
ইঙ্গিত: দুইটা আলাদা block।

---

## 2.2 Class ও ID Selector

### ১. সহজ পরিচয়
সব `p` একই রকম হবে — এটা সবসময় ভালো না। কখনো নির্দিষ্ট একটা বা কয়েকটাকে আলাদা করতে হয়। এজন্য আছে class (একাধিক element-এ ব্যবহার করা যায়) আর id (শুধু একটাই element-এ)।

### ২. বাস্তব জীবনের উদাহরণ
ভাবো স্কুলে সব ছেলের নাম একই না। Class হলো একটা গ্রুপ — যেমন "বিজ্ঞান বিভাগের ছেলেরা"। ID হলো একজনের নির্দিষ্ট রোল নম্বর — শুধু তার জন্য।

### ৩. Syntax

```
.classname { ... }    /* class — শুরুতে . */
#idname    { ... }    /* id    — শুরুতে # */
```

HTML-এ:
```
<p class="highlight">...</p>
<p id="main-para">...</p>
```

### ৪. Code Example

```html
<!DOCTYPE html>
<html>
<head>
  <style>
    .highlight { background: yellow; }
    #main-para { font-weight: bold; }
  </style>
</head>
<body>
  <p class="highlight">প্রথম paragraph — highlight।</p>
  <p>সাধারণ paragraph।</p>
  <p class="highlight" id="main-para">তৃতীয় paragraph — bold + highlight।</p>
</body>
</html>
```

### ৫. Output / Result
প্রথম আর তৃতীয় paragraph-এ হলুদ background। তৃতীয়টায় লেখা মোটা (bold), কারণ সেটাতে `id="main-para"` দেওয়া।

### ৬. লাইন-বাই-লাইন ব্যাখ্যা
- `.highlight { background: yellow; }` → যেকোনো element যার `class="highlight"` আছে, তার background হলুদ।
- `#main-para { font-weight: bold; }` → যার `id="main-para"` আছে শুধু তার লেখা মোটা।
- Class-এ শুরুতে `.` আর id-এ শুরুতে `#` — এটাই নিয়ম।
- একটা element-এ class আর id দুটোই থাকতে পারে।

### ৭. Try It Yourself

[[tryit]]
<!DOCTYPE html>
<html>
<head>
  <style>
    .box { border: 2px solid green; padding: 8px; }
    #title { color: red; }
  </style>
</head>
<body>
  <h1 id="title">আমার সাইট</h1>
  <div class="box">একটা বাক্স</div>
  <div class="box">আরেকটা বাক্স</div>
</body>
</html>
[[/tryit]]

দুইটাই `class="box"` — তাই দুটোতেই বর্ডার পড়ল।

### ৮. ছোট Quiz
১. Class selector শুরু হয় কী দিয়ে? (ক) `#` (খ) `.` (গ) `@`
২. একই id একটা page-এ কতবার ব্যবহার করা উচিত? (ক) একবার (খ) দুইবার (গ) যতবার ইচ্ছা
৩. এক লাইনে: class আর id-এর মূল পার্থক্য কী?

<details>
<summary>উত্তর দেখো</summary>

১. (খ) `.`
২. (ক) একবার
৩. Class একাধিক element-এ ব্যবহার করা যায়, id শুধু একটাতে।

</details>

### 🎯 Practice Task
একটা page বানাও যেখানে ৩টা বাক্স থাকবে — দুইটাতে একই class, একটা আলাদা id।
ইঙ্গিত: `.box` দিয়ে common style, `#special` দিয়ে আলাদা।

---

## 📌 Chapter 2 — সারসংক্ষেপ

এই chapter-এ শিখলে:
- Element selector — tag-এর নাম দিয়ে সব element ধরা
- Class selector — `.` দিয়ে একই ধরনের একাধিক element
- Id selector — `#` দিয়ে নির্দিষ্ট একটা element
- কখন কোনটা ব্যবহার করা উচিত

পরের chapter-এ শিখবে box model — padding, margin, border — কীভাবে element-এর চারপাশে জায়গা তৈরি করতে হয়।
