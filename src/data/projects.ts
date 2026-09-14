import shotHomeEn from '../assets/screenshots/app-home-en.webp'
import shotTextEn from '../assets/screenshots/app-text-en.webp'
import shotFolderEn from '../assets/screenshots/app-folder-tree-en.webp'
import shotGitEn from '../assets/screenshots/app-git-tree-en.webp'

export interface Project {
  name: string
  /** Repo URL — omitted for placeholders that have no public home yet. */
  repo?: string
  website?: string
  download?: string
  stack: readonly string[]
  /** Bilingual one-liner — lives here (not i18n) so each project is self-contained. */
  tagline: { en: string; zh: string }
  /** Optional bullet highlights, shown in the project's showcase section. */
  highlights?: { en: readonly string[]; zh: readonly string[] }
  /** Optional real app screenshots (a clickable stack), shown in all languages. */
  shots?: readonly string[]
  /** Placeholder entries are kept here but hidden from the page until real. */
  placeholder?: boolean
}

// Each project renders as its own full-screen showcase section.
// PLACEHOLDER: entries 2-5 are layout samples with no real data yet —
// fill them in (name/tagline/stack/repo) and drop the `placeholder`
// flag to publish. Only non-placeholder entries render on the page.
export const projects: readonly Project[] = [
  {
    name: 'Manta Compare',
    repo: 'https://github.com/marrviin/manta-compare',
    website: 'https://marrviin.github.io/manta-compare/',
    download: 'https://github.com/marrviin/manta-compare/releases/latest',
    stack: ['Tauri 2', 'Rust', 'React 19', 'Monaco Editor', 'TypeScript'],
    tagline: {
      en: 'A fast, cross-platform diff tool for text, folders & Git — free and open source.',
      zh: '快速、跨平台的 diff 工具，支持文本、文件夹与 Git 比较 —— 免费开源。',
    },
    highlights: {
      en: [
        'Text, folder & Git compare in one app',
        'Monaco editor — the engine behind VS Code',
        'Built on Rust (Tauri), not Electron — instant startup',
        'Native installers for macOS, Windows & Linux',
      ],
      zh: [
        '文本、文件夹、Git 三种比较，一个应用',
        'Monaco 编辑器内核 —— 与 VS Code 同源',
        '基于 Rust (Tauri) 原生构建，非 Electron，秒级启动',
        '提供 macOS、Windows、Linux 原生安装包',
      ],
    },
    shots: [shotHomeEn, shotTextEn, shotFolderEn, shotGitEn],
  },
  {
    name: 'Reef UI',
    placeholder: true,
    stack: ['React 19', 'TypeScript', 'CSS Layers', 'Storybook'],
    tagline: {
      en: 'Quilling-inspired React component library — paper-craft texture for modern interfaces',
      zh: '衍纸风格 React 组件库 —— 给现代界面带上纸艺质感',
    },
  },
  {
    name: 'Quill Motion',
    placeholder: true,
    stack: ['TypeScript', 'rAF', 'Zero deps'],
    tagline: {
      en: '2 kB spring-physics animation micro-library with scroll & pointer orchestration',
      zh: '2 kB 弹簧物理动画微库，内置滚动与指针编排',
    },
  },
  {
    name: 'Tidetable',
    placeholder: true,
    stack: ['React', 'Web Worker', 'Canvas'],
    tagline: {
      en: 'Virtualized data grid that stays at 60 fps with a million rows',
      zh: '百万行数据下依然 60 帧的虚拟滚动表格',
    },
  },
  {
    name: 'Manta CLI',
    placeholder: true,
    stack: ['Node.js', 'esbuild', 'TypeScript'],
    tagline: {
      en: 'Opinionated project scaffolder — one command from zero to a typed Vite app',
      zh: '约定式前端脚手架 —— 一条命令从零生成类型化 Vite 应用',
    },
  },
]

/** Only real projects render on the page — placeholders wait in the wings. */
export const publishedProjects = projects.filter((p) => !p.placeholder)
