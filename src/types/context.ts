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

import { IopaBotSession } from './model'
import { BotCapabilitiesBase, AppCapabilitiesBase } from '../capabilities'
import {
    IEventEmitter,
    CancellationTokenSource,
    CancellationToken,
    IURL,
    IopaMap,
    IopaHeaders,
    IopaRef,
    IopaHeadersInit,
} from './index'

//
// CONTEXT
//

export interface Context<P extends IopaRequestBase, R, CAPABILITIES>
    extends IopaRequestBase {
    /** @deprecated use typesafe function capability() instead */
    ['server.Capabilities']: IopaMap<P>

    // IOPA 3.0 helpers
    capability<K extends keyof CAPABILITIES>(key: K): CAPABILITIES[K]
    capability<T>(iopaRef: IopaRef<T>): T | undefined

    response: R
}

export type IopaResponse = IopaMap<IopaResponseBase> & IopaResponseBase

export type IopaBotResponse = IopaMap<IopaBotResponseBase> & IopaBotResponseBase

export type IopaContext = IopaMap<
    Context<IopaRequestBase, IopaResponse, AppCapabilitiesBase>
> &
    Context<IopaRequestBase, IopaResponse, AppCapabilitiesBase>

export type IopaBotContext = IopaMap<
    Context<IopaBotContextBase, IopaBotResponse, BotCapabilitiesBase>
> &
    Context<IopaBotContextBase, IopaBotResponse, BotCapabilitiesBase>

//
// CORE/BASE FIELDS
//

export interface ContextCore {
    'iopa.Events': IEventEmitter
    'iopa.Version': string
    'server.Id': number | string
    'server.Capabilities': IopaMap<any>
    dispose?: () => void
    create?(...args: any[]): this
    log?: (...args: any) => void
    error?: (ex: Error) => void
    warn?: (...args: any) => void
}

interface ContextBase extends ContextCore {
    readonly 'iopa.Events': IEventEmitter
    readonly 'iopa.Version': string
    readonly 'server.Id': string | number
    readonly 'server.CancelTokenSource': CancellationTokenSource
    readonly 'server.CancelToken': CancellationToken
    readonly 'server.Source': string
    readonly 'server.Timestamp': number
    readonly 'server.TimeElapsed'?: number
    readonly dispose?: () => void
}

interface RequestBase {
    readonly 'iopa.Body': Promise<any>
    readonly 'iopa.Headers': IopaHeaders
    readonly 'iopa.Labels': Map<string, string>
    readonly 'iopa.Method': string
    readonly 'iopa.OriginalUrl': string
    readonly 'iopa.Path': string
    readonly 'iopa.Protocol': string
    readonly 'iopa.QueryString': string
    readonly 'iopa.RemoteAddress': string
    readonly 'iopa.Scheme': string
    readonly 'iopa.Url': IURL
    readonly 'iopa.RawRequest'?: any
    'iopa.Params'?: Record<string, string>
}

export type IopaResponseInit = {
    headers?: IopaHeadersInit
    status?: number
    statusText?: string
}

export interface IopaResponseBase extends ContextCore {
    'iopa.Body': any
    'iopa.Headers': IopaHeaders
    readonly 'iopa.Protocol': string
    'iopa.Size': number
    'iopa.StatusCode': number
    'iopa.StatusText': string

    end(chunk?: IopaBodyInit, options?: IopaResponseInit): Promise<void>
    send(body: IopaBodyInit, options?: IopaResponseInit): Promise<void>
    sendAll?(body: (string | { [key: string]: any })[]): Promise<void>
}

export interface IopaRequestBase extends ContextBase, Partial<RequestBase> {}

//
// Body
//

/** A blob object represents a file-like object of immutable, raw data. */
export interface Blob {
    /** The size, in bytes, of the data contained in the `Blob` object. */
    readonly size: number
    /** A string indicating the media type of the data contained in the `Blob`.
     * If the type is unknown, this string is empty.
     */
    readonly type: string
    /** Returns a new `Blob` object containing the data in the specified range of
     * bytes of the source `Blob`.
     */
    slice(start?: number, end?: number, contentType?: string): Blob
    arrayBuffer(): Promise<ArrayBuffer>
    text(): Promise<string>
}
type FormDataEntryValue = string

export interface FormData {
    append(name: string, value: string | Blob, filename?: string)
    delete(name: string): void
    get(name: string): FormDataEntryValue | null
    getAll(name: string): FormDataEntryValue[]
    has(name: string): boolean
    set(name: string, value: string | Blob, filename?: string): void
    forEach(
        callbackfn: (
            value: FormDataEntryValue,
            key: string,
            parent: FormData
        ) => void,
        thisArg?: any
    ): void
}

export default interface URLSearchParams {
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
    /**
     * Returns a string containing a query string suitable for use in a URL. Does not include the question mark.
     */
    toString(): string
    forEach(
        callbackfn: (
            value: string,
            key: string,
            parent: URLSearchParams
        ) => void,
        thisArg?: any
    ): void
}

export type IopaBodyInit =
    | Blob
    | Uint8Array
    | FormData
    | URLSearchParams
    | string

//
// EDGE SPECIFIC
//

export interface CookieOptions {
    maxAge?: number
    signed?: boolean
    expires?: Date
    httpOnly?: boolean
    path?: string
    domain?: string
    secure?: boolean
    encode?: (val: string) => string
    sameSite?: boolean | 'lax' | 'strict' | 'none'
}

interface IopaEdgeRequestHelpers {
    header(name: string): string | string[]
    cookies: Record<string, any>
    signedCookies: Record<string, any>
    secret: string
    query: Record<string, string>
}

interface IopaEdgeResponseHelpers {
    cookie(name: string, value: any, options?: CookieOptions): IopaEdgeResponse
    clearCookie(name: string, options?: CookieOptions): IopaEdgeResponse
    status(code: number): IopaEdgeResponse
    header(field: string, value: string | string[]): IopaEdgeResponse
    append(field: string, value: string | string[]): IopaEdgeResponse
    location(url): IopaEdgeResponse
}

export type IopaEdgeResponse = IopaMap<IopaResponseBase> &
    IopaResponseBase &
    IopaEdgeResponseHelpers

export type IopaEdgeContext = IopaMap<
    Context<IopaRequestBase, IopaEdgeResponse, AppCapabilitiesBase>
> &
    Context<IopaRequestBase, IopaEdgeResponse, AppCapabilitiesBase> &
    IopaEdgeRequestHelpers

//
// BOT SPECIFIC
//

export interface IopaBotContextBase extends IopaRequestBase {
    /** the inferred intent corresponding to the text entered by the user, for Iopa Bot Framework */
    'bot.Intent'?: string

    /** the session context */
    'bot.Session'?: IopaBotSession

    /** the raw text entered by the user, for Iopa Bot Framework */
    'bot.Text'?: string

    /** the dialog to invoke, for Iopa Bot Framework */
    'urn:bot:dialog:invoke'?: string

    /** The source platform */
    'bot.Source': string

    /** The Address of the current user */
    'bot.Address': { 'bot.User': string }

    /** The Address of the current user */
    'bot.Slots': { [key: string]: string }

    timestamp: number
}

export type IopaBotCard = {
    type: string
    [key: string]: any
}

export interface BotResponseMethods {
    /** Send a text string or card attachments, looping with delay if multiple provided */
    sendAll(body: (string | IopaBotCard)[]): Promise<void>

    /** Show platform typing indicator */
    showTypingIndicator(): Promise<void>

    /** Hide platform typing indicator */
    hideTypingIndicator(): Promise<void>

    /** Helper method to load up a text string */
    say(text: string): IopaBotResponse

    /** Helper method to load up a card */
    card(card: IopaBotCard): IopaBotResponse

    /** Helper method to reprompt a text string */
    shouldEndSession(flag: boolean): IopaBotResponse

    /** Helper method to set the status of the response */
    status: (statuscode: number) => IopaBotResponse

    /** Helper method to send a given text, card or any of the above if already queued up */
    send: (body?: string | any) => Promise<void>

    /** Helper method to send the above once queued up */
    fail(error: string, message: string, inChannel: string): IopaBotResponse

    /** Flag indicating response is awaiting a multichannel response */
    isAwaitingMultiChoiceResponse(): boolean
}

export interface IopaBotResponseBase
    extends IopaResponseBase,
        Partial<BotResponseMethods> {
    //
    // Extended Properties
    //

    /** Flag set once a response has been handled */
    responseHandled?: boolean

    /** Flag indicating this activity should end the current dialog */
    'bot.ShouldEndSession'?: boolean

    /** Flag indicating typing delay is disabled for this bot/session */
    'bot.IsDelayDisabled'?: boolean

    //
    // Methods in both IopaResponseBase and BotResponseMethods win from BotResponseMethods
    //

    /** Helper method to send a given text, card or any of the above if already queued up */
    send: (body?: string | any, options?: any) => Promise<void>

    /** Send a text string or card attachments, looping with delay if multiple provided */
    sendAll?(body: (string | { [key: string]: any })[]): Promise<void>
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

export interface IopaBotReadingBase {
    /** The unique identifier for this particular context activity    */
    'bot.ActivityId'?: string
    /** The type of this particular context activity    */
    'bot.ActivityType'?: BotActivityTypes
    /**  The channel identifier within team */
    'bot.Channel'?: { id: string; name?: string }
    /** The conversation reference (property bag as defined by source platform)  */
    'bot.Conversation'?: any
    /** The unique id of the user (global and within the domain of the source platform) */
    'bot.From'?: { id: string; localid?: string; name?: string }
    /** The intent of the message (usually derived in middleware by parsing audio or free form text, but may be provided by service provider such as Alexa) */
    'bot.Intent'?: string
    /** Consumer app metadata for this record */
    'bot.MetaData'?: { isRead?: boolean; isClosed?: boolean }
    /** The platform provider within the source platform e.g., "msteams" */
    'bot.Provider'?: string
    /** The unique id of the bot (global and within the domain of the source platform)  */
    'bot.Recipient'?: { id: string; localid?: string; name?: string }
    /** The endpoint associated with the provider (e.g., botframework channel serviceurl) */
    'bot.ServiceUrl'?: string
    /** The A property bag for the session record */
    'bot.Session'?: IopaBotSession
    /** The urn of the conversational agent service provider e.g., "urn:io.iopa.bot:slack", "urn:io.iopa.bot:alexa" */
    'bot.Source'?: string
    /**  The team or organizational identifier (e.g., Slack team) */
    'bot.Team'?: { id: string /* , globalid?: string */ }
    /** The timestamp of the activity */
    timestamp?: number | null
    /** (The source message as entered by the user (with mentions normalized as needed)) */
    'bot.Text'?: string
    /** The urn of the conversational agent service provider e.g., "urn:io.iopa.bot:slack", "urn:io.iopa.bot:alexa" */
    'bot.Attachment'?: BotAttachment
    /** The section header string for grouping purposes */
    section?: string

    /** Special reading to invoke iopa-bot framework dialog */
    'urn:bot:dialog:invoke'?: string
    /** Unique key */
    key?: number
}

export type IopaBotReading = IopaMap<IopaBotReadingBase> & IopaBotReadingBase

export interface BotReadingLegacy extends IopaBotReadingBase {
    /** @deprecated legacy bot:Text */
    'urn:consumer:message:text'?: string
    /** @deprecated legacy bot:Source */
    'urn:server:source'?: string
    /** @deprecated legacy bot:From.id */
    'urn:consumer:id'?: string
    /** @deprecated legacy timstamp  */
    'urn:server:timestamp'?: number | null
    /** @deprecated legacy metadata  */
    'urn:consumer:metadata'?: { isRead?: boolean }
    /** @deprecated legacy card attachment */
    card: { type: string; [key: string]: any }
    /** @deprecated legacy bot:To.id */
    'urn:consumer:chat:recipient'?: string

    'urn:consumer:message:file': string
    'urn:consumer:message:fileref': string
    'urn:consumer:message:video': {
        type: string
        autostart: boolean
        title: string
        text: string
        footer: string
        video: string
        mimeType: string
        image: string
        token: string
        key: number
    }
}

export type IopaBotReadingLegacy = IopaMap<BotReadingLegacy> & BotReadingLegacy

/**
 * An attachment within a Bot Reading
 * @export
 * @interface BotAttachment
 */
export interface BotAttachment {
    /**
     * mimeType/Contenttype for the file
     * @type {string}
     * @memberof BotAttachment
     */
    contentType?: 'application/vnd.microsoft.card.adaptive' | string
    /**
     * Embedded content
     * @type {any}
     * @memberof BotAttachment
     */
    content?: any
}
