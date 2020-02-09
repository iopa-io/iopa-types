import { BotSkill } from './model'
import { IopaMap, CancellationToken, CancellationTokenSource } from './index'
import { IopaContext } from './context'
import { IReactiveDialogsCapability, BotCapabilitiesBase } from './capabilities'
import { FC, Middleware, Plugin } from './middleware'

export interface AppPropertiesBase<T> {
  'app.DefaultApp': Middleware
  'app.DefaultMiddleware': [Middleware]
  'server.AppId': string
  'server.IsBuilt': boolean
  'server.Pipeline'?: ((context: IopaContext) => Promise<void>) & {
    dispatch?: Function
  }
  'server.Capabilities': IopaMap<T>
  'server.Version': string
  'server.CancelTokenSouce'?: CancellationTokenSource
  'server.CancelToken'?: CancellationToken
}

export type IopaBotAppProperties = AppPropertiesBase<BotCapabilitiesBase>

export interface AppProperties<T> extends IopaMap<AppPropertiesBase<T>> {
  capability<K extends keyof T>(key: K): T[K]
  setCapability<K extends keyof T>(key: K, value: T[K])
}

interface AppPlugin {
  /** register a new plugin middleware with known dependencies */
  usePlugin(plugin: Plugin): this
}

export interface App<T> {
  properties: AppProperties<T>

  capability<K extends keyof T>(key: K): T[K]
  setCapability<K extends keyof T>(key: K, value: T[K])

  /** add new middleware to the when-do enginge */
  use(Middleware: Middleware): this
  use(mw: Middleware, id: string): this

  /** v3 create sub App that invokes pipeline when condition is true */
  fork(when: (context: IopaContext) => boolean): this

  /** build the when-do engine;  called once prior to invoke */
  build(): any

  /** invoke a new reading on the when-do engine */
  invoke(context: IopaContext): Promise<void>

  dispose(): void

  createContext(
    url?: string,
    options?: {
      withResponse?: boolean
      [key: string]: any
    }
  ): IopaContext
}

export interface IopaBotApp
  extends App<BotCapabilitiesBase>,
    AppBotConnector,
    AppBotExtensions,
    AppPlugin {}

export interface RouterApp<T> extends App<T> {
  post: (path: string | RegExp, FC) => this
  get: (path: string | RegExp, FC) => this
  put: (path: string | RegExp, FC) => this
  delete: (path: string | RegExp, FC) => this
  patch: (path: string | RegExp, FC) => this
  all: (path: string | RegExp, FC) => this
  route<C>(
    path: string,
    context: IopaContext,
    next?: () => Promise<void>
  ): Promise<void>
}

export interface LoggingApp<T> extends App<T> {
  logging: {
    flush(): void
    log(context: IopaContext, message: any, ...optionalParams: any): void
    warn(context: IopaContext, message: any, ...optionalParams: any): void
    error(context: IopaContext, message: any, ...optionalParams: any): void
  }
}

export interface AppBotExtensions {
  /** @deprecated add a v1 dialog;  use reactivedialogs.use() going forward */
  dialog(name: string, ...args: any[]): void

  /** register a new intent handler for the default skill  */
  intent(intentName: string, func: FC): BotSkill
  intent(intentName: string, schema: any, func?: FC): BotSkill
  intent(intentName: string, schema: any | FC, func?: FC): BotSkill

  /** register a new dictionary for the default skill  */
  dictionary(dictionary: { [key: string]: string[] }): BotSkill

  /** register a new skill  */
  skill(name: string): BotSkill

  /** shortcut access to reactivedialogs capability */
  reactivedialogs: IReactiveDialogsCapability
}

interface AppBotConnector {
  when<C>(path: string, handler: (context: IopaContext) => Promise<void>): void
  invokeIntent(intentName: string): Promise<void>
  invokeDialog(dialog: string): Promise<void>
  createReading(source: any): void
}
