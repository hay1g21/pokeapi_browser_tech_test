import * as React from "react";

/**
 * Renders header section for homepage
 *
 */
const Hero = () => {
  return (
    <div className="bg-center --font-inter text-center items-center flex min-h-61 justify-center">
      <div>
        <h1 className="font-semibold text-6xl text-primary">Pokémon Browser</h1>
        <h2 className="text-muted-foreground text-3xl">
          Search and find pokemon
        </h2>
      </div>
    </div>
  );
};

export default Hero;
