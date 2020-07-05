import { createIopaRef } from '../lib'

export const URN_SPEECH = 'urn:io.iopa.bot:speech'

export interface ISpeech {
  speak: Function
  speakWithPromise: Function
}

export const SpeechRef = createIopaRef<ISpeech>({
  id: URN_SPEECH,
  description: 'Text to speech capability'
})
