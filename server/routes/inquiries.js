import express from 'express';
import Inquiry from '../models/Inquiry.js';
import requireAdmin from '../middleware/admin.js';

const router = express.Router();
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

router.post('/', async (req, res, next) => {
  try {
    const body = req.body || {};
    const { type, name, email, message } = body;

    if (!['contact', 'custom'].includes(type)) {
      return res.status(400).json({ ok: false, message: 'type must be "contact" or "custom".' });
    }
    if (!String(name || '').trim()) {
      return res.status(400).json({ ok: false, message: 'name is required.' });
    }
    if (!email || !emailPattern.test(String(email))) {
      return res.status(400).json({ ok: false, message: 'A valid email is required.' });
    }
    if (String(message || '').trim().length < 10) {
      return res.status(400).json({ ok: false, message: 'message must be at least 10 characters.' });
    }

    const inquiry = await Inquiry.create({
      type,
      name: String(name).trim(),
      email: String(email).trim(),
      subject: body.subject || '',
      message: String(message).trim(),
      theme: body.theme || '',
      style: body.style || '',
      size: body.size || '',
      budget: body.budget || '',
      palette: body.palette || '',
      timeline: body.timeline || '',
      consent: body.consent === true,
    });

    return res.status(201).json({ ok: true, inquiry });
  } catch (error) {
    return next(error);
  }
});

router.get('/', requireAdmin, async (_req, res, next) => {
  try {
    const inquiries = await Inquiry.find().sort({ createdAt: -1 });
    return res.json({ ok: true, inquiries });
  } catch (error) {
    return next(error);
  }
});

export default router;
