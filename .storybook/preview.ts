import type { Preview } from '@storybook/vue3'

const preview: Preview = {
	parameters: {
		actions: { argTypesRegex: '^on[A-Z].*' },
		controls: {
			expanded: true,
			matchers: {
				color: /(background|color)$/i,
				date: /Date$/,
			},
		},
	},
	argTypes: {
		token: {
			control: 'text',
			description:
				'x-access-token when using ClientId is false, else using bearer token',
		},
		clientId: {
			control: 'text',
			description: 'set clientId for scope children component',
		},
		namespaceChildren: {
			control: 'text',
			description: 'namespace for scope children component',
			defaultValue: 'stories-scope',
			table: {
				category: 'Provider Props',
			},
		},
		baseUrl: {
			control: 'text',
			description: 'set base url for scope children component',
			defaultValue: 'http://ds-api.qa.channelprecision.com/v1/',
			table: {
				category: 'Provider Props',
			},
		},
		handleRequestConfig: {
			control: {
				type: 'object',
				disable: true,
			},
			description:
				'(Optional) set interceptor to handle request config. Follow: https://axios-http.com/docs/interceptors',
			table: {
				category: 'Provider Props',
			},
		},
		handleResponseError: {
			control: {
				type: 'object',
				disable: true,
			},
			description:
				'(Optional) set interceptor to handle response when error. Follow: https://axios-http.com/docs/interceptors',
			table: {
				category: 'Provider Props',
			},
		},
	},
	args: {
		namespaceChildren: 'stories-scope',
		baseUrl: 'http://ds-api.qa.channelprecision.com/v1/',
		token: '652cce4a-7190-475f-8e4d-d73b02173ab5',
		clientId: undefined,
	},
}

export default preview
