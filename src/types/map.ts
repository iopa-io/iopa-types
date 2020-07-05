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

export interface IopaMap<T> {
  get<K extends keyof T>(key: K): T[K]
  set<K extends keyof T>(key: K, value: T[K])
  delete<K extends keyof T>(key: K): boolean
  toJSON(): T
}

export interface IopaRefMap {
  addRef<T, I extends T>(iopaRef: IopaRef<T>, impl: I): I
  getRef<T>(IopaRef: IopaRef<T>): T | undefined
}

export type IopaRefConfig = {
  id: string
  description: string
}

export type IopaRef<T> = {
  id: string
  description: string
  T: T
}

export type Capabilities<T> = IopaMap<T>
