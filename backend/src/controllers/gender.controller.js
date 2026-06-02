import {
  createGender,
  getAllGenders,
  getGenderById,
  updateGender,
  deleteGender,
} from "../services/gender.service.js";

export const createGenderController = async (req, res) => {
  try {
    const gender = await createGender(req.body);
    res.status(201).json(gender);
  } catch (error) {
    res.status(500).json({
      message: "Error creating gender",
      error: error.message,
    });
  }
};

export const getAllGendersController = async (req, res) => {
  try {
    const genders = await getAllGenders();
    res.status(200).json(genders);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching genders",
      error: error.message,
    });
  }
};

export const getGenderByIdController = async (req, res) => {
  try {
    const gender = await getGenderById(req.params.id);

    if (!gender) {
      return res.status(404).json({
        message: "Gender not found",
      });
    }

    res.status(200).json(gender);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching gender",
      error: error.message,
    });
  }
};

export const updateGenderController = async (req, res) => {
  try {
    const gender = await updateGender(Number(req.params.id),
  req.body
  );

    res.status(200).json(gender);
  } catch (error) {
    res.status(500).json({
      message: "Error updating gender",
      error: error.message,
    });
  }
};

export const deleteGenderController = async (req, res) => {
  try {
    await deleteGender(Number(req.params.id));

    res.status(200).json({
      message: "Gender deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Error deleting gender",
      error: error.message,
    });
  }
};