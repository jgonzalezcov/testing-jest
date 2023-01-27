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
describe('Operaciones CRUD de cafes', () => {})
