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

app.get('/recipes/:id', async (req, res) => {
    try {
        const id = Number(req.params.id)
        if (isNaN(id)) {
            return res.status(400).json({error: "Invalid id"})
        }
        
        const recipe = await pool.query(
            `SELECT * FROM recipes
            WHERE id = $1`, [id]
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

app.post('/recipes', async (req, res) => {
    try {
        const { name, ingredients, steps } = req.body

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
            `INSERT INTO recipes (name, ingredients, steps)
             VALUES ($1, $2, $3)
             RETURNING *`,
            [
                name.trim(),
                ingredients || [],
                steps || []
            ]
        )

        res.json(recipe.rows[0])

    } catch (err) {
        console.error(err)
        res.status(500).json({ error: 'Database error' });
    }
})

app.put('/recipes/:id', async (req, res) => {
    try {
        const id = Number(req.params.id)
        if (isNaN(id)) {
            return res.status(400).json({error: "Invalid id"})
        }

        const { name, ingredients, steps } = req.body

        const recipe = await pool.query(
            `UPDATE recipes
            SET name = $1,
                ingredients = $2,
                steps = $3,
                updated_at = CURRENT_TIMESTAMP
            WHERE id = $4
            RETURNING *`, 
            [
                name,
                ingredients,
                steps,
                id
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

app.delete('/recipes/:id', async (req, res) => {
    try {
        const id = Number(req.params.id)
        if (isNaN(id)) {
            return res.status(400).json({error: "Invalid id"})
        }

        const recipe = await pool.query(`
            DELETE FROM recipes
            WHERE id = $1
            RETURNING *`, [id]
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