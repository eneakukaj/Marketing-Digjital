import prisma from "../../database/db.js";

export const getUsers = async (req, res) => {
  try {
    const users = await prisma.users.findMany({
      select: { id: true, emri: true, mbiemri: true, email: true, statusi: true }
    });
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: "Gathering users data failed" });
  }
};

export const createUser = async (req, res) => {
  try {
    const { emri, mbiemri, email, password_hash } = req.body;
    const newUser = await prisma.users.create({
      data: { emri, mbiemri, email, password_hash, statusi: 'aktiv' }
    });
    res.status(201).json(newUser);
  } catch (error) {
    res.status(400).json({ error: "Email already exists or invalid credentials" });
  }
};

export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { emri, mbiemri, email, statusi } = req.body;
    const updated = await prisma.users.update({
      where: { id: parseInt(id) },
      data: { emri, mbiemri, email,  statusi }
    });
    res.json(updated);
  } catch (error) {
    res.status(400).json({ error: "Update unsuccesful" });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.users.delete({ where: { id: parseInt(id) } });
    res.json({ message: "User deleted" });
  } catch (error) {
    res.status(400).json({ error: "Delete failed" });
  }
};
