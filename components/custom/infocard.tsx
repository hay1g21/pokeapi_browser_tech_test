import * as React from "react";
import { Card, CardContent } from "../ui/card";

//weight is given as an integer, parses into kg unit and formatted string
function calcWeight(weight: number) {
  return "" + weight / 10 + "kg";
}
//height in meters
function calcHeight(height: number) {
  return "" + height / 10 + "m";
}
interface PokeBannerProps {
  pokeHeight: number;
  pokeCat: string;
  pokeWeight: number;
  pokeGender: number;
}

/**
 * Renders a single Pokemon Information Card with relevant info pulled from /pokemon-species{id}/ endpoint
 *
 */
const InfoCard = ({
  pokeHeight,
  pokeCat,
  pokeWeight,
  pokeGender,
}: PokeBannerProps) => {
  return (
    <Card className="h-full py-9 px-12 gap-3">
      <CardContent className="flex flex-col gap-9">
        <div className="flex flex-col gap-3">
          <h3 className="font-semibold text-2xl ">Height</h3>
          <p className="text-xl font-normal">{calcHeight(pokeHeight)}</p>
        </div>

        <div className="flex flex-col gap-3">
          <h3 className="font-semibold text-2xl">Category</h3>
          <p className="text-xl font-normal">{pokeCat}</p>
        </div>
        <div className="flex flex-col gap-3">
          <h3 className="font-semibold text-2xl">Weight</h3>
          <p className="text-xl font-normal">{calcWeight(pokeWeight)}</p>
        </div>
        <div className="flex flex-col gap-3">
          <h3 className="font-semibold text-2xl">Gender</h3>
          <p className="text-xl font-normal">
            {pokeGender === 8
              ? "Female"
              : pokeGender === 0
              ? "Male"
              : "Male / Female"}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default InfoCard;
