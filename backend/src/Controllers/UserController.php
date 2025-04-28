<?php
namespace App\Controllers;

use App\Models\User;
use App\Core\Response;

class UserController {

    public function index() {
        $users = User::findAll();

        return Response::json($users);
    }

    public function show($id) {
        $user = User::findById($id);

        if (!$user) {
            return Response::json(['error' => 'Utilisateur non trouvé'], 404);
        }

        return Response::json($user);
    }

    public function create($requestData) {
        $user = new User();
        $user->setEmail($requestData['email']);
        $user->setPassword($requestData['password']);
        $user->setUsername($requestData['username']);

        $userId = $user->save();

        $savedUser = User::findById($userId);

        return Response::json($savedUser, 201);
    }

    public function update($id, $requestData) {
        $user = User::findById($id);

        if (!$user) {
            return Response::json(['error' => 'Utilisateur non trouvé'], 404);
        }

        if (isset($requestData['email'])) {
            $user->setEmail($requestData['email']);
        }

        if (isset($requestData['password'])) {
            $user->setPassword($requestData['password']);
        }

        if (isset($requestData['username'])) {
            $user->setUsername($requestData['username']);
        }

        $user->save();

        return Response::json($user);
    }

    public function delete($id) {
        $user = User::findById($id);

        if (!$user) {
            return Response::json(['error' => 'Utilisateur non trouvé'], 404);
        }

        $user->delete();

        return Response::json(['message' => 'Utilisateur supprimé avec succès']);
    }
}