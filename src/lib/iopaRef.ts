import type { IopaRef, IopaRefConfig } from 'iopa-types'

// RFC 2141 with the addition of allowing periods in the first segment / domain name and allowing only one segment
const URN_WEAK = new RegExp(
  /^urn:[a-z0-9][a-z0-9-]{0,31}(:([a-z0-9()+,\-.:=@;$_!*']|%[0-9a-f]{2})+)?$/
)

// RFC 2141 strict
const URN_STRICT = new RegExp(
  /^urn:[a-z0-9][a-z0-9-]{0,31}(:([a-z0-9()+,\-.:=@;$_!*']|%[0-9a-f]{2})+)?$/
)

class IopaRefImpl<T> implements IopaRef<T> {
  constructor(private readonly config: IopaRefConfig) {
    if (!config.id.startsWith('urn:')) {
      config.id = `urn:${config.id}`
    }
    const valid = URN_STRICT.test(config.id)
    if (!valid) {
      if (URN_WEAK.test(config.id)) {
        throw new Error(
          `Iopa Ref id must be a valid URN according to RFC2141, got '${config.id}'`
        )
      }
    }
  }

  get id(): string {
    return this.config.id
  }

  get description(): string {
    return this.config.description
  }

  // Utility for getting type of an IOPA Ref, using `typeof iopaRef.T`
  get T(): T {
    throw new Error(`tried to read iopaRef.T of ${this}`)
  }

  toString() {
    return `iopaRef{${this.config.id}}`
  }
}

export function createIopaRef<T>(config: IopaRefConfig): IopaRef<T> {
  return new IopaRefImpl<T>(config)
}

export function createCapabilityRef<T>(config: IopaRefConfig): IopaRef<T> {
  return createIopaRef(config)
}
