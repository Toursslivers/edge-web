import type { NextApiRequest, NextApiResponse } from 'next'
import { readFileSync } from 'fs'
import Markdoc from '@markdoc/markdoc'
import path from 'path'
const { nodes } = require('@markdoc/markdoc')

function generateID(children: any, attributes: any) {
  if (attributes.id && typeof attributes.id === 'string') {
    return attributes.id
  }
  return children
    .filter((child: any) => typeof child === 'string')
    .join(' ')
    .replace(/[?]/g, '')
    .replace(/\s+/g, '-')
    .toLowerCase()
}

const rawText = readFileSync(path.join('pages/api/docs/getting-started.md'), 'utf-8')
const ast = Markdoc.parse(rawText)

type Data = {
  name: string
}

export default function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  const config = {
    tags: {
      callout: {
        render: 'Callout',
        children: ['paragraph', 'tag', 'list'],
        attributes: {
          type: {
            type: String,
            default: 'note',
            matches: ['check', 'error', 'note', 'warning'],
          },
        },
      },
    },
    nodes: {
      heading: {
        ...nodes.heading,
        transform(node: any, config: any) {
          const base = nodes.heading.transform(node, config)
          base.attributes.id = generateID(base.children, base.attributes)
          return base
        },
      },
      fence: {
        render: 'Fence',
        attributes: {
          language: {
            type: String,
          },
        },
      },
    },
    variables: {},
  }
  const content: any = Markdoc.transform(ast, config)
  res.status(200).json(content)
}
