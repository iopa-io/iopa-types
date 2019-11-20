/*
 * Internet Open Protocol Abstraction (IOPA)
 * Copyright (c) 2016 Internet of Protocols Alliance
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

interface AppPlugin {
    /** register a new plugin middleware with known dependencies */
    usePlugin(plugin: Plugin): this
}

export interface App extends AppBotConnector, AppIopaBot, AppPlugin {
    properties: AppProperties

    /** add new middleware to the when-do enginge */
    use(Middleware: Middleware): this
    use(mw: Middleware, id: string): this

    /** v3 create sub App that invokes pipeline when condition is true */
    fork: (when: (context: IopaContext) => boolean) => App

    /** build the when-do engine;  called once prior to invoke */
    build(): any

    /** invoke a new reading on the when-do engine */
    invoke(context: Context): Promise<void>

    dispose(): void

    createContext(
        url?: string,
        options?: {
            withResponse?: boolean
            [key: string]: any
        }
    ): Context
}

export interface RouterApp extends App {
    post: (path: string | RegExp, FC) => this
    get: (path: string | RegExp, FC) => this
    put: (path: string | RegExp, FC) => this
    delete: (path: string | RegExp, FC) => this
    patch: (path: string | RegExp, FC) => this
    route: (
        path: string,
        context: Context,
        next?: () => Promise<void>
    ) => Promise<void>
}

export interface LoggingApp extends App {
    logging: {
        flush(): void
        log(context: IopaContext, message: any, ...optionalParams: any): void
        warn(context: IopaContext, message: any, ...optionalParams: any): void
        error(context: IopaContext, message: any, ...optionalParams: any): void
    }
}

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
    onApplicationReady?: (app: App) => void

    /** Iopa invoke function called once per every reading */
    invoke?: (context: Context, next?: () => Promise<any>) => Promise<any>
}

export declare interface Component {
    /** constructor called once upon registration */
    constructor: Function

    /** invoke function called for every reading  */
    invoke?: (context: Context, next?: () => Promise<void>) => Promise<void>
}

export type FC = (context: Context, next: () => Promise<void>) => Promise<void>

export type Invoker = (context: Context) => Promise<void>

export type Middleware = FC | Component

export interface AppProperties {
    serverːAppId: string
    serverːCapabilities: any
    serverːLogger: Console
    serverːPipeline: FC
    serverːVersion: string
    appːDefaultApp: Middleware
    appːDefaultMiddleware: Middleware
}

//
// Context Keys
//

export type UNICODE_COLON = 'ː'

export type Context = IopaContext

export interface ContextCore {
    iopaːVersion: string
    iopaːSeq: string
    iopaːEvents: IEventEmitter
    serverːCapabilities: any
    dispose?: () => void
    create?(...args: any[]): ContextCore
    log?: (...args: any) => void
    error?: (ex: Error) => void
    warn?: (...args: any) => void
}

export interface ContextBase extends ContextCore {
    readonly iopaːVersion: string
    readonly iopaːSeq: string
    readonly iopaːEvents: IEventEmitter
    readonly serverːCancelTokenSource: CancellationTokenSource
    readonly serverːCancelToken: CancellationToken
    readonly serverːCapabilities: any
    readonly serverːTimestamp: number
    readonly serverːSource: string
    readonly dispose?: () => void
    serverːgetTimeElapsed?(): number
}

export interface IopaContext extends ContextBase, Partial<IopaRequest> {
    response: Partial<IopaResponse>
}

export interface WriteableContextBase extends ContextCore {
    serverːCancelTokenSource: any
    serverːCancelToken: any
    serverːCapabilities: any
    serverːTimestamp: number
    serverːSource: string
}

export interface IopaRequest {
    readonly iopaːHeaders: Map<string, string>
    readonly iopaːMethod: string
    readonly iopaːOriginalUrl: string
    readonly iopaːUrl: IURL
    readonly iopaːPath: string
    readonly iopaːProtocol: string
    readonly iopaːQueryString: string
    readonly iopaːScheme: string
    readonly iopaːBody: Promise<any>
    readonly iopaːRemoteAddress: string
    readonly iopaːLabels: Map<string, string>
}

export interface WriteableIopaRequest extends WriteableContextBase {
    iopaːHeaders: Map<string, string>
    iopaːMethod: string
    iopaːOriginalUrl: string
    iopaːUrl: IURL
    iopaːPath: string
    iopaːProtocol: string
    iopaːQueryString: string
    iopaːScheme: string
    iopaːBody: Promise<any>
    iopaːRemoteAddress: string
    iopaːLabels: Map<string, string>
}

export interface IopaResponse extends ContextCore {
    iopaːBody: any
    iopaːHeaders: Map<string, string>
    iopaːSize: number
    iopaːStatusCode: number
    iopaːStatusText: string
    readonly iopaːProtocol: string
    end(
        chunk?: any,
        options?: { headers?: any; status?: number; statustext?: string }
    ): Promise<void>
    send(
        body: any,
        options?: { headers?: any; status?: number; statustext?: string }
    ): Promise<void>
    sendAll?(body: (string | { [key: string]: any })[]): Promise<void>
}

export interface IDisposable {
    dispose(...args: any[]): void
}

export interface IEventEmitter {
    emit(event: string, ...args: any[]): void
    on(event: string, cb: Listener): IDisposable
    once(event: string, cb: Listener): IDisposable
    clear(event?: string): void
}

export interface IURL {
    hash: string
    host: string
    hostname: string
    href: string
    readonly origin: string
    password: string
    pathname: string
    port: string
    protocol: string
    search: string
    readonly searchParams: IURLSearchParams
    username: string
    toJSON(): string
}

export interface IURLSearchParams {
    /**
     * Appends a specified key/value pair as a new search parameter.
     */
    append(name: string, value: string): void
    /**
     * Deletes the given search parameter, and its associated value, from the list of all search parameters.
     */
    delete(name: string): void
    /**
     * Returns the first value associated to the given search parameter.
     */
    get(name: string): string | null
    /**
     * Returns all the values association with a given search parameter.
     */
    getAll(name: string): string[]
    /**
     * Returns a Boolean indicating if such a search parameter exists.
     */
    has(name: string): boolean
    /**
     * Sets the value associated to a given search parameter to the given value. If there were several values, delete the others.
     */
    set(name: string, value: string): void
    sort(): void
    forEach(
        callbackfn: (
            value: string,
            key: string,
            parent: IURLSearchParams
        ) => void,
        thisArg?: any
    ): void
}

export type Listener = (...args: any[]) => any
export type Disposer = () => void

export interface CancellationTokenSource {
    cancel(reason: string): void
    readonly token: CancellationToken
    readonly isCancelled: boolean
    readonly reason: string
    register(cb: Function): void
}
export declare class CancellationToken {
    readonly isCancelled: boolean
    onCancelled(callback: any): void
    throwIfCancelled(): void
}

//
// IOPA Bot Framework specific definitions
//

interface AppIopaBot {
    /** register a new intent handler for the default skill  */
    intent(intentName: string, func: FC): this
    intent(intentName: string, schema: any, func: FC): this

    /** register a new dictionary for the default skill  */
    dictionary(dictionary: { [key: string]: string[] }): this

    /** add a new skill with given name and return it */
    skill(name: string): any
}

interface AppBotConnector {
    when(path: string, handler: (context: Context) => Promise<void>): void
    invokeIntent(intentName: string): Promise<void>
    invokeDialog(dialog: string): Promise<void>
    createReading(source: any): void
}

export interface BotResponseMethods {
    /** Send a text string or card attachments, looping with delay if multiple provided */
    sendAll(body: (string | { [key: string]: any })[]): Promise<void>

    /** Show platform typing indicator */
    showTypingIndicator(): Promise<void>

    /** Hide platform typing indicator */
    hideTypingIndicator(): Promise<void>

    /** Helper method to load up a text string */
    say(text: string): IopaBotResponse

    /** Helper method to load up a card */
    card(card: any): IopaBotResponse

    /** Helper method to reprompt a text string */
    shouldEndSession(flag: boolean): IopaBotResponse

    /** Helper method to set the status of the response */
    status: (statuscode: number) => IopaBotResponse

    /** Helper method to send a given text, card or any of the above if already queued up */
    send: (body?: string | any) => Promise<void>

    /** Helper method to send the above once queued up */
    fail(error: string, message: string, in_channel: string): IopaBotResponse

    /** Flag indicating response is awaiting a multichannel response */
    isAwaitingMultiChoiceResponse(): boolean
}

export interface IopaBotContext extends IopaContext, BotReading {}

export interface IopaBotResponse extends IopaResponse, BotResponseMethods {
    //
    // Extended Properties
    //

    /** Flag set once a response has been handled */
    botːResponseHandled?: boolean

    /** Flag indicating this activity should end the current dialog */
    botːShouldEndSession?: boolean

    /** Flag indicating typing delay is disabled for this bot/session */
    botːIsDelayDisabled?: boolean

    //
    // Methods in both IopaResponse and BotResponseMethods win from BotResponseMethods
    //

    /** Helper method to send a given text, card or any of the above if already queued up */
    send: (body?: string | any) => Promise<void>

    /** Send a text string or card attachments, looping with delay if multiple provided */
    sendAll(body: (string | { [key: string]: any })[]): Promise<void>
}

export type BotActivityRawTypes =
    | 'Message'
    | 'ContactRelationUpdate'
    | 'ConversationUpdate'
    | 'Typing'
    | 'EndOfConversation'
    | 'Event'
    | 'Invoke'
    | 'DeleteUserData'
    | 'MessageUpdate'
    | 'MessageDelete'
    | 'InstallationUpdate'
    | 'MessageReaction'
    | 'Suggestion'
    | 'Trace'
    | 'Handoff'

export type BotActivityEmitTypes =
    | 'Turn'
    | 'Message'
    | 'ConversationUpdate'
    | 'MembersAdded'
    | 'MembersRemoved'
    | 'TeamsMembersAdded'
    | 'TeamsMembersRemoved'
    | 'TeamsChannelCreated'
    | 'TeamsChannelDeleted'
    | 'TeamsChannelRenamed'
    | 'MessageReaction'
    | 'Event'
    | 'TokenResponseEvent'
    | 'UnrecognizedActivityType'
    | 'ReactionsAdded'
    | 'ReactionsRemoved'
    | 'TeamsCardActionInvoke'
    | 'TeamsSigninVerifyState'
    | 'TeamsFileConsent'
    | 'TeamsO365ConnectorCardAction'
    | 'TeamsAppBasedLinkQuery'
    | 'TeamsMessagingExtensionSelectItem'
    | 'TeamsMessagingExtensionSelectItem'
    | 'TeamsMessagingExtensionBotMessagePreviewEdit'
    | 'TeamsMessagingExtensionBotMessagePreviewSend'
    | 'TeamsMessagingExtensionSubmitAction'
    | 'TeamsMessagingExtensionFetchTask'
    | 'TeamsMessagingExtensionConfigurationQuerySettingUrl'
    | 'TeamsMessagingExtensionConfigurationSetting'
    | 'TeamsMessagingExtensionCardButtonClicked'
    | 'TeamsTaskModuleFetch'
    | 'TeamsTaskModuleSubmit'
    | 'TeamsFileConsentAccept'
    | 'TeamsFileConsentDecline'
    | 'ActionInvoke'

export type BotActivityTypes = BotActivityRawTypes & BotActivityEmitTypes

export interface BotReading {
    /** The unique identifier for this particular context activity    */
    botːActivityId: string
    /** The type of this particular context activity    */
    botːActivityType: BotActivityTypes
    /**  The channel identifier within team */
    botːChannel: { id: string; name?: string }
    /** The conversation reference (property bag as defined by source platform)  */
    botːConversation: any
    /** The unique id of the user (global and within the domain of the source platform) */
    botːFrom: { id: string; localid?: string; name?: string }
    /** The intent of the message (usually derived in middleware by parsing audio or free form text, but may be provided by service provider such as Alexa) */
    botːIntent: string
    /** The platform provider within the source platform e.g., "msteams" */
    botːProvider: string
    /** The unique id of the bot (global and within the domain of the source platform)  */
    botːRecipient: { id: string; localid?: string; name?: string }
    /** The endpoint associated with the provider (e.g., botframework channel serviceurl) */
    botːServiceUrl: string
    /** The A property bag for the session record */
    botːSession: Partial<BotSession>
    /** The urn of the conversational agent service provider e.g., "urn:io.iopa.bot:slack", "urn:io.iopa.bot:alexa" */
    botːSource: string
    /**  The team or organizational identifier (e.g., Slack team) */
    botːTeam: { id: string /*, globalid?: string */ }
    /** The timestamp of the activity */
    botːTimestamp: number | null
    /** (The source message as entered by the user (with mentions normalized as needed)) */
    botːText: string
}

export interface BotSessionDialog {
    /* current step id */
    id: string
    /** version of the IOPA dialogs manager */
    iopaBotVersion: string
    /** sequence number of the directive last executed in the current dialog step */
    lastDirective: number | null
    /** id of step rendered before this one (for return logic) */
    previousId: string
    /** last set of actions prompted to participant */
    lastPromptActions: any[] | null
}

export interface BotSession {
    /** id of the dialog step being executed in the current skill */
    botːCurrentDialog: BotSessionDialog | null
    /** timestamp that the last dialog step ended */
    botːLastDialogEndedDate: number | null
    /** Flag indicating whether this intent is the first for this session */
    botːNewSession: boolean
    /** id of the current executing bot session */
    botːSkill: string
    /** V2 semversion of the current executing bot session;  checked in case flow definition upgraded mid conversation */
    botːSkillVersion: string
    /** Skill data for current request */
    botːSlots: string
    /** property bag of all data collected in current skill session, including silent properties specifed on card actions */
    botːVariables: any
    /** flag indicating whether bot is expecting an answer to a multi-choice prompt */
    botːisMultiChoicePrompt: boolean
}

//
// Teams, Specialist specific
//
