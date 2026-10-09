'use client'

import React, { useEffect, useRef, useState } from 'react'

type Props = {
  value: string
  onChange: (e: { target: { value: string } }) => void
  rows?: number
  minHeight?: number
  placeholder?: string
  className?: string
  required?: boolean
  disabled?: boolean
  name?: string
  id?: string
  maxLength?: number
}

const MBTN =
  'rounded-md border px-2.5 py-1 text-[11px] font-bold transition-colors flex items-center justify-center min-w-[32px]'

export default function RichEditor({
  value,
  onChange,
  rows = 12,
  minHeight,
  placeholder = 'এখানে lesson লিখো…',
  className,
  required: _required,
  disabled: _disabled,
  name: _name,
  id: _id,
  maxLength: _maxLength,
}: Props) {
  void _required
  void _disabled
  void _name
  void _id
  void _maxLength
  const visualRef = useRef<HTMLDivElement | null>(null)
  const htmlRef = useRef<HTMLTextAreaElement | null>(null)
  const [isHtmlMode, setIsHtmlMode] = useState(false)
  const savedSelection = useRef<Range | null>(null)
  const h = minHeight ?? Math.max(200, rows * 22)

  useEffect(() => {
    const el = visualRef.current
    if (!el || isHtmlMode) return
    if (document.activeElement !== el && el.innerHTML !== value) {
      el.innerHTML = value
    }
  }, [value, isHtmlMode])

  const fire = () => {
    if (isHtmlMode) {
      const el = htmlRef.current
      if (el) onChange({ target: { value: el.value } })
    } else {
      const el = visualRef.current
      if (el) onChange({ target: { value: el.innerHTML } })
    }
  }

  const saveSelection = () => {
    if (isHtmlMode) return
    const sel = window.getSelection()
    if (sel && sel.rangeCount > 0) {
      savedSelection.current = sel.getRangeAt(0).cloneRange()
    }
  }

  const restoreSelection = () => {
    if (isHtmlMode) return
    if (savedSelection.current && visualRef.current) {
      const sel = window.getSelection()
      if (sel) {
        sel.removeAllRanges()
        sel.addRange(savedSelection.current)
      }
      visualRef.current.focus()
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      const sel = window.getSelection()
      if (!sel || sel.rangeCount === 0) return

      const range = sel.getRangeAt(0)
      let currentBlock = range.startContainer
      while (
        currentBlock &&
        currentBlock !== visualRef.current &&
        !['DIV', 'P', 'H1', 'H2', 'H3', 'BLOCKQUOTE', 'LI', 'PRE'].includes(
          (currentBlock as HTMLElement).tagName
        )
      ) {
        currentBlock = currentBlock.parentNode as Node
      }

      if (!currentBlock || currentBlock === visualRef.current) return

      const blockEl = currentBlock as HTMLElement
      const newDiv = document.createElement('div')
      newDiv.innerHTML = '<br>'
      blockEl.parentNode?.insertBefore(newDiv, blockEl.nextSibling)

      const newRange = document.createRange()
      newRange.setStart(newDiv, 0)
      newRange.collapse(true)
      sel.removeAllRanges()
      sel.addRange(newRange)

      document.execCommand('removeFormat', false)
      saveSelection()
      fire()
    }
  }

  // 🟢 Callout / Highlight অ্যাকশন (Note, Warn, Tip, Important)
  const handleInsertText = (tag: string) => {
    const startTag = `[[${tag}]]`
    const endTag = `[[/${tag}]]`
    const fallbackText = `${startTag}\n\n${endTag}`

    if (isHtmlMode) {
      const el = htmlRef.current
      if (!el) return
      const start = el.selectionStart
      const end = el.selectionEnd
      const selected = el.value.substring(start, end)

      if (selected) {
        const newText = el.value.substring(0, start) + startTag + selected + endTag + el.value.substring(end)
        onChange({ target: { value: newText } })
        setTimeout(() => {
          el.focus()
          el.setSelectionRange(start + startTag.length + selected.length + endTag.length, start + startTag.length + selected.length + endTag.length)
        }, 0)
      } else {
        const newText = el.value.substring(0, start) + fallbackText + el.value.substring(end)
        onChange({ target: { value: newText } })
        setTimeout(() => {
          el.focus()
          el.setSelectionRange(start + startTag.length + 1, start + startTag.length + 1)
        }, 0)
      }
    } else {
      const el = visualRef.current
      if (!el) return
      
      restoreSelection()
      const sel = window.getSelection()
      if (!sel || sel.rangeCount === 0) return

      const r = sel.getRangeAt(0)

      // 🟢 যদি টেক্সট সিলেক্ট করা থাকে
      if (!sel.isCollapsed) {
        // সিলেক্টেড কনটেন্টের HTML স্ট্রিং বানাও (cloneContents দিয়ে, যাতে DOM অক্ষত থাকে)
        const frag = r.cloneContents()
        const tempDiv = document.createElement('div')
        tempDiv.appendChild(frag)
        const selectedHTML = tempDiv.innerHTML

        // insertHTML কমান্ড দিয়ে পুরোটা একসাথে বসাও (এরর-ফ্রি)
        const insertHTML = `${startTag}<br>${selectedHTML}<br>${endTag}`
        document.execCommand('insertHTML', false, insertHTML)
      } 
      // 🟢 যদি কিছু সিলেক্ট না করা থাকে (শুধু কার্সর থাকে)
      else {
        let node: Node | null = r.startContainer
        while (
          node &&
          node !== el &&
          !['DIV', 'P', 'H1', 'H2', 'H3', 'BLOCKQUOTE', 'LI', 'PRE'].includes(
            (node as HTMLElement).tagName
          )
        ) {
          node = node.parentNode
        }
        const block = node as HTMLElement
        if (block && block !== el) {
          const innerHTML = block.innerHTML.trim()
          if (innerHTML === '' || innerHTML === '<br>') {
            // খালি লাইন: শুধু ট্যাগ বসাও এবং কার্সর মাঝখানে রাখো
            block.innerHTML = `${startTag}<br><br>${endTag}`
            const newRange = document.createRange()
            newRange.setStart(block, 1)
            newRange.collapse(true)
            sel.removeAllRanges()
            sel.addRange(newRange)
          } else {
            // লাইনে টেক্সট আছে: পুরো লাইনটাকে র্যাপ করো
            const currentText = block.innerHTML
            block.innerHTML = `${startTag}<br>${currentText}<br>${endTag}`
            const newRange = document.createRange()
            newRange.selectNodeContents(block)
            newRange.collapse(false)
            sel.removeAllRanges()
            sel.addRange(newRange)
          }
        }
      }
      saveSelection()
      fire()
    }
  }

  const handleInsertRawText = (text: string) => {
    const formatted = text.trim().replace(/\n/g, '<br>')
    if (isHtmlMode) {
      const el = htmlRef.current
      if (!el) return
      const start = el.selectionStart
      const end = el.selectionEnd
      const newText = el.value.substring(0, start) + text + el.value.substring(end)
      onChange({ target: { value: newText } })
      setTimeout(() => {
        el.focus()
        el.setSelectionRange(start + text.length, start + text.length)
      }, 0)
    } else {
      const el = visualRef.current
      if (!el) return
      restoreSelection()
      const sel = window.getSelection()
      if (!sel || sel.rangeCount === 0) {
        el.innerHTML += '<div>' + formatted + '</div>'
        fire()
        return
      }
      const r = sel.getRangeAt(0)
      r.deleteContents()
      const tn = document.createTextNode(text)
      r.insertNode(tn)
      r.setStartAfter(tn)
      r.setEndAfter(tn)
      sel.removeAllRanges()
      sel.addRange(r)
      saveSelection()
      fire()
    }
  }

  const handleBlockAction = (tag: string) => {
    if (isHtmlMode) {
      const el = htmlRef.current
      if (!el) return
      const start = el.selectionStart
      const end = el.selectionEnd
      const selected = el.value.substring(start, end)
      const newText = el.value.substring(0, start) + `<${tag}>` + selected + `</${tag}>` + el.value.substring(end)
      onChange({ target: { value: newText } })
      setTimeout(() => {
        el.focus()
        el.setSelectionRange(start + tag.length + 2 + selected.length + tag.length + 3, start + tag.length + 2 + selected.length + tag.length + 3)
      }, 0)
    } else {
      restoreSelection()
      document.execCommand('formatBlock', false, tag)
      fire()
    }
  }

  const handleInlineAction = (command: string, tag: string) => {
    if (isHtmlMode) {
      const el = htmlRef.current
      if (!el) return
      const start = el.selectionStart
      const end = el.selectionEnd
      const selected = el.value.substring(start, end)
      const newText = el.value.substring(0, start) + `<${tag}>` + selected + `</${tag}>` + el.value.substring(end)
      onChange({ target: { value: newText } })
      setTimeout(() => {
        el.focus()
        el.setSelectionRange(start + tag.length + 2 + selected.length + tag.length + 3, start + tag.length + 2 + selected.length + tag.length + 3)
      }, 0)
    } else {
      restoreSelection()
      document.execCommand(command, false)
      fire()
    }
  }

  const handleApplyLink = () => {
    const url = window.prompt('URL দিন (যেমন /tutorials/html/3 বা https://...)')
    if (!url) return
    if (isHtmlMode) {
      const el = htmlRef.current
      if (!el) return
      const start = el.selectionStart
      const end = el.selectionEnd
      const selected = el.value.substring(start, end)
      const newText = el.value.substring(0, start) + `<a href="${url}">` + selected + `</a>` + el.value.substring(end)
      onChange({ target: { value: newText } })
      setTimeout(() => {
        el.focus()
        el.setSelectionRange(start + url.length + 10 + selected.length + 4, start + url.length + 10 + selected.length + 4)
      }, 0)
    } else {
      restoreSelection()
      const sel = window.getSelection()
      if (!sel || sel.rangeCount === 0 || sel.isCollapsed) return
      const r = sel.getRangeAt(0)
      const a = document.createElement('a')
      a.href = url
      if (/^https?:\/\//i.test(url)) {
        a.target = '_blank'
        a.rel = 'noopener noreferrer'
      }
      a.style.color = '#22C55E'
      a.style.textDecoration = 'underline'
      try {
        r.surroundContents(a)
      } catch {
        const frag = r.extractContents()
        a.appendChild(frag)
        r.insertNode(a)
      }
      sel.removeAllRanges()
      fire()
    }
  }

  const handleClearFormat = () => {
    if (isHtmlMode) {
      const el = htmlRef.current
      if (!el) return
      const start = el.selectionStart
      const end = el.selectionEnd
      if (start !== end) {
        const newText = el.value.substring(0, start) + el.value.substring(end)
        onChange({ target: { value: newText } })
        setTimeout(() => {
          el.focus()
          el.setSelectionRange(start, start)
        }, 0)
      }
    } else {
      restoreSelection()
      document.execCommand('removeFormat', false)
      document.execCommand('formatBlock', false, 'p')
      fire()
    }
  }

  const handlePaste = (e: React.ClipboardEvent<HTMLDivElement>) => {
    e.preventDefault()
    const text = e.clipboardData.getData('text/plain')
    if (text) {
      document.execCommand('insertText', false, text)
      saveSelection()
      fire()
    }
  }

  return (
    <div
      className={
        className ||
        'rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden bg-white dark:bg-gray-900'
      }
    >
      <div className="border-b border-gray-200 dark:border-gray-700 bg-gray-50/60 dark:bg-black/20 p-2 space-y-1.5">
        
        {/* Mode Toggle */}
        <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-700 pb-1.5 mb-1.5">
          <span className="text-[10px] uppercase tracking-widest font-mono text-gray-400 mr-1">Mode:</span>
          <button
            type="button"
            onClick={() => setIsHtmlMode(!isHtmlMode)}
            className={`${MBTN} ${isHtmlMode ? 'border-purple-500/40 text-purple-600 dark:text-purple-400 bg-purple-500/10' : 'border-slate-400/40 text-slate-600 dark:text-slate-300 hover:bg-slate-500/10'}`}
          >
            {isHtmlMode ? '👁️ Visual Mode' : '📝 HTML Code Mode'}
          </button>
        </div>

        {/* Block Formatting */}
        <div className="flex flex-wrap items-center gap-1.5 border-b border-gray-200 dark:border-gray-700 pb-1.5 mb-1.5">
          <span className="text-[10px] uppercase tracking-widest font-mono text-gray-400 mr-1">Block:</span>
          {['h1', 'h2', 'h3', 'p'].map((tag) => (
            <button key={tag} type="button" onMouseDown={(e) => { e.preventDefault(); saveSelection(); }} onClick={() => handleBlockAction(tag)} className={`${MBTN} border-slate-400/40 text-slate-600 dark:text-slate-300 hover:bg-slate-500/10`}>
              {tag.toUpperCase()}
            </button>
          ))}
          <button type="button" onMouseDown={(e) => { e.preventDefault(); saveSelection(); }} onClick={() => handleBlockAction('blockquote')} className={`${MBTN} border-slate-400/40 text-slate-600 dark:text-slate-300 hover:bg-slate-500/10`}>❝</button>
          <button type="button" onMouseDown={(e) => { e.preventDefault(); saveSelection(); }} onClick={() => handleBlockAction('pre')} className={`${MBTN} border-slate-400/40 text-slate-600 dark:text-slate-300 hover:bg-slate-500/10`}>Code</button>
          <button type="button" onMouseDown={(e) => { e.preventDefault(); saveSelection(); }} onClick={() => handleBlockAction('ul')} className={`${MBTN} border-slate-400/40 text-slate-600 dark:text-slate-300 hover:bg-slate-500/10`}>• List</button>
          <button type="button" onMouseDown={(e) => { e.preventDefault(); saveSelection(); }} onClick={() => handleBlockAction('ol')} className={`${MBTN} border-slate-400/40 text-slate-600 dark:text-slate-300 hover:bg-slate-500/10`}>1. List</button>
        </div>

        {/* Inline Formatting */}
        <div className="flex flex-wrap items-center gap-1.5 border-b border-gray-200 dark:border-gray-700 pb-1.5 mb-1.5">
          <span className="text-[10px] uppercase tracking-widest font-mono text-gray-400 mr-1">Inline:</span>
          <button type="button" onMouseDown={(e) => { e.preventDefault(); saveSelection(); }} onClick={() => handleInlineAction('bold', 'b')} className={`${MBTN} border-slate-400/40 text-slate-600 dark:text-slate-300 hover:bg-slate-500/10`}><b>B</b></button>
          <button type="button" onMouseDown={(e) => { e.preventDefault(); saveSelection(); }} onClick={() => handleInlineAction('italic', 'i')} className={`${MBTN} border-slate-400/40 text-slate-600 dark:text-slate-300 hover:bg-slate-500/10`}><i>I</i></button>
          <button type="button" onMouseDown={(e) => { e.preventDefault(); saveSelection(); }} onClick={() => handleInlineAction('underline', 'u')} className={`${MBTN} border-slate-400/40 text-slate-600 dark:text-slate-300 hover:bg-slate-500/10`}><u>U</u></button>
          <button type="button" onMouseDown={(e) => { e.preventDefault(); saveSelection(); }} onClick={handleApplyLink} className={`${MBTN} border-[#22C55E]/40 text-[#15803d] dark:text-[#4ADE80] hover:bg-[#22C55E]/10`}>🔗 Link</button>
          <button type="button" onMouseDown={(e) => { e.preventDefault(); saveSelection(); }} onClick={handleClearFormat} className={`${MBTN} border-slate-400/40 text-slate-500 hover:bg-slate-500/10`}>✕ Clear</button>
        </div>

        {/* Custom Callouts */}
        <div className="flex flex-wrap items-center gap-1.5 border-b border-gray-200 dark:border-gray-700 pb-1.5 mb-1.5">
          <span className="text-[10px] uppercase tracking-widest font-mono text-gray-400 mr-1">Insert:</span>
          <button type="button" onMouseDown={(e) => { e.preventDefault(); saveSelection(); }} onClick={() => handleInsertText('tryit')} className={`${MBTN} border-emerald-500/40 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/10`}>+ Try It</button>
          <button type="button" onMouseDown={(e) => { e.preventDefault(); saveSelection(); }} onClick={() => handleInsertText('note')} className={`${MBTN} border-amber-500/40 text-amber-600 dark:text-amber-400 hover:bg-amber-500/10`}>+ Note</button>
          <button type="button" onMouseDown={(e) => { e.preventDefault(); saveSelection(); }} onClick={() => handleInsertText('warn')} className={`${MBTN} border-red-500/40 text-red-600 dark:text-red-400 hover:bg-red-500/10`}>+ Warn</button>
          <button type="button" onMouseDown={(e) => { e.preventDefault(); saveSelection(); }} onClick={() => handleInsertText('tip')} className={`${MBTN} border-emerald-500/40 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/10`}>+ Tip</button>
          <button type="button" onMouseDown={(e) => { e.preventDefault(); saveSelection(); }} onClick={() => handleInsertText('important')} className={`${MBTN} border-blue-500/40 text-blue-600 dark:text-blue-400 hover:bg-blue-500/10`}>+ Important</button>
          <button type="button" onMouseDown={(e) => { e.preventDefault(); saveSelection(); }} onClick={() => handleInsertRawText('[[link:/tutorials/slug/1|বাটনের লেখা|green]]\n')} className={`${MBTN} border-blue-500/40 text-blue-600 dark:text-blue-400 hover:bg-blue-500/10`}>+ Link</button>
        </div>

        {/* Highlight Colors */}
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-[10px] uppercase tracking-widest font-mono text-gray-400 mr-1">Highlight:</span>
          <button type="button" onMouseDown={(e) => { e.preventDefault(); saveSelection(); }} onClick={() => handleInsertText('note')} className={`${MBTN} border-amber-500/40 text-amber-600 dark:text-amber-400 hover:bg-amber-500/10`}>🟡 Yellow</button>
          <button type="button" onMouseDown={(e) => { e.preventDefault(); saveSelection(); }} onClick={() => handleInsertText('warn')} className={`${MBTN} border-red-500/40 text-red-600 dark:text-red-400 hover:bg-red-500/10`}>🔴 Red</button>
          <button type="button" onMouseDown={(e) => { e.preventDefault(); saveSelection(); }} onClick={() => handleInsertText('tip')} className={`${MBTN} border-emerald-500/40 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/10`}>🟢 Green</button>
          <button type="button" onMouseDown={(e) => { e.preventDefault(); saveSelection(); }} onClick={() => handleInsertText('important')} className={`${MBTN} border-blue-500/40 text-blue-600 dark:text-blue-400 hover:bg-blue-500/10`}>🔵 Blue</button>
        </div>
      </div>

      {/* Editor Body */}
      {isHtmlMode ? (
        <textarea
          ref={htmlRef}
          value={value}
          onChange={(e) => onChange({ target: { value: e.target.value } })}
          className="w-full bg-slate-50 dark:bg-[#0a120d] px-3 py-2 text-sm font-mono text-slate-800 dark:text-emerald-300 outline-none resize-y"
          style={{ minHeight: h }}
          placeholder="এখানে সরাসরি HTML কোড লিখুন... (যেমন: <h1>HTML Tutorial</h1>)"
          spellCheck={false}
        />
      ) : (
        <div
          ref={visualRef}
          contentEditable
          suppressContentEditableWarning
          onInput={() => { saveSelection(); fire(); }}
          onBlur={fire}
          onKeyDown={handleKeyDown}
          onMouseUp={saveSelection}
          onKeyUp={saveSelection}
          onPaste={handlePaste}
          data-placeholder={placeholder}
          className="px-3 py-2 text-sm leading-relaxed text-gray-900 dark:text-gray-100 outline-none prose prose-sm max-w-none dark:prose-invert"
          style={{ minHeight: h }}
        />
      )}
    </div>
  )
}