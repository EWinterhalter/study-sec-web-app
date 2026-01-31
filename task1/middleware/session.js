const activeSessions = new Map();

module.exports = function(userId, token) {
  const oldToken = activeSessions.get(userId);
  activeSessions.set(userId, token);
  return oldToken;
};
