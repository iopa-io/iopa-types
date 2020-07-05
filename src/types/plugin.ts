/* eslint-disable no-useless-constructor */
import { PluginApp, RouterHooks, IopaBotApp } from './app'
import { IopaBotContext } from './context'

/** Plugin Type I Interface used by plugin loader */
export interface Plugin {
  /** list of capabilities that this plugin is dependent on; will be injected with the given key  */
  dependencies?: { [key: string]: string | symbol }

  /** capability name that will be registered for this plugin  */
  capability?: string

  /** optional exported list of functions that form this plugin; if not given the entire class is used  */
  actions?: { [key: string]: Function }

  /** Alias under which to register this plugin in the context record when invoked by the engine */
  contextAlias?: string

  /** function that is called once all plugins have been registered */
  onApplicationReady(app: IopaBotApp<any>): void

  /** Iopa invoke function called once per every reading */
  invoke?(context: IopaBotContext, next?: () => Promise<void>): Promise<void>
}

export interface IPluginClass {
  readonly id: string
  readonly description: string
  readonly icon?: string
  readonly title?: string
}

export type PluginProps = {
  id: string
  description: string
  icon?: string
  title?: string
  register?(hooks: PluginHooks): void
}

export type PluginHooks = {
  app: PluginApp
  router: RouterHooks
  featureFlags: FeatureFlagsHooks
}

export type RouteOptions = {}

export type FeatureFlagsHooks = {
  register(name: FeatureFlagName): void
}
export type FeatureFlagName = string
