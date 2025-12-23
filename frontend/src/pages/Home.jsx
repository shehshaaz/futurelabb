import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ShoppingCart, Search, CheckCircle, AlertTriangle } from "lucide-react";
import apiService from "../utils/api";
import { USE_MOCK_DATA, getImagePath } from "../utils/config";
import { mockData } from "../utils/mockData";
import MakeYourOwnPackage from "../components/MakeYourOwnPackage";
import PromotionalCard from "../components/PromotionalCard";
import TestimonialsSlider from "../components/TestimonialsSlider";
import PincodeChecker from "./Pincode";
import Carousel from "react-bootstrap/Carousel";


const Home = () => {
  // Helper function to get correct image URL
  const getImageUrl = (imagePath) => {
    // Handle cases where imagePath might be undefined or null
    if (!imagePath) return `${process.env.PUBLIC_URL}/images/placeholder.png`;

    // Use the getImagePath function from config
    return getImagePath(imagePath);
  };

  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [womenAge, setWomenAge] = useState([]);
  const [womenCare, setWomenCare] = useState([]);
  const [menAge, setMenAge] = useState([]);
  const [menCare, setMenCare] = useState([]);
  const [lifestyle, setLifestyle] = useState([]);
  const [specialCare, setSpecialCare] = useState([]);
  const [singleTest, setSingleTest] = useState([]);
  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Pin code and service availability states
  const [pinCode, setPinCode] = useState("");
  const [serviceAvailable, setServiceAvailable] = useState(null);
  const [checkingService, setCheckingService] = useState(false);

  // Cart state (in real app, this would be in a global state management)
  const [cartItems, setCartItems] = useState([]);
  const [showCartNotification, setShowCartNotification] = useState(false);

  // Animation state
  const [animationClass, setAnimationClass] = useState("");
  const [direction, setDirection] = useState("right"); // 'left' or 'right'


  const [showDetails, setShowDetails] = useState(false);


  // special offers carousel
  const packages = [
    {
      id: 1,
      title: "Full Body Checkup + 1 Special Profile Test FREE",
      tests: "103 Tests",
      price: "₹999",
      oldPrice: "₹2299",
      image: "/images/Tests/full-body.png",
      discount: "56% OFF",
      details: {
        inclusions: ["Complete Blood Count", "Liver Function Test", "Kidney Function Test", "Lipid Profile", "Sugar Test", "1 Special Profile Test"],
        preparation: "10-12 hours fasting required",
        sampleType: "Blood & Urine",
        reportTime: "24-48 Hours",
        certification: "NABL Accredited",
        homeCollection: "Free Home Sample Collection"
      }
    },
    {
      id: 2,
      title: "Comprehensive Health Package",
      tests: "95 Tests",
      price: "₹899",
      oldPrice: "₹1999",
      image: "/images/Tests/full-body.png",
      discount: "55% OFF",
      details: {
        inclusions: ["Thyroid Profile", "Vitamin B12", "Vitamin D", "Iron Studies", "All CBC parameters"],
        preparation: "Fasting required",
        sampleType: "Blood",
        reportTime: "24 Hours",
        certification: "ISO Certified",
        homeCollection: "Available"
      }
    },
    {
      id: 3,
      title: "Heart Care Package",
      tests: "110 Tests",
      price: "₹1099",
      oldPrice: "₹2499",
      image: "/images/Tests/full-body.png",
      discount: "56% OFF",
      details: {
        inclusions: ["Lipid Profile", "ECG", "Cardiac Markers", "Sugar", "CBC"],
        preparation: "Fasting mandatory",
        sampleType: "Blood",
        reportTime: "24 Hours",
        certification: "NABL Accredited",
        homeCollection: "Free Home Collection"
      }
    },
    {
      id: 4,
      title: "Diabetes Screening Package",
      tests: "78 Tests",
      price: "₹799",
      oldPrice: "₹1799",
      image: "/images/Tests/full-body.png",
      discount: "55% OFF",
      details: {
        inclusions: ["HbA1c", "Average Blood Glucose", "Lipid Profile", "Micro-albumin"],
        preparation: "Fasting required",
        sampleType: "Blood & Urine",
        reportTime: "12-24 Hours",
        certification: "NABL Accredited",
        homeCollection: "Available"
      }
    },
    {
      id: 5,
      title: "Senior Citizen Health Package",
      tests: "120 Tests",
      price: "₹1299",
      oldPrice: "₹2999",
      image: "/images/Tests/full-body.png",
      discount: "56% OFF",
      details: {
        inclusions: ["Liver & Kidney Function", "Vitamin D & B12", "Lipid Profile", "Urine Routine"],
        preparation: "Fasting required",
        sampleType: "Blood & Urine",
        reportTime: "24-48 Hours",
        certification: "NABL Accredited",
        homeCollection: "Free"
      }
    },
    {
      id: 6,
      title: "Women Wellness Package",
      tests: "88 Tests",
      price: "₹899",
      oldPrice: "₹1999",
      image: "/images/Tests/full-body.png",
      discount: "55% OFF",
      details: {
        inclusions: ["Anemia Screening", "Thyroid Profile", "Bone Health", "CBC"],
        preparation: "Fasting required",
        sampleType: "Blood",
        reportTime: "24 Hours",
        certification: "NABL Accredited",
        homeCollection: "Available"
      }
    },
  ];

  // DetailCard Component
  const DetailCard = ({ pkg, onClose }) => {
    if (!pkg) return null;
    return (
      <div className="detail-card-overlay p-3">
        <div className="card border-0 shadow-lg detail-card h-100">
          <div className="card-header bg-transparent border-0 d-flex justify-content-between align-items-center pt-3 px-3">
            <h5 className="fw-bold text-primary mb-0">Package Details</h5>
            <button className="btn btn-sm btn-light rounded-circle" onClick={onClose}>
              <i className="bi bi-x-large"></i>
            </button>
          </div>
          <div className="card-body px-3 py-2 scrollable-details">
            <h6 className="fw-bold mb-3">{pkg.title}</h6>

            <div className="detail-item mb-2">
              <span className="fw-bold text-secondary small d-block">Test Inclusions:</span>
              <ul className="list-unstyled small ps-1">
                {pkg.details.inclusions.map((item, idx) => (
                  <li key={idx} className="mb-1"><i className="bi bi-check2-circle text-success me-2"></i>{item}</li>
                ))}
              </ul>
            </div>

            <div className="row g-2 mb-3">
              <div className="col-6">
                <div className="p-2 rounded-3 bg-light-teal detail-info-box">
                  <i className="bi bi-clock-history text-primary d-block mb-1"></i>
                  <span className="d-block small fw-bold">Reports</span>
                  <span className="x-small">{pkg.details.reportTime}</span>
                </div>
              </div>
              <div className="col-6">
                <div className="p-2 rounded-3 bg-light-teal detail-info-box">
                  <i className="bi bi-droplet-fill text-danger d-block mb-1"></i>
                  <span className="d-block small fw-bold">Sample</span>
                  <span className="x-small">{pkg.details.sampleType}</span>
                </div>
              </div>
              <div className="col-6">
                <div className="p-2 rounded-3 bg-light-teal detail-info-box">
                  <i className="bi bi-info-circle text-info d-block mb-1"></i>
                  <span className="d-block small fw-bold">Prep</span>
                  <span className="x-small text-truncate d-inline-block w-100">{pkg.details.preparation}</span>
                </div>
              </div>
              <div className="col-6">
                <div className="p-2 rounded-3 bg-light-teal detail-info-box">
                  <i className="bi bi-patch-check-fill text-success d-block mb-1"></i>
                  <span className="d-block small fw-bold">Cert.</span>
                  <span className="x-small">{pkg.details.certification}</span>
                </div>
              </div>
            </div>

            <div className="p-2 rounded-3 bg-primary bg-opacity-10 text-primary small d-flex align-items-center">
              <i className="bi bi-house-door-fill me-2"></i>
              <span>{pkg.details.homeCollection}</span>
            </div>
          </div>
          <div className="card-footer bg-white border-0 p-3">
            <button className="btn btn-primary w-100 rounded-pill shadow-sm" onClick={() => handleAddToCart(pkg.id)}>
              Book This Package
            </button>
          </div>
        </div>
      </div>
    );
  };

  const [current, setCurrent] = useState(0);
  const total = packages.length;

  const nextSlide = () => {
    if (current < total - 1) {
      setDirection("right");
      setAnimationClass("slide-out-left");
      setTimeout(() => {
        setCurrent((prev) => prev + 1);
        setAnimationClass("slide-in-right");
      }, 250);
    }
  };

  const prevSlide = () => {
    if (current > 0) {
      setDirection("left");
      setAnimationClass("slide-out-right");
      setTimeout(() => {
        setCurrent((prev) => prev - 1);
        setAnimationClass("slide-in-left");
      }, 250);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (USE_MOCK_DATA) {
          console.log("Using mock data (development mode)");
          setCategories(mockData.categories || []);
          setAds(mockData.ads || []);
          setWomenAge(mockData.womenCare || []);
          setWomenCare(mockData.womenCare || []);
          setMenAge(mockData.menCare || []);
          setMenCare(mockData.menCare || []);
          setLifestyle(mockData.lifestyle || []);
          setSpecialCare(mockData.specialCare || []);
          setSingleTest(mockData.singleTest || []);
          setLoading(false);
          return;
        }

        console.log("Starting to fetch data from backend API");

        // Fetch all data from backend API using the apiService
        const [
          lessPriceData,
          adsData,
          womenAgeData,
          womenCareData,
          menAgeData,
          menCareData,
          lifeStyleData,
          specialPackageData,
          singleTestData,
        ] = await Promise.all([
          apiService.getSelectedLessPrice(),
          apiService.getBottomBanners(),
          apiService.getSelectedWomenAge(),
          apiService.getSelectedWomenCare(),
          apiService.getSelectedMenAge(),
          apiService.getSelectedMenCare(),
          apiService.getSelectedLifestyle(),
          apiService.getSelectedSpecialCare(),
          apiService.getSelectedSingleTest(),
        ]);

        console.log("API responses received:", {
          lessPrice: lessPriceData?.data?.length || 0,
          adsData: adsData?.data?.length || 0,
        });

        setCategories(lessPriceData?.data || []);
        setAds(adsData?.data || []);
        setWomenAge(womenAgeData?.data || []);
        setWomenCare(womenCareData?.data || []);
        setMenAge(menAgeData?.data || []);
        setMenCare(menCareData?.data || []);
        setLifestyle(lifeStyleData?.data || []);
        setSpecialCare(specialPackageData?.data || []);
        setSingleTest(singleTestData?.data || []);

        console.log("Data set successfully");
      } catch (error) {
        console.error("Error fetching data:", error);
        // We don't set the global error state here because we are falling back to mock data
        // setError("Failed to load data. Please try again later.");

        // Fallback to mock data on error
        console.log("Falling back to mock data");
        setCategories(mockData.categories || []);
        setAds(mockData.ads || []);
        setWomenAge(mockData.womenCare || []);
        setWomenCare(mockData.womenCare || []);
        setMenAge(mockData.menCare || []);
        setMenCare(mockData.menCare || []);
        setLifestyle(mockData.lifestyle || []);
        setSpecialCare(mockData.specialCare || []);
        setSingleTest(mockData.singleTest || []);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handlePinCodeCheck = async (e) => {
    e.preventDefault();
    if (!pinCode || pinCode.length !== 6) {
      alert("Please enter a valid 6-digit pin code");
      return;
    }

    setCheckingService(true);
    setServiceAvailable(null);

    try {
      // Use the API service to check pincode
      const response = await apiService.checkPincode(pinCode);
      setServiceAvailable(response.available);
    } catch (error) {
      console.error("Error checking service availability:", error);
      setError("Failed to check service availability. Please try again.");
    } finally {
      setCheckingService(false);
    }
  };

  const handleAddToCart = async (testId) => {
    const userId = localStorage.getItem("userId");

    if (!userId) {
      alert("Please login to add items to cart");
      // Trigger the login sidebar
      const sidebar = document.getElementById("sidebar");
      if (sidebar) {
        sidebar.classList.add("show");
      }
      return;
    }

    try {
      // Add item to cart using API
      const response = await apiService.addToCart(userId, testId);

      if (response.success) {
        alert("Item added to cart successfully!");
      } else {
        setError(response.error || "Failed to add item to cart");
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
      setError("Error adding item to cart. Please try again.");
    }
  };
  const chunkedCategories = [];
  for (let i = 0; i < categories.length; i += 4) {
    chunkedCategories.push(categories.slice(i, i + 4));
  }

  const chunkedAds = [];
  for (let i = 0; i < ads.length; i += 4) {
    chunkedAds.push(ads.slice(i, i + 4));
  }


  const handleKnowMore = () => {
    navigate("/checkups");
  };

  if (loading) {
    return (
      <div className="d-flex flex-column justify-content-center align-items-center min-vh-100 bg-light">
        <div
          className="spinner-border text-primary mb-3"
          role="status"
          style={{ width: "3rem", height: "3rem" }}
        >
          <span className="visually-hidden">Loading...</span>
        </div>
        <h4 className="text-center mb-2">Loading Health Services...</h4>
        <p className="text-muted text-center">
          Please wait while we fetch the latest information
        </p>
        <div className="mt-3">
          <small className="text-muted">
            If this takes too long, the backend server might not be running.
          </small>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="d-flex flex-column justify-content-center align-items-center min-vh-100 bg-light">
        <div
          className="alert alert-danger d-flex align-items-center"
          role="alert"
        >
          <AlertTriangle className="me-2" />
          <div>
            <h4 className="alert-heading">Unable to Load Data</h4>
            <p className="mb-0">{error}</p>
          </div>
        </div>
        <div className="mt-3 text-center">
          <p className="text-muted">This usually happens when:</p>
          <ul className="text-muted text-start">
            <li>The backend server is not running</li>
            <li>There's a network connectivity issue</li>
            <li>MongoDB is not accessible</li>
          </ul>
        </div>
        <div className="mt-3">
          <button
            className="btn btn-primary me-2"
            onClick={() => window.location.reload()}
          >
            Try Again
          </button>
          <button
            className="btn btn-outline-secondary"
            onClick={() => {
              // Enable mock data and reload
              alert(
                "Switching to mock data mode. Please check the documentation for how to start the backend server."
              );
            }}
          >
            Use Mock Data
          </button>
        </div>
        <div className="mt-3">
          <small className="text-muted">
            Check the browser console for detailed error information.
          </small>
        </div>
      </div>
    );
  }

  return (
    <div className="home-page" style={{ minHeight: "100vh" }}>
      {/* Cart Notification */}
      {showCartNotification && (
        <div
          className="position-fixed top-0 end-0 p-3"
          style={{ zIndex: 1050, marginTop: "80px" }}
        >
          <div className="toast show" role="alert">
            <div className="toast-header bg-success text-white">
              <CheckCircle size={20} className="me-2" />
              <strong className="me-auto">Success!</strong>
              <button
                type="button"
                className="btn-close btn-close-white"
                onClick={() => setShowCartNotification(false)}
              ></button>
            </div>
            <div className="toast-body">Item added to cart</div>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <section className="hero-section mb-4">
        <div className="container-fluid p-0">
          <Carousel fade interval={3000} controls={false} indicators={false}>
            {["banner1.png", "banner2.png", "banner3.png"].map((image, index) => (
              <Carousel.Item key={index}>
                <img
                  className="d-block w-100 img-fluid hero-image"
                  src={`${process.env.PUBLIC_URL}/images/banners/${image}`}
                  alt={`Banner ${index + 1}`}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = `${process.env.PUBLIC_URL}/images/banners/banner1.png`;
                  }}
                />
              </Carousel.Item>
            ))}
          </Carousel>
        </div>

        {/* Custom styles */}
        <style>{`
        .hero-image {
          height: clamp(250px, 40vw, 500px);
          object-fit: cover;
          object-position: center;
          border-radius: 0;
          transition: all 0.4s ease-in-out;
        }

        /* Smaller size & rounded for mobile */
        @media (max-width: 768px) {
          .hero-image {
            height: 220px;
            border-radius: 15px;
            margin: 10px;
          }
        }
      `}</style>
      </section>




      {/* Pin Code Service Availability Section */}
      <section className="py-5 bg-light">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-8 col-md-10">
              <h2 className="text-center mb-4 fw-bold">
                Check Service Availability
              </h2>
              <div className="card shadow-sm border-0">
                <div className="card-body p-4">
                  <form onSubmit={handlePinCodeCheck}>
                    <div className="row g-3 align-items-end">
                      <div className="col-md-8">
                        <label
                          htmlFor="pincode"
                          className="form-label fw-semibold"
                        >
                          Enter Your Pin Code
                        </label>
                        <input
                          type="text"
                          id="pincode"
                          name="pincode"
                          className="form-control form-control-lg"
                          placeholder="Enter 6-digit pin code"
                          value={pinCode}
                          onChange={(e) =>
                            setPinCode(
                              e.target.value.replace(/\D/g, "").slice(0, 6)
                            )
                          }
                          pattern="[0-9]{6}"
                          maxLength="6"
                          required
                        />
                      </div>
                      <div className="col-md-4">
                        <button
                          className="btn btn-primary btn-lg w-100"
                          type="submit"
                          disabled={checkingService || pinCode.length !== 6}
                        >
                          {checkingService ? (
                            <>
                              <span
                                className="spinner-border spinner-border-sm me-2"
                                role="status"
                              ></span>
                              Checking...
                            </>
                          ) : (
                            <>
                              <Search size={20} className="me-2" />
                              Check
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </form>

                  {/* Service Availability Result */}
                  {serviceAvailable !== null && (
                    <div className="mt-4">
                      <div
                        className={`alert ${serviceAvailable ? "alert-success" : "alert-warning"
                          } border-0 shadow-sm`}
                        role="alert"
                      >
                        <div className="d-flex align-items-start">
                          {serviceAvailable ? (
                            <CheckCircle
                              className="me-3 mt-1 text-success"
                              size={24}
                            />
                          ) : (
                            <AlertTriangle
                              className="me-3 mt-1 text-warning"
                              size={24}
                            />
                          )}
                          <div>
                            {serviceAvailable ? (
                              <>
                                <h5 className="alert-heading mb-2">
                                  Service Available! 🎉
                                </h5>
                                <p className="mb-0">
                                  Great news! We provide home sample collection
                                  and lab services in your area (PIN: {pinCode}
                                  ). Book your test now!
                                </p>
                              </>
                            ) : (
                              <>
                                <h5 className="alert-heading mb-2">
                                  Service Not Available
                                </h5>
                                <p className="mb-0">
                                  We don't provide services in PIN: {pinCode}{" "}
                                  yet. Please contact us at{" "}
                                  <strong>+91-9876543210</strong> for
                                  assistance.
                                </p>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>










      {/* Scrolling Marquee Section */}
      <section className="py-2 bg-primary">
        <div className="overflow-hidden">
          <div className="marquee">
            <span className="text-white fw-semibold">
              🩺 Welcome to Future Lab Diagnostics | Your Health, Our Priority |
              Caring for You with Precision | Reliable Results You Can Trust |
              Compassionate Healthcare Services | Advanced Diagnostics for a
              Healthier Future | Experience Quality Care with Us | Committed to
              Your Well-being 🩺
            </span>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      {/* <section className="py-5 bg-light">
  <div className="container p-3 rounded-3"  style={{ backgroundColor: 'rgba(224, 247, 247, 0.7)' }}> */}
      {/* Header Section */}
      {/* <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-5 text-center text-md-start">
   <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center align-items-start bg-light p-3 rounded-3 shadow-sm">

  <div>
    <h2 className="fw-bold mb-1" style={{ color: 'rgb(0, 162, 173)' }}>
      Money-Saving <span className="d-block">Packages</span>
    </h2>
    <p className="mb-0 fw-semibold" style={{ color: 'rgb(255, 128, 0)' }}>
      Upto 75% Discount
    </p>
  </div>


  <Link
    to="/completehealth"
    className="btn fw-semibold text-white mt-3 mt-md-0 px-4 py-2"
    style={{
      background: 'linear-gradient(180deg, #FFA500 0%, #FF7A00 100%)',
      border: 'none',
      fontSize: '1rem',
      boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
      borderRadius: '6px',
      whiteSpace: 'nowrap',
    }}
  >
    VIEW ALL
  </Link>
</div>
</div> */}
      {/* 
  </div>
</section> */}

      {/* Cards Section */}
      <section className="py-5">
        <div className="container">
          {/* Section Header */}
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-center mb-4">
            <div className="align-items-md-center ">
              <h2 className="fw-bold mb-1"
                style={{ color: "rgb(0, 162, 173)", fontSize: "1.5rem" }}>
                Money-Saving Packages
              </h2>
              <p className="mb-0 fw-semibold" style={{ color: "rgb(255, 128, 0)" }}>
                Upto 75% Discount
              </p>
            </div>


            <Link
              to="/completehealth"
              className="btn fw-semibold text-white mt-3 mt-md-0 px-4 py-2"
              style={{
                background: "linear-gradient(180deg, #FFA500 0%, #FF7A00 100%)",
                border: "none",
                fontSize: "1rem",
                borderRadius: "8px",
                boxShadow: "0 3px 8px rgba(0,0,0,0.2)",
              }}
            >
              VIEW ALL
            </Link>
          </div>

          {/* Carousel */}
          <div className="position-relative">
            <div className="overflow-hidden">
              <div
                className="d-flex transition-container"
                style={{
                  transform: `translateX(-${current * 100}%)`,
                  transition: 'transform 0.5s ease-in-out'
                }}
              >
                {chunkedCategories.map((group, index) => (
                  <div
                    key={index}
                    className="d-flex flex-wrap justify-content-center w-100"
                    style={{ minWidth: '100%' }}
                  >
                    {group.map((item, idx) => (
                      <div
                        key={idx}
                        className="col-6 col-sm-6 col-md-3 col-lg-3 p-2"
                      >
                        <Link
                          to={`/completehealth?tab=${encodeURIComponent(item.name)}`}
                          className="text-decoration-none"
                        >
                          <div
                            className="card border-0 rounded-4 overflow-hidden shadow-sm h-100 position-relative money-saving-card"
                            style={{
                              borderRadius: "14px",
                              transition: "transform 0.3s ease, box-shadow 0.3s ease",
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.transform = "translateY(-6px)";
                              e.currentTarget.style.boxShadow =
                                "0 8px 20px rgba(0,0,0,0.15)";
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.transform = "translateY(0)";
                              e.currentTarget.style.boxShadow =
                                "0 4px 10px rgba(0,0,0,0.05)";
                            }}
                          >
                            <div className="position-relative overflow-hidden rounded-top-4">
                              <img
                                className="img-fluid w-100 money-saving-image"
                                src={getImageUrl(item.imagePath)}
                                alt={item.name}
                                style={{
                                  height: "160px",
                                  objectFit: "cover",
                                  transition: "transform 0.3s ease",
                                  borderTopLeftRadius: "14px",
                                  borderTopRightRadius: "14px",
                                }}
                                onMouseEnter={(e) =>
                                  (e.currentTarget.style.transform = "scale(1.05)")
                                }
                                onMouseLeave={(e) =>
                                  (e.currentTarget.style.transform = "scale(1)")
                                }
                              />
                            </div>
                            <div
                              className="text-center py-2 rounded-bottom-4"
                              style={{
                                backgroundColor: "rgb(119, 217, 207)",
                                color: "#004d4d",
                                fontWeight: "600",
                                fontSize: "0.95rem",
                              }}
                            >
                              {item.name}
                            </div>
                          </div>
                        </Link>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>

            {/* Carousel Navigation Arrows */}
            <div className="d-flex justify-content-center align-items-center mt-4 w-100" style={{ minHeight: "60px" }}>
              <button
                className="btn btn-primary rounded-circle shadow me-3"
                style={{
                  width: "45px",
                  height: "45px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: "rgba(0, 0, 0, 0.9)",
                  border: "none",
                }}
                onClick={prevSlide}
                disabled={current === 0}
              >
                <i className="bi bi-chevron-left text-white" style={{ fontSize: "1.2rem" }}></i>
              </button>

              {/* Page Indicator */}
              <div className="d-flex align-items-center mx-3">
                {chunkedCategories.map((_, index) => (
                  <span
                    key={index}
                    className={`rounded-circle mx-1 ${index === current ? 'bg-primary' : 'bg-secondary'}`}
                    style={{
                      width: "10px",
                      height: "10px",
                      opacity: index === current ? 1 : 0.5,
                    }}
                  ></span>
                ))}
              </div>

              <button
                className="btn rounded-circle shadow"
                style={{
                  width: "36px",
                  height: "36px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: "rgba(122, 173, 162, 1)",
                  border: "none",
                }}
                onClick={nextSlide}
                disabled={current === chunkedCategories.length - 1}
              >
                <i
                  className="bi bi-chevron-right text-primary"
                  style={{
                    fontSize: "2.5rem",
                    position: "relative",
                    zIndex: 50,
                  }}
                ></i>

              </button>

            </div>
          </div>

          {/* Responsive Styles */}
          <style>{`
      .transition-container {
        display: flex;
      }
      
      .money-saving-card {
        height: 100%;
      }
      
      .money-saving-image {
        height: 160px !important;
        object-fit: cover;
      }

      /* Desktop - 4 cards per row */
      @media (min-width: 992px) {
        .col-lg-3 {
          flex: 0 0 25%;
          max-width: 25%;
        }
      }

      /* Tablet - 2 cards per row */
      @media (min-width: 768px) and (max-width: 991px) {
        .col-md-3 {
          flex: 0 0 50%;
          max-width: 50%;
        }
        
        .money-saving-image {
          height: 140px !important;
        }
      }

      /* Mobile - 2 cards per row */
      @media (max-width: 767px) {
        .col-6 {
          flex: 0 0 50%;
          max-width: 50%;
        }
        
        .money-saving-image {
          height: 130px !important;
        }
        
        .card {
          margin-bottom: 10px;
        }
      }
      
      /* Small Mobile */
      @media (max-width: 576px) {
        .money-saving-image {
          height: 120px !important;
        }
        
        .col-6 {
          padding: 5px;
        }
      }
      
      /* Extra small devices */
      @media (max-width: 400px) {
        .money-saving-image {
          height: 110px !important;
        }
      }
    `}</style>
        </div>
      </section>









      {/* Healthcare Banner Section */}
      <section className="py-4 bg-light">
        <div className="container">
          <div
            className="d-flex flex-column flex-md-row align-items-center justify-content-center bg-white shadow-sm p-3 p-md-4 mx-auto"
            style={{
              borderRadius: "16px",
              maxWidth: "650px",
              background: "linear-gradient(90deg, #eafff8 0%, #d8fff0 100%)",
            }}
          >
            {/* Left Side - Illustration */}
            <div className="me-md-4 mb-3 mb-md-0 text-center">
              <img
                src={`${process.env.PUBLIC_URL}/images/delivery-doctor.png`}
                alt="Home Visit Icon"
                style={{
                  width: "120px",
                  height: "auto",
                }}
              />
            </div>

            {/* Right Side - Text Content */}
            <div className="text-center text-md-start">
              <h5
                className="fw-bold mb-1"
                style={{ color: "#E53935", fontSize: "1.25rem" }}
              >
                Free - Home Visit
              </h5>
              <h4
                className="fw-bold mb-2"
                style={{ color: "#B71C1C", fontSize: "1.5rem" }}
              >
                in Bengaluru
              </h4>
              <p className="mb-0 fw-semibold" style={{ color: "#2E7D32" }}>
                If Bill Amount 1k
              </p>
            </div>
          </div>
        </div>

        <style>{`
    /* Mobile Responsive Adjustments */
    @media (max-width: 768px) {
      section div.container > div {
        flex-direction: column !important;
        text-align: center !important;
      }

      section img {
        width: 90px !important;
      }

      section h4 {
        font-size: 1.25rem !important;
      }

      section h5 {
        font-size: 1.1rem !important;
      }
    }
  `}</style>
      </section>





      {/* Special Offer Card */}

      <section className="py-4">
        <div className="container">
          {/* Header */}
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-center mb-4 ">
            <div>
              <h2
                className="fw-bold mb-1"
                style={{ color: "rgb(0, 162, 173)", fontSize: "1.5rem" }}
              >
                Special Offers <br />
                <span style={{ color: "rgb(255, 128, 0)" }}>Upto 75% Discount</span>
              </h2>
            </div>
            <Link
              to="/completehealth"
              className="btn text-white fw-semibold shadow-sm px-4 py-2"
              style={{
                background: "linear-gradient(180deg, #FFA500 0%, #FF7A00 100%)",
                border: "none",
                fontSize: "1rem",
                borderRadius: "8px",
              }}
            >
              VIEW ALL
            </Link>
          </div>

          {/* Carousel */}
          <div className={`position-relative text-center ${showDetails ? 'show-details-active' : ''}`}>
            <div
              className="special-offer-layout-container"
              style={{
                minHeight: "520px",
              }}
            >
              {/* Single Card Display with Animation */}
              <div
                key={packages[current].id}
                className="card shadow-sm border-0 text-center position-relative special-offer-card mx-auto animate-slide"
                style={{
                  borderRadius: "20px",
                  overflow: "hidden",
                  background: "#fff",
                  boxShadow: "0 12px 25px rgba(0,0,0,0.3)",

                  maxHeight: "560px",
                  width: "100%",
                  maxWidth: "330px",
                }}
              >
                {/* Discount Badge */}
                <span
                  className="position-absolute bg-danger text-white fw-bold px-2 py-1 rounded-end"
                  style={{ top: "10px", left: "0", fontSize: "0.8rem" }}
                >
                  56% OFF
                </span>

                {/* Image */}
                <div className="offer-image-wrapper">

                  <img
                    src={packages[current].image}
                    alt={packages[current].title}
                    className="card-img-center w-100 h-100 object-fit-cover"
                    style={{
                      borderTopLeftRadius: "20px",
                      borderTopRightRadius: "20px",
                    }}
                  />
                </div>

                {/* Content */}
                <div className="card-body py-3 px-3 d-flex flex-column text-center">
                  <h6 className="fw-bold text-danger mb-1" style={{ fontSize: "1.1rem" }}>{packages[current].title}</h6>
                  <p className="text-secondary mb-1" style={{ fontSize: "0.95rem" }}>{packages[current].tests}</p>

                  <div className="mb-3">
                    <button
                      className="btn btn-outline-primary btn-sm rounded-pill fw-semibold"
                      onClick={() => setShowDetails(!showDetails)}
                    >
                      {showDetails ? "Hide Details" : "Know More"}
                    </button>
                  </div>

                  <div
                    className="fw-bold text-danger mb-1"
                    style={{ fontSize: "1.3rem" }}
                  >
                    {packages[current].price}
                  </div>
                  <div className="text-muted small mb-1">Exclusive Offer</div>
                  <div className="text-decoration-line-through text-secondary small mb-3">
                    {packages[current].oldPrice}
                  </div>
                </div>

                {/* Add to Cart */}
                <button
                  className="w-100 text-center py-3 fw-bold text-white border-0"
                  style={{
                    backgroundColor: "#007A5E",
                    borderBottomLeftRadius: "20px",
                    borderBottomRightRadius: "20px",
                    fontSize: "1rem",
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                  }}
                  onClick={() => {
                    // Add to localStorage cart
                    const cart = JSON.parse(localStorage.getItem("cart")) || [];
                    const newItem = {
                      _id: `special-offer-${packages[current].id}`,
                      name: packages[current].title,
                      category: "Special Offers",
                      price: parseInt(packages[current].price.replace(/[₹,]/g, "")),
                      originalPrice: parseInt(packages[current].oldPrice.replace(/[₹,]/g, "")),
                      description: packages[current].tests,
                      discountPercentage: 56,
                      homeSampleCollection: true,
                      reportsIn: "24-48 hours"
                    };

                    // Check if item already exists
                    const existingIndex = cart.findIndex(item => item._id === newItem._id);
                    if (existingIndex === -1) {
                      cart.push(newItem);
                      localStorage.setItem("cart", JSON.stringify(cart));

                      // Trigger storage event for cart count update
                      window.dispatchEvent(new Event("storage"));

                      alert("Item added to cart successfully!");
                    } else {
                      alert("This item is already in your cart!");
                    }
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = "#006B52";
                    e.currentTarget.style.transform = "scale(1.02)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "#007A5E";
                    e.currentTarget.style.transform = "scale(1)";
                  }}
                >
                  <i className="bi bi-cart-fill me-2"></i>ADD TO CART
                </button>
              </div>

              {/* Detail Card Container - only visible when showDetails is true */}
              <div className={`detail-wrapper ${showDetails ? 'show' : ''}`}>
                <DetailCard pkg={packages[current]} onClose={() => setShowDetails(false)} />
              </div>
            </div>
          </div>

          {/* Special Offers Inline CSS */}
          <style>{`
            .special-offer-layout-container {
              display: flex;
              flex-direction: row;
              align-items: center;
              justify-content: center;
              gap: 20px;
              transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
              max-width: 900px;
              margin: 0 auto;
              position: relative;
            }

            .special-offer-card {
              flex: 0 0 330px;
              transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
              z-index: 2;
            }

            .detail-wrapper {
              flex: 0 0 0px;
              opacity: 0;
              overflow: hidden;
              transform: translateX(-30px) scale(0.95);
              transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
              z-index: 1;
              height: 520px;
              display: flex;
              align-items: stretch;
            }

            .detail-wrapper.show {
              flex: 0 0 350px;
              opacity: 1;
              transform: translateX(0) scale(1);
            }

            .detail-card {
              background: linear-gradient(135deg, #ffffff 0%, #f0fdfa 100%);
              border: 1px solid #e0f2f1 !important;
              border-radius: 20px !important;
              text-align: left !important;
              width: 100%;
            }

            .show-details-active .special-offer-card {
               box-shadow: 0 15px 35px rgba(0,162,173,0.3) !important;
            }
            
            .bg-light-teal {
              background-color: #f0f9f9;
            }

            .scrollable-details {
              max-height: 250px;
              overflow-y: auto;
              scrollbar-width: thin;
              scrollbar-color: #00a2ad #f0fdfa;
            }

            .detail-info-box {
              border: 1px solid #e0f2f1;
              text-align: center;
              height: 100%;
              display: flex;
              flex-direction: column;
              justify-content: center;
              align-items: center;
            }

            .x-small {
              font-size: 0.7rem;
            }

            @media (max-width: 768px) {
              .special-offer-layout-container {
                flex-direction: column !important;
                align-items: center !important;
                gap: 15px !important;
                min-height: auto !important;
              }

              .special-offer-card {
                flex: 0 0 auto !important;
              }

              .detail-wrapper.show {
                flex: 0 0 auto !important;
                width: 100% !important;
                max-width: 330px !important;
                height: auto !important;
                transform: translateY(0) scale(1) !important;
              }

              .detail-wrapper {
                transform: translateY(-20px) scale(0.95) !important;
                height: 0;
              }
              
              .scrollable-details {
                max-height: none !important;
              }
            }
          `}</style>

          {/* Navigation Arrows */}
          <button
            className="btn btn-primary rounded-circle shadow position-absolute"
            style={{
              left: "10px",
              top: "50%",
              transform: "translateY(-50%)",
              width: "50px",
              height: "50px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 10,
            }}
            onClick={prevSlide}
            disabled={current === 0}
          >
            <i className="bi bi-chevron-left text-white" style={{ fontSize: "1.5rem" }}></i>
          </button>

          <button
            className="btn btn-primary rounded-circle shadow position-absolute"
            style={{
              right: "10px",
              top: "50%",
              transform: "translateY(-50%)",
              width: "50px",
              height: "50px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 10,
            }}
            onClick={nextSlide}
            disabled={current === packages.length - 1}
          >
            <i className="bi bi-chevron-right text-white" style={{ fontSize: "1.5rem" }}></i>
          </button>
        </div>

        {/* Page Indicators Below Card */}
        <div className="d-flex justify-content-center mt-3 w-100">
          {packages.map((_, index) => (
            <span
              key={index}
              className={`rounded-circle mx-1 ${index === current ? 'bg-primary' : 'bg-secondary'}`}
              style={{
                width: "12px",
                height: "12px",
                opacity: index === current ? 1 : 0.4,
                cursor: "pointer",
                transition: "all 0.3s ease",
              }}
              onClick={() => {
                setDirection(index > current ? "right" : "left");
                setAnimationClass(index > current ? "slide-out-left" : "slide-out-right");
                setTimeout(() => {
                  setCurrent(index);
                  setAnimationClass(index > current ? "slide-in-right" : "slide-in-left");
                }, 250);
              }}
            ></span>
          ))}
        </div>
      </section>

      <style>{`
        /* Slide Animation */
        @keyframes slideInRight {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        
        @keyframes slideInLeft {
          from {
            transform: translateX(-100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        
        @keyframes slideOutLeft {
          from {
            transform: translateX(0);
            opacity: 1;
          }
          to {
            transform: translateX(-100%);
            opacity: 0;
          }
        }
        
        @keyframes slideOutRight {
          from {
            transform: translateX(0);
            opacity: 1;
          }
          to {
            transform: translateX(100%);
            opacity: 0;
          }
        }
        
        .animate-slide {
          animation: slideInRight 0.5s ease-out forwards;
        }
        
        .animate-slide.slide-out-left {
          animation: slideOutLeft 0.5s ease-out forwards;
        }
        
        .animate-slide.slide-out-right {
          animation: slideOutRight 0.5s ease-out forwards;
        }
        
        .animate-slide.slide-in-left {
          animation: slideInLeft 0.5s ease-out forwards;
        }

        /* Hover Animation */
        .special-offer-card:hover {
          transform: scale(1.02) !important;
          box-shadow: 0 15px 30px rgba(0,0,0,0.4) !important;
        }

        /* Navigation Arrow Styles */
        .btn-primary.rounded-circle {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
          border: 3px solid white !important;
          box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4) !important;
          transition: all 0.3s ease !important;
          animation: arrowPulse 2s ease-in-out infinite;
        }

        .btn-primary.rounded-circle:hover:not(:disabled) {
          transform: translateY(-50%) scale(1.15) !important;
          box-shadow: 0 6px 25px rgba(102, 126, 234, 0.6) !important;
          animation: none;
        }

        .btn-primary.rounded-circle:active:not(:disabled) {
          transform: translateY(-50%) scale(1.05) !important;
        }

        .btn-primary.rounded-circle:disabled {
          background: linear-gradient(135deg, #ccc 0%, #999 100%) !important;
          opacity: 0.5;
          cursor: not-allowed;
          animation: none;
        }

        .btn-primary.rounded-circle i {
          transition: transform 0.3s ease;
        }

        .btn-primary.rounded-circle:hover:not(:disabled) i {
          transform: scale(1.2);
        }

        /* Pulse Animation for Arrows */
        @keyframes arrowPulse {
          0%, 100% {
            box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
          }
          50% {
            box-shadow: 0 4px 20px rgba(102, 126, 234, 0.7);
          }
        }

        /* Tablet */
        @media (max-width: 992px) {
          .special-offer-card {
            max-width: 300px !important;
            max-height: 360px;
          }
          
          .special-offer-card .card-body {
            padding: 1rem !important;
          }
          
          .special-offer-card .card-body h6 {
            font-size: 1rem !important;
          }
          
          .special-offer-card .card-body p {
            font-size: 0.9rem !important;
          }
          
          .special-offer-card .card-body button {
            padding: 5px 18px !important;
            font-size: 0.85rem !important;
          }
          
          .special-offer-card .card-body .fw-bold {
            font-size: 1.2rem !important;
          }
          
          .special-offer-card .card-body .small {
            font-size: 0.8rem !important;
          }
          
          .special-offer-card .card-img-top {
            height: 140px !important;
          }
        }

        /* Mobile */
        @media (max-width: 768px) {
          .special-offer-card {
            max-width: 280px !important;
            max-height: 350px;
          }
          
          .special-offer-card .card-img-top {
            height: 130px !important;
          }
          
          .special-offer-card .card-body h6 {
            font-size: 0.95rem !important;
          }
          
          .special-offer-card .card-body p {
            font-size: 0.85rem !important;
          }
          
          .special-offer-card .card-body button {
            padding: 4px 16px !important;
            font-size: 0.8rem !important;
          }
          
          .special-offer-card .card-body .fw-bold {
            font-size: 1.1rem !important;
          }
          
          .special-offer-card .card-body .small {
            font-size: 0.75rem !important;
          }
          
          .btn-primary.rounded-circle {
            width: 40px !important;
            height: 40px !important;
          }
        }
        
        /* Small Mobile */
        @media (max-width: 576px) {
          .special-offer-card {
            max-width: calc(100vw - 60px) !important;
            max-height: 330px;
          }
          
          .special-offer-card .card-img-top {
            height: 120px !important;
          }
          
          .special-offer-card .card-body {
            padding: 0.75rem !important;
          }
          
          .special-offer-card .card-body h6 {
            font-size: 0.9rem !important;
          }
          
          .special-offer-card .card-body p {
            font-size: 0.8rem !important;
          }
          
          .special-offer-card .card-body button {
            padding: 3px 14px !important;
            font-size: 0.75rem !important;
          }
          
          .special-offer-card .card-body .fw-bold {
            font-size: 1rem !important;
          }
          
          .special-offer-card .card-body .small {
            font-size: 0.7rem !important;
          }
          
          .btn-primary.rounded-circle {
            width: 36px !important;
            height: 36px !important;
          }
          
          /* Ensure carousel doesn't overflow on small screens */
          .position-relative.overflow-hidden {
            overflow: hidden !important;
          }
        }
        
        /* Extra small devices */
        @media (max-width: 400px) {
          .special-offer-card {
            max-width: calc(100vw - 40px) !important;
          }
        }
      `}</style>



      {/* Make Your Own Package Component */}
      < MakeYourOwnPackage />

      {/* Statistics Section */}
      {/* <section className="py-5 bg-light">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-3 col-md-12 mb-4 mb-lg-0">
              <h3 className="fw-bold text-primary">
                Book Lab Tests
                <br />
                <span className="text-dark">With Us</span>
              </h3>
            </div>
            <div className="col-lg-9">
              <div className="row g-4">
                <div className="col-md-3 col-sm-6">
                  <div className="d-flex align-items-center">
                    <img
                      src="/images/icon-svg/ontime-report.svg"
                      alt="On-time report"
                      className="me-3"
                      style={{ width: "48px", height: "48px" }}
                    />
                    <div>
                      <h4 className="fw-bold text-primary mb-1">98%</h4>
                      <p className="small mb-0 text-muted">
                        On-time report
                        <br />
                        delivery
                      </p>
                    </div>
                  </div>
                </div>
                <div className="col-md-3 col-sm-6">
                  <div className="d-flex align-items-center">
                    <img
                      src="/images/icon-svg/timely collection.svg"
                      alt="Timely collection"
                      className="me-3"
                      style={{ width: "48px", height: "48px" }}
                    />
                    <div>
                      <h4 className="fw-bold text-primary mb-1">97%</h4>
                      <p className="small mb-0 text-muted">
                        Timely sample
                        <br />
                        collections
                      </p>
                    </div>
                  </div>
                </div>
                <div className="col-md-3 col-sm-6">
                  <div className="d-flex align-items-center">
                    <img
                      src="/images/icon-svg/review.svg"
                      alt="Customer reviews"
                      className="me-3"
                      style={{ width: "48px", height: "48px" }}
                    />
                    <div>
                      <h4 className="fw-bold text-primary mb-1">99%</h4>
                      <p className="small mb-0 text-muted">
                        Positive customer
                        <br />
                        reviews
                      </p>
                    </div>
                  </div>
                </div>
                <div className="col-md-3 col-sm-6">
                  <div className="d-flex align-items-center">
                    <img
                      src="/images/icon-svg/certify.svg"
                      alt="Certifications"
                      className="me-3"
                      style={{ width: "48px", height: "48px" }}
                    />
                    <div>
                      <h4 className="fw-bold text-primary mb-1 small">
                        Future Lab
                      </h4>
                      <p className="small mb-0 text-muted">
                        Prestigious
                        <br />
                        Certifications
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section> */}

      {/* Ads Carousel */}
      {/* {ads.length > 0 && (
        <section className="py-5">
          <div className="container">
            <h3 className="text-center mb-4 fw-bold">Special Promotions</h3>
            <div className="row g-3">
              {ads.slice(0, 3).map((ad, index) => (
                <div key={index} className="col-lg-4 col-md-6">
                  <div className="card border-0 shadow-sm hover-lift">
                    <img
                      className="card-img-top"
                      src={getImageUrl(ad.imageUrl)}
                      alt={ad.title}
                      style={{ height: "200px", objectFit: "cover" }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )} */}

      {/* Testimonials Slider */}
      <TestimonialsSlider />

      <style jsx>{`
        .hover-lift {
          transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
        }

        .hover-lift:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15) !important;
        }

        .marquee {
          animation: scroll 30s linear infinite;
          white-space: nowrap;
        }

        @keyframes scroll {
          0% {
            transform: translateX(100%);
          }
          100% {
            transform: translateX(-100%);
          }
        }

        .scrolling-carousel .carousel-track {
          animation: scroll-left 20s linear infinite;
        }

        @keyframes scroll-left {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }

        @media (max-width: 768px) {
          .display-4 {
            font-size: 2rem;
          }

          .lead {
            font-size: 1rem;
          }

          .card-body {
            padding: 1.5rem !important;
          }
        }
      `}</style>
    </div >
  );
};

export default Home;

const getImageUrl = (imagePath) => {
  // Handle cases where imagePath might be undefined or null
  if (!imagePath) return "/images/placeholder.png";

  // Use the getImagePath function from config
  return getImagePath(imagePath);
};
