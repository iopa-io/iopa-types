import { createIopaRef } from '../lib'

export const URN_FILEHOST = 'urn:io.iopa:filehost'

export interface IFileHost {
  ['iopa.Version']: string
  get(path: string): Promise<Uint8Array> | Uint8Array
  postResponse(options: { id: number; data: Uint8Array }): void
}

export const FileHostRef = createIopaRef<IFileHost>({
  id: URN_FILEHOST,
  description: 'Capability to get a file from cloud storage or post a response'
})
