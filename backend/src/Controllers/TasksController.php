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
            'low' => 10,
            'medium' => 25,
            'high' => 50,
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
}