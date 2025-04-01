const express = require("express");
const cors = require("cors");
const Recipe = require("./models/recipe.models");
const { initialiseDatabase } = require("./db/db.connect");
require("dotenv").config();

initialiseDatabase();
const app = express();
app.use(express.json());
app.use(cors());

const createRecipe = async (recipeData) => {
  try {
    const newRecipe = new Recipe(recipeData);
    const savedRecipe = await newRecipe.save();
    return savedRecipe;
  } catch (error) {
    throw error;
  }
};

app.post("/recipes", async (req, res) => {
  try {
    const recipeData = req.body;
    const newRecipe = await createRecipe(recipeData);
    if (newRecipe) {
      res
        .status(201)
        .json({ message: "Recipe added successfully.", newRecipe: newRecipe });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to add recipe!" });
  }
});

const readAllRecipes = async () => {
  try {
    const allRecipes = await Recipe.find();
    return allRecipes;
  } catch (error) {
    throw error;
  }
};

app.get("/recipes", async (req, res) => {
  try {
    const allRecipes = await readAllRecipes();
    allRecipes.length > 0
      ? res.json(allRecipes)
      : res.status(404).json({ error: "No recipe found!" });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch recipes!" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});
