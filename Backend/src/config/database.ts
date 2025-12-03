import mysql from 'mysql2/promise';

export class Database {
  private static pool: mysql.Pool | null = null;

  static async getConnection(): Promise<mysql.PoolConnection> {
    if (!this.pool) {
      this.pool = mysql.createPool({
        host: process.env.DB_HOST || 'localhost',
        port: parseInt(process.env.DB_PORT || '3306'),
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || '',
        database: process.env.DB_NAME || 'immobilier_db',
        waitForConnections: true,
        connectionLimit: 10
      });
      
      await this.createTables();
      console.log('✅ Connected to MySQL database');
    }
    
    return this.pool.getConnection();
  }

  static async createTables() {
    const connection = await this.getConnection();
    
    try {
      // Table des propriétés
      await connection.execute(`
        CREATE TABLE IF NOT EXISTS properties (
          id VARCHAR(36) PRIMARY KEY,
          title VARCHAR(200) NOT NULL,
          city VARCHAR(100) NOT NULL,
          price DECIMAL(12,2) NOT NULL,
          surface INT NOT NULL,
          bedrooms INT,
          bathrooms INT,
          type VARCHAR(50) NOT NULL,
          image_url VARCHAR(500),
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `);

      // Table des favoris
      await connection.execute(`
        CREATE TABLE IF NOT EXISTS favorites (
          id VARCHAR(36) PRIMARY KEY,
          property_id VARCHAR(36) NOT NULL,
          user_id VARCHAR(100) NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (property_id) REFERENCES properties(id) ON DELETE CASCADE,
          UNIQUE KEY unique_user_property (user_id, property_id)
        )
      `);

      console.log('✅ Tables created successfully');
    } finally {
      connection.release();
    }
  }

  static async close() {
    if (this.pool) {
      await this.pool.end();
      console.log('🔌 Database connection closed');
    }
  }
}