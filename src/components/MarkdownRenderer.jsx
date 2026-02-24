import { useMemo } from 'react'
import { marked } from 'marked'

const COLLAPSIBLE_HEADINGS = new Set(['tips', 'expected structure'])

/**
 * Finds every <h3> whose text matches a collapsible section name and replaces
 * it with a <details> element (closed by default).  All sibling nodes that
 * follow the heading — up to the next heading of any level — become the body.
 */
function wrapTipSections(html) {
  const doc = new DOMParser().parseFromString(`<div>${html}</div>`, 'text/html')
  const root = doc.body.firstChild

  root.querySelectorAll('h3').forEach(h3 => {
    if (!COLLAPSIBLE_HEADINGS.has(h3.textContent.trim().toLowerCase())) return

    const details = doc.createElement('details')
    const summary = doc.createElement('summary')
    summary.textContent = h3.textContent.trim()
    details.appendChild(summary)

    const body = doc.createElement('div')
    body.className = 'tips-body'

    const toMove = []
    let sibling = h3.nextElementSibling
    while (sibling && !/^H[1-4]$/.test(sibling.tagName)) {
      toMove.push(sibling)
      sibling = sibling.nextElementSibling
    }
    toMove.forEach(el => body.appendChild(el))

    details.appendChild(body)
    h3.replaceWith(details)
  })

  return root.innerHTML
}

export default function MarkdownRenderer({ content }) {
  const html = useMemo(() => {
    if (!content) return ''
    return wrapTipSections(marked(content, { breaks: true, gfm: true }))
  }, [content])

  if (!content) {
    return <p className="text-sm text-gray-400 italic">No description provided.</p>
  }

  return (
    <div
      className="prose prose-sm prose-gray dark:prose-invert max-w-none
        prose-code:before:content-none prose-code:after:content-none
        prose-code:bg-gray-100 prose-code:dark:bg-gray-700 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-xs prose-code:text-gray-800 prose-code:dark:text-gray-200
        prose-pre:bg-gray-100 prose-pre:dark:bg-gray-700 prose-pre:rounded-lg prose-pre:text-gray-800 prose-pre:dark:text-gray-200
        [&_pre_code]:bg-transparent [&_pre_code]:p-0 [&_pre_code]:rounded-none
        [&_details]:mt-4 [&_details]:rounded-lg [&_details]:overflow-hidden [&_details]:border [&_details]:border-gray-200 [&_details]:dark:border-gray-600 [&_details]:not-prose
        [&_summary]:px-3 [&_summary]:py-2.5 [&_summary]:cursor-pointer [&_summary]:select-none [&_summary]:font-semibold [&_summary]:text-xs [&_summary]:uppercase [&_summary]:tracking-wide [&_summary]:text-gray-500 [&_summary]:dark:text-gray-400 [&_summary]:bg-gray-50 [&_summary]:dark:bg-gray-700/50 [&_summary]:list-none
        [&_.tips-body]:px-3 [&_.tips-body]:py-0.5 [&_.tips-body]:border-t [&_.tips-body]:border-gray-200 [&_.tips-body]:dark:border-gray-600"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  )
}
