const express = require('express');
const router = express.Router();
const AchievementService = require('../services/achievementService');
const authMiddleware = require('../middleware/authMiddleware');

// Obtenir tous les succès avec le progrès de l'utilisateur
router.get('/user-progress', authMiddleware, async (req, res) => {
  try {
    const achievements = await AchievementService.getUserAchievementsWithProgress(req.user._id);
    res.json({
      success: true,
      data: achievements
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des succès:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des succès'
    });
  }
});

// Obtenir les statistiques des succès de l'utilisateur
router.get('/stats', authMiddleware, async (req, res) => {
  try {
    const stats = await AchievementService.getUserAchievementStats(req.user._id);
    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des statistiques:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des statistiques'
    });
  }
});

// Vérifier et débloquer tous les succès pour l'utilisateur
router.post('/check-all', authMiddleware, async (req, res) => {
  try {
    const result = await AchievementService.checkAllAchievements(req.user._id);
    res.json({
      success: true,
      data: result,
      message: `${result.total} nouveau(x) succès débloqué(s) !`
    });
  } catch (error) {
    console.error('Erreur lors de la vérification des succès:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la vérification des succès'
    });
  }
});

// Vérifier spécifiquement les succès de tâches
router.post('/check-tasks', authMiddleware, async (req, res) => {
  try {
    const achievements = await AchievementService.checkTaskCompletionAchievements(req.user._id);
    res.json({
      success: true,
      data: achievements,
      message: `${achievements.length} succès de tâches débloqué(s) !`
    });
  } catch (error) {
    console.error('Erreur lors de la vérification des succès de tâches:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la vérification des succès de tâches'
    });
  }
});

// Vérifier spécifiquement les succès de niveau
router.post('/check-levels', authMiddleware, async (req, res) => {
  try {
    const achievements = await AchievementService.checkLevelAchievements(req.user._id);
    res.json({
      success: true,
      data: achievements,
      message: `${achievements.length} succès de niveau débloqué(s) !`
    });
  } catch (error) {
    console.error('Erreur lors de la vérification des succès de niveau:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la vérification des succès de niveau'
    });
  }
});

// Vérifier spécifiquement les succès de streak
router.post('/check-streaks', authMiddleware, async (req, res) => {
  try {
    const achievements = await AchievementService.checkStreakAchievements(req.user._id);
    res.json({
      success: true,
      data: achievements,
      message: `${achievements.length} succès de streak débloqué(s) !`
    });
  } catch (error) {
    console.error('Erreur lors de la vérification des succès de streak:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la vérification des succès de streak'
    });
  }
});

module.exports = router; 