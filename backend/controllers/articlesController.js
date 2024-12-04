const connection = require('../db');  // Pastikan path ke database sudah benar

// Fungsi untuk mendapatkan artikel
const getArticles = (req, res) => {
  const query = `
    SELECT article_id, title, author, source_name, publication_date, abstract, category, source_type, url, created_at
    FROM articles
  `;

  connection.query(query, (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: 'Database query failed' });
    }

    res.status(200).json(results);
  });
};

module.exports = {
  getArticles
};
