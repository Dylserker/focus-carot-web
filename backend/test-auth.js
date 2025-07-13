const mongoose = require('mongoose');
const User = require('./models/User');
const jwt = require('jsonwebtoken');
require('dotenv').config();

async function testAuth() {
  try {
    // Connexion à MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/focus_carot');
    console.log('Connecté à MongoDB');

    // Créer un utilisateur de test
    const testUser = new User({
      email: 'test@example.com',
      password: 'password123',
      username: 'testuser',
      firstName: 'Test',
      lastName: 'User',
      role: 'user'
    });

    await testUser.save();
    console.log('Utilisateur créé:', testUser._id);

    // Générer un token
    const token = jwt.sign(
      { 
        id: testUser._id, 
        email: testUser.email,
        role: testUser.role 
      },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    console.log('Token généré:', token);

    // Tester le token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Token décodé:', decoded);

    // Vérifier que l'utilisateur existe
    const user = await User.findById(decoded.id);
    console.log('Utilisateur trouvé:', user ? 'Oui' : 'Non');

    console.log('\n=== TEST COMPLET ===');
    console.log('User ID:', testUser._id);
    console.log('Token:', token);
    console.log('Pour tester: curl -H "Authorization: Bearer ' + token + '" http://localhost:5000/api/auth/verify');

  } catch (error) {
    console.error('Erreur:', error);
  } finally {
    await mongoose.disconnect();
  }
}

testAuth(); 