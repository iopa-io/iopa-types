/* eslint-disable @typescript-eslint/interface-name-prefix */
import { FlowElement, TableElement } from 'reactive-dialogs'

import { BotSkill, BotSkills, IopaBotSession, BotDialog } from './model'
import { IopaBotContext, IopaBotReading, BotReadingLegacy } from './context'
import { IopaMap } from './index'

// CAPABILITY SETS

export type Capabilities<T> = IopaMap<T>

export type IopaCapabilities = Capabilities<AppCapabilitiesBase>

export type IopaBotCapabilities = Capabilities<BotCapabilitiesBase>

//
// CAPABILITY BASE PROPERTY COLLECTIONS
//

export interface AppCapabilitiesBase {
  'urn:io.iopa:app': {
    'server.Version': string
    'server.Name'?: string
  }
}

export interface BotCapabilitiesBase extends AppCapabilitiesBase {
  'urn:consumer:profile'?: {
    'urn:consumer:firstname': string
  }

  'urn:io.iopa.bot:dialog': IDialogCapability

  'urn:io.iopa.bot:messages': IMessageStore

  'urn:io.iopa.bot:reactive-dialogs': IReactiveDialogsCapability

  'urn:io.iopa.bot:reactive-dialogs:simple'?: IReactiveDialogsSimpleCapability

  'urn:io.iopa.bot:skills': ISkillsCapability

  'urn:io.iopa.database:session': ISessionDatabase

  'urn:io.iopa.database': ISimpleDatabase & { userId(): string }

  'urn:io.iopa.bot:session': ISessionCapability

  'urn:io.iopa.bot:speech'?: {
    speak: Function
    speakWithPromise: Function
  }

  'urn:io.iopa.filestorage'?: {
    put: Function
    delete: (path: string) => Promise<void>
  }

  'urn:ai:karla:devtools:bridge': {
    devToolsInvoke?: Function
    invoke?: Function
  }

  'urn:ai:karla:devtools:renderer': {
    invoke?: Function
  }
}

//
// CAPABILITIES
//

export interface ISessionDatabase {
  ['iopa.Version']: string
  get(path: string): Promise<any>
  put(path: string, blob: any): Promise<any>
  delete(path: string): Promise<any>
  isReady: Promise<void>
  getKeys(): Promise<string[]>
  clear(): Promise<void>
}

export interface ISimpleDatabase {
  ['iopa.Version']: string
  get<T>(path: string): Promise<T | null>
  put<T>(path: string, item: T): Promise<void>
  delete(path: string): Promise<void>
  push?(path: string, blob: any): Promise<any>
  isReady?: Promise<void>
}

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

export interface ISkillsCapability {
  ['iopa.Version']: string
  /** debugging is verbose for this skill */
  verbose: boolean
  /**  session timeout in milliseconds, 0 to disable */
  timeout: 300000 //
  /** map of skill names to skills */
  skills: BotSkills
  /** add a new skill with given name and return it */
  add(name: string): BotSkill
  /** get the skill with the given name */
  skill(name: string): BotSkill | undefined
}

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

export interface IConsumerProfileSession {
  /** the unique id of the user/specialist/participant */
  id: string

  /** tenant */
  tenant: string

  /** skill prefix realm (usually the prefix of the hostname for web applications) */
  realm: string

  /** the first name of the user, comnpatible with whendo user profile on all platforms including iOS, Android */
  readonly 'urn:consumer:firstname': string

  /** the user token used for second factor verifying request url  */
  token?: string

  /** the static candidate data from the active table include name, stage, profile, etc.;  not generally updated during session */
  data?: any

  /** Flag indicating if this is a new session at last refresh */
  isNewSession: boolean

  /** Identify the advertiser, site, publication, etc. that is sending traffic, for example: google, newsletter4, billboard. */
  utm_source?: string

  /** The advertising or marketing medium, for example: cpc, banner, email newsletter. */
  utm_medium?: string

  /** The individual campaign name, slogan, promo code, etc.. */
  utm_campaign?: string

  /** Paid search keywords */
  utm_term?: string

  /**  Used to differentiate similar content, or links within the same ad  */
  utm_content?: string
}

export interface IConsumerProfile extends IConsumerProfileSession {
  ['iopa.Version']: string
  /** Promise that resolves once database connection is authenticated and user authorized */
  isReady: Promise<any>

  /** whether this user id was supplied validated with a token */
  readonly isAuthenticated: boolean

  /** clear profile and remove session data */
  logout(): Promise<void>

  save: () => Promise<void>

  setFirstName: (value: string) => Promise<void>
}

export interface IDialogCapability {
  ['iopa.Version']: string
  dialogs: { [key: string]: BotDialog }
  beginDialog(
    name: string,
    context: IopaBotContext,
    next: () => Promise<void>
  ): Promise<void>
}
