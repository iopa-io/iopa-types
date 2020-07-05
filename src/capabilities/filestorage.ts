import { createIopaRef } from '../lib'

export const URN_FILE_STORAGE = 'urn:io.iopa.filestorage'

export interface IFileStorage {
  put: Function
  delete: (path: string) => Promise<void>
}

export const FileStorageRef = createIopaRef<IFileStorage>({
  id: URN_FILE_STORAGE,
  description: 'Capability to save a file in local storage or delete a file'
})
