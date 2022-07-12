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
const chalk = require('chalk');
const _ = require('lodash');
const os = require('os');
const prompts = require('./prompts');
const ServerGenerator = require('generator-jhipster/generators/server');
const writeFiles = require('./files').writeFiles;

module.exports = class JHipsterServerGenerator extends ServerGenerator {
    constructor(args, opts) {
        super(args, Object.assign({ fromBlueprint: true }, opts)); // fromBlueprint variable is important

        const jhContext = this.jhipsterContext = this.options.jhipsterContext;

        if (!jhContext) {
            this.error(`This is a JHipster blueprint and should be used only like ${chalk.yellow('jhipster --blueprint helloworld')}`);
        }

        this.configOptions = jhContext.configOptions || {};
    }


    get initializing() {
        return super._initializing();
    }



    get prompting() {
        return {
            ...super._prompting(),
            askForModuleName: prompts.askForModuleName,
            askForServerSideOpts: prompts.askForServerSideOpts,
            askForOptionalItems: prompts.askForOptionalItems,
        };
    }


    get configuring() {
        return super._configuring();
    }
    get composing() {
        return super._composing();
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
        return { ...writeFiles(), ...super._missingPostWriting() };
    }

    _postWriting() {
        return {
            packageJsonScripts() {
                const packageJsonConfigStorage = this.packageJson.createStorage('config').createProxy();
                packageJsonConfigStorage.backend_port = this.serverPort;
                packageJsonConfigStorage.packaging = process.env.JHI_WAR === '1' ? 'war' : 'jar';
                if (process.env.JHI_PROFILE) {
                    packageJsonConfigStorage.default_environment = process.env.JHI_PROFILE.includes('dev') ? 'dev' : 'prod';
                }
            },
            packageJsonDockerScripts() {
                const scriptsStorage = this.packageJson.createStorage('scripts');
                const databaseType = this.jhipsterConfig.databaseType;
                const dockerAwaitScripts = [];
                if (databaseType === 'sql') {
                    const prodDatabaseType = this.jhipsterConfig.prodDatabaseType;
                    if (prodDatabaseType === 'no' || prodDatabaseType === 'oracle') {
                        scriptsStorage.set('docker:db:up', `echo "Docker for db ${prodDatabaseType} not configured for application ${this.baseName}"`);
                    } else {
                        scriptsStorage.set({
                            'docker:db:up': `docker-compose -f src/main/docker/${prodDatabaseType}.yml up -d`,
                            'docker:db:down': `docker-compose -f src/main/docker/${prodDatabaseType}.yml down -v --remove-orphans`,
                        });
                    }
                } else {
                    const dockerFile = `src/main/docker/${databaseType}.yml`;
                    if (databaseType === 'cassandra') {
                        scriptsStorage.set({
                            'docker:db:await': 'wait-on tcp:9042 && sleep 20',
                        });
                    }
                    if (databaseType === 'couchbase' || databaseType === 'cassandra') {
                        scriptsStorage.set({
                            'docker:db:build': `docker-compose -f ${dockerFile} build`,
                            'docker:db:up': `docker-compose -f ${dockerFile} up -d`,
                            'docker:db:down': `docker-compose -f ${dockerFile} down -v --remove-orphans`,
                        });
                    } else if (this.fs.exists(this.destinationPath(dockerFile))) {
                        scriptsStorage.set({
                            'docker:db:up': `docker-compose -f ${dockerFile} up -d`,
                            'docker:db:down': `docker-compose -f ${dockerFile} down -v --remove-orphans`,
                        });
                    } else {
                        scriptsStorage.set('docker:db:up', `echo "Docker for db ${databaseType} not configured for application ${this.baseName}"`);
                    }
                }

                const dockerOthersUp = [];
                const dockerOthersDown = [];
                const dockerBuild = [];
                ['keycloak', 'elasticsearch', 'kafka', 'consul', 'redis', 'memcached', 'jhipster-registry'].forEach(dockerConfig => {
                    const dockerFile = `src/main/docker/${dockerConfig}.yml`;
                    if (this.fs.exists(this.destinationPath(dockerFile))) {
                        if (['cassandra', 'couchbase'].includes(dockerConfig)) {
                            scriptsStorage.set(`docker:${dockerConfig}:build`, `docker-compose -f ${dockerFile} build`);
                            dockerBuild.push(`npm run docker:${dockerConfig}:build`);
                        } else if (dockerConfig === 'jhipster-registry') {
                            dockerAwaitScripts.push(
                                'echo "Waiting for jhipster-registry to start" && wait-on http-get://localhost:8761/management/health && echo "jhipster-registry started"'
                            );
                        }

                        scriptsStorage.set(`docker:${dockerConfig}:up`, `docker-compose -f ${dockerFile} up -d`);
                        dockerOthersUp.push(`npm run docker:${dockerConfig}:up`);
                        scriptsStorage.set(`docker:${dockerConfig}:down`, `docker-compose -f ${dockerFile} down -v --remove-orphans`);
                        dockerOthersDown.push(`npm run docker:${dockerConfig}:down`);
                    }
                });
                scriptsStorage.set({
                    'docker:others:await': dockerAwaitScripts.join(' && '),
                    'predocker:others:up': dockerBuild.join(' && '),
                    'docker:others:up': dockerOthersUp.join(' && '),
                    'docker:others:down': dockerOthersDown.join(' && '),
                    'ci:e2e:prepare:docker': 'npm run docker:db:up && npm run docker:others:up && docker ps -a',
                    'ci:e2e:prepare': 'npm run ci:e2e:prepare:docker',
                    'ci:e2e:teardown:docker': 'npm run docker:db:down --if-present && npm run docker:others:down && docker ps -a',
                    'ci:e2e:teardown': 'npm run ci:e2e:teardown:docker',
                });
            },
            packageJsonBackendScripts() {
                const scriptsStorage = this.packageJson.createStorage('scripts');
                const javaCommonLog = `-Dlogging.level.ROOT=OFF -Dlogging.level.org.zalando=OFF -Dlogging.level.tech.jhipster=OFF -Dlogging.level.${this.jhipsterConfig.packageName}=OFF`;
                const javaTestLog =
                    '-Dlogging.level.org.springframework=OFF -Dlogging.level.org.springframework.web=OFF -Dlogging.level.org.springframework.security=OFF';

                const buildTool = this.jhipsterConfig.buildTool;
                let e2ePackage = 'target/e2e';
                if (buildTool === 'maven') {
                    scriptsStorage.set({
                        'backend:info': './mvnw -ntp enforcer:display-info --batch-mode',
                        'backend:doc:test': './mvnw -ntp javadoc:javadoc --batch-mode',
                        'backend:nohttp:test': './mvnw -ntp checkstyle:check --batch-mode',
                        'backend:start': './mvnw -P-webapp',
                        'java:jar': './mvnw -ntp verify -DskipTests --batch-mode',
                        'java:war': './mvnw -ntp verify -DskipTests --batch-mode -Pwar',
                        'java:docker': './mvnw -ntp verify -DskipTests jib:dockerBuild',
                        'backend:unit:test': `./mvnw -ntp -P-webapp verify --batch-mode ${javaCommonLog} ${javaTestLog}`,
                    });
                } else if (buildTool === 'gradle') {
                    const excludeWebapp = this.jhipsterConfig.skipClient ? '' : '-x webapp';
                    e2ePackage = 'e2e';
                    scriptsStorage.set({
                        'backend:info': './gradlew -v',
                        'backend:doc:test': `./gradlew javadoc ${excludeWebapp}`,
                        'backend:nohttp:test': `./gradlew checkstyleNohttp ${excludeWebapp}`,
                        'backend:start': `./gradlew ${excludeWebapp}`,
                        'java:jar': './gradlew bootJar -x test -x integrationTest',
                        'java:war': './gradlew bootWar -Pwar -x test -x integrationTest',
                        'java:docker': './gradlew bootJar jibDockerBuild',
                        'backend:unit:test': `./gradlew test integrationTest ${excludeWebapp} ${javaCommonLog} ${javaTestLog}`,
                        'postci:e2e:package': 'cp build/libs/*SNAPSHOT.$npm_package_config_packaging e2e.$npm_package_config_packaging',
                    });
                }

                scriptsStorage.set({
                    'java:jar:dev': 'npm run java:jar -- -Pdev,webapp',
                    'java:jar:prod': 'npm run java:jar -- -Pprod',
                    'java:war:dev': 'npm run java:war -- -Pdev,webapp',
                    'java:war:prod': 'npm run java:war -- -Pprod',
                    'java:docker:dev': 'npm run java:docker -- -Pdev,webapp',
                    'java:docker:prod': 'npm run java:docker -- -Pprod',
                    'ci:backend:test': 'npm run backend:info && npm run backend:doc:test && npm run backend:nohttp:test && npm run backend:unit:test',
                    'ci:server:package': 'npm run java:$npm_package_config_packaging:$npm_package_config_default_environment',
                    'ci:e2e:package':
                        'npm run java:$npm_package_config_packaging:$npm_package_config_default_environment -- -Pe2e -Denforcer.skip=true',
                    'preci:e2e:server:start': 'npm run docker:db:await --if-present && npm run docker:others:await --if-present',
                    'ci:e2e:server:start': `java -jar ${e2ePackage}.$npm_package_config_packaging --spring.profiles.active=$npm_package_config_default_environment ${javaCommonLog} ${javaTestLog} --logging.level.org.springframework.web=ERROR`,
                });
            },
        };
    }

    get postWriting() {
        return this._postWriting();
    }

    get end() {
        return {
            end() {
                this.log(chalk.green.bold('\nServer application generated successfully.\n'));

                let executable = 'mvnw';
                if (this.buildTool === 'gradle') {
                    executable = 'gradlew';
                }
                let logMsgComment = '';
                if (os.platform() === 'win32') {
                    logMsgComment = ` (${chalk.yellow.bold(executable)} if using Windows Command Prompt)`;
                }
                this.log(chalk.green(`Run your Spring Boot application:\n${chalk.yellow.bold(`./${executable}`)}${logMsgComment}`));
            },
        };
    }


};
