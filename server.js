const express = require('express');
const cors = require('cors');
const path = require('path');
const sequelize = require('./sequelize');
const app = express();
app.use(express.json());
app.use(cors());

const buildPath = path.join(__dirname, 'client', 'build');
app.use(express.static(buildPath));

const Meeting = require('./models/meeting');
const Participant = require('./models/participant');

const Parinte = Meeting;
const Copil = Participant;

const port = process.env.PORT || 3001;
app.listen(port, async () => {
  console.log('Server pornit pe portul ' + port);
});

app.get('/sync', async (req, res) => {
  try {
    await sequelize.sync({ force: true });
    const prim = await Parinte.create({
      descriere: 'Sedinta Marketing',
      url: 'https://apps.google.com/meet/',
    });
    const secund = await Parinte.create({
      descriere: 'Curs contabilitate',
      url: 'https://apps.google.com/meet/',
    });

    const subresursa1 = new Copil({ nume: 'Rares' });
    subresursa1.MeetingId = prim.id;
    await subresursa1.save();

    const subresursa2 = new Copil({ nume: 'Andrei' });
    subresursa2.MeetingId = secund.id;
    await subresursa2.save();

    res.status(201).json({ message: 'sample db created' });
  } catch (err) {
    console.error(err);
  }
});

app.get('/meeting/all', async (req, res) => {
  try {
    const parinte = await Parinte.findAll({ include: [Copil] });
    res.status(200).json(parinte);
  } catch (e) {
    res.status(500).json({ error: e });
  }
});
app.get('/meeting/:id', async (req, res) => {
  try {
    const parinte = await Parinte.findByPk(req.params.id);
    if (!parinte)
      return res.status(400).json({ eroare: 'Nu exista instanta indicata' });
    res.status(200).json(parinte);
  } catch (e) {
    res.status(500).json({ error: e });
  }
});
app.post('/meeting', async (req, res) => {
  try {
    const parinte = await Parinte.create(req.body);
    res.status(201).json(parinte);
  } catch (e) {
    res.status(500).json({ error: e });
  }
});
app.put('/meeting/:id', async (req, res) => {
  try {
    const parinte = await Parinte.findByPk(req.params.id);
    if (parinte != null) {
      await parinte.update(req.body);
      await parinte.save();
      res.status(200).json(parinte);
    } else res.status(400).json({ error: 'Nu exista instanta indicata' });
  } catch (e) {
    res.status(500).json({ error: e });
  }
});
app.delete('/meeting/:id', async (req, res) => {
  try {
    const parinte = await Parinte.findByPk(req.params.id);
    if (parinte != null) {
      await parinte.destroy();
      res.status(200).json({ message: 'Succes' });
    } else res.status(400).json({ error: 'Nu exista instanta indicata' });
  } catch (e) {
    res.status(500).json({ error: e });
  }
});

app.get('/meeting/:id/participanti', async (req, res) => {
  try {
    const parinte = await Parinte.findByPk(req.params.id);
    if (parinte == null)
      return res.status(400).json({ eroare: 'Nu exista instanta indicata' });
    const copii = await parinte.getParticipants();
    res.status(200).json(copii);
  } catch (e) {
    res.status(500).json({ error: e });
  }
});
app.post('/meeting/:id/participanti', async (req, res) => {
  try {
    const parinte = await Parinte.findByPk(req.params.id);
    if (parinte == null)
      return res.status(400).json({ eroare: 'Nu exista instanta indicata' });
    const copil = new Copil(req.body);
    copil.MeetingId = parinte.id;
    await copil.save();
    res.status(201).json(copil);
  } catch (e) {
    res.status(500).json({ error: e });
  }
});
app.put('/meeting/:id/participanti/:idCopil', async (req, res) => {
  try {
    const parinte = await Parinte.findByPk(req.params.id, {
      include: [
        {
          model: Copil,
          where: {
            id: req.params.idCopil,
          },
        },
      ],
    });
    if (parinte) {
      const copil = parinte.Participants[0];
      await copil.update(req.body);
      await copil.save();
      res.status(202).json(copil);
    } else {
      res.status(400).json({ error: 'Nu exista instanta sau copilul' });
    }
  } catch (e) {
    res.status(500).json({ error: e });
  }
});

app.delete('/meeting/:id/participanti/:idCopil', async (req, res) => {
  try {
    const parinte = await Parinte.findByPk(req.params.id, {
      include: [
        {
          model: Copil,
          where: {
            id: req.params.idCopil,
          },
        },
      ],
    });
    if (parinte) {
      const copil = parinte.Participants[0];
      await copil.destroy();
      res.status(200).json({ mesaj: 'Stergere realizata cu succes' });
    } else {
      res.status(400).json({ error: 'Nu exista instanta sau copilul' });
    }
  } catch (e) {
    res.status(500).json({ error: e });
  }
});

app.get('/', (req, res) => {
  res.sendFile(path.join(buildPath, 'index.html'));
});
