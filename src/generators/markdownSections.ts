import { JsDocTag } from '../types';

export const markDownSections = [
  {
    title: 'Returns',
    tag: 'returns',
    render: (tag: JsDocTag) => {
      const type = tag.type ? `\`${tag.type}\`` : '`unknown`';
      const desc = tag.description || 'No description';
      return `- Type: ${type}\n- Description: ${desc}\n\n`;
    },
  },
  {
    title: '⚠️ Deprecated',
    tag: 'deprecated',
    render: (tag: JsDocTag) =>
      `> ${tag.description || 'No details provided.'}\n\n`,
  },
  {
    title: 'Throws',
    tag: 'throws',
    multi: true,
    render: (tag: JsDocTag) => {
      const type = tag.type ? `\`${tag.type}\`` : '`Error`';
      return `- ${type}: ${tag.description || 'No description'}\n`;
    },
  },
  {
    title: 'See Also',
    tag: 'see',
    multi: true,
    render: (tag: JsDocTag) =>
      `- ${tag.description || tag.name || 'Reference'}\n`,
  },
  {
    title: 'Examples',
    tag: 'example',
    multi: true,
    render: (tag: JsDocTag) =>
      `\`\`\`js\n${tag.description || tag.name || 'No example'}\n\`\`\`\n\n`,
  },
  {
    title: 'Since',
    tag: 'since',
    render: (tag: JsDocTag) =>
      `- ${tag.description || tag.name || 'No version info.'}\n\n`,
  },
  {
    title: 'Author',
    tag: 'author',
    multi: true,
    render: (tag: JsDocTag) => `- ${tag.description || tag.name}\n`,
  },
  {
    title: 'Default',
    tag: 'default',
    multi: true,
    render: (tag: JsDocTag) => `- ${tag.description || 'No default value'}\n`,
  },
];
