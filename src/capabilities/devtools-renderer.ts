import { createIopaRef } from '../lib'

export const URN_DEVTOOLS_RENDERER = 'urn:ai:karla:devtools:renderer'

export interface IDevToolsRenderer {
  invoke?: Function
}

export const DevToolsRendererRef = createIopaRef<IDevToolsRenderer>({
  id: URN_DEVTOOLS_RENDERER,
  description:
    'Development tools renderer utility to invoke functions across renderer sandbox walls'
})
