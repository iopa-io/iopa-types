import { createIopaRef } from '../lib'

import type { BotSkill, BotSkills } from '../types'

export const URN_BOT_SKILLS = 'urn:io.iopa.bot:skills'

export interface IBotSkillsCapability {
  ['iopa.Version']: string
  /** debugging is verbose for this skill */
  verbose: boolean
  /**  session timeout in milliseconds, 0 to disable */
  timeout: 300000 //
  /** map of skill names to skills */
  skills: BotSkills
  /** add a new skill with given name and return it */
  add(name: string): BotSkill
  /** get the skill with the given name */
  skill(name: string): BotSkill | undefined
}

export const BotSkillsRef = createIopaRef<IBotSkillsCapability>({
  id: URN_BOT_SKILLS,
  description: 'Iopa Bot Skills registry'
})
