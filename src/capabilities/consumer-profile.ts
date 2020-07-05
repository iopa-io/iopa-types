import { createIopaRef } from '../lib'

export const URN_CONSUMER_PROFILE = 'urn:consumer:profile'

export interface IConsumerProfileSession {
  /** the unique id of the user/specialist/participant */
  id: string

  /** tenant */
  tenant: string

  /** skill prefix realm (usually the prefix of the hostname for web applications) */
  realm: string

  /** the first name of the user, comnpatible with whendo user profile on all platforms including iOS, Android */
  readonly 'urn:consumer:firstname': string

  /** the user token used for second factor verifying request url  */
  token?: string

  /** the static candidate data from the active table include name, stage, profile, etc.;  not generally updated during session */
  data?: any

  /** Flag indicating if this is a new session at last refresh */
  isNewSession: boolean

  /** Identify the advertiser, site, publication, etc. that is sending traffic, for example: google, newsletter4, billboard. */
  utm_source?: string

  /** The advertising or marketing medium, for example: cpc, banner, email newsletter. */
  utm_medium?: string

  /** The individual campaign name, slogan, promo code, etc.. */
  utm_campaign?: string

  /** Paid search keywords */
  utm_term?: string

  /**  Used to differentiate similar content, or links within the same ad  */
  utm_content?: string
}

export interface IConsumerProfile extends IConsumerProfileSession {
  ['iopa.Version']: string
  /** Promise that resolves once database connection is authenticated and user authorized */
  isReady: Promise<any>

  /** whether this user id was supplied validated with a token */
  readonly isAuthenticated: boolean

  /** clear profile and remove session data */
  logout(): Promise<void>

  save: () => Promise<void>

  setFirstName: (value: string) => Promise<void>
}

export const ConsumerProfileRef = createIopaRef<IConsumerProfile>({
  id: URN_CONSUMER_PROFILE,
  description:
    'User profile store including name, tenant, UTM codes, authentication status and methods'
})
