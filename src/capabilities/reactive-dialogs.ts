import type { FlowElement, TableElement, Element } from 'reactive-dialogs'
import { createIopaRef } from '../lib'
import type { IopaBotContext } from '../types'

export const URN_REACTIVE_DIALOGS_SIMPLE =
  'urn:io.iopa.bot:reactive-dialogs:simple'
export const URN_REACTIVE_DIALOGS = 'urn:io.iopa.bot:reactive-dialogs'

export interface IReactiveDialogsSimpleCapability {
  ['iopa.Version']: string
  /** render an anonymous reactive-dialog flow or set of directives without pre-registration; */
  render(element: Function): void
  /** render an anonymous reactive-dialog flow or set of directives without pre-registration; */
  renderAllAtOnce(element: Function): void
  dispose: () => void
}

export interface IReactiveDialogsCapability {
  ['iopa.Version']: string
  /** register a reactives-dialog flow or table in the engine; it will not be rendered until renderFlow is called */
  use(
    /** JSX of dialog flow / table */
    jsx: (value) => FlowElement | TableElement,
    /** property bag of meta data associated with this flow */
    meta?: { [key: string]: string }
  ): void
  /** render an anonymous reactive-dialog flow or set of directives without pre-registration;
   * used for directives or other elements that don't have their own unique intents */
  render(
    element: Element,
    context: IopaBotContext,
    next: () => Promise<void>
  ): Promise<void>
  /** render (perform) a specific dialog and/or dialog step */
  renderFlow(
    /** id of flow to perform ; use undefined for current flow if there is one executing */
    flowId: string | undefined | null,
    /** id of dialog step to perform; use undefined for first dialog step in flow */
    dialogId: string | undefined | null,
    /* Context of current iopa record being executed */
    context: IopaBotContext,
    /* Iopa pipeline next, called by dialog flow handler if cannot handle this request */
    next: () => Promise<void>
  ): Promise<void>
  /** end the current flow if there is one being executed */
  end(context: IopaBotContext): Promise<void>
  /** map of command name and associated handlers; returns disposer to remove handler */
  registerCommand(
    command: string,
    handler: (
      command: string,
      props: { [key: string]: any },
      context: any
    ) => Promise<boolean>
  ): () => void

  /** meta data for all currently registered flows */
  meta: { [key: string]: { [key: string]: string } }
  /** All currently registered lists */
  lists: { [key: string]: string[] }
  /** Meta data for all currently registered tables */
  tables: { [key: string]: { [key: string]: string | string[] } }
  /** property function that adds scheme for local resources e.g,, app:// */
  localResourceProtocolMapper: (partialUrl: string) => string
}

export const ReactiveDialogsSimpleRef = createIopaRef<
  IReactiveDialogsSimpleCapability
>({
  id: URN_REACTIVE_DIALOGS_SIMPLE,
  description: 'Limited footprint API (readonly)to render dialogs at runtime '
})

export const ReactiveDialogsRef = createIopaRef<IReactiveDialogsCapability>({
  id: URN_REACTIVE_DIALOGS,
  description:
    'Capability to register dialogs using JSX and render dialogs at runtime'
})
