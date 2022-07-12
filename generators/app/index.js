/* eslint-disable consistent-return */
const chalk = require('chalk');
const AppGenerator = require('generator-jhipster/generators/app');
const nodePackagejs = require('../../package.json');
const prompts = require('./prompts')

module.exports = class extends AppGenerator {
    constructor(args, opts) {
        super(args, { fromBlueprint: true, ...opts }); // fromBlueprint variable is important
        const jhContext = (this.jhipsterContext = this.options.jhipsterContext);

        if (!jhContext) {
            this.error(`This is a JHipster blueprint and should be used only like ${chalk.yellow('jhipster --blueprints nodejs')}`);
        }

        this.configOptions = jhContext.configOptions || {};

        // This adds support for a `--skip-i18n` flag for unit test
        this.option('skip-i18n', {
            desc: 'skip internationalization',
            type: Boolean,
            defaults: false
        });
    }

    get initializing() {
        const initPhaseFromJHipster = super._initializing();

        const kitokoInitAppPhaseSteps = {
            /* eslint-disable */
            displayLogo() {
                this.log('\n');
                this.log(`${chalk.green('               ██╗░░██╗██╗████████╗░█████╗░██╗░░██╗░█████╗░')}`);
                this.log(`${chalk.green('               ██║░██╔╝██║╚══██╔══╝██╔══██╗██║░██╔╝██╔══██╗')}`);
                this.log(`${chalk.green('               █████═╝░██║░░░██║░░░██║░░██║█████═╝░██║░░██║')}`);
                this.log(`${chalk.green('               ██╔═██╗░██║░░░██║░░░██║░░██║██╔═██╗░██║░░██║')}`);
                this.log(`${chalk.green('               ██║░╚██╗██║░░░██║░░░╚█████╔╝██║░╚██╗╚█████╔╝')}`);
                this.log(`${chalk.green('               ╚═╝░░╚═╝╚═╝░░░╚═╝░░░░╚════╝░╚═╝░░╚═╝░╚════╝░')}`);
                // this.log('\n');
                this.log(chalk.white.bold('                          https://www.webkitoko.org\n'));
                this.log(
                    chalk.white('Welcome to WebKitoko (A Web based API builder engine) ') + chalk.yellow(`v${nodePackagejs.version}`)
                );

                this.log(
                    chalk.white(
                        ` If you find Webkitoko useful, support and star the project at ${chalk.yellow(
                            'https://github.com/DanielRub/generator-jhipster-webkitoko'
                        )}`
                    )
                );
                this.log(
                    chalk.green(
                        ' _______________________________________________________________________________________________________________\n'
                    )
                );
            },
           // validateFromCli(){},
           // validateBlueprint(){},
           // validateJava(){},
           // validateNode(){},
           // validateGit(){},
            checkForNewJHVersion() { },
           // validate(){}
        };

        return {...initPhaseFromJHipster, ...kitokoInitAppPhaseSteps };
    }

    get prompting() {
        const promptPhaseFromJHipster = super._prompting();
        const kitokoPromptPhaseSteps = {
            askForInsightOptIn: prompts.askForInsightOptIn,
            askForApplicationType: prompts.askForApplicationType,
            askForModuleName: prompts.askForModuleName,
        };
        return { ...promptPhaseFromJHipster, ...kitokoPromptPhaseSteps };
    }



    get configuring() {
        const configuringPhaseFromJHipster = super._configuring();

        const jhipsterConfigureAppPhaseSteps = {
            customI18n() {
                if (this.options['skip-i18n']) {
                    this.configOptions.enableTranslation = false;
                    this.configOptions.skipI18n = true;
                }
            }
        };

        return { ...configuringPhaseFromJHipster, ...jhipsterConfigureAppPhaseSteps };
    }

    get composing() {
        const composingPhaseFromJHipster = super._composing();
        composingPhaseFromJHipster.askForTestOpts = {};
        return composingPhaseFromJHipster;
    }

    get loading() {
        return super._loading();
    }

    get preparing() {
        return this._preparing();
    }

    get default() {
        return super._default();
    }

    get writing() {
        return super._writing();
    }

    get postWriting() {
        return super._postWriting();
    }

    get install() {
        const installPhaseFromJHipster = super._install();

        const nodeServerInstall = {
            /* istanbul ignore next */
            jhipsterNodeServerInstall() {
                if (this.skipServer) return;
                const logMsg = `To install your server dependencies manually, run: cd server && ${chalk.yellow.bold('npm install')}`;

                if (this.options.skipInstall) {
                    this.log(logMsg);
                } else {
                    try {
                        this.log(chalk.bold('\nInstalling server dependencies using npm'));
                        this.spawnCommandSync('npm', ['install'], { cwd: `${process.cwd()}/server` });
                    } catch (e) {
                        this.warning('Install of server dependencies failed!');
                        this.log(logMsg);
                    }
                }
            }
        };
        return { ...installPhaseFromJHipster, ...nodeServerInstall };
    }

    get end() {
        // Here we are not overriding this phase and hence its being handled by JHipster
        return super._end();
    }
};
