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

const readRecipeByTitle = async (recipeTitle) => {
  try {
    const desiredRecipe = await Recipe.findOne({ title: recipeTitle });
    return desiredRecipe;
  } catch (error) {
    throw error;
  }
};

app.get("/recipes/:recipeTitle", async (req, res) => {
  try {
    const recipeTitle = req.params.recipeTitle;
    const recipe = await readRecipeByTitle(recipeTitle);
    recipe
      ? res.json(recipe)
      : res.status(404).json({ error: "Recipe not found!" });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch recipe!" });
  }
});

const readRecipesByAuthor = async (authorName) => {
  try {
    const desiredRecipes = await Recipe.find({ author: authorName });
    return desiredRecipes;
  } catch (error) {
    throw error;
  }
};

app.get("/recipes/author/:authorName", async (req, res) => {
  try {
    const authorName = req.params.authorName;
    const recipes = await readRecipesByAuthor(authorName);
    recipes.length > 0
      ? res.json(recipes)
      : res.status(404).json({ error: "No recipe found!" });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch recipes!" });
  }
});

const readRecipesByDifficulty = async (difficultyLevel) => {
  try {
    const desiredRecipes = await Recipe.find({ difficulty: difficultyLevel });
    return desiredRecipes;
  } catch (error) {
    throw error;
  }
};

app.get("/recipes/difficulty/:difficultyLevel", async (req, res) => {
  try {
    const difficultyLevel = req.params.difficultyLevel;
    const recipes = await readRecipesByDifficulty(difficultyLevel);
    recipes.length > 0
      ? res.json(recipes)
      : res.status(404).json({ error: "No recipe found!" });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch recipes!" });
  }
});

const updateRecipeById = async (recipeId, updateData) => {
  try {
    const updatedRecipe = await Recipe.findByIdAndUpdate(recipeId, updateData, {
      new: true,
    });
    return updatedRecipe;
  } catch (error) {
    console.log("Error updating recipe:", error);
  }
};

app.post("/recipes/:recipeId", async (req, res) => {
  try {
    const recipeId = req.params.recipeId;
    const updateData = req.body;
    const updatedRecipe = await updateRecipeById(recipeId, updateData);
    updatedRecipe
      ? res.json({ message: "Recipe updated successfully.", updatedRecipe })
      : res.status(404).json({ error: "Recipe not found!" });
  } catch (error) {
    res.status(500).json({ error: "Failed to update recipe!" });
  }
});

const updateRecipeByTitle = async (recipeTitle, updateData) => {
  try {
    const updatedRecipe = await Recipe.findOneAndUpdate(
      { title: recipeTitle },
      updateData,
      {
        new: true,
      }
    );
    return updatedRecipe;
  } catch (error) {
    console.log("Error updating recipe:", error);
  }
};

app.post("/recipes/title/:recipeTitle", async (req, res) => {
  try {
    const recipeTitle = req.params.recipeTitle;
    const updateData = req.body;
    const updatedRecipe = await updateRecipeByTitle(recipeTitle, updateData);
    updatedRecipe
      ? res.json({ message: "Recipe updated successfully.", updatedRecipe })
      : res.status(404).json({ error: "Recipe not found!" });
  } catch (error) {
    res.status(500).json({ error: "Failed to update recipe!" });
  }
});

const deleteRecipeById = async (recipeId) => {
  try {
    const deletedRecipe = await Recipe.findByIdAndDelete(recipeId);
    return deletedRecipe;
  } catch (error) {
    console.log("Error deleting recipe:", error);
  }
};

app.delete("/recipes/:recipeId", async (req, res) => {
  try {
    const recipeId = req.params.recipeId;
    const deletedRecipe = await deleteRecipeById(recipeId);
    deletedRecipe
      ? res.json({ message: "Recipe deleted successfully.", deletedRecipe })
      : res.status(404).json({ error: "Recipe not found!" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete recipe!" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});
