const express = require('express');
const router = express.Router();
const Joi = require('joi');
const validateRequest = require('_middleware/validate-request');
const authorize = require('_middleware/authorizeParent');
const parentService = require('./parent.service');

//routes
router.post('/register', registerSchema, register);
router.post('/authenticate', authenticateSchema, authenticate);
router.get('/', authorize(), getAll);
router.get('/current', authorize(), getCurrent);
router.get('/:id', authorize(), getById);
router.put('/:id', authorize(), updateSchema, update);
router.delete('/:id', authorize(), _delete); 

module.exports = router; 

function authenticateSchema(req, res, next) {
    const schema = Joi.object({
        username: Joi.string().required(),
        password: Joi.string().required()
    });
    validateRequest(req, next, schema);
}

function authenticate(req, res, next) {
    parentService.authenticate(req.body)
        .then(user => res.json(user))
        .catch(next);
}

function registerSchema(req, res, next) {
    const schema = Joi.object({
        P_ID: Joi.string().required(),
        firstName: Joi.string().required(),
        lastName: Joi.string().required(),
        email: Joi.string().optional(),
        phone_No:Joi.number().required(),
        username: Joi.string().required(),
        password: Joi.string().min(6).required()

    });
    validateRequest(req, next, schema);
}
function register(req, res, next) {
    parentService.create(req.body)
        .then(() => res.json({ message: 'Registration successful' }))
        .catch(next);
}
function getAll(req, res, next) {
    parentService.getAll()
        .then(users => res.json(users))
        .catch(next);
}

function getCurrent(req, res, next) {
    res.json(req.user);
}

function getById(req, res, next) {
    parentService.getById(req.params.id)
        .then(user => res.json(user))
        .catch(next);
}

function updateSchema(req, res, next) {
    const schema = Joi.object({
        firstName: Joi.string().empty(''),
        lastName: Joi.string().empty(''),
        username: Joi.string().empty(''),
        password: Joi.string().min(6).empty('')
    });
    validateRequest(req, next, schema);
}
function update(req, res, next) {
    parentService.update(req.params.id, req.body)
        .then(user => res.json(user))
        .catch(next);
}    

function _delete(req, res, next) {
    parentService.delete(req.params.id)
        .then(() => res.json({ message: 'Parent deleted successfully' }))
        .catch(next);
}
