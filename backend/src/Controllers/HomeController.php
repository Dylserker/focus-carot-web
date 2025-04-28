<?php 

namespace App\Controllers;

use App\Models\Users;

class HomeController extends BaseController {
    
    public function index() {
        return $this->render('home', [
            'nom' => 'Julien',
            'users' => Users::getAll()
        ]);
    }
}