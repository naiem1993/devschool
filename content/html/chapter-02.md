# Chapter 2: HTML Basic Structure

**লক্ষ্য:** একটা HTML page-এর পূর্ণ কাঠামো বোঝা — DOCTYPE, html, head, body, আর tag/element/attribute-এর পার্থক্য জানা।

---

## 2.1 HTML Document Structure

### ১. সহজ পরিচয়
প্রতিটা HTML page-এর একটা নির্দিষ্ট কাঠামো থাকে। ঠিক যেমন একটা চিঠির থাকে — খাম, প্রাপকের নাম, ভেতরে লেখা। HTML page-এও তাই — কিছু অংশ থাকে যেগুলো সবসময় একই ক্রমে বসে।

### ২. বাস্তব জীবনের উদাহরণ
ভাবো একটা বই। প্রথমে থাকে কভার, তারপর ভেতরের পাতা, তারপর শেষ পাতা। HTML page-ও ঠিক সেরকম — উপরে একটা অংশ (head), নিচে একটা অংশ (body)। ব্রাউজার এই কাঠামো দেখেই বুঝে যায় কী দেখাবে, কী লুকাবে।

### ৩. Syntax

```
<!DOCTYPE html>
<html>
  <head>
    ...
  </head>
  <body>
    ...
  </body>
</html>
```

### ৪. Code Example

```html
<!DOCTYPE html>
<html lang="bn">
<head>
  <meta charset="UTF-8">
  <title>আমার পেজ</title>
</head>
<body>
  <h1>স্বাগতম</h1>
  <p>এটা একটা পূর্ণ HTML page।</p>
</body>
</html>
```

### ৫. Output / Result
ব্রাউজারে বড় করে দেখাবে — স্বাগতম। তার নিচে — এটা একটা পূর্ণ HTML page। আর উপরের tab-এ দেখাবে — আমার পেজ।

### ৬. লাইন-বাই-লাইন ব্যাখ্যা
- `<!DOCTYPE html>` → ব্রাউজারকে বলে এটা HTML5 ফাইল।
- `<html lang="bn">` → পুরো page-এর শুরু; `lang="bn"` বলে ভাষা বাংলা।
- `<head>` → page-এর তথ্য (title, charset) — নিজে দেখা যায় না।
- `<body>` → যা চোখে দেখা যায়, সব এখানে।
- `</body></html>` → দুটো tag এখানে বন্ধ হলো।

### ৭. Try It Yourself

[[tryit]]
<!DOCTYPE html>
<html>
<head>
  <title>পরীক্ষা</title>
</head>
<body>
  <h1>হ্যালো!</h1>
</body>
</html>
[[/tryit]]

`<title>`-এর লেখা বদলে দেখো — tab-এ কী বদলায়।

### ৮. ছোট Quiz
১. সব HTML ফাইলের একদম শুরুতে কোন লাইনটা থাকে? (ক) `<html>` (খ) `<!DOCTYPE html>` (গ) `<body>`
২. চোখে দেখা যায় এমন সব জিনিস কোন অংশে থাকে? (ক) `<head>` (খ) `<body>` (গ) `<title>`
৩. এক লাইনে: `<head>`-এর ভেতরের জিনিস ব্রাউজারে দেখা যায় কি?

<details>
<summary>উত্তর দেখো</summary>

১. (খ) `<!DOCTYPE html>`
২. (খ) `<body>`
৩. না — `<head>` শুধু তথ্য রাখে, দেখা যায় না।

</details>

### 🎯 Practice Task
একটা সম্পূর্ণ HTML page বানাও যাতে `<head>`-এ title, আর `<body>`-তে একটা heading আর একটা paragraph থাকবে।
ইঙ্গিত: পুরো কাঠামো ঠিক রেখে শুধু ভেতরের লেখা বদলাও।

---

## 2.2 Tag, Element, Attribute

### ১. সহজ পরিচয়
এই তিনটা শব্দ শুনতে কঠিন, কিন্তু সহজ। Tag হলো `< >` চিহ্নের ভেতরের নাম। Element হলো খোলা tag + লেখা + বন্ধ tag মিলে পুরো জিনিস। Attribute হলো tag-এর ভেতরে বাড়তি তথ্য।

### ২. বাস্তব জীবনের উদাহরণ
ভাবো একটা দরজা। "দরজা" শব্দটা হলো tag। আসল দরজাটা (হাতল, কাঠসহ) হলো element। আর "লাল রঙের" — এই বাড়তি তথ্যটা হলো attribute।

### ৩. Syntax

```
<tagname attribute="value">লেখা</tagname>
```

### ৪. Code Example

```html
<p>এটা সাধারণ paragraph।</p>
<p title="গোপন তথ্য">মাউস ধরলে দেখো।</p>
<a href="https://example.com">লিংকে যাও</a>
```

### ৫. Output / Result
প্রথম লাইন — সাধারণ লেখা। দ্বিতীয় লাইনে মাউস ধরলে একটা ছোট টুলটিপ দেখাবে — গোপন তথ্য। তৃতীয় লাইনটা নীল রঙের clickable লিংক হয়ে যাবে।

### ৬. লাইন-বাই-লাইন ব্যাখ্যা
- `<p>` → paragraph tag।
- `<p>...</p>` পুরোটা → একটা element।
- `title="গোপন তথ্য"` → একটা attribute (নাম = title, মান = গোপন তথ্য)।
- `<a href="...">` → link element; `href` attribute বলে দেয় কোথায় যাবে।
- Attribute সবসময় `নাম="মান"` আকারে খোলা tag-এর ভেতরে থাকে।

### ৭. Try It Yourself

[[tryit]]
<!DOCTYPE html>
<html>
<body>
  <p title="আমি টুলটিপ">মাউস এখানে ধরো।</p>
</body>
</html>
[[/tryit]]

`title`-এর মান বদলে দেখো — টুলটিপে কী আসে।

### ৮. ছোট Quiz
১. `<h1>` আর `</h1>` মিলে কী হয়? (ক) tag (খ) element (গ) attribute
২. `href="..."` এটা কী? (ক) tag (খ) element (গ) attribute
৩. এক লাইনে: attribute সবসময় কোথায় থাকে?

<details>
<summary>উত্তর দেখো</summary>

১. (খ) element
২. (গ) attribute
৩. খোলা tag-এর ভেতরে, `নাম="মান"` আকারে।

</details>

### 🎯 Practice Task
একটা লিংক বানাও যা নতুন tab-এ খুলবে।
ইঙ্গিত: `<a href="..." target="_blank">` — এখানে `target` হলো একটা attribute।

---

## 2.3 HTML Comment

### ১. সহজ পরিচয়
Comment হলো কোডের ভেতরে লেখা নোট, যা ব্রাউজার দেখায় না। ভবিষ্যতে নিজে বা অন্য কেউ কোড পড়লে বুঝতে পারে — এই অংশটা কেন লেখা হয়েছে।

### ২. বাস্তব জীবনের উদাহরণ
ভাবো তুমি বইয়ের মার্জিনে পেন দিয়ে লিখলে — "এই অংশটা পরে আবার পড়ব"। পড়ুয়া সেটা পড়বে, কিন্তু বইয়ের ছাপা লেখার সাথে মিশে যায় না। HTML comment-ও তেমন।

### ৩. Syntax

```
<!-- এটা একটা comment -->
```

শুরু `<!--`, শেষ `-->`।

### ৪. Code Example

```html
<!-- এটা page-এর শিরোনাম -->
<h1>আমার সাইট</h1>

<!-- নিচের paragraph-টা পরে বদলাব -->
<p>স্বাগতম!</p>
```

### ৫. Output / Result
ব্রাউজারে শুধু দেখাবে — আমার সাইট, আর নিচে — স্বাগতম! Comment দুটো কোথাও দেখা যাবে না।

### ৬. লাইন-বাই-লাইন ব্যাখ্যা
- `<!-- এটা page-এর শিরোনাম -->` → এটা comment, browser skip করে।
- `<h1>আমার সাইট</h1>` → এটা আসল element, দেখা যায়।
- Comment এক লাইনে বা অনেক লাইনে — দুভাবেই লেখা যায়।

### ৭. Try It Yourself

[[tryit]]
<!DOCTYPE html>
<html>
<body>
  <!-- এই লাইনটা দেখা যাবে না -->
  <p>শুধু এটা দেখা যাবে।</p>
</body>
</html>
[[/tryit]]

Comment-এর ভেতরের লেখা বদলাও — তবুও browser-এ কিছু দেখবে না।

### ৮. ছোট Quiz
১. Comment ব্রাউজারে দেখা যায় কি? (ক) হ্যাঁ (খ) না
২. Comment শুরু করতে কী লেখে? (ক) `//` (খ) `<!--` (গ) `#`
৩. এক লাইনে: Comment কেন ব্যবহার করি?

<details>
<summary>উত্তর দেখো</summary>

১. (খ) না
২. (খ) `<!--`
৩. কোডে নোট রাখতে, যাতে পরে বোঝা সহজ হয়।

</details>

### 🎯 Practice Task
একটা page বানাও যাতে ২টা element আর ২টা comment থাকবে — প্রতিটা element-এর উপরে একটা করে comment দেবে কেন এটা আছে।
ইঙ্গিত: Comment আর element আলাদা লাইনে লেখো।

---

## 📌 Chapter 2 — সারসংক্ষেপ

এই chapter-এ শিখলে:
- সম্পূর্ণ HTML page-এর কাঠামো — DOCTYPE, html, head, body
- Tag, Element আর Attribute-এর পার্থক্য
- Comment কীভাবে লিখতে হয়, আর কেন লাগে

পরের chapter-এ শিখবে HTML Heading আর Paragraph — লেখা সাজানোর প্রথম আসল হাতিয়ার।
