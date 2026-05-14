import {
  getAllRoles,
  createRole,
  updateRole,
  deleteRole,
} from "../services/role.service.js";

export const getRolesController = async (req, res) => {
  try {
    const roles = await getAllRoles();
    res.status(200).json(roles);
  } catch (error) {
    res.status(500).json({ message: "Error fetching roles" });
  }
};

export const createRoleController = async (req, res) => {
  try {
    const role = await createRole(req.body);
    res.status(201).json(role);
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: "Error creating role" });
  }
};

export const updateRoleController = async (req, res) => {
  try {
    const role = await updateRole(req.params.id, req.body);
    res.status(200).json(role);
  } catch (error) {
    res.status(400).json({ message: "Error updating role" });
  }
};

export const deleteRoleController = async (req, res) => {
  try {
    await deleteRole(req.params.id);
    res.status(200).json({ message: "Role deleted successfully" });
  } catch (error) {
    res.status(400).json({ message: "Error deleting role" });
  }
};
