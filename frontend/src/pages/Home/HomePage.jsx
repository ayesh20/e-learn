import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './HomePage.css';
import Navbar from '../../components/Navbar/Navbar';
import Footer from '../../components/Footer/Footer';
import StarRating from '../../components/StarRating/StarRating';
import ProductCard from '../../components/ProductCard/ProductCard';
import { productAPI } from '../../services/api';

const HomePage = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch products from database
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const data = await productAPI.getAllProducts();
        
        // Transform products to match expected format
        const transformedProducts = data.map((product) => ({
          ...product,
          id: product._id || product.productId,
          title: product.name,
          img: product.images && product.images.length > 0 
            ? `http://localhost:5000${product.images[0]}`
            : '/img/placeholder-plant.jpg',
          rating: product.rating || 4,
          category: product.category || 'General'
        }));
        
        // Get only 3 products for homepage
        const featuredProducts = transformedProducts.slice(0, 3);
        setProducts(featuredProducts);
        setError(null);
      } catch (err) {
        console.error("Error fetching products:", err);
        setError("Failed to load products. Please try again later.");
        
        // Fallback to sample data if API fails
        setProducts([
          {
            id: 1,
            name: "Artificial Plant Deluxe",
            title: "Artificial Plant Deluxe",
            image: "/img/img3.png",
            img: "/img/img3.png",
            price: 239.00,
            rating: 4,
            description: "Premium quality artificial plant that looks completely real",
            category: "Artificial Plants"
          },
          {
            id: 2,
            name: "Premium Ficus Tree",
            title: "Premium Ficus Tree",
            image: "/img/img4.jpg",
            img: "/img/img4.jpg",
            price: 329.00,
            rating: 5,
            description: "Beautiful ficus tree perfect for home or office",
            category: "Natural Plants"
          },
          {
            id: 3,
            name: "Mini Succulent Set",
            title: "Mini Succulent Set",
            image: "/img/img5.jpg",
            img: "/img/img5.jpg",
            price: 139.00,
            rating: 3,
            description: "Set of 3 small succulents in decorative pots",
            category: "Natural Plants"
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleProductClick = (product) => {
    navigate(`/productoverview/${product.id}`, { state: { product } });
  };

  const handleSeeMoreClick = () => {
    navigate('/products');
  };

  const handleExploreClick = () => {
    navigate('/products');
  };

  if (loading) {
    return (
      <div className="homepage">
        <Navbar />
        <div className="loading">Loading...</div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="homepage">
      <Navbar />
      
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <div className="hero-text">
            <h1>Buy your dream <br/>plants</h1>
            <div className="hero-stats">
              <div className="stats-container">
                <div className="stat">
                  <span className="stat-number">50+</span>
                  <span className="stat-label">Plant Species</span>
                </div>
                <div className="divider"></div>
                <div className="stat">
                  <span className="stat-number">100+</span>
                  <span className="stat-label">Customers</span>
                </div>
              </div>
            </div>
          </div>
          <div className="hero-images">
            <img src="/img/img1.jpg" alt="Plant collection" className="hero-img-main" />
            <img src="/img/img2.jpg" alt="Plant detail" className="hero-img-small" />
          </div>
        </div>
      </section>

      {/* Best Selling Plants */}
      <section className="best-selling">
        <div className="section-header">
          <h2>Best Selling <br/>Plants</h2>
          <p>Easiest way to <br/>healthy life by buying <br/>your favorite plants</p>
          <button className="see-more-btn" onClick={handleSeeMoreClick}>
            See more →
          </button>
        </div>
        
        <div className="plants-grid">
          {products.map((product) => (
            <ProductCard 
              key={product.id} 
              product={product}
              onClick={() => handleProductClick(product)}
            />
          ))}
        </div>
      </section>

      {/* About Us */}
      <section className="about-us">
        <h2>About us</h2>
        <p>Order now and appreciate the beauty of nature</p>
        
        <div className="features-grid">
          <div className="feature">
            <div className="feature-icon">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 3h18v18h-18z"/>
                <path d="M9 9h6v6h-6z"/>
              </svg>
            </div>
            <h3>Large Assortment</h3>
            <p>We offer many different types of products with fewer variations in each category.</p>
          </div>
          <div className="feature">
            <div className="feature-icon">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="1" y="3" width="15" height="13"/>
                <polygon points="16,3 21,8 21,21 16,16 16,3"/>
              </svg>
            </div>
            <h3>Fast & Free Shipping</h3>
            <p>4-day or less delivery time, free shipping and an expedited delivery option.</p>
          </div>
          <div className="feature">
            <div className="feature-icon">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
              </svg>
            </div>
            <h3>24/7 Support</h3>
            <p>Answers to any business related inquiry 24/7 and in real-time.</p>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="categories-section">
        <h2>Categories</h2>
        <p>Find what you are looking for</p>

        <div className="categories-grid">
          <div className="category-card">
            <img src="/img/img6.jpg" alt="Natural Plants" />
            <div className="category-overlay">
              <h3>Natural Plants</h3>
            </div>
          </div>
          <div className="category-card">
            <img src="/img/img7.jpg" alt="Plant Accessories" />
            <div className="category-overlay">
              <h3>Plant Accessories</h3>
              <p>Horem ipsum dolor sit amet</p>
            </div>
          </div>
          <div className="category-card">
            <img src="/img/img8.jpg" alt="Artificial Plants" />
            <div className="category-overlay">
              <h3>Artificial Plants</h3>
            </div>
          </div>

          <button className="explore-btn" onClick={handleExploreClick}>
            Explore →
          </button>
        </div>
      </section>

      {/* Testimonials */}
      <section className="testimonials">
        <h2>What customers say about GREEMIND?</h2>
        
        <div className="testimonials-grid">
          <div className="testimonial-card">
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc vulputate libero et velit interdum, ac aliquet odio mattis. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos.</p>
            <div className="testimonial-author">
              <strong>John Doe</strong>
            </div>
          </div>
          <div className="testimonial-card">
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc vulputate libero et velit interdum, ac aliquet odio mattis. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos.</p>
            <div className="testimonial-author">
              <strong>John Doe</strong>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default HomePage;