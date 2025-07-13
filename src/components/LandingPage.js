import React from 'react';
import ShruggBot from './ShruggBot';
import ShruggPlatform from './ShruggPlatform';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import { ThemeToggle } from './ThemeToggle';

const LandingPage = () => {
  return (
    // Added dark mode classes and new body font
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200 font-body">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-md">
        <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
          {/* Added heading font */}
          <div className="flex items-center text-2xl font-bold font-heading">
            <span>The&nbsp;</span>
            <DotLottieReact
              src="/shrug-animation.lottie"
              loop
              autoplay
              style={{ width: '80px', height: '80px' }}
            />
            <span>&nbsp;Party</span>
          </div>
          {/* Added a container for the link and toggle button */}
          <div className="flex items-center gap-4">
            <a
              href="https://postmeridiempost.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
            >
              About PMP
            </a>
            <ThemeToggle /> {/* Added the theme toggle button */}
          </div>
        </nav>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-12">
        {/* Hero Section */}
        <div className="text-center">
          {/* Added heading font */}
          <h1 className="text-5xl font-extrabold mb-4 font-heading">Welcome, Weary Voter.</h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
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
            // Added dark mode styles to the button
            className="inline-block bg-yellow-400 text-black font-bold py-2 px-4 rounded hover:bg-yellow-300 transition"
          >
            ☕ Sustain the Shrugg
          </a>
        </div>

        {/* Footer */}
        <footer className="text-center pt-12 mt-12 border-t border-gray-200 dark:border-gray-700">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            A deeply cynical project from The Post Meridiem Post.
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
            Powered by{' '}
            <a
              href="https://postmeridiempost.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-blue-600 dark:text-blue-400 hover:underline"
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