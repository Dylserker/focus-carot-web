<?php
namespace App\Controllers;

use App\Models\Success;
use App\Core\Response;

class SuccessController
{
    private Success $successModel;

    public function __construct()
    {
        $this->successModel = new Success();
    }

    public function create(): Response
    {
        $data = json_decode(file_get_contents('php://input'), true);
        $successId = $this->successModel->create($data);

        if ($successId) {
            return (new Response())->setBody([
                'success' => true,
                'achievement' => [
                    'id' => $successId,
                    'name' => $data['name'],
                    'description' => $data['description'],
                    'icon_url' => $data['icon_url'],
                    'experience_reward' => $data['experience_reward'],
                    'required_value' => $data['required_value'],
                    'achievement_type' => $data['achievement_type'],
                ]
            ]);
        }

        return (new Response())
            ->setBody(['error' => 'Erreur lors de la création du succès'])
            ->setStatusCode(500);
    }

    public function getAllAchievements(): Response {
        try {
            $achievements = $this->successModel->getAllAchievements();

            return (new Response())->setBody([
                'success' => true,
                'achievements' => $achievements
            ]);
        } catch (\Exception $e) {
            return (new Response())
                ->setBody(['error' => 'Erreur lors de la récupération des succès'])
                ->setStatusCode(500);
        }
    }

    public function getUserAchievements(int $userId): Response {
        try {
            $unlockedAchievements = $this->successModel->getUnlockedAchievements($userId);

            if ($unlockedAchievements !== null) {
                $unlockedIds = array_map(function($achievement) {
                    return $achievement['achievement_id'];
                }, $unlockedAchievements);

                return (new Response())->setBody([
                    'success' => true,
                    'achievements' => $unlockedIds
                ]);
            }

            return (new Response())
                ->setBody(['error' => 'Erreur lors de la récupération des succès'])
                ->setStatusCode(500);
        } catch (\Exception $e) {
            return (new Response())
                ->setBody(['error' => $e->getMessage()])
                ->setStatusCode(500);
        }
    }

    public function unlockAchievement($userId, $achievementId): array {
        try {
            $result = $this->successModel->unlockAchievement($userId, $achievementId);
            if ($result) {
                return ['success' => true, 'message' => 'Succès débloqué'];
            }
            return ['error' => 'Impossible de débloquer le succès'];
        } catch (\Exception $e) {
            return ['error' => 'Erreur lors du déblocage du succès'];
        }
    }

    public function lockAchievement($userId, $achievementId): array {
        try {
            $result = $this->successModel->lockAchievement($userId, $achievementId);
            if ($result) {
                return ['success' => true, 'message' => 'Succès bloqué'];
            }
            return ['error' => 'Impossible de bloquer le succès'];
        } catch (\Exception $e) {
            return ['error' => 'Erreur lors du blocage du succès'];
        }
    }
}