/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/members              ->  index
 * POST    /api/members              ->  create
 * GET     /api/members/:id          ->  show
 * PUT     /api/members/:id          ->  update
 * DELETE  /api/members/:id          ->  destroy
 */

'use strict';

var _ = require('lodash');
var Member = require('./member.model');

Member.find({}).remove(function() {
  Member.create({
    name: '田中_2'
  }, {
    name: '鈴木_2'
  }, function(err) {
    console.log('finished populating Members');
  });
});

// Get list of members
exports.index = function(req, res) {
  Member.find(function (err, members) {
    if(err) { return handleError(res, err); }
    return res.json(200, members);
  });
};

function handleError(res, statusCode) {
  statusCode = statusCode || 500;
  return function(err) {
    res.status(statusCode).send(err);
  };
}

function responseWithResult(res, statusCode) {
  statusCode = statusCode || 200;
  return function(entity) {
    if (entity) {
      res.status(statusCode).json(entity);
    }
  };
}

function handleEntityNotFound(res) {
  return function(entity) {
    if (!entity) {
      res.status(404).end();
      return null;
    }
    return entity;
  };
}

function saveUpdates(updates) {
  return function(entity) {
    var updated = _.merge(entity, updates);
    return updated.saveAsync()
      .spread(function(updated) {
        return updated;
      });
  };
}

function removeEntity(res) {
  return function(entity) {
    if (entity) {
      return entity.removeAsync()
        .then(function() {
          res.status(204).end();
        });
    }
  };
}

// Gets a list of Members
exports.index = function(req, res) {
  Member.findAsync()
    .then(responseWithResult(res))
    .catch(handleError(res));
};

// Gets a single Member from the DB
exports.show = function(req, res) {
  Member.findByIdAsync(req.params.id)
    .then(handleEntityNotFound(res))
    .then(responseWithResult(res))
    .catch(handleError(res));
};

// Creates a new Member in the DB
exports.create = function(req, res) {
  Member.createAsync(req.body)
    .then(responseWithResult(res, 201))
    .catch(handleError(res));
};

// Updates an existing Member in the DB
exports.update = function(req, res) {
  if (req.body._id) {
    delete req.body._id;
  }
  Member.findByIdAsync(req.params.id)
    .then(handleEntityNotFound(res))
    .then(saveUpdates(req.body))
    .then(responseWithResult(res))
    .catch(handleError(res));
};

// Deletes a Member from the DB
exports.destroy = function(req, res) {
  Member.findByIdAsync(req.params.id)
    .then(handleEntityNotFound(res))
    .then(removeEntity(res))
    .catch(handleError(res));
};
