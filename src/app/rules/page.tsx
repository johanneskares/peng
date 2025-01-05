export default function Rules() {
  return (
    <main className="flex-grow container mx-auto px-4 py-8">
      <article className="prose mx-auto">
        <h1>Peng Game Rules</h1>

        <p>
          Welcome to Peng, the exciting party game that will keep you on your
          toes! Here are the rules to ensure everyone has a blast:
        </p>

        <h2>Setup</h2>
        <ol>
          <li>Gather a group of 3-10 players.</li>
          <li>Each player needs a smartphone with the Peng app installed.</li>
          <li>
            Choose a game master who will start the game using a valid voucher
            code.
          </li>
        </ol>

        <h2>Gameplay</h2>
        <ol>
          <li>
            At the start of each round, every player is assigned a secret
            target.
          </li>
          <li>
            Your goal is to "peng" (tag) your target without getting "penged"
            yourself.
          </li>
          <li>
            To "peng" someone, you need to:
            <ul>
              <li>Be within 5 feet of your target.</li>
              <li>
                Point your phone at them and press the "Peng" button in the app.
              </li>
            </ul>
          </li>
          <li>
            If you successfully "peng" your target, you inherit their target.
          </li>
          <li>If you get "penged", you're out of the round.</li>
          <li>The last player standing wins the round.</li>
        </ol>

        <h2>Special Rules</h2>
        <ul>
          <li>
            Safe Zones: Designated areas where players cannot be "penged". Use
            these strategically!
          </li>
          <li>
            Power-ups: Occasionally, power-ups will appear in the app. These can
            give you advantages like temporary invincibility or the ability to
            see other players' locations.
          </li>
          <li>
            Time Limit: Each round has a 15-minute time limit. If more than one
            player is still in the game when time runs out, the player who has
            "penged" the most targets wins.
          </li>
        </ul>

        <h2>Winning the Game</h2>
        <p>
          The game consists of 3 rounds. The player with the most round wins is
          crowned the Peng Champion!
        </p>

        <h2>Remember</h2>
        <ul>
          <li>
            Always prioritize safety. No running or dangerous behavior to escape
            being "penged".
          </li>
          <li>Respect other players and their personal space.</li>
          <li>Most importantly, have fun!</li>
        </ul>

        <p>
          Now that you know the rules, gather your friends, find a spacious
          area, and let the Peng games begin! May the best pengor win!
        </p>
      </article>
    </main>
  );
}
