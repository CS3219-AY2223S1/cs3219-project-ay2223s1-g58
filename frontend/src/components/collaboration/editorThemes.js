// Source: https://github.com/codemirror/theme-one-dark/blob/main/src/one-dark.ts
// With modifications to fit our needs
import { EditorView } from '@codemirror/view'
import { HighlightStyle, syntaxHighlighting } from '@codemirror/language'
import { tags as t } from '@lezer/highlight'

// Using https://github.com/one-dark/vscode-one-dark-theme/ as reference for the colors

const chalky = '#e5c07b',
  coral = '#e06c75',
  cyan = '#56b6c2',
  invalid = '#ffffff',
  ivory = '#abb2bf',
  stone = '#7d8799', // Brightened compared to original to increase contrast
  malibu = '#61afef',
  sage = '#98c379',
  whiskey = '#d19a66',
  violet = '#c678dd',
  darkBackground = '#21252b',
  highlightBackground = '#2c313a',
  background = '#282c34',
  selection = '#3E4451',
  cursor = '#528bff'

// The editor theme styles for One Dark.
const oneDarkTheme = EditorView.theme(
  {
    '&': {
      color: ivory,
      backgroundColor: background,
      // My own styles
      height: '85vh',
      borderColor: 'd3d3d3',
      borderWidth: '3px',
    },

    // Colour of the other user's selection. A lighter, greener shade than this user's selection
    '.cm-other-selection': {
      backgroundColor: '#4e524e',
    },
    // Colour of the other user's cursor. Same colour as light mode (magenta)
    '.cm-tooltip.cm-other-cursor': {
      backgroundColor: "magenta",
      padding: "8px 0.75px",
    },

    '.cm-content': {
      caretColor: cursor,
    },
    '.cm-cursor, .cm-dropCursor': { borderLeftColor: cursor },
    '&.cm-focused .cm-selectionBackground, .cm-selectionBackground, .cm-content ::selection':
      { backgroundColor: selection },

    '.cm-panels': { backgroundColor: darkBackground, color: ivory },
    '.cm-panels.cm-panels-top': { borderBottom: '2px solid black' },
    '.cm-panels.cm-panels-bottom': { borderTop: '2px solid black' },

    '.cm-searchMatch': {
      backgroundColor: '#72a1ff59',
      outline: '1px solid #457dff',
    },
    '.cm-searchMatch.cm-searchMatch-selected': {
      backgroundColor: '#6199ff2f',
    },

    '.cm-activeLine': { backgroundColor: '#6699ff0b' },
    '.cm-selectionMatch': { backgroundColor: '#aafe661a' },

    '&.cm-focused .cm-matchingBracket, &.cm-focused .cm-nonmatchingBracket': {
      backgroundColor: '#bad0f847',
      outline: '1px solid #515a6b',
    },

    '.cm-gutters': {
      backgroundColor: background,
      color: stone,
      border: 'none',
    },
    '.cm-activeLineGutter': {
      backgroundColor: highlightBackground,
    },

    '.cm-foldPlaceholder': {
      backgroundColor: 'transparent',
      border: 'none',
      color: '#ddd',
    },
  },
  { dark: true }
)

// The syntax highlighting style for code in One Dark.
const oneDarkHighlightStyle = HighlightStyle.define([
  { tag: t.keyword, color: violet },
  {
    tag: [t.name, t.deleted, t.character, t.propertyName, t.macroName],
    color: coral,
  },
  { tag: [t.function(t.variableName), t.labelName], color: malibu },
  { tag: [t.color, t.constant(t.name), t.standard(t.name)], color: whiskey },
  { tag: [t.definition(t.name), t.separator], color: ivory },
  {
    tag: [
      t.typeName,
      t.className,
      t.number,
      t.changed,
      t.annotation,
      t.modifier,
      t.self,
      t.namespace,
    ],
    color: chalky,
  },
  {
    tag: [
      t.operator,
      t.operatorKeyword,
      t.url,
      t.escape,
      t.regexp,
      t.link,
      t.special(t.string),
    ],
    color: cyan,
  },
  { tag: [t.meta, t.comment], color: stone },
  { tag: t.strong, fontWeight: 'bold' },
  { tag: t.emphasis, fontStyle: 'italic' },
  { tag: t.strikethrough, textDecoration: 'line-through' },
  { tag: t.link, color: stone, textDecoration: 'underline' },
  { tag: t.heading, fontWeight: 'bold', color: coral },
  { tag: [t.atom, t.bool, t.special(t.variableName)], color: whiskey },
  { tag: [t.processingInstruction, t.string, t.inserted], color: sage },
  { tag: t.invalid, color: invalid },
])

// Extension for One Dark theme
export const oneDark = [oneDarkTheme, syntaxHighlighting(oneDarkHighlightStyle)]

// Extension for light mode
export const lightTheme = EditorView.theme({
  '&': {
    height: '85vh',
    borderColor: 'd3d3d3',
    borderWidth: '3px',
  },
  '.cm-cursor': {
    borderColor: 'black',
    borderWidth: '1px',
  },
  '.cm-other-selection': {
    backgroundColor: 'lightblue',
  },
  '.cm-other-cursor': {
    borderColor: 'magenta',
    height: '16px',
  },          
})
