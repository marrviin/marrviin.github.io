export default {
  extends: ['stylelint-config-standard'],
  rules: {
    // Tailwind v4 CSS-first at-rules
    'at-rule-no-unknown': [
      true,
      {
        ignoreAtRules: [
          'theme',
          'source',
          'utility',
          'variant',
          'custom-variant',
          'apply',
          'reference',
          'config',
          'plugin',
          'layer',
        ],
      },
    ],
    // @apply (deprecated CSS at-rule) is used intentionally for Tailwind
    'at-rule-no-deprecated': null,
    // @apply prelude is Tailwind syntax, not standard CSS
    'at-rule-prelude-no-invalid': null,
    // BEM-style hook classes (.shot-deck__card) and Tailwind conventions
    'selector-class-pattern': null,
    // -webkit-background-clip: text is still required for the sheen title
    'property-no-vendor-prefix': null,
    'custom-property-pattern': null,
    // `@import 'tailwindcss'` must stay in string notation for the Vite plugin
    'import-notation': 'string',
    'selector-pseudo-class-no-unknown': [true, { ignorePseudoClasses: ['global'] }],
    // keyframe percentage selectors like 0%, 100% on one line
    'keyframe-block-no-duplicate-selectors': null,
  },
}
