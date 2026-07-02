import { useState, useEffect } from "react";
import { getAllRecipes } from "../api/recipes.js"

const Home = () => {
  const [recipes, setRecipes] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadRecipes() {
      try {
        const data = await getAllRecipes();
        setRecipes(data)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    loadRecipes();
  }, [])

  if (loading) return <p>Loading...</p>

  return (
    <div>
      <h1>Recipes</h1>

      {recipes.length === 0 && <p>No Recipes Yet.</p>}

      {recipes.map(recipe => (
        <div key={recipe.id}>
          <p>{recipe}</p>
        </div>
      ))}
    </div>
  )
}

export default Home