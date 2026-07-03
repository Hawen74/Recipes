import React from 'react'

const recipes = [
  {
    name: 'Creamy Garlic Pasta',
    ingredients: 'Pasta, garlic, butter, cream, parmesan',
    steps: 'Cook pasta, prepare sauce, toss together, serve warm.',
  },
  {
    name: 'Classic Chicken Salad',
    ingredients: 'Chicken, lettuce, tomatoes, cucumber, dressing',
    steps: 'Chop ingredients, mix, add dressing, and enjoy fresh.',
  },
  {
    name: 'Berry Yogurt Parfait',
    ingredients: 'Yogurt, berries, granola, honey',
    steps: 'Layer yogurt, berries, and granola, then drizzle honey.',
  },
]

const Recipes = () => {
  return (
    <div style={styles.page}>
      <div style={styles.hero}>
        <p style={styles.kicker}>Recipe Collection</p>
        <h1 style={styles.title}>Where all recipes briefly display</h1>
        <p style={styles.subtitle}>
          A clean card layout for displaying recipe names, ingredients, and
          steps.
        </p>
      </div>

      <div style={styles.grid}>
        {recipes.map((recipe, index) => (
          <div key={index} style={styles.card}>
            <span style={styles.badge}>Recipe {index + 1}</span>
            <h2 style={styles.cardTitle}>{recipe.name}</h2>

            <div style={styles.section}>
              <h3 style={styles.sectionTitle}>Ingredients</h3>
              <p style={styles.text}>{recipe.ingredients}</p>
            </div>

            <div style={styles.section}>
              <h3 style={styles.sectionTitle}>Steps</h3>
              <p style={styles.text}>{recipe.steps}</p>
            </div>
          </div>
        ))}
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
