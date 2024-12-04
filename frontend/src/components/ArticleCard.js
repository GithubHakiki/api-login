import React from 'react';

const ArticleCard = ({ article }) => (
  <div className="article-card">
    <h3>{article.title}</h3>
    <p>{article.abstract}</p>
  </div>
);

export default ArticleCard;
