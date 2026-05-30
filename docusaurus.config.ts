import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';

// NOTE: Update `organizationName` / `url` if the repo lives under a different owner.
const config: Config = {
  title: 'Zenon Developer Commons',
  tagline: 'Verification-first architecture for the Network of Momentum',
  favicon: 'img/favicon.svg',

  url: 'https://0x3639.github.io',
  baseUrl: '/zenon-developer-commons/',

  organizationName: '0x3639',
  projectName: 'zenon-developer-commons',

  onBrokenLinks: 'warn',
  onBrokenMarkdownLinks: 'warn',

  markdown: {
    format: 'detect',
    mermaid: true,
  },
  themes: [
    '@docusaurus/theme-mermaid',
    [
      '@easyops-cn/docusaurus-search-local',
      {
        hashed: true,
        indexBlog: false,
        docsRouteBasePath: '/',
        highlightSearchTermsOnTargetPage: true,
        explicitSearchResultPath: true,
      },
    ],
  ],

  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      {
        docs: {
          routeBasePath: '/',
          sidebarPath: './sidebars.ts',
          remarkPlugins: [remarkMath],
          rehypePlugins: [rehypeKatex],
          editUrl:
            'https://github.com/0x3639/zenon-developer-commons/tree/main/',
        },
        blog: false,
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  stylesheets: [
    {
      href: 'https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.css',
      type: 'text/css',
      integrity:
        'sha384-n8MVd4RsNIU0tAv4ct0nTaAbDJwPJzDEaqSD1odI+WdtXRGWt2kTvGFasHpSy3SV',
      crossorigin: 'anonymous',
    },
  ],

  themeConfig: {
    image: 'img/social-card.jpg',
    colorMode: {
      respectPrefersColorScheme: true,
    },
    navbar: {
      title: 'Zenon Developer Commons',
      logo: {
        alt: 'Zenon Developer Commons',
        src: 'img/logo.svg',
      },
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'mainSidebar',
          position: 'left',
          label: 'Docs',
        },
        {to: '/for-enthusiasts', label: 'Enthusiasts', position: 'left'},
        {to: '/for-developers', label: 'Developers', position: 'left'},
        {to: '/for-researchers', label: 'Researchers', position: 'left'},
        {to: '/papers', label: 'Papers', position: 'left'},
        {
          href: 'https://github.com/0x3639/zenon-developer-commons',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Start Here',
          items: [
            {label: 'For Enthusiasts', to: '/for-enthusiasts'},
            {label: 'For Developers', to: '/for-developers'},
            {label: 'For Researchers', to: '/for-researchers'},
          ],
        },
        {
          title: 'Explore',
          items: [
            {label: 'Architecture', to: '/architecture/overview'},
            {label: 'Research', to: '/research/open-questions'},
            {label: 'Papers', to: '/papers'},
          ],
        },
        {
          title: 'More',
          items: [
            {
              label: 'GitHub',
              href: 'https://github.com/0x3639/zenon-developer-commons',
            },
          ],
        },
      ],
      copyright: `Zenon Developer Commons — exploratory research, not official documentation or governance.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
