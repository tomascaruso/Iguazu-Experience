import {defineConfig,devices} from '@playwright/test';
export default defineConfig({
 testDir:'./qa',timeout:45000,fullyParallel:false,workers:1,
 reporter:[['list'],['html',{outputFolder:'evidence/playwright-report',open:'never'}]],
 outputDir:'evidence/browser-tests',
 use:{baseURL:process.env.H2_TEST_URL??'http://localhost:3000',screenshot:'only-on-failure',video:'retain-on-failure',trace:'retain-on-failure'},
 projects:[{name:'desktop-chromium',use:{...devices['Desktop Chrome'],viewport:{width:1440,height:900}}},{name:'mobile-chromium',use:{...devices['Pixel 7']}}],
});
