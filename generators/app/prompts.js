/**
 * Copyright 2013-2022 the original author or authors from the JHipster project.
 *
 * This file is part of the JHipster project, see https://www.jhipster.tech/
 * for more information.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
const chalk = require('chalk');

module.exports = {
    askForInsightOptIn,
    askForApplicationType,
    askForModuleName,
    askForTestOpts,
    askForMoreModules,
};

async function askForInsightOptIn() {
    //`May ${chalk.cyan('JHipster')} anonymously report usage statistics to improve the tool over time?`,

}
const microfrontendsToPromptValue = answer => (Array.isArray(answer) ? answer.map(({ baseName }) => baseName).join(',') : answer);
const promptValueToMicrofrontends = answer =>
  answer
    ? answer
        .split(',')
        .map(baseName => baseName.trim())
        .filter(Boolean)
        .map(baseName => ({ baseName }))
    : [];


async function askForApplicationType() {
    if (this.existingProject && this.options.askAnswered !== true) return;

    const applicationTypeChoices = [
        {
            value: 'monolith',
            name: 'MonolithicA application (recommended for simple projects)',
        },
        {
            value: 'gateway',
            name: 'Gateway application',
        },
        {
            value: 'microservice',
            name: 'Microservice application',
        },
    ];

    await this.prompt(
        [
            {
                type: 'list',
                name: 'applicationType',
                message: `Which ${chalk.yellow('*type*')} of application would you like to create?`,
                choices: applicationTypeChoices,
                default: 'monolith',
            },
            {
                when: answers => {
                    const { applicationType } = answers;
                    const askForMicrofrontend = ['gateway', 'microservice'].includes(applicationType);
                    if (!askForMicrofrontend) {
                        answers.microfrontend = false;
                    }
                    return askForMicrofrontend;
                },
                type: 'confirm',
                name: 'microfrontend',
                message: `Do you want to enable ${chalk.yellow('*microfrontends*')}?`,
                default: false
            },
            {
                when: answers => {
                    const { applicationType, microfrontend, microfrontends } = answers;
                    const askForMicrofrontends = applicationType === 'gateway' && microfrontend;
                    if (askForMicrofrontends) {
                        answers.microfrontends = microfrontendsToPromptValue(microfrontends);
                    } else {
                        answers.microfrontends = [];
                    }
                    return askForMicrofrontends;
                },
                type: 'input',
                name: 'microfrontends',
                message: `Comma separated ${chalk.yellow('*microfrontend*')} app names.`,
                filter: promptValueToMicrofrontends,
                transformer: microfrontendsToPromptValue,
            },
        ],
        this.config
    );

    const { applicationType } = this.jhipsterConfig;
    // TODO drop for v8, setting the generator with config is deprecated
    this.applicationType = applicationType;
}

function askForModuleName() {
    if (this.existingProject || this.jhipsterConfig.baseName) return undefined;
    return this.askModuleName(this);
}

async function askForTestOpts() {
    if (this.existingProject) return undefined;

    const choices = [];
    if (!this.skipClient) {
        // all client side test frameworks should be added here
        choices.push({ name: 'Cypress', value: 'cypress' });
        choices.push({ name: '[DEPRECATED] Protractor', value: 'protractor' });
    }
    if (!this.skipServer) {
        // all server side test frameworks should be added here
        choices.push({ name: 'Gatling', value: 'gatling' }, { name: 'Cucumber', value: 'cucumber' });
    }
    const PROMPT = {
        type: 'checkbox',
        name: 'testFrameworks',
        message: 'Besides JUnit and Jest, which testing frameworks would you like to use?',
        choices,
        default: [],
    };

    const answers = await this.prompt(PROMPT);
    this.testFrameworks = this.jhipsterConfig.testFrameworks = answers.testFrameworks;
    return answers;
}

function askForMoreModules() {
    // message: 'Would you like to install other generators from the JHipster Marketplace?',

}

function askModulesToBeInstalled(done, generator) {
    //additionnal jhipster modules
}
