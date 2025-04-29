<?php

require_once __DIR__ . '/vendor/autoload.php';

$host = 'localhost';
$dbname = 'focus_carot_web';
$user = 'root';
$password = '';

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8mb4", $user, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    echo "Connexion à la base de données réussie.\n";
} catch (PDOException $e) {
    die("Erreur de connexion à la base de données: " . $e->getMessage());
}

$faker = Faker\Factory::create('fr_FR');

$numberOfUsers = 5;

echo "Création de $numberOfUsers utilisateurs...\n";

for ($i = 0; $i < $numberOfUsers; $i++) {
    $email = $faker->unique()->safeEmail();
    $password = password_hash('password123', PASSWORD_DEFAULT);
    $username = $faker->userName();
    $role = $faker->randomElement(['admin', 'parent', 'enfant', 'user']);
    $avatarUrl = $faker->imageUrl(150, 150, 'people');

    $stmt = $pdo->prepare("
        INSERT INTO users (email, password, username, role, avatar_url) 
        VALUES (:email, :password, :username, :role, :avatar_url)
    ");
    
    $stmt->execute([
        ':email' => $email,
        ':password' => $password,
        ':username' => $username,
        ':role' => $role,
        ':avatar_url' => $avatarUrl
    ]);
    
    $userId = $pdo->lastInsertId();

    $firstName = $faker->firstName();
    $lastName = $faker->lastName();
    $dateOfBirth = $faker->date('Y-m-d', '-10 years');
    $gender = $faker->randomElement(['homme', 'femme', 'autre', 'non_specifie']);
    $bio = $faker->text(200);

    $stmt = $pdo->prepare("
        INSERT INTO user_profiles (user_id, first_name, last_name, date_of_birth, gender, bio) 
        VALUES (:user_id, :first_name, :last_name, :date_of_birth, :gender, :bio)
    ");
    
    $stmt->execute([
        ':user_id' => $userId,
        ':first_name' => $firstName,
        ':last_name' => $lastName,
        ':date_of_birth' => $dateOfBirth,
        ':gender' => $gender,
        ':bio' => $bio
    ]);

    $level = $faker->numberBetween(1, 10);
    $experiencePoints = $faker->numberBetween(0, 1000);
    $totalExperienceEarned = $experiencePoints + $faker->numberBetween(0, 2000);
    $currentStreak = $faker->numberBetween(0, 30);
    $longestStreak = $faker->numberBetween($currentStreak, 100);
    $lastActivityDate = $faker->dateTimeThisMonth()->format('Y-m-d');

    $stmt = $pdo->prepare("
        INSERT INTO user_progression 
        (user_id, level, experience_points, total_experience_earned, current_streak, longest_streak, last_activity_date) 
        VALUES 
        (:user_id, :level, :exp_points, :total_exp, :current_streak, :longest_streak, :last_activity)
    ");
    
    $stmt->execute([
        ':user_id' => $userId,
        ':level' => $level,
        ':exp_points' => $experiencePoints,
        ':total_exp' => $totalExperienceEarned,
        ':current_streak' => $currentStreak,
        ':longest_streak' => $longestStreak,
        ':last_activity' => $lastActivityDate
    ]);

    $notificationsEnabled = $faker->boolean(80);
    $theme = $faker->randomElement(['default', 'dark', 'light', 'colorful']);
    $language = $faker->randomElement(['fr', 'en', 'es', 'de']);
    $dailyGoal = $faker->numberBetween(1, 10);

    $stmt = $pdo->prepare("
        INSERT INTO settings
        (user_id, notifications_enabled, theme, language, daily_goal)
        VALUES
        (:user_id, :notifications, :theme, :language, :daily_goal)
    ");
    
    $stmt->execute([
        ':user_id' => $userId,
        ':notifications' => $notificationsEnabled,
        ':theme' => $theme,
        ':language' => $language,
        ':daily_goal' => $dailyGoal
    ]);
    
    echo "Utilisateur créé: $username (ID: $userId) - $email\n";
}

echo "\nTerminé ! $numberOfUsers utilisateurs ont été créés avec succès.\n";
echo "Vous pouvez maintenant vous connecter avec l'un des emails générés et le mot de passe 'password123'.\n";
?>
