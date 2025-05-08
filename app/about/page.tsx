"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Footer from "@/components/custom/footer";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";
import { useEffect, useState } from "react";
import PokeBanner from "@/components/custom/pokebanner";
import StatsCard from "@/components/custom/statscard";
import InfoCard from "@/components/custom/infocard";
import TypeCard from "@/components/custom/typecard";
import AbilityCard from "@/components/custom/abilitycard";
import { useRouter, useSearchParams } from "next/navigation";
import Loading from "@/components/custom/loading";

/**
 * Renders the about page, which is navigated to by clicking a pokemon from the homepage
 * Provides further details on a specific pokemon, including primary ability, weaknesses and stats
 *
 */
export default function Page() {
  //find info from url
  const sp = useSearchParams();
  const pokemonName = sp.get("name");
  const pokemonId = sp.get("id");
  const typeIds = sp.get("typeId")?.split(",");

  const router = useRouter();

  type InfoObj = {
    height: number;
    weight: number;
    category: string;
    flavor_text: string;
    abilityName: string;
    abilityDesc: string;
    typeList: string[];
    weaknessList: String[];
    genderRate: number;
    stats: number[];
  };

  const [infoData, setInfoData] = useState<InfoObj>({
    height: 0,
    weight: 0,
    category: "",
    flavor_text: "",
    abilityName: "null",
    abilityDesc: "",
    typeList: [],
    weaknessList: [],
    genderRate: 0,
    stats: [],
  });

  //loading state
  const [loadingState, setLoading] = useState(false);

  useEffect(() => {
    //Get info for pokemon name, and their related info url
    const getPokeData = async () => {
      //use pokemon name for endpoint
      setLoading(true);
      try {
        const res = await fetch(
          "https://pokeapi.co/api/v2/pokemon/" + pokemonName
        );

        const result = await res.json();

        //get the ability desc from the ability endpoint
        const abilityFetch = await fetch(result.abilities[0].ability.url);

        const abilityRes = await abilityFetch.json();

        //get most recent flavor text entry of ability in eu language
        const abilityDesc =
          abilityRes.flavor_text_entries[
            abilityRes.flavor_text_entries.length - 1
          ].flavor_text;

        //fetch pokemon species endpoint to get category info and flavor text

        const speciesFetch = await fetch(
          "https://pokeapi.co/api/v2/pokemon-species/" + pokemonId
        );
        const speciesRes = await speciesFetch.json();
        const genera = speciesRes.genera;

        let speciesCategory = "";
        //find the genera with eu language
        for (const obj of genera) {
          if (obj.language.name === "en") {
            speciesCategory = obj.genus;
          }
        }
        //fetch flavor text for pokemon entry, in species

        const entry_flavor_text = speciesRes.flavor_text_entries;
        let pokemon_entry_text = "N/A";

        //try to get entry from latest generation e.g scarlet & violet
        for (let i = entry_flavor_text.length - 1; i > 0; i--) {
          if (entry_flavor_text[i].language.name === "en") {
            pokemon_entry_text = entry_flavor_text[i].flavor_text;
            break;
          }
        }

        //find gender of pokemon ( gender rate of female in eights, 8- female, 0- male only, inbetween male/female)
        //get the types, make weakness list

        const genRate = speciesRes.gender_rate;

        let weaknessList = new Set<String>();
        let strengthList = new Set<String>();
        let typesList = [];
        if (typeIds) {
          for (var type of typeIds) {
            //get type
            const typeFetch = await fetch(
              "https://pokeapi.co/api/v2/type/" + type
            );
            //find the types the pokemon's type is weak against
            const typeResult = await typeFetch.json();
            typesList.push(typeResult.name);

            const weakTo = typeResult.damage_relations.double_damage_from;
            for (var weakType of weakTo) {
              weaknessList.add(weakType.name);
            }
            //get the types the pokemon is strong against
            const strongAgainst = typeResult.damage_relations.half_damage_from;
            for (var strongType of strongAgainst) {
              strengthList.add(strongType.name);
            }
          }
        }

        const weaknesses = weaknessList.difference(strengthList);

        setInfoData({
          height: result.height,
          weight: result.weight,
          category: speciesCategory,
          flavor_text: pokemon_entry_text,
          abilityName: result.abilities[0].ability.name,
          abilityDesc: abilityDesc,
          typeList: typesList,
          weaknessList: Array.from(weaknesses),
          genderRate: genRate,
          stats: result.stats,
        });
      } catch (err: unknown) {
        if (err instanceof Error) {
          console.log(err);
        }
      } finally {
        setLoading(false);
      }
    };
    getPokeData();
  }, []);

  return (
    <div className="">
      <div className="flex flex-col gap-y-12">
        <PokeBanner pokeName={pokemonName} pokeId={pokemonId}></PokeBanner>

        {loadingState ? (
          <Loading></Loading>
        ) : (
          <div className="px-35 gap-10 flex flex-col max-w-[1440px] content-center mx-auto">
            <div>
              <Card className="bg-accent">
                <CardContent className="pl-12 pr-12 py-3">
                  <div className="flex gap-3 items-center ">
                    <div className="relative w-25 h-25 shrink-0">
                      <Image
                        className="relative z-10 w-full h-full object-cover rounded-full"
                        src="/cherish_ball.png"
                        width={101.73}
                        height={97}
                        alt="Pokeball"
                        quality={100}
                        unoptimized
                      ></Image>
                      <div className="absolute inset-0 rounded-full bg-white z-0 border border-border "></div>
                    </div>
                    <h3 className="text-foreground text-xl font-normal">
                      {infoData.flavor_text}
                    </h3>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="row-start-2">
              <div className="grid grid-cols-3 grid-rows-2 gap-6">
                <div className="row-span-2">
                  <InfoCard
                    pokeHeight={infoData.height}
                    pokeCat={infoData.category}
                    pokeWeight={infoData.weight}
                    pokeGender={infoData.genderRate}
                  ></InfoCard>
                </div>
                <div>
                  <TypeCard
                    types={infoData.typeList}
                    weaknesses={infoData.weaknessList}
                  ></TypeCard>
                </div>
                <div>
                  <AbilityCard
                    abilityName={infoData.abilityName}
                    abilityDesc={infoData.abilityDesc}
                  ></AbilityCard>
                </div>
                <div className="col-span-2 col-start-2">
                  <StatsCard
                    stats={infoData.stats.map(
                      (statsObj) => Object.values(statsObj)[0]
                    )}
                  ></StatsCard>
                </div>
              </div>
            </div>

            <div className="gap-2.5">
              <Button className="font-medium" onClick={() => router.push("/")}>
                {"<-"} Return Home
              </Button>
            </div>
          </div>
        )}

        <Separator></Separator>
        <Footer></Footer>
      </div>
    </div>
  );
}
