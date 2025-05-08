import * as React from "react";
import { Card, CardContent } from "../ui/card";

import { Badge } from "../ui/badge";

//List of Pokemon's types e.g "Steel","Fire"
//Weaknesses - List of Types Pokemon is weak to
interface TypeCardProps {
  types: string[];
  weaknesses: String[];
}

/**
 * Contains information about the pokemon's types and weaknesses, displayed in a card. Types are populated as badges
 *
 */

const TypeCard = ({ types, weaknesses }: TypeCardProps) => {
  const fields = ["Type", "Weaknesses"];
  return (
    <Card className="flex flex-col h-full py-9 px-12 gap-3">
      <CardContent className="flex flex-col gap-9 p-0">
        {[types, weaknesses].map((field, index) => (
          <div key={index} className="flex flex-col gap-3">
            <h1 className="font-semibold text-2xl">{fields[index]}</h1>
            <div className="flex gap-3 capitalize py-1 flex-wrap">
              {field.map((type, index) => (
                <Badge key={index}>{type}</Badge>
              ))}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default TypeCard;
