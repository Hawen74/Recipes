import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:3000'
})

// GET /recipes
export async function getAllRecipes() {
    const res = await api.get('/recipes')
    return res.data
}

// GET /recipes/:name
export async function getRecipeById(name) {
    const res = await api.get(`/recipes/${name}`)
    return res.data
}

// POST /recipes
export async function createRecipe(recipe) {
    const res = await api.post(`/recipes`, recipe)
    return res.data
}

export async function generateRecipe(prompt) {
  const res = await api.post('/recipes/generate', { prompt })
  return res.data
}

// PUT /recipes/:name
export async function updateRecipe(name, recipe) {
    const res = await api.put(`/recipes/${name}`, recipe)
    return res.data
}

// DELETE /recipes/:name
export async function deleteRecipe(name) {
    const res = await api.delete(`/recipes/${name}`)
    return res.data
}