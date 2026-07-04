import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { getRecipeById } from '../api/recipes'

const EachRecipe = () => {
  const { id } = useParams()
  const [recipe, setRecipe] = useState(null)

  useEffect(() => {
    const loadEachRecipe = async () => {
        const data = await getRecipeById(id)
        setRecipe(data)
    }

    if (id) loadEachRecipe()
  }, [id])

  if (recipe === null) return <div style={{ textAlign: 'center', marginTop: 40 }}>Loading...</div>

  return (
    <div style={{ padding: '24px' }}>
      <h1 style={{ textAlign: 'center', marginBottom: 24 }}>{recipe.name}</h1>

      <div style={{ textAlign: 'left', maxWidth: 800, marginLeft: 0 }}>
        <section style={{ marginBottom: 16 }}>
          <p style={{ fontWeight: 600 }}>Prepare all ingredients:</p>
          <ul>
            {recipe.ingredients.map((i, idx) => (
              <li key={idx}>{i}</li>
            ))}
          </ul>
        </section>

        <section>
          <p style={{ fontWeight: 600 }}>Follow all steps</p>
          <ol>
            {recipe.steps.map((s, idx) => (
              <li key={idx}>{s}</li>
            ))}
          </ol>
        </section>
      </div>
    </div>
  )
}

export default EachRecipe