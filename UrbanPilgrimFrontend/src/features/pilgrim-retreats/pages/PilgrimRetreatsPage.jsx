import React from 'react';
import RetreatsShortFormat from '../components/RetreatsShortFormat';
import RetreatsGrid from '../components/RetreatsGrid';
import FadeInSection from '../../home/components/FadeInSection';

const PilgrimRetreatsPage = () => {
  return (
    <div className="bg-gray-50">
      {/* Hero Section */}
      <div className="w-full overflow-hidden relative mb-8">
        <img
          src="/3.webp"
          alt="Pilgrim Retreats Hero"
          className="w-full h-[55vh] sm:h-[65vh] md:h-[600px] object-cover block"
        />
      </div>

      {/* Content Sections */}
      <FadeInSection>
        <RetreatsShortFormat />
      </FadeInSection>

      {/* Grid shown immediately to avoid opacity issues on mobile */}
      <RetreatsGrid />
    </div>
  );
};

export default PilgrimRetreatsPage;
