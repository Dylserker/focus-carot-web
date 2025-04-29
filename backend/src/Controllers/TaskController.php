<?php
namespace App\Controllers;

use App\Models\Task;
use App\Core\Response;

class TaskController {
    
    public function index() {
        $tasks = Task::findAll();
        return Response::json($tasks);
    }
    
    public function userTasks($userId) {
        $tasks = Task::findByUserId($userId);
        return Response::json($tasks);
    }
    
    public function show($id) {
        $task = Task::findById($id);
        
        if (!$task) {
            return Response::error('Tâche non trouvée', 404);
        }
        
        return Response::json($task);
    }
    
    public function create($requestData) {
        if (!isset($requestData['user_id']) || !isset($requestData['title'])) {
            return Response::error('ID utilisateur et titre requis', 400);
        }
        
        $task = new Task();
        $task->setUser_id($requestData['user_id']);
        $task->setTitle($requestData['title']);
        
        if (isset($requestData['description'])) {
            $task->setDescription($requestData['description']);
        }
        
        if (isset($requestData['due_date'])) {
            $task->setDue_date($requestData['due_date']);
        }
        
        if (isset($requestData['priority'])) {
            $task->setPriority($requestData['priority']);
        }
        
        if (isset($requestData['experience_reward'])) {
            $task->setExperience_reward($requestData['experience_reward']);
        }
        
        $taskId = $task->save();
        $savedTask = Task::findById($taskId);
        
        return Response::json($savedTask, 201);
    }
    
    public function update($id, $requestData) {
        $task = Task::findById($id);
        
        if (!$task) {
            return Response::error('Tâche non trouvée', 404);
        }
        
        if (isset($requestData['title'])) {
            $task->setTitle($requestData['title']);
        }
        
        if (isset($requestData['description'])) {
            $task->setDescription($requestData['description']);
        }
        
        if (isset($requestData['status'])) {
            $task->setStatus($requestData['status']);

            if ($requestData['status'] === 'terminée' && $task->status !== 'terminée') {
                $task->markAsCompleted();
            }
        }
        
        if (isset($requestData['due_date'])) {
            $task->setDue_date($requestData['due_date']);
        }
        
        if (isset($requestData['priority'])) {
            $task->setPriority($requestData['priority']);
        }
        
        if (isset($requestData['experience_reward'])) {
            $task->setExperience_reward($requestData['experience_reward']);
        }
        
        $task->save();
        
        return Response::json($task);
    }
    
    public function complete($id) {
        $task = Task::findById($id);
        
        if (!$task) {
            return Response::error('Tâche non trouvée', 404);
        }
        
        $task->markAsCompleted();
        $task->save();
        
        return Response::json($task);
    }
    
    public function delete($id) {
        $task = Task::findById($id);
        
        if (!$task) {
            return Response::error('Tâche non trouvée', 404);
        }
        
        $task->delete();
        
        return Response::json(['message' => 'Tâche supprimée avec succès']);
    }
}
