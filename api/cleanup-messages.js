// api/cleanup-messages.js
import { database } from '../../firebase';
import { ref, get, remove } from 'firebase/database';

export default async function handler(req, res) {
  // Verify this is a cron job (security)
  if (req.headers.authorization !== `Bearer ${process.env.CRON_SECRET}`) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    const FIFTEEN_DAYS_MS = 15 * 24 * 60 * 60 * 1000;
    const now = Date.now();
    const years = ['first', 'second', 'third', 'fourth', 'common'];
    let deletedCount = 0;

    for (const year of years) {
      const messagesRef = ref(database, `messages/${year}`);
      const snapshot = await get(messagesRef);
      const messages = snapshot.val();

      if (!messages) continue;

      for (const [msgId, message] of Object.entries(messages)) {
        // Check if message is older than 15 days
        if (message.timestamp && (now - message.timestamp) > FIFTEEN_DAYS_MS) {
          const msgRef = ref(database, `messages/${year}/${msgId}`);
          await remove(msgRef);
          deletedCount++;
        }
      }
    }

    res.status(200).json({ 
      message: 'Cleanup completed', 
      deletedMessages: deletedCount,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Cleanup error:', error);
    res.status(500).json({ error: 'Cleanup failed' });
  }
}
