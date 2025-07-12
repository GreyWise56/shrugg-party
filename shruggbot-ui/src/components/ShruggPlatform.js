import React from 'react';

function PlatformCard({ title, text, emoji }) {
  return (
    <div className="bg-white rounded-xl p-6 border shadow-sm hover:shadow-md transition-all">
      <div className="flex items-center gap-3 mb-2">
        <span className="text-2xl">{emoji}</span>
        <h4 className="text-xl font-bold">{title}</h4>
      </div>
      <p className="text-gray-700">{text}</p>
    </div>
  );
}

export default function ShruggPlatform() {
  return (
    <section className="mt-24 px-4 max-w-5xl mx-auto">
      <h2 className="text-4xl font-bold text-center mb-12">Maximum Shrug Energy</h2>

      <div className="space-y-16">
        {/* Mission Statement */}
        <div className="prose prose-lg max-w-3xl mx-auto text-gray-800">
          <p>
  Legacy parties are funded by billionaires and alphabet-soup lobbies. The ¯\_(ツ)_/¯ Party proudly stands alone, unsupported by AIPAC, Blackstone, or any tech founder with a space fetish.
</p>
        </div>

        {/* Policy Grid */}
        <div className="grid md:grid-cols-2 gap-8">
          <PlatformCard title="Universal Maybecare™" emoji="🩺" text="Healthcare that stays in the platform until bribed out. No crypto, just Cheez-Its or billionaire pelts." />
          <PlatformCard title="Student Debt" emoji="🎓" text="Forgive it entirely. Ask Raytheon how we'll pay for it." />
          <PlatformCard title="Climate Change" emoji="🌎" text="Yes, it's real. That alone puts us ahead of Congress." />
          <PlatformCard title="Housing Crisis" emoji="🏠" text="Roofs are good, actually. Stop selling Ohio to BlackRock." />
          <PlatformCard title="Transportation" emoji="🚄" text="Fund trains by liquidating Twitter. Also: rock-paper-scissors to pick the Secretary." />
          <PlatformCard title="Technology & Privacy" emoji="🔒" text="Your data is yours, unless they ask nicely. Algorithms must show dogs, not rage." />
          <PlatformCard title="Agriculture" emoji="🌽" text="Less corn syrup, more apples that aren’t $3. Rename the USDA to 'Grow Normal Veggies'." />
          <PlatformCard title="Labor Rights" emoji="💼" text="Work shouldn’t suck. Four-day weeks + shrug emoji replies to weekend emails." />
        </div>

        {/* Endorsements */}
        <div className="bg-gray-50 p-6 rounded-xl shadow text-center">
          <h3 className="text-2xl font-bold mb-4">Who Endorses Us?</h3>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Clippy (in exile). The ghost of bipartisanship. Your high school civics teacher (now a Reddit mod). The anthropomorphic representation of voter apathy.
          </p>
        </div>

        {/* Campaign Promises */}
        <div className="bg-white p-6 border rounded-xl shadow space-y-4">
          <h3 className="text-2xl font-bold">Campaign Promises We'll Probably Try To Keep</h3>
          <ul className="list-disc list-inside text-gray-700">
            <li>All legislation written in plain English by people who passed 8th grade reading</li>
            <li>Mandatory "I Don’t Know" option in debates</li>
            <li>Dunce caps for politicians who lie</li>
            <li>The State of the Union replaced with a 15-minute "State of the Shrug"</li>
          </ul>
        </div>

        {/* Donations */}
        <div className="text-center border-t pt-8 text-gray-700">
          <h3 className="text-xl font-semibold mb-2">Support Us (Non-Financially)</h3>
          <p>We accept Spotify playlists for the end times, confused pet photos, and interpretive dance videos.</p>
        </div>
      </div>
    </section>
  );
}