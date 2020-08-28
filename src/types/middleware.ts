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

import { IopaBotContext, IopaContext, IopaEdgeContext } from './context'

export interface Component {
  /** constructor called once upon registration */
  constructor: Function

  /** invoke function called for every reading  */
  invoke?(context: IopaBotContext, next?: () => Promise<void>): Promise<void>
}

export type AppFunc = (
  context: IopaContext,
  next: () => Promise<void>
) => Promise<void>

export type RouterFunc = (context: IopaEdgeContext) => Promise<void>

export type FC = (
  context: IopaBotContext,
  next: () => Promise<void>
) => Promise<void>

export type Invoker = (context: IopaBotContext) => Promise<void>

export type Middleware = FC | Component
