"use client";

import { Button } from "@/components/ui/button";
import Footer from "@/components/custom/footer";
import Hero from "@/components/custom/hero";
import { Input } from "@/components/ui/input";
import Loading from "@/components/custom/loading";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import Pokecard from "@/components/custom/pokecard";
import { Separator } from "@/components/ui/separator";
import { usePathname, useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useDebouncedCallback } from "use-debounce";

//type for a pokemon name and url to their pokemon description
type Pokemon = {
  name: string;
  url: string;
};

//stores data for searched pokemon
type SearchPokemon = {
  name: string;
  url: string;
  id: string;
};

//stores data for next and prev pagination
type PaginationInfo = {
  next: string;
  prev: string;
};

//stores data for each type related to a pokemon
type PokeTypes = {
  slot: number;
  type: {
    name: string;
    url: string;
  };
};

/**
 * Home Page - the pokemon search homepage
 * Fetches pokemon data from the pokeapi, storing useful data in state and displaying data in rows of cards
 */
export default function Home() {
  //state data for a list of pokemon
  const [pokemonResData, setResData] = useState<Pokemon[]>([]);
  //state data for a queried pokemon
  const [pokemonSearchData, setSearchData] = useState<SearchPokemon>({
    name: "",
    url: "",
    id: "",
  });

  //a 2d array containing a list of types for a list of pokemon
  //[0] --pokemon
  //[][] --specific type from pokemon
  const [typeData, setTypeData] = useState<PokeTypes[][]>([]);

  //state data for a queried pokemon's list of types
  const [searchTypeData, setSearchTypeData] = useState<PokeTypes[]>([]);

  //data to store the urls for next and previous pages, can be null for the end and start of the api's list of pokemon
  const [pagData, setPagData] = useState<PaginationInfo>({
    next: "",
    prev: "",
  });

  //stores the complete string for a search query
  const [searchInputValue, setSearchInput] = useState("");

  //stores the offset of pokemon ids for pagination
  const [offsetData, setOffset] = useState(0);

  //querying
  const searchParams = useSearchParams();
  const query = searchParams.get("query") || "";
  const pathname = usePathname();

  //loading state used to set when data is being fetched from the pokeapi
  const [loadingState, setLoading] = useState(false);

  const { replace } = useRouter();

  const [countData, setCountData] = useState(0);
  //get api data onload, and store in state variable
  useEffect(() => {
    //Get info for pokemon name, and their related info url
    /**
     * Fetches pokemon data from the pokeapi, including a list of all available pokemon
     * fetches a count from the pokemon-species endpoint to find the number of unique pokemon to avoid extra entries in the pokemon list
     * fetches types for each pokemon fetched from the /types/ endpoint
     * pokemon are identified by either id or name in the /pokemon/{id/name} endpoint
     */
    const getPokeData = async () => {
      setLoading(true);
      let count = countData || 0;
      //ensures count fetch is done only once to avoid extra calls
      if (countData === 0) {
        const countLink = "https://pokeapi.co/api/v2/pokemon-species/";
        //find total num of pokemon
        const countResFetch = await fetch(countLink);

        const countRes = await countResFetch.json();

        setCountData(countRes.count);
        count = countRes.count;
      }

      let limit = 12; //limit is number of pokemon displayed per page
      //find pokemon

      //reduces pokemon fetched for last pokemon to avoid empty calls
      if (count - offsetData < 12) {
        limit = count - offsetData;
      }
      //offset query provides offset of pokemon fetched
      const link =
        "https://pokeapi.co/api/v2/pokemon?offset=" +
        offsetData +
        "&limit=" +
        limit;
      try {
        const res = await fetch(link);

        const result = await res.json();
        //result from pokemon gives results of pokemon, pagination data
        setResData(result.results);
        setPagData({
          next: result.next,
          prev: result.previous,
        });

        //find types of pokemon
        let list = [];
        for (let i = 1; i < limit + 1; i++) {
          let ep =
            "https://pokeapi.co/api/v2/pokemon/" + (i + offsetData) + "/";

          const pRes = await fetch(ep);
          const result = await pRes.json();

          var poke: PokeTypes[] = result.types; //types for one pokemon

          list.push(poke); //list of types for each pokemon
        }
        setTypeData(list);
      } catch (err: unknown) {
        if (err instanceof Error) {
          console.log(err);
        }
      } finally {
        setLoading(false);
      }
    };

    /**
     * Fetches a specific pokemon from the pokemon/{name} endpoint
     */
    const getPokeSearchData = async () => {
      setLoading(true);
      const searchLink = "https://pokeapi.co/api/v2/pokemon/" + query;
      try {
        const searchRes = await fetch(searchLink);

        const searchResult = await searchRes.json();
        //result gives results of pokemon, pagination data

        //find types of pokemon
        //add pokepage to the list
        var poke: PokeTypes[] = searchResult.types;

        setSearchData({
          name: searchResult.name,
          url: searchLink,
          id: searchResult.id,
        });
        setSearchTypeData(poke);
      } catch (err: unknown) {
        if (err instanceof Error) {
          console.log(err);
          //if no pokemon, reset search data to empty strings
          setSearchData({
            name: "N/A", //to distinguish between no query and invalid query
            url: "",
            id: "",
          });
          //reset type data
          setSearchTypeData([]);
        }
      } finally {
        setLoading(false);
      }
    };

    //if there is a search, fetch searched pokemon instead
    if (searchParams.get("query") && searchInputValue) {
      //fetch specific pokemon

      getPokeSearchData();
    } else {
      getPokeData();
    }
  }, [offsetData, searchInputValue]);

  /**
   * Function to allow next button to take user to next group of pokemon by adding to offset value
   * If there are no more pokemon or data is loading, disable button
   */
  const onNext = () => {
    pagData.next != null &&
      !loadingState &&
      countData - offsetData > 12 &&
      setOffset(offsetData + 12);
  };
  /**
   * Function to allow next button to take user to next group of pokemon
   * If there are no more pokemon or data is loading, disable button
   */
  const onPrev = () => {
    pagData.prev != null && !loadingState && setOffset(offsetData - 12);
  };

  /**
   * Adds a delay while user inputs search, then updates query in the page URL
   * If the input is empty, the query term is deleted from the URL and search data is reset
   */
  const handleSearch = useDebouncedCallback((term: string) => {
    //make params
    const params = new URLSearchParams(searchParams);
    if (term) {
      params.set("query", term);
    } else {
      params.delete("query");
      setSearchData({
        name: "",
        url: "",
        id: "",
      });
    }
    //updates url with search term
    replace(`${pathname}?${params.toString()}`);
  }, 500);

  /**
   * Updates search input state on button click, signalling a search to the api
   */
  const searchButton = () => {
    const query = searchParams.get("query") || "";
    setSearchInput(query);
  };

  return (
    <div className="flex flex-col gap-y-12">
      <Hero></Hero>

      <Separator></Separator>
      <div className="flex flex-col gap-y-12 mx-auto">
        <div className="flex flex-wrap max-w-290 justify-between">
          <div>
            <h2 className="font-semibold text-3xl flex-3">
              {pokemonSearchData.name
                ? "Search Results for '" +
                  (searchInputValue.charAt(0).toUpperCase() +
                    searchInputValue.slice(1)) +
                  "'"
                : "Explore Pokémon"}
            </h2>
          </div>

          <div className="flex gap-3">
            <Input
              className="max-w-90 max-h-50 text-muted-foreground font-normal"
              type="pokesearch"
              placeholder="Find Pokémon"
              onChange={(e) => {
                handleSearch(e.target.value);
              }}
              defaultValue={searchParams.get("query")?.toString()}
            />
            <Button
              className="flex font-medium text-primary-foreground"
              onClick={searchButton}
            >
              Search
            </Button>
          </div>
        </div>

        {loadingState && <Loading></Loading>}
        {!loadingState &&
          !searchParams.get(query) &&
          typeData.length === pokemonResData.length &&
          typeData[typeData.length - 1] &&
          !pokemonSearchData.name &&
          !(pokemonSearchData.name === "N/A") && (
            <div className="flex flex-wrap max-w-290 mx-auto justify-between gap-y-14 ">
              {pokemonResData.map((pokemon: Pokemon, index: number) => (
                <Pokecard //map data to make group of cards for each unique pokemon
                  key={index}
                  pokeName={pokemon.name}
                  pokeId={(index + 1 + offsetData).toString()}
                  imgSrc={
                    "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/" +
                    (index + 1 + offsetData) +
                    ".png"
                  }
                  typeList={typeData[index].map((t) => t.type.name)}
                  typeIdList={typeData[index].map((t) =>
                    t.type.url.split("/").filter(Boolean).pop()
                  )}
                ></Pokecard>
              ))}
            </div>
          )}

        {!loadingState &&
          searchParams.get("query") &&
          searchTypeData &&
          searchInputValue &&
          pokemonSearchData.name &&
          pokemonSearchData.name != "N/A" && (
            <div className="flex flex-wrap max-w-290 justify-start gap-y-14 min-w-[1160px] ">
              <div className="flex-1">
                <Pokecard
                  pokeName={pokemonSearchData.name}
                  pokeId={pokemonSearchData.id.toString()}
                  imgSrc={
                    "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/" +
                    pokemonSearchData.id +
                    ".png"
                  }
                  typeList={searchTypeData.map((t) => t.type.name)}
                  typeIdList={searchTypeData.map(
                    (t) => t.type.url.split("/").filter(Boolean).pop() //finds type id from type url
                  )}
                ></Pokecard>
              </div>
            </div>
          )}
        {pokemonSearchData.name == "N/A" && (
          <div className="flex flex-wrap max-w-290 justify-start gap-y-14 min-w-[1160px] "></div>
        )}
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                className={
                  !pagData.prev || searchParams.get("query")
                    ? "opacity-50 pointer-events-none bg-primary text-primary-foreground"
                    : "bg-primary text-primary-foreground hover:opacity-50 hover:bg-primary hover:text-primary-foreground"
                }
                href="#"
                onClick={onPrev}
              ></PaginationPrevious>
            </PaginationItem>
            <PaginationItem>
              <PaginationNext
                className={
                  !pagData.next ||
                  countData - offsetData < 12 ||
                  searchParams.get("query")
                    ? "opacity-50 pointer-events-none bg-primary text-primary-foreground"
                    : "bg-primary text-primary-foreground hover:opacity-50 hover:bg-primary hover:text-primary-foreground"
                }
                href="#"
                onClick={onNext}
              ></PaginationNext>
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>

      <Separator></Separator>

      <Footer></Footer>
    </div>
  );
}
