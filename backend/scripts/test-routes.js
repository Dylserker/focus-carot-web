const BASE_URL = 'http://localhost:5000/api';

async function testRoutes() {
    try {
        console.log('🧪 Test des routes API...\n');

        // Test de santé
        console.log('1. Test route de santé...');
        const healthResponse = await fetch(`${BASE_URL}/health`);
        const healthData = await healthResponse.json();
        console.log('✅ Route de santé:', healthData);

        // Test des succès
        console.log('\n2. Test route des succès...');
        const achievementsResponse = await fetch(`${BASE_URL}/achievements`);
        const achievementsData = await achievementsResponse.json();
        console.log('✅ Route des succès:', achievementsData);
        console.log(`📊 Nombre de succès: ${achievementsData.achievements?.length || 0}`);

        // Test des utilisateurs (sans auth pour l'instant)
        console.log('\n3. Test route des utilisateurs...');
        try {
            const usersResponse = await fetch(`${BASE_URL}/users`);
            const usersData = await usersResponse.json();
            console.log('✅ Route des utilisateurs:', usersData);
        } catch (error) {
            console.log('❌ Route des utilisateurs (auth requise):', error.message);
        }

        console.log('\n🎉 Tests terminés !');

    } catch (error) {
        console.error('❌ Erreur lors des tests:', error.message);
        if (error.code === 'ECONNREFUSED') {
            console.log('💡 Le serveur backend n\'est pas démarré. Lancez "node server.js" dans le dossier backend.');
        }
    }
}

testRoutes(); 