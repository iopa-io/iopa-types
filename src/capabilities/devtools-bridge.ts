import { createIopaRef } from '../lib'

export const URN_DEVTOOLS_BRIDGE = 'urn:ai:karla:devtools:bridge'

export interface IDevToolsBridge {
  devToolsInvoke?: Function
  invoke?: Function
}

export const DevToolsBridgeRef = createIopaRef<IDevToolsBridge>({
  id: URN_DEVTOOLS_BRIDGE,
  description:
    'Development tools bridge to invoke functions across worker sandbox walls'
})
