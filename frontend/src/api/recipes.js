import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:3000'
})

// GET /recipes
export async function getAllRecipes() {
    const res = await api.get('/recipes')
    return res.data
}

// GET /recipes/:id
export async function getRecipeById(id) {
    const res = await api.get(`/recipes/${id}`)
    return res.data
}

// POST /recipes
export async function createRecipe(recipe) {
    const res = await api.post(`/recipes`, recipe)
    return res.data
}

// PUT /recipes/:id
export async function updateRecipe(id, recipe) {
    const res = await api.put(`/recipes/${id}`, recipe)
    return res.data
}

// DELETE /recipes/:id
export async function deleteRecipe(id) {
    const res = await api.delete(`/recipes/${id}`)
    return res.data
}