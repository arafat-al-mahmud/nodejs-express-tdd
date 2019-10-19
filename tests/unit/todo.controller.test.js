const todoController = require('../../controllers/todo.controller')
const TodoModel = require('../../model/todo.model');
const httpMocks = require('node-mocks-http')
const newTodoData = require('../mock-data/new-todo.json')
const todos = require('../mock-data/all-todos.json')

//mocking function calls one by one
/*TodoModel.create = jest.fn(); 
TodoModel.find = jest.fn();
TodoModel.findById = jest.fn();
TodoModel.findByIdAndUpdate = jest.fn();*/

//mocking the entire module at once
jest.mock('../../model/todo.model')

let req, res, next;

beforeEach(() => {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
    next = jest.fn();    
})

describe('TodoController.deleteTodo', () => {
    it('should have method deleteTodo', () => {
        expect(typeof todoController.deleteTodo).toBe('function')
    })
    it('should call TodoModel.findByIdAndRemove', async () => {
        const todoId = "5d88b3ed06f4c41297059d50"
        req.params.todoId = todoId //any arbitrary id will do
        await todoController.deleteTodo(req, res, next)
        expect(TodoModel.findByIdAndRemove).toBeCalledWith(todoId)
    })
    it('should return removed todo and status 200', async () => {
        TodoModel.findByIdAndRemove.mockReturnValue(newTodoData)
        await todoController.deleteTodo(req, res, next)
        expect(res.statusCode).toBe(200)
        expect(res._isEndCalled()).toBeTruthy()
        expect(res._getJSONData()).toStrictEqual(newTodoData)
    })
    it('should handle error', async () => {
        const errorMessage = {message : 'error deleting todo'}
        const rejectedPromise = Promise.reject(errorMessage);
        TodoModel.findByIdAndRemove.mockReturnValue(rejectedPromise)
        await todoController.deleteTodo(req, res, next)
        expect(next).toBeCalledWith(errorMessage)
    })
    it('should return 404 if the todo to delete was not found', async () => {
        TodoModel.findByIdAndRemove.mockReturnValue(null)
        await todoController.deleteTodo(req, res, next)
        expect(res.statusCode).toBe(404)
        expect(res._isEndCalled()).toBeTruthy()
    })
})

describe('TodoController.updateTodo', () => {
    it('should have method updateTodo', () => {
        expect(typeof todoController.updateTodo).toBe('function')
    })
    it('should call TodoModel.findByIdAndUpdate', async () => {
        req.params.todoId = "5d88b3ed06f4c41297059d50" //any arbitrary id will do
        req.body = newTodoData
        await todoController.updateTodo(req, res, next)
        expect(TodoModel.findByIdAndUpdate).toBeCalledWith(req.params.todoId, newTodoData, {new: true, useFindAndModify: false})
    })
    it('should return the updated model and status code 200', async () => {
        TodoModel.findByIdAndUpdate.mockReturnValue(newTodoData)
        req.params.todoId = "5d88b3ed06f4c41297059d50" //any arbitrary id will do
        req.body = newTodoData
        await todoController.updateTodo(req, res, next)
        expect(res.statusCode).toBe(200)
        expect(res._isEndCalled()).toBeTruthy()
        expect(res._getJSONData()).toStrictEqual(newTodoData)
    })
    it('should handle errors', async() => {
        const errorMessage = {message: 'error updating todo'}
        const rejectedPromise = Promise.reject(errorMessage)
        TodoModel.findByIdAndUpdate.mockReturnValue(rejectedPromise)
        await todoController.updateTodo(req, res, next)
        expect(next).toBeCalledWith(errorMessage)
    })
    it('should return 404 if todo not found', async () => {
        TodoModel.findByIdAndUpdate.mockReturnValue(null)
        await todoController.updateTodo(req, res, next)
        expect(res.statusCode).toBe(404)
        expect(res._isEndCalled()).toBeTruthy()
    })
})

describe('TodoController.getTodoById', () => {

    it('should have a getTodoById function', () => {
        expect(typeof todoController.getTodoById).toBe('function')
    })
    it('should call TodoModel.findById', async () => {
        req.params.todoId = "5d88b3ed06f4c41297059d50" //any arbitrary id will do
        await todoController.getTodoById(req, res, next)
        expect(TodoModel.findById).toBeCalledWith(req.params.todoId) 
    })
    it('should return 200 status code and json response', async () => {
        TodoModel.findById.mockReturnValue(newTodoData)
        await todoController.getTodoById(req, res, next)
        expect(res.statusCode).toBe(200)
        expect(res._isEndCalled()).toBeTruthy()
        expect(res._getJSONData()).toStrictEqual(newTodoData)
    })
    it('should handle errors', async () => {
        const errorMessage = {message: "error finding the todo"}
        const rejectedPromise = Promise.reject(errorMessage)
        TodoModel.findById.mockReturnValue(rejectedPromise)
        await todoController.getTodoById(req, res, next)
        expect(next).toBeCalledWith(errorMessage)
    })
    it('should return 404 if todo not found', async () => {
        TodoModel.findById.mockReturnValue(null)
        await todoController.getTodoById(req, res, next)
        expect(res.statusCode).toBe(404)
        expect(res._isEndCalled()).toBeTruthy()
    })
})

describe('TodoController.getTodos', () => {
    it('should have a getTodos function', () => {
        expect(typeof todoController.getTodos).toBe('function')
    })
    it('should call TodoModel.find function', async () => {
        await todoController.getTodos(req, res, next)
        expect(TodoModel.find).toHaveBeenCalledWith({})
    })
    it('should return 200 status code & json response', async () => {
        TodoModel.find.mockReturnValue(todos)
        await todoController.getTodos(req, res, next)
        expect(res.statusCode).toBe(200)
        expect(res._isEndCalled()).toBeTruthy()
        expect(res._getJSONData()).toStrictEqual(todos)
    })
    it('should handle errors in get todos', async () => {
        const errorMessage = {message: "couldn't retrieve todos"}
        const rejectedPromise = Promise.reject(errorMessage);
        TodoModel.find.mockReturnValue(rejectedPromise)
        await todoController.getTodos(req, res, next)
        expect(next).toBeCalledWith(errorMessage)
    })
})

describe('TodoController.createTodo', () => {

    beforeEach(() => {
        req.body = newTodoData;
    })

    it('should have a create todo function', () => {
        expect(typeof todoController.createTodo).toBe('function')
    })
    it('should call TodoModel.create function', () => {
        todoController.createTodo(req, res, next);
        expect(TodoModel.create).toBeCalledWith(newTodoData);
    })
    it('should return 201 status code', async () => {
        await todoController.createTodo(req, res, next);
        expect(res.statusCode).toBe(201)
        expect(res._isEndCalled()).toBeTruthy()
    })
    it('should return same json as the newTodo data', async () => {
        TodoModel.create.mockReturnValue(newTodoData)
        await todoController.createTodo(req, res, next)
        expect(res._getJSONData()).toStrictEqual(newTodoData)
    })
    it('should handle errors', async () => {
        const errorMessage = {message: "Done property missing"}
        const rejectedPromise = Promise.reject(errorMessage)
        TodoModel.create.mockReturnValue(rejectedPromise)
        await todoController.createTodo(req, res, next)
        expect(next).toBeCalledWith(errorMessage)
    })
})

