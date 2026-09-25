# Chapter 2: HTML Basic Structure

**Goal:** Understand the full structure of an HTML page — DOCTYPE, html, head, body — and know the difference between tag, element, and attribute.

---

## 2.1 HTML Document Structure

### 1. Simple intro
Every HTML page has a fixed structure — just like a letter has one: envelope, recipient's name, the message inside. An HTML page is the same — some parts always appear in the same order.

### 2. Real-life example
Think of a book. First the cover, then the pages inside, then the last page. An HTML page is like that — one part at the top (head), another part below (body). The browser reads this structure to know what to show and what to hide.

### 3. Syntax

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

### 4. Code Example

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>My Page</title>
</head>
<body>
  <h1>Welcome</h1>
  <p>This is a complete HTML page.</p>
</body>
</html>
```

### 5. Output / Result
In the browser you will see — in big text: Welcome. Below it — This is a complete HTML page. And on the top tab you will see — My Page.

### 6. Line-by-line explanation
- `<!DOCTYPE html>` → tells the browser this is an HTML5 file.
- `<html lang="en">` → the start of the whole page; `lang="en"` declares the language.
- `<head>` → the page's information (title, charset) — not shown itself.
- `<body>` → everything visible goes inside this.
- `</body></html>` → both tags close here.

### 7. Try It Yourself

[[tryit]]
<!DOCTYPE html>
<html>
<head>
  <title>Experiment</title>
</head>
<body>
  <h1>Hello!</h1>
</body>
</html>
[[/tryit]]

Change the text inside `<title>` and see what changes on the tab.

### 8. Small Quiz
1. Which line is at the very start of every HTML file? (a) `<html>` (b) `<!DOCTYPE html>` (c) `<body>`
2. Where does everything visible go? (a) `<head>` (b) `<body>` (c) `<title>`
3. In one line: is the content of `<head>` visible in the browser?

<details>
<summary>Show answers</summary>

1. (b) `<!DOCTYPE html>`
2. (b) `<body>`
3. No — `<head>` only holds information, it is not shown.

</details>

### 🎯 Practice Task
Build a complete HTML page with a title in `<head>`, and a heading plus a paragraph in `<body>`.
Hint: keep the whole structure intact and just change the text inside.

---

## 2.2 Tag, Element, Attribute

### 1. Simple intro
These three words sound hard, but they are easy. A tag is the name inside the `< >` symbols. An element is the opening tag + text + closing tag together. An attribute is extra information inside a tag.

### 2. Real-life example
Imagine a door. The word "door" is the tag. The actual door (with handle and wood) is the element. "The red one" — that extra detail — is the attribute.

### 3. Syntax

```
<tagname attribute="value">text</tagname>
```

### 4. Code Example

```html
<p>This is a normal paragraph.</p>
<p title="Secret info">Hover to see.</p>
<a href="https://example.com">Go to link</a>
```

### 5. Output / Result
First line — plain text. Hover over the second line to see a small tooltip — Secret info. The third line becomes a blue clickable link.

### 6. Line-by-line explanation
- `<p>` → paragraph tag.
- `<p>...</p>` as a whole → one element.
- `title="Secret info"` → an attribute (name = title, value = Secret info).
- `<a href="...">` → a link element; the `href` attribute says where to go.
- An attribute is always inside the opening tag in the form `name="value"`.

### 7. Try It Yourself

[[tryit]]
<!DOCTYPE html>
<html>
<body>
  <p title="I am a tooltip">Hover the mouse here.</p>
</body>
</html>
[[/tryit]]

Change the value of `title` and see what shows in the tooltip.

### 8. Small Quiz
1. What do `<h1>` and `</h1>` together make? (a) tag (b) element (c) attribute
2. What is `href="..."`? (a) tag (b) element (c) attribute
3. In one line: where does an attribute always live?

<details>
<summary>Show answers</summary>

1. (b) element
2. (c) attribute
3. Inside the opening tag, in the form `name="value"`.

</details>

### 🎯 Practice Task
Build a link that opens in a new tab.
Hint: `<a href="..." target="_blank">` — here `target` is an attribute.

---

## 2.3 HTML Comment

### 1. Simple intro
A comment is a note written inside the code that the browser never shows. It helps you or someone else understand later why a piece of code exists.

### 2. Real-life example
Imagine you wrote in the margin of a book with a pen — "I'll read this part again". A reader will see it, but it does not mix with the printed text. An HTML comment is the same.

### 3. Syntax

```
<!-- this is a comment -->
```

Starts with `<!--`, ends with `-->`.

### 4. Code Example

```html
<!-- This is the page heading -->
<h1>My Site</h1>

<!-- The paragraph below will be changed later -->
<p>Welcome!</p>
```

### 5. Output / Result
In the browser you will only see — My Site, and below it — Welcome! The comments will not appear anywhere.

### 6. Line-by-line explanation
- `<!-- This is the page heading -->` → a comment, the browser skips it.
- `<h1>My Site</h1>` → a real element, visible.
- A comment can be one line or many lines.

### 7. Try It Yourself

[[tryit]]
<!DOCTYPE html>
<html>
<body>
  <!-- This line will not be shown -->
  <p>Only this will be shown.</p>
</body>
</html>
[[/tryit]]

Change the text inside the comment — still nothing appears in the browser.

### 8. Small Quiz
1. Are comments visible in the browser? (a) Yes (b) No
2. How does a comment start? (a) `//` (b) `<!--` (c) `#`
3. In one line: why do we use comments?

<details>
<summary>Show answers</summary>

1. (b) No
2. (b) `<!--`
3. To leave notes in code, so it is easier to understand later.

</details>

### 🎯 Practice Task
Build a page with 2 elements and 2 comments — one comment above each element explaining why it exists.
Hint: Write the comment and the element on separate lines.

---

## 📌 Chapter 2 — Summary

In this chapter you learned:
- The full structure of an HTML page — DOCTYPE, html, head, body
- The difference between tag, element, and attribute
- How to write comments and why they matter

In the next chapter you will learn HTML Headings and Paragraphs — the first real tools for arranging text.
