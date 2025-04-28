<?php
namespace App\Controllers;

use App\Core\Request;
use App\Core\Response;

class ExampleApiController extends ApiController {
    
    public function getItems(): Response {
        $items = [
            ['id' => 1, 'name' => 'Item 1'],
            ['id' => 2, 'name' => 'Item 2'],
            ['id' => 3, 'name' => 'Item 3']
        ];
        
        return $this->success($items);
    }
    
    public function getItem(int $id): Response {
        $item = ['id' => $id, 'name' => 'Item ' . $id];
        
        return $this->success($item);
    }
    
    public function createItem(): Response {
        $data = $this->request->getJsonData();
        
        if (empty($data['name'])) {
            return $this->error('Le nom est requis');
        }
        
        $newItem = [
            'id' => rand(100, 999),
            'name' => $data['name'],
            'created' => date('Y-m-d H:i:s')
        ];
        
        return $this->success($newItem, 201);
    }
    
    public function updateItem(int $id): Response {
        $data = $this->request->getJsonData();
        
        if (empty($data['name'])) {
            return $this->error('Le nom est requis');
        }
        
        $updatedItem = [
            'id' => $id,
            'name' => $data['name'],
            'updated' => date('Y-m-d H:i:s')
        ];
        
        return $this->success($updatedItem);
    }
    
    public function deleteItem(int $id): Response {
        return $this->success(['message' => 'Item ' . $id . ' supprimé avec succès']);
    }
}
