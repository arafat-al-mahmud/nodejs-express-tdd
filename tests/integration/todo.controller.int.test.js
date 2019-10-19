const request = require('supertest')
const controller = require('../../controllers/todo.controller')
const app = require('../../app')
const newTodoData = require('../mock-data/new-todo.json')
const endPoint = '/todos/'

let firstTodo;

describe(endPoint, () => {
    it (`POST ${endPoint}`, async () => {
        const response = await request(app).post(endPoint).send(newTodoData)
        expect(response.statusCode).toBe(201)
        expect(response.body.title).toBe(newTodoData.title)
        expect(response.body.done).toBe(newTodoData.done)
    })
    it(`should return error malformed 500 on malformed post data to ${endPoint}`, async () => {
        const response = await request(app).post(endPoint).send({"title": "A bogus task"})
        expect(response.statusCode).toBe(500)
        expect(response.body).toStrictEqual({
            "message" : "Todo validation failed: done: Path `done` is required."
        })
    })
    it ( `GET ${endPoint}`, async () => {
        const response = await request(app).get(endPoint);

        expect(response.statusCode).toBe(200)
        expect(Array.isArray(response.body)).toBeTruthy()
        expect(response.body[0].title).toBeDefined()
        expect(response.body[0].done).toBeDefined()

        firstTodo = response.body[0]
    })
    it ( `GET ${endPoint}:todoId`, async () => {
        const response = await request(app).get(endPoint + firstTodo._id);

        expect(response.statusCode).toBe(200)
        expect(response.body.title).toBe(firstTodo.title)
        expect(response.body.done).toBe(firstTodo.done)
    })

    it(`should return error when todo not found on GET ${endPoint}:todoId`, async () => {
        const response = await request(app).get(endPoint + '5d88c7f58bfc912353090252'); //make sure the id doesn't exist

        expect(response.statusCode).toBe(404)
    })
    it(`PUT ${endPoint}:todoId`, async () => {
        firstTodo.title = "updated title"
        firstTodo.done = true
        const response = await request(app).put(endPoint + firstTodo._id).send(firstTodo)

        expect(response.statusCode).toBe(200)
        expect(response.body.title).toBe(firstTodo.title)
        expect(response.body.done).toBe(firstTodo.done)
    })
    it(`should return 404 when todo not found on PUT ${endPoint}:todoId`, async () => {
        const response = await request(app).put(endPoint + '5d88c7f58bfc912353090252').send(firstTodo); //make sure the id doesn't exist

        expect(response.statusCode).toBe(404)
    })
    it(`DELETE ${endPoint}:todoId`, async () => {
        const response = await request(app).delete(endPoint + firstTodo._id)
        expect(response.statusCode).toBe(200)
        expect(response.body.title).toBe(firstTodo.title)
        expect(response.body.done).toBe(firstTodo.done)       
    })
    it(`should return 404 when todo not found on DELETE ${endPoint}:todoId`, async () => {
        const response = await request(app).put(endPoint + '5d88c7f58bfc912353090252').send(firstTodo); //make sure the id doesn't exist

        expect(response.statusCode).toBe(404)
    })

})