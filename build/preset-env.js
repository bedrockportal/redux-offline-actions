const esOptions = process.env.BABEL_ENV === 'es' ? { modules: false } : {};

module.exports = {
  presets: [
    ['env', esOptions]
  ]
};
