import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const testConnection = async () => {
    try {
        console.log('🔄 Attempting to connect to MongoDB...\n');

        await mongoose.connect(process.env.MONGODB_URI);

        console.log('✅ MongoDB Connected Successfully!\n');
        console.log('📊 Database Name:', mongoose.connection.name);
        console.log('🌐 Host:', mongoose.connection.host);
        console.log('🔌 Connection State:', mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected');

        // List all collections
        const collections = await mongoose.connection.db.listCollections().toArray();

        if (collections.length > 0) {
            console.log('\n📁 Collections in database:');
            collections.forEach(col => {
                console.log(`   - ${col.name}`);
            });
        } else {
            console.log('\n📁 No collections found (database is empty)');
            console.log('💡 Run "node seed.js" to populate with sample data');
        }

        // Get database stats
        const stats = await mongoose.connection.db.stats();
        console.log('\n📈 Database Statistics:');
        console.log(`   - Collections: ${stats.collections}`);
        console.log(`   - Data Size: ${(stats.dataSize / 1024).toFixed(2)} KB`);
        console.log(`   - Indexes: ${stats.indexes}`);

        console.log('\n🎉 Connection test successful!');

        await mongoose.connection.close();
        console.log('👋 Connection closed');
        process.exit(0);

    } catch (error) {
        console.error('❌ MongoDB Connection Error:\n');
        console.error('Error Message:', error.message);

        if (error.message.includes('authentication failed')) {
            console.error('\n💡 Troubleshooting:');
            console.error('   1. Check username and password in MONGODB_URI');
            console.error('   2. Verify database user exists in MongoDB Atlas');
            console.error('   3. Ensure password is URL-encoded (special characters)');
        } else if (error.message.includes('ENOTFOUND') || error.message.includes('timeout')) {
            console.error('\n💡 Troubleshooting:');
            console.error('   1. Check internet connection');
            console.error('   2. Verify cluster address in MONGODB_URI');
            console.error('   3. Check if IP is whitelisted in MongoDB Atlas Network Access');
        }

        process.exit(1);
    }
};

console.log('🧪 MongoDB Connection Test\n');
console.log('Using connection string from .env file');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

testConnection();
