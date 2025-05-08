import * as React from "react";
import { Card, CardContent } from "../ui/card";
import { Progress } from "../ui/progress";

//List of stats related to the pokemon
interface statProps {
  stats: number[];
}
const StatsCard = ({ stats }: statProps) => {
  //Labels according to each stat in the pokemon stat list
  const entries = [
    "HP",
    "Attack",
    "Defense",
    "Special Attack",
    "Special Defense",
    "Speed",
  ];

  /**
   * Populates a card with stat labels and a progress bar filled relative to the stat's value
   */
  return (
    <Card className="py-9 px-12">
      <CardContent className="p-0">
        <div className="grid grid-cols-3 grid-rows-5 gap-3 text-xl font-semibold text-primary p-0">
          {stats.map((stat: number, index) => (
            <React.Fragment key={index}>
              <div>
                <h4>{entries[index]}</h4>
              </div>
              <div className="col-span-2 flex items-center">
                <Progress
                  className="h-4 bg-secondary"
                  value={(stat / 255) * 100} //stats are from 0-255
                ></Progress>
              </div>
            </React.Fragment>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default StatsCard;
