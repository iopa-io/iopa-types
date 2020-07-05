declare type JsonObject = {
  [key in string]?: JsonValue
}
declare type JsonArray = JsonValue[]
declare type JsonValue =
  | JsonObject
  | JsonArray
  | number
  | string
  | boolean
  | null
declare type AppConfig = {
  context: string
  data: JsonObject
}
declare type Config = {
  keys(): string[]
  get(key: string): JsonValue
  getOptional(key: string): JsonValue | undefined
  getConfig(key: string): Config
  getOptionalConfig(key: string): Config | undefined
  getConfigArray(key: string): Config[]
  getOptionalConfigArray(key: string): Config[] | undefined
  getNumber(key: string): number
  getOptionalNumber(key: string): number | undefined
  getBoolean(key: string): boolean
  getOptionalBoolean(key: string): boolean | undefined
  getString(key: string): string
  getOptionalString(key: string): string | undefined
  getStringArray(key: string): string[]
  getOptionalStringArray(key: string): string[] | undefined
}

export { AppConfig, Config, JsonArray, JsonObject, JsonValue }
