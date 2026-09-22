# Chapter 1: CSS পরিচিতি — সৌন্দর্যের শুরু

**লক্ষ্য:** CSS কী, কেন দরকার — সেটা বোঝা, আর প্রথমবার নিজে রঙ বদলে দেখা।

---

## 1.1 CSS কী?

### ১. সহজ পরিচয়
CSS হলো সেই ভাষা, যা দিয়ে HTML page-কে সুন্দর করা হয়। HTML দিয়ে বানানো হয় কাঠামো (লেখা, ছবি, বাটন), আর CSS দিয়ে দেওয়া হয় রঙ, আকার, জায়গা।

### ২. বাস্তব জীবনের উদাহরণ
ভাবো তুমি একটা নতুন ঘর বানালে — দেয়াল, দরজা, জানালা (এটা HTML)। কিন্তু ঘরটা সুন্দর লাগবে কি না, সেটা নির্ভর করে রঙ, পর্দা, আসবাবের উপর (এটা CSS)। ঘর থাকবে সবসময় — সাজে বদল।

### ৩. Syntax

```
selector {
  property: value;
}
```

### ৪. Code Example

```css
h1 {
  color: red;
}
```

### ৫. Output / Result
এই একটুকরো CSS লিখলে page-এর সব `<h1>` শিরোনাম লাল রঙের হয়ে যাবে।

### ৬. লাইন-বাই-লাইন ব্যাখ্যা
- `h1` → selector; কোন element-কে সাজাব, সেটা।
- `{ }` → ভেতরে থাকবে সব স্টাইল নিয়ম।
- `color` → কোন জিনিস বদলাব (এখানে লেখার রঙ)।
- `red` → কী মানে বদলাব।
- `;` → প্রতিটা নিয়মের শেষে সেমিকোলন দিতে হয়।

### ৭. Try It Yourself

[[tryit]]
<h1>আমার নাম</h1>
<p>আমি CSS শিখছি।</p>

<style>
  h1 { color: red; }
  p { color: blue; }
</style>
[[/tryit]]

`red`-কে `green` বা `#22C55E` করে দেখো — কী বদলায়।

### ৮. ছোট Quiz
১. HTML কী বানায়, CSS কী করে? (ক) কাঠামো, সৌন্দর্য (খ) সৌন্দর্য, কাঠামো (গ) দুটোই কাঠামো
২. CSS নিয়মের শেষে কী দিতে হয়? (ক) `,` (খ) `;` (গ) `.`
৩. এক লাইনে: `color` প্রপার্টি কী বদলায়?

<details>
<summary>উত্তর দেখো</summary>

১. (ক) কাঠামো, সৌন্দর্য
২. (খ) `;`
৩. লেখার রঙ।

</details>

### 🎯 Practice Task
একটা ছোট page বানাও যেখানে ৩টা ভিন্ন heading থাকবে, প্রতিটা আলাদা রঙের।
ইঙ্গিত: `h1 { color: red; }`, `h2 { color: green; }` — এভাবে।

---

## 1.2 CSS লেখার ৩ উপায়

### ১. সহজ পরিচয়
CSS লেখার তিনটা জায়গা আছে — Inline (tag-এর ভেতরে), Internal (`<style>` ট্যাগে), আর External (আলাদা `.css` ফাইলে)। বড় প্রজেক্টে External সবচেয়ে ভালো।

### ২. বাস্তব জীবনের উদাহরণ
ভাবো তুমি বন্ধুকে চিঠি লিখবে। সোজা চিঠির ভেতরে লিখতে পারো (Inline), বা কাগজের উপরে লিখতে পারো (Internal), বা আলাদা কাগজে লিখে সংযুক্ত করতে পারো (External)।

### ৩. Syntax

```
<!-- Inline -->
<p style="color: red;">লেখা</p>

<!-- Internal -->
<style>
  p { color: red; }
</style>

<!-- External -->
<link rel="stylesheet" href="style.css">
```

### ৪. Code Example

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
  <p style="color: red;">Inline CSS এখানে</p>
</body>
</html>
```

### ৫. Output / Result
heading বেগুনি রঙে দেখাবে (Internal style), আর paragraph লাল রঙে (Inline style — কারণ inline বেশি priority পায়)।

### ৬. লাইন-বাই-লাইন ব্যাখ্যা
- `<style>` → head-এর ভেতরে internal CSS।
- `h1 { color: purple; }` → সব h1 বেগুনি।
- `style="color: red;"` → শুধু এই একটা paragraph লাল।
- Inline সবসময় অন্য সব style-কে হারিয়ে দেয় (সবচেয়ে বেশি priority)।

### ৭. Try It Yourself

[[tryit]]
<!DOCTYPE html>
<html>
<head>
  <style>
    p { color: blue; }
  </style>
</head>
<body>
  <p>আমি blue।</p>
  <p style="color: red;">আমি লাল।</p>
</body>
</html>
[[/tryit]]

দুইটাই `<p>` — তবুও দ্বিতীয়টা লাল কেন? Inline-এর জাদু।

### ৮. ছোট Quiz
১. Inline CSS কোথায় লেখা হয়? (ক) `<style>` ট্যাগে (খ) tag-এর `style` attribute-এ (গ) আলাদা ফাইলে
২. সবচেয়ে বেশি priority কে পায়? (ক) Inline (খ) Internal (গ) External
৩. এক লাইনে: বড় প্রজেক্টে কোনটা সবচেয়ে ভালো?

<details>
<summary>উত্তর দেখো</summary>

১. (খ) `style` attribute-এ
২. (ক) Inline
৩. External — কারণ এক ফাইলে সব style, সব page-এ reuse হয়।

</details>

### 🎯 Practice Task
একটা page বানাও যাতে internal CSS দিয়ে ৩টা element সাজাবে, আর একটা element-এ inline দিয়ে আলাদা রঙ দেবে।
ইঙ্গিত: Inline যেটা দেবে সেটা সবসময় জিতে যাবে।

---

## 1.3 CSS Syntax ও Selector Basics

### ১. সহজ পরিচয়
CSS-এর মূল গঠন — selector + declaration block। Selector বলে কাকে সাজাব, declaration বলে কী কী বদলাব।

### ২. বাস্তব জীবনের উদাহরণ
ভাবো তুমি একটা ক্লাসের ছাত্রদের নির্দেশ দিচ্ছো। "যারা ৫ম শ্রেণি" (selector) — "তোমরা কালো শার্ট পরো" (declaration)। CSS-এও ঠিক এভাবে।

### ৩. Syntax

```
selector {
  property: value;
  property2: value2;
}
```

### ৪. Code Example

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

### ৫. Output / Result
সব `<h1>` গাঢ় নীল, ৩২px আকারে, মাঝখানে সাজানো। সব `<p>` ধূসর রঙে, লাইনের মাঝে ভালো ফাঁক।

### ৬. লাইন-বাই-লাইন ব্যাখ্যা
- `h1` → element selector, সব `h1`-এ কাজ করে।
- `color: darkblue;` → লেখার রঙ।
- `font-size: 32px;` → লেখার আকার (px = pixel)।
- `text-align: center;` → লেখা মাঝখানে বসে।
- `line-height: 1.6;` → লাইনের মাঝে ফাঁক (লেখা পড়তে আরাম হয়)।

### ৭. Try It Yourself

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
  <h1>আমার ব্লগ</h1>
  <p>এটা একটা paragraph, যা CSS দিয়ে সাজানো।</p>
</body>
</html>
[[/tryit]]

`darkblue` বদলে `#22C55E` করে দেখো — এটা green-এর hex মান।

### ৮. ছোট Quiz
১. `font-size: 32px;` এখানে `32px` কী? (ক) property (খ) value (গ) selector
২. `text-align: center;` কী করে? (ক) রঙ বদলায় (খ) লেখা মাঝে বসায় (গ) বড় করে
৩. এক লাইনে: `line-height` কেন ব্যবহার করি?

<details>
<summary>উত্তর দেখো</summary>

১. (খ) value
২. (খ) লেখা মাঝখানে বসায়
৩. লাইনের মাঝে ফাঁক দিতে, যাতে পড়তে আরাম হয়।

</details>

### 🎯 Practice Task
একটা page বানাও যেখানে h1 মাঝখানে থাকবে, p ধূসর রঙে থাকবে, আর line-height 1.8 হবে।
ইঙ্গিত: এক selector-এর ভেতরে একাধিক property লেখো।

---

## 📌 Chapter 1 — সারসংক্ষেপ

এই chapter-এ শিখলে:
- CSS কী আর কেন দরকার
- CSS লেখার ৩ উপায় — Inline, Internal, External
- CSS syntax — selector, property, value
- সাধারণ property গুলো — color, font-size, text-align, line-height

পরের chapter-এ শিখবে selector-এর বিস্তারিত — element, class, id — আর কীভাবে নির্দিষ্ট element-কে আলাদা করে সাজাতে হয়।
