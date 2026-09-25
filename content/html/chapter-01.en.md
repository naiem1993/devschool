# Chapter 1: Introduction to HTML

**Goal:** Understand what HTML is and why it matters — then build your first page on your own.

---

## 1.1 What is HTML?

### 1. Simple intro
HTML is a language we use to build websites. Everything you see in the browser — text, images, buttons — is made with HTML. It is not a programming language; it simply tells the browser where each thing goes.

### 2. Real-life example
Imagine you are building a new house. First you put up the walls, the doors, the windows — the structure. Then come the paint and the furniture. A website is just the same — HTML is the walls and the doors.

### 3. Syntax

```
<tag>text</tag>
```

Opening tag → text → closing tag. The closing tag has a `/` in it.

### 4. Code Example

```html
<!DOCTYPE html>
<html>
<body>
  <h1>My First Page</h1>
  <p>This is the first line I wrote.</p>
</body>
</html>
```

### 5. Output / Result
In the browser you will see — in big bold letters: My First Page. Below it, in smaller text: This is the first line I wrote.

### 6. Line-by-line explanation
- `<!DOCTYPE html>` → tells the browser this is a modern HTML file.
- `<html>` → the start of the whole page.
- `<body>` → everything visible goes inside this.
- `<h1>My First Page</h1>` → a large heading.
- `<p>...first line I wrote.</p>` → a small paragraph.
- `</body></html>` → body and html end here.

### 7. Try It Yourself

[[tryit]]
<!DOCTYPE html>
<html>
<body>
  <h1>My First Page</h1>
  <p>This is the first line I wrote.</p>
</body>
</html>
[[/tryit]]

Change the text inside to your own name, then see what happens.

### 8. Small Quiz
1. What kind of language is HTML? (a) Programming (b) Markup (c) Database
2. Why does `</h1>` have a `/`? (a) For styling (b) To close the tag (c) To add color
3. In one line: in which language do we build the structure of everything we see in the browser?

<details>
<summary>Show answers</summary>

1. (b) Markup — HTML is not a programming language, it is a markup language.
2. (b) To close the tag — `/` means the tag ends here.
3. HTML.

</details>

### 🎯 Practice Task
Build a page that contains your name and one favorite sentence.
Hint: `<h1>` for the name, `<p>` for the sentence.

---

## 1.2 What can you build with HTML?

### 1. Simple intro
With HTML you can build the structure of any website — from a personal blog to a large online shop. Everything you see on a page can be arranged with HTML.

### 2. Real-life example
Picture a school notice board. The school's name is written big at the top, notices below it, and a photo at the side. A website is arranged just the same way — only it is on a screen, not on paper.

### 3. Syntax
There is no new syntax here — it is still `<tag>text</tag>`. We are just looking at what kinds of things you can place.

### 4. Code Example

```html
<h1>My Blog</h1>
<p>Today I learned HTML.</p>
<img src="photo.jpg" alt="A photo of me">
```

### 5. Output / Result
In the browser you will see a big heading at the top — My Blog. Below it a line of text, and below that an image (if the image file is available).

### 6. Line-by-line explanation
- `<h1>My Blog</h1>` → the page's main heading.
- `<p>...learned HTML.</p>` → a line of text.
- `<img ...>` → the tag that places an image. It does not need a closing tag.
- `src="photo.jpg"` → the name of the image file.
- `alt="A photo of me"` → text shown if the image cannot be displayed.

### 7. Try It Yourself

[[tryit]]
<!DOCTYPE html>
<html>
<body>
  <h1>My Blog</h1>
  <p>Today I learned HTML.</p>
</body>
</html>
[[/tryit]]

Change the heading to your own blog's name.

### 8. Small Quiz
1. Which tag makes a heading large? (a) `<p>` (b) `<h1>` (c) `<img>`
2. Does the image tag need to be closed? (a) Yes (b) No
3. In one line: what text shows when an image cannot be displayed?

<details>
<summary>Show answers</summary>

1. (b) `<h1>`
2. (b) No — the `<img>` tag does not need to be closed.
3. The text inside `alt`.

</details>

### 🎯 Practice Task
Build a page with one heading, some text, and one image.
Hint: `<h1>`, `<p>`, `<img>` — all three tags together.

---

## 1.3 Your first HTML file — create and save

### 1. Simple intro
You do not need expensive software to write HTML. Any Notepad or text editor will do. Write the code, save the file with a `.html` name, and you are done.

### 2. Real-life example
Think of writing a letter. You write it on paper, put it in an envelope, and write a name on it — then whoever receives it can read it. An HTML file is the same — write the code, save it as `.html`, and the browser can read it.

### 3. Syntax
The file name always ends with `.html`. For example:

```
index.html
about.html
contact.html
```

### 4. Code Example

```html
<!DOCTYPE html>
<html>
<head>
  <title>My Site</title>
</head>
<body>
  <h1>Welcome!</h1>
  <p>This is my first full page.</p>
</body>
</html>
```

### 5. Output / Result
At the top of the browser, on the tab, you will see — My Site. Inside the page, in big text — Welcome! — and below it, a smaller line.

### 6. Line-by-line explanation
- `<head>` → the page's information goes here; it is not shown itself.
- `<title>My Site</title>` → the name shown on the browser tab.
- `<body>` → everything you see with your eyes goes here.
- The rest is the same as before.

### 7. Try It Yourself

[[tryit]]
<!DOCTYPE html>
<html>
<head>
  <title>My Site</title>
</head>
<body>
  <h1>Welcome!</h1>
  <p>This is my first full page.</p>
</body>
</html>
[[/tryit]]

Change the text inside `<title>` and see — what changes on the top tab.

### 8. Small Quiz
1. What does an HTML file name end with? (a) .txt (b) .html (c) .doc
2. In which tag does the browser tab's name go? (a) `<h1>` (b) `<title>` (c) `<p>`
3. In one line: is the content of `<head>` visible in the browser?

<details>
<summary>Show answers</summary>

1. (b) .html
2. (b) `<title>`
3. No — `<head>` only holds information, it is not shown.

</details>

### 🎯 Practice Task
Create a file called `about.html`. Inside it, write the heading `about` and a short introduction of yourself.
Hint: `<head><title>` + `<body>` — write it in two parts.

---

## 📌 Chapter 1 — Summary

In this chapter you learned:
- What HTML is and why it matters
- What kinds of things you can build with HTML
- tag, opening tag, closing tag — their rules
- Creating your first HTML file, saving it, and running it in the browser

In the next chapter you will learn the full structure of an HTML page — DOCTYPE, head, body, and what each part does.
