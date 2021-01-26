import { createIopaRef } from '../lib'

export const URN_BOT_SURFACE = 'urn:io-iopa:bot:surface'

export interface PackageManifest {
  /** file/lib name may be different than npm name in package.json */
  packageName: string
  /** file extension e.g., nkar */
  fileType: string
  /** semantic version of package */
  version: string
  /** ISO date this bundle was published */
  created: string
  /** SHA checksum of nkar bytestream */
  sha256: string
  /** temporary location to download from, presigned with any authentication keys required */
  signedUrl: string
}

export interface IBotSurfaceCapability {
  ['iopa.Version']: string
  isModal: boolean
  isUpdateAvailable: boolean
  showModal(skipPrompt: boolean): Promise<void>
  clear(): Promise<void>
  restart(): Promise<void>
  shutdown(): Promise<void>
  downloadRestart: (packages: PackageManifest[]) => Promise<void>
  addListener: (event: string, listener: (_: any) => void) => void
  removeListener: (event, listener) => void
  emit: (event, ...args) => void
}

export const BotSurfaceRef = createIopaRef<IBotSurfaceCapability>({
  id: URN_BOT_SURFACE,
  description:
    'Iopa Bot Surface API to show modals, restart the surface, download updates and restart etc.'
})
