import React, { useEffect, useState } from 'react'
import { getAllRecipes } from '../api/recipes'
import { Link } from 'react-router-dom'
import '../components/Recipes.css'

const Recipes = () => {
  const [recipes, setRecipes] = useState([])
  const [searchTerm, setSearchTerm] = useState('')

  const filteredRecipes = recipes.filter((r) =>
    (r.name || '').toLowerCase().includes(searchTerm.toLowerCase())
  )

  const highlightText = (text, term) => {
    const source = String(text ?? '')

    if (!term) return source

    // Escape regex special characters in the search term
    const escaped = term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    const regex = new RegExp(`(${escaped})`, 'gi')
    const parts = source.split(regex)

    return parts.map((part, i) =>
      part.toLowerCase() === term.toLowerCase() ? (
        <span key={i} className="recipes-highlight">{part}</span>
      ) : (
        <React.Fragment key={i}>{part}</React.Fragment>
      )
    )
  }

  useEffect(() => {
    const loadRecipes = async () => {
      const data = await getAllRecipes();
      setRecipes(data)
    }
      
    loadRecipes();
  }, [])

  return (
    <div className="recipes-page">
      <div className="recipes-hero">
        <p className="recipes-kicker">Recipe Collection</p>
        <h1 className="recipes-title">Where all recipes briefly display</h1>
        <p className="recipes-subtitle">
          A clean card layout for displaying recipe names, ingredients, and
          steps.
        </p>
        <input
          type="text"
          placeholder="Search your recipes..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="recipes-searchInput"
        />
      </div>

      <div className="recipes-grid">
        {recipes.length === 0 ? (
          <p className="recipes-status">
            Recipes are loading...
          </p>
        ) : filteredRecipes.length > 0 ? filteredRecipes.map((recipe, index) => (
          <div key={index} className="recipes-card">
            <div className="recipes-prepTimePill">
              <span className="recipes-prepTimeLabel">Prep Time</span>
              <span className="recipes-prepTimeValue">{recipe.prep_time || 'N/A'}</span>
            </div>

            <Link to={`/recipes/${recipe.name}`}>
              <span className="recipes-badge">Recipe {index + 1}</span>
              <h2 className="recipes-cardTitle">{highlightText(recipe.name, searchTerm)}</h2>
            </Link>

            <div className="recipes-section">
              <h3 className="recipes-sectionTitle">Ingredients</h3>
              <p className="recipes-text">{recipe.ingredients.join(', ')}</p>
            </div>

            <div className="recipes-section">
              <h3 className="recipes-sectionTitle">Steps</h3>
              <p className="recipes-text">{recipe.steps.join(', ')}</p>
            </div>
          </div>
        )) : (
          <p className="recipes-status">
            No recipes found for “{searchTerm}”.
          </p> 
        )}
      </div>
    </div>
  )
}

export default Recipes
