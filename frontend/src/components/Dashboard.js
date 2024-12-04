import React from 'react';
import ArticleCard from './ArticleCard';
import ChangeUserDetail from './ChangeUserDetail'; // Impor komponen ChangeUserDetail

const Dashboard = ({
  user,
  articles,
  currentArticleIndex,
  nextArticle,
  prevArticle,
  handleLogout,
  setStep,
}) => (
  <div className="dashboard">
    <h1>Welcome, {user?.username}</h1>
    <p>You are now logged in</p>

    <div className="articles">
      <h2>Articles</h2>
      {articles && articles.length > 0 ? (
        <>
          <ArticleCard article={articles[currentArticleIndex]} />
          <div className="article-navigation">
            <button onClick={prevArticle} disabled={currentArticleIndex === 0}>
              Previous
            </button>
            <button
              onClick={nextArticle}
              disabled={currentArticleIndex === articles.length - 1}
            >
              Next
            </button>
          </div>
        </>
      ) : (
        <p>No articles available</p>
      )}
    </div>

    <div className="user-actions">
      <button onClick={() => setStep(5)} className="change-details-btn">
        Change Username/Password
      </button>
    </div>

    <button className="logout-btn" onClick={handleLogout}>
      Logout
    </button>
  </div>
);

export default Dashboard;
