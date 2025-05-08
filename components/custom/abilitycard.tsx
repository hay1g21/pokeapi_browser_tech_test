import * as React from "react";
import { Card, CardContent, CardHeader } from "../ui/card";

interface AbilityProps {
  abilityName: string;
  abilityDesc: string;
}

/**
 *
 * Renders a single card with the pokemon's ability and description
 *
 */
const AbilityCard = ({ abilityName, abilityDesc }: AbilityProps) => {
  return (
    <Card className="h-full py-9 px-12 gap-3">
      <CardHeader className="text-primary font-semibold text-2xl p-0">
        Ability
      </CardHeader>
      <CardContent className="p-0">
        <h1 className="font-normal text-xl capitalize">{abilityName}</h1>
        <p className="italic text-xl font-light">{abilityDesc}</p>
      </CardContent>
    </Card>
  );
};

export default AbilityCard;
