module.exports = {
  exit: true,
  retries: 0,
  timeout: 0,
  // parallel: true,
  recursive: true,
  spec: ['test/specs/**/*.spec.ts'],
  reporter: 'mochawesome',
  'reporter-option': [
    'reporterDir=mochawsome_reports',
    'reportFilename=[status]_[datetime]-[name]-report',
    'timestamp=longDate',
    'inline=true',
    'charts=true',
    'showSkipped=true',
    'showHooks=true',
    'showPassed=true',
    'autoOpen=true',
    'overwrite=false',
    'code=false',
    'html=true',
    'json=false',
  ],
};
