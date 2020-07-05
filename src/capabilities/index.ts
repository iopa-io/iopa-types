/* eslint-disable @typescript-eslint/interface-name-prefix */
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

import type { URN_APP, IAppCapability } from './app'
import type { URN_BOT_DIALOG, IBotDialogCapability } from './bot-dialog'
import type { URN_BOT_SKILLS, IBotSkillsCapability } from './bot-skills'
import type { URN_BOT_SURFACE, IBotSurfaceCapability } from './bot-surface'
import type { URN_CONSUMER_PROFILE, IConsumerProfile } from './consumer-profile'
import type { URN_DEVTOOLS_BRIDGE, IDevToolsBridge } from './devtools-bridge'
import type {
  URN_DEVTOOLS_RENDERER,
  IDevToolsRenderer
} from './devtools-renderer'
import type { IEdgeSimpleStorage } from './edge-simple-storage'
import type { URN_FILEHOST, IFileHost } from './filehost'
import type { URN_FILE_STORAGE, IFileStorage } from './filestorage'

import type {
  URN_MESSAGE_STORE,
  URN_MESSAGE_STORE_SIMPLE,
  IMessageStore,
  IMessageStoreSimple
} from './message-store'
import type {
  URN_REACTIVE_DIALOGS,
  URN_REACTIVE_DIALOGS_SIMPLE,
  IReactiveDialogsCapability,
  IReactiveDialogsSimpleCapability
} from './reactive-dialogs'
import type { URN_SESSION, ISessionCapability } from './session'
import type { URN_SESSION_DATABASE, ISessionDatabase } from './session-database'
import type { URN_SIMPLE_DATABASE, ISimpleDatabase } from './simple-database'
import type { URN_SPEECH, ISpeech } from './speech'

// OTHER IMPORTS
import type { IopaMap } from '../types/map'

export type {
  IBotDialogCapability as IDialogCapability,
  IBotSkillsCapability as ISkillsCapability,
  IBotSurfaceCapability,
  IConsumerProfile,
  IDevToolsBridge,
  IDevToolsRenderer,
  IEdgeSimpleStorage,
  IFileHost as ISimpleFileHost,
  IFileStorage,
  IMessageStore,
  IMessageStoreSimple,
  IReactiveDialogsCapability,
  ISessionCapability,
  ISessionDatabase,
  ISimpleDatabase,
  ISpeech
}

export { AppRef } from './app'
export { BotDialogRef } from './bot-dialog'
export { BotSkillsRef } from './bot-skills'
export { BotSurfaceRef } from './bot-surface'
export { ConsumerProfileRef } from './consumer-profile'
export { DevToolsBridgeRef } from './devtools-bridge'
export { DevToolsRendererRef } from './devtools-renderer'
export {
  EdgeSimpleStorageDevRef,
  EdgeSimpleStorageStagingRef,
  EdgeSimpleStorageProdRef
} from './edge-simple-storage'
export { FileHostRef } from './filehost'
export { FileStorageRef } from './filestorage'
export { MessageStoreRef, MessageStoreSimpleRef } from './message-store'
export {
  ReactiveDialogsRef,
  ReactiveDialogsSimpleRef
} from './reactive-dialogs'
export { SessionRef } from './session'
export { SessionDatabaseRef } from './session-database'
export { SimpleDatabaseRef } from './simple-database'
export { SpeechRef } from './speech'

//
// CAPABILITY BASE PROPERTY COLLECTIONS
//

export interface AppCapabilitiesBase {
  [URN_APP]: IAppCapability
}

export interface BotCapabilitiesBase extends AppCapabilitiesBase {
  [URN_BOT_DIALOG]: IBotDialogCapability
  [URN_BOT_SKILLS]: IBotSkillsCapability
  [URN_BOT_SURFACE]?: IBotSurfaceCapability
  [URN_CONSUMER_PROFILE]?: IConsumerProfile
  [URN_DEVTOOLS_BRIDGE]: IDevToolsBridge
  [URN_DEVTOOLS_RENDERER]: IDevToolsRenderer

  [URN_FILEHOST]?: IFileHost
  [URN_FILE_STORAGE]?: IFileStorage
  [URN_MESSAGE_STORE]: IMessageStore
  [URN_MESSAGE_STORE_SIMPLE]?: IMessageStoreSimple
  [URN_REACTIVE_DIALOGS]: IReactiveDialogsCapability
  [URN_REACTIVE_DIALOGS_SIMPLE]?: IReactiveDialogsSimpleCapability
  [URN_SESSION]: ISessionCapability
  [URN_SESSION_DATABASE]: ISessionDatabase
  [URN_SIMPLE_DATABASE]: ISimpleDatabase
  [URN_SPEECH]?: ISpeech
}

// CAPABILITY SETS

export type IopaCapabilities = IopaMap<AppCapabilitiesBase>
export type IopaBotCapabilities = IopaMap<BotCapabilitiesBase>
