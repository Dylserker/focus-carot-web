<?php
        namespace App\Controllers;

        use App\Entity\User;
        use Doctrine\ORM\EntityManagerInterface;
        use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
        use Symfony\Component\HttpFoundation\JsonResponse;
        use Symfony\Component\HttpFoundation\Request;
        use Symfony\Component\Routing\Annotation\Route;

        #[Route('/api/users', name: 'api_users_')]
        class UserController extends AbstractController
        {
            private $entityManager;

            public function __construct(EntityManagerInterface $entityManager)
            {
                $this->entityManager = $entityManager;
            }

            #[Route('', name: 'index', methods: ['GET'])]
            public function index(): JsonResponse
            {
                $users = $this->entityManager->getRepository(User::class)->findAll();
                return new JsonResponse(['data' => $users]);
            }

            #[Route('/{id}', name: 'show', methods: ['GET'])]
            public function show($id): JsonResponse
            {
                $user = $this->entityManager->getRepository(User::class)->find($id);
                if (!$user) {
                    return new JsonResponse(['error' => 'Utilisateur non trouvé'], 404);
                }
                return new JsonResponse(['data' => $user]);
            }

            #[Route('', name: 'create', methods: ['POST'])]
            public function create(Request $request): JsonResponse
            {
                $data = json_decode($request->getContent(), true);
                $user = new User();
                $user->setPseudo($data['pseudo']);
                $user->setNom($data['nom']);
                $user->setPrenom($data['prenom']);
                $user->setTitre($data['titre'] ?? null);
                $user->setPhoto($data['photo'] ?? null);

                $this->entityManager->persist($user);
                $this->entityManager->flush();

                return new JsonResponse(['data' => $user], 201);
            }

            #[Route('/{id}', name: 'update', methods: ['PUT'])]
            public function update($id, Request $request): JsonResponse
            {
                $user = $this->entityManager->getRepository(User::class)->find($id);
                if (!$user) {
                    return new JsonResponse(['error' => 'Utilisateur non trouvé'], 404);
                }

                $data = json_decode($request->getContent(), true);
                $user->setPseudo($data['pseudo'] ?? $user->getPseudo());
                $user->setNom($data['nom'] ?? $user->getNom());
                $user->setPrenom($data['prenom'] ?? $user->getPrenom());
                $user->setTitre($data['titre'] ?? $user->getTitre());
                $user->setPhoto($data['photo'] ?? $user->getPhoto());

                $this->entityManager->flush();

                return new JsonResponse(['data' => $user]);
            }

            #[Route('/{id}', name: 'delete', methods: ['DELETE'])]
            public function delete($id): JsonResponse
            {
                $user = $this->entityManager->getRepository(User::class)->find($id);
                if (!$user) {
                    return new JsonResponse(['error' => 'Utilisateur non trouvé'], 404);
                }

                $this->entityManager->remove($user);
                $this->entityManager->flush();

                return new JsonResponse(null, 204);
            }
        }