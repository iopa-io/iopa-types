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

export interface IopaRefMap<T> {
    addRef<I extends T>(iopaRef: IopaRef<T>, value: I): I
    getRef(iopaRef: IopaRef<T>): T | undefined
}

export interface IopaMap<T> {
    get<K extends keyof T>(key: K): T[K]
    has<K extends keyof T>(key: K): boolean
    set<K extends keyof T>(key: K, value: T[K])
    set<K extends keyof T>(value: IopaMapInit<any>)
    default<K extends keyof T>(key: K, valueFn: T[K] | (() => T[K])): T[K]
    delete<K extends keyof T>(key: K): boolean
    entries(): [any, any][]
    toJSON(): any
}

export type IopaMapInit<T> = Partial<T> | [keyof T, T[keyof T]][] | IopaMap<T>

export interface IopaHeaders extends IopaMap<Record<string, string>> {
    set(value: IopaHeadersInit)
    set(key: string, value: string)
}

export type IopaHeadersInit = IopaMapInit<Record<string, string>>

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
