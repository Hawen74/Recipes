  import React, { useEffect, useMemo, useRef, useState } from 'react'
import '../components/GenerateRecipe.css'
  import { createRecipe, deleteRecipe, getAllRecipes, updateRecipe } from '../api/recipes'

  const DELETE_PASSWORD = 'norecipe'

const GenerateRecipe = () => {
  const successMessageRef = useRef(null)
  const [mode, setMode] = useState('create')
  const [recipes, setRecipes] = useState([])
  const [loadingRecipes, setLoadingRecipes] = useState(false)
  const [recipeError, setRecipeError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  const [deletePassword, setDeletePassword] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedRecipeName, setSelectedRecipeName] = useState('')
  const [formData, setFormData] = useState({
    name: '',
    ingredients: '',
    steps: '',
    prepTime: ''
  })

  const initialFormData = {
    name: '',
    ingredients: '',
    steps: '',
    prepTime: ''
  }

  const showSuccessMessage = (message) => {
    setSuccessMessage(message)
    requestAnimationFrame(() => {
      successMessageRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    })
  }

  const loadRecipes = async () => {
    setLoadingRecipes(true)
    setRecipeError('')
    try {
      const data = await getAllRecipes()
      setRecipes(Array.isArray(data) ? data : [])
    } catch (error) {
      setRecipeError('Could not load recipes from the database.')
    } finally {
      setLoadingRecipes(false)
    }
  }

  // fetch recipes
  useEffect(() => {
    loadRecipes()
  }, [])

  // create recipes
  const handleCreate = async () => {
    try {
      await createRecipe({
        name: formData.name.trim(),
        ingredients: formData.ingredients.split(',').map(s => s.trim()).filter(Boolean),
        steps: formData.steps.split('\n').map(s => s.trim()).filter(Boolean),
        prep_time: formData.prepTime ? Number(formData.prepTime) : null
      })

      await loadRecipes()
      setFormData(initialFormData)
      showSuccessMessage('Recipe created successfully.')
    } catch (err) {
      console.error(err)
      setRecipeError('Could not create the recipe.')
    }
  }

  // update recipes
  const handleUpdate = async () => {
    try {
      await updateRecipe(selectedRecipeName, {
        name: formData.name.trim(),
        ingredients: formData.ingredients.split(',').map(s => s.trim()).filter(Boolean),
        steps: formData.steps.split('\n').map(s => s.trim()).filter(Boolean),
        prep_time: formData.prepTime ? Number(formData.prepTime) : null
      })

      await loadRecipes()
      setFormData(initialFormData)
      showSuccessMessage('Recipe updated successfully.')
    } catch (err) {
      console.error(err)
      setRecipeError('Could not update the recipe.')
    }
  }

  const handleDelete = async () => {
    setRecipeError('')
    setSuccessMessage('')

    if (!selectedRecipeName) {
      setRecipeError('Select a recipe before deleting it.')
      return
    }

    if (deletePassword !== DELETE_PASSWORD) {
      setRecipeError('Incorrect password. Recipe was not deleted.')
      return
    }

    try {
      await deleteRecipe(selectedRecipeName)
      await loadRecipes()
      setMode('create')
      setSelectedRecipeName('')
      setSearchTerm('')
      setDeletePassword('')
      setFormData(initialFormData)
      showSuccessMessage('Recipe deleted successfully.')
    } catch (err) {
      console.error(err)
      setRecipeError('Could not delete the recipe.')
    }
  }

  const filteredRecipes = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase()

    if (!normalizedSearch) {
      return recipes
    }

    return recipes.filter((recipe) => recipe.name?.toLowerCase().includes(normalizedSearch))
  }, [recipes, searchTerm])

  const selectedRecipe = useMemo(
    () => recipes.find((recipe) => recipe.name === selectedRecipeName) || null,
    [recipes, selectedRecipeName]
  )

  useEffect(() => {
    if (!selectedRecipe) {
      return
    }

    setFormData({
      name: selectedRecipe.name || '',
      ingredients: Array.isArray(selectedRecipe.ingredients)
        ? selectedRecipe.ingredients.join(', ')
        : selectedRecipe.ingredients || '',
      steps: Array.isArray(selectedRecipe.steps)
        ? selectedRecipe.steps.join('\n')
        : selectedRecipe.steps || '',
      prepTime: selectedRecipe.prep_time ?? ''
    })
  }, [selectedRecipe])

  const handleModeChange = (nextMode) => {
    setMode(nextMode)
    setSuccessMessage('')
    setRecipeError('')
    setDeletePassword('')

    if (nextMode === 'create') {
      setSelectedRecipeName('')
      setSearchTerm('')
      setFormData(initialFormData)
    }
  }

  const handleFieldChange = (event) => {
    const { name, value } = event.target
    setSuccessMessage('')
    setRecipeError('')
    setFormData((current) => ({
      ...current,
      [name]: value
    }))
  }

  const handleRecipeSelect = (recipeName) => {
    setSelectedRecipeName(recipeName)
    setMode('update')
    setRecipeError('')
    setSuccessMessage('')
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    if (mode === 'create') {
      handleCreate()
    } else {
      handleUpdate()
    }
  }

  const handleActionClick = () => {
    if (mode === 'create') {
      handleCreate()
      return
    }

    handleUpdate()
  }

  return (
    <main className="generate-page">
      <section className="generate-hero">
        <p className="generate-kicker">Recipe builder</p>
        <h1 className="generate-title">Create or update a recipe in one clean form.</h1>
        <p className="generate-subtitle">
          Fill in the details below, switch between create and update mode, and keep your recipe data organized.
        </p>
      </section>

      <section className="generate-card">
        {successMessage && (
          <p ref={successMessageRef} className="generate-helperText is-success" role="status" aria-live="polite">
            {successMessage}
          </p>
        )}

        <div className="generate-toggle" role="tablist" aria-label="Recipe form mode">
          <button
            type="button"
            className={mode === 'create' ? 'generate-toggleButton is-active' : 'generate-toggleButton'}
            onClick={() => handleModeChange('create')}
          >
            Create new recipe
          </button>
          <button
            type="button"
            className={mode === 'update' ? 'generate-toggleButton is-active' : 'generate-toggleButton'}
            onClick={() => handleModeChange('update')}
          >
            Update existing recipe
          </button>
        </div>

        <form className="generate-form" onSubmit={handleSubmit}>
          {mode === 'update' && (
            <div className="generate-field">
              <span className="generate-label">Pick a recipe to update</span>
              <input
                className="generate-input"
                placeholder="Find recipes"
                type="search"
                value={searchTerm}
                onChange={(event) => {
                  setSearchTerm(event.target.value)
                  setRecipeError('')
                }}
              />

              <div className="generate-results" aria-live="polite">
                {loadingRecipes && <p className="generate-helperText">Loading recipes from the database...</p>}
                {!loadingRecipes && !recipeError && filteredRecipes.length === 0 && (
                  <p className="generate-helperText">No recipes matched your search.</p>
                )}
                {!loadingRecipes && !recipeError && filteredRecipes.length > 0 && (
                  <ul className="generate-resultList">
                    {filteredRecipes.map((recipe) => (
                      <li key={recipe.name} className="generate-resultItem">
                        <button
                          type="button"
                          className={
                            recipe.name === selectedRecipeName
                              ? 'generate-resultButton is-selected'
                              : 'generate-resultButton'
                          }
                          onClick={() => handleRecipeSelect(recipe.name)}
                        >
                          <span>{recipe.name}</span>
                          <span>{recipe.prep_time ? `${recipe.prep_time} min` : 'No prep time'}</span>
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          )}

          <label className="generate-field">
            <span className="generate-label">Recipe name</span>
            <input
              className="generate-input"
              placeholder="Spicy noodle bowl"
              type="text"
              name="name"
              value={formData.name}
              onChange={handleFieldChange}
            />
          </label>

          <label className="generate-field">
            <span className="generate-label">Ingredients</span>
            <textarea
              className="generate-input generate-textarea"
              placeholder="Chicken, garlic, noodles, chili oil..."
              name="ingredients"
              value={formData.ingredients}
              onChange={handleFieldChange}
            />
          </label>

          <label className="generate-field">
            <span className="generate-label">Steps</span>
            <textarea
              className="generate-input generate-textarea"
              placeholder="1. Prep ingredients... 2. Cook..."
              name="steps"
              value={formData.steps}
              onChange={handleFieldChange}
            />
          </label>

          <label className="generate-field generate-inlineField">
            <span className="generate-label">Estimated time (minutes)</span>
            <input
              className="generate-input"
              placeholder="30"
              type="number"
              min="1"
              name="prepTime"
              value={formData.prepTime}
              onChange={handleFieldChange}
            />
          </label>

          <div className="generate-actions">
            <button type="button" className="generate-submitButton" onClick={handleActionClick}>
              {mode === 'create' ? 'Create recipe' : 'Save changes'}
            </button>
          </div>

          {mode === 'update' && (
            <div className="generate-deleteCard">
              <span className="generate-deleteTitle">Delete recipe</span>
              <p className="generate-deleteText">
                Type the delete password to confirm removal of the selected recipe.
              </p>
              <label className="generate-field">
                <span className="generate-label">Delete password</span>
                <input
                  className="generate-input"
                  placeholder="Enter password"
                  type="password"
                  value={deletePassword}
                  onChange={(event) => {
                    setDeletePassword(event.target.value)
                    setRecipeError('')
                  }}
                />
              </label>
              {!loadingRecipes && recipeError && <p className="generate-helperText is-error">{recipeError}</p>}
              <button
                type="button"
                className="generate-deleteButton"
                onClick={handleDelete}
                disabled={!selectedRecipeName}
              >
                Delete selected recipe
              </button>
            </div>
          )}
        </form>
      </section>
    </main>
  )
}

export default GenerateRecipe