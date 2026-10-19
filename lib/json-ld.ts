/**
 * Safe JSON-LD serialization for embedding inside a <script> tag.
 *
 * `JSON.stringify` alone is unsafe here: a string value containing `</script>`
 * would close the tag early and let the rest of the JSON be parsed as HTML
 * (stored XSS). Escaping `<` (and the JS line separators `\u2028`/`\u2029`,
 * which are valid in JSON but not in JS string literals) makes the output
 * safe to inject via dangerouslySetInnerHTML.
 */
export function serializeJsonLd(data: unknown): string {
  return JSON.stringify(data)
    .replace(/</g, '\\u003c')
    .replace(/\u2028/g, '\\u2028')
    .replace(/\u2029/g, '\\u2029')
}
