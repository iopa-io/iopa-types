/*
 * Internet Open Protocol Abstraction (IOPA)
 * Copyright (c) 2016 - 2020 Internet Open Protocol Alliance
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import type {
    IopaMap,
    CancellationToken,
    CancellationTokenSource,
} from './index'
import type { IopaContext } from './context'
import type {
    IReactiveDialogsCapability,
    BotCapabilitiesBase,
    AppCapabilitiesBase,
} from '../capabilities'
import type { BotSkill } from './model'
import type { FC, RouterFunc, Middleware } from './middleware'
import type { Plugin } from './plugin'
import type { IopaRef } from './map'
import type { Config, TestingFrameworkConfig } from './config'

export interface AppPropertiesBase<C> {
    'app.DefaultApp': FC
    'app.DefaultMiddleware': [FC]
    'server.AppId': string
    'server.AppType': string
    'server.AppDescription': string
    'server.IsBuilt': boolean
    'server.Pipeline': FC & {
        properties: AppProperties<{}, C>
        dispatch: FC
    }
    'server.Capabilities': IopaMap<C>
    'server.Version': string
    'server.CancelTokenSouce'?: CancellationTokenSource
    'server.CancelToken'?: CancellationToken
}

export type AppProperties<P, C> = IopaMap<AppPropertiesBase<C> & P> &
    AppPropertiesBase<C> &
    P

export interface ICapability<C> {
    capability<K extends keyof C>(key: K): C[K]
    capability<T>(iopaRef: IopaRef<T>): T | undefined
    setCapability<K extends keyof C>(key: K, value: C[K])
    setCapability<T, I extends T>(iopaRef: IopaRef<T>, impl: I): I
}

interface AppPlugin {
    /** register a new plugin middleware with known dependencies */
    usePlugin(plugin: Plugin): this
}

export interface CapabilityApp<P, C> extends ICapability<C> {
    properties: IopaMap<Partial<AppPropertiesBase<C> & P>>

    /** add new middleware to the when-do enginge */
    use(Middleware: Middleware): this
}

export interface App<P, C> extends ICapability<C & AppCapabilitiesBase> {
    properties: AppProperties<
        AppPropertiesBase<C & AppCapabilitiesBase> & P,
        C & AppCapabilitiesBase
    >

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
    extends App<{}, BotCapabilitiesBase>,
        AppBotConnector,
        AppBotExtensions,
        AppPlugin {}

export interface RouterHooks {
    post: (path: string | RegExp, component: RouterFunc) => this
    get: (path: string | RegExp, component: RouterFunc) => this
    put: (path: string | RegExp, component: RouterFunc) => this
    delete: (path: string | RegExp, component: RouterFunc) => this
    patch: (path: string | RegExp, component: RouterFunc) => this
    all: (path: string | RegExp, component: RouterFunc) => this
    route<C>(
        path: string,
        context: IopaContext,
        next?: () => Promise<void>
    ): Promise<void>
}

export interface RouterApp<P, C> extends App<P, C>, RouterHooks {}

export interface LoggingHooks {
    logging: {
        flush(): void
        log(context: IopaContext, message: any, ...optionalParams: any): void
        warn(context: IopaContext, message: any, ...optionalParams: any): void
        error(context: IopaContext, message: any, ...optionalParams: any): void
    }
}

export interface ConfigHooks {
    config: Config
}

export interface LoggingApp<P, T> extends App<P, T>, LoggingHooks {}

export interface PluginApp
    extends App<
            {
                'server.Testing': TestingFrameworkConfig
            },
            {}
        >,
        RouterHooks,
        LoggingHooks,
        ConfigHooks {
    registerFeatureFlag(flagOptions: { name: string }): this
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
    when<C>(
        path: string,
        handler: (context: IopaContext) => Promise<void>
    ): void
    invokeIntent(intentName: string): Promise<void>
    invokeDialog(dialog: string): Promise<void>
    createReading(source: any): void
}
