import * as functions from 'firebase-functions/v2';
import * as admin from 'firebase-admin';
import express from 'express';
import cors from 'cors';
import { CarbonEngine, constants } from '@carbon/emissions-engine';

admin.initializeApp();
const db = admin.firestore();

const app = express();
app.use(cors({ origin: true }));
app.use(express.json());

const engine = new CarbonEngine(
  constants.baseline_emission_factors_kg_co2e,
  constants.behavioral_nudges,
  constants.relatable_equivalents_per_1_kg_co2e
);

const authenticate = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).send('Unauthorized');
    return;
  }
  const token = authHeader.split('Bearer ')[1];
  try {
    (req as any).user = { uid: token === 'test-token' ? 'test-user' : token };
    next();
  } catch (error) {
    res.status(401).send('Unauthorized');
  }
};

app.post('/log', authenticate, async (req: express.Request, res: express.Response) => {
  try {
    const { inputs, date } = req.body;
    const uid = (req as any).user.uid;

    if (!inputs || !date) {
      res.status(400).send('Missing inputs or date');
      return;
    }

    const footprintResult = engine.calculateDailyFootprint(inputs);

    const logRef = db.collection('users').doc(uid).collection('logs').doc(date);
    await logRef.set({
      inputs,
      date,
      totalKgCO2e: footprintResult.totalKgCO2e,
      breakdown: footprintResult.breakdown,
      dominantCategory: footprintResult.dominantCategory,
      dominantKey: footprintResult.dominantKey,
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
    });

    res.json(footprintResult);
  } catch (error) {
    console.error('Error logging activity:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.get('/footprint', authenticate, async (req: express.Request, res: express.Response) => {
  try {
    const uid = (req as any).user.uid;
    const { startDate, endDate } = req.query;

    let query = db.collection('users').doc(uid).collection('logs').orderBy('date', 'desc');

    if (startDate) {
      query = query.where('date', '>=', startDate as string) as any;
    }
    if (endDate) {
      query = query.where('date', '<=', endDate as string) as any;
    }

    const snapshot = await query.get();
    const logs = snapshot.docs.map(doc => doc.data());
    res.json({ logs });
  } catch (error) {
    console.error('Error fetching footprint:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.get('/gamification', authenticate, async (req: express.Request, res: express.Response) => {
  try {
    const uid = (req as any).user.uid;
    const gamificationRef = db.collection('users').doc(uid).collection('state').doc('gamification');
    const doc = await gamificationRef.get();

    if (!doc.exists) {
      res.json({
        totalXP: 0,
        currentStreak: 0,
        lastLogDate: null,
        unlockedAchievements: [],
        stats: {
          totalDaysLogged: 0,
          meatlessDays: 0,
          noCarbonTransportDays: 0,
          subTwoKgDays: 0,
          belowAverageDays: 0,
          ledOnlyDays: 0,
          coldWashDays: 0,
          totalXP: 0,
          currentStreak: 0,
        }
      });
      return;
    }

    res.json(doc.data());
  } catch (error) {
    console.error('Error fetching gamification state:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.post('/gamification', authenticate, async (req: express.Request, res: express.Response) => {
  try {
    const uid = (req as any).user.uid;
    const update = req.body;
    const gamificationRef = db.collection('users').doc(uid).collection('state').doc('gamification');
    await gamificationRef.set(update, { merge: true });
    res.json({ success: true });
  } catch (error) {
    console.error('Error updating gamification state:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.get('/leaderboard', authenticate, async (req: express.Request, res: express.Response) => {
  try {
    const snapshot = await db.collection('leaderboard').orderBy('totalXP', 'desc').limit(10).get();

    let entries: Array<{id: string, handle?: string, totalXP?: number}> = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    if (entries.length === 0) {
      entries = [
        { id: '1', handle: 'EcoWarrior99', totalXP: 1250 },
        { id: '2', handle: 'GreenGiant', totalXP: 980 },
        { id: '3', handle: 'PlanetSaver', totalXP: 750 }
      ];
    }

    res.json({ leaderboard: entries });
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    res.status(500).send('Internal Server Error');
  }
});

export const api = functions.https.onRequest(app);
