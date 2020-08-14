/* Api methods to call /functions */

const create = data => {
  return fetch('/.netlify/functions/todos-create', {
    body: JSON.stringify(data),
    method: 'POST'
  }).then(response => {
    return response.json()
  })
}

const createUseCase = data => {
  return fetch('/.netlify/functions/useCase-create', {
    body: JSON.stringify(data),
    method: 'POST'
  }).then(response => {
    return response.json()
  })
}
const createVehicle = data => {
  return fetch('/.netlify/functions/vehicle-create', {
    body: JSON.stringify(data),
    method: 'POST'
  }).then(response => {
    return response.json()
  })
}
const createImage = data => {
  return fetch('/.netlify/functions/image-create', {
    body: JSON.stringify(data),
    method: 'POST'
  }).then(response => {
    return response.json()
  })
}
const readAll = () => {
  return fetch('/.netlify/functions/todos-read-all').then(response => {
    return response.json()
  })
}

const readAllVehicles = () => {
  return fetch('/.netlify/functions/vehicle-read-all').then(response => {
    return response.json()
  })
}
const readAllCases = () => {
  return fetch('/.netlify/functions/cases-read-all').then(response => {
    return response.json()
  })
}

const update = (todoId, data) => {
  return fetch(`/.netlify/functions/todos-update/${todoId}`, {
    body: JSON.stringify(data),
    method: 'POST'
  }).then(response => {
    return response.json()
  })
}

const updateVehicle = (todoId, data) => {
  return fetch(`/.netlify/functions/vehicle-update/${todoId}`, {
    body: JSON.stringify(data),
    method: 'POST'
  }).then(response => {
    return response.json()
  })
}

const updateUseCase = (todoId, data) => {
  return fetch(`/.netlify/functions/useCase-update/${todoId}`, {
    body: JSON.stringify(data),
    method: 'POST'
  }).then(response => {
    return response.json()
  })
}

const deleteTodo = todoId => {
  return fetch(`/.netlify/functions/todos-delete/${todoId}`, {
    method: 'POST'
  }).then(response => {
    return response.json()
  })
}

const batchDeleteTodo = todoIds => {
  return fetch('/.netlify/functions/todos-delete-batch', {
    body: JSON.stringify({
      ids: todoIds
    }),
    method: 'POST'
  }).then(response => {
    return response.json()
  })
}

export default {
  createUseCase: createUseCase,
  createImage: createImage,
  createVehicle: createVehicle,
  create: create,
  readAll: readAll,
  readAllVehicles: readAllVehicles,
  readAllCases: readAllCases,
  update: update,
  updateVehicle: updateVehicle,
  updateUseCase: updateUseCase,
  delete: deleteTodo,
  batchDelete: batchDeleteTodo
}
