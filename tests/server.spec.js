const request = require('supertest')
const server = require('../index')
const cafes = require('../cafes.json')
const fs = require('fs')
const kill = require('kill-port')

/*******************Funcion para asignar un id inexiste en dos test de mas (Se busca el mayor y se suma 1)**********************/
const maxId = () => {
  //Obtengo el obejto con el id mayor del archivo cafes.json
  const readInfo = JSON.parse(fs.readFileSync('cafes.json', 'utf8'))
  const resultadosOrdenados = readInfo.sort((a, b) => {
    return Number.parseInt(b.id) - Number.parseInt(a.id)
  })[0]
  //saco el id del objeto con el mayor id y le sumo 1 (Con esto nos aseguramos que el valor id no existe)
  const id = resultadosOrdenados.id + 1
  return id
}
describe('Operaciones CRUD de cafes', () => {
  describe('GET/cafes', () => {
    it('Obteniendo un 200 al ir a buscar los cafes', async () => {
      const resp = await request(server).get('/cafes').send()
      const status = resp.statusCode
      expect(status).toBe(200)
    })
    it('Verificacion tipo de dato arreglo', async () => {
      const resp = await request(server).get('/cafes').send()
      const product = resp.body
      expect(product).toBeInstanceOf(Array)
    })
    it('Verificacion que el arreglo tenga al menos un objeto', async () => {
      const resp = await request(server).get('/cafes').send()
      const products = resp.body
      const findObject = cafes.some((c) => typeof c == 'object')
      expect(findObject).toBe(true)
    })
  })
  describe('DELETE/cafes/id', () => {
    it('Obteniendo un 404 al querer eliminar un cafe con id inexistente', async () => {
      const jwt = 'token'
      const id = await maxId()
      const resp = await request(server)
        .delete(`/cafes/${id}`)
        .set('Authorization', jwt)
        .send()
      const status = resp.statusCode
      expect(status).toBe(404)
    })
  })
  describe('POST/cafes', () => {
    it('Obteniendo un 201 Agregando un cafe', async () => {
      const id = await maxId()
      const producto = { id, nombre: 'Nuevo cafe de prueba' }
      const response = await request(server).post('/cafes/').send(producto)
      const status = response.statusCode
      expect(status).toBe(201)
    })
  })
  describe('PUT/cafes/id', () => {
    it('Obteniendo un 400 al querer actulizar un cafe donde el id de parametros sea distinto al del payload', async () => {
      const id = 1
      const producto = { id: 2, nombre: 'Cafe actualizado de prueba' }
      const resp = await request(server).put(`/cafes/${id}`).send(producto)
      const status = resp.statusCode
      expect(status).toBe(400)
    })
  })
})

kill(3000, 'tcp')
