const express = require('express')
const pool = require('./db')
const cors = require('cors')
const app = express();
const PORT = 3000;

app.use(cors())
app.use(express.json());

app.get('/recipes', async (req, res) => {
    try {
        const recipes = await pool.query(
            `SELECT * FROM recipes`
        )

        res.json(recipes.rows)

    } catch (err) {
        console.error(err)
        res.status(500).json({ error: 'Database error' });
    }
})

app.get('/recipes/import', async (req, res) => {
    try {
        const { query } = req.query

        if (!query || !query.trim()) {
            return res.status(400).json({ error: 'Search query is required' })
        }

        const response = await fetch(
            `https://www.themealdb.com/api/json/v1/1/search.php?s=${encodeURIComponent(query.trim())}`
        )
        const data = await response.json()

        if (!data.meals || data.meals.length === 0) {
            return res.status(404).json({ error: 'No meals found for that search' })
        }

        const meal = data.meals[0]

        const ingredients = []
        for (let i = 1; i <= 20; i++) {
            const ingredient = meal[`strIngredient${i}`]
            const measure = meal[`strMeasure${i}`]
            if (ingredient && ingredient.trim()) {
                ingredients.push(`${measure?.trim() || ''} ${ingredient.trim()}`.trim())
            }
        }

        const steps = meal.strInstructions
            .split(/\r\n|\n/)
            .map(s => s.trim())
            .filter(Boolean)

        res.json({
            name: meal.strMeal,
            ingredients,
            steps,
            prep_time: null
        })

    } catch (err) {
        console.error(err)
        res.status(500).json({ error: 'Database error' });
    }
})

app.get('/recipes/:name', async (req, res) => {
    try {
        const name = req.params.name?.trim()
        if (!name) {
            return res.status(400).json({ error: 'Invalid recipe name' })
        }

        const recipe = await pool.query(
            `SELECT * FROM recipes
            WHERE LOWER(name) = LOWER($1)`, [name]
        )

        if (recipe.rows.length === 0) {
            return res.status(404).json({ err: 'recipe not found'})
        }

        res.json(recipe.rows[0])

    } catch (err) {
        console.error(err)
        res.status(500).json({ error: 'Database error' });
    }
})

// API POST 
const Anthropic = require('@anthropic-ai/sdk')
const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY})

const extractJsonObject = (text) => {
    const cleaned = text.trim().replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '')
    const start = cleaned.indexOf('{')
    const end = cleaned.lastIndexOf('}')
    if (start === -1 || end === -1 || end < start) {
        throw new Error('No JSON object found in model response')
    }
    return cleaned.slice(start, end + 1)
}

app.post('/recipes/generate', async (req, res) => {
    try {
        if (!process.env.ANTHROPIC_API_KEY) {
            return res.status(500).json({ error: 'ANTHROPIC_API_KEY is not configured' })
        }

        const { prompt } = req.body

        if (!prompt || !prompt.trim()) {
            return res.status(400).json({ error: 'Prompt is required' })
        }

        const message = await anthropic.messages.create({
            model: 'claude-sonnet-4-6',
            max_tokens: 1024,
            messages: [
                { role: 'user', content: 
                    `
                    Generate one recipe based on this request:
                    "${prompt}"
                    Return ONLY valid JSON in this format:
                    {
                    "name": "" (string),
                    "ingredients": "" (text[]),
                    "steps": "" (text[]),
                    "prepTime": ... (int)
                    }
                    ` 
                }
            ]
        })

        const rawText = message.content
            .filter(block => block.type === 'text')
            .map(block => block.text)
            .join('')

        const recipe = JSON.parse(extractJsonObject(rawText))

        if (!recipe || typeof recipe !== 'object' || !recipe.name) {
            return res.status(502).json({ error: 'Invalid recipe format returned by model' })
        }

        res.json(recipe)
    } catch (err) {
        console.error(err)
        res.status(500).json({ error: 'Recipe generation failed' })
    }
})

app.post('/recipes', async (req, res) => {
    try {
        const { name, ingredients, steps, prep_time } = req.body

        if (!name || typeof name !== 'string' || !name.trim()) {
            return res.status(400).json({ error: 'Name is required' })
        }

        const existingRecipe = await pool.query(
            `SELECT * FROM recipes
             WHERE LOWER(name) = LOWER($1)`,
            [name.trim()]
        )

        if (existingRecipe.rows.length > 0) {
            return res.status(409).json({
                error: 'Recipe already exists'
            })
        }

        const recipe = await pool.query(
            `INSERT INTO recipes (name, ingredients, steps, prep_time)
             VALUES ($1, $2, $3, $4)
             RETURNING *`,
            [
                name.trim(),
                ingredients || [],
                steps || [],
                prep_time || null 
            ]
        )

        res.json(recipe.rows[0])

    } catch (err) {
        console.error(err)
        res.status(500).json({ error: 'Database error' });
    }
})

app.put('/recipes/:name', async (req, res) => {
    try {
        const currentName = req.params.name?.trim()
        if (!currentName) {
            return res.status(400).json({ error: 'Invalid recipe name' })
        }

        const { name, ingredients, steps, prep_time } = req.body

        if (!name || typeof name !== 'string' || !name.trim()) {
            return res.status(400).json({ error: 'Name is required' })
        }

        const recipe = await pool.query(
            `UPDATE recipes
            SET name = $1,
                ingredients = $2,
                steps = $3,
                prep_time = $4,
                updated_at = CURRENT_TIMESTAMP
            WHERE LOWER(name) = LOWER($5)
            RETURNING *`, 
            [
                name.trim(),
                ingredients,
                steps,
                prep_time || null,
                currentName
            ]
        )

        if (recipe.rows.length === 0) {
            return res.status(404).json({ error: 'recipe not found'})
        }

        res.json(recipe.rows[0])

    } catch (err) {
        console.error(err)
        res.status(500).json({ error: 'Database error' });
    }
})

app.delete('/recipes/:name', async (req, res) => {
    try {
        const name = req.params.name?.trim()
        if (!name) {
            return res.status(400).json({ error: 'Invalid recipe name' })
        }

        const recipe = await pool.query(`
            DELETE FROM recipes
            WHERE LOWER(name) = LOWER($1)
            RETURNING *`, [name]
        )

        if (recipe.rows.length === 0) {
            return res.status(404).json({ error: 'recipe not found'})
        }

        res.json({ 
            message: 'Recipe deleted',
            recipe: recipe.rows[0]
        })

    } catch (err) {
        console.error(err)
        res.status(500).json({ error: 'Database error' });
    }
})

app.use((req, res) => {
    res.status(404).json({ error: `Route ${req.url} not found`})
})

app.listen(PORT, () => {
  console.log(`Recipes API running on http://localhost:${PORT}/recipes`)
})