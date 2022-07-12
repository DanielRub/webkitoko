/**
 * Copyright 2013-2017 the original author or authors from the JHipster project.
 *
 * This file is part of the JHipster project, see http://www.jhipster.tech/
 * for more information.
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
/* eslint-disable consistent-return */
const chalk = require('chalk');
const _ = require('lodash');
const path = require('path');
const ClientGenerator = require('generator-jhipster/generators/client');
const prompts = require('./prompts');
const writeCommonFiles = require('./files-common').writeFiles;
const writeReactFiles = require('./files-react').writeFiles;


module.exports = class extends ClientGenerator {
    constructor(args, opts) {
        super(args, Object.assign({ fromBlueprint: true }, opts)); // fromBlueprint variable is important

        const jhContext = this.jhipsterContext = this.options.jhipsterContext;

        if (!jhContext) {
            this.error(`This is a JHipster blueprint and should be used only like ${chalk.yellow('jhipster --blueprint generator-jhipster-sample-blueprint')}`);
        }

        this.configOptions = jhContext.configOptions || {};

        // jhContext.setupClientOptions(this, jhContext);
    }

    get initializing() {
        // any method beginning with _ can be reused from the superclass
        return super._initializing();
    }


    get prompting() {
        /*
         return {
             setSharedConfigOptions() {
                 this.configOptions.lastQuestion = this.currentQuestion;
                 this.configOptions.totalQuestions = this.totalQuestions;
                 this.configOptions.clientFramework = 'react';
                 this.configOptions.useSass = false;
             }
         }; */
        return super._prompting();
    }

    get configuring() {
        return super._configuring();
    }
    get composing() {
        return super._composing();
    }
    get loading() {
        return {
            loadSharedConfig() {
                this.loadAppConfig();
                this.loadClientConfig();
                this.loadServerConfig();
                this.loadTranslationConfig();
            },

            validateSkipServer() {
                if (
                    this.jhipsterConfig.skipServer &&
                    !(
                        this.jhipsterConfig.databaseType &&
                        this.jhipsterConfig.devDatabaseType &&
                        this.jhipsterConfig.prodDatabaseType &&
                        this.jhipsterConfig.authenticationType
                    )
                ) {
                    this.error(
                        `When using skip-server flag, you must pass a database option and authentication type using ${chalk.yellow(
                            '--db'
                        )} and ${chalk.yellow('--auth')} flags`
                    );
                }
            },

            loadPackageJson() {
                // Load common client package.json into packageJson
                _.merge(
                    this.dependabotPackageJson,
                    this.fs.readJSON(path.join(__dirname,'templates', 'common', 'package.json'))
                );
                // Load client package.json into packageJson
                const clientFramewok = this.jhipsterConfig.clientFramework === 'angularX' ? 'angular' : this.jhipsterConfig.clientFramework;
                _.merge(
                    this.dependabotPackageJson,
                    this.fs.readJSON(path.join(__dirname,'templates', clientFramewok, 'package.json'))
                );
            },
        };
    }
    get preparing() {
        return super._preparing()
    }

    get default() {
        return super._default();
    }

    get writing() {
        return {
            write() {
                // we override the jhipster defaut writing method. angular and vue are no longer options.
                //useBlueprints param does not seem to be needed
                return writeReactFiles.call(this);
            },
            writeCommonFiles() {
                return writeCommonFiles.call(this);
            },
            ...super._missingPostWriting(),
        };
    }

    get install() {
        return super._install();
        // return {}
    }

    get end() {
        return super._end();
        // return {};
    }
};
