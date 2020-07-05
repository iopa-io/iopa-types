import { createIopaRef } from '../lib'

export type IAppCapability = {
  /** The semantic version of the service  */
  'server.Version': string
  /** The human readable name of the service  */
  'server.Name'?: string
  /** The urn type name of the service  */
  'server.Type'?: string
  /** The brief description of the service  */
  'server.Description'?: string
  /** The icon string representing the service for display in debugging apps in the format "library/icon", where library may be ommitted to indicate the default system library or material-ui */
  'server.Icon'?: string
}

export const URN_APP = 'urn:io.iopa:app'

export const AppRef = createIopaRef<IAppCapability>({
  id: URN_APP,
  description:
    'Iopa App Capability common to every Iopa App, includes host name and version'
})
