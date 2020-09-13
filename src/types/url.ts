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
