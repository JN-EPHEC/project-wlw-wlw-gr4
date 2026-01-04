import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

/**
 * Cloud Function: Nettoyer les notifications de plus de 7 jours
 * 
 * Déclenché chaque jour via Cloud Scheduler
 * Supprime toutes les notifications créées il y a plus de 7 jours
 */
export const cleanupOldNotifications = functions
  .region('europe-west1')
  .pubsub.schedule('0 2 * * *') // 2h du matin chaque jour (UTC)
  .timeZone('Europe/Paris')
  .onRun(async (context) => {
    const db = admin.firestore();
    const RETENTION_DAYS = 7;
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - RETENTION_DAYS);
    const cutoffTimestamp = admin.firestore.Timestamp.fromDate(cutoffDate);

    try {
      console.log(`🧹 [cleanupOldNotifications] Démarrage du nettoyage des notifications > ${RETENTION_DAYS} jours`);
      console.log(`📅 [cleanupOldNotifications] Cutoff date: ${cutoffDate.toISOString()}`);

      // Récupérer tous les users avec des notifications
      const usersRef = db.collectionGroup('items').parent;
      const usersSnapshot = await db.collectionGroup('items').get();

      if (usersSnapshot.empty) {
        console.log('✅ [cleanupOldNotifications] Aucune notification à nettoyer');
        return;
      }

      let deletedCount = 0;
      const batch = db.batch();
      let batchSize = 0;
      const MAX_BATCH_SIZE = 500;

      for (const docSnapshot of usersSnapshot.docs) {
        const notification = docSnapshot.data();
        const createdAt = notification.createdAt as admin.firestore.Timestamp;

        // Si la notification est plus vieille que RETENTION_DAYS, la supprimer
        if (createdAt && createdAt < cutoffTimestamp) {
          batch.delete(docSnapshot.ref);
          batchSize++;
          deletedCount++;

          // Commiter par batch de 500
          if (batchSize >= MAX_BATCH_SIZE) {
            await batch.commit();
            console.log(`📝 [cleanupOldNotifications] ${deletedCount} notifications supprimées (batch)`);
            batchSize = 0;
          }
        }
      }

      // Commiter les dernières modifications
      if (batchSize > 0) {
        await batch.commit();
      }

      console.log(`✅ [cleanupOldNotifications] Nettoyage terminé: ${deletedCount} notifications supprimées`);
      return { success: true, deletedCount };
    } catch (error) {
      console.error('❌ [cleanupOldNotifications] Erreur lors du nettoyage:', error);
      throw error;
    }
  });

/**
 * Cloud Function alternative: Nettoyer par utilisateur (moins coûteux)
 * 
 * À déclencher manuellement ou via Scheduler
 */
export const cleanupOldNotificationsOptimized = functions
  .region('europe-west1')
  .pubsub.schedule('0 3 * * *') // 3h du matin chaque jour
  .timeZone('Europe/Paris')
  .onRun(async (context) => {
    const db = admin.firestore();
    const RETENTION_DAYS = 7;
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - RETENTION_DAYS);
    const cutoffTimestamp = admin.firestore.Timestamp.fromDate(cutoffDate);

    try {
      console.log(`🧹 [cleanupOldNotificationsOptimized] Démarrage (optimisé)`);

      // Parcourir chaque utilisateur dans la collection 'notifications'
      const notificationsRef = db.collection('notifications');
      const usersSnapshot = await notificationsRef.get();

      let totalDeleted = 0;

      for (const userDoc of usersSnapshot.docs) {
        const userId = userDoc.id;
        const itemsRef = db.collection('notifications').doc(userId).collection('items');
        const oldNotificationsQuery = itemsRef.where('createdAt', '<', cutoffTimestamp);
        const oldNotificationsSnapshot = await oldNotificationsQuery.get();

        if (oldNotificationsSnapshot.empty) {
          continue;
        }

        const batch = db.batch();
        let batchSize = 0;

        for (const notifDoc of oldNotificationsSnapshot.docs) {
          batch.delete(notifDoc.ref);
          batchSize++;
          totalDeleted++;

          if (batchSize >= 100) {
            await batch.commit();
            batchSize = 0;
          }
        }

        if (batchSize > 0) {
          await batch.commit();
        }

        console.log(`📝 [cleanupOldNotificationsOptimized] ${oldNotificationsSnapshot.size} notifs supprimées pour ${userId}`);
      }

      console.log(`✅ [cleanupOldNotificationsOptimized] Total: ${totalDeleted} notifications supprimées`);
      return { success: true, totalDeleted };
    } catch (error) {
      console.error('❌ [cleanupOldNotificationsOptimized] Erreur:', error);
      throw error;
    }
  });
