import React from 'react';
import Hero from '../components/Hero';
import Stats from '../components/Stats';
import Services from '../components/Services';
import ReviewsSection from '../components/ReviewsSection';

const Home = () => {
  return (
    <>
      <Hero />
      <Stats />
      <Services />
      <ReviewsSection />
    </>
  );
};

export default Home;
