import { IopaBotContext } from './context'
import { IopaBotApp } from './app'

export interface Plugin {
  /** list of capabilities that this plugin is dependent on; will be injected with the given key  */
  dependencies?: { [key: string]: string | Symbol }

  /** capability name that will be registered for this plugin  */
  capability?: string

  /** optional exported list of functions that form this plugin; if not given the entire class is used  */
  actions?: { [key: string]: Function }

  /** Alias under which to register this plugin in the context record when invoked by the engine */
  contextAlias?: string

  /** function that is called once all plugins have been registered */
  onApplicationReady(app: IopaBotApp): void

  /** Iopa invoke function called once per every reading */
  invoke?(context: IopaBotContext, next?: () => Promise<void>): Promise<void>
}

export declare interface Component {
  /** constructor called once upon registration */
  constructor: Function

  /** invoke function called for every reading  */
  invoke?(context: IopaBotContext, next?: () => Promise<void>): Promise<void>
}

export type FC = (
  context: IopaBotContext,
  next: () => Promise<void>
) => Promise<void>

export type Invoker = (context: IopaBotContext) => Promise<void>

export type Middleware = FC | Component
