const fetch = require('node-fetch');

async function testServer() {
  const baseURL = 'http://localhost:5000/api';
  
  console.log('🔍 Test de connexion au serveur backend...');
  
  try {
    // Test 1: Vérifier si le serveur répond
    console.log('\n1️⃣ Test de connexion de base...');
    const response = await fetch(`${baseURL}/health`);
    if (response.ok) {
      console.log('✅ Serveur accessible');
    } else {
      console.log('⚠️ Serveur répond mais pas de route /health');
    }
  } catch (error) {
    console.log('❌ Serveur non accessible:', error.message);
    console.log('💡 Assurez-vous que le backend est démarré sur le port 5000');
    return;
  }

  try {
    // Test 2: Test de la route /users (sans auth)
    console.log('\n2️⃣ Test de la route /users (sans authentification)...');
    const response = await fetch(`${baseURL}/users`);
    if (response.status === 401) {
      console.log('✅ Route /users accessible (auth requise comme attendu)');
    } else {
      console.log(`⚠️ Route /users répond avec le statut: ${response.status}`);
    }
  } catch (error) {
    console.log('❌ Erreur lors du test de /users:', error.message);
  }

  try {
    // Test 3: Test de la route /auth/login
    console.log('\n3️⃣ Test de la route /auth/login...');
    const response = await fetch(`${baseURL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: 'test@test.com',
        password: 'password123'
      })
    });
    
    if (response.status === 401) {
      console.log('✅ Route /auth/login accessible (credentials invalides comme attendu)');
    } else {
      console.log(`⚠️ Route /auth/login répond avec le statut: ${response.status}`);
    }
  } catch (error) {
    console.log('❌ Erreur lors du test de /auth/login:', error.message);
  }

  console.log('\n🎯 Résumé:');
  console.log('- Si vous voyez des ✅, le serveur fonctionne correctement');
  console.log('- Si vous voyez des ❌, le serveur n\'est pas démarré ou il y a un problème');
  console.log('- Démarrez le serveur avec: npm start dans le dossier backend');
}

testServer(); 