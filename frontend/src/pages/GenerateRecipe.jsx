  import React, { useEffect, useMemo, useState } from 'react'
import '../components/GenerateRecipe.css'
import { getAllRecipes } from '../api/recipes'

const GenerateRecipe = () => {
  const [mode, setMode] = useState('create')
  const [recipes, setRecipes] = useState([])
  const [loadingRecipes, setLoadingRecipes] = useState(false)
  const [recipeError, setRecipeError] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedRecipeName, setSelectedRecipeName] = useState('')
  const [formData, setFormData] = useState({
    name: '',
    ingredients: '',
    steps: '',
    prepTime: ''
  })

  useEffect(() => {
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

    loadRecipes()
  }, [])

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

    if (nextMode === 'create') {
      setSelectedRecipeName('')
      setSearchTerm('')
      setFormData({
        name: '',
        ingredients: '',
        steps: '',
        prepTime: ''
      })
    }
  }

  const handleFieldChange = (event) => {
    const { name, value } = event.target
    setFormData((current) => ({
      ...current,
      [name]: value
    }))
  }

  const handleRecipeSelect = (recipeName) => {
    setSelectedRecipeName(recipeName)
    setMode('update')
  }

  const handleSubmit = (event) => {
    event.preventDefault()
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
                onChange={(event) => setSearchTerm(event.target.value)}
              />

              <div className="generate-results" aria-live="polite">
                {loadingRecipes && <p className="generate-helperText">Loading recipes from the database...</p>}
                {!loadingRecipes && recipeError && <p className="generate-helperText is-error">{recipeError}</p>}
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
            <button type="submit" className="generate-submitButton">
              {mode === 'create' ? 'Create recipe' : 'Save changes'}
            </button>
          </div>
        </form>
      </section>
    </main>
  )
}

export default GenerateRecipe