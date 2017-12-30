/**
 * MIT License
 *
 * Copyright (c) 2017 Harsh Gupta
 * https://github.com/hgupta/svg-text-wrap
 */

'use strict'
;((context, name) => {
  if (
    !(
      context.document &&
      context.location &&
      context.alert &&
      context.setInterval
    )
  ) {
    throw new Error('[SVGTextWrap] Browser not detected')
  }

  context[name] = [
    'University of Pennsylvania',
    'International Business Machine',
    'Baring Private Equity Asia',
    'Banking Business Financial Managementtttttttt',
    'IBM'
  ]
})(window, 'labels')
