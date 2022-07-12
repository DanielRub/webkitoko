/**
 * Copyright 2013-2021 the original author or authors from the JHipster project.
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
/* eslint-disable consistent-return */
const _ = require('lodash');

const CommonGenerator = require('generator-jhipster/generators/common');
const writeFiles = require('./files').writeFiles;
const prettierConfigFiles = require('./files').prettierConfigFiles;

module.exports = class JHipsterCommonGenerator extends CommonGenerator {
    constructor(args, opts) {
        super(args, Object.assign({ fromBlueprint: true }, opts)); // fromBlueprint variable is important

        const jhContext = this.jhipsterContext = this.options.jhipsterContext;

        if (!jhContext) {
            this.error(`This is a JHipster blueprint and should be used only like ${chalk.yellow('jhipster --blueprint helloworld')}`);
        }

        this.configOptions = jhContext.configOptions || {};
    }



    get initializing() {
        const initPhaseFromJHipster = super._initializing();

        const kitokoInitPhase = {
            /* setupConstants() {
               // Make constants available in templates
               this.MAIN_DIR = constants.MAIN_DIR;
               this.TEST_DIR = constants.TEST_DIR;
               this.SERVER_MAIN_RES_DIR = constants.SERVER_MAIN_RES_DIR;
               this.ANGULAR = constants.SUPPORTED_CLIENT_FRAMEWORKS.ANGULAR;
               this.REACT = constants.SUPPORTED_CLIENT_FRAMEWORKS.REACT;

               // Make documentation URL available in templates
               this.DOCUMENTATION_URL = constants.JHIPSTER_DOCUMENTATION_URL;
               this.DOCUMENTATION_ARCHIVE_PATH = constants.JHIPSTER_DOCUMENTATION_ARCHIVE_PATH;
             },
     */


        }

        return { ...initPhaseFromJHipster, ...kitokoInitPhase };
    }

    get loading() {
        return super._loading();
    }

    get preparing() {
        return super._preparing();
    }

    get default() {
        return super._default();
    }



    get writing() {
        const kitokoWritingPhase = {
            writePrettierConfig() {
                // Prettier configuration needs to be the first written files - all subgenerators considered - for prettier transform to work
                return this.writeFilesToDisk(prettierConfigFiles);
            },
            ...writeFiles(),
            ...super._missingPostWriting(),
        };
        return kitokoWritingPhase;
    }
};
