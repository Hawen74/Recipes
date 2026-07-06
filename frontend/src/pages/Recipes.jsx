import React, { useEffect, useState } from 'react'
import { getAllRecipes } from '../api/recipes'
import { Link } from 'react-router-dom'

const Recipes = () => {
  const [recipes, setRecipes] = useState([])
  const [searchTerm, setSearchTerm] = useState('')

  const query = searchTerm.trim().toLowerCase()

  const filteredRecipes = recipes.filter((recipe) => {
    if (!query) return true

    const name = recipe.name?.toLowerCase() ?? ''
    const ingredients = Array.isArray(recipe.ingredients)
      ? recipe.ingredients.join(' ').toLowerCase()
      : ''
    const steps = Array.isArray(recipe.steps)
      ? recipe.steps.join(' ').toLowerCase()
      : ''

    return (
      name.includes(query) ||
      ingredients.includes(query) ||
      steps.includes(query)
    )
  })

  useEffect(() => {
    const loadRecipes = async () => {
      const data = await getAllRecipes();
      setRecipes(data)
    }
      
    loadRecipes();
  }, [])

  return (
    <div style={styles.page}>
      <div style={styles.hero}>
        <p style={styles.kicker}>Recipe Collection</p>
        <h1 style={styles.title}>Where all recipes briefly display</h1>
        <p style={styles.subtitle}>
          A clean card layout for displaying recipe names, ingredients, and
          steps.
        </p>
        <input
          type="text"
          placeholder="Search your recipes..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={styles.searchInput}
        />
      </div>

      <div style={styles.grid} >
        {filteredRecipes.length > 0 ? filteredRecipes.map((recipe, index) => (
          <div key={index} style={styles.card}>
            <Link to={`/recipes/${recipe.name}`}>
              <span style={styles.badge}>Recipe {index + 1}</span>
              <h2 style={styles.cardTitle}>{recipe.name}</h2>
            </Link>

            <div style={styles.section}>
              <h3 style={styles.sectionTitle}>Ingredients</h3>
              <p style={styles.text}>{recipe.ingredients.join(", ")}</p>
            </div>

            <div style={styles.section}>
              <h3 style={styles.sectionTitle}>Steps</h3>
              <p style={styles.text}>{recipe.steps.join(", ")}</p>
            </div>
          </div>
        )) : (
          <p style={{ textAlign: 'center', color: '#4b5563', gridColumn: '1 / -1' }}>
            No recipes found for “{searchTerm}”.
          </p>
        )}
      </div>
    </div>
  )
}

const styles = {
  page: {
    minHeight: '100vh',
    padding: '48px 24px',
    background:
      'linear-gradient(135deg, rgba(255,248,240,1) 0%, rgba(245,247,255,1) 100%)',
    fontFamily: 'Arial, sans-serif',
    color: '#1f2937',
  },
  hero: {
    maxWidth: '980px',
    margin: '0 auto 32px',
    textAlign: 'center',
  },
  kicker: {
    margin: 0,
    fontSize: '0.9rem',
    fontWeight: 700,
    letterSpacing: '0.14em',
    textTransform: 'uppercase',
    color: '#ef7f4f',
  },
  title: {
    margin: '12px 0 10px',
    fontSize: 'clamp(2rem, 4vw, 3.5rem)',
    lineHeight: 1.1,
    color: 'black'
  },
  subtitle: {
    margin: '0 auto',
    maxWidth: '720px',
    fontSize: '1.05rem',
    color: '#4b5563',
  },
  searchInput: {
    marginTop: '24px',
    width: 'min(100%, 420px)',
    padding: '14px 16px',
    borderRadius: '12px',
    border: '1px solid #e5e7eb',
    background: 'lightyellow',
    color: 'gray',
    outline: 'none',
    fontSize: '1rem',
    boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.03)',
    outline: 'none'
  },
  grid: {
    maxWidth: '1100px',
    margin: '0 auto',
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
    gap: '24px',
  },
  card: {
    background: 'rgba(255, 255, 255, 0.9)',
    border: '1px solid rgba(255,255,255,0.7)',
    borderRadius: '20px',
    padding: '24px',
    boxShadow: '0 20px 45px rgba(31, 41, 55, 0.08)',
    backdropFilter: 'blur(10px)',
  },
  badge: {
    display: 'inline-block',
    marginBottom: '12px',
    padding: '6px 12px',
    borderRadius: '999px',
    background: '#fff1e8',
    color: '#c2410c',
    fontSize: '0.8rem',
    fontWeight: 700,
  },
  cardTitle: {
    margin: '0 0 8px',
    fontSize: '1.4rem',
    color: '#111827',
  },
  section: {
    paddingTop: '16px',
    borderTop: '1px solid #e5e7eb',
    marginTop: '16px',
  },
  sectionTitle: {
    margin: '0 0 8px',
    fontSize: '0.95rem',
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
    color: '#ef7f4f',
  },
  text: {
    margin: 0,
    color: '#374151',
    lineHeight: 1.7,
  },
}

export default Recipes
