import type { PluginProps, Component, IPluginClass, PluginApp } from '../types'

export function createPlugin(props: PluginProps): Component {
    return class implements IPluginClass {
        private props: PluginProps

        constructor(app: PluginApp) {
            this.props = props
            this.props.register({
                app,
                router: app,
                featureFlags: {
                    register(name) {
                        app.registerFeatureFlag({ name })
                    },
                },
            })
        }

        public get id(): string {
            return this.props.id
        }

        public get description(): string {
            return this.props.description
        }

        public get title(): string {
            return this.props.title
        }

        public get icon(): string {
            return this.props.icon
        }

        toString() {
            return `plugin{${this.props.id}}`
        }
    }
}
