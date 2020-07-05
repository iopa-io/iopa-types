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

export interface IDisposable {
  dispose(...args: any[]): void
}

export interface IEventEmitter {
  emit(event: string, ...args: any[]): void
  on(event: string, cb: Listener): IDisposable
  once(event: string, cb: Listener): IDisposable
  clear(event?: string): void
}

export type Listener = (...args: any[]) => any
export type Disposer = () => void
