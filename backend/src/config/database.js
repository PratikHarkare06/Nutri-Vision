const mongoose = require("mongoose");
const { env } = require("./env");

let connectionPromise = null;

const connectToDatabase = async () => {
  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  if (!connectionPromise) {
    connectionPromise = mongoose
      .connect(env.mongoUri)
      .then(async () => {
        // Obsolete index cleanup to prevent duplicate key errors
        try {
          const collections = await mongoose.connection.db.listCollections().toArray();
          if (collections.some(c => c.name === "users")) {
            const usersColl = mongoose.connection.db.collection("users");
            const indexes = await usersColl.indexes();
            if (indexes.some(idx => idx.name === "userId_1")) {
              await usersColl.dropIndex("userId_1");
              console.log("🧹 Successfully dropped obsolete index 'userId_1' on users collection.");
            }
          }
        } catch (err) {
          console.warn("⚠️ Index cleanup skipped:", err.message);
        }
        return mongoose.connection;
      })
      .catch((error) => {
        connectionPromise = null;
        throw error;
      });
  }

  return connectionPromise;
};

module.exports = { connectToDatabase };
