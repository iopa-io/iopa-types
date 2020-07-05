import { createIopaRef } from '../lib'

export const URN_SIMPLE_DATABASE = 'urn:io.iopa.database'

export interface ISimpleDatabase {
  ['iopa.Version']: string
  get<T>(path: string): Promise<T | null>
  put<T>(path: string, item: T): Promise<void>
  delete(path: string): Promise<void>
  push?(path: string, blob: any): Promise<any>
  isReady?: Promise<void>
  userId(): string
}

export const SimpleDatabaseRef = createIopaRef<ISimpleDatabase>({
  id: URN_SIMPLE_DATABASE,
  description:
    'Iopa Bot simple database including asynchronous CRUD persistant storage methods '
})
