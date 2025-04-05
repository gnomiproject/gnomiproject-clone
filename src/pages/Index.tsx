
import React from 'react';
import { Link } from 'react-router-dom';
import Button from '@/components/shared/Button';
import SectionTitle from '@/components/shared/SectionTitle';

const Index = () => {
  return (
    <div className="min-h-screen">
      <section className="py-24 px-6 md:px-12 bg-gradient-to-br from-blue-50 to-white">
        <div className="max-w-6xl mx-auto text-center">
          <SectionTitle 
            title="Welcome to gNomi"
            subtitle="This is a placeholder home page. You mentioned you'll build this separately."
            center
          />
          
          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/about">
              <Button>Learn About Us</Button>
            </Link>
            <Link to="/assessment">
              <Button variant="secondary">Take Assessment</Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
