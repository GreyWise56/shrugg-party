import React from 'react';
import ShruggBot from './ShruggBot';
import ShruggPlatform from './ShruggPlatform';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-gray-100 text-gray-800 font-sans">
      {/* Header */}
      <header className="bg-white shadow-md">
        <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div className="text-2xl font-bold text-gray-800">
            The ¯\_(ツ)_/¯ Party
          </div>
          <div>
            <a
              href="https://postmeridiempost.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-blue-600"
            >
              About PMP
            </a>
          </div>
        </nav>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-12">
        {/* Hero Section */}
        <div className="text-center">
          <h1 className="text-5xl font-extrabold mb-4">Welcome, Weary Voter.</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Tired of the endless political circus? Fed up with choosing between the lesser of two evils? You've found your people.
            The ¯\_(ツ)_/¯ Party is the official home for the politically exhausted. Our platform is simple: we've seen it all,
            we're not impressed, and we'd rather be doing literally anything else.
          </p>
        </div>

        {/* ShruggBot Section */}
        <section className="mt-16 flex justify-center">
          <ShruggBot />
        </section>

        {/* Platform Section */}
        <ShruggPlatform />

        {/* Coffee Support Button */}
        <div className="flex justify-center mt-10">
          <a
            href="https://coff.ee/postmeridiempost"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-yellow-400 text-black font-bold py-2 px-4 rounded hover:bg-yellow-300 transition"
          >
            ☕ Sustain the Shrugg
          </a>
        </div>

        {/* Footer */}
        <footer className="text-center pt-12 mt-12 border-t border-gray-200">
          <p className="text-sm text-gray-500">
            A deeply cynical project from The Post Meridiem Post.
          </p>
          <p className="text-xs text-gray-500 mt-2">
            Powered by{' '}
            <a
              href="https://postmeridiempost.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-blue-600 hover:underline"
            >
              walnut.js
            </a>
          </p>
        </footer>
      </main>
    </div>
  );
};

export default LandingPage;
