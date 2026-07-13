import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { getRecipeById } from '../api/recipes'
import '../components/Recipes.css'

const styles = {
  page: {
    minHeight: '100vh',
    padding: '48px 24px',
    background:
      'linear-gradient(135deg, rgba(255,248,240,1) 0%, rgba(245,247,255,1) 100%)',
    color: '#1f2937',
    fontFamily: 'Arial, Helvetica, sans-serif',
  },
  card: {
    position: 'relative',
    maxWidth: '920px',
    margin: '0 auto',
    padding: '32px',
    borderRadius: '24px',
    background: 'rgba(255, 255, 255, 0.9)',
    border: '1px solid rgba(255,255,255,0.7)',
    boxShadow: '0 20px 45px rgba(31, 41, 55, 0.08)',
    backdropFilter: 'blur(10px)',
  },
  title: {
    margin: '0 0 24px',
    textAlign: 'center',
    fontSize: 'clamp(2rem, 4vw, 3.4rem)',
    lineHeight: 1.1,
    color: '#111827',
  },
  layout: {
    display: 'grid',
    gap: '24px',
  },
  prepTimeRow: {
    display: 'flex',
    justifyContent: 'flex-end',
  },
  section: {
    padding: '20px 20px 0',
    borderTop: '1px solid #e5e7eb',
  },
  sectionTitle: {
    margin: '0 0 12px',
    fontSize: '0.95rem',
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
    color: '#ef7f4f',
    fontWeight: 700,
  },
  list: {
    margin: 0,
    paddingLeft: '20px',
    paddingRight: '20px',
    color: '#374151',
    lineHeight: 1.8,
    textAlign: 'left',
  },
  loading: {
    minHeight: '100vh',
    display: 'grid',
    placeItems: 'center',
    background:
      'linear-gradient(135deg, rgba(255,248,240,1) 0%, rgba(245,247,255,1) 100%)',
    color: '#4b5563',
    fontSize: '1.1rem',
    fontWeight: 600,
    fontFamily: 'Arial, Helvetica, sans-serif',
  },
}

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

  if (recipe === null) return <div style={styles.loading}>Loading...</div>

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <div style={styles.prepTimeRow}>
          <div className="recipes-prepTimePill">
            <span className="recipes-prepTimeLabel">Prep Time</span>
            <span className="recipes-prepTimeValue">{recipe.prep_time || 'N/A'}</span>
          </div>
        </div>

        <h1 style={styles.title}>{recipe.name}</h1>

        <div style={styles.layout}>
          <section style={styles.section}>
            <p style={styles.sectionTitle}>Prepare all ingredients</p>
            <ul style={styles.list}>
              {recipe.ingredients.map((i, idx) => (
                <li style={{ paddingLeft: "20px" }} key={idx}>{i}</li>
              ))}
            </ul>
          </section>

          <section style={styles.section}>
            <p style={styles.sectionTitle}>Follow all steps</p>
            <ol style={styles.list}>
              {recipe.steps.map((s, idx) => (
                <li style={{ paddingLeft: "20px" }} key={idx}>{s}</li>
              ))}
            </ol>
          </section>
        </div>
      </div>
    </div>
  )
}

export default EachRecipe