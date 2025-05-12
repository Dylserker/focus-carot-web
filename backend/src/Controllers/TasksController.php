<?php
namespace App\Controllers;

use App\Models\Task;
use App\Core\Response;

class TasksController {
    private Task $taskModel;

    public function __construct() {
        $this->taskModel = new Task();
    }

    public function create(): Response {
        $data = json_decode(file_get_contents('php://input'), true);
        $taskId = $this->taskModel->create($data);

        if ($taskId) {
            return (new Response())->setBody([
                'success' => true,
                'task' => [
                    'id' => $taskId,
                    'title' => $data['title'],
                    'description' => $data['description'],
                    'status' => $data['status'],
                    'due_date' => $data['due_date'],
                    'priority' => $data['priority'],
                    'user_id' => $data['user_id']
                ]
            ]);
        }

        return (new Response())
            ->setBody(['error' => 'Erreur lors de la création de la tâche'])
            ->setStatusCode(500);
    }

    private function calculateExperienceReward(string $priority): int {
        return match($priority) {
            'low', 'basse' => 10,
            'medium', 'moyenne' => 25,
            'high', 'haute' => 50,
            default => 10
        };
    }

    public function getUserTasks($userId): Response {
        $tasks = $this->taskModel->getTasksByUserId($userId);
        if ($tasks) {
            return (new Response())->setBody([
                'success' => true,
                'tasks' => $tasks
            ]);
        }
        return (new Response())
            ->setBody(['error' => 'Erreur lors de la récupération des tâches'])
            ->setStatusCode(500);
    }

    public function update($taskId): Response {
        $data = json_decode(file_get_contents('php://input'), true);
        
        // Récupérer l'ancienne tâche pour vérifier le changement de statut
        $oldTask = $this->taskModel->getById($taskId);
        $updated = $this->taskModel->update($taskId, $data);
    
        if ($updated) {
            // Vérifier si la tâche est passée au statut "terminée"
            if ($oldTask && $oldTask['status'] !== 'terminée' && $data['status'] === 'terminée') {
                // Attribuer de l'expérience à l'utilisateur si la tâche est terminée
                try {
                    $userId = $data['user_id'];
                    $priority = $data['priority'];
                    
                    // Calculer l'expérience à donner en fonction de la priorité
                    $experienceReward = $this->calculateExperienceReward($priority);
                    
                    // Mettre à jour l'expérience de l'utilisateur
                    $userModel = new \App\Models\User();
                    $userModel->updateExperience($userId, $experienceReward);
                } catch (\Exception $e) {
                    // Logger l'erreur mais ne pas empêcher la mise à jour de la tâche
                    error_log('Erreur lors de l\'attribution d\'expérience: ' . $e->getMessage());
                }
            }
            
            return (new Response())->setBody([
                'success' => true,
                'message' => 'Tâche mise à jour'
            ]);
        }

        return (new Response())
            ->setBody(['error' => 'Erreur lors de la mise à jour'])
            ->setStatusCode(500);
    }

    public function delete($taskId): Response {
        $deleted = $this->taskModel->delete($taskId);

        if ($deleted) {
            return (new Response())->setBody([
                'success' => true,
                'message' => 'Tâche supprimée'
            ]);
        }

        return (new Response())
            ->setBody(['error' => 'Erreur lors de la suppression'])
            ->setStatusCode(500);
    }
}