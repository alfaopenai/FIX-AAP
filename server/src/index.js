import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import { PrismaClient } from '@prisma/client';
import OpenAI from 'openai';

const app = express();
const prisma = new PrismaClient();
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const PORT = process.env.PORT || 8787;
const ORIGIN = process.env.ALLOWED_ORIGIN || 'http://localhost:5173';

app.use(cors({ origin: ORIGIN, credentials: false }));
app.use(express.json({ limit: '2mb' }));
app.use(morgan('dev'));

app.get('/health', (_req, res) => {
  res.json({ ok: true, time: new Date().toISOString() });
});

// Basic entities endpoints (read-only to start)
const normalizeStore = (s) => ({
  ...s,
  rating: s.rating !== null && s.rating !== undefined ? Number(s.rating) : null,
});

const normalizeProduct = (p) => ({
  ...p,
  rating: p.rating !== null && p.rating !== undefined ? Number(p.rating) : null,
  store: p.store ? normalizeStore(p.store) : undefined,
});

app.get('/api/stores', async (_req, res, next) => {
  try {
    const stores = await prisma.store.findMany({ orderBy: { createdAt: 'desc' } });
    res.json(stores.map(normalizeStore));
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('GET /api/stores failed:', err?.message || err);
    res.status(503).json({ error: 'stores_unavailable' });
    next && next();
  }
});

app.get('/api/stores/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const store = await prisma.store.findUnique({ where: { id } });
    if (!store) return res.status(404).json({ error: 'not found' });
    res.json(normalizeStore(store));
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('GET /api/stores/:id failed:', err?.message || err);
    res.status(503).json({ error: 'stores_unavailable' });
    next && next();
  }
});

app.get('/api/products', async (req, res, next) => {
  try {
    const limit = Number(req.query.limit ?? 20);
    const storeId = req.query.storeId ? String(req.query.storeId) : null;
    const where = storeId ? { storeId } : {};
    const products = await prisma.product.findMany({
      where,
      take: Math.min(limit, 100),
      orderBy: { createdAt: 'desc' },
      include: { store: true },
    });
    res.json(products.map(normalizeProduct));
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('GET /api/products failed:', err?.message || err);
    res.status(503).json({ error: 'products_unavailable' });
    next && next();
  }
});

app.post('/api/conversations', async (req, res) => {
  const conversation = await prisma.conversation.create({ data: {} });
  res.status(201).json(conversation);
});

app.get('/api/conversations/:id/messages', async (req, res) => {
  const { id } = req.params;
  const messages = await prisma.message.findMany({
    where: { conversationId: id },
    orderBy: { createdAt: 'asc' },
  });
  res.json(messages);
});

app.post('/api/conversations/:id/messages', async (req, res) => {
  const { id } = req.params;
  const { senderId = null, content } = req.body || {};
  if (!content || String(content).trim() === '') {
    return res.status(400).json({ error: 'content is required' });
  }
  const message = await prisma.message.create({
    data: { conversationId: id, senderId, content },
  });
  res.status(201).json(message);
});

app.post('/api/issues', async (req, res) => {
  const { title, description, category, urgency, photos = [], location } = req.body || {};
  if (!title || !description || !category || !urgency) {
    return res.status(400).json({ error: 'missing required fields' });
  }
  const issue = await prisma.issue.create({
    data: {
      title,
      description,
      category,
      urgency,
      photos,
      location: location ?? null,
    },
  });
  res.status(201).json(issue);
});

// LLM chat endpoint
app.post('/api/llm/chat', async (req, res) => {
  try {
    const { messages = [], prompt, model } = req.body || {};
    const effectiveModel = model || process.env.OPENAI_MODEL || 'gpt-5';

    // Build messages array for OpenAI chat
    const chatMessages = [];
    if (prompt) {
      chatMessages.push({ role: 'user', content: prompt });
    } else if (Array.isArray(messages) && messages.length > 0) {
      for (const m of messages.slice(-12)) {
        chatMessages.push({ role: m.role || (m.sender === 'user' ? 'user' : 'assistant'), content: m.text || m.content || '' });
      }
    } else {
      return res.status(400).json({ error: 'prompt or messages are required' });
    }

    const response = await openai.chat.completions.create({
      model: effectiveModel,
      messages: [
        { role: 'system', content: "אתה עוזר של Fix. ענה בעברית, קצר וברור, ובסגנון הצ'אט הקיים." },
        ...chatMessages,
      ],
    });

    const text = response.choices?.[0]?.message?.content?.trim() || '';
    return res.json({ text, model: effectiveModel });
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('LLM chat error:', err?.response?.data || err?.message || err);
    return res.status(500).json({ error: 'llm_failed' });
  }
});

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Fix backend listening on http://localhost:${PORT}`);
});

// Global error guard (last resort)
process.on('unhandledRejection', (err) => {
  // eslint-disable-next-line no-console
  console.error('Unhandled rejection:', err);
});
process.on('uncaughtException', (err) => {
  // eslint-disable-next-line no-console
  console.error('Uncaught exception:', err);
});


