import { IopaBotSession } from './model'
import {
  Capabilities,
  IopaBotCapabilities,
  BotCapabilitiesBase,
  AppCapabilitiesBase
} from './capabilities'
import {
  IEventEmitter,
  CancellationTokenSource,
  CancellationToken,
  IURL,
  IopaMap
} from './index'

//
// CONTEXT
//

export interface Context<C extends IopaRequestBase, R, CAPABILITIES> {
  /** @deprecated use typesafe function capability() instead */
  ['server.Capabilities']?: Capabilities<C>

  // IOPA 3.0 helpers
  capability<K extends keyof CAPABILITIES>(key: K): CAPABILITIES[K]
  get<K extends keyof C>(key: K): C[K]
  set<K extends keyof C>(key: K, value: C[K])
  toJSON(): C

  response: IopaMap<R> & R
}

export type IopaContext = Context<
  IopaRequestBase,
  IopaBotResponseBase,
  AppCapabilitiesBase
> &
  IopaRequestBase

export type IopaBotContext = Context<
  IopaBotContextBase,
  IopaBotResponseBase,
  BotCapabilitiesBase
> &
  IopaRequestBase

export type IopaResponse = IopaMap<IopaResponseBase> & IopaResponseBase

export type IopaBotResponse = IopaMap<IopaBotResponseBase> & IopaBotResponseBase

//
// CORE/BASE FIELDS
//

export interface ContextCore {
  'iopa.Events': IEventEmitter
  'iopa.Version': string
  'server.Id': number | string
  'server.Capabilities': Capabilities<any>
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
  readonly 'iopa.Headers': Map<string, string>
  readonly 'iopa.Labels': Map<string, string>
  readonly 'iopa.Method': string
  readonly 'iopa.OriginalUrl': string
  readonly 'iopa.Path': string
  readonly 'iopa.Protocol': string
  readonly 'iopa.QueryString': string
  readonly 'iopa.RemoteAddress': string
  readonly 'iopa.Scheme': string
  readonly 'iopa.Url': IURL
}

export interface IopaResponseBase extends ContextCore {
  'iopa.Body': any
  'iopa.Headers': Map<string, string>
  readonly 'iopa.Protocol': string
  'iopa.Size': number
  'iopa.StatusCode': number
  'iopa.StatusText': string

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

export interface IopaRequestBase extends ContextBase, Partial<RequestBase> {}

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
  'bot.From': { id: string; localid?: string; name?: string }
  /** The intent of the message (usually derived in middleware by parsing audio or free form text, but may be provided by service provider such as Alexa) */
  'bot.Intent'?: string
  /** Consumer app metadata for this record */
  'bot.MetaData': { isRead?: boolean; isClosed?: boolean }
  /** The platform provider within the source platform e.g., "msteams" */
  'bot.Provider'?: string
  /** The unique id of the bot (global and within the domain of the source platform)  */
  'bot.Recipient'?: { id: string; localid?: string; name?: string }
  /** The endpoint associated with the provider (e.g., botframework channel serviceurl) */
  'bot.ServiceUrl'?: string
  /** The A property bag for the session record */
  'bot.Session'?: IopaBotSession
  /** The urn of the conversational agent service provider e.g., "urn:io.iopa.bot:slack", "urn:io.iopa.bot:alexa" */
  'bot.Source': string
  /**  The team or organizational identifier (e.g., Slack team) */
  'bot.Team'?: { id: string /* , globalid?: string */ }
  /** The timestamp of the activity */
  timestamp: number | null
  /** (The source message as entered by the user (with mentions normalized as needed)) */
  'bot.Text'?: string
  /** The urn of the conversational agent service provider e.g., "urn:io.iopa.bot:slack", "urn:io.iopa.bot:alexa" */
  'bot.Attachment'?: BotAttachment
  /** The section header string for grouping purposes */
  'bot.Section'?: string

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
