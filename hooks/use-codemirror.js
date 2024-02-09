import { useEffect, useState, useRef } from 'react'
import { EditorState } from '@codemirror/state'
import { EditorView, keymap, highlightActiveLine } from '@codemirror/view'
import { defaultKeymap } from '@codemirror/commands'
import { history, historyKeymap } from '@codemirror/history'
import { indentOnInput } from '@codemirror/language'
import { bracketMatching } from '@codemirror/matchbrackets'
import { lineNumbers, highlightActiveLineGutter } from '@codemirror/gutter'
import {
  defaultHighlightStyle,
  HighlightStyle,
  tags,
} from '@codemirror/highlight'
import { markdown, markdownLanguage } from '@codemirror/lang-markdown'
import { languages } from '@codemirror/language-data'
import { oneDark } from '@codemirror/theme-one-dark'

const syntaxHighlighting = HighlightStyle.define([
  {
    tag: tags.heading1,
    fontSize: '2em',
    fontWeight: 'bold',
  },
  {
    tag: tags.heading2,
    fontSize: '1.5em',
    fontWeight: 'bold',
  },
  {
    tag: tags.heading3,
    fontSize: '1.17em',
    fontWeight: 'bold',
  },
  {
    tag: tags.heading4,
    fontSize: '1em',
    fontWeight: 'bold',
  },
  {
    tag: tags.heading5,
    fontSize: '0.83em',
    fontWeight: 'bold',
  },
  {
    tag: tags.heading6,
    fontSize: '0.75em',
    fontWeight: 'bold',
  },
])

export const transparentTheme = EditorView.theme({
  '&': {
    height: '100%',
  },
})

const useCodeMirror = (props) => {
  const refContainer = useRef(null)
  const [editorView, setEditorView] = useState()
  const { onChange } = props

  useEffect(() => {
    if (!refContainer.current) return
    const startState = EditorState.create({
      doc: props.initialDoc,
      extensions: [
        keymap.of([...defaultKeymap, ...historyKeymap]),
        lineNumbers(),
        highlightActiveLineGutter(),
        history(),
        indentOnInput(),
        bracketMatching(),
        defaultHighlightStyle.fallback,
        highlightActiveLine(),
        markdown({
          base: markdownLanguage,
          codeLanguages: languages,
          addKeymap: true,
        }),
        oneDark,
        transparentTheme,
        syntaxHighlighting,
        EditorView.lineWrapping,
        EditorView.updateListener.of((update) => {
          if (update.changes) {
            onChange && onChange(update.state)
          }
        }),
      ],
    })

    const view = new EditorView({
      state: startState,
      parent: refContainer.current,
    })
    setEditorView(view)
    return () => {}
  }, [refContainer])

  return [refContainer, editorView]
}

export default useCodeMirror
