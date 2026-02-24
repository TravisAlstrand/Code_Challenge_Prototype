import { useMemo } from 'react'
import { marked } from 'marked'

export default function MarkdownRenderer({ content }) {
  const html = useMemo(() => {
    if (!content) return ''
    return marked(content, { breaks: true, gfm: true })
  }, [content])

  if (!content) {
    return <p className="text-sm text-gray-400 italic">No description provided.</p>
  }

  return (
    <div
      className="prose prose-sm prose-gray dark:prose-invert max-w-none
        prose-code:before:content-none prose-code:after:content-none
        prose-code:bg-gray-100 prose-code:dark:bg-gray-700 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-xs prose-code:text-gray-800 prose-code:dark:text-gray-200
        prose-pre:bg-gray-100 prose-pre:dark:bg-gray-800 prose-pre:rounded-lg prose-pre:text-gray-800 prose-pre:dark:text-gray-200
        [&_pre_code]:bg-transparent [&_pre_code]:p-0 [&_pre_code]:rounded-none"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  )
}
