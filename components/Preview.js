import { unified } from 'unified'
import remarkParse from 'remark-parse'
import remarkGfm from 'remark-gfm'
import remarkReact from 'remark-react'
import { defaultSchema } from 'hast-util-sanitize'
import RemarkCode from '../helpers/remark-code'
import 'github-markdown-css/github-markdown.css'
import React from 'react'

const Preview = (props) => {
  const schema = {
    ...defaultSchema,
    attributes: {
      ...defaultSchema.attributes,
      code: [...(defaultSchema.attributes?.code || []), 'className'],
    },
  }

  const markdown = unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkReact, {
      createElement: React.createElement,
      sanitize: schema,
      remarkReactComponents: {
        code: RemarkCode,
      },
    })
    .processSync(props.doc).result

  return (
    <div className='preview-wrapper relative'>
      <div className='not-prose'>
        <div className='flex items-center space-x-2'>
          <h6 className='text-neutral-500 font-medium text-sm'>
            Live Markdown Preview ↴
          </h6>
        </div>
        <hr className='border-neutral-800 my-3' />
      </div>
      {markdown}
    </div>
  )
}

export default Preview
