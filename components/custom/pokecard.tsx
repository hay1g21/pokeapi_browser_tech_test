"use client";
import * as React from "react";
import { Card, CardContent } from "../ui/card";
import { Badge } from "../ui/badge";
import Image from "next/image";
import { useRouter } from "next/navigation";
interface PokeCardProps {
  pokeName: string;
  pokeId: string;
  imgSrc: string;
  typeList: string[];
  typeIdList: (string | undefined)[];
}

/**
 * Formats id presented as 0000# with number substituting 0s accordingly
 * @param pokeId
 * @returns Formatted id ("0001#")
 */
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
 * Renders a pokemon card, using fetched data to fill out simple pokemon info
 * Displays types as list of badges
 * @returns
 */
const Pokecard = ({
  pokeName,
  pokeId,
  imgSrc,
  typeList,
  typeIdList,
}: PokeCardProps) => {
  const router = useRouter();

  const typeStr = typeIdList.join(",");

  const pushLink =
    "/about?name=" + pokeName + "&id=" + pokeId + "&typeId=" + typeStr;
  return (
    <Card className="w-[266px] ">
      <CardContent className="p-0 content-center">
        <div className="overflow-hidden h-[224px] w-[266px] bg-secondary flex justify-center">
          <Image
            className="cursor-pointer object-top "
            onClick={() => router.push(pushLink)}
            src={imgSrc}
            alt={pokeName}
            width={224}
            height={224}
            quality={100}
            unoptimized //allows best image quality
          />
        </div>
        <div>
          <div className="capitalize p-6 gap-1.5 flex flex-col">
            <h1 className="font-semibold text-2xl text-foreground">
              {pokeName}
            </h1>
            <h3 className="text-muted-foreground font-semibold">
              {calcId(pokeId)}
            </h3>
          </div>

          <div className="pb-6 pl-6 pr-6 pt-1 gap-2 flex">
            {typeList.map((type, index) => (
              <Badge
                className="font-semibold text-primary-foreground capitalize"
                key={index}
              >
                {type}
              </Badge>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default Pokecard;
