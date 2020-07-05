import { createIopaRef } from '../lib'
import type { IopaBotSession } from '../types'

export const URN_SESSION = 'urn:io.iopa.bot:session'

export interface ISessionCapability {
  ['iopa.Version']: string
  /** return item from session storage */
  get(id: string, timeout?: number): Promise<IopaBotSession>

  /** put item into session storage */
  put(session: Partial<IopaBotSession> & { id: string }): Promise<void>

  /** delete item from session storage */
  delete(id: string): Promise<void>

  /** stop dialog manager and dispose resources */
  dispose()
}

export const SessionRef = createIopaRef<ISessionCapability>({
  id: URN_SESSION,
  description: 'Iopa Bot session manager including asynchronous CRUD methods '
})
