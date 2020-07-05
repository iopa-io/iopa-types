import { createIopaRef } from '../lib'
import type { BotDialog, IopaBotContext } from '../types'

export interface IBotDialogCapability {
  ['iopa.Version']: string
  dialogs: { [key: string]: BotDialog }
  beginDialog(
    name: string,
    context: IopaBotContext,
    next: () => Promise<void>
  ): Promise<void>
}
export const URN_BOT_DIALOG = 'urn:io.iopa.bot:dialog'

export const BotDialogRef = createIopaRef<IBotDialogCapability>({
  id: URN_BOT_DIALOG,
  description: 'Iopa Bot Dialog registry and helper to start a dialog'
})
