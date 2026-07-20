const express = require('express');
const app = express();
const PORT = 3000;

const db = require('./models');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// POST
app.post('/komik', async (req, res) => {
    try {
        const { title, description, author } = req.body;

        const komik = await db.Komik.create({
            title,
            description,
            author
        });

        res.status(201).json(komik);
    } catch (err) {
        res.status(500).json({
            error: err.message
        });
    }
});

// GET
app.get('/komik', async (req, res) => {
    try {
        const komik = await db.Komik.findAll();
        res.status(200).json(komik);
    } catch (err) {
        res.status(500).json({
            error: err.message
        });
    }
});

// GET BY ID
app.get('/komik/:id', async (req, res) => {
    try {
        const komik = await db.Komik.findByPk(req.params.id);

        if (!komik) {
            return res.status(404).json({
                message: "Komik tidak ditemukan"
            });
        }

        res.json(komik);
    } catch (err) {
        res.status(500).json({
            error: err.message
        });
    }
});

// PUT
app.put('/komik/:id', async (req, res) => {
    try {
        const { title, description, author } = req.body;

        const komik = await db.Komik.findByPk(req.params.id);

        if (!komik) {
            return res.status(404).json({
                message: "Komik tidak ditemukan"
            });
        }

        await komik.update({
            title,
            description,
            author
        });

        res.json(komik);

    } catch (err) {
        res.status(500).json({
            error: err.message
        });
    }
});

// DELETE
app.delete('/komik/:id', async (req, res) => {
    try {
        const komik = await db.Komik.findByPk(req.params.id);

        if (!komik) {
            return res.status(404).json({
                message: "Komik tidak ditemukan"
            });
        }

        await komik.destroy();

        res.json({
            message: "Komik berhasil dihapus"
        });

    } catch (err) {
        res.status(500).json({
            error: err.message
        });
    }
});

// Jalankan server
db.sequelize.sync()
.then(() => {
    app.listen(PORT, () => {
        console.log(`Server berjalan di http://localhost:${PORT}`);
    });
})
.catch(err => {
    console.log(err);
});