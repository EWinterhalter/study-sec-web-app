let users = [];

module.exports = {
  users,

  findByUsername(username) {
    return users.find(u => u.username === username);
  },

  findById(id) {
    return users.find(u => u.id === id);
  },

  create(user) {
    users.push(user);
    return user;
  }
};
