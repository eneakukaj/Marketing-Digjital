import {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  changeUserRole
} from "../services/user.service.js";
import { createNotification } from "../services/notification.service.js";

export const getUsersController = async (req, res) => {
  try {
    const users = await getAllUsers();
    res.json(users);
  } catch (e) {
    res.status(500).json({ message: "Error" });
  }
};

export const getUserByIdController = async (req, res) => {
  try {
    const user = await getUserById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (e) {
    res.status(500).json({ message: "Error fetching user" });
  }
};

export const createUserController = async (req, res) => {
  try {
    const result = await createUser(req.body);

    await createNotification(
      req.user.id, 
      `User ${result.user.emri} was created successfully.`
    );
    
    res.status(201).json({
      message: "User created successfully",
      user: result.user,
      temporaryPassword: result.temporaryPassword
    });
  } catch (e) {
  res.status(400).json({ message: e.message });
}
};

export const updateUserController = async (req, res) => {
  try {
    const { id } = req.params; 
    if (!id) return res.status(400).json({ message: "ID missing" });

    const user = await updateUser(id, req.body);

    await createNotification(
      req.user.id,
      `User ${user.emri} ${user.mbiemri} (ID: #${id}) was updated successfully.`
    );

    res.json(user);
  } catch (e) {
    res.status(400).json({ message: "Update failed" });
  }
};

export const deleteUserController = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedUser = await deleteUser(id);

    await createNotification(
      req.user.id,
      `User ${deletedUser?.emri || ''} ${deletedUser?.mbiemri || ''} (ID: #${id}) was permanently deleted.`
    );
    res.json({ message: "Deleted" });
  } catch (e) {
    res.status(400).json({ message: "Delete failed" });
  }
};

export const changeUserRoleController = async (req, res) => {
  try {
    const { user_id, role_id } = req.body;
    const result = await changeUserRole(user_id, role_id);
    await createNotification(
      req.user.id,
      `Role for User ID #${user_id} was successfully updated to Role ID #${role_id}.`
    );
    res.json(result);
  } catch (e) {
    console.error("Role Assignment Error:", e.message);
    res.status(400).json({ message: "Role assignment failed" });
  }
};
