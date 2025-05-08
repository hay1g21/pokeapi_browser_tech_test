import Image from "next/image";
import * as React from "react";

interface PokeBannerProps {
  pokeName: string | null;
  pokeId: string | null;
}

//type for main api call

function calcId(pokeId: string) {
  let displayId = "#";
  let size = 4 - pokeId.length;
  for (let i = 0; i < size; i++) {
    displayId = displayId.concat("0");
  }

  displayId = displayId.concat(pokeId);
  return displayId;
}

/**
 * Renders the top of the pokemon details page, complete with image icon and pokemon name and id
 */
const PokeBanner = ({ pokeName, pokeId }: PokeBannerProps) => {
  return (
    <div className="flex flex-col">
      <div className="col-span-3">
        <div className="pr-16 pl-16 gap-2.5 min-h-20 bg-popover flex items-center ">
          <h3 className="font-semibold text-2xl text-primary align-middle">
            Pokémon Browser
          </h3>
        </div>
      </div>
      <div className=" bg-primary opacity-20 min-h-[168px] "></div>

      <div className="min-w-[243px] self-center flex flex-col items-center justify-center -mt-12">
        <div className="relative w-[208px] h-[208px] mx-auto">
          <Image
            className="relative z-10 w-full h-full object-cover rounded-full"
            alt="pokemon"
            src={
              "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/" +
              pokeId +
              ".png"
            }
            width="100"
            height="100"
            quality={100}
            unoptimized //for best image quality
          ></Image>
          <div className="absolute inset-0 rounded-full bg-secondary z-0 border-4 border-primary-foreground "></div>
        </div>
        <h1 className="font-semibold text-3xl">
          <span className="text-primary capitalize">
            {pokeName ? pokeName : "0"}
          </span>{" "}
          <span className="text-muted-foreground">
            {calcId(pokeId ? pokeId : "0")}
          </span>
        </h1>
      </div>
    </div>
  );
};

export default PokeBanner;
