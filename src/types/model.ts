/* eslint-disable @typescript-eslint/no-explicit-any */
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

import { IopaMap } from './map'
import { FC } from './middleware'

export type IopaBotSession = IopaMap<BotSessionBase> & BotSessionBase

export interface BotSessionBase {
  id: string
  updated: number
  /** id of the dialog step being executed in the current skill */
  'bot.CurrentDialog': BotSessionDialog | BotSessionDialogLegacy | null
  /** timestamp that the last dialog step ended */
  'bot.LastDialogEndedDate': number | null
  /** Flag indicating whether this intent is the first for this session */
  'bot.NewSession': boolean
  /** id of the current executing bot session */
  'bot.Skill': string
  /** V2 semversion of the current executing bot session;  checked in case flow definition upgraded mid conversation */
  'bot.SkillVersion': string
  /** Skill data for current request */
  'bot.Slots': string
  /** property bag of all data collected in current skill session, including silent properties specifed on card actions */
  'bot.Variables': any
  /** flag indicating whether bot is expecting an answer to a multi-choice prompt */
  'bot.isMultiChoicePrompt': boolean
}

export interface SessionCurrentDialog {
  /* current step id */
  id: string
  /** version of the IOPA dialogs manager */
  iopaBotVersion: '2.0'
  /** sequence number of the directive last executed in the current dialog step */
  lastDirective: number | null
  /** id of step rendered before this one (for return logic) */
  previousId: string
  /** last set of actions prompted to participant (ActionElement from reactive-dialogs) */
  lastPromptActions: any[] | null
}

/** Reactive Dialogs Session passed to every context record */
export interface ReactiveDialogsSession {
  /** id of the dialog step being executed in the current skill */
  'bot.CurrentDialog': SessionCurrentDialog | null
  /** timestamp that the last dialog step ended */
  'bot.LastDialogEndedDate': number | null
  /** Flag indicating whether this intent is the first for this session */
  'bot.NewSession': boolean
  /** id of the current executing bot session */
  'bot.Skill': string
  /** V2 semversion of the current executing bot session;  checked in case flow definition upgraded mid conversation */
  'bot.SkillVersion': string
  /** Skill data for current request */
  'bot.Slots': string
  /** property bag of all data collected in current skill session, including silent properties specifed on card actions */
  'bot.Variables': any
}

export interface BotSessionDialogLegacy {
  /* name */
  name: string
  /** current step within dialog */
  step: number
  /** total number of steps for current dialog */
  totalSteps: number
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

type BotDialogStep = string[] | FC

export interface BotDialog {
  name: string
  steps: BotDialogStep[]
}

interface BotIntent {
  name: string
  function: FC
  schema?: BotIntentSchema
}

interface BotIntentSchema {
  intent: string
  slots: { [key: string]: string }
  utterances: string[]
}

interface BotIntentSchemaAlexa {
  intent: string
  slots: { name: string; type: string }[]
}

export interface BotSkill {
  /** unique short name of the skill */
  name: string

  /** things to say  */
  messages: { [key: string]: string }

  /** use a minimal set of utterances or the full cartesian product?  */
  exhaustiveUtterances: boolean

  /**  A mapping of keywords to arrays of possible values, for expansion of sample utterances */
  dictionaries: { [key: string]: string[] }

  /**  The itents that this skill can process */
  intents: { [key: string]: BotIntent }

  isGlobal(): boolean

  /** global skills are always used in parsing;  non-global only parsed when launched */
  global(flag: boolean): this

  lookupIntent(utterances: string[]): string | undefined

  /** register a new intent handler for this skill  */
  intent(intentName: string, func: FC): this
  intent(intentName: string, schema: any, func?: FC): this
  intent(intentName: string, schema: any | FC, func?: FC): this

  /** register a new dictionary for this skill  */
  dictionary(dictionary: { [key: string]: string[] }): this

  /** @deprecated For alexa-app compatiabilty, just register Intent handler of "urn:io.iopa.bot:launch" */
  launch(func: FC)

  /** @deprecated For alexa-app compatiabilty,ust register Intent handler of "urn:io.iopa.bot:sessionended" */
  sessionEnded(func: FC)

  /** Export Helper Function to extract the schema and generate a schema JSON object */
  schema(): string

  /** Export Helper Function to generate a list of sample utterances */
  utterances(): string
}

export type BotSkills = { [key: string]: BotSkill }
