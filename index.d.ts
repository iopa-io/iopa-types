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
  usePlugin(plugin: Plugin): this;
}

export type Capabilities = {
  [key: string]:
    | {
        "iopa.Version"?: string;
        [key: string]: any;
      }
    | any
    | undefined;
};

export interface App extends AppBotConnector, AppIopaBot, AppPlugin {
  properties: AppProperties;
  capabilities: Capabilities;

  /** add new middleware to the when-do enginge */
  use(Middleware: Middleware): this;
  use(mw: Middleware, id: string): this;

  /** v3 create sub App that invokes pipeline when condition is true */
  fork: (when: (context: IopaContext) => boolean) => App;

  /** build the when-do engine;  called once prior to invoke */
  build(): any;

  /** invoke a new reading on the when-do engine */
  invoke(context: Context): Promise<void>;

  dispose(): void;

  createContext(
    url?: string,
    options?: {
      withResponse?: boolean;
      [key: string]: any;
    }
  ): Context;
}

export interface AppWithCapabilities<T> extends App {
  capabilities: Capabilities & T;
}

export interface RouterApp extends App {
  post: (path: string | RegExp, FC) => this;
  get: (path: string | RegExp, FC) => this;
  put: (path: string | RegExp, FC) => this;
  delete: (path: string | RegExp, FC) => this;
  patch: (path: string | RegExp, FC) => this;
  route: (
    path: string,
    context: Context,
    next?: () => Promise<void>
  ) => Promise<void>;
}

export interface LoggingApp extends App {
  logging: {
    flush(): void;
    log(context: IopaContext, message: any, ...optionalParams: any): void;
    warn(context: IopaContext, message: any, ...optionalParams: any): void;
    error(context: IopaContext, message: any, ...optionalParams: any): void;
  };
}

export interface Plugin {
  /** list of capabilities that this plugin is dependent on; will be injected with the given key  */
  dependencies?: { [key: string]: string | Symbol };

  /** capability name that will be registered for this plugin  */
  capability?: string;

  /** optional exported list of functions that form this plugin; if not given the entire class is used  */
  actions?: { [key: string]: Function };

  /** Alias under which to register this plugin in the context record when invoked by the engine */
  contextAlias?: string;

  /** function that is called once all plugins have been registered */
  onApplicationReady?: (app: App) => void;

  /** Iopa invoke function called once per every reading */
  invoke?: (context: Context, next?: () => Promise<any>) => Promise<any>;
}

export declare interface Component {
  /** constructor called once upon registration */
  constructor: Function;

  /** invoke function called for every reading  */
  invoke?: (context: Context, next?: () => Promise<void>) => Promise<void>;
}

export type FC = (context: Context, next: () => Promise<void>) => Promise<void>;

export type Invoker = (context: Context) => Promise<void>;

export type Middleware = FC | Component;

export interface AppProperties {
  server_AppId: string;
  server_Logger: Console;
  server_Pipeline: FC;
  server_Version: string;
  app_DefaultApp: Middleware;
  app_DefaultMiddleware: Middleware;
}

//
// Context Keys
//

export type UNICODE_COLON = "_";

export interface Context extends IopaContext {
  /** server Capabilities */
  capabilities: Capabilities;

  /** @deprecated use capabilities instead */
  ["server.Capabilities"]?: Capabilities;

  /** the session context */
  bot_Session?: any;

  /** the raw text entered by the user, for Iopa Bot Framework */
  bot_Text?: string;

  /** the inferred intent corresponding to the text entered by the user, for Iopa Bot Framework */
  bot_Intent?: string;

  /**  The IopaResponse record enhanced with Iopa Bot Framework methods */
  response: IopaBotResponse;
}

export interface ContextCore {
  iopa_Version: string;
  iopa_Seq: string;
  iopa_Events: IEventEmitter;
  capabilities: any;
  dispose?: () => void;
  create?(...args: any[]): ContextCore;
  log?: (...args: any) => void;
  error?: (ex: Error) => void;
  warn?: (...args: any) => void;
}

export interface ContextBase extends ContextCore {
  readonly iopa_Version: string;
  readonly iopa_Seq: string;
  readonly iopa_Events: IEventEmitter;
  readonly server_CancelTokenSource: CancellationTokenSource;
  readonly server_CancelToken: CancellationToken;
  readonly capabilities: any;
  readonly server_Timestamp: number;
  readonly server_Source: string;
  readonly dispose?: () => void;
  server_getTimeElapsed?(): number;
}

export interface IopaContext extends ContextBase, Partial<IopaRequest> {
  response: Partial<IopaResponse>;
}

export interface WriteableContextBase extends ContextCore {
  server_CancelTokenSource: any;
  server_CancelToken: any;
  capabilities: any;
  server_Timestamp: number;
  server_Source: string;
}

export interface IopaRequest {
  readonly iopa_Headers: Map<string, string>;
  readonly iopa_Method: string;
  readonly iopa_OriginalUrl: string;
  readonly iopa_Url: IURL;
  readonly iopa_Path: string;
  readonly iopa_Protocol: string;
  readonly iopa_QueryString: string;
  readonly iopa_Scheme: string;
  readonly iopa_Body: Promise<any>;
  readonly iopa_RemoteAddress: string;
  readonly iopa_Labels: Map<string, string>;
}

export interface WriteableIopaRequest extends WriteableContextBase {
  iopa_Headers: Map<string, string>;
  iopa_Method: string;
  iopa_OriginalUrl: string;
  iopa_Url: IURL;
  iopa_Path: string;
  iopa_Protocol: string;
  iopa_QueryString: string;
  iopa_Scheme: string;
  iopa_Body: Promise<any>;
  iopa_RemoteAddress: string;
  iopa_Labels: Map<string, string>;
}

export interface IopaResponse extends ContextCore {
  iopa_Body: any;
  iopa_Headers: Map<string, string>;
  iopa_Size: number;
  iopa_StatusCode: number;
  iopa_StatusText: string;
  readonly iopa_Protocol: string;
  end(
    chunk?: any,
    options?: { headers?: any; status?: number; statustext?: string }
  ): Promise<void>;
  send(
    body: any,
    options?: { headers?: any; status?: number; statustext?: string }
  ): Promise<void>;
  sendAll?(body: (string | { [key: string]: any })[]): Promise<void>;
}

export interface IDisposable {
  dispose(...args: any[]): void;
}

export interface IEventEmitter {
  emit(event: string, ...args: any[]): void;
  on(event: string, cb: Listener): IDisposable;
  once(event: string, cb: Listener): IDisposable;
  clear(event?: string): void;
}

export interface IURL {
  hash: string;
  host: string;
  hostname: string;
  href: string;
  readonly origin: string;
  password: string;
  pathname: string;
  port: string;
  protocol: string;
  search: string;
  readonly searchParams: IURLSearchParams;
  username: string;
  toJSON(): string;
}

export interface IURLSearchParams {
  /**
   * Appends a specified key/value pair as a new search parameter.
   */
  append(name: string, value: string): void;
  /**
   * Deletes the given search parameter, and its associated value, from the list of all search parameters.
   */
  delete(name: string): void;
  /**
   * Returns the first value associated to the given search parameter.
   */
  get(name: string): string | null;
  /**
   * Returns all the values association with a given search parameter.
   */
  getAll(name: string): string[];
  /**
   * Returns a Boolean indicating if such a search parameter exists.
   */
  has(name: string): boolean;
  /**
   * Sets the value associated to a given search parameter to the given value. If there were several values, delete the others.
   */
  set(name: string, value: string): void;
  sort(): void;
  forEach(
    callbackfn: (value: string, key: string, parent: IURLSearchParams) => void,
    thisArg?: any
  ): void;
}

export type Listener = (...args: any[]) => any;
export type Disposer = () => void;

export interface CancellationTokenSource {
  cancel(reason: string): void;
  readonly token: CancellationToken;
  readonly isCancelled: boolean;
  readonly reason: string;
  register(cb: Function): void;
}
export declare class CancellationToken {
  readonly isCancelled: boolean;
  onCancelled(callback: any): void;
  throwIfCancelled(): void;
}

//
// IOPA Bot Framework specific definitions
//

interface AppIopaBot {
  /** @deprecated add a v1 dialog;  use reactivedialogs.use() going forward */
  dialog(name: string, ...args: any[]): void;

  /** register a new intent handler for the default skill  */
  intent(intentName: string, func: FC): this;
  intent(intentName: string, schema: any, func: FC): this;

  /** register a new dictionary for the default skill  */
  dictionary(dictionary: { [key: string]: string[] }): this;

  /** add a new skill with given name and return it */
  skill(name: string): any;

  /** shortcut access to reactivedialogs capability */
  reactivedialogs: any;
}

interface AppBotConnector {
  when(path: string, handler: (context: Context) => Promise<void>): void;
  invokeIntent(intentName: string): Promise<void>;
  invokeDialog(dialog: string): Promise<void>;
  createReading(source: any): void;
}

export type IopaBotCard = {
  type: string;
  [key: string]: any;
};

export interface BotResponseMethods {
  /** Send a text string or card attachments, looping with delay if multiple provided */
  sendAll(body: (string | IopaBotCard)[]): Promise<void>;

  /** Show platform typing indicator */
  showTypingIndicator(): Promise<void>;

  /** Hide platform typing indicator */
  hideTypingIndicator(): Promise<void>;

  /** Helper method to load up a text string */
  say(text: string): IopaBotResponse;

  /** Helper method to load up a card */
  card(card: IopaBotCard): IopaBotResponse;

  /** Helper method to reprompt a text string */
  shouldEndSession(flag: boolean): IopaBotResponse;

  /** Helper method to set the status of the response */
  status: (statuscode: number) => IopaBotResponse;

  /** Helper method to send a given text, card or any of the above if already queued up */
  send: (body?: string | any) => Promise<void>;

  /** Helper method to send the above once queued up */
  fail(error: string, message: string, in_channel: string): IopaBotResponse;

  /** Flag indicating response is awaiting a multichannel response */
  isAwaitingMultiChoiceResponse(): boolean;
}

export interface IopaBotContext extends IopaContext, BotReading {}

export interface IopaBotResponse
  extends IopaResponse,
    Partial<BotResponseMethods> {
  //
  // Extended Properties
  //

  /** Flag set once a response has been handled */
  bot_ResponseHandled?: boolean;

  /** Flag indicating this activity should end the current dialog */
  bot_ShouldEndSession?: boolean;

  /** Flag indicating typing delay is disabled for this bot/session */
  bot_IsDelayDisabled?: boolean;

  //
  // Methods in both IopaResponse and BotResponseMethods win from BotResponseMethods
  //

  /** Helper method to send a given text, card or any of the above if already queued up */
  send: (body?: string | any, options?: any) => Promise<void>;

  /** Send a text string or card attachments, looping with delay if multiple provided */
  sendAll?(body: (string | { [key: string]: any })[]): Promise<void>;
}

export type BotActivityRawTypes =
  | "Message"
  | "ContactRelationUpdate"
  | "ConversationUpdate"
  | "Typing"
  | "EndOfConversation"
  | "Event"
  | "Invoke"
  | "DeleteUserData"
  | "MessageUpdate"
  | "MessageDelete"
  | "InstallationUpdate"
  | "MessageReaction"
  | "Suggestion"
  | "Trace"
  | "Handoff";

export type BotActivityEmitTypes =
  | "Turn"
  | "Message"
  | "ConversationUpdate"
  | "MembersAdded"
  | "MembersRemoved"
  | "TeamsMembersAdded"
  | "TeamsMembersRemoved"
  | "TeamsChannelCreated"
  | "TeamsChannelDeleted"
  | "TeamsChannelRenamed"
  | "MessageReaction"
  | "Event"
  | "TokenResponseEvent"
  | "UnrecognizedActivityType"
  | "ReactionsAdded"
  | "ReactionsRemoved"
  | "TeamsCardActionInvoke"
  | "TeamsSigninVerifyState"
  | "TeamsFileConsent"
  | "TeamsO365ConnectorCardAction"
  | "TeamsAppBasedLinkQuery"
  | "TeamsMessagingExtensionSelectItem"
  | "TeamsMessagingExtensionSelectItem"
  | "TeamsMessagingExtensionBotMessagePreviewEdit"
  | "TeamsMessagingExtensionBotMessagePreviewSend"
  | "TeamsMessagingExtensionSubmitAction"
  | "TeamsMessagingExtensionFetchTask"
  | "TeamsMessagingExtensionConfigurationQuerySettingUrl"
  | "TeamsMessagingExtensionConfigurationSetting"
  | "TeamsMessagingExtensionCardButtonClicked"
  | "TeamsTaskModuleFetch"
  | "TeamsTaskModuleSubmit"
  | "TeamsFileConsentAccept"
  | "TeamsFileConsentDecline"
  | "ActionInvoke";

export type BotActivityTypes = BotActivityRawTypes & BotActivityEmitTypes;

export interface BotReading {
  /** The unique identifier for this particular context activity    */
  bot_ActivityId?: string;
  /** The type of this particular context activity    */
  bot_ActivityType?: BotActivityTypes;
  /**  The channel identifier within team */
  bot_Channel?: { id: string; name?: string };
  /** The conversation reference (property bag as defined by source platform)  */
  bot_Conversation?: any;
  /** The unique id of the user (global and within the domain of the source platform) */
  bot_From: { id: string; localid?: string; name?: string };
  /** The intent of the message (usually derived in middleware by parsing audio or free form text, but may be provided by service provider such as Alexa) */
  bot_Intent?: string;
  /** Consumer app metadata for this record */
  bot_MetaData: { isRead?: boolean; isClosed?: boolean };
  /** The platform provider within the source platform e.g., "msteams" */
  bot_Provider?: string;
  /** The unique id of the bot (global and within the domain of the source platform)  */
  bot_Recipient?: { id: string; localid?: string; name?: string };
  /** The endpoint associated with the provider (e.g., botframework channel serviceurl) */
  bot_ServiceUrl?: string;
  /** The A property bag for the session record */
  bot_Session?: Partial<BotSession>;
  /** The urn of the conversational agent service provider e.g., "urn:io.iopa.bot:slack", "urn:io.iopa.bot:alexa" */
  bot_Source: string;
  /**  The team or organizational identifier (e.g., Slack team) */
  bot_Team?: { id: string /*, globalid?: string */ };
  /** The timestamp of the activity */
  timestamp: number | null;
  /** (The source message as entered by the user (with mentions normalized as needed)) */
  bot_Text?: string;
  /** The urn of the conversational agent service provider e.g., "urn:io.iopa.bot:slack", "urn:io.iopa.bot:alexa" */
  bot_Attachment?: BotAttachment;
  /** The section header string for grouping purposes */
  bot_Section?: string;

  /** Special reading to invoke iopa-bot framework dialog */
  "urn:bot:dialog:invoke"?: string;
  /** Unique key */
  key?: number;
}

export interface BotReadingLegacy extends BotReading {
  /** @deprecated legacy bot_text */
  "urn:consumer:message:text"?: string;
  /** @deprecated legacy bot_source */
  "urn:server:source"?: string;
  /** @deprecated legacy bot_From.id */
  "urn:consumer:id"?: string;
  /** @deprecated legacy timstamp  */
  "urn:server:timestamp"?: number | null;
  /** @deprecated legacy metadata  */
  "urn:consumer:metadata"?: { isRead: boolean };
  /** @deprecated legacy card attachment */
  card: { type: string; [key: string]: any };
}

export interface IMessageStoreSimple {
  items: BotReading[];
  addListener?: (type: string, listener: Function) => void;
  removeListener?: (type: string, listener: Function) => void;
}

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
  contentType?: "application/vnd.microsoft.card.adaptive" | string;
  /**
   * Embedded content
   * @type {any}
   * @memberof BotAttachment
   */
  content?: any;
}

export interface IMessageStore {
  /** The store is prepopulated with any items from session cache */
  isReady: Promise<void>;

  items: Partial<BotReading>[];
  push: (item: Partial<BotReadingLegacy>) => Promise<void>;
  clear: () => Promise<void>;

  closeCard: (seq?: number) => Promise<void>;
  removeCard: (seq: number) => Promise<void>;

  typingIndicatorOn: () => void;
  typingIndicatorOff: () => void;

  addListener?: (type: string, listener: Function) => void;
  removeListener?: (type: string, listener: Function) => void;
  emit: (event, ...args) => void;

  utterances: string[];
}

export interface BotCapabilities {
  "urn:io.iopa:app"?: {
    "iopa.Version": string;
    [key: string]: any;
  };

  "urn:consumer:profile"?: {
    "urn:consumer:firstname": string;
  };

  "urn:io.iopa.bot:speech": {
    speak: Function;
    speakWithPromise: Function;
  };

  "urn:io.iopa.filestorage": {
    put: Function;
  };

  "urn:io.iopa.bot:messages": IMessageStore;
}

export interface BotSessionDialog {
  /* current step id */
  id: string;
  /** version of the IOPA dialogs manager */
  iopaBotVersion: string;
  /** sequence number of the directive last executed in the current dialog step */
  lastDirective: number | null;
  /** id of step rendered before this one (for return logic) */
  previousId: string;
  /** last set of actions prompted to participant */
  lastPromptActions: any[] | null;
}

interface BotIntent {
  name: string;
  function: FC;
  schema?: any;
}

export interface BotSkill {
  /** unique short name of the skill */
  name: string;

  /** things to say  */
  messages: { [key: string]: string };

  /** use a minimal set of utterances or the full cartesian product?  */
  exhaustiveUtterances: boolean;

  /**  A mapping of keywords to arrays of possible values, for expansion of sample utterances */
  dictionaries: { [key: string]: string[] };

  /**  The itents that this skill can process */
  intents: { [key: string]: BotIntent };

  isGlobal(): boolean;

  /** global skills are always used in parsing;  non-global only parsed when launched */
  global(flag: boolean): this;

  lookupIntent(utterances: string[]): string | undefined;

  /** register a new intent handler for this skill  */
  intent(intentName: string, func: FC): this;
  intent(intentName: string, schema: any, func?: FC): this;
  intent(intentName: string, schema: any | FC, func?: FC): this;

  /** register a new dictionary for this skill  */
  dictionary(dictionary: { [key: string]: string[] }): this;

  /** @deprecated For alexa-app compatiabilty, just register Intent handler of "urn:io.iopa.bot:launch" */
  launch(func: FC);

  /** @deprecated For alexa-app compatiabilty,ust register Intent handler of "urn:io.iopa.bot:sessionended" */
  sessionEnded(func: FC);

  /** Export Helper Function to extract the schema and generate a schema JSON object */
  schema(): string;

  /** Export Helper Function to generate a list of sample utterances */
  utterances(): string;
}

export interface BotSession {
  /** id of the dialog step being executed in the current skill */
  bot_CurrentDialog: BotSessionDialog | null;
  /** timestamp that the last dialog step ended */
  bot_LastDialogEndedDate: number | null;
  /** Flag indicating whether this intent is the first for this session */
  bot_NewSession: boolean;
  /** id of the current executing bot session */
  bot_Skill: string;
  /** V2 semversion of the current executing bot session;  checked in case flow definition upgraded mid conversation */
  bot_SkillVersion: string;
  /** Skill data for current request */
  bot_Slots: string;
  /** property bag of all data collected in current skill session, including silent properties specifed on card actions */
  bot_Variables: any;
  /** flag indicating whether bot is expecting an answer to a multi-choice prompt */
  bot_isMultiChoicePrompt: boolean;
}

//
// Teams, Specialist specific
//

//
// Bot Related Capabilities
//

export interface ISessionDatabase {
  get(path: string): Promise<any>;
  put(path: string, blob: any): Promise<any>;
  delete(path: string): Promise<any>;
  isReady: Promise<void>;
  getKeys(): Promise<string[]>;
  clear(): Promise<void>;
}

export interface ISimpleDatabase {
  get(path: string): Promise<any>;
  push?(path: string, blob: any): Promise<any>;
  put(path: string, blob: any): Promise<any>;
  delete(path: string): Promise<any>;
  isReady?: Promise<void>;
}

/** urn:consumer:profile */
export interface IConsumerProfileSession {
  /** the unique id of the user/specialist/participant */
  id: string;

  /** tenant */
  tenant: string;

  /** skill prefix realm (usually the prefix of the hostname for web applications) */
  realm: string;

  /** the first name of the user, comnpatible with whendo user profile on all platforms including iOS, Android */
  readonly "urn:consumer:firstname": string;

  /** the user token used for second factor verifying request url  */
  token?: string;

  /** the static candidate data from the active table include name, stage, profile, etc.;  not generally updated during session */
  data?: any;

  /** Flag indicating if this is a new session at last refresh */
  isNewSession: boolean;

  /** Identify the advertiser, site, publication, etc. that is sending traffic, for example: google, newsletter4, billboard. */
  utm_source?: string;

  /** The advertising or marketing medium, for example: cpc, banner, email newsletter. */
  utm_medium?: string;

  /** The individual campaign name, slogan, promo code, etc.. */
  utm_campaign?: string;

  /** Paid search keywords */
  utm_term?: string;

  /**  Used to differentiate similar content, or links within the same ad  */
  utm_content?: string;
}

export interface IConsumerProfile extends IConsumerProfileSession {
  /** Promise that resolves once database connection is authenticated and user authorized */
  isReady: Promise<any>;

  /** whether this user id was supplied validated with a token */
  readonly isAuthenticated: boolean;

  /** clear profile and remove session data */
  logout(): Promise<void>;

  save: () => Promise<void>;

  setFirstName: (value: string) => Promise<void>;
}
