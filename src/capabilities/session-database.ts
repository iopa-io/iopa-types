import { createIopaRef } from '../lib'

export const URN_SESSION_DATABASE = 'urn:io.iopa.database:session'

export interface ISessionDatabase {
  ['iopa.Version']: string
  get(path: string): Promise<any>
  put(path: string, blob: any): Promise<any>
  delete(path: string): Promise<any>
  isReady: Promise<void>
  getKeys(): Promise<string[]>
  clear(): Promise<void>
}

export const SessionDatabaseRef = createIopaRef<ISessionDatabase>({
  id: URN_SESSION_DATABASE,
  description:
    'Iopa Bot session database including asynchronous CRUD persistant storage methods '
})
