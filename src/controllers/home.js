
  exports.get = (req, res) => {
    res.render('./../views/partials/mirror', {
      'bodyClass': 'mirror',
      'helpers': {}
    });
  };
