const mongoose = require('mongoose');
const User = require('../models/User');

// Configuration MongoDB
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/focus_carot';

async function testAdminRoute() {
  try {
    // Connexion à MongoDB
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connecté à MongoDB');

    // Créer un utilisateur admin de test
    console.log('\n🔧 Création d\'un utilisateur admin...');
    const adminUser = new User({
      email: 'admin@test.com',
      username: 'admin_test',
      firstName: 'Admin',
      lastName: 'Test',
      password: 'password123',
      role: 'admin'
    });
    await adminUser.save();
    console.log('✅ Utilisateur admin créé:', adminUser._id);

    // Test de création d'un utilisateur normal
    console.log('\n👤 Test de création d\'un utilisateur normal...');
    const normalUser = new User({
      email: 'user@test.com',
      username: 'user_test',
      firstName: 'User',
      lastName: 'Test',
      password: 'password123',
      role: 'user'
    });
    await normalUser.save();
    console.log('✅ Utilisateur normal créé:', normalUser._id);

    // Vérifier que les utilisateurs existent
    const allUsers = await User.find().select('-password');
    console.log('\n📋 Utilisateurs dans la base:');
    allUsers.forEach(user => {
      console.log(`- ${user.username} (${user.email}) - Rôle: ${user.role}`);
    });

    console.log('\n🎉 Test terminé avec succès !');

  } catch (error) {
    console.error('❌ Erreur lors du test:', error);
  } finally {
    await mongoose.disconnect();
    console.log('\n🔌 Déconnecté de MongoDB');
  }
}

// Exécuter les tests
testAdminRoute(); 