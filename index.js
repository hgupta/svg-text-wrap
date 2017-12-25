/**
 * MIT License
 *
 * Copyright (c) 2017 Harsh Gupta
 * https://github.com/hgupta/svg-text-wrap
 */

'use strict'
;((context, name) => {
  const CONTINUATOR = '\u2026'

  const getCanvasContext = (fontSize, fontName) => {
    const ctx = context.document.createElement('canvas').getContext('2d')
    ctx.font = `${fontSize}px ${fontName}`
    return ctx
  }

  const getMaxChords = (radius, fontSize) => Math.floor(radius * 2 / fontSize)

  const _wrapper = (opts, ctx, words, maxChordsAllowed) => {
    const measureTextWidthInCanvas = (ctx, text) => ctx.measureText(text).width

    const trimWord = (appendTo, word, availableWidth) =>
      appendTo +
      ' ' +
      Array(word.length)
        .fill(word)
        .map((w, i) => w.substr(0, word.length - i - 2) + CONTINUATOR)
        .slice(0, -2)
        .filter(w => measureTextWidthInCanvas(ctx, w) < availableWidth)
        .shift()

    const getChordWidth = height =>
      Math.sqrt(opts.radius * opts.radius - height * height) * 2

    const createEmptyChord = (chordCount, chordIndex) => {
      let halfChordCount = chordCount / 2
      let rule = (1 + chordIndex - halfChordCount) * opts.lineHeight
      let atHeight = chordIndex < halfChordCount ? rule - opts.lineHeight : rule
      let remainingWidth = getChordWidth(atHeight)
      return { rule, remainingWidth, text: '' }
    }

    const areAllChordsFilled = chords =>
      chords.filter(chord => chord.text.length === 0).length === 0

    const fitTextInChord = (remainingWidth, wordsConsumed = 0, text = '') => {
      const textWidth = measureTextWidthInCanvas(
        ctx,
        ` ${words[wordsConsumed]}`
      )
      if (wordsConsumed >= words.length || textWidth > remainingWidth) {
        return [wordsConsumed, remainingWidth, text]
      }
      text = `${text} ${words[wordsConsumed]}`
      remainingWidth = remainingWidth - textWidth
      return fitTextInChord(remainingWidth, wordsConsumed + 1, text)
    }

    const fitLabelInChords = (
      chordCount,
      chords = [],
      wordsConsumed = 0,
      chordIndex = 0
    ) => {
      if (chordIndex === chordCount) {
        if (wordsConsumed < words.length) {
          let chord = chords[chordCount - 1]
          chord.text = trimWord(
            chord.text,
            words[wordsConsumed],
            chord.remainingWidth
          )
        }
        return { chords, wordsConsumed }
      }

      let chord = createEmptyChord(chordCount, chordIndex)
      ;[wordsConsumed, chord.remainingWidth, chord.text] = fitTextInChord(
        chord.remainingWidth,
        wordsConsumed
      )
      chords.push(chord)
      return fitLabelInChords(chordCount, chords, wordsConsumed, chordIndex + 1)
    }

    const wrap = (currentChordCount = 1, betterChords = []) => {
      if (currentChordCount >= maxChordsAllowed) return betterChords

      let { chords, wordsConsumed } = fitLabelInChords(currentChordCount)

      if (areAllChordsFilled(chords)) betterChords = chords
      if (wordsConsumed >= words.length) return betterChords

      return wrap(currentChordCount + 1, betterChords)
    }
    return wrap
  }

  const setDefaultOptions = options =>
    Object.assign(
      {
        splitter: lbl => lbl.split(' '),
        fontSize: 10,
        fontName: 'sans-serif',
        lineHeight: 12,
        radius: 40
      },
      options
    )

  const main = (label, options = {}) => {
    if (typeof label !== 'string') {
      throw new Error('[SVGTextWrap] [TypeMismatch] Label must be a string.')
    }
    const opts = setDefaultOptions(options)
    const words = opts.splitter.call(null, label)

    const ctx = getCanvasContext(opts.fontSize, opts.fontName)
    const maxChords = getMaxChords(opts.radius, opts.fontSize)
    const wrap = _wrapper(opts, ctx, words, maxChords)
    return wrap()
  }

  if (typeof context !== 'undefined') {
    if (context.hasOwnProperty(name)) {
      context[`@__${name}__`] = context[name]
      context[name] = undefined
    }
    context[name] = main
  }
})(window || new Error('[SVGTextWrap] Browser not detected'), 'SVGTextWrap')
