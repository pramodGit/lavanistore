
let users = [
  {
    id: 1,
    username: "pramod123",
    email: "pramod@example.com",
    passwordHash: "$2b$10$abcdefghijklmnopqrstuv", // dummy bcrypt hash
    passwordChanged: false,
    fullName: "Pramod Kumar",
    phone: "9999999999",
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

export const getAll = () => users;

export const getById = (id) => users.find(u => u.id === Number(id));

export const create = (user) => {
  user.id = users.length + 1;
  user.createdAt = new Date();
  user.updatedAt = new Date();
  users.push(user);
  return user;
};

export const update = (id, updates) => {
  const idx = users.findIndex((u) => u.id === Number(id));
  if (idx === -1) return null;
  users[idx] = { ...users[idx], ...updates, updatedAt: new Date() };
  return users[idx];
};

export const deleteUser = (id) => {
  const idx = users.findIndex((u) => u.id === Number(id));
  if (idx === -1) return null;
  const deleted = users[idx];
  users.splice(idx, 1);
  return deleted;
};

