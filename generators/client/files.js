
const { OAUTH2, SESSION } = require('generator-jhipster/jdl/jhipster/authentication-types');
const { SPRING_WEBSOCKET } = require('generator-jhipster/jdl/jhipster/websocket-types');
const { GATEWAY } = require('generator-jhipster/jdl/jhipster/application-types');
const { REACT_DIR, CLIENT_TEST_SRC_DIR, CLIENT_MAIN_SRC_DIR } = require('generator-jhipster/generators/generator-constants');

module.exports = {
    writeFiles
};

const files = {
    common: [
        {
            templates: [
                '.npmrc',
                'package.json',
                '.eslintrc.json',
                'tsconfig.json',
                'tsconfig.test.json',
                'jest.conf.js',
                'webpack/webpack.common.js',
                'webpack/webpack.dev.js',
                'webpack/webpack.prod.js',
                'webpack/utils.js',
                { file: 'webpack/logo-jhipster.png', method: 'copy' },
            ],
        },
        {
            condition: generator => generator.protractorTests,
            templates: ['tsconfig.e2e.json'],
        },
    ],
    sass: [
        {
            templates: ['postcss.config.js'],
        },
    ],
    reactApp: [
        {
            path: REACT_DIR,
            templates: [
                { file: 'app.tsx', method: 'processJsx' },
                { file: 'index.tsx', method: 'processJsx' },
                { file: 'routes.tsx', method: 'processJsx' },
                'setup-tests.ts',
                'typings.d.ts',
                'config/constants.ts',
                'config/dayjs.ts',
                'config/axios-interceptor.ts',
                { file: 'config/devtools.tsx', method: 'processJsx' },
                'config/error-middleware.ts',
                'config/logger-middleware.ts',
                'config/notification-middleware.ts',
                'config/store.ts',
                'config/icon-loader.ts',
            ],
        },
        {
            condition: generator => generator.enableTranslation,
            path: REACT_DIR,
            templates: ['config/translation.ts'],
        },
        {
            condition: generator => generator.websocket === SPRING_WEBSOCKET,
            path: REACT_DIR,
            templates: ['config/websocket-middleware.ts'],
        },
        {
            path: REACT_DIR,
            templates: ['app.scss', '_bootstrap-variables.scss'],
        },
    ],
    reactEntities: [
        {
            path: REACT_DIR,
            templates: [{ file: 'entities/index.tsx', method: 'processJsx' }],
        },
    ],
    reactMain: [
        {
            path: REACT_DIR,
            templates: [
                { file: 'modules/home/home.tsx', method: 'processJsx' },
                { file: 'modules/login/logout.tsx', method: 'processJsx' },
            ],
        },
        {
            condition: generator => generator.authenticationType !== OAUTH2,
            path: REACT_DIR,
            templates: [
                { file: 'modules/login/login.tsx', method: 'processJsx' },
                { file: 'modules/login/login-modal.tsx', method: 'processJsx' },
            ],
        },
        {
            condition: generator => generator.authenticationType === OAUTH2,
            path: REACT_DIR,
            templates: [{ file: 'modules/login/login-redirect.tsx', method: 'processJsx' }],
        },
        {
            path: REACT_DIR,
            templates: ['modules/home/home.scss'],
        },
    ],
    reducers: [
        {
            path: REACT_DIR,
            templates: [
                'shared/reducers/index.ts',
                'shared/reducers/action-type.util.ts',
                'shared/reducers/authentication.ts',
                'shared/reducers/application-profile.ts',
            ],
        },
        {
            condition: generator => generator.enableTranslation,
            path: REACT_DIR,
            templates: ['shared/reducers/locale.ts'],
        },
        {
            condition: generator => generator.authenticationType === OAUTH2,
            path: REACT_DIR,
            templates: ['shared/reducers/user-management.ts'],
        },
    ],
    accountModule: [
        {
            condition: generator => !generator.skipUserManagement,
            path: REACT_DIR,
            templates: [
                { file: 'modules/account/index.tsx', method: 'processJsx' },
                { file: 'modules/account/activate/activate.tsx', method: 'processJsx' },
                { file: 'modules/account/password/password.tsx', method: 'processJsx' },
                { file: 'modules/account/register/register.tsx', method: 'processJsx' },
                { file: 'modules/account/password-reset/init/password-reset-init.tsx', method: 'processJsx' },
                { file: 'modules/account/password-reset/finish/password-reset-finish.tsx', method: 'processJsx' },
                { file: 'modules/account/settings/settings.tsx', method: 'processJsx' },
                { file: 'modules/account/register/register.reducer.ts', method: 'processJsx' },
                { file: 'modules/account/activate/activate.reducer.ts', method: 'processJsx' },
                { file: 'modules/account/password-reset/password-reset.reducer.ts', method: 'processJsx' },
                { file: 'modules/account/password/password.reducer.ts', method: 'processJsx' },
                { file: 'modules/account/settings/settings.reducer.ts', method: 'processJsx' },
            ],
        },
        {
            condition: generator => generator.authenticationType === SESSION && !generator.skipUserManagement,
            path: REACT_DIR,
            templates: [{ file: 'modules/account/sessions/sessions.tsx', method: 'processJsx' }, 'modules/account/sessions/sessions.reducer.ts'],
        },
    ],
    adminModule: [
        {
            path: REACT_DIR,
            templates: [
                { file: 'modules/administration/index.tsx', method: 'processJsx' },
                'modules/administration/administration.reducer.ts',
                { file: 'modules/administration/docs/docs.tsx', method: 'processJsx' },
                'modules/administration/docs/docs.scss',
            ],
        },
        {
            condition: generator => generator.withAdminUi,
            path: REACT_DIR,
            templates: [
                { file: 'modules/administration/configuration/configuration.tsx', method: 'processJsx' },
                { file: 'modules/administration/health/health.tsx', method: 'processJsx' },
                { file: 'modules/administration/health/health-modal.tsx', method: 'processJsx' },
                { file: 'modules/administration/logs/logs.tsx', method: 'processJsx' },
                { file: 'modules/administration/metrics/metrics.tsx', method: 'processJsx' },
            ],
        },
        {
            condition: generator => generator.websocket === SPRING_WEBSOCKET,
            path: REACT_DIR,
            templates: [{ file: 'modules/administration/tracker/tracker.tsx', method: 'processJsx' }],
        },
        {
            condition: generator => !generator.skipUserManagement,
            path: REACT_DIR,
            templates: [
                { file: 'modules/administration/user-management/index.tsx', method: 'processJsx' },
                { file: 'modules/administration/user-management/user-management.tsx', method: 'processJsx' },
                { file: 'modules/administration/user-management/user-management-update.tsx', method: 'processJsx' },
                { file: 'modules/administration/user-management/user-management-detail.tsx', method: 'processJsx' },
                { file: 'modules/administration/user-management/user-management-delete-dialog.tsx', method: 'processJsx' },
                'modules/administration/user-management/user-management.reducer.ts',
            ],
        },
        {
            condition: generator => generator.applicationType === GATEWAY && generator.serviceDiscoveryType,
            path: REACT_DIR,
            templates: [{ file: 'modules/administration/gateway/gateway.tsx', method: 'processJsx' }],
        },
    ],
    reactShared: [
        {
            path: REACT_DIR,
            templates: [
                // layouts
                { file: 'shared/layout/footer/footer.tsx', method: 'processJsx' },
                { file: 'shared/layout/header/header.tsx', method: 'processJsx' },
                { file: 'shared/layout/header/header-components.tsx', method: 'processJsx' },
                'shared/layout/menus/index.ts',
                { file: 'shared/layout/menus/admin.tsx', method: 'processJsx' },
                { file: 'shared/layout/menus/account.tsx', method: 'processJsx' },
                { file: 'shared/layout/menus/entities.tsx', method: 'processJsx' },
                { file: 'shared/layout/menus/menu-components.tsx', method: 'processJsx' },
                { file: 'shared/layout/menus/menu-item.tsx', method: 'processJsx' },
                { file: 'shared/layout/password/password-strength-bar.tsx', method: 'processJsx' },
                // util
                'shared/util/date-utils.ts',
                'shared/util/pagination.constants.ts',
                'shared/util/entity-utils.ts',
                // components
                { file: 'shared/auth/private-route.tsx', method: 'processJsx' },
                { file: 'shared/error/error-boundary.tsx', method: 'processJsx' },
                { file: 'shared/error/error-boundary-route.tsx', method: 'processJsx' },
                { file: 'shared/error/page-not-found.tsx', method: 'processJsx' },
                { file: 'shared/DurationFormat.tsx', method: 'processJsx' },
                // model
                'shared/model/user.model.ts',
            ],
        },
        {
            condition: generator => generator.enableTranslation,
            path: REACT_DIR,
            templates: [{ file: 'shared/layout/menus/locale.tsx', method: 'processJsx' }],
        },
        {
            condition: generator => generator.authenticationType === OAUTH2,
            path: REACT_DIR,
            templates: ['shared/util/url-utils.ts'],
        },
        {
            condition: generator => generator.authenticationType === SESSION && generator.websocket === SPRING_WEBSOCKET,
            path: REACT_DIR,
            templates: ['shared/util/cookie-utils.ts'],
        },
        {
            path: REACT_DIR,
            templates: [
                'shared/layout/header/header.scss',
                'shared/layout/footer/footer.scss',
                'shared/layout/password/password-strength-bar.scss',
            ],
        },
    ],
    clientTestFw: [
        {
            path: REACT_DIR,
            templates: [
                'config/axios-interceptor.spec.ts',
                'config/notification-middleware.spec.ts',
                'shared/reducers/application-profile.spec.ts',
                'shared/reducers/authentication.spec.ts',
                'shared/util/entity-utils.spec.ts',
                'shared/auth/private-route.spec.tsx',
                'shared/error/error-boundary.spec.tsx',
                'shared/error/error-boundary-route.spec.tsx',
                'shared/layout/header/header.spec.tsx',
                'shared/layout/menus/account.spec.tsx',
                'modules/administration/administration.reducer.spec.ts',
            ],
        },
        {
            condition: generator => !generator.skipUserManagement,
            path: REACT_DIR,
            templates: [
                // 'spec/app/modules/account/register/register.spec.tsx',
                'modules/account/register/register.reducer.spec.ts',
                'modules/account/activate/activate.reducer.spec.ts',
                'modules/account/password/password.reducer.spec.ts',
                'modules/account/settings/settings.reducer.spec.ts',
            ],
        },
        {
            condition: generator => !generator.skipUserManagement,
            path: REACT_DIR,
            templates: ['modules/administration/user-management/user-management.reducer.spec.ts'],
        },
        {
            condition: generator => generator.enableTranslation,
            path: REACT_DIR,
            templates: ['shared/reducers/locale.spec.ts'],
        },
        {
            condition: generator => generator.skipUserManagement && generator.authenticationType === OAUTH2,
            path: REACT_DIR,
            templates: ['shared/reducers/user-management.spec.ts'],
        },
        // {
        //     condition: generator => generator.authenticationType === 'session',
        //     path: REACT_DIR,
        //     templates: [
        //         'modules/account/sessions/sessions.reducer.spec.ts',
        //     ]
        // },
        {
            condition: generator => generator.protractorTests,
            path: CLIENT_TEST_SRC_DIR,
            templates: [
                'e2e/modules/account/account.spec.ts',
                'e2e/modules/administration/administration.spec.ts',
                'e2e/util/utils.ts',
                'e2e/page-objects/base-component.ts',
                'e2e/page-objects/navbar-page.ts',
                'e2e/page-objects/signin-page.ts',
                'protractor.conf.js',
            ],
        },
        {
            condition: generator => generator.protractorTests && !generator.skipUserManagement,
            path: CLIENT_TEST_SRC_DIR,
            templates: ['e2e/page-objects/password-page.ts', 'e2e/page-objects/settings-page.ts', 'e2e/page-objects/register-page.ts'],
        },
    ],
};

const commonFiles = {
    common: [
      {
        templates: ['.eslintignore', `${CLIENT_MAIN_SRC_DIR}manifest.webapp`],
      },
      {
        path: CLIENT_MAIN_SRC_DIR,
        templates: [
          { file: 'content/images/jhipster_family_member_0.svg', method: 'copy' },
          { file: 'content/images/jhipster_family_member_0_head-192.png', method: 'copy' },
          { file: 'content/images/jhipster_family_member_0_head-256.png', method: 'copy' },
          { file: 'content/images/jhipster_family_member_0_head-384.png', method: 'copy' },
          { file: 'content/images/jhipster_family_member_0_head-512.png', method: 'copy' },
          { file: 'content/images/jhipster_family_member_1.svg', method: 'copy' },
          { file: 'content/images/jhipster_family_member_1_head-192.png', method: 'copy' },
          { file: 'content/images/jhipster_family_member_1_head-256.png', method: 'copy' },
          { file: 'content/images/jhipster_family_member_1_head-384.png', method: 'copy' },
          { file: 'content/images/jhipster_family_member_1_head-512.png', method: 'copy' },
          { file: 'content/images/jhipster_family_member_2.svg', method: 'copy' },
          { file: 'content/images/jhipster_family_member_2_head-192.png', method: 'copy' },
          { file: 'content/images/jhipster_family_member_2_head-256.png', method: 'copy' },
          { file: 'content/images/jhipster_family_member_2_head-384.png', method: 'copy' },
          { file: 'content/images/jhipster_family_member_2_head-512.png', method: 'copy' },
          { file: 'content/images/jhipster_family_member_3.svg', method: 'copy' },
          { file: 'content/images/jhipster_family_member_3_head-192.png', method: 'copy' },
          { file: 'content/images/jhipster_family_member_3_head-256.png', method: 'copy' },
          { file: 'content/images/jhipster_family_member_3_head-384.png', method: 'copy' },
          { file: 'content/images/jhipster_family_member_3_head-512.png', method: 'copy' },
          { file: 'content/images/logo-jhipster.png', method: 'copy' },
          { file: 'favicon.ico', method: 'copy' },
          'content/css/loading.css',
          'WEB-INF/web.xml',
          'robots.txt',
          '404.html',
          'index.html',
        ],
      },
      {
        condition: generator => generator.enableI18nRTL,
        path: CLIENT_MAIN_SRC_DIR,
        templates: ['content/scss/rtl.scss'],
      },
    ],
    swagger: [
      {
        path: CLIENT_MAIN_SRC_DIR,
        templates: ['swagger-ui/index.html', { file: 'swagger-ui/dist/images/throbber.gif', method: 'copy' }],
      },
    ],
  };



function writeFiles() {
    console.log('writing files ....')
    // console.log(MAIN_SRC_DIR)
    //  mkdirp(MAIN_SRC_DIR).then(data =>console.log('okkkkkkkk'+data));
    // write Vue.js files
    this.writeFilesToDisk(files, 'react');
    return this.writeFilesToDisk(commonFiles, 'common');

}
