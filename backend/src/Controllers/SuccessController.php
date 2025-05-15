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

    public function getAllAchievements(): Response
    {
        $achievements = $this->successModel->getAllAchievements();

        if ($achievements) {
            return (new Response())->setBody([
                'success' => true,
                'achievements' => $achievements
            ]);
        }

        return (new Response())
            ->setBody(['error' => 'Erreur lors de la récupération des succès'])
            ->setStatusCode(500);
    }
}