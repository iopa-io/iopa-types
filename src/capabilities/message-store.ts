import { createIopaRef } from '../lib'

import type { IopaBotReading, BotReadingLegacy } from '../types'

export const URN_MESSAGE_STORE = 'urn:io.iopa.bot:messages'
export const URN_MESSAGE_STORE_SIMPLE = 'urn:io.iopa.bot:messages:simple'

export interface IMessageStore {
  ['iopa.Version']: string
  /** The store is prepopulated with any items from session cache */
  isReady: Promise<void>

  items: IopaBotReading[]

  push: (
    item: Partial<
      BotReadingLegacy & {
        section?: string
        fontSize?: number
        text?: string
      }
    >
  ) => Promise<void>

  clear: () => Promise<void>

  closeCard: (seq?: number) => Promise<void>
  removeCard: (seq: number) => Promise<void>

  typingIndicatorOn: () => void
  typingIndicatorOff: () => void

  addListener?: (type: string, listener: Function) => void
  removeListener?: (type: string, listener: Function) => void
  emit: (event, ...args) => void

  utterances: string[]
}

export interface IMessageStoreSimple {
  ['iopa.Version']: string
  items: IopaBotReading[]
  addListener?: (type: string, listener: Function) => void
  removeListener?: (type: string, listener: Function) => void
}

export const MessageStoreRef = createIopaRef<IMessageStore>({
  id: URN_MESSAGE_STORE,
  description: 'Main message store used by the IOPA Bot Runtime'
})

export const MessageStoreSimpleRef = createIopaRef<IMessageStoreSimple>({
  id: URN_MESSAGE_STORE_SIMPLE,
  description:
    'Limited API footprint message store used by the IOPA Bot Simulator'
})
