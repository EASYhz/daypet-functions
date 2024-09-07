const logger = require("firebase-functions/logger");
const { onDocumentCreated } = require("firebase-functions/v2/firestore");
const functions = require("firebase-functions");
const admin = require("firebase-admin");

admin.initializeApp();

exports.sendNotification = onDocumentCreated(
  "/Notification/{documentId}",
  async (event) => {
    try {
      const notificationData = event.data.data();

      const title = notificationData.title;
      const message = notificationData.message;
      const tokens = notificationData.receiverTokens;
      if (!tokens) return;
      const payload = {
        tokens: tokens,
        notification: {
          title: title,
          body: message,
        },
        data: {
          title: title,
          body: message,
          click_action: "daypet://notification",
        },
      };
      const response = await admin.messaging().sendEachForMulticast(payload);
      logger.debug("Successfully sent message:", response);
    } catch (err) {
      logger.error("Error sending message:", err);
    }
  }
);
