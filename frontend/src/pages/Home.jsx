import React from "react";
import { useNavigate } from "react-router-dom"

const styles = `
        .home-page {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 40px 20px;
          background: linear-gradient(135deg, #fff7ed 0%, #fde68a 100%);
          font-family: Arial, Helvetica, sans-serif;
        }

        .home-card {
          max-width: 720px;
          width: 100%;
          text-align: center;
          background: rgba(255, 255, 255, 0.9);
          border: 1px solid rgba(255, 255, 255, 0.7);
          border-radius: 24px;
          padding: 56px 32px;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.12);
          backdrop-filter: blur(10px);
        }

        .home-eyebrow {
          margin: 0 0 12px;
          color: #f97316;
          font-size: 0.9rem;
          font-weight: 700;
          letter-spacing: 0.12em;
          text-transform: uppercase;
        }

        .home-card h1 {
          margin: 0;
          font-size: clamp(2.2rem, 5vw, 4rem);
          color: #1f2937;
          line-height: 1.1;
        }

        .home-text {
          margin: 18px auto 0;
          max-width: 560px;
          font-size: 1.1rem;
          line-height: 1.7;
          color: #4b5563;
        }

        .home-actions {
          display: flex;
          gap: 12px;
          justify-content: center;
          flex-wrap: wrap;
          margin-top: 32px;
        }

        .home-actions button {
          border: none;
          border-radius: 999px;
          padding: 14px 24px;
          font-size: 1rem;
          font-weight: 700;
          cursor: pointer;
          transition: transform 0.2s ease, box-shadow 0.2s ease, opacity 0.2s ease;
        }

        .home-actions button:hover {
          transform: translateY(-2px);
        }

        .primary-btn {
          background: #f97316;
          color: white;
          box-shadow: 0 10px 24px rgba(249, 115, 22, 0.3);
        }

        .secondary-btn {
          background: white;
          color: #1f2937;
          border: 1px solid #e5e7eb;
        }
      `;

const Home = () => {
  const navigate = useNavigate()

  return(
    <div className="home-page">
      <div className="home-card">
        <p className="home-eyebrow">Cook • Explore • Enjoy</p>
        <h1>Welcome to the World of Recipes</h1>
        <p className="home-text">
          Discover delicious dishes, save your favorites, and bring new flavors
          to your kitchen every day.
        </p>
        <div className="home-actions">
          <button className="primary-btn" onClick={() => navigate("/recipes")}>Explore Recipes</button>
          <button className="secondary-btn">Get Inspired</button>
        </div>
      </div>

      <style>{styles}</style>
    </div>
  )
}
export default Home

