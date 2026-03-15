import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'react-native-haptic-feedback',
  description: 'Haptic feedback for iOS and Android — Core Haptics, AHAP files, pattern notation, and more.',
  base: '/react-native-haptic-feedback/',

  head: [
    ['link', { rel: 'icon', href: '/react-native-haptic-feedback/favicon.ico' }],
  ],

  themeConfig: {
    logo: { light: '/logo-light.svg', dark: '/logo-dark.svg', alt: 'Logo' },

    nav: [
      { text: 'Guide', link: '/guide/getting-started' },
      { text: 'API', link: '/api/' },
      {
        text: '3.0.0-next',
        items: [
          { text: 'Changelog', link: 'https://github.com/mkuczera/react-native-haptic-feedback/blob/next/CHANGELOG.md' },
          { text: 'npm (next)', link: 'https://www.npmjs.com/package/react-native-haptic-feedback/v/next' },
        ],
      },
    ],

    sidebar: {
      '/guide/': [
        {
          text: 'Guide',
          items: [
            { text: 'Getting Started', link: '/guide/getting-started' },
            { text: 'Pattern Notation', link: '/guide/pattern' },
            { text: 'iOS — Core Haptics', link: '/guide/ios' },
            { text: 'Android', link: '/guide/android' },
            { text: 'AHAP Files', link: '/guide/ahap' },
            { text: 'Testing (Jest)', link: '/guide/testing' },
            { text: 'Migration v2 → v3', link: '/guide/migration' },
          ],
        },
      ],
      '/api/': [
        {
          text: 'API Reference',
          items: [
            { text: 'Overview', link: '/api/' },
            { text: 'trigger()', link: '/api/trigger' },
            { text: 'triggerPattern()', link: '/api/trigger-pattern' },
            { text: 'stop() / isSupported()', link: '/api/control' },
            { text: 'setEnabled() / isEnabled()', link: '/api/enabled' },
            { text: 'getSystemHapticStatus()', link: '/api/system-status' },
            { text: 'playAHAP()', link: '/api/play-ahap' },
            { text: 'playHaptic()', link: '/api/play-haptic' },
            { text: 'pattern()', link: '/api/pattern' },
            { text: 'Patterns presets', link: '/api/presets' },
            { text: 'useHaptics hook', link: '/api/use-haptics' },
            { text: 'TouchableHaptic', link: '/api/touchable-haptic' },
            { text: 'Types', link: '/api/types' },
          ],
        },
      ],
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/mkuczera/react-native-haptic-feedback' },
      { icon: 'npm', link: 'https://www.npmjs.com/package/react-native-haptic-feedback' },
    ],

    editLink: {
      pattern: 'https://github.com/mkuczera/react-native-haptic-feedback/edit/next/docs/:path',
      text: 'Edit this page on GitHub',
    },

    footer: {
      message: 'Released under the MIT License.',
      copyright: 'Copyright © Michael Kuczera',
    },

    search: { provider: 'local' },
  },
})
