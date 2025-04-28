<?php

namespace App\Models;

class User {
    public function __construct(
        public string $id,
        public string $nom,
        public string $prenom,
        public int $age,
        public string $localisation,
    ){}
}